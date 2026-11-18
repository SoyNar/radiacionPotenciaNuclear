document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("vectorCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const rangeX = document.getElementById("rangeX");
  const rangeY = document.getElementById("rangeY");
  const valX = document.getElementById("valX");
  const valY = document.getElementById("valY");
  const magResult = document.getElementById("magResult");
  const angResult = document.getElementById("angResult");

  function drawVector() {
    const x = parseFloat(rangeX.value);
    const y = parseFloat(rangeY.value);

    valX.textContent = x;
    valY.textContent = y;

    const magnitud = Math.sqrt(x * x + y * y);
    const anguloRad = Math.atan2(y, x);
    let anguloDeg = (anguloRad * 180) / Math.PI;
    if (anguloDeg < 0) anguloDeg += 360;

    magResult.textContent = magnitud.toFixed(2);
    angResult.textContent = anguloDeg.toFixed(2) + "°";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const originX = canvas.width / 2;
    const originY = canvas.height / 2;
    const scale = 22; // Escala de píxeles por unidad

    // 1. Cuadrícula de fondo sutil estilo papel milimetrado
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1;

    for (let i = 0; i < canvas.width; i += scale) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += scale) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(canvas.width, j);
      ctx.stroke();
    }

    // 2. Ejes principales X e Y
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(canvas.width, originY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, canvas.height);
    ctx.stroke();

    const destX = originX + x * scale;
    const destY = originY - y * scale;

    // 3. Líneas de proyección punteadas hacia los ejes
    ctx.strokeStyle = "#94a3b8";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;

    // Proyección sobre eje X
    ctx.beginPath();
    ctx.moveTo(destX, originY);
    ctx.lineTo(destX, destY);
    ctx.stroke();

    // Proyección sobre eje Y
    ctx.beginPath();
    ctx.moveTo(originX, destY);
    ctx.lineTo(destX, destY);
    ctx.stroke();
    ctx.setLineDash([]); // Resetear líneas punteadas

    // 4. Vector principal v con sombra suave
    ctx.strokeStyle = "#c8432b";
    ctx.fillStyle = "#c8432b";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(destX, destY);
    ctx.stroke();

    // 5. Punta de flecha elegante
    const headLen = 10;
    const angle = Math.atan2(destY - originY, destX - originX);
    ctx.beginPath();
    ctx.moveTo(destX, destY);
    ctx.lineTo(destX - headLen * Math.cos(angle - Math.PI / 6), destY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(destX - headLen * Math.cos(angle + Math.PI / 6), destY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.lineTo(destX, destY);
    ctx.fill();

    // 6. Círculo en el origen y etiqueta del vector
    ctx.beginPath();
    ctx.arc(originX, originY, 3.5, 0, 2 * Math.PI);
    ctx.fillStyle = "#1a2638";
    ctx.fill();

    ctx.font = "600 13px Inter, sans-serif";
    ctx.fillStyle = "#1a2638";
    ctx.fillText(`v (${x}, ${y})`, destX + 10, destY - 8);
  }

  rangeX.addEventListener("input", drawVector);
  rangeY.addEventListener("input", drawVector);

  drawVector();
});