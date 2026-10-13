
/* Runner's Passport / editorial interactions */
(() => {
  'use strict';
  const header = document.querySelector('.site-nav');
  const progress = document.querySelector('.scroll-line');
  const toggle = document.querySelector('.menu-toggle');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setScrollState = () => {
    const scroll = window.scrollY || 0;
    header.classList.toggle('is-scrolled', scroll > 45);
    const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.width = (Math.min(1, scroll / total) * 100) + '%';
  };
  let pending = false;
  window.addEventListener('scroll', () => {
    if (!pending) {
      pending = true;
      requestAnimationFrame(() => { setScrollState(); pending = false; });
    }
  }, { passive: true });
  setScrollState();

  if (toggle) {
    const closeMenu = () => {
      header.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    };
    toggle.addEventListener('click', () => {
      const opening = !header.classList.contains('menu-open');
      header.classList.toggle('menu-open', opening);
      document.body.classList.toggle('menu-open', opening);
      toggle.setAttribute('aria-expanded', opening ? 'true' : 'false');
      toggle.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
    });
    document.querySelectorAll('.mobile-nav a').forEach(link => link.addEventListener('click', closeMenu));
    window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); });
  }

  const reveals = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !reduced) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .1, rootMargin: '0px 0px -45px 0px' });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in-view'));
  }

  const album = document.querySelector('#album-image');
  const albumButtons = [...document.querySelectorAll('[data-album-image]')];
  const albumCaption = document.querySelector('#album-caption');
  albumButtons.forEach(button => {
    button.addEventListener('click', () => {
      const src = button.getAttribute('data-album-image');
      const alt = button.getAttribute('data-album-alt') || 'Runner’s Passport album';
      const caption = button.getAttribute('data-album-caption') || 'THE PASSPORT';
      if (!src || !album) return;
      const image = new Image();
      image.onload = () => {
        album.style.opacity = '0.25';
        requestAnimationFrame(() => {
          album.src = src;
          album.alt = alt;
          albumCaption.textContent = caption;
          album.style.opacity = '1';
        });
      };
      image.src = src;
      albumButtons.forEach(b => {
        const selected = b === button;
        b.classList.toggle('active', selected);
        b.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
    });
  });

  const pack = document.querySelector('#sample-pack');
  const sealButton = document.querySelector('#unseal');
  if (pack && sealButton) {
    sealButton.addEventListener('click', () => {
      const open = pack.classList.toggle('open');
      sealButton.setAttribute('aria-pressed', open ? 'true' : 'false');
      sealButton.querySelector('.unseal-label').textContent = open ? 'Seal the sample again' : 'Unseal a sample card';
    });
  }
})();
