const $ = id => document.getElementById(id);

// Renderiza LaTeX en un elemento después de cambiarlo con JS
function typeset(el) {
  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetClear && MathJax.typesetClear([el]);
    MathJax.typesetPromise([el]);
  }
}

/* ---------- 1. Flujo ---------- */
const TEXTO_FLUJO = [
  "Evalúa el límite. Si al sustituir obtienes $\\frac{0}{0}$ o $\\frac{\\infty}{\\infty}$, puedes usar L'Hôpital. Si no, usa otro método.",
  "Deriva el numerador y el denominador **por separado**: $\\lim \\frac{f(x)}{g(x)} = \\lim \\frac{f'(x)}{g'(x)}$. Recuerda que **no** es la regla del cociente.",
  "Vuelve a evaluar. Si sigue siendo indeterminado, repite. Si ya no, sustituye y listo."
];
document.querySelectorAll('.paso').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('.paso').forEach(x => x.classList.remove('activo'));
    b.classList.add('activo');
    const d = $('flujoTexto');
    d.innerHTML = TEXTO_FLUJO[+b.dataset.p].replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    typeset(d);
  };
});

/* ---------- 2. Formas indeterminadas ---------- */
const FORMAS = [
  { k: '$\\frac{0}{0}$', titulo: 'Forma directa de L\'Hôpital',
    pasos: [
      'Verifica que al sustituir obtienes $\\frac{0}{0}$.',
      'Deriva numerador y denominador por separado.',
      'Si sigue en $\\frac{0}{0}$, repite.'
    ], recs: ['cadena'] },
  { k: '$\\frac{\\infty}{\\infty}$', titulo: 'Forma directa de L\'Hôpital',
    pasos: [
      'Verifica que al sustituir obtienes $\\frac{\\infty}{\\infty}$.',
      'Deriva numerador y denominador por separado.',
      'Si sigue en $\\frac{\\infty}{\\infty}$, repite.'
    ], recs: ['cadena'] },
  { k: '$0\\cdot\\infty$', titulo: 'Hay que reescribirla como fracción',
    pasos: [
      'Escribe $f\\cdot g = \\dfrac{f}{1/g}$ o $f\\cdot g = \\dfrac{g}{1/f}$.',
      'Elige la que deje una derivada más sencilla.',
      'Ahora aplica L\'Hôpital sobre $\\frac{0}{0}$ o $\\frac{\\infty}{\\infty}$.'
    ], recs: ['reescribir', 'cadena'] },
    { k: '$\\infty-\\infty$', titulo: 'Hay que juntar las fracciones (esto es álgebra)',
    pasos: [
      'Si hay fracciones, busca un denominador común, como en aritmética: $\\frac{1}{2}-\\frac{1}{3}=\\frac{3}{6}-\\frac{2}{6}$.',
      'Escribe la expresión como un solo cociente $\\dfrac{P(x)}{Q(x)}$. Aquí todavía no derivas.',
      'Evalúa $P$ y $Q$. Si ambos tienden a $0$ o a $\\infty$, ya tienes $\\frac{0}{0}$ o $\\frac{\\infty}{\\infty}$.',
      'Aplica L\'Hôpital: deriva $P$ y $Q$ por separado.'
    ], recs: ['cociente'] },
  { k: '$0^0$', titulo: 'Forma de potencia: usa logaritmo',
    pasos: [
      'Sea $y=f(x)^{g(x)}$. Toma $\\ln y = g(x)\\ln f(x)$.',
      'Eso es $0\\cdot\\infty$. Reescríbelo como fracción.',
      'Aplica L\'Hôpital para obtener $\\lim \\ln y = L$.',
      'Regresa: $\\lim y = e^{L}$.'
    ], recs: ['logaritmos', 'reescribir'] },
  { k: '$\\infty^0$', titulo: 'Forma de potencia: usa logaritmo',
    pasos: [
      'Sea $y=f(x)^{g(x)}$. Toma $\\ln y = g(x)\\ln f(x)$.',
      'Eso es $0\\cdot\\infty$ o $\\infty\\cdot 0$. Reescríbelo como fracción.',
      'Aplica L\'Hôpital para obtener $\\lim \\ln y = L$.',
      'Regresa: $\\lim y = e^{L}$.'
    ], recs: ['logaritmos', 'reescribir'] },
  { k: '$1^\\infty$', titulo: 'Forma de potencia: usa logaritmo',
    pasos: [
      'Sea $y=f(x)^{g(x)}$. Toma $\\ln y = g(x)\\ln f(x)$.',
      'Ese producto es $\\infty\\cdot 0$. Reescríbelo como fracción.',
      'Aplica L\'Hôpital para obtener $\\lim \\ln y = L$.',
      'Regresa: $\\lim y = e^{L}$.'
    ], recs: ['logaritmos', 'cadena'] }
];

