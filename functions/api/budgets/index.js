/**
 * Cloudflare Pages Function - API de Presupuestos (Listar y Guardar)
 * Ruta: /api/budgets
 * Requiere: Authorization: Bearer <token> en todos los métodos.
 */

import { validateSession, unauthorizedResponse, dbNotBoundResponse } from '../../_shared/auth.js';

export async function onRequestGet({ env, request }) {
  if (!env.DB) return dbNotBoundResponse();

  const valid = await validateSession(env, request);
  if (!valid) return unauthorizedResponse();

  try {
    const query = `
      SELECT 
        b.id,
        b.number,
        b.date,
        b.validity,
        b.status,
        b.client_name,
        b.client_phone,
        b.client_location,
        b.client_address,
        b.discount_percent,
        b.materials_amount,
        b.grand_total,
        b.notes,
        b.created_at,
        (SELECT COUNT(*) FROM budget_diagnostics d WHERE d.budget_id = b.id) AS diagnostics_count
      FROM budgets b
      ORDER BY b.date DESC, b.created_at DESC;
    `;

    const { results } = await env.DB.prepare(query).all();

    const budgets = (results || []).map(row => ({
      id: row.id,
      number: row.number,
      date: row.date,
      validity: row.validity,
      status: row.status,
      client: {
        name: row.client_name,
        phone: row.client_phone,
        location: row.client_location,
        address: row.client_address
      },
      discountPercent: row.discount_percent,
      materialsAmount: row.materials_amount,
      grandTotal: row.grand_total,
      notes: row.notes,
      diagnosticsCount: row.diagnostics_count,
      createdAt: row.created_at
    }));

    return new Response(JSON.stringify(budgets), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return dbNotBoundResponse();

  const valid = await validateSession(env, request);
  if (!valid) return unauthorizedResponse();

  try {
    const budget = await request.json();

    if (!budget.id || !budget.number) {
      return new Response(JSON.stringify({ error: "Datos de presupuesto incompletos (id o número ausente)." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const statements = [];

    // 1. Upsert en tabla principal de presupuestos
    statements.push(
      env.DB.prepare(`
        INSERT INTO budgets (
          id, number, date, validity, status,
          client_name, client_phone, client_location, client_address,
          discount_percent, materials_amount, grand_total, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          number = excluded.number,
          date = excluded.date,
          validity = excluded.validity,
          status = excluded.status,
          client_name = excluded.client_name,
          client_phone = excluded.client_phone,
          client_location = excluded.client_location,
          client_address = excluded.client_address,
          discount_percent = excluded.discount_percent,
          materials_amount = excluded.materials_amount,
          grand_total = excluded.grand_total,
          notes = excluded.notes;
      `).bind(
        budget.id,
        budget.number,
        budget.date || new Date().toISOString().split('T')[0],
        budget.validity || 10,
        budget.status || 'Borrador',
        budget.client?.name || '',
        budget.client?.phone || '',
        budget.client?.location || 'Rosario',
        budget.client?.address || '',
        budget.discountPercent || 0,
        budget.materialsAmount || 0,
        budget.grandTotal || 0,
        budget.notes || ''
      )
    );

    // 2. Limpiar registros previos de ítems y diagnósticos para evitar inconsistencias
    statements.push(
      env.DB.prepare("DELETE FROM budget_items WHERE budget_id = ?").bind(budget.id)
    );
    statements.push(
      env.DB.prepare("DELETE FROM budget_diagnostics WHERE budget_id = ?").bind(budget.id)
    );

    // 3. Insertar nuevos ítems de mano de obra.
    // Los registros anteriores ya se eliminaron; siempre generar IDs nuevos evita
    // colisiones de claves primarias en copias creadas antes de esta corrección.
    if (Array.isArray(budget.items)) {
      for (const item of budget.items) {
        statements.push(
          env.DB.prepare(`
            INSERT INTO budget_items (
              id, budget_id, categoria, descripcion, cantidad, unidad, precio_unitario, subtotal
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            `item-${crypto.randomUUID()}`,
            budget.id,
            item.categoria || '',
            item.descripcion || '',
            item.cantidad || 1,
            item.unidad || 'Unidad',
            item.precioUnitario || 0,
            item.subtotal || 0
          )
        );
      }
    }

    // 4. Insertar diagnósticos y fotos en base64 con IDs nuevos por cada guardado.
    if (Array.isArray(budget.diagnostics)) {
      for (const diag of budget.diagnostics) {
        statements.push(
          env.DB.prepare(`
            INSERT INTO budget_diagnostics (
              id, budget_id, title, criticidad, description, image_data
            ) VALUES (?, ?, ?, ?, ?, ?)
          `).bind(
            `diag-${crypto.randomUUID()}`,
            budget.id,
            diag.title || '',
            diag.criticidad || '',
            diag.description || '',
            diag.imageDataUrl || ''
          )
        );
      }
    }

    // Ejecutar todo atómicamente en una sola transacción D1
    await env.DB.batch(statements);

    return new Response(JSON.stringify({ success: true, id: budget.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

