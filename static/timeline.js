document.addEventListener('DOMContentLoaded', function() {
    function toggleExpanded(button) {
        const expandedContent = button.nextElementSibling;
        const isVisible = expandedContent.classList.contains('show');
        
        if (isVisible) {
            expandedContent.classList.remove('show');
            button.textContent = 'Learn More';
        } else {
            expandedContent.classList.add('show');
            button.textContent = 'Hide Details';
        }
    }
});