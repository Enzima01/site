
document.addEventListener('DOMContentLoaded', () => {

  /*cursor*/
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let rx = 0, ry = 0;

  // mouse
  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';

    // efeito lag
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
  const interactiveEls = document.querySelectorAll('a, .btn, .project-link, .social-btn, .accordion-toggle, .cert-link');
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


  /*foto e projetos*/
  document.querySelectorAll('.track-3d').forEach(el => {

    const factor = el.id === 'mainPhoto' ? 12 : 8;

    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const cx   = rect.width  / 2;
      const cy   = rect.height / 2;

      const rotateY = ((x - cx) / cx)  *  factor;
      const rotateX = ((y - cy) / cy)  * -factor;

      el.style.transform = `perspective(800px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      //efeito customizado css
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(800px) scale(1) rotateX(0deg) rotateY(0deg)';
    });
  });


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


  /*certicados ingles*/
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

});
