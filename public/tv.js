/* Progressive enhancement for the standalone TV interface. */
(() => {
  'use strict';

  if (window.MDTV) return;

  const screenNames = ['welcome', 'worker', 'business', 'display'];
  const screenLabels = {
    welcome: 'Chào mừng',
    worker: 'Dành cho người lao động',
    business: 'Dành cho doanh nghiệp',
    display: 'Trình chiếu',
  };
  const modeLabels = {
    paused: 'Đang tạm dừng',
    playing: 'Đang phát',
    suspended: 'Tạm dừng khi ẩn trang',
  };
  const slideDuration = 20_000;
  const controlSelector = 'a[href], button, [data-tv-action][tabindex]';
  const toggleSelector = '[data-tv-action="toggle"]';
  const arrowSteps = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 };
  const navigationKeys = ['Tab', 'Enter', ' ', 'Home', 'End', 'PageUp', 'PageDown'];

  let root;
  const screens = new Map();
  let slides = [];
  let screen = null;
  let slideIndex = 0;
  let playRequested = false;
  let timer;
  let motionPreference;
  let welcomeFocus;

  function getState() {
    let mode = 'manual';
    if (screen === 'display') {
      mode = playRequested ? (document.hidden ? 'suspended' : 'playing') : 'paused';
    }
    return {
      screen,
      mode,
      playing: mode === 'playing',
      slide: slides.length ? slideIndex + 1 : 0,
      total: slides.length,
    };
  }

  function setText(element, label) {
    if (element.textContent !== label) element.textContent = label;
  }

  function renderStatus() {
    const { mode, slide, total } = getState();
    const position = slide + ' / ' + total;
    const progressLabel = 'Trang ' + position;
    const activeSlide = slides[slideIndex];
    const slideTitle = activeSlide?.querySelector('h3')?.textContent?.trim();
    const slideGuidance = Array.from(activeSlide?.querySelectorAll('p') || []).at(-1)?.textContent?.trim();
    const slideSummary = [slideTitle, slideGuidance].filter(Boolean).join('. ');
    const status = screen === 'display'
      ? screenLabels[screen] + ' · ' + (total ? progressLabel : 'Chưa có trang chiếu') + ' · ' + modeLabels[mode] + (slideSummary ? ' · ' + slideSummary : '')
      : screenLabels[screen];

    root.setAttribute('data-tv-mode', mode);
    root.querySelectorAll('[data-tv-status]').forEach(element => {
      setText(element, status);
    });
    root.querySelectorAll('[data-tv-visible-status]').forEach(element => {
      setText(element, screen === 'display'
        ? (total ? progressLabel : 'Chưa có trang chiếu') + ' · ' + modeLabels[mode]
        : screenLabels[screen]);
    });
    root.querySelectorAll('[data-tv-mode]').forEach(element => {
      element.setAttribute('data-tv-mode', mode);
    });
    root.querySelectorAll('[data-tv-progress]').forEach(element => {
      if (element.matches('progress')) {
        // Native progress requires a positive maximum, even for an empty deck.
        element.max = total || 1;
        element.value = slide;
        element.setAttribute('aria-valuetext', progressLabel);
        setText(element, progressLabel);
      } else if (element.matches('[role="progressbar"]')) {
        element.setAttribute('aria-valuemin', total ? '1' : '0');
        element.setAttribute('aria-valuemax', String(total));
        element.setAttribute('aria-valuenow', String(slide));
        element.setAttribute('aria-valuetext', progressLabel);
      } else {
        setText(element, position);
      }
    });
    root.querySelectorAll(toggleSelector).forEach(element => {
      const accessibleLabel = playRequested ? 'Tạm dừng trình chiếu' : 'Phát trình chiếu';
      const visibleLabel = playRequested ? 'Tạm dừng' : 'Phát trình chiếu';
      element.setAttribute('aria-label', accessibleLabel);
      if (!element.childElementCount) setText(element, visibleLabel);
    });
    root.querySelectorAll('[data-tv-action="prev"], [data-tv-action="next"], ' + toggleSelector).forEach(element => {
      element.setAttribute('aria-disabled', String(total < 2));
      if (element.matches('button')) element.toggleAttribute('disabled', total < 2);
    });
  }

  function isVisibleControl(element) {
    return element?.matches(controlSelector) &&
      element.tabIndex >= 0 &&
      !element.matches(':disabled') &&
      !element.closest('[hidden], [inert], [aria-hidden="true"], [aria-disabled="true"]') &&
      element.getClientRects().length > 0 &&
      window.getComputedStyle(element).visibility === 'visible';
  }

  function focusScreen(panel) {
    if (screen === 'welcome' && panel.contains(welcomeFocus) && isVisibleControl(welcomeFocus)) {
      welcomeFocus.focus();
      return;
    }
    const heading = panel.querySelector('h1, h2, [role="heading"]') || panel;
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function setVisible(element, visible) {
    element.toggleAttribute('hidden', !visible);
    element.toggleAttribute('inert', !visible);
  }

  function selectScreen(name, moveFocus = false) {
    const outgoing = screens.get(screen);
    const focusedInOutgoing = outgoing?.contains(document.activeElement);
    const changed = screen !== name;
    screen = name;

    for (const [id, panel] of screens) {
      setVisible(panel, id === screen);
    }
    if (changed && (moveFocus || focusedInOutgoing)) focusScreen(screens.get(screen));
  }

  function selectSlide(index) {
    const focusedInOutgoing = slides[slideIndex]?.contains(document.activeElement);
    const changed = slideIndex !== index;
    slideIndex = index;
    slides.forEach((slide, position) => setVisible(slide, position === index));
    if (changed && focusedInOutgoing) focusScreen(screens.get('display'));
  }

  function step(direction) {
    const offset = direction < 0 ? -1 : 1;
    selectSlide((slideIndex + offset + slides.length) % slides.length);
  }

  function stopTimer() {
    window.clearTimeout(timer);
    timer = undefined;
  }

  function schedule() {
    stopTimer();
    if (!playRequested || document.hidden || screen !== 'display' || slides.length < 2) return;

    timer = window.setTimeout(() => {
      timer = undefined;
      if (playRequested && !document.hidden) {
        step(1);
        schedule();
      }
      renderStatus();
    }, slideDuration);
  }

  function pause() {
    playRequested = false;
    stopTimer();
  }

  function pauseOnInput() {
    if (playRequested) {
      pause();
      renderStatus();
    }
  }

  function show(name) {
    if (!screens.has(name)) return getState();
    pause();
    selectScreen(name, true);
    syncLocation(name);
    renderStatus();
    return getState();
  }

  function advance(direction = 1) {
    if (screen !== 'display' || !slides.length) return getState();
    pause();
    step(direction);
    renderStatus();
    return getState();
  }

  function startPresentation() {
    if (!screens.has('display')) return getState();
    pause();
    selectSlide(0);
    selectScreen('display', true);
    syncLocation('display');
    const reducedMotion = motionPreference?.matches;
    playRequested = slides.length > 1 && !document.hidden && !reducedMotion;
    schedule();
    renderStatus();
    return getState();
  }

  function toggle() {
    if (screen !== 'display') return startPresentation();
    if (slides.length < 2 || (document.hidden && !playRequested)) return getState();
    playRequested = !playRequested;
    schedule();
    renderStatus();
    return getState();
  }

  function handleClick(event) {
    if (event.defaultPrevented || (event.button !== undefined && event.button !== 0)) return;
    const control = event.target?.closest?.(controlSelector);
    if (!control || !root.contains(control)) return;
    if (control.matches(':disabled') || control.closest('[aria-disabled="true"]')) {
      event.preventDefault();
      return;
    }
    if (!isVisibleControl(control)) return;

    const action = control.getAttribute('data-tv-action');
    const nativeLink = control.matches('a[href]') && (
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
      control.hasAttribute('download') || (control.target && control.target !== '_self')
    );
    if (nativeLink) {
      pauseOnInput();
      return;
    }

    // Pointer activation need not focus a button (for example, in Safari).
    if (screen === 'welcome' && screens.get('welcome').contains(control)) welcomeFocus = control;

    if (action === 'display' && screens.has('display') && screen !== 'display') {
      event.preventDefault();
      startPresentation();
    } else if (screens.has(action)) {
      event.preventDefault();
      show(action);
    } else if ((action === 'prev' || action === 'next') && screen === 'display' && slides.length) {
      event.preventDefault();
      advance(action === 'prev' ? -1 : 1);
    } else if (action === 'toggle' && screens.has('display')) {
      event.preventDefault();
      toggle();
    } else {
      pauseOnInput();
    }
  }

  function handleKey(event) {
    const focused = document.activeElement;
    if (event.defaultPrevented || event.isComposing || event.metaKey || event.ctrlKey || event.altKey) return;
    if (focused !== document.body && focused !== document.documentElement && !root.contains(focused)) return;
    if (focused?.matches('input, select, textarea') || focused?.isContentEditable) return;

    if (event.key === 'Escape') {
      pauseOnInput();
      if (screens.has('welcome')) {
        event.preventDefault();
        show('welcome');
      }
      return;
    }

    if (Object.hasOwn(arrowSteps, event.key)) {
      pauseOnInput();
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        const page = document.scrollingElement;
        if (page && page.scrollHeight > page.clientHeight) return;
      }
      const controls = Array.from(root.querySelectorAll(controlSelector)).filter(isVisibleControl);
      if (!controls.length) return;
      event.preventDefault();

      const current = controls.indexOf(focused);
      const offset = arrowSteps[event.key];
      const next = current === -1 ? (offset > 0 ? 0 : controls.length - 1)
        : (current + offset + controls.length) % controls.length;
      controls[next].focus();
      return;
    }

    const activatesToggle = focused?.matches(toggleSelector) &&
      (event.key === 'Enter' || (event.key === ' ' && focused.matches('button')));
    if (navigationKeys.includes(event.key) && !activatesToggle) pauseOnInput();
  }

  function screenFromHash() {
    let hash;
    try {
      hash = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    if (!hash && screens.has('welcome')) return 'welcome';
    if (screens.has(hash)) return hash;
    return Array.from(screens).find(([, panel]) => hash && panel.id === hash)?.[0];
  }

  function syncLocation(name) {
    if (!window.history?.replaceState || !window.location) return;
    const path = typeof window.location.pathname === 'string' ? window.location.pathname : '';
    const search = typeof window.location.search === 'string' ? window.location.search : '';
    const next = name === 'welcome' ? (path + search || 'tv.html') : '#' + encodeURIComponent(name);
    try { window.history.replaceState(null, '', next); } catch {}
  }

  function init() {
    if (root) return getState();
    const candidate = document.querySelector('[data-tv-root]');
    if (!candidate) return getState();

    const panels = Array.from(candidate.querySelectorAll('[data-tv-screen]'));
    for (const name of screenNames) {
      const panel = panels.find(element => (element.getAttribute('data-tv-screen') || element.id) === name);
      if (panel) screens.set(name, panel);
    }
    if (!screens.size) return getState();
    root = candidate;
    slides = Array.from(screens.get('display')?.querySelectorAll('[data-tv-slide]') || []);
    motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    selectSlide(0);
    const initialScreen = screenFromHash() || screens.keys().next().value;
    selectScreen(initialScreen, initialScreen !== 'welcome');
    renderStatus();

    root.addEventListener('click', handleClick);
    root.addEventListener('auxclick', event => {
      if (event.button === 1 && event.target?.closest?.('a[href]')) pauseOnInput();
    });
    root.addEventListener('focusin', event => {
      if (screen === 'welcome' && screens.get('welcome').contains(event.target) && isVisibleControl(event.target)) {
        welcomeFocus = event.target;
      }
    });
    document.addEventListener('keydown', handleKey);
    document.addEventListener('visibilitychange', () => {
      schedule();
      renderStatus();
    });
    window.addEventListener('hashchange', () => {
      const name = screenFromHash();
      if (name) show(name);
    });
    motionPreference?.addEventListener?.('change', event => {
      // A new motion preference stops playback; Play remains an explicit override.
      if (event.matches) pauseOnInput();
    });
    root.querySelectorAll('[data-tv-action="display"][hidden]').forEach(element => {
      element.toggleAttribute('hidden', false);
    });
    return getState();
  }

  window.MDTV = Object.freeze({ init, getState, show, advance, toggle });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
