document.addEventListener('DOMContentLoaded', () => {

  /*cursor*/
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let rx = 0, ry = 0;
  let mouseX = 0, mouseY = 0;

  if (dot && ring) {
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    });

    (function loop() {
      rx += (mouseX - rx) * 0.12;
      ry += (mouseY - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button, .btn, .proj-gh-btn, .social-btn, .language-chip-toggle, .cert-link, .contact-link-item, .stat-card, .carousel-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width   = '48px';
        ring.style.height  = '48px';
        ring.style.opacity = '.8';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width   = '32px';
        ring.style.height  = '32px';
        ring.style.opacity = '.5';
      });
    });
  }

  /*glow*/
  const glow = document.getElementById('glow');
  if (glow) {
    document.addEventListener('mousemove', e => {
      glow.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
    });
  }

  /*cards projetos*/
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
    });
  });

  /*carrosel*/
  const track    = document.getElementById('carousel-track');
  const prevBtn  = document.getElementById('carousel-prev');
  const nextBtn  = document.getElementById('carousel-next');
  const dotsWrap = document.getElementById('carousel-dots');

  if (track && prevBtn && nextBtn && dotsWrap) {
    const pages = Array.from(track.querySelectorAll('.carousel-page'));
    const total = pages.length;
    let cur    = 0;
    let isAnim = false;

    pages.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Página ' + (i + 1));
      d.style.cursor = 'none';
      d.addEventListener('click', () => { if (!isAnim) go(i); });
      dotsWrap.appendChild(d);
    });

    function setPos(index, animated) {
      track.style.transition = animated ? 'transform .5s cubic-bezier(.25,.46,.45,.94)' : 'none';
      track.style.transform  = 'translateX(-' + (index * 100) + '%)';
    }

    function syncDots() {
      dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === cur);
      });
    }

    function go(index) {
      if (isAnim) return;
      isAnim = true;
      cur = (index + total) % total;
      setPos(cur, true);
      syncDots();
      setTimeout(() => { isAnim = false; }, 550);
    }

    prevBtn.addEventListener('click', () => go(cur - 1));
    nextBtn.addEventListener('click', () => go(cur + 1));

    let txStart = 0;
    track.addEventListener('touchstart', e => { txStart = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = txStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) go(diff > 0 ? cur + 1 : cur - 1);
    });

    let auto = setInterval(() => go(cur + 1), 10000);
    const resetAuto = () => {
      clearInterval(auto);
      auto = setInterval(() => go(cur + 1), 10000);
    };
    prevBtn.addEventListener('click', resetAuto);
    nextBtn.addEventListener('click', resetAuto);

    requestAnimationFrame(() => requestAnimationFrame(() => { setPos(cur, false); syncDots(); }));
    window.addEventListener('resize', () => setPos(cur, false));
  }

  /*scroll fade in*/
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animationPlayState = 'running';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.animationPlayState = 'paused';
    obs.observe(el);
  });

  /*ingles accordion*/
  const toggle = document.getElementById('ingles-toggle');
  const panel  = document.getElementById('ingles-certs');
  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      panel.setAttribute('aria-hidden', String(open));
      panel.classList.toggle('open', !open);
    });
  }

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <div class="lightbox-inner">
      <div class="lightbox-img-wrap">
        <button class="lightbox-close" id="lightbox-close" aria-label="Fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <img id="lightbox-img" src="" alt="" />
      </div>
      <span class="lightbox-caption" id="lightbox-caption"></span>
    </div>
  `;
  document.body.appendChild(overlay);
 
  const lbImg     = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const lbClose   = document.getElementById('lightbox-close');
 
  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt;
    lbCaption.textContent = alt;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
 
  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
 
  document.querySelectorAll('.proj-card-img').forEach(wrap => {
    const img = wrap.querySelector('img');
    if (!img) return;
    wrap.addEventListener('click', () => openLightbox(img.src, img.alt));
  });
 
  lbClose.addEventListener('click', closeLightbox);
 
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeLightbox();
  });
 
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
 
  /* Cursor ring no lightbox */
  [lbClose].forEach(el => {
    if (!ring) return;
    el.addEventListener('mouseenter', () => { ring.style.width = '48px'; ring.style.height = '48px'; ring.style.opacity = '.8'; });
    el.addEventListener('mouseleave', () => { ring.style.width = '32px'; ring.style.height = '32px'; ring.style.opacity = '.5'; });
  });

  /*scroll com offset*/
  const navEl = document.querySelector('nav');

  let lastScroll = 0;
window.addEventListener('scroll', () => {
  const cur = window.scrollY;
  if (cur > lastScroll && cur > 80) {
    navEl.classList.add('nav--hidden');
  } else {
    navEl.classList.remove('nav--hidden');
  }
  lastScroll = cur;
}, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href').slice(1);

      if (targetId === 'home' || targetId === '') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.getElementById(targetId);
      if (!target) return;

      const navHeight = navEl ? navEl.getBoundingClientRect().height : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: targetTop - navHeight - 16, behavior: 'smooth' });
    });
  });

});
