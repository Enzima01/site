document.addEventListener('DOMContentLoaded', () => {

  /*cursor*/
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';

    rx += (e.clientX - rx) * 0.12;
    ry += (e.clientY - ry) * 0.12;
  });

  function animateRing() {
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // hover
  const interactiveEls = document.querySelectorAll('a, .btn, .project-link, .social-btn, .accordion-toggle, .cert-link, .carousel-btn');
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width       = '48px';
      ring.style.height      = '48px';
      ring.style.borderColor = 'var(--green)';
      ring.style.opacity     = '0.8';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width       = '32px';
      ring.style.height      = '32px';
      ring.style.borderColor = 'var(--green)';
      ring.style.opacity     = '0.5';
    });
  });


  /*bolha brilhanteeee*/
  const glow = document.getElementById('glow');
  document.addEventListener('mousemove', e => {
    glow.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
  });


  /*foto — efeito 3D só na foto principal*/
  const mainPhoto = document.getElementById('mainPhoto');
  if (mainPhoto) {
    mainPhoto.addEventListener('mousemove', e => {
      const rect = mainPhoto.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const cx   = rect.width  / 2;
      const cy   = rect.height / 2;
      const rotateY = ((x - cx) / cx)  *  12;
      const rotateX = ((y - cy) / cy)  * -12;
      mainPhoto.style.transform = `perspective(800px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    mainPhoto.addEventListener('mouseleave', () => {
      mainPhoto.style.transform = 'perspective(800px) scale(1) rotateX(0deg) rotateY(0deg)';
    });
  }


  /*scroll*/
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });


  /*certicados ingles — novo chip toggle*/
  const inglesToggle = document.getElementById('ingles-toggle');
  const inglesPanel  = document.getElementById('ingles-certs');

  if (inglesToggle && inglesPanel) {
    inglesToggle.addEventListener('click', () => {
      const isOpen = inglesToggle.getAttribute('aria-expanded') === 'true';
      inglesToggle.setAttribute('aria-expanded', String(!isOpen));
      inglesPanel.setAttribute('aria-hidden',   String(isOpen));
      inglesPanel.classList.toggle('open', !isOpen);
    });
  }


  /* ================================================
     CARROSSEL INFINITO — abordagem simples e confiável
     Apenas 1 clone no início (último original) e
     1 clone no fim (primeiro original).
     Track: [clone_último | orig_0 ... orig_N | clone_primeiro]
     Índices:     0       |   1  ...   N      |     N+1
     Começa em índice 1 (primeiro original).
  ================================================ */
  const track    = document.getElementById('carousel-track');
  const prevBtn  = document.getElementById('carousel-prev');
  const nextBtn  = document.getElementById('carousel-next');
  const dotsWrap = document.getElementById('carousel-dots');

  if (!track || !prevBtn || !nextBtn) return;

  const originals = Array.from(track.children);
  const total     = originals.length;
  let isAnimating = false;

  /* Insere clone do ÚLTIMO original no INÍCIO */
  const cloneFirst = originals[total - 1].cloneNode(true);
  track.insertBefore(cloneFirst, track.firstChild);

  /* Insere clone do PRIMEIRO original no FIM */
  const cloneLast = originals[0].cloneNode(true);
  track.appendChild(cloneLast);

  /* Começa no índice 1 = primeiro card original */
  let cur = 1;

  /* Dots */
  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className  = 'carousel-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Slide ${i + 1}`);
    d.style.cursor = 'none';
    d.addEventListener('click', () => { if (!isAnimating) go(i + 1); });
    dotsWrap.appendChild(d);
  }

  function getW() {
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return track.children[0].getBoundingClientRect().width + gap;
  }

  function setPos(index, animated) {
    track.style.transition = animated
      ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      : 'none';
    track.style.transform = `translateX(-${index * getW()}px)`;
  }

  function syncDots() {
    /* cur vai de 1 a total; dot index vai de 0 a total-1 */
    const real = cur - 1;
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) =>
      d.classList.toggle('active', i === real));
  }

  function go(index) {
    if (isAnimating) return;
    isAnimating = true;
    cur = index;
    setPos(cur, true);
    /* Atualiza dots só para cards reais */
    if (cur >= 1 && cur <= total) syncDots();
  }

  track.addEventListener('transitionend', () => {
    /* Chegou no clone do fim (índice total+1) → salta para orig_0 (índice 1) */
    if (cur === total + 1) {
      cur = 1;
      setPos(cur, false);
      syncDots();
    }
    /* Chegou no clone do início (índice 0) → salta para orig_N (índice total) */
    else if (cur === 0) {
      cur = total;
      setPos(cur, false);
      syncDots();
    }
    isAnimating = false;
  });

  prevBtn.addEventListener('click', () => go(cur - 1));
  nextBtn.addEventListener('click', () => go(cur + 1));
  prevBtn.disabled = false;
  nextBtn.disabled = false;

  /* Touch swipe */
  let txStart = 0;
  track.addEventListener('touchstart', e => { txStart = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (isAnimating) return;
    const diff = txStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) go(diff > 0 ? cur + 1 : cur - 1);
  });

  /* Auto-play a cada 8 segundos */
  let autoPlay = setInterval(() => go(cur + 1), 8000);

  function resetAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => go(cur + 1), 8000);
  }

  prevBtn.addEventListener('click', resetAutoPlay);
  nextBtn.addEventListener('click', resetAutoPlay);
  track.addEventListener('touchend', resetAutoPlay);

  /* Init — double rAF garante que o DOM calculou as larguras antes de posicionar */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setPos(cur, false);
      syncDots();
    });
  });

  window.addEventListener('resize', () => setPos(cur, false));

});
