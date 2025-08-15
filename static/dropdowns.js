document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.accordion');
        
  accordions.forEach(accordion => {
      const header = accordion.querySelector('.accordion-header');
      const content = accordion.querySelector('.accordion-content');
      
      header.addEventListener('click', () => {
          accordion.classList.toggle('active');
          
          if (accordion.classList.contains('active')) {
              content.style.maxHeight = content.scrollHeight + 'px';
          } else {
              content.style.maxHeight = 0;
          }
      });
  });
});
