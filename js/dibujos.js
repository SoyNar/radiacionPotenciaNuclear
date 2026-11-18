// Utilidades compartidas por todos los módulos.
// Los widgets de cada módulo viven en js/mXX.js.
window.Dibujos = window.Dibujos || {};
window.Dibujos.util = {
  svg(tag, attrs, parent) {
    const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  },
  // Color aproximado según longitud de onda en nm
  colorDeOnda(lam) {
    if (lam < 380) return ['ultravioleta', '#7a4fb0'];
    if (lam < 450) return ['violeta', '#8a4fd0'];
    if (lam < 495) return ['azul', '#2f6fb0'];
    if (lam < 570) return ['verde', '#3c8d5a'];
    if (lam < 750) return ['rojo', '#c8432b'];
    return ['infrarrojo', '#8a8170'];
  }
};