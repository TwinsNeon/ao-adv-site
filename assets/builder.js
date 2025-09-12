
(function(){
  const canvas = document.getElementById('neonCanvas');
  const ctx = canvas.getContext('2d');
  const textInput = document.getElementById('textInput');
  const colorInput = document.getElementById('colorInput');
  const fontSelect = document.getElementById('fontSelect');
  const powerBtn = document.getElementById('powerBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const bgSelect = document.getElementById('bgSelect');
  const swatchesWrap = document.getElementById('swatches');

  const PRESETS = ['#ffffff','#fdf2b0','#ffd74d','#ff7b00','#ff1744','#ff66a6','#ff00ff','#aa00ff','#7c4dff','#536dfe','#18ffff','#00e5ff','#00e676','#76ff03'];
  PRESETS.forEach(hex => {
    const b = document.createElement('button');
    b.className = 'swatch';
    b.style.background = hex;
    b.setAttribute('aria-label', hex);
    b.addEventListener('click', () => { colorInput.value = hex; draw(); });
    swatchesWrap.appendChild(b);
  });

  let isOn = true;

  function drawBackground(W, H){
    const bg = bgSelect.value;
    if(bg === 'black'){
      ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H); return;
    }
    if(bg === 'gradient'){
      const g = ctx.createLinearGradient(0,0,W,H);
      g.addColorStop(0, '#050505'); g.addColorStop(1, '#151515');
      ctx.fillStyle = g; ctx.fillRect(0,0,W,H); return;
    }
    if(bg === 'grid'){
      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0,0,W,H);
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(0,255,255,0.15)';
      const step = 40;
      for(let x=0;x<W;x+=step){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for(let y=0;y<H;y+=step){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
      return;
    }
  }

  function draw(){
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);
    drawBackground(W, H);

    const text = textInput.value || 'NEON';
    const color = colorInput.value;
    const font = fontSelect.value;
    const baseSize = Math.max(48, Math.min(140, Math.floor(W / Math.max(6, text.length) * 1.4)));

    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = baseSize + 'px ' + font;

    const x = W/2, y = H/2;

    if(isOn){
      for(let i=12;i>=1;i--){
        ctx.shadowColor = color; ctx.shadowBlur = i*6;
        ctx.strokeStyle = color; ctx.lineWidth = i; ctx.strokeText(text, x, y);
      }
      ctx.shadowColor = color; ctx.shadowBlur = 20;
      ctx.fillStyle = '#ffffff'; ctx.fillText(text, x, y);
      ctx.shadowBlur = 0; ctx.lineWidth = 2; ctx.strokeStyle = color; ctx.strokeText(text, x, y);
    } else {
      ctx.fillStyle = '#222'; ctx.fillText(text, x, y);
      ctx.lineWidth = 2; ctx.strokeStyle = '#333'; ctx.strokeText(text, x, y);
    }
  }

  function togglePower(){ isOn = !isOn; powerBtn.classList.toggle('active', isOn); draw(); }

  textInput.addEventListener('input', draw);
  colorInput.addEventListener('input', draw);
  fontSelect.addEventListener('change', draw);
  bgSelect.addEventListener('change', draw);
  window.addEventListener('resize', draw);
  powerBtn.addEventListener('click', togglePower);
  downloadBtn.addEventListener('click', function(){
    const link = document.createElement('a');
    link.download = 'neon-preview.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  powerBtn.classList.add('active'); draw();
})();
