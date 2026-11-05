/**
 * Smart Electric - Base de Datos CMO (Costos de Mano de Obra)
 * Basado en las referencias de Electroinstalador y valores de mercado vigentes.
 * Cada ítem cuenta con id, categoría, descripción, unidad y precio base en ARS.
 */

const DEFAULT_CMO_ITEMS = [
  // --- 1. ACOMETIDAS Y PILARES ---
  {
    id: "aco-01",
    categoria: "Acometidas y Pilares",
    descripcion: "Armado y montaje de pilar monofásico completo reglamentario (gabinete, caño de bajada, pipeta, térmica pilar y puesta a tierra)",
    unidad: "Global",
    precio: 220000
  },
  {
    id: "aco-02",
    categoria: "Acometidas y Pilares",
    descripcion: "Armado y montaje de pilar trifásico completo reglamentario (gabinete trifásico, caño de bajada, seccionamiento y PAT)",
    unidad: "Global",
    precio: 340000
  },
  {
    id: "aco-03",
    categoria: "Acometidas y Pilares",
    descripcion: "Adecuación de acometida existente a normativa de distribuidora (reemplazo caño, pipeta o caja de medidor)",
    unidad: "Global",
    precio: 140000
  },
  {
    id: "aco-04",
    categoria: "Acometidas y Pilares",
    descripcion: "Hincado de jabalina de puesta a tierra con caja de inspección y prensa-cable en pilar",
    unidad: "Unidad",
    precio: 65000
  },

  // --- 2. TABLEROS ELÉCTRICOS Y PROTECCIONES ---
  {
    id: "tab-01",
    categoria: "Tableros Eléctricos",
    descripcion: "Armado y montaje de tablero principal / seccional chico (hasta 8 módulos DIN)",
    unidad: "Unidad",
    precio: 95000
  },
  {
    id: "tab-02",
    categoria: "Tableros Eléctricos",
    descripcion: "Armado y montaje de tablero seccional mediano (9 a 18 módulos DIN)",
    unidad: "Unidad",
    precio: 155000
  },
  {
    id: "tab-03",
    categoria: "Tableros Eléctricos",
    descripcion: "Armado y montaje de tablero seccional grande (19 a 36 módulos DIN)",
    unidad: "Unidad",
    precio: 240000
  },
  {
    id: "tab-04",
    categoria: "Tableros Eléctricos",
    descripcion: "Colocación / reemplazo de interruptor termomagnético bipolar (térmica) en tablero existente",
    unidad: "Unidad",
    precio: 26000
  },
  {
    id: "tab-05",
    categoria: "Tableros Eléctricos",
    descripcion: "Colocación / reemplazo de interruptor termomagnético tetrapolar (térmica trifásica)",
    unidad: "Unidad",
    precio: 42000
  },
  {
    id: "tab-06",
    categoria: "Tableros Eléctricos",
    descripcion: "Instalación de interruptor diferencial bipolar (disyuntor 30mA)",
    unidad: "Unidad",
    precio: 32000
  },
  {
    id: "tab-07",
    categoria: "Tableros Eléctricos",
    descripcion: "Instalación de interruptor diferencial tetrapolar (disyuntor 30mA trifásico)",
    unidad: "Unidad",
    precio: 48000
  },
  {
    id: "tab-08",
    categoria: "Tableros Eléctricos",
    descripcion: "Instalación de protector integral digital de alta y baja tensión (monofásico hasta 40A / 63A)",
    unidad: "Unidad",
    precio: 45000
  },
  {
    id: "tab-09",
    categoria: "Tableros Eléctricos",
    descripcion: "Instalación de protector de tensión trifásico con relé de asimetría y contactor",
    unidad: "Unidad",
    precio: 110000
  },
  {
    id: "tab-10",
    categoria: "Tableros Eléctricos",
    descripcion: "Modernización, peinado y normalización de tablero caótico existente (reordenamiento y bornes)",
    unidad: "Global",
    precio: 85000
  },
  {
    id: "tab-11",
    categoria: "Tableros Eléctricos",
    descripcion: "Instalación de contactor electromagnético o relé horario / reloj temporizador en riel DIN",
    unidad: "Unidad",
    precio: 38000
  },

  // --- 3. CANALIZACIONES Y CAÑERÍAS ---
  {
    id: "can-01",
    categoria: "Canalizaciones",
    descripcion: "Canalización con caño corrugado embutido en pared de ladrillo hueco (caladura, amurado y fijación)",
    unidad: "Metro",
    precio: 14000
  },
  {
    id: "can-02",
    categoria: "Canalizaciones",
    descripcion: "Canalización con caño corrugado embutido en pared de ladrillo común / hormigón",
    unidad: "Metro",
    precio: 19000
  },
  {
    id: "can-03",
    categoria: "Canalizaciones",
    descripcion: "Tendido de cañería en losa hormigonada / cielorraso suspendido",
    unidad: "Metro",
    precio: 16000
  },
  {
    id: "can-04",
    categoria: "Canalizaciones",
    descripcion: "Instalación de cañería a la vista con caño rígido de PVC semipesado o metálico con cajas exteriores",
    unidad: "Metro",
    precio: 18500
  },
  {
    id: "can-05",
    categoria: "Canalizaciones",
    descripcion: "Montaje de canaleta plástica / cablecanal con adhesivo y fijaciones mecánicas",
    unidad: "Metro",
    precio: 11000
  },
  {
    id: "can-06",
    categoria: "Canalizaciones",
    descripcion: "Zanjeo en tierra blanda para cable subterráneo (40cm prof., incluye tendido, arena y ladrillo de protección)",
    unidad: "Metro",
    precio: 22000
  },

  // --- 4. CABLEADO Y CIRCUITOS ---
  {
    id: "cab-01",
    categoria: "Cableado y Circuitos",
    descripcion: "Cableado de circuito nuevo por boca (fase, neutro y tierra en cañería limpia)",
    unidad: "Boca",
    precio: 24000
  },
  {
    id: "cab-02",
    categoria: "Cableado y Circuitos",
    descripcion: "Recableado de circuito existente retirando conductores viejos y pasando nuevos con tierra",
    unidad: "Boca",
    precio: 36000
  },
  {
    id: "cab-03",
    categoria: "Cableado y Circuitos",
    descripcion: "Tendido de alimentador monofásico desde medidor a tablero (hasta 6mm²)",
    unidad: "Metro",
    precio: 6500
  },
  {
    id: "cab-04",
    categoria: "Cableado y Circuitos",
    descripcion: "Tendido de alimentador trifásico desde medidor a tablero (hasta 10mm²)",
    unidad: "Metro",
    precio: 9500
  },
  {
    id: "cab-05",
    categoria: "Cableado y Circuitos",
    descripcion: "Tendido de cable subterráneo (Sintenax / Subterráneo 1kV)",
    unidad: "Metro",
    precio: 8000
  },
  {
    id: "cab-06",
    categoria: "Cableado y Circuitos",
    descripcion: "Instalación de circuito exclusivo para Aire Acondicionado (TUE) con canalización vista y toma 20A (hasta 10m)",
    unidad: "Global",
    precio: 85000
  },

  // --- 5. BOCAS, TOMAS Y LLAVES ---
  {
    id: "boc-01",
    categoria: "Bocas, Tomas y Llaves",
    descripcion: "Colocación y conexión de bastidor, tapa y módulo de tomacorriente simple o doble",
    unidad: "Unidad",
    precio: 9500
  },
  {
    id: "boc-02",
    categoria: "Bocas, Tomas y Llaves",
    descripcion: "Colocación y conexión de llave de 1 o 2 puntos (encendido simple)",
    unidad: "Unidad",
    precio: 9500
  },
  {
    id: "boc-03",
    categoria: "Bocas, Tomas y Llaves",
    descripcion: "Instalación de circuito de combinación (llaves combinadas de 3 o 4 vías) con conexionado",
    unidad: "Unidad",
    precio: 16000
  },
  {
    id: "boc-04",
    categoria: "Bocas, Tomas y Llaves",
    descripcion: "Instalación de toma especial reforzado 20A para termotanque eléctrico, anafe o vitrocerámica",
    unidad: "Unidad",
    precio: 18000
  },
  {
    id: "boc-05",
    categoria: "Bocas, Tomas y Llaves",
    descripcion: "Colocación de caja de paso o derivación estanca IP65 en intemperie",
    unidad: "Unidad",
    precio: 19000
  },

  // --- 6. ILUMINACIÓN Y ARTEFACTOS ---
  {
    id: "ilu-01",
    categoria: "Iluminación y Artefactos",
    descripcion: "Armado y colocación de plafón LED de techo (aplicar o embutir)",
    unidad: "Unidad",
    precio: 19500
  },
  {
    id: "ilu-02",
    categoria: "Iluminación y Artefactos",
    descripcion: "Instalación de panel LED 60x60 en cielorraso desmontable o suspendido",
    unidad: "Unidad",
    precio: 29000
  },
  {
    id: "ilu-03",
    categoria: "Iluminación y Artefactos",
    descripcion: "Armado y colocación de luminaria colgante / araña estándar (hasta 3 luces)",
    unidad: "Unidad",
    precio: 28000
  },
  {
    id: "ilu-04",
    categoria: "Iluminación y Artefactos",
    descripcion: "Armado y colocación de luminaria colgante compleja / araña pesada o gran altura",
    unidad: "Unidad",
    precio: 48000
  },
  {
    id: "ilu-05",
    categoria: "Iluminación y Artefactos",
    descripcion: "Montaje e instalación de reflector LED exterior sobre pared o alero",
    unidad: "Unidad",
    precio: 26000
  },
  {
    id: "ilu-06",
    categoria: "Iluminación y Artefactos",
    descripcion: "Instalación de fotocélula / fotocontrol electrónico para encendido crepuscular automático",
    unidad: "Unidad",
    precio: 25000
  },
  {
    id: "ilu-07",
    categoria: "Iluminación y Artefactos",
    descripcion: "Instalación y calibración de sensor de movimiento infrarrojo / microondas",
    unidad: "Unidad",
    precio: 27000
  },
  {
    id: "ilu-08",
    categoria: "Iluminación y Artefactos",
    descripcion: "Instalación de tira LED con perfil de aluminio difusor y fuente de alimentación conmutada",
    unidad: "Metro",
    precio: 16500
  },
  {
    id: "ilu-09",
    categoria: "Iluminación y Artefactos",
    descripcion: "Armado, balanceo y colocación de ventilador de techo sin luces",
    unidad: "Unidad",
    precio: 46000
  },
  {
    id: "ilu-10",
    categoria: "Iluminación y Artefactos",
    descripcion: "Armado, balanceo y colocación de ventilador de techo con artefacto de luz y regulador de pared",
    unidad: "Unidad",
    precio: 58000
  },

  // --- 7. SMART HOME, DOMÓTICA Y CONECTIVIDAD ---
  {
    id: "dom-01",
    categoria: "Smart Home y Domótica",
    descripcion: "Instalación y sincronización de interruptor táctil inteligente WiFi (Sonoff / Tuya / SmartLife)",
    unidad: "Unidad",
    precio: 34000
  },
  {
    id: "dom-02",
    categoria: "Smart Home y Domótica",
    descripcion: "Instalación de micromódulo inteligente oculto (Sonoff Mini / Shelly) en caja de luz con neutro",
    unidad: "Unidad",
    precio: 32000
  },
  {
    id: "dom-03",
    categoria: "Smart Home y Domótica",
    descripcion: "Instalación de medidor / disyuntor inteligente WiFi con monitoreo de consumo en riel DIN",
    unidad: "Unidad",
    precio: 48000
  },
  {
    id: "dom-04",
    categoria: "Smart Home y Domótica",
    descripcion: "Configuración de app domótica, enlace a red WiFi 2.4GHz y programación de escenas automatizadas",
    unidad: "Global",
    precio: 45000
  },

  // --- 8. FUERZA MOTRIZ, BOMBAS Y MOTORES ---
  {
    id: "mot-01",
    categoria: "Fuerza Motriz y Bombas",
    descripcion: "Instalación y conexionado de automático de tanque / cisterna en muy baja tensión de seguridad (24V)",
    unidad: "Global",
    precio: 72000
  },
  {
    id: "mot-02",
    categoria: "Fuerza Motriz y Bombas",
    descripcion: "Conexionado eléctrico de bomba elevadora o presurizadora con guardamotor térmico",
    unidad: "Unidad",
    precio: 52000
  },
  {
    id: "mot-03",
    categoria: "Fuerza Motriz y Bombas",
    descripcion: "Alimentación eléctrica y conexionado para motor de portón corredizo / levadizo",
    unidad: "Global",
    precio: 68000
  },

  // --- 9. PUESTA A TIERRA Y MEDICIONES ---
  {
    id: "pat-01",
    categoria: "Puesta a Tierra y Mediciones",
    descripcion: "Instalación de sistema de puesta a tierra (jabalina de cobre 5/8, cámara de inspección y cable desnudo)",
    unidad: "Unidad",
    precio: 85000
  },
  {
    id: "pat-02",
    categoria: "Puesta a Tierra y Mediciones",
    descripcion: "Medición de resistencia de puesta a tierra con telurímetro calibrado y confección de protocolo SRT 900",
    unidad: "Informe",
    precio: 145000
  },

  // --- 10. DIAGNÓSTICOS, URGENCIAS Y CERTIFICACIONES ---
  {
    id: "dia-01",
    categoria: "Diagnósticos y Urgencias",
    descripcion: "Visita técnica diagnóstica e inspección inicial en obra (Rosario y alrededores)",
    unidad: "Visita",
    precio: 35000
  },
  {
    id: "dia-02",
    categoria: "Diagnósticos y Urgencias",
    descripcion: "Búsqueda y reparación de fuga a tierra / corte por disyuntor o cortocircuito (urgencia diurna)",
    unidad: "Servicio",
    precio: 65000
  },
  {
    id: "dia-03",
    categoria: "Diagnósticos y Urgencias",
    descripcion: "Guardia / Urgencia eléctrica 24h nocturna, fines de semana o feriados",
    unidad: "Servicio",
    precio: 95000
  },
  {
    id: "dia-04",
    categoria: "Diagnósticos y Urgencias",
    descripcion: "Informe técnico de aptitud eléctrica e instalaciones seguras según normativa AEA 90364",
    unidad: "Informe",
    precio: 120000
  }
];

