/* Restore focus when a footer link reopens the current portal fragment. */
(() => {
  'use strict';

  const targets = {
    jobs: 'md-candidate-portal',
    services: 'md-business-portal',
  };
  const id = targets[document.body.dataset.page];
  const app = document.getElementById('app');
  if (!id || !app) return;
  const fragment = '#' + id;

  app.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[data-portal-target]');
    if (link?.getAttribute('href') !== fragment) return;
    const portal = document.getElementById(id);
    if (!portal) return;

    portal.open = true;
    if (location.hash === fragment) {
      event.preventDefault();
      portal.querySelector('summary')?.focus({ preventScroll: true });
      portal.scrollIntoView({ block: 'start' });
    }
  });
})();
