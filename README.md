# Smart Electric — Sitio Web Oficial & Plataforma de Gestión (Cotizador PWA)

Plataforma digital integral para **Smart Electric** (Rosario, Funes, Roldán, Ibarlucea y alrededores).
Combina el **sitio web institucional y catálogo comercial de servicios** con un **sistema interno de cotización y gestión de presupuestos (PWA)**, respaldado por una base de datos relacional serverless en el edge (**Cloudflare D1**) y capacidades de trabajo offline (**IndexedDB**).

---

## 📑 Tabla de Contenidos

1. [Visión General del Proyecto](#-visión-general-del-proyecto)
2. [Sitio Web Comercial (Frontend Público)](#-sitio-web-comercial-frontend-público)
3. [Sistema de Cotizaciones y Presupuestos (/cotizador/)](#-sistema-de-cotizaciones-y-presupuestos-cotizador)
4. [Arquitectura Backend Serverless & Base de Datos D1](#-arquitectura-backend-serverless--base-de-datos-d1)
5. [Seguridad y Control de Acceso](#-seguridad-y-control-de-acceso)
6. [Estructura del Repositorio](#-estructura-del-repositorio)
7. [Configuración y Despliegue en Cloudflare Pages](#-configuración-y-despliegue-en-cloudflare-pages)

---

## ⚡ Visión General del Proyecto

- **Sitio Público (`/`):** Diseñado con enfoque *mobile-first*, estética técnica moderna, carga ultrarrápida sin frameworks pesados ni dependencias externas críticas, con integración directa a WhatsApp para captación de leads y urgencias 24h.
- **Cotizador Interno (`/cotizador/`):** Aplicación web privada y desacoplada del sitio principal para técnicos electricistas matriculados. Permite generar presupuestos en obra, adjuntar diagnósticos fotográficos optimizados, calcular mano de obra según tarifario oficial **CMO (Electroinstalador)**, exportar a PDF A4 con membrete institucional y sincronizar en tiempo real con **Cloudflare D1 (SQLite)**.

---

## 🌐 Sitio Web Comercial (Frontend Público)

### Navegación y Estructura
- **Header Sticky:**
  - Isologotipo institucional optimizado (`images/logo-smart-electric.png`).
  - Navegación anclada con indicador activo (`#inicio`, `#servicios`, `#inteligente`, `#escenarios`, `#trabajos`, `#nosotros`, `#contacto`).
  - Botón directo de **Urgencias 24h** vinculado a WhatsApp.
  - Menú hamburguesa flotante para dispositivos móviles con autocierre al interactuar.
- **Secciones Destacadas:**
  - **Hero:** Propuesta de valor clara, botones de acción inmediata y credenciales de confianza.
  - **Accesos Rápidos (Quick Grid):** Tarjetas interactivas con trabajos clave (*Urgencias & Reparaciones*, *Tableros y Protecciones*, *Instalaciones & Iluminación*, *Hogar Inteligente*).
  - **Servicios Detallados:** Grilla técnica con modales informativos de alcance y normativas para cada especialidad.
  - **Diferencial Smart & Escenarios:** Casos de uso prácticos de domótica y conectividad (*"Llegás a casa"*, *"Te vas"*, *"Es de noche"*, *"Vacaciones"*, *"Control remoto"*).
  - **Trabajos Reales:** Galería fotográfica de obras concluidas (reparaciones industriales, hornos continuos, modernización de tableros antes/después y tableros inteligentes).
  - **Área de Cobertura & Modal de Mapa:** Visualización en alta definición de las localidades atendidas (Rosario, Funes, Roldán, Ibarlucea) con modal expandible y soporte de accesibilidad por teclado (`Escape`, `Enter`).
  - **Formulario Inteligente de Contacto (`#waForm`):** Construye automáticamente mensajes estructurados y codificados hacia la API de WhatsApp con nombre, zona, servicio y descripción de la consulta.
  - **Preguntas Frecuentes (FAQ):** Acordeones colapsables nativos basados en `<details>` y `<summary>` para máxima compatibilidad y SEO.
  - **Botón Flotante Persistente:** Acceso inmediato a WhatsApp disponible durante toda la navegación.

---

## 🛠️ Sistema de Cotizaciones y Presupuestos (`/cotizador/`)

El cotizador es una herramienta técnica desarrollada para agilizar la cotización de trabajos eléctricos residenciales, comerciales e industriales.

### 1. Entrada Rápida de Tareas e Ítems
- **Carga Directa Personalizada (Default):** Barra intuitiva sobre la tabla de tareas para ingresar descripción, cantidad, unidad (Global, Unidad, Boca, Metro, Hora, Servicio, Informe), precio unitario y rubro.
- **Atajos de Teclado:** Presionando `Enter` en el precio o descripción se añade el ítem automáticamente y se reenfoca para carga continua.
- **Catálogo de Referencia CMO:** Cajón desplegable secundario conectado a la base de datos de **Costos de Mano de Obra (Electroinstalador Argentina)** con más de 40 categorías preconfiguradas.
- **Actualización por Inflación:** Panel maestro para aplicar aumentos porcentuales masivos (+10%, +15%, etc.) o restablecer a valores base.

### 2. Relevamiento Fotográfico & Diagnóstico Técnico
- **Captura Flexible:** Subida desde galería o captura directa con la cámara del dispositivo móvil.
- **Compresión en Cliente (Canvas):** Algoritmo de optimización que reduce fotografías de 8–12 MB a ~60–80 KB en tiempo real sin perder legibilidad, evitando saturar el almacenamiento y la red.
- **Clasificación por Criticidad:** Badges visuales normalizados (*⚠️ Riesgo Eléctrico Grave*, *⚠️ Fuera de Norma AEA*, *ℹ️ Recomendación Técnica*, *✅ Trabajo Realizado*).

### 3. Generación de PDF A4 Profesional
- **Plantilla Imprimible Optimizada:**
  - Logotipo oficial de alta resolución ampliado a 135px.
  - Datos completos de cliente, número de presupuesto correlativo, validez y fecha.
  - Grilla fotográfica de diagnóstico técnico en formato 2x2.
  - Tabla desglosada de tareas, cantidades, precios unitarios y subtotales.
  - Resumen financiero con cálculo de descuentos y provisión de materiales.
  - **Protección contra cortes de página (`break-inside: avoid`):** Bloque de condiciones generales del servicio y firmas de conformidad contractual diseñados para trasladarse en conjunto si no entran en la primera hoja, eliminando firmas huérfanas.

### 4. Envío Automatizado por WhatsApp
- Transforma cualquier cotización en un resumen estructurado con emojis, desglose de ítems, totales y condiciones contractuales, abriendo la conversación con el cliente en un solo clic.

### 5. Historial, Filtros y Ordenamiento
- Historial completo con búsqueda en vivo por cliente, dirección o número de presupuesto.
- Filtro por estado (*Borrador*, *Enviado*, *Aprobado*, *Rechazado*, *Facturado*).
- **Ordenamiento de columnas bidireccional:** Ordená por N° de presupuesto, fecha, cliente, localidad, monto total o estado haciendo clic en los encabezados de la tabla.
- Acciones por fila: Editar/Cargar, Imprimir PDF, Duplicar cotización, Compartir por WhatsApp y Eliminar.

### 6. Portabilidad y Respaldo
- **IndexedDB (`SmartElectricDB`):** Almacenamiento local de capacidad virtualmente ilimitada para imágenes y cotizaciones, garantizando operatividad 100% offline.
- **Exportación/Importación JSON:** Copias de seguridad completas descargables y restaurables en cualquier equipo.

---

## ☁️ Arquitectura Backend Serverless & Base de Datos D1

El backend se ejecuta completamente en el edge mediante **Cloudflare Pages Functions** y **Cloudflare D1** (SQLite distribuido de baja latencia).

### Endpoints de la API (`/functions/api/`)

| Endpoint | Método | Autenticación | Descripción |
| :--- | :---: | :---: | :--- |
| `/api/auth` | `POST` | Pública | Valida el PIN de 4 dígitos (contra hash SHA-256 en D1) y emite un token Bearer con expiración de 10 horas. |
| `/api/auth/pin` | `POST` | Bearer Token | Permite cambiar el PIN maestro, almacenando el nuevo hash SHA-256 en D1. |
| `/api/budgets` | `GET` | Bearer Token | Obtiene la lista resumida y liviana de presupuestos para el historial. |
| `/api/budgets` | `POST` | Bearer Token | Guarda o actualiza atómicamente un presupuesto con sus ítems y diagnósticos en una sola transacción batch de D1. |
| `/api/budgets/:id` | `GET` | Bearer Token | Recupera el detalle completo de un presupuesto, incluyendo imágenes base64 de alta resolución. |
| `/api/budgets/:id` | `DELETE` | Bearer Token | Elimina en cascada el presupuesto, sus ítems y sus fotografías asociadas en D1. |

### Esquema de la Base de Datos (Cloudflare D1)

```sql
-- Configuración global (hash del PIN)
CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Sesiones activas y tokens efímeros
CREATE TABLE IF NOT EXISTS app_sessions (
  token TEXT PRIMARY KEY,
  expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_app_sessions_expires_at ON app_sessions(expires_at);

-- Presupuestos principales
CREATE TABLE IF NOT EXISTS budgets (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  date TEXT NOT NULL,
  validity INTEGER DEFAULT 10,
  status TEXT DEFAULT 'Borrador',
  client_name TEXT,
  client_phone TEXT,
  client_location TEXT,
  client_address TEXT,
  discount_percent REAL DEFAULT 0,
  materials_amount REAL DEFAULT 0,
  grand_total REAL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ítems desglosados
CREATE TABLE IF NOT EXISTS budget_items (
  id TEXT PRIMARY KEY,
  budget_id TEXT NOT NULL,
  categoria TEXT,
  descripcion TEXT NOT NULL,
  cantidad REAL DEFAULT 1,
  unidad TEXT DEFAULT 'Unidad',
  precio_unitario REAL DEFAULT 0,
  subtotal REAL DEFAULT 0,
  FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE
);

-- Relevamientos fotográficos
CREATE TABLE IF NOT EXISTS budget_diagnostics (
  id TEXT PRIMARY KEY,
  budget_id TEXT NOT NULL,
  title TEXT,
  criticidad TEXT,
  description TEXT,
  image_data TEXT,
  orig_kb INTEGER DEFAULT 0,
  comp_kb INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE
);
```

### Sincronización Nube <-> Local
El cotizador implementa una estrategia híbrida *offline-first*:
1. Al cargar la app, lee instantáneamente de **IndexedDB** local para respuesta cero-latencia.
2. En segundo plano consulta la API de Cloudflare D1. Si hay conexión y sesión válida, sincroniza los cambios bidireccionalmente.
3. El estado se refleja en tiempo real mediante un indicador visual:
   - `🟢 Nube D1 Activa`: Sincronizado con Cloudflare D1.
   - `☁️ Conectando...`: Estableciendo comunicación y validando sesión.
   - `🟠 Modo Local`: Operando desconectado o con base local (IndexedDB).

---

## 🔒 Seguridad y Control de Acceso

1. **Aislamiento y Anti-Indexación:**
   - El cotizador no posee enlaces visibles en el sitio web comercial.
   - Cuenta con directivas `<meta name="robots" content="noindex, nofollow">` en su cabecera.
   - Archivo `robots.txt` con regla explícita: `Disallow: /cotizador/`.
2. **Autenticación Criptográfica:**
   - La pantalla de acceso solicita un **PIN de 4 dígitos** (por defecto `1234`, modificable desde la app).
   - El PIN **nunca se almacena en texto plano**: se procesa con **SHA-256** mediante la Web Crypto API (`crypto.subtle`) y se compara contra el hash seguro en D1.
   - Protección contra ataques de fuerza bruta mediante retardo artificial en respuestas fallidas.
3. **Tokens de Sesión Efímeros:**
   - Tras validar el PIN, el backend genera un token criptográfico de 256 bits (64 caracteres hexadecimales).
   - Las sesiones expiran automáticamente a las 10 horas y las expiradas se purgan de la base de datos periódicamente.
   - Todas las llamadas a la API requieren el header `Authorization: Bearer <token>`.

---

## 📁 Estructura del Repositorio

```text
├── cotizador/                    # Plataforma privada de cotizaciones
│   ├── index.html                # Interfaz de usuario del cotizador
│   ├── cotizador.css             # Estilos y reglas de impresión A4 (@media print)
│   ├── cotizador.js              # Lógica cliente, IndexedDB, compresión y sincronización
│   └── cmo-data.js               # Tarifario oficial Electroinstalador (CMO) y gestor
├── functions/                    # Cloudflare Pages Functions (Backend Serverless)
│   ├── _shared/
│   │   └── auth.js               # Helpers criptográficos (SHA-256, tokens, validación)
│   └── api/
│       ├── auth/
│       │   ├── index.js          # POST /api/auth (Login y emisión de token)
│       │   └── pin/
│       │       └── index.js      # POST /api/auth/pin (Cambio de PIN maestro)
│       └── budgets/
│           ├── index.js          # GET /api/budgets y POST /api/budgets
│           └── [id].js           # GET /api/budgets/:id y DELETE /api/budgets/:id
├── images/                       # Recursos gráficos y fotografías locales optimizadas
│   ├── logo-smart-electric.png   # Logo oficial
│   ├── Mapa_de_Servicio.jpg      # Cobertura geográfica
│   └── ...                       # Fotografías de trabajos reales
├── d1-auth-schema.sql            # Script SQL para tablas de autenticación en D1
├── favicon.png                   # Favicon oficial
├── index.html                    # Landing page comercial pública
├── robots.txt                    # Reglas para motores de búsqueda (protege /cotizador/)
├── styles.css                    # Estilos visuales del sitio comercial
└── README.md                     # Documentación técnica del proyecto
```

---

## 🚀 Configuración y Despliegue en Cloudflare Pages

### 1. Requisitos Previos
- Cuenta en [Cloudflare](https://dash.cloudflare.com/).
- Repositorio conectado a GitHub: [SmartElectricSite](https://github.com/vfirpo/SmartElectricSite.git).

### 2. Configuración del Proyecto en Cloudflare Pages
1. Crear un proyecto en **Cloudflare Dashboard > Workers & Pages > Create application > Pages > Connect to Git**.
2. Parámetros de compilación:
   - **Framework preset:** `None`
   - **Build command:** *(dejar vacío)*
   - **Build output directory:** `.`
3. Desplegar la rama `main`.

### 3. Vinculación de la Base de Datos D1
1. En el menú lateral de Cloudflare, ir a **Storage & Databases > D1 SQL Database** y crear una base de datos llamada `smartelectric-db`.
2. Ejecutar las consultas SQL de inicialización en la consola de D1 (**Console**) para crear las tablas `app_config`, `app_sessions`, `budgets`, `budget_items` y `budget_diagnostics`.
3. Ir al proyecto en **Pages > Settings > Functions > D1 database bindings**.
4. Agregar el binding:
   - **Variable name:** `DB`
   - **D1 Database:** Seleccionar `smartelectric-db`.
5. Redesplegar la última versión para activar las funciones con acceso a la base de datos.

---

## 📞 Canales de Contacto

- **Teléfono / WhatsApp de Urgencias:** [+54 341 621-9609](https://wa.me/5493416219609)
- **Instagram Oficial:** [@SmartElectricAr](https://instagram.com/SmartElectricAr)
- **Área de Cobertura:** Rosario, Funes, Roldán, Ibarlucea (Santa Fe, Argentina)
