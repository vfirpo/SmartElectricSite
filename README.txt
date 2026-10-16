SMART ELECTRIC — SITIO WEB (ESTADO ACTUAL)
===========================================

Sitio web institucional y de servicios para "Smart Electric" (Rosario, Funes, Roldán, Ibarlucea).
Optimizado para rendimiento, estética visual moderna, navegación mobile-first y sin dependencias externas críticas.

--------------------------------------------------------------------------------
1. ESTRUCTURA Y NAVEGACIÓN
--------------------------------------------------------------------------------
- Header Sticky:
  * Logotipo actualizado (dimensiones 100x100px con esquinas redondeadas al 20%).
  * Tipografía e identidad de marca (SMART en blanco, ELECTRIC en amarillo, subtítulo descriptivo).
  * Menú de navegación anclado con indicador activo (#inicio, #servicios, #inteligente, #escenarios, #trabajos, #nosotros, #contacto).
  * Botón directo de "Urgencias 24h" con enlace directo a WhatsApp.
  * Menú responsive en hamburguesa flotante para dispositivos móviles con cierre automático al navegar o tocar fuera.

- Secciones Principales:
  * Hero: Mensaje principal, llamado a la acción prioritario de urgencias por WhatsApp, solicitud de presupuesto y badges de confianza.
  * Accesos Rápidos (Quick Grid): Tarjetas interactivas con imágenes reales ("Urgencias & Reparaciones", "Tableros y protecciones", "Instalaciones & Iluminación", "Hogar inteligente").
  * Servicios: Grilla detallada con modales informativos para cada especialidad.
  * Diferencial Smart: Sección destacada con fondo contrastante que resalta soluciones domóticas e inteligentes.
  * Escenarios Inteligentes: Casos de uso de una casa automatizada ("Llegás a casa", "Te vas", "Es de noche", "Vacaciones", "Control remoto").
  * Proceso de Trabajo: Pasos claros para el cliente (Contacto, Evaluación, Propuesta, Trabajo).
  * Trabajos Reales: Galería fotográfica con trabajos representativos realizados ("Reparación eléctrica profesional", "Reparación Horno Continuo", "Modernización de Tableros - Antes y Después", "Tablero Eléctrico Inteligente", "Hogar Inteligente y Domótica").
  * Nosotros & Área de Cobertura: Valores de marca y tarjeta de localidades con mapa interactivo y modal expandible.
  * Formulario de Contacto Directo: Formulario interactivo (#waForm) que construye y envía una solicitud estructurada (Nombre, Zona, Servicio y Detalle) directamente a WhatsApp.
  * Preguntas Frecuentes (FAQ): Formato colapsable acordeón nativo con <details> y <summary>.
  * CTA Final & Footer: Botones de contacto, número telefónico (+54 341 621-9609), redes sociales (@SmartElectricAr) y enlaces directos.
  * Botón Flotante WhatsApp: Acceso persistente visible en toda la navegación.

--------------------------------------------------------------------------------
2. COMPONENTES Y MODALES INTERACTIVOS
--------------------------------------------------------------------------------
- Modal de Servicios (#modal):
  * Muestra descripción expandida de los servicios al hacer clic en "Ver más →".
- Modal de Área de Servicio (#mapModal):
  * Al hacer clic en el mapa de cobertura, se abre un modal de vista ampliada con el título "Área de Servicio".
  * Muestra el mapa en alta calidad sin deformaciones ni cortes (contain/fit adaptable).
  * Incluye botón para consultar cobertura directamente por WhatsApp.
  * Soporta apertura por teclado (Enter / Espacio), cierre por botón '×', clic fuera del modal y tecla 'Escape'.
- Formulario Dinámico WhatsApp (#waForm):
  * Validación de campos requeridos y generación automática de mensaje codificado para WhatsApp Web / App.

--------------------------------------------------------------------------------
3. GESTIÓN DE RECURSOS E IMÁGENES LOCALES
--------------------------------------------------------------------------------
Todas las imágenes externas han sido descargadas y organizadas en la carpeta local `/images` para evitar dependencias con servidores externos y garantizar máxima velocidad de carga:
- `images/logo-smart-electric.png`: Isologotipo de marca optimizado.
- `images/Reparaciones_electricas_hero.jpg`: Imagen principal del Hero.
- `images/foto_trabajo.png`: Tarjeta de urgencias y primer trabajo en galería.
- `images/Tablero_Electrico_Smart.jpeg`: Tarjeta de tableros y cuarta foto de la galería.
- `images/Horno_continuo.jpeg`: Segunda foto de la galería de trabajos reales.
- `images/Tablero antes y despues.jfif`: Tercera foto de la galería de trabajos reales y tarjeta de modernización de tableros.
- `images/Mapa_de_Servicio.jpg`: Mapa de cobertura (Rosario, Funes, Roldán e Ibarlucea) tanto en preview como en modal expandido.
- `images/unsplash1.jpg` a `images/unsplash8.jpg`: Fondos decorativos y escenas de casas inteligentes.
- `favicon.png`: Favicon oficial del sitio.

--------------------------------------------------------------------------------
4. REPOSITORIO Y DESPLIEGUE
--------------------------------------------------------------------------------
- Repositorio GitHub: https://github.com/vfirpo/SmartElectricSite.git
- Rama principal: `main`
- Hosting previsto / compatible: Cloudflare Pages

--------------------------------------------------------------------------------
5. PRÓXIMAS FUNCIONALIDADES EN PLANIFICACIÓN
--------------------------------------------------------------------------------
- Expansión geográfica para Buenos Aires (CABA / GBA) mediante selector de ciudad y/o landing dedicada.
