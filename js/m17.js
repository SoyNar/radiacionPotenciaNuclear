// Módulo 17: corriente → campo, imán → corriente, campos que viajan
window.Dibujos = window.Dibujos || {};
Object.assign(window.Dibujos, {

  // Oersted: una corriente crea un campo magnético. B = μ₀ I / (2π r)
  corriente(el) {
    const MU0 = 4 * Math.PI * 1e-7;
    el.innerHTML = `
      <div class="row"><span class="note">Corriente I:</span>
        <input type="range" min="1" max="20" value="10" class="co-i"><b class="note co-iv">10 A</b></div>
      <div class="row"><span class="note">Distancia r:</span>
        <input type="range" min="5" max="50" value="10" class="co-r"><b class="note co-rv">10 cm</b></div>
      <svg class="fig" viewBox="0 0 420 220">
        <circle cx="210" cy="110" r="30" class="co-c1" fill="none" stroke="#2f6fb0" stroke-width="2"/>
        <circle cx="210" cy="110" r="60" fill="none" stroke="#2f6fb0" stroke-width="2" stroke-opacity=".6"/>
        <circle cx="210" cy="110" r="90" fill="none" stroke="#2f6fb0" stroke-width="2" stroke-opacity=".3"/>
        <circle cx="210" cy="110" r="12" fill="#c8432b"/>
        <text x="205" y="115" class="lbl" fill="#fff">I</text>
        <circle class="co-p" r="7" fill="#2f6fb0"/>
      </svg>
      <p class="hint co-t"></p>`;
    const q = s => el.querySelector(s);
    function calc() {
      const I = +q('.co-i').value, rcm = +q('.co-r').value, r = rcm / 100;
      const B = MU0 * I / (2 * Math.PI * r);
      q('.co-iv').textContent = I + ' A';
      q('.co-rv').textContent = rcm + ' cm';
      // posición del punto de prueba sobre el círculo de radio r (escala visual)
      const px = 210 + Math.min(rcm * 1.6, 90), py = 110;
      q('.co-p').setAttribute('cx', px); q('.co-p').setAttribute('cy', py);
      q('.co-t').innerHTML = `B = μ₀I/2πr = <span class="bl">${(B * 1e6).toFixed(1)} µT</span>. ` +
        `Al alejarte, el campo disminuye. La dirección la da la regla de la mano derecha.`;
    }
    q('.co-i').addEventListener('input', calc);
    q('.co-r').addEventListener('input', calc);
    calc();
  },

  // Faraday y Lenz: mover un imán cerca de una espira induce corriente.
  // Vem = −dφ/dt: la corriente se opone al cambio de flujo.
  induccion(el) {
    el.innerHTML = `
      <div class="row"><span class="note">Mover imán:</span>
        <input type="range" min="-1" max="1" step="0.1" value="0.5" class="in-v"><b class="note in-vv">acercar</b></div>
      <svg class="fig" viewBox="0 0 420 200">
        <ellipse cx="260" cy="100" rx="18" ry="60" fill="none" stroke="#22314a" stroke-width="3"/>
        <rect class="in-m" x="40" y="80" width="90" height="40" rx="6" fill="#c8432b"/>
        <rect x="40" y="80" width="45" height="40" rx="6" fill="#2f6fb0" fill-opacity=".9"/>
        <text x="50" y="106" class="lbl" fill="#fff">N</text>
        <text x="95" y="106" class="lbl" fill="#fff">S</text>
        <path class="in-arr" d="M260 30 L 240 40 M260 30 L 280 40" stroke="#f2c94c" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle class="in-bulb" cx="350" cy="100" r="22" fill="none" stroke="#22314a" stroke-width="3"/>
      </svg>
      <p class="hint in-t"></p>`;
    const q = s => el.querySelector(s);
    let x = 40, v = 0.5, raf = null;
    function estado() {
      const fl = v > 0.05 ? 'acercar' : v < -0.05 ? 'alejar' : 'quieto';
      q('.in-vv').textContent = fl;
      const bulb = Math.min(Math.abs(v), 1);
      q('.in-bulb').setAttribute('fill', `rgba(242,201,76,${bulb.toFixed(2)})`);
      q('.in-arr').setAttribute('opacity', bulb > 0 ? 1 : 0);
      q('.in-t').innerHTML = v === 0
        ? 'Sin movimiento no hay cambio de flujo, y no hay corriente.'
        : (v > 0
          ? 'Al acercar, el flujo sube y la corriente crea un campo que <span class="hl">se opone</span> (Lenz).'
          : 'Al alejar, el flujo baja y la corriente cambia de sentido.');
    }
    function loop() {
      x += v * 1.2;
      if (x > 200) x = 200; if (x < 40) x = 40;
      q('.in-m').setAttribute('x', x);
      raf = requestAnimationFrame(loop);
    }
    q('.in-v').addEventListener('input', () => { v = +q('.in-v').value; estado(); });
    estado();
    raf = requestAnimationFrame(loop);
  },

  // Onda electromagnética: E y B perpendiculares, viajan a c = λ f
  onda(el) {
    const c = 3e8;
    el.innerHTML = `
      <div class="row"><span class="note">Longitud de onda λ:</span>
        <input type="range" min="1" max="10" value="4" class="on-l"><b class="note on-lv">4 m</b></div>
      <svg class="fig" viewBox="0 0 420 200">
        <line x1="10" y1="100" x2="410" y2="100" stroke="#22314a" stroke-width="1" stroke-dasharray="4 6"/>
        <path class="on-e" fill="none" stroke="#c8432b" stroke-width="3"/>
        <path class="on-b" fill="none" stroke="#2f6fb0" stroke-width="3"/>
        <text x="300" y="30" class="lbl" fill="#c8432b">E</text>
        <text x="300" y="185" class="lbl" fill="#2f6fb0">B</text>
      </svg>
      <p class="hint on-t"></p>`;
    const q = s => el.querySelector(s);
    let lam = 4, phase = 0, raf = null;
    function pintar() {
      const k = 2 * Math.PI / (lam * 40);   // escala visual de λ
      let dE = '', dB = '';
      for (let x = 10; x <= 410; x += 4) {
        const y1 = 100 - 60 * Math.sin(k * x - phase);
        const y2 = 100 + 60 * Math.sin(k * x - phase);
        dE += (x === 10 ? 'M' : 'L') + x + ' ' + y1.toFixed(1) + ' ';
        dB += (x === 10 ? 'M' : 'L') + x + ' ' + y2.toFixed(1) + ' ';
      }
      q('.on-e').setAttribute('d', dE);
      q('.on-b').setAttribute('d', dB);
    }
    function calc() {
      const f = c / lam;
      q('.on-lv').textContent = lam + ' m';
      q('.on-t').innerHTML = `f = c / λ = <span class="gr">${(f / 1e6).toFixed(0)} MHz</span>. ` +
        `Cambiar λ cambia la frecuencia, no la velocidad: siempre c ≈ 300 000 km/s.`;
    }
    function loop() { phase += 0.05; pintar(); raf = requestAnimationFrame(loop); }
    q('.on-l').addEventListener('input', () => { lam = +q('.on-l').value; q('.on-lv').textContent = lam + ' m'; calc(); });
    calc();
    raf = requestAnimationFrame(loop);
  }
});