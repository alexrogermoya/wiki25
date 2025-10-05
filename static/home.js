document.addEventListener('DOMContentLoaded', () => {
    function createHelixStrand(container, strandClass, isLeft) {
            const numPoints = Math.ceil(window.innerWidth / 15);
            const centerY = 150;
            const amplitude = 80;
            const frequency = 0.02;
            const bases = ['A', 'T', 'G', 'C'];
            
            container.innerHTML = '';
            
            for (let i = 0; i < numPoints; i++) {
                const x = i * 15;
                const phase = strandClass === 'strand1' ? 0 : Math.PI;
                const y = centerY + Math.sin(x * frequency + phase) * amplitude;
                
                // Solo mostrar puntos en la mitad correspondiente
                if ((isLeft && x < window.innerWidth / 2) || (!isLeft && x >= window.innerWidth / 2)) {
                    const point = document.createElement('div');
                    point.className = `helix-point ${strandClass}`;
                    point.style.left = `${x}px`;
                    point.style.top = `${y}px`;
                    

                    
                    container.appendChild(point);
                }
            }
        }

        function createBaseConnections() {
            // Función vacía - ya no creamos conexiones
        }

        function initializeDNA() {
            createHelixStrand(document.getElementById('leftStrand1'), 'strand1', true);
            createHelixStrand(document.getElementById('leftStrand2'), 'strand2', true);
            createHelixStrand(document.getElementById('rightStrand1'), 'strand1', false);
            createHelixStrand(document.getElementById('rightStrand2'), 'strand2', false);
            createBaseConnections();
        }

        // Inicializar ADN
        initializeDNA();

        // Manejar el scroll para romper el ADN
        let isBreaking = false;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)*2;
            const leftHalf = document.getElementById('leftHalf');
            const rightHalf = document.getElementById('rightHalf');
            const revealedText = document.getElementById('revealedText');
            
            if (scrollPercent > 0.1 && !isBreaking) {
                isBreaking = true;
                
                leftHalf.classList.add('broken');
                rightHalf.classList.add('broken');
                
                setTimeout(() => {
                    revealedText.classList.add('visible');
                }, 400);
                
            } else if (scrollPercent <= 0.1 && isBreaking) {
                isBreaking = false;
                leftHalf.classList.remove('broken');
                rightHalf.classList.remove('broken');
                revealedText.classList.remove('visible');
            }
        });

        // Recrear ADN al cambiar el tamaño de ventana
        window.addEventListener('resize', () => {
            initializeDNA();
        });

        // Animación continua de rotación para simular la hélice en 3D
        function animateHelix() {
            const strands = document.querySelectorAll('.helix-point');
            const time = Date.now() * 0.001;
            
            strands.forEach((strand, index) => {
                const phase = strand.classList.contains('strand1') ? 0 : Math.PI;
                const x = parseFloat(strand.style.left);
                const baseY = parseFloat(strand.style.top);
                const oscillation = Math.sin(time + x * 0.01 + phase) * 3;
                
                strand.style.transform = `translateY(${oscillation}px) scale(${1 + Math.sin(time + x * 0.01 + phase) * 0.1})`;
            });
            
            requestAnimationFrame(animateHelix);
        }

        animateHelix();
});

(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9876d4ef96e8cfe2',t:'MTc1OTI2NzkzNC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();