// Almacén y gestión de precios maestros en localStorage
const CMOManager = {
  STORAGE_KEY: "smartelectric_cmo_master_prices_v1",

  // Carga el catálogo guardado o el inicial por defecto
  getCatalog() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("No se pudo leer CMO desde localStorage, usando default", e);
    }
    this.saveCatalog(DEFAULT_CMO_ITEMS);
    return JSON.parse(JSON.stringify(DEFAULT_CMO_ITEMS));
  },

  saveCatalog(items) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      return true;
    } catch (e) {
      console.error("Error al guardar catálogo CMO", e);
      return false;
    }
  },

  // Aplicar porcentaje masivo de ajuste (+10%, +15%, etc.)
  adjustAllPercentages(percent) {
    const factor = 1 + (percent / 100);
    const catalog = this.getCatalog().map(item => ({
      ...item,
      precio: Math.round((item.precio * factor) / 500) * 500 // Redondeo a múltiplos de 500 para prolijidad
    }));
    this.saveCatalog(catalog);
    return catalog;
  },

  // Actualizar un ítem puntual
  updateItem(id, updatedFields) {
    const catalog = this.getCatalog();
    const index = catalog.findIndex(i => i.id === id);
    if (index !== -1) {
      catalog[index] = { ...catalog[index], ...updatedFields };
      this.saveCatalog(catalog);
      return catalog[index];
    }
    return null;
  },

  // Agregar nuevo ítem al catálogo maestro
  addItem(item) {
    const catalog = this.getCatalog();
    const newItem = {
      id: "cust-" + Date.now().toString(36),
      categoria: item.categoria || "Personalizados",
      descripcion: item.descripcion || "Nuevo Ítem",
      unidad: item.unidad || "Unidad",
      precio: Number(item.precio) || 0
    };
    catalog.push(newItem);
    this.saveCatalog(catalog);
    return newItem;
  },

  // Eliminar ítem del catálogo
  deleteItem(id) {
    const catalog = this.getCatalog().filter(i => i.id !== id);
    this.saveCatalog(catalog);
    return catalog;
  },

  // Restablecer catálogo de fábrica
  resetToDefault() {
    this.saveCatalog(DEFAULT_CMO_ITEMS);
    return JSON.parse(JSON.stringify(DEFAULT_CMO_ITEMS));
  },

  // Obtener categorías únicas
  getCategories() {
    const catalog = this.getCatalog();
    const set = new Set(catalog.map(i => i.categoria));
    return Array.from(set);
  }
};

