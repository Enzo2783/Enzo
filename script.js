document.getElementById('year').textContent = new Date().getFullYear();

// Animated night-circuit background: glowing light streaks
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const streaks = [];
const STREAK_COUNT = 18;

function randomStreak(){
  const horizontal = Math.random() > 0.5;
  return {
    horizontal,
    pos: horizontal ? Math.random() * canvas.height : Math.random() * canvas.width,
    progress: Math.random(),
    speed: 0.0015 + Math.random() * 0.003,
    length: 150 + Math.random() * 250,
    width: 1 + Math.random() * 2,
    hue: Math.random() > 0.5 ? '225,6,0' : '255,255,255',
    direction: Math.random() > 0.5 ? 1 : -1
  };
}

for(let i=0;i<STREAK_COUNT;i++) streaks.push(randomStreak());

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // base gradient
  const grad = ctx.createRadialGradient(canvas.width/2, 0, 0, canvas.width/2, 0, canvas.height);
  grad.addColorStop(0, '#161b24');
  grad.addColorStop(1, '#0a0c10');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(const s of streaks){
    s.progress += s.speed;
    if(s.progress > 1.3) {
      Object.assign(s, randomStreak(), {progress: -0.2});
    }

    const span = s.horizontal ? canvas.width : canvas.height;
    const center = (s.progress * (span + s.length)) - s.length/2;
    const start = center - s.length/2;
    const end = center + s.length/2;

    let x1,y1,x2,y2;
    if(s.horizontal){
      y1 = y2 = s.pos;
      x1 = s.direction === 1 ? start : span - start;
      x2 = s.direction === 1 ? end : span - end;
    } else {
      x1 = x2 = s.pos;
      y1 = s.direction === 1 ? start : span - start;
      y2 = s.direction === 1 ? end : span - end;
    }

    const lg = ctx.createLinearGradient(x1,y1,x2,y2);
    lg.addColorStop(0, `rgba(${s.hue},0)`);
    lg.addColorStop(0.5, `rgba(${s.hue},0.7)`);
    lg.addColorStop(1, `rgba(${s.hue},0)`);

    ctx.strokeStyle = lg;
    ctx.lineWidth = s.width;
    ctx.shadowBlur = 12;
    ctx.shadowColor = `rgba(${s.hue},0.8)`;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;

  requestAnimationFrame(draw);
}
draw();
