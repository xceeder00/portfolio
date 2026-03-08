(function () {
  'use strict';

  var scrollObserver;
  if ('IntersectionObserver' in window) {
    scrollObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          scrollObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
  }

  function observeAnimElements() {
    if (!scrollObserver) {
      document.querySelectorAll('.anim-fade-up, .anim-fade-in').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }
    document.querySelectorAll('.anim-fade-up:not(.is-visible), .anim-fade-in:not(.is-visible)').forEach(function (el) {
      scrollObserver.observe(el);
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Portfolio hero fade on scroll
  var heroSection = document.querySelector('.portfolio-hero');
  if (heroSection) {
    var heroHeight = heroSection.offsetHeight;
    window.addEventListener('scroll', function () {
      var opacity = 1 - window.scrollY / (heroHeight * 0.5);
      opacity = Math.max(0, Math.min(1, opacity));
      heroSection.style.opacity = opacity;
    });
  }

  // ==========================================
  // Portfolio Grid — Dynamic Rendering
  // ==========================================
  var gridEl = document.getElementById('projects-grid');
  var filtersEl = document.getElementById('filters');

  if (gridEl && typeof PROJECTS !== 'undefined') {
    var activeTag = 'All';

    function getAllTags() {
      var tagSet = {};
      PROJECTS.forEach(function (p) {
        p.tags.forEach(function (t) { tagSet[t] = true; });
      });
      return Object.keys(tagSet).sort();
    }

    function renderFilters() {
      var tags = getAllTags();
      var html = '<button class="filter-btn filter-btn--active" data-tag="All">All</button>';
      tags.forEach(function (tag) {
        html += '<button class="filter-btn" data-tag="' + tag + '">' + tag + '</button>';
      });
      filtersEl.innerHTML = html;

      filtersEl.addEventListener('click', function (e) {
        if (e.target.matches('.filter-btn')) {
          activeTag = e.target.getAttribute('data-tag');
          filtersEl.querySelectorAll('.filter-btn').forEach(function (btn) {
            btn.classList.toggle('filter-btn--active', btn.getAttribute('data-tag') === activeTag);
          });
          renderGrid();
        }
      });
    }

    function renderGrid() {
      var filtered = activeTag === 'All'
        ? PROJECTS
        : PROJECTS.filter(function (p) { return p.tags.indexOf(activeTag) !== -1; });

      var html = '';
      filtered.forEach(function (p, index) {
        var delay = Math.min(index * 0.06, 0.6);
        html += '<a href="../project/?slug=' + p.slug + '" class="project-card anim-fade-up" style="animation-delay:' + delay + 's">'
          + '<div class="project-card__image-wrapper">'
          + '<img src="../' + p.image + '" alt="' + p.title + '" class="project-card__image" loading="lazy" onerror="this.src=\'https://placehold.co/800x500/1a1a1a/666?text=' + encodeURIComponent(p.title) + '\'">'
          + '<div class="project-card__overlay">'
          + '<span class="project-card__view">View Project</span>'
          + '</div>'
          + '</div>'
          + '<div class="project-card__info">'
          + '<span class="project-card__title">' + p.title + '</span>'
          + '<span class="project-card__year">' + p.year + '</span>'
          + '</div>'
          + '</a>';
      });
      gridEl.innerHTML = html;
      observeAnimElements();
    }

    renderFilters();
    renderGrid();
  }

  // ==========================================
  // Single Project Page — Dynamic Rendering
  // ==========================================
  var projectPageEl = document.getElementById('project-page');

  if (projectPageEl && typeof PROJECTS !== 'undefined') {
    var params = new URLSearchParams(window.location.search);
    var slug = params.get('slug');
    var project = null;

    for (var i = 0; i < PROJECTS.length; i++) {
      if (PROJECTS[i].slug === slug) {
        project = PROJECTS[i];
        break;
      }
    }

    if (project) {
      document.title = project.title + ' — Pavlo Putintsev';

      var tagsHtml = '';
      project.tags.forEach(function (tag) {
        tagsHtml += '<span class="project-hero__tag">' + tag + '</span>';
      });

      projectPageEl.innerHTML =
        '<section class="project-hero">'
        + '<h1 class="project-hero__title anim-fade-up">' + project.title + '</h1>'
        + '<span class="project-hero__badge anim-fade-up" style="animation-delay:0.1s">' + project.year + '</span>'
        + '<div class="project-hero__tags anim-fade-up" style="animation-delay:0.15s">' + tagsHtml + '</div>'
        + '<p class="project-hero__description anim-fade-up" style="animation-delay:0.2s">' + project.description + '</p>'
        + '<a href="' + project.link + '" class="project-hero__link anim-fade-up" style="animation-delay:0.25s" target="_blank" rel="noopener noreferrer">'
        + 'Visit Live Site '
        + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'
        + '</a>'
        + '</section>'
        + '<section class="project-preview anim-fade-up" style="animation-delay:0.35s">'
        + '<a href="' + project.link + '" class="project-preview__link" target="_blank" rel="noopener noreferrer">'
        + '<div class="project-preview__frame">'
        + '<img src="../' + project.image + '" alt="' + project.title + '" class="project-preview__image" onerror="this.src=\'https://placehold.co/1200x700/1a1a1a/666?text=' + encodeURIComponent(project.title) + '\'">'
        + '<div class="project-preview__overlay">'
        + '<span class="project-preview__visit">Visit Site</span>'
        + '</div>'
        + '</div>'
        + '</a>'
        + '</section>'
        + '<div class="project-nav anim-fade-up" style="animation-delay:0.45s">'
        + '<a href="../work/" class="project-nav__back">'
        + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>'
        + ' Back to Portfolio'
        + '</a>'
        + '</div>';
    } else {
      projectPageEl.innerHTML =
        '<section class="project-hero">'
        + '<h1 class="project-hero__title">Project not found</h1>'
        + '<p class="project-hero__description">The project you are looking for does not exist.</p>'
        + '<a href="../work/" class="project-hero__link">Back to Portfolio</a>'
        + '</section>';
    }
  }
  observeAnimElements();
})();
