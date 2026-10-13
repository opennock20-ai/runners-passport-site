'use strict';

/**
 * The Passport — accessible editorial product tour.
 * Stills are concept images; there are no orders or server-side uploads.
 * High-resolution replacement photos automatically take over once uploaded
 * to /assets under the names listed below.
 */
(() => {
  const $ = (id) => document.getElementById(id);
  const stage = $('book-photo-frame');
  const picture = $('book-main-photo');
  const photoTrigger = $('book-photo-trigger');
  const cta = $('book-open-cta');
  const previous = $('book-prev');
  const next = $('book-next');
  if (!stage || !picture || !photoTrigger || !cta || !previous || !next) return;

  const slides = [
    {
      category: '01 / THE COVER', title: 'A beautiful beginning.',
      description: 'Sage-green linen. An emblem of the miles ahead.',
      filename: '/assets/passport-cover.webp',
      fallback: '/assets/album-craft.webp',
      alt: "The sage-green linen Runner's Passport album, closed on a warm surface"
    },
    {
      category: '02 / YOUR IDENTITY', title: 'A passport of your own.',
      description: 'A home for your name, your running story and every milestone.',
      filename: '/assets/album-inside.webp',
      fallback: '/assets/album-inside.webp',
      alt: "Inside the passport: its personalised identity-page concept"
    },
    {
      category: '03 / THE COLLECTION', title: 'Every race has a place.',
      description: 'Turn the page. Two cards per page, each a finish line worth keeping.',
      filename: '/assets/passport-spread.webp',
      fallback: '/assets/album-pages.webp',
      alt: "The open Runner's Passport filled with illustrated race cards, two per page"
    },
    {
      category: '04 / THE DETAILS', title: 'Made to be kept.',
      description: 'The linen texture, the binding and the care in every little detail.',
      filename: '/assets/passport-detail.webp',
      fallback: '/assets/album-craft.webp',
      alt: "A close-up of the album's textured linen cover and bookbinding"
    }
  ];
  let current = 2, turning = false, swipeStart = null, suppressNextClick = false;

  function getImageSource(slide) {
    if (slide.filename === slide.fallback) return Promise.resolve(slide.fallback);
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(slide.filename);
      img.onerror = () => resolve(slide.fallback);
      img.src = slide.filename;
    });
  }

  function paintControls() {
    const slide = slides[current];
    $('book-slide-category').textContent = slide.category;
    $('book-slide-title').textContent = slide.title;
    $('book-slide-description').textContent = slide.description;
    $('book-count-top').textContent = String(current + 1).padStart(2, '0') + ' OF 04';
    $('book-photo-numeral').textContent = ['I', 'II', 'III', 'IV'][current];
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    photoTrigger.setAttribute('aria-label',
      current === slides.length - 1
        ? 'Return to the first view of the Runner’s Passport'
        : 'Turn to the next page of the Runner’s Passport');
    document.querySelectorAll('[data-book-index]').forEach((dot) => {
      const selected = Number(dot.dataset.bookIndex) === current;
      dot.classList.toggle('active', selected);
      if (selected) dot.setAttribute('aria-current', 'step');
      else dot.removeAttribute('aria-current');
    });
  }

  async function showPage(number) {
    if (turning || number < 0 || number >= slides.length || number === current) return;
    turning = true;
    stage.classList.add('is-loading');
    const image = await getImageSource(slides[number]);
    const backward = number < current;
    stage.classList.toggle('reverse', backward);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion) stage.classList.add('is-turning');
    window.setTimeout(() => {
      picture.src = image;
      picture.alt = slides[number].alt;
      current = number;
      paintControls();
    }, reducedMotion ? 0 : 305);
    window.setTimeout(() => {
      turning = false;
      stage.classList.remove('is-turning', 'reverse', 'is-loading');
    }, reducedMotion ? 0 : 690);
  }

  previous.addEventListener('click', () => showPage(current - 1));
  next.addEventListener('click', () => showPage(current + 1));
  cta.addEventListener('click', () => {
    showPage(current === 0 ? 1 : Math.min(current + 1, slides.length - 1));
    if (window.matchMedia('(max-width: 880px)').matches) {
      stage.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center'});
    }
  });
  photoTrigger.addEventListener('click', () => {
    if (suppressNextClick) { suppressNextClick = false; return; }
    showPage(current === slides.length - 1 ? 0 : current + 1);
  });
  document.querySelectorAll('[data-book-index]').forEach((dot) => {
    dot.addEventListener('click', () => showPage(Number(dot.dataset.bookIndex)));
  });

  // Touch swipe is optional: arrow buttons and image click work on all devices.
  photoTrigger.addEventListener('touchstart', (e) => {
    swipeStart = e.changedTouches[0]?.clientX ?? null;
  }, {passive: true});
  photoTrigger.addEventListener('touchend', (e) => {
    if (swipeStart === null) return;
    const diff = (e.changedTouches[0]?.clientX ?? swipeStart) - swipeStart;
    swipeStart = null;
    if (Math.abs(diff) < 45) return;
    suppressNextClick = true;
    window.setTimeout(() => {suppressNextClick = false;}, 400);
    showPage(current + (diff < 0 ? 1 : -1));
  }, {passive: true});

  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); showPage(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); showPage(current - 1); }
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && stage.classList.contains('is-turning')) {
      stage.classList.remove('is-turning', 'reverse', 'is-loading');
      turning = false;
    }
  });
  // Try the new images, with existing album shots as safe fallbacks.
  getImageSource(slides[0]).then((src) => { if (current === 0) picture.src = src; });
  const detail = $('album-detail-photo');
  if (detail) getImageSource(slides[3]).then((src) => { detail.src = src; });
  paintControls();
})();