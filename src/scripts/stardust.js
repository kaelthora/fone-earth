/**
 * Stardust text reveal: golden particles swirl then converge to form text.
 * Cinematic enhancements: stronger convergence, formation flash, afterglow, residual particles, scale pulse.
 * Lightweight, no deps. Triggered by IntersectionObserver.
 */
const GOLD = '#D4AF37';
const PARTICLE_COUNT = 120;
const DURATION_MS = 3000;
const PHASE1_MS = 900;
const PHASE2_MS = 2100;
const CONVERGE_FINAL_MS = 600;
const LERP_NORMAL = 0.12;
const LERP_FINAL = 0.22;
const RADIAL_PULL = 0.018;
const RESIDUAL_RATIO = 0.15;
const FLASH_DURATION_MS = 120;
const FLASH_PEAK_OPACITY = 0.4;
const AFTERGLOW_DURATION_MS = 2000;
const SCALE_PULSE_DELAY_MS = 400;
const SCALE_PULSE_VALUE = 1.01;
const SCALE_PULSE_DURATION_MS = 250;

export function initStardust(wrapperEl) {
  if (!wrapperEl) return;
  const canvas = wrapperEl.querySelector('.stardust-canvas');
  const textEl = wrapperEl.querySelector('.stardust-text');
  if (!canvas || !textEl) return;

  const startAnimation = () => runAnimation(wrapperEl, canvas, textEl);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startAnimation();
        observer.disconnect();
      }
    });
  }, { threshold: 0.15, rootMargin: "40px" });

  observer.observe(wrapperEl);

  const rect = wrapperEl.getBoundingClientRect();
  const alreadyVisible =
    rect.top < window.innerHeight &&
    rect.bottom > 0;

  if (alreadyVisible) {
    startAnimation();
    observer.disconnect();
  }
}

