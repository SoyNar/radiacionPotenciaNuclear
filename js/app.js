(function () {
  const app = document.getElementById('app');
  const mods = window.MODULOS || [];

  function listaModulos() {
    const cards = mods.map(m => m.archivo
      ? `<a href="${m.archivo}">Módulo ${m.num} · ${m.titulo}</a>`
      : `<a class="pend-card">Módulo ${m.num} · ${m.titulo}<br><span class="pend">pendiente</span></a>`
    ).join('');
    return `<h1>Estudio · Módulos 17 a 27</h1>
      <p>El parcial 3 cubre estos módulos. Cada módulo tiene su propia página con preguntas y dibujos interactivos.</p>
      <div class="mod-list">${cards}</div>`;
  }

  function render() {
    const h = location.hash.slice(1) || 'estudio';
    document.querySelectorAll('nav a').forEach(a => a.classList.toggle('on', h === a.dataset.tab));

    if (h === 'expo') {
      app.innerHTML = '<iframe src="exposicion.html" title="Exposición"></iframe>';
      app.style.maxWidth = 'none';
      app.style.padding = '0';
      return;
    }
    app.style.maxWidth = '';
    app.style.padding = '';
    app.innerHTML = listaModulos();
  }

  window.addEventListener('hashchange', render);
  render();
})();