# Smart Electric — Sitio Web Oficial

Sitio web institucional y catálogo interactivo de servicios para **Smart Electric** (Rosario, Funes, Roldán, Ibarlucea).
Desarrollado para ofrecer máxima velocidad de carga, estética visual moderna, diseño responsivo (*mobile-first*) y sin dependencias externas críticas.

---

## ⚡ Estructura y Navegación

- **Header Sticky:**
  - Logotipo institucional optimizado (100x100px con bordes redondeados al 20%).
  - Identidad de marca distintiva (`SMART` en blanco, `ELECTRIC` en amarillo).
  - Menú de navegación anclado con indicador de sección activa (`#inicio`, `#servicios`, `#inteligente`, `#escenarios`, `#trabajos`, `#nosotros`, `#contacto`).
  - Botón de acceso directo a **Urgencias 24h** por WhatsApp.
  - Menú móvil interactivo tipo hamburguesa flotante con cierre automático al seleccionar una sección o tocar fuera.

- **Secciones Principales:**
  - **Hero:** Propuesta de valor, botones de acción inmediata (WhatsApp y solicitud de presupuesto) y badges de confianza.
  - **Accesos Rápidos (Quick Cards):** Tarjetas visuales directas (*Urgencias & Reparaciones*, *Tableros y protecciones*, *Instalaciones & Iluminación*, *Hogar inteligente*).
  - **Servicios:** Grilla detallada con descripción y modales de información extendida.
  - **Diferencial Smart:** Espacio dedicado a soluciones de domótica, conectividad y automatización.
  - **Escenarios Inteligentes:** Casos de uso interactivos (*"Llegás a casa"*, *"Te vas"*, *"Es de noche"*, *"Vacaciones"*, *"Control remoto"*).
  - **Proceso de Trabajo:** Metodología clara paso a paso (Contacto, Evaluación, Propuesta y Ejecución).
  - **Trabajos Reales:** Galería fotográfica con trabajos representativos realizados (*Reparación profesional*, *Horno continuo industrial*, *Modernización de tableros antes y después*, *Tablero inteligente*).
  - **Nosotros & Área de Cobertura:** Valores, trayectoria y tarjeta de localidades con mapa interactivo y modal expandible.
  - **Formulario de Contacto:** Enrutador de consultas que genera y envía automáticamente el mensaje estructurado a WhatsApp con el detalle del cliente.
  - **Preguntas Frecuentes (FAQ):** Acordeón colapsable nativo accesible (`<details>` y `<summary>`).
  - **Footer:** Canales directos de contacto (+54 341 621-9609), redes sociales ([@SmartElectricAr](https://instagram.com/SmartElectricAr)) y accesos rápidos.
  - **Botón Flotante:** Acceso persistente a WhatsApp disponible en toda la experiencia.

---

## 🛠️ Componentes y Modales Interactivos

- **Modal de Servicios (`#modal`):**
  - Muestra detalles adicionales, alcances y recomendaciones técnicas de cada servicio al hacer clic en *"Ver más →"*.
- **Modal de Área de Cobertura (`#mapModal`):**
  - Vista ampliada en alta resolución del mapa de servicio sin deformación ni cortes.
  - Botón de consulta de cobertura personalizada directo a WhatsApp.
  - Accesibilidad integrada: apertura con teclado (`Enter` o `Espacio`), cierre con botón `×`, clic en el fondo o pulsando `Escape`.
- **Formulario Dinámico a WhatsApp (`#waForm`):**
  - Captura nombre, localidad, servicio y consulta detallada para abrir una conversación de WhatsApp preconfigurada.

---

## 📁 Gestión de Recursos e Imágenes Locales

Todas las imágenes se encuentran alojadas localmente en el directorio `/images` para asegurar independencia de servidores externos y máxima velocidad:

- `images/logo-smart-electric.png`: Isologotipo de la marca.
- `images/Reparaciones_electricas_hero.jpg`: Imagen principal de portada (Hero).
- `images/foto_trabajo.png`: Tarjeta de urgencias y galería de trabajos.
- `images/Tablero_Electrico_Smart.jpeg`: Tarjeta de tableros y galería de trabajos inteligentes.
- `images/Horno_continuo.jpeg`: Galería de trabajos en hornos industriales.
- `images/Tablero antes y despues.jfif`: Galería de modernización de tableros eléctricos.
- `images/Mapa_de_Servicio.jpg`: Mapa de cobertura geográfica (Rosario, Funes, Roldán, Ibarlucea).
- `images/unsplash1.jpg` a `images/unsplash8.jpg`: Escenas ambientales y domótica.
- `favicon.png`: Favicon oficial en pestaña y accesos directos.

---

## 🚀 Repositorio y Despliegue

- **Repositorio GitHub:** [https://github.com/vfirpo/SmartElectricSite.git](https://github.com/vfirpo/SmartElectricSite.git)
- **Rama principal:** `main`
- **Hosting sugerido:** Cloudflare Pages
