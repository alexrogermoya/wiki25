    // Filter functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const teamCategories = document.querySelectorAll('.team-category');
    const teamCards = document.querySelectorAll('.team-card');

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Show/hide categories based on filter
            if (filter === 'all') {
                teamCategories.forEach(category => {
                    category.style.display = 'block';
                });
            } else {
                teamCategories.forEach(category => {
                    if (category.getAttribute('data-category') === filter) {
                        category.style.display = 'block';
                    } else {
                        category.style.display = 'none';
                    }
                });
            }
        });
    });

    // Mobile touch support for hover effects
    teamCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            // Remove active state from all other cards
            teamCards.forEach(c => {
                if (c !== card) {
                    c.classList.remove('touch-active');
                }
            });
            
            // Toggle active state on this card
            this.classList.toggle('touch-active');
        }, {passive: true});
    });

    // Animation on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    teamCategories.forEach(category => {
        observer.observe(category);
    });
    });
    (function(){
    function c(){
    var b=a.contentDocument||a.contentWindow.document;
    if(b){
        var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9608ffb976cacff4',t:'MTc1Mjc0NzU0NC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
        b.getElementsByTagName('head')[0].appendChild(d)
        }
        }
        if(document.body){
        var a=document.createElement('iframe');
        a.height=1;
        a.width=1;
        a.style.position='absolute';
        a.style.top=0;
        a.style.left=0;
        a.style.border='none';
        a.style.visibility='hidden';
        document.body.appendChild(a);
        if('loading'!==document.readyState) c();
        else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);
        else{
            var e=document.onreadystatechange||function(){};
            document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();