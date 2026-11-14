/**
 * Cloudflare Pages Function - API de Presupuesto Individual (Obtener Completo y Eliminar)
 * Ruta: /api/budgets/:id
 */

export async function onRequestGet({ env, params }) {
  if (!env.DB) {
    return new Response(JSON.stringify({ 
      error: "Base de datos D1 no vinculada. Verifique el binding 'DB' en Cloudflare Pages Settings." 
    }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }

  const budgetId = params.id;

  try {
    // 1. Obtener datos principales
    const budgetRow = await env.DB.prepare(
      "SELECT * FROM budgets WHERE id = ?"
    ).bind(budgetId).first();

    if (!budgetRow) {
      return new Response(JSON.stringify({ error: "Presupuesto no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Obtener ítems de mano de obra
    const { results: itemRows } = await env.DB.prepare(
      "SELECT * FROM budget_items WHERE budget_id = ?"
    ).bind(budgetId).all();

    // 3. Obtener fotos y diagnósticos
    const { results: diagRows } = await env.DB.prepare(
      "SELECT * FROM budget_diagnostics WHERE budget_id = ?"
    ).bind(budgetId).all();

    const fullBudget = {
      id: budgetRow.id,
      number: budgetRow.number,
      date: budgetRow.date,
      validity: budgetRow.validity,
      status: budgetRow.status,
      client: {
        name: budgetRow.client_name,
        phone: budgetRow.client_phone,
        location: budgetRow.client_location,
        address: budgetRow.client_address
      },
      discountPercent: budgetRow.discount_percent,
      materialsAmount: budgetRow.materials_amount,
      grandTotal: budgetRow.grand_total,
      notes: budgetRow.notes,
      items: (itemRows || []).map(i => ({
        id: i.id,
        categoria: i.categoria,
        descripcion: i.descripcion,
        cantidad: i.cantidad,
        unidad: i.unidad,
        precioUnitario: i.precio_unitario,
        subtotal: i.subtotal
      })),
      diagnostics: (diagRows || []).map(d => ({
        id: d.id,
        title: d.title,
        criticidad: d.criticidad,
        description: d.description,
        imageDataUrl: d.image_data
      }))
    };

    return new Response(JSON.stringify(fullBudget), {
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

export async function onRequestDelete({ env, params }) {
  if (!env.DB) {
    return new Response(JSON.stringify({ 
      error: "Base de datos D1 no vinculada. Verifique el binding 'DB' en Cloudflare Pages Settings." 
    }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }

  const budgetId = params.id;

  try {
    await env.DB.batch([
      env.DB.prepare("DELETE FROM budget_items WHERE budget_id = ?").bind(budgetId),
      env.DB.prepare("DELETE FROM budget_diagnostics WHERE budget_id = ?").bind(budgetId),
      env.DB.prepare("DELETE FROM budgets WHERE id = ?").bind(budgetId)
    ]);

    return new Response(JSON.stringify({ success: true, id: budgetId }), {
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