function runAnimation(wrapperEl, canvas, textEl) {
  const rect = wrapperEl.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width));
  const h = Math.max(1, Math.round(rect.height));

  canvas.width = w;
  canvas.height = h;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const textRect = textEl.getBoundingClientRect();
  const wrapperRect = wrapperEl.getBoundingClientRect();
  const tx = textRect.left - wrapperRect.left;
  const ty = textRect.top - wrapperRect.top;
  const computed = getComputedStyle(textEl);
  const font = computed.font || `${computed.fontSize} ${computed.fontFamily}`;
  const text = (textEl.textContent || '').trim();
  if (!text) return;

  const targets = getTextMaskPoints(w, h, text, font, tx, ty);
  if (targets.length === 0) return;

  const centerX = targets.reduce((s, t) => s + t.x, 0) / targets.length;
  const centerY = targets.reduce((s, t) => s + t.y, 0) / targets.length;
  const residualCount = Math.max(1, Math.floor(PARTICLE_COUNT * RESIDUAL_RATIO));

  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = targets[i % targets.length];
    const residual = i < residualCount;
    const angle = residual ? Math.random() * Math.PI * 2 : 0;
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      targetX: t.x,
      targetY: t.y,
      radius: 1.2,
      residual,
      driftVx: residual ? Math.cos(angle) * 0.8 : 0,
      driftVy: residual ? Math.sin(angle) * 0.8 : 0,
      alpha: 1,
    });
  }

  const startTime = performance.now();
  let formationDone = false;
  textEl.style.transition = 'opacity 0.5s ease-out';

  function runFormationFlash() {
    const overlay = document.createElement('div');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText = 'position:absolute;inset:0;pointer-events:none;border-radius:inherit;';
    overlay.style.background = 'radial-gradient(circle at center, rgba(212,175,55,0.25) 0%, transparent 70%)';
    overlay.style.filter = 'blur(12px)';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 60ms ease-out';
    wrapperEl.appendChild(overlay);
    overlay.offsetHeight;
    overlay.style.opacity = String(FLASH_PEAK_OPACITY);
    setTimeout(() => {
      overlay.style.transition = 'opacity 60ms ease-in';
      overlay.style.opacity = '0';
      setTimeout(() => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 70);
    }, FLASH_DURATION_MS / 2);
  }

  function runAfterglow() {
    const afterglowStart = performance.now();
    function afterglowTick(now) {
      const t = Math.min(1, (now - afterglowStart) / AFTERGLOW_DURATION_MS);
      const ease = 1 - t * t;
      const a1 = 0.4 * ease;
      const a2 = 0.2 * ease;
      textEl.style.textShadow = `0 0 6px rgba(212,175,55,${a1}), 0 0 18px rgba(212,175,55,${a2})`;
      if (t < 1) requestAnimationFrame(afterglowTick);
    }
    requestAnimationFrame(afterglowTick);
  }

  function runScalePulse() {
    textEl.style.transition = `transform ${SCALE_PULSE_DURATION_MS}ms ease-out`;
    textEl.style.transform = `scale(${SCALE_PULSE_VALUE})`;
    setTimeout(() => {
      textEl.style.transform = 'scale(1)';
    }, SCALE_PULSE_DURATION_MS);
  }

  function tick(now) {
    const elapsed = now - startTime;
    const inPhase1 = elapsed < PHASE1_MS;
    const inConvergeFinal = !inPhase1 && elapsed >= DURATION_MS - CONVERGE_FINAL_MS;
    const pastFormation = elapsed >= DURATION_MS;

    if (pastFormation && !formationDone) {
      formationDone = true;
      textEl.style.opacity = '1';
      runFormationFlash();
      runAfterglow();
      setTimeout(runScalePulse, SCALE_PULSE_DELAY_MS);
    }

    const anyResidualVisible = particles.some(p => p.residual && p.alpha > 0.01);
    if (pastFormation && !anyResidualVisible) {
      canvas.style.opacity = '0';
      canvas.style.transition = 'opacity 0.4s ease-out';
      return;
    }

    ctx.clearRect(0, 0, w, h);

    particles.forEach((p) => {
      if (inPhase1) {
        p.vx += (Math.random() - 0.5) * 0.25;
        p.vy += (Math.random() - 0.5) * 0.25;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        p.x = ((p.x % w) + w) % w;
        p.y = ((p.y % h) + h) % h;
      } else if (p.residual && pastFormation) {
        p.x += p.driftVx;
        p.y += p.driftVy;
        p.alpha = Math.max(0, p.alpha - 0.012);
      } else if (!p.residual || !pastFormation) {
        const lerp = inConvergeFinal ? LERP_FINAL : LERP_NORMAL;
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        p.x += dx * lerp;
        p.y += dy * lerp;
        if (inConvergeFinal) {
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const ax = (dx / dist) * RADIAL_PULL * Math.min(dist, 40);
          const ay = (dy / dist) * RADIAL_PULL * Math.min(dist, 40);
          p.x += ax;
          p.y += ay;
        }
        if (p.residual && inConvergeFinal) {
          p.driftVx += (p.x - centerX) * 0.0008;
          p.driftVy += (p.y - centerY) * 0.0008;
        }
      }
    });

    const fadeStart = DURATION_MS - 600;
    if (elapsed > fadeStart && !pastFormation) {
      const fade = (elapsed - fadeStart) / 600;
      textEl.style.opacity = String(Math.min(1, fade));
    }
    const mainCanvasFade = elapsed > fadeStart && !pastFormation ? 1 - (elapsed - fadeStart) / 600 : 1;
    const canvasAlpha = pastFormation ? 1 : mainCanvasFade;
    ctx.globalAlpha = Math.max(0, canvasAlpha);

    ctx.fillStyle = GOLD;
    particles.forEach((p) => {
      if (pastFormation && !p.residual) return;
      if (p.residual && p.alpha <= 0) return;
      const a = p.residual ? p.alpha : 1;
      ctx.globalAlpha = canvasAlpha * a;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function getTextMaskPoints(w, h, text, font, offsetX, offsetY) {
  const temp = document.createElement('canvas');
  temp.width = w;
  temp.height = h;
  const tctx = temp.getContext('2d');
  if (!tctx) return [];

  tctx.font = font;
  tctx.textBaseline = 'top';
  tctx.fillStyle = 'white';
  tctx.fillText(text, Math.max(0, offsetX), Math.max(0, offsetY));

  const id = tctx.getImageData(0, 0, w, h);
  const data = id.data;
  const points = [];
  const step = 2;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      if (data[i + 3] > 128) points.push({ x, y });
    }
  }
  for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
  }
  return points.slice(0, PARTICLE_COUNT);
}
