// Módulo 22: penetración de α, β y γ
window.Dibujos = window.Dibujos || {};
// Widgets reutilizables. Cada función recibe un contenedor (elemento DOM) y lo llena.
Object.assign(window.Dibujos, {
  penetracion(el) {
    const MAT = {
      papel:    { x: 170, c: '#e8d9b0', s: ['a'] },
      aluminio: { x: 235, c: '#b9c6d3', s: ['a', 'b'] },
      plomo:    { x: 300, c: '#6b6b78', s: ['a', 'b', 'g'] }
    };
    const RAYS = [
      { id: 'a', n: 'α', y: 90,  amp: 0, col: '#c8432b', w: 5 },
      { id: 'b', n: 'β', y: 130, amp: 5, col: '#2f6fb0', w: 3 },
      { id: 'g', n: 'γ', y: 170, amp: 9, col: '#3c8d5a', w: 3 }
    ];
    const NS = 'http://www.w3.org/2000/svg';

    el.innerHTML = `
      <div class="row">${Object.keys(MAT).map(k =>
        `<button class="btn mbtn" data-m="${k}">${k}</button>`).join('')}</div>
      <svg class="fig" viewBox="0 0 420 210"><g id="pen-g"></g></svg>
      <p class="note res"></p>`;

    const g = el.querySelector('#pen-g');
    RAYS.forEach(r => {
      let d = `M90 ${r.y}`;
      for (let x = 94; x <= 400; x += 4) d += ` L${x} ${(r.y + r.amp * Math.sin(x / 5)).toFixed(1)}`;
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('pathLength', '100');
      p.setAttribute('stroke', r.col);
      p.setAttribute('stroke-width', r.w);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke-linecap', 'round');
      p.dataset.id = r.id;
      g.appendChild(p);
    });
    const nucleo = document.createElementNS(NS, 'circle');
    nucleo.setAttribute('cx', 60); nucleo.setAttribute('cy', 110); nucleo.setAttribute('r', 26);
    nucleo.setAttribute('fill', '#c8432b'); nucleo.setAttribute('fill-opacity', '.2');
    g.prepend(nucleo);
    const bar = document.createElementNS(NS, 'rect');
    bar.setAttribute('y', 30); bar.setAttribute('width', 12); bar.setAttribute('height', 165);
    bar.setAttribute('rx', 2); bar.setAttribute('stroke', '#22314a'); bar.setAttribute('stroke-width', 2);
    g.appendChild(bar);
    const etiqueta = document.createElementNS(NS, 'text');
    etiqueta.setAttribute('class', 't'); etiqueta.setAttribute('y', 25);
    g.appendChild(etiqueta);

    function aplicar(k) {
      const M = MAT[k];
      bar.setAttribute('x', M.x - 6);
      bar.setAttribute('fill', M.c);
      etiqueta.setAttribute('x', M.x - 22);
      etiqueta.textContent = k;
      const pasan = [], paran = [];
      RAYS.forEach(r => {
        const hit = M.s.includes(r.id);
        g.querySelector(`[data-id="${r.id}"]`)
          .setAttribute('stroke-dasharray', (hit ? (M.x - 90) / 310 * 100 : 100).toFixed(1) + ' 100');
        (hit ? paran : pasan).push(r.n);
      });
      el.querySelector('.res').innerHTML =
        `<span class="gr">Atraviesan: ${pasan.length ? pasan.join(', ') : 'ninguna'}</span> · ` +
        `<span class="hl">Se detienen: ${paran.join(', ')}</span>`;
      el.querySelectorAll('.mbtn').forEach(b => b.classList.toggle('sel', b.dataset.m === k));
    }
    el.querySelectorAll('.mbtn').forEach(b => b.addEventListener('click', () => aplicar(b.dataset.m)));
    aplicar('papel');
  }
});

// Widget interactivo para explicar el desbalance protón/neutrón
Object.assign(window.Dibujos, {
  equilibrio(el) {
    el.innerHTML = `
      <div class="row">
        <button class="btn" id="eq-mas-n">Añadir neutrones (Estable)</button>
        <button class="btn" id="eq-mas-p">Exceso de protones (Inestable)</button>
      </div>
      <p class="msg" id="eq-msg">El núcleo necesita un pegamento adecuado (neutrones) para mantener unidos a los protones que se repelen.</p>`;
    
    el.querySelector('#eq-mas-n').addEventListener('click', () => {
      el.querySelector('#eq-msg').textContent = '¡Buen balance! La fuerza nuclear fuerte domina y el núcleo está estable.';
    });
    el.querySelector('#eq-mas-p').addEventListener('click', () => {
      el.querySelector('#eq-msg').textContent = '¡Peligro! Demasiados protones con carga positiva se repelen eléctricamente. El núcleo expulsa partículas para sanar.';
    });
  }
});