const nombreRec = id => RECS.find(r => r.id === id).nombre;

const formasDiv = $('formas');
FORMAS.forEach(f => {
  const b = document.createElement('button');
  b.innerHTML = f.k;
  b.onclick = () => {
    document.querySelectorAll('#formas button').forEach(x => x.classList.remove('sel'));
    b.classList.add('sel');
    const d = $('formaDetalle');
    d.innerHTML =
      `<b>${f.titulo}</b>
       <ol class="metodo">${f.pasos.map((p, i) => `<li><b>${i + 1}.</b> ${p}</li>`).join('')}</ol>
       <p><small>Recuerda: ${f.recs.map(nombreRec).join(', ')}</small></p>`;
    typeset(d);
  };
  formasDiv.appendChild(b);
  typeset(b);
});

/* ---------- 3. Recordatorios ---------- */
const RECS = [
  { id: 'cadena', nombre: 'Regla de la cadena',
    regla: '$(g\\circ h)\'(x) = g\'(h(x))\\cdot h\'(x)$',
    nota: 'Deriva por capas: primero la función de afuera, luego multiplica por la derivada de adentro.',
    ej: '$\\dfrac{d}{dx}\\ln(x^2+1)=\\dfrac{2x}{x^2+1}$' },
  { id: 'producto', nombre: 'Regla del producto',
    regla: '$(uv)\' = u\'v + uv\'$',
    nota: 'Úsala cuando tienes dos funciones multiplicadas, fuera de la forma de L\'Hôpital.',
    ej: '$\\dfrac{d}{dx}\\big[x e^x\\big]=e^x+xe^x$' },
  { id: 'cociente', nombre: 'Regla del cociente',
    regla: '$\\left(\\dfrac{u}{v}\\right)\' = \\dfrac{u\'v - uv\'}{v^2}$',
    nota: '**No** la uses dentro de L\'Hôpital, donde derivas arriba y abajo por separado. Sí la usas al derivar un cociente normal.',
    ej: '$\\dfrac{d}{dx}\\dfrac{x}{e^x}=\\dfrac{e^x - xe^x}{e^{2x}}$' },
  { id: 'logaritmos', nombre: 'Propiedades de logaritmos',
    regla: '$\\ln(ab)=\\ln a+\\ln b \\qquad \\ln(a^b)=b\\ln a \\qquad \\ln(e^x)=x$',
    nota: 'Bajan exponentes y convierten potencias en productos. Son clave en $0^0$, $\\infty^0$ y $1^\\infty$.',
    ej: '$\\ln(x^x)=x\\ln x$' },
  { id: 'derivadas', nombre: 'Derivadas básicas',
    regla: '$(e^x)\'=e^x \\qquad (\\ln x)\'=\\dfrac{1}{x} \\qquad (\\sin x)\'=\\cos x$',
    nota: 'Son las que más se usan al derivar arriba y abajo en L\'Hôpital. Conviene memorizarlas.',
    ej: '$\\dfrac{d}{dx}\\ln x=\\dfrac{1}{x}$' },
  { id: 'reescribir', nombre: 'Reescribir $0\\cdot\\infty$',
    regla: '$f\\cdot g=\\dfrac{f}{1/g}=\\dfrac{g}{1/f}$',
    nota: 'Elige la versión que deje una derivada más sencilla. Si no queda en $\\frac{0}{0}$ o $\\frac{\\infty}{\\infty}$, prueba la otra.',
    ej: '$x\\ln x=\\dfrac{\\ln x}{1/x}$' }
];

