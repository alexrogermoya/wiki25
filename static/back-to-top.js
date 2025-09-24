document.addEventListener('DOMContentLoaded', function(){

    // Variables for back to top
    const backToTopBtn = document.getElementById('back-to-top');
    let scrollEnabled = true;
    let lastScrollPosition = 0;
    
    // Back to top functionality
    window.addEventListener('scroll', function() {
        const currentScrollPosition = window.scrollY;
        const scrollingDown = currentScrollPosition > lastScrollPosition;
        lastScrollPosition = currentScrollPosition;
        
        if (currentScrollPosition > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
        
        if (dbtlSection.classList.contains('show') && scrollEnabled) {
            updateVisualization(scrollingDown);
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});