// Módulo 22: interacciones cortas (tocar → texto breve)
Object.assign(window.Dibujos, {

  tipos(el) {
    const T = {
      a: 'α · núcleo de helio (2p + 2n). Se frena con una hoja de papel.',
      b: 'β · electrón (o positrón). Atraviesa el papel; se frena con aluminio.',
      g: 'γ · onda electromagnética. Sin masa ni carga; se frena con plomo grueso.'
    };
    el.innerHTML = `
      <div class="tiles">
        <button class="tile a" data-k="a">α</button>
        <button class="tile b" data-k="b">β</button>
        <button class="tile g" data-k="g">γ</button>
      </div>
      <p class="msg">Toca una letra.</p>`;
    el.querySelectorAll('.tile').forEach(b => b.addEventListener('click', () => {
      el.querySelectorAll('.tile').forEach(x => x.classList.toggle('sel', x === b));
      el.querySelector('.msg').textContent = T[b.dataset.k];
    }));
  },

  naturaleza(el) {
    const T = {
      t: 'Viene de electrones y de la vibración de los átomos.',
      n: 'Viene del núcleo inestable. Es la que estudiamos aquí.'
    };
    el.innerHTML = `
      <div class="tiles">
        <button class="btn nb" data-k="t">térmica</button>
        <button class="btn nb" data-k="n">nuclear</button>
      </div>
      <p class="msg">¿De dónde sale?</p>`;
    el.querySelectorAll('.nb').forEach(b => b.addEventListener('click', () => {
      el.querySelectorAll('.nb').forEach(x => x.classList.toggle('sel', x === b));
      el.querySelector('.msg').textContent = T[b.dataset.k];
    }));
  },

  cesio(el) {
    el.innerHTML = `
      <div class="nucleo" id="ces-n"><span id="ces-t">Cs</span><small id="ces-z">Z = 55 · A = 137</small></div>
      <div class="row"><button class="btn" id="ces-go">Emitir electrón (β⁻)</button><button class="btn" id="ces-rst">↺</button></div>
      <p class="msg" id="ces-msg">Un neutrón del núcleo se convierte en protón y suelta un electrón.</p>`;
    const n = el.querySelector('#ces-n');
    el.querySelector('#ces-go').addEventListener('click', () => {
      n.classList.add('ba');
      el.querySelector('#ces-t').textContent = 'Ba';
      el.querySelector('#ces-z').innerHTML = 'Z = 56 · A = 137';
      el.querySelector('#ces-msg').innerHTML = 'Ahora es bario. <b>A no cambió</b>, Z subió 1.';
    });
    el.querySelector('#ces-rst').addEventListener('click', () => {
      n.classList.remove('ba');
      el.querySelector('#ces-t').textContent = 'Cs';
      el.querySelector('#ces-z').innerHTML = 'Z = 55 · A = 137';
      el.querySelector('#ces-msg').textContent = 'Un neutrón del núcleo se convierte en protón y suelta un electrón.';
    });
  }
});

// ¿Qué es la radiación? Un núcleo estable y uno inestable.
Object.assign(window.Dibujos, {
  que(el) {
    el.innerHTML = `
      <div class="atomo-box" id="que-box">
        <div class="nucleo" id="que-n" style="width:110px;height:110px;font-size:24px">núcleo</div>
      </div>
      <div class="row">
        <button class="btn" id="que-b">Hacer inestable</button>
        <button class="btn" id="que-r">↺ Estable</button>
      </div>
      <p class="msg" id="que-m">Toca el botón. Todo átomo tiene un núcleo.</p>`;
    const box = el.querySelector('#que-box'), n = el.querySelector('#que-n'), m = el.querySelector('#que-m');
    el.querySelector('#que-b').addEventListener('click', () => {
      m.textContent = 'Núcleo inestable: suelta energía y partículas para estabilizarse.';
      const p = document.createElement('span');
      p.className = 'particula';
      p.style.left = '50%'; p.style.top = '50%';
      box.appendChild(p);
      setTimeout(() => p.remove(), 1300);
      n.style.borderColor = 'var(--red)';
      n.style.color = 'var(--red)';
    });
    el.querySelector('#que-r').addEventListener('click', () => {
      n.style.borderColor = ''; n.style.color = '';
      m.textContent = 'Núcleo estable: no emite nada.';
    });
  }
});