const chipsDiv = $('chips');
RECS.forEach(r => {
  const b = document.createElement('button');
  b.innerHTML = r.nombre;
  b.onclick = () => {
    document.querySelectorAll('#chips button').forEach(x => x.classList.remove('sel'));
    b.classList.add('sel');
    const d = $('recuerdo');
    d.innerHTML =
      `<div class="regla">${r.regla}</div>
       <p>${r.nota.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')}</p>
       <p><small>Ejemplo: ${r.ej}</small></p>`;
    typeset(d);
  };
  chipsDiv.appendChild(b);
  typeset(b);
});

/* ---------- 4. Ejemplos paso a paso ---------- */
const EJEMPLOS = [
  { titulo: 'lim x→1  ln(x)/(x−1)   [0/0]',
    limite: '$\\lim_{x\\to 1}\\dfrac{\\ln x}{x-1}$',
    pasos: [
      'Sustituimos: $\\dfrac{\\ln 1}{1-1}=\\dfrac{0}{0}$. Es indeterminado.',
      'Derivamos arriba: $(\\ln x)\'=\\dfrac{1}{x}$.',
      'Derivamos abajo: $(x-1)\'=1$.',
      'Nuevo límite: $\\lim_{x\\to 1}\\dfrac{1/x}{1}=\\dfrac{1}{1}$.'
    ],
    resp: '$\\lim_{x\\to 1}\\dfrac{\\ln x}{x-1}=1$' },
  { titulo: 'lim x→∞  x/eˣ   [∞/∞]',
    limite: '$\\lim_{x\\to \\infty}\\dfrac{x}{e^x}$',
    pasos: [
      'Sustituimos: $\\dfrac{\\infty}{\\infty}$. Es indeterminado.',
      'Derivamos arriba: $(x)\'=1$.',
      'Derivamos abajo: $(e^x)\'=e^x$.',
      'Nuevo límite: $\\lim_{x\\to \\infty}\\dfrac{1}{e^x}=0$.'
    ],
    resp: '$\\lim_{x\\to \\infty}\\dfrac{x}{e^x}=0$' },
  { titulo: 'lim x→0⁺  x·ln x   [0·∞]',
    limite: '$\\lim_{x\\to 0^+}x\\ln x$',
    pasos: [
      'Sustituimos: $0\\cdot(-\\infty)$. Es indeterminado $0\\cdot\\infty$.',
      'Reescribimos: $x\\ln x=\\dfrac{\\ln x}{1/x}$. Ahora es $\\dfrac{-\\infty}{\\infty}$.',
      'Derivamos arriba: $(\\ln x)\'=\\dfrac{1}{x}$. Abajo: $\\left(\\dfrac{1}{x}\\right)\'=-\\dfrac{1}{x^2}$.',
      'Nuevo límite: $\\dfrac{1/x}{-1/x^2}=-x \\to 0$.'
    ],
    resp: '$\\lim_{x\\to 0^+}x\\ln x=0$' },
  { titulo: 'lim x→0  (1/x − 1/sen x)   [∞−∞]',
    limite: '$\\lim_{x\\to 0}\\left(\\dfrac{1}{x}-\\dfrac{1}{\\sin x}\\right)$',
    pasos: [
      'Sustituimos: $\\infty-\\infty$. Es indeterminado.',
      'Juntamos en una fracción: $\\dfrac{\\sin x - x}{x\\sin x}$. Ahora es $\\dfrac{0}{0}$.',
      'Derivamos: $\\dfrac{\\cos x - 1}{\\sin x + x\\cos x}$. Sigue en $\\dfrac{0}{0}$.',
      'Derivamos otra vez: $\\dfrac{-\\sin x}{2\\cos x - x\\sin x}\\to\\dfrac{0}{2}=0$.'
    ],
    resp: '$\\lim_{x\\to 0}\\left(\\dfrac{1}{x}-\\dfrac{1}{\\sin x}\\right)=0$' },
  { titulo: 'lim x→0⁺  xˣ   [0⁰]',
    limite: '$\\lim_{x\\to 0^+}x^x$',
    pasos: [
      'Sustituimos: $0^0$. Es indeterminado.',
      'Sea $y=x^x$. Tomamos logaritmo: $\\ln y = x\\ln x$, que es $0\\cdot\\infty$.',
      'Reescribimos: $\\dfrac{\\ln x}{1/x}$ y aplicamos L\'Hôpital: $\\to 0$.',
      'Entonces $\\ln y\\to 0$, así que $y\\to e^0=1$.'
    ],
    resp: '$\\lim_{x\\to 0^+}x^x=1$' },
  { titulo: 'lim x→0  (1+x)^(1/x)   [1^∞]',
    limite: '$\\lim_{x\\to 0}(1+x)^{1/x}$',
    pasos: [
      'Sustituimos: $1^\\infty$. Es indeterminado.',
      'Sea $y=(1+x)^{1/x}$. Tomamos logaritmo: $\\ln y=\\dfrac{\\ln(1+x)}{x}$, que es $\\dfrac{0}{0}$.',
      'Derivamos: $\\dfrac{1/(1+x)}{1}\\to 1$.',
      'Entonces $\\ln y\\to 1$, así que $y\\to e^1=e$.'
    ],
    resp: '$\\lim_{x\\to 0}(1+x)^{1/x}=e$' }
];

