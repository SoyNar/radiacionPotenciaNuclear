/* nav.js · Menú global del sitio
   Requiere <div id="site-header"></div> en la página.
   Cada página declara su sección en <body data-seccion="calculo"> (o "expo", "estudio", "vectores").
   En index.html la sección se toma del #hash. */
(function () {
  const script = document.currentScript;
  const RAIZ = new URL('../', script.src);
  const TITULO = 'Apuntes interactivos · Universidad';

  // Carga los estilos del menú y los iconos (solo si aún no están)
  function cargarCSS(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  }
  cargarCSS('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css');
  cargarCSS(new URL('css/nav.css', RAIZ).href);

  const LINKS = [
    { clave: 'inicio',     icono: 'bi-house-door', tip: 'Inicio / Exposición',     ruta: 'index.html' }, ,
// { clave: 'expo', icono: 'bi-easel', tip: 'Exposición', ruta: 'exposicion.html' },
{ clave: 'estudio', icono: 'bi-magnet', tip: 'Descubriendo la Física', ruta: 'descubriendo.html', hash: '#estudio' },
    { clave: 'calculo',  icono: 'bi-graph-up',   tip: 'Cálculo Diferencial', ruta: 'calculo.html' },
    { clave: 'vectores', icono: 'bi-vector-pen', tip: 'Geometría vectorial', ruta: 'vectorial.html' }
  ];

const esIndex = /(\/|index\.html)$/.test(location.pathname);
  // Si estamos en index, intenta leer el hash; si no hay hash, usa el data-seccion del body por defecto
  const seccion = esIndex
    ? (location.hash ? location.hash.replace('#', '') : (document.body.dataset.seccion || ''))
    : (document.body.dataset.seccion || '');

const html = `
    <header class="site-header">
      <div style="display: flex; align-items: center; gap: 15px;">
        <strong class="site-title">${TITULO}</strong>
        <a href="descubriendo.html" style="font-size: 14px; text-decoration: none; opacity: 0.7; color: var(--ink); font-family: inherit; display: none; @media(min-width: 768px){display: inline;}">Explorar más apuntes ➔</a>
      </div>
      <nav class="site-nav" aria-label="Secciones del sitio">
        ${LINKS.map(l => {
          const href = new URL(l.ruta, RAIZ).href + (l.hash || '');
          const activo = l.clave === seccion;
          return `<a href="${href}" data-nav="${l.clave}" data-tip="${l.tip}"
           aria-label="${l.tip}" class="site-link ${activo ? 'on' : ''}"
           ${activo ? 'aria-current="page"' : ''}>
          <i class="bi ${l.icono}" aria-hidden="true"></i>
        </a>`;
        }).join('')}
      </nav>
    </header>`;

  const destino = document.getElementById('site-header');
  if (destino) destino.innerHTML = html;
})();