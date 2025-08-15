document.addEventListener('DOMContentLoaded', () => {
  const triggers = document.querySelectorAll('.info-word');
  const cards    = document.querySelectorAll('.info-card'); // add a class to your cards

  // helper: hide all other cards (optional—remove if you want multiple open)
  const hideOthers = (except) => {
    cards.forEach(c => { if (c !== except) c.style.display = 'none'; });
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const card = document.getElementById(trigger.dataset.target);
      const isVisible = getComputedStyle(card).display !== 'none';

      hideOthers(card);                      // keep only one open
      card.style.display = isVisible ? 'none' : 'block'; // toggle

      e.stopPropagation();                   // don't let it reach the outside-click handler
    });
  });

  // Close when clicking outside
  document.addEventListener('click', () => {
    cards.forEach(c => c.style.display = 'none');
  });

  // Don't close when clicking inside a card
  cards.forEach(c => c.addEventListener('click', e => e.stopPropagation()));

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cards.forEach(c => c.style.display = 'none');
  });
});