const selEj = $('ejSel');
EJEMPLOS.forEach((e, i) => {
  const o = document.createElement('option');
  o.value = i;
  o.textContent = e.titulo;
  selEj.appendChild(o);
});

let ejActual = 0, pasoActual = 0;

function pintarEjemplo() {
  const e = EJEMPLOS[ejActual];
  const cont = $('ejPasos');
  cont.innerHTML = `<div class="paso-ej"><b>Límite:</b> ${e.limite}</div>` +
    e.pasos.slice(0, pasoActual).map((p, i) =>
      `<div class="paso-ej"><b>Paso ${i + 1}.</b> ${p}</div>`).join('');
  const terminado = pasoActual === e.pasos.length;
  $('ejResp').innerHTML = terminado ? `<b>Respuesta:</b> ${e.resp}` : '';
  $('ejSig').disabled = terminado;
  typeset(cont);
  typeset($('ejResp'));
}

selEj.onchange = () => { ejActual = +selEj.value; pasoActual = 0; pintarEjemplo(); };
$('ejSig').onclick = () => { pasoActual++; pintarEjemplo(); };
$('ejRes').onclick = () => { pasoActual = 0; pintarEjemplo(); };
pintarEjemplo();

/* ---------- 5. Intuición ---------- */
const MODOS = {
  ln: {
    cabecera: ['$x$', '$\\dfrac{\\ln x}{x-1}$'],
    filas: [0.1, 0.01, 0.001, 0.0001, 0.00001].map(h => ({
      x: `$1+${h}$`,
      v: Math.log(1 + h) / h
    })),
    objetivo: '$1$'
  },
  exp: {
    cabecera: ['$x$', '$\\dfrac{x}{e^x}$'],
    filas: [2, 5, 10, 20, 40].map(x => ({
      x: `$${x}$`,
      v: x / Math.exp(x)
    })),
    objetivo: '$0$'
  }
};

function pintarTabla(modo) {
  const m = MODOS[modo];
  const filas = m.filas.map((f, i) =>
    `<tr class="${i === m.filas.length - 1 ? 'ultima' : ''}">
      <td>${f.x}</td><td>$${f.v.toPrecision(6)}$</td></tr>`).join('');
  const cont = $('tabla');
  cont.innerHTML = `
    <table>
      <thead><tr><th>${m.cabecera[0]}</th><th>${m.cabecera[1]}</th></tr></thead>
      <tbody>${filas}</tbody>
    </table>
    <p class="detalle">Conforme $x$ se acerca al valor indicado, la función se acerca a ${m.objetivo}.</p>`;
  typeset(cont);
}

document.querySelectorAll('.modo').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('.modo').forEach(x => x.classList.remove('sel'));
    b.classList.add('sel');
    pintarTabla(b.dataset.modo);
  };
});
pintarTabla('ln');