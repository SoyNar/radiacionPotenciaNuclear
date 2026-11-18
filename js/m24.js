// Módulo 24: difracción por una abertura circular (disco de Airy)
window.Dibujos = window.Dibujos || {};
Object.assign(window.Dibujos, {

  airy(el) {
    const NS = 'http://www.w3.org/2000/svg';
    const LREF = 550, DREF = 20, RHO_REF = 90;       // nm, µm, px del primer anillo oscuro de referencia
    // Función de Bessel J1 por la integral (1/π)∫₀^π cos(τ − x sen τ) dτ (Simpson)
    function J1(x) {
      const n = 200, h = Math.PI / n;
      let s = 0;
      for (let i = 0; i <= n; i++) {
        const t = i * h, w = (i === 0 || i === n) ? 1 : (i % 2 ? 4 : 2);
        s += w * Math.cos(t - x * Math.sin(t));
      }
      return s * h / 3 / Math.PI;
    }
    // Intensidad relativa del patrón de Airy: I(v)/I0 = [2 J1(v) / v]²
    function I(v) { if (Math.abs(v) < 1e-6) return 1; const r = 2 * J1(v) / v; return r * r; }
    el.innerHTML = `
      <div class="row"><span class="note">Longitud de onda λ:</span>
        <input type="range" min="400" max="700" value="550" class="ai-l"><b class="note ai-lv">550 nm</b></div>
      <div class="row"><span class="note">Diámetro D:</span>
        <input type="range" min="5" max="40" value="20" class="ai-d"><b class="note ai-dv">20 µm</b></div>
      <div class="row">
        <svg class="fig" viewBox="0 0 420 420" style="max-width:300px"><rect width="420" height="420" fill="#0b1220"/><g class="ai-g"></g></svg>
        <svg class="fig" viewBox="0 0 420 260" style="max-width:420px"><path class="ai-p" fill="none" stroke="#3c8d5a" stroke-width="3"/><line x1="0" y1="230" x2="420" y2="230" stroke="#22314a"/><text x="10" y="250" class="t">centro → borde</text></svg>
      </div>
      <p class="note ai-t"></p>`;
    const q = s => el.querySelector(s), g = q('.ai-g');
    function dibujar() {
      const lam = +q('.ai-l').value, D = +q('.ai-d').value;
      const rho1 = RHO_REF * (lam / LREF) * (DREF / D);   // radio visual del primer anillo oscuro
      q('.ai-lv').textContent = lam + ' nm';
      q('.ai-dv').textContent = D + ' µm';
      g.innerHTML = '';
      // anillos: un círculo por cada radio, con opacidad = intensidad
      const step = 2;
      let path = '';
      for (let rho = 200; rho >= 0; rho -= step) {
        const v = 3.8317 * rho / rho1;
        const inten = I(v);
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', 210); c.setAttribute('cy', 210); c.setAttribute('r', rho);
        c.setAttribute('fill', `rgba(120,255,170,${inten.toFixed(3)})`);
        g.appendChild(c);
      }
      for (let rho = 0; rho <= 200; rho += 2) {
        const v = 3.8317 * rho / rho1;
        const y = 230 - 200 * I(v);
        path += (rho === 0 ? 'M' : 'L') + (rho * 2.1).toFixed(1) + ' ' + y.toFixed(1) + ' ';
      }
      q('.ai-p').setAttribute('d', path);
      const th = 1.22 * lam * 1e-9 / (D * 1e-6);            // radianes
      q('.ai-t').innerHTML = `Primer anillo oscuro: sen θ ≈ 1,22 λ/D = <span class="gr">${(th * 180 / Math.PI).toFixed(2)}°</span>. ` +
        `Menos D o más λ: el disco se ensancha.`;
    }
    q('.ai-l').addEventListener('input', dibujar);
    q('.ai-d').addEventListener('input', dibujar);
    dibujar();
  }
});