/**
 * SMART ELECTRIC - LÓGICA PRINCIPAL DEL COTIZADOR Y HISTORIAL
 */

(function () {
  'use strict';

  // --- CLAVES DE ALMACENAMIENTO ---
  const STORAGE_KEYS = {
    PIN: 'smartelectric_app_pin_v1',
    SESSION: 'smartelectric_session_unlocked',
    BUDGETS: 'smartelectric_budgets_history_v1',
    LAST_NUMBER: 'smartelectric_last_budget_num_v1'
  };

  const DEFAULT_PIN = '0301';

  const DEFAULT_TERMS = 
`• Los precios cotizados corresponden exclusivamente a Mano de Obra técnica especializada.
• No incluye provisión de materiales eléctricos ni artefactos, salvo expresa aclaración en el detalle.
• Forma de pago: 50% de anticipo al inicio de los trabajos y 50% contra entrega de obra conforme y probada.
• Trabajos adicionales no contemplados en este presupuesto se cotizarán por separado según costo de boca/hora CMO vigente.
• Presupuesto válido por el plazo indicado a partir de su emisión.`;

  // --- ESTADO ACTUAL DE LA COTIZACIÓN ---
  let currentBudget = {
    id: null,
    number: '',
    date: new Date().toISOString().split('T')[0],
    validity: 10,
    status: 'Borrador',
    client: {
      name: '',
      phone: '',
      location: 'Rosario',
      address: ''
    },
    items: [],
    discountPercent: 0,
    materialsAmount: 0,
    notes: DEFAULT_TERMS
  };

  // =========================================================================
  // 1. SISTEMA DE SEGURIDAD Y BLOQUEO POR PIN
  // =========================================================================
  function initPinSecurity() {
    const pinOverlay = document.getElementById('pinLockScreen');
    const pinInputs = document.querySelectorAll('.pin-digit');
    const btnUnlock = document.getElementById('btnUnlock');
    const btnLockApp = document.getElementById('btnLockApp');
    const pinErrorMsg = document.getElementById('pinErrorMsg');
    const btnChangePin = document.getElementById('btnChangePin');
    const newPinInput = document.getElementById('newPinInput');

    // Comprobar si ya está desbloqueado en esta sesión
    if (sessionStorage.getItem(STORAGE_KEYS.SESSION) === 'true') {
      pinOverlay.style.display = 'none';
    } else {
      pinOverlay.style.display = 'flex';
      if (pinInputs[0]) pinInputs[0].focus();
    }

    // Navegación automática entre dígitos
    pinInputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < pinInputs.length - 1) {
          pinInputs[index + 1].focus();
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          pinInputs[index - 1].focus();
        }
        if (e.key === 'Enter') {
          attemptUnlock();
        }
      });
    });

    btnUnlock.addEventListener('click', attemptUnlock);

    function attemptUnlock() {
      const enteredPin = Array.from(pinInputs).map(i => i.value).join('');
      const savedPin = localStorage.getItem(STORAGE_KEYS.PIN) || DEFAULT_PIN;

      if (enteredPin === savedPin) {
        sessionStorage.setItem(STORAGE_KEYS.SESSION, 'true');
        pinOverlay.style.display = 'none';
        pinErrorMsg.style.display = 'none';
        showToast('Bienvenido al cotizador de Smart Electric');
      } else {
        pinErrorMsg.style.display = 'block';
        pinInputs.forEach(i => i.value = '');
        if (pinInputs[0]) pinInputs[0].focus();
      }
    }

    // Botón bloquear sesión
    btnLockApp.addEventListener('click', () => {
      sessionStorage.removeItem(STORAGE_KEYS.SESSION);
      pinOverlay.style.display = 'flex';
      pinInputs.forEach(i => i.value = '');
      if (pinInputs[0]) pinInputs[0].focus();
    });

    // Cambiar PIN
    btnChangePin.addEventListener('click', () => {
      const val = newPinInput.value.trim();
      if (/^\d{4}$/.test(val)) {
        localStorage.setItem(STORAGE_KEYS.PIN, val);
        newPinInput.value = '';
        showToast('PIN actualizado con éxito: ' + val);
      } else {
        alert('El PIN debe contener exactamente 4 números dígitos.');
      }
    });
  }

  // =========================================================================
  // 2. NAVEGACIÓN POR PESTAÑAS
  // =========================================================================
  function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');

        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }

        if (targetId === 'tab-history') {
          renderHistoryTable();
        } else if (targetId === 'tab-master') {
          renderMasterCmoTable();
        }
      });
    });
  }

  // =========================================================================
  // 3. UTILIDADES DE FORMATO Y MONEDA
  // =========================================================================
  function formatMoney(amount) {
    const val = Number(amount) || 0;
    return '$ ' + val.toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  function generateNextBudgetNumber() {
    const year = new Date().getFullYear();
    let lastSeq = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_NUMBER) || '0', 10);
    lastSeq += 1;
    localStorage.setItem(STORAGE_KEYS.LAST_NUMBER, lastSeq.toString());
    const seqStr = String(lastSeq).padStart(3, '0');
    return `SE-${year}-${seqStr}`;
  }

  function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚡</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // =========================================================================
  // 4. GESTIÓN DEL FORMULARIO Y TABLA DE ÍTEMS
  // =========================================================================
  function initBudgetForm() {
    // Inicializar valores de fecha y número
    document.getElementById('budgetDate').value = currentBudget.date;
    document.getElementById('budgetValidity').value = currentBudget.validity;
    document.getElementById('budgetNumber').value = generateNextBudgetNumber();
    document.getElementById('budgetNotes').value = DEFAULT_TERMS;

    // Llenar selector de categorías CMO
    populateCmoSelectors();

    // Eventos de cambios en campos de totales
    document.getElementById('discountPercent').addEventListener('input', recalculateTotals);
    document.getElementById('materialsAmount').addEventListener('input', recalculateTotals);

    // Restaurar términos por defecto
    document.getElementById('btnResetTerms').addEventListener('click', () => {
      if (confirm('¿Restablecer las condiciones al texto estándar?')) {
        document.getElementById('budgetNotes').value = DEFAULT_TERMS;
      }
    });

    // Botón agregar ítem del CMO
    document.getElementById('btnAddCmoItem').addEventListener('click', () => {
      const select = document.getElementById('cmoItemSelect');
      const itemId = select.value;
      if (!itemId) {
        alert('Por favor seleccioná una tarea del catálogo.');
        return;
      }

      const catalog = CMOManager.getCatalog();
      const item = catalog.find(i => i.id === itemId);
      if (!item) return;

      addItemToBudget({
        id: 'item-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
        categoria: item.categoria,
        descripcion: item.descripcion,
        cantidad: 1,
        unidad: item.unidad,
        precioUnitario: item.precio,
        subtotal: item.precio
      });

      showToast(`Agregado: ${item.descripcion.substring(0, 30)}...`);
    });

    // Modal Ítem Personalizado
    const customModal = document.getElementById('customItemModal');
    document.getElementById('btnOpenCustomItemModal').addEventListener('click', () => {
      document.getElementById('customItemDesc').value = '';
      document.getElementById('customItemQty').value = '1';
      document.getElementById('customItemPrice').value = '';
      customModal.classList.add('open');
      document.getElementById('customItemDesc').focus();
    });

    document.getElementById('btnConfirmCustomItem').addEventListener('click', () => {
      const desc = document.getElementById('customItemDesc').value.trim();
      const cat = document.getElementById('customItemCategory').value.trim() || 'Varios';
      const qty = parseFloat(document.getElementById('customItemQty').value) || 1;
      const unit = document.getElementById('customItemUnit').value.trim() || 'Global';
      const price = parseFloat(document.getElementById('customItemPrice').value) || 0;

      if (!desc) {
        alert('Por favor ingresá la descripción de la tarea.');
        return;
      }

      addItemToBudget({
        id: 'cust-' + Date.now().toString(36),
        categoria: cat,
        descripcion: desc,
        cantidad: qty,
        unidad: unit,
        precioUnitario: price,
        subtotal: qty * price
      });

      customModal.classList.remove('open');
      showToast('Ítem personalizado agregado.');
    });

    // Botones de acción principales
    document.getElementById('btnSaveBudget').addEventListener('click', saveCurrentBudget);
    document.getElementById('btnNewBudget').addEventListener('click', resetBudgetForm);
    document.getElementById('btnPrintPdf').addEventListener('click', triggerPrintPreview);
    document.getElementById('btnSendWhatsapp').addEventListener('click', shareViaWhatsapp);
  }

  function populateCmoSelectors() {
    const catSelect = document.getElementById('cmoCategoryFilter');
    const itemSelect = document.getElementById('cmoItemSelect');
    const categories = CMOManager.getCategories();
    const catalog = CMOManager.getCatalog();

    // Llenar categorías
    catSelect.innerHTML = '<option value="ALL">Todas las categorías</option>';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      catSelect.appendChild(opt);
    });

    function updateItemOptions() {
      const selectedCat = catSelect.value;
      itemSelect.innerHTML = '<option value="">Seleccione una tarea...</option>';

      const filtered = selectedCat === 'ALL'
        ? catalog
        : catalog.filter(i => i.categoria === selectedCat);

      filtered.forEach(i => {
        const opt = document.createElement('option');
        opt.value = i.id;
        opt.textContent = `${i.descripcion} (${i.unidad}) — ${formatMoney(i.precio)}`;
        itemSelect.appendChild(opt);
      });
    }

    catSelect.addEventListener('change', updateItemOptions);
    updateItemOptions();
  }

  function addItemToBudget(item) {
    currentBudget.items.push(item);
    renderBudgetTable();
    recalculateTotals();
  }

  function renderBudgetTable() {
    const tbody = document.getElementById('budgetItemsBody');
    const emptyMsg = document.getElementById('emptyTableMessage');
    tbody.innerHTML = '';

    if (currentBudget.items.length === 0) {
      emptyMsg.style.display = 'block';
      return;
    }

    emptyMsg.style.display = 'none';

    currentBudget.items.forEach((item, index) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>
          <input type="text" class="inline-input" value="${escapeHtml(item.categoria)}" data-field="categoria" data-index="${index}">
        </td>
        <td>
          <input type="text" class="inline-input" value="${escapeHtml(item.descripcion)}" data-field="descripcion" data-index="${index}" style="font-weight: 500;">
        </td>
        <td style="text-align: center;">
          <input type="number" class="inline-input inline-num" value="${item.cantidad}" min="0.1" step="any" data-field="cantidad" data-index="${index}">
        </td>
        <td>
          <input type="text" class="inline-input" value="${escapeHtml(item.unidad)}" data-field="unidad" data-index="${index}" style="width: 75px;">
        </td>
        <td>
          <input type="number" class="inline-input inline-num" value="${item.precioUnitario}" step="500" data-field="precioUnitario" data-index="${index}">
        </td>
        <td style="text-align: right; font-weight: 700; color: var(--navy);">
          ${formatMoney(item.subtotal)}
        </td>
        <td class="col-actions">
          <button class="btn-icon" data-delete-index="${index}" title="Eliminar ítem">🗑️</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Eventos de edición inline
    tbody.querySelectorAll('.inline-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        const field = e.target.getAttribute('data-field');
        let val = e.target.value;

        if (field === 'cantidad' || field === 'precioUnitario') {
          val = parseFloat(val) || 0;
        }

        currentBudget.items[idx][field] = val;
        currentBudget.items[idx].subtotal = currentBudget.items[idx].cantidad * currentBudget.items[idx].precioUnitario;
        
        renderBudgetTable();
        recalculateTotals();
      });
    });

    // Eventos de eliminación
    tbody.querySelectorAll('[data-delete-index]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-delete-index'), 10);
        currentBudget.items.splice(idx, 1);
        renderBudgetTable();
        recalculateTotals();
      });
    });
  }

  function recalculateTotals() {
    const subtotal = currentBudget.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;
    const discountAmount = Math.round(subtotal * (discountPercent / 100));
    const materialsAmount = parseFloat(document.getElementById('materialsAmount').value) || 0;

    const grandTotal = Math.max(0, (subtotal - discountAmount) + materialsAmount);

    document.getElementById('summarySubtotal').textContent = formatMoney(subtotal);
    document.getElementById('summaryDiscount').textContent = discountPercent > 0 ? `-${formatMoney(discountAmount)} (${discountPercent}%)` : '$ 0';
    document.getElementById('summaryMaterials').textContent = formatMoney(materialsAmount);
    document.getElementById('summaryGrandTotal').textContent = formatMoney(grandTotal);

    currentBudget.discountPercent = discountPercent;
    currentBudget.materialsAmount = materialsAmount;
  }

  function resetBudgetForm() {
    if (currentBudget.items.length > 0 && !confirm('¿Deseás iniciar un nuevo presupuesto y limpiar los datos actuales?')) {
      return;
    }

    currentBudget = {
      id: null,
      number: generateNextBudgetNumber(),
      date: new Date().toISOString().split('T')[0],
      validity: 10,
      status: 'Borrador',
      client: {
        name: '',
        phone: '',
        location: 'Rosario',
        address: ''
      },
      items: [],
      discountPercent: 0,
      materialsAmount: 0,
      notes: DEFAULT_TERMS
    };

    document.getElementById('budgetNumber').value = currentBudget.number;
    document.getElementById('budgetDate').value = currentBudget.date;
    document.getElementById('budgetValidity').value = currentBudget.validity;
    document.getElementById('budgetStatus').value = currentBudget.status;
    document.getElementById('clientName').value = '';
    document.getElementById('clientPhone').value = '';
    document.getElementById('clientLocation').value = 'Rosario';
    document.getElementById('clientAddress').value = '';
    document.getElementById('discountPercent').value = 0;
    document.getElementById('materialsAmount').value = 0;
    document.getElementById('budgetNotes').value = DEFAULT_TERMS;

    renderBudgetTable();
    recalculateTotals();
    showToast('Formulario reiniciado para una nueva cotización.');
  }

  // =========================================================================
  // 5. GUARDAR Y GESTIONAR HISTORIAL
  // =========================================================================
  function getSavedBudgets() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error al leer historial', e);
      return [];
    }
  }

  function saveBudgetsToStorage(budgets) {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
      updateHistoryCounter();
      return true;
    } catch (e) {
      console.error('Error al guardar historial', e);
      return false;
    }
  }

  function saveCurrentBudget() {
    const clientName = document.getElementById('clientName').value.trim();
    if (!clientName) {
      alert('Por favor ingresá el nombre del cliente o empresa.');
      document.getElementById('clientName').focus();
      return;
    }

    if (currentBudget.items.length === 0) {
      alert('Agregá al menos una tarea o ítem a la cotización.');
      return;
    }

    // Actualizar datos del estado
    currentBudget.number = document.getElementById('budgetNumber').value.trim() || generateNextBudgetNumber();
    currentBudget.date = document.getElementById('budgetDate').value;
    currentBudget.validity = parseInt(document.getElementById('budgetValidity').value, 10) || 10;
    currentBudget.status = document.getElementById('budgetStatus').value;
    currentBudget.client = {
      name: clientName,
      phone: document.getElementById('clientPhone').value.trim(),
      location: document.getElementById('clientLocation').value.trim() || 'Rosario',
      address: document.getElementById('clientAddress').value.trim()
    };
    currentBudget.notes = document.getElementById('budgetNotes').value;

    const subtotal = currentBudget.items.reduce((s, i) => s + (i.subtotal || 0), 0);
    const disc = Math.round(subtotal * (currentBudget.discountPercent / 100));
    currentBudget.grandTotal = Math.max(0, (subtotal - disc) + currentBudget.materialsAmount);

    let budgets = getSavedBudgets();

    if (!currentBudget.id) {
      currentBudget.id = 'bud-' + Date.now().toString(36);
      budgets.unshift(currentBudget);
    } else {
      const idx = budgets.findIndex(b => b.id === currentBudget.id);
      if (idx !== -1) {
        budgets[idx] = JSON.parse(JSON.stringify(currentBudget));
      } else {
        budgets.unshift(currentBudget);
      }
    }

    saveBudgetsToStorage(budgets);
    showToast(`Presupuesto ${currentBudget.number} guardado en el historial.`);
  }

  function updateHistoryCounter() {
    const counter = document.getElementById('historyCounter');
    const budgets = getSavedBudgets();
    if (counter) counter.textContent = budgets.length;
  }

  function renderHistoryTable() {
    const tbody = document.getElementById('historyTableBody');
    const emptyMsg = document.getElementById('emptyHistoryMessage');
    const searchText = (document.getElementById('searchHistoryInput').value || '').toLowerCase();
    const filterStatus = document.getElementById('filterStatusSelect').value;

    const budgets = getSavedBudgets();
    tbody.innerHTML = '';

    const filtered = budgets.filter(b => {
      const matchStatus = filterStatus === 'ALL' || b.status === filterStatus;
      const matchText = (b.number || '').toLowerCase().includes(searchText) ||
                        (b.client?.name || '').toLowerCase().includes(searchText) ||
                        (b.client?.address || '').toLowerCase().includes(searchText) ||
                        (b.client?.location || '').toLowerCase().includes(searchText);
      return matchStatus && matchText;
    });

    if (filtered.length === 0) {
      emptyMsg.style.display = 'block';
      return;
    }

    emptyMsg.style.display = 'none';

    filtered.forEach(b => {
      const tr = document.createElement('tr');
      const statusClass = 'status-' + (b.status || 'borrador').toLowerCase();

      tr.innerHTML = `
        <td><strong style="color: var(--navy);">${escapeHtml(b.number)}</strong></td>
        <td>${b.date || '--'}</td>
        <td><strong>${escapeHtml(b.client?.name || 'Sin nombre')}</strong></td>
        <td>${escapeHtml(b.client?.location || '-')}</td>
        <td style="text-align: right; font-weight: 700; color: #0b7038;">
          ${formatMoney(b.grandTotal)}
        </td>
        <td style="text-align: center;">
          <span class="status-pill ${statusClass}">${b.status || 'Borrador'}</span>
        </td>
        <td style="text-align: center;">
          <div style="display: flex; gap: 4px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm" data-load-id="${b.id}" title="Editar / Cargar">✏️</button>
            <button class="btn btn-yellow btn-sm" data-print-id="${b.id}" title="Imprimir / PDF">🖨️</button>
            <button class="btn btn-secondary btn-sm" data-duplicate-id="${b.id}" title="Duplicar">📋</button>
            <button class="btn btn-green btn-sm" data-wa-id="${b.id}" title="Enviar WhatsApp">📲</button>
            <button class="btn-icon" data-del-id="${b.id}" title="Eliminar">🗑️</button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Asignar listeners a botones de la tabla
    tbody.querySelectorAll('[data-load-id]').forEach(btn => {
      btn.addEventListener('click', (e) => loadBudgetToEditor(e.currentTarget.getAttribute('data-load-id')));
    });

    tbody.querySelectorAll('[data-print-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-print-id');
        const b = getSavedBudgets().find(x => x.id === id);
        if (b) {
          fillPrintTemplate(b);
          window.print();
        }
      });
    });

    tbody.querySelectorAll('[data-duplicate-id]').forEach(btn => {
      btn.addEventListener('click', (e) => duplicateBudget(e.currentTarget.getAttribute('data-duplicate-id')));
    });

    tbody.querySelectorAll('[data-wa-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-wa-id');
        const b = getSavedBudgets().find(x => x.id === id);
        if (b) openWhatsappBudget(b);
      });
    });

    tbody.querySelectorAll('[data-del-id]').forEach(btn => {
      btn.addEventListener('click', (e) => deleteBudget(e.currentTarget.getAttribute('data-del-id')));
    });
  }

  function loadBudgetToEditor(id) {
    const budgets = getSavedBudgets();
    const b = budgets.find(x => x.id === id);
    if (!b) return;

    currentBudget = JSON.parse(JSON.stringify(b));

    document.getElementById('budgetNumber').value = currentBudget.number || '';
    document.getElementById('budgetDate').value = currentBudget.date || '';
    document.getElementById('budgetValidity').value = currentBudget.validity || 10;
    document.getElementById('budgetStatus').value = currentBudget.status || 'Borrador';
    document.getElementById('clientName').value = currentBudget.client?.name || '';
    document.getElementById('clientPhone').value = currentBudget.client?.phone || '';
    document.getElementById('clientLocation').value = currentBudget.client?.location || 'Rosario';
    document.getElementById('clientAddress').value = currentBudget.client?.address || '';
    document.getElementById('discountPercent').value = currentBudget.discountPercent || 0;
    document.getElementById('materialsAmount').value = currentBudget.materialsAmount || 0;
    document.getElementById('budgetNotes').value = currentBudget.notes || DEFAULT_TERMS;

    renderBudgetTable();
    recalculateTotals();

    // Cambiar a la pestaña del cotizador
    document.querySelector('[data-tab="tab-editor"]').click();
    showToast(`Presupuesto ${currentBudget.number} cargado en el editor.`);
  }

  function duplicateBudget(id) {
    const budgets = getSavedBudgets();
    const b = budgets.find(x => x.id === id);
    if (!b) return;

    const copy = JSON.parse(JSON.stringify(b));
    copy.id = null;
    copy.number = generateNextBudgetNumber();
    copy.date = new Date().toISOString().split('T')[0];
    copy.status = 'Borrador';

    currentBudget = copy;

    document.getElementById('budgetNumber').value = currentBudget.number;
    document.getElementById('budgetDate').value = currentBudget.date;
    document.getElementById('budgetStatus').value = 'Borrador';
    document.getElementById('clientName').value = currentBudget.client?.name + ' (Copia)';
    document.getElementById('clientPhone').value = currentBudget.client?.phone || '';
    document.getElementById('clientLocation').value = currentBudget.client?.location || 'Rosario';
    document.getElementById('clientAddress').value = currentBudget.client?.address || '';

    renderBudgetTable();
    recalculateTotals();

    document.querySelector('[data-tab="tab-editor"]').click();
    showToast(`Presupuesto duplicado como ${currentBudget.number}.`);
  }

  function deleteBudget(id) {
    if (!confirm('¿Estás seguro de eliminar este presupuesto del historial? Esta acción no se puede deshacer.')) {
      return;
    }
    let budgets = getSavedBudgets();
    budgets = budgets.filter(b => b.id !== id);
    saveBudgetsToStorage(budgets);
    renderHistoryTable();
    showToast('Presupuesto eliminado.');
  }

  // =========================================================================
  // 6. RESPALDO Y RESTAURACIÓN (JSON BACKUP)
  // =========================================================================
  function initBackupControls() {
    const btnExport = document.getElementById('btnExportBackup');
    const btnImport = document.getElementById('btnImportBackup');
    const fileInput = document.getElementById('importBackupInput');

    btnExport.addEventListener('click', () => {
      const data = {
        app: 'SmartElectricCotizador',
        exportDate: new Date().toISOString(),
        budgets: getSavedBudgets(),
        cmoCatalog: CMOManager.getCatalog()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart_electric_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Copia de seguridad descargada.');
    });

    btnImport.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed.budgets)) {
            const current = getSavedBudgets();
            const combined = [...parsed.budgets, ...current];
            // Eliminar duplicados por id
            const unique = Array.from(new Map(combined.map(b => [b.id, b])).values());
            saveBudgetsToStorage(unique);
          }
          if (Array.isArray(parsed.cmoCatalog)) {
            CMOManager.saveCatalog(parsed.cmoCatalog);
          }
          showToast('Copia de seguridad restaurada correctamente.');
          renderHistoryTable();
          populateCmoSelectors();
        } catch (err) {
          alert('El archivo no tiene un formato JSON válido.');
        }
      };
      reader.readAsText(file);
      fileInput.value = '';
    });

    // Filtros de búsqueda en historial
    document.getElementById('searchHistoryInput').addEventListener('input', renderHistoryTable);
    document.getElementById('filterStatusSelect').addEventListener('change', renderHistoryTable);
  }

  // =========================================================================
  // 7. GESTIÓN DEL CATÁLOGO MAESTRO (CMO)
  // =========================================================================
  function initMasterCmoPanel() {
    const filterCat = document.getElementById('filterMasterCategory');
    const searchInput = document.getElementById('searchMasterCmo');
    const btnApplyInflation = document.getElementById('btnApplyInflation');
    const btnReset = document.getElementById('btnResetMasterCmo');

    btnApplyInflation.addEventListener('click', () => {
      const percent = parseFloat(document.getElementById('inflationPercent').value);
      if (isNaN(percent) || percent === 0) {
        alert('Ingresá un porcentaje de ajuste válido (ej: 10 o 15).');
        return;
      }

      if (confirm(`¿Aplicar un ajuste de +${percent}% a TODOS los precios base del catálogo?`)) {
        CMOManager.adjustAllPercentages(percent);
        renderMasterCmoTable();
        populateCmoSelectors();
        showToast(`Se aplicó +${percent}% de ajuste al catálogo.`);
      }
    });

    btnReset.addEventListener('click', () => {
      if (confirm('¿Restablecer el catálogo completo a los valores iniciales de Electroinstalador?')) {
        CMOManager.resetToDefault();
        renderMasterCmoTable();
        populateCmoSelectors();
        showToast('Catálogo restablecido de fábrica.');
      }
    });

    filterCat.addEventListener('change', renderMasterCmoTable);
    searchInput.addEventListener('input', renderMasterCmoTable);

    // Modal nuevo ítem maestro
    const masterModal = document.getElementById('masterItemModal');
    document.getElementById('btnOpenNewMasterItemModal').addEventListener('click', () => {
      document.getElementById('masterNewDesc').value = '';
      document.getElementById('masterNewPrice').value = '';
      masterModal.classList.add('open');
    });

    document.getElementById('btnConfirmMasterItem').addEventListener('click', () => {
      const cat = document.getElementById('masterNewCategory').value.trim() || 'Varios';
      const desc = document.getElementById('masterNewDesc').value.trim();
      const unit = document.getElementById('masterNewUnit').value.trim() || 'Unidad';
      const price = parseFloat(document.getElementById('masterNewPrice').value) || 0;

      if (!desc) {
        alert('Ingresá la descripción de la tarea.');
        return;
      }

      CMOManager.addItem({ categoria: cat, descripcion: desc, unidad: unit, precio: price });
      masterModal.classList.remove('open');
      renderMasterCmoTable();
      populateCmoSelectors();
      showToast('Ítem agregado al catálogo maestro.');
    });
  }

  function renderMasterCmoTable() {
    const tbody = document.getElementById('masterCmoTableBody');
    const filterCat = document.getElementById('filterMasterCategory');
    const searchText = (document.getElementById('searchMasterCmo').value || '').toLowerCase();
    const selectedCat = filterCat.value;

    const catalog = CMOManager.getCatalog();
    const categories = CMOManager.getCategories();

    // Actualizar select de categorías
    if (filterCat.options.length <= 1) {
      filterCat.innerHTML = '<option value="ALL">Todas las categorías</option>';
      categories.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        filterCat.appendChild(opt);
      });
      filterCat.value = selectedCat || 'ALL';
    }

    const filtered = catalog.filter(i => {
      const matchCat = selectedCat === 'ALL' || i.categoria === selectedCat;
      const matchText = (i.descripcion || '').toLowerCase().includes(searchText) ||
                        (i.categoria || '').toLowerCase().includes(searchText);
      return matchCat && matchText;
    });

    tbody.innerHTML = '';

    filtered.forEach(item => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td><span style="font-size: 0.8rem; font-weight: 700; color: var(--navy);">${escapeHtml(item.categoria)}</span></td>
        <td><strong>${escapeHtml(item.descripcion)}</strong></td>
        <td><span style="font-size: 0.82rem; color: var(--ink-light);">${escapeHtml(item.unidad)}</span></td>
        <td style="text-align: right;">
          <input type="number" class="inline-input inline-num master-price-input" value="${item.precio}" step="500" data-item-id="${item.id}" style="width: 140px;">
        </td>
        <td class="col-actions">
          <button class="btn-icon" data-del-master-id="${item.id}" title="Eliminar del catálogo">🗑️</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Listener para actualización de precio en línea
    tbody.querySelectorAll('.master-price-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-item-id');
        const newPrice = parseFloat(e.target.value) || 0;
        CMOManager.updateItem(id, { precio: newPrice });
        populateCmoSelectors();
        showToast('Precio base actualizado.');
      });
    });

    // Listener para eliminar ítem maestro
    tbody.querySelectorAll('[data-del-master-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-del-master-id');
        if (confirm('¿Eliminar este ítem del catálogo maestro?')) {
          CMOManager.deleteItem(id);
          renderMasterCmoTable();
          populateCmoSelectors();
          showToast('Ítem eliminado del catálogo.');
        }
      });
    });
  }

  // =========================================================================
  // 8. GENERACIÓN DE FORMATO IMPRIMIBLE (PDF HOJA A4)
  // =========================================================================
  function fillPrintTemplate(budget) {
    document.getElementById('printNumber').textContent = budget.number || '#SE-000';
    document.getElementById('printDate').textContent = formatDateDisplay(budget.date);
    document.getElementById('printValidity').textContent = (budget.validity || 10) + ' días corridos';

    document.getElementById('printClientName').textContent = budget.client?.name || 'Cliente';
    document.getElementById('printClientPhone').textContent = budget.client?.phone || 'No especificado';
    document.getElementById('printClientLocation').textContent = budget.client?.location || 'Rosario';
    document.getElementById('printClientAddress').textContent = budget.client?.address || 'A convenir';

    const tbody = document.getElementById('printItemsTableBody');
    tbody.innerHTML = '';

    (budget.items || []).forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <strong>${escapeHtml(item.descripcion)}</strong>
          <div style="font-size: 8pt; color: #666;">${escapeHtml(item.categoria || '')}</div>
        </td>
        <td style="text-align: center;">${item.cantidad}</td>
        <td style="text-align: center;">${escapeHtml(item.unidad)}</td>
        <td style="text-align: right;">${formatMoney(item.precioUnitario)}</td>
        <td style="text-align: right; font-weight: 700;">${formatMoney(item.subtotal)}</td>
      `;
      tbody.appendChild(tr);
    });

    const subtotal = (budget.items || []).reduce((s, i) => s + (i.subtotal || 0), 0);
    const discPercent = budget.discountPercent || 0;
    const discAmount = Math.round(subtotal * (discPercent / 100));
    const matAmount = budget.materialsAmount || 0;
    const grandTotal = Math.max(0, (subtotal - discAmount) + matAmount);

    document.getElementById('printSubtotal').textContent = formatMoney(subtotal);

    const rowDisc = document.getElementById('printRowDiscount');
    if (discPercent > 0) {
      rowDisc.style.display = 'table-row';
      document.getElementById('printDiscount').textContent = `-${formatMoney(discAmount)} (${discPercent}%)`;
    } else {
      rowDisc.style.display = 'none';
    }

    const rowMat = document.getElementById('printRowMaterials');
    if (matAmount > 0) {
      rowMat.style.display = 'table-row';
      document.getElementById('printMaterials').textContent = formatMoney(matAmount);
    } else {
      rowMat.style.display = 'none';
    }

    document.getElementById('printGrandTotal').textContent = formatMoney(grandTotal);
    document.getElementById('printTermsText').textContent = budget.notes || DEFAULT_TERMS;
  }

  function triggerPrintPreview() {
    if (currentBudget.items.length === 0) {
      alert('Agregá al menos un ítem al presupuesto para generar la vista imprimible.');
      return;
    }

    // Actualizar datos del estado antes de imprimir
    currentBudget.number = document.getElementById('budgetNumber').value.trim();
    currentBudget.date = document.getElementById('budgetDate').value;
    currentBudget.validity = parseInt(document.getElementById('budgetValidity').value, 10) || 10;
    currentBudget.client = {
      name: document.getElementById('clientName').value.trim() || 'Cliente',
      phone: document.getElementById('clientPhone').value.trim(),
      location: document.getElementById('clientLocation').value.trim() || 'Rosario',
      address: document.getElementById('clientAddress').value.trim()
    };
    currentBudget.notes = document.getElementById('budgetNotes').value;

    fillPrintTemplate(currentBudget);
    window.print();
  }

  // =========================================================================
  // 9. COMPARTIR POR WHATSAPP
  // =========================================================================
  function shareViaWhatsapp() {
    if (currentBudget.items.length === 0) {
      alert('El presupuesto debe tener ítems para poder compartirlo.');
      return;
    }

    // Asegurar que el estado esté sincronizado
    currentBudget.number = document.getElementById('budgetNumber').value.trim() || generateNextBudgetNumber();
    currentBudget.client = {
      name: document.getElementById('clientName').value.trim() || 'Estimado/a',
      phone: document.getElementById('clientPhone').value.trim(),
      location: document.getElementById('clientLocation').value.trim() || 'Rosario',
      address: document.getElementById('clientAddress').value.trim()
    };

    openWhatsappBudget(currentBudget);
  }

  function openWhatsappBudget(b) {
    const subtotal = (b.items || []).reduce((s, i) => s + (i.subtotal || 0), 0);
    const discPercent = b.discountPercent || 0;
    const discAmount = Math.round(subtotal * (discPercent / 100));
    const matAmount = b.materialsAmount || 0;
    const grandTotal = Math.max(0, (subtotal - discAmount) + matAmount);

    let msg = `⚡ *SMART ELECTRIC — PRESUPUESTO PROFESIONAL*\n`;
    msg += `📄 *Presupuesto:* ${b.number}\n`;
    msg += `👤 *Cliente:* ${b.client?.name || 'Cliente'}\n`;
    if (b.client?.address) {
      msg += `📍 *Ubicación:* ${b.client.address} (${b.client.location || 'Rosario'})\n`;
    }
    msg += `📅 *Fecha:* ${formatDateDisplay(b.date)} · *Validez:* ${b.validity || 10} días\n\n`;

    msg += `🔧 *DETALLE DE TRABAJOS Y MANO DE OBRA:*\n`;
    b.items.forEach((item, i) => {
      msg += `${i + 1}. ${item.descripcion} (${item.cantidad} ${item.unidad}) → ${formatMoney(item.subtotal)}\n`;
    });

    msg += `\n`;
    if (matAmount > 0) {
      msg += `📦 *Materiales / Adicionales:* ${formatMoney(matAmount)}\n`;
    }
    if (discPercent > 0) {
      msg += `🏷️ *Descuento aplicado:* -${formatMoney(discAmount)} (${discPercent}%)\n`;
    }
    msg += `💰 *TOTAL ESTIMADO:* ${formatMoney(grandTotal)}\n\n`;

    msg += `📝 *Condiciones:* Mano de obra garantizada según normativa AEA. Pago: 50% anticipo / 50% fin de obra.\n\n`;
    msg += `Quedo a tu entera disposición ante cualquier duda o para coordinar fecha de inicio.\n`;
    msg += `*Smart Electric* · +54 341 621-9609`;

    let phone = (b.client?.phone || '').replace(/\D/g, '');
    if (phone.length === 10) {
      phone = '549' + phone; // Prefijo móvil Argentina
    } else if (phone.length > 0 && !phone.startsWith('54')) {
      phone = '54' + phone;
    }

    const waUrl = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }

  // =========================================================================
  // UTILIDADES GENERALES
  // =========================================================================
  function formatDateDisplay(isoDateStr) {
    if (!isoDateStr) return '--/--/----';
    const parts = isoDateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return isoDateStr;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // INICIALIZACIÓN
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initPinSecurity();
    initTabs();
    initBudgetForm();
    initBackupControls();
    initMasterCmoPanel();
    updateHistoryCounter();
  });

})();

