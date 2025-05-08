// Enhanced script.js with filter functionality and responsive elements

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-container ul');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animation for hamburger menu
            const spans = menuToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Close dropdown and menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active') && !event.target.closest('.nav-container')) {
            navMenu.classList.remove('active');
            if (menuToggle) {
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    });
    
    // Write-up Modal functionality 
    const writeupBtns = document.querySelectorAll('.writeup-btn');
    const modal = document.getElementById('writeup-modal');
    const modalContent = document.getElementById('writeup-content');
    const closeModal = document.querySelector('.close-modal');
    
    if (writeupBtns.length > 0 && modal && closeModal) {
        writeupBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const writeupId = this.getAttribute('data-writeup');
                // Here you would typically fetch the writeup content from a server
                // For now, let's just display a placeholder
                modalContent.innerHTML = `
                    <h2>Write-up para ${writeupId}</h2>
                    <p>Este es un ejemplo de write-up para el laboratorio ${writeupId}.</p>
                    <h3>Descripción</h3>
                    <p>Esta vulnerabilidad permite a un atacante...</p>
                    <h3>Pasos para reproducir</h3>
                    <ol>
                        <li>Ingresar al laboratorio</li>
                        <li>Explorar el código fuente</li>
                        <li>Identificar el punto vulnerable</li>
                        <li>Crear un payload específico</li>
                        <li>Explotar la vulnerabilidad</li>
                    </ol>
                    <h3>Mitigación</h3>
                    <p>Para protegerse contra esta vulnerabilidad, es recomendable...</p>
                `;
                
                modal.style.display = 'block';
                setTimeout(() => {
                    modal.classList.add('active');
                }, 10);
            });
        });
        
        closeModal.addEventListener('click', function() {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Download functionality (placeholder)
    const downloadBtns = document.querySelectorAll('.download-btn');
    
    if (downloadBtns.length > 0) {
        downloadBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const labId = this.getAttribute('data-lab');
                alert(`Descargando laboratorio: ${labId}. Esta funcionalidad se implementará próximamente.`);
            });
        });
    }
    
    // Difficulty filter functionality
    setupDifficultyFilters();
});

// Function to set up difficulty filters on vulnerability pages
function setupDifficultyFilters() {
    const filterContainer = document.querySelector('.filter-container');
    
    // If we're on a page with lab sections
    if (document.querySelector('.labs-section') && !filterContainer) {
        // Create filter container if it doesn't exist
        const mainElement = document.querySelector('main');
        const headerSection = document.querySelector('.vulnerability-header');
        
        if (mainElement && headerSection) {
            const newFilterContainer = document.createElement('div');
            newFilterContainer.className = 'filter-container';
            newFilterContainer.innerHTML = `
                <h3 class="filter-title">Filtrar por nivel de dificultad:</h3>
                <div class="difficulty-filters">
                    <button class="filter-btn all active" data-filter="all">Todos los niveles</button>
                    <button class="filter-btn beginner" data-filter="beginner">Principiante</button>
                    <button class="filter-btn advanced" data-filter="advanced">Avanzado</button>
                    <button class="filter-btn professional" data-filter="professional">Profesional</button>
                    <button class="filter-btn expert" data-filter="expert">Experto</button>
                </div>
            `;
            
            // Insert after header section
            headerSection.after(newFilterContainer);
            
            // Add event listeners to filter buttons
            const filterBtns = newFilterContainer.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Remove active class from all buttons
                    filterBtns.forEach(b => b.classList.remove('active'));
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    const filter = this.getAttribute('data-filter');
                    filterLabsByDifficulty(filter);
                });
            });
        }
    }
}

// Function to filter labs by difficulty
function filterLabsByDifficulty(difficulty) {
    const labCards = document.querySelectorAll('.lab-card');
    
    labCards.forEach(card => {
        const cardDifficulty = card.querySelector('.difficulty') || 
                              card.querySelector('.lab-meta span:first-child');
        
        if (difficulty === 'all' || (cardDifficulty && cardDifficulty.classList.contains(difficulty))) {
            card.style.display = 'block';
            // Add fade-in animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            // Fade-out animation then hide
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Check if sections are empty after filtering
    const labSections = document.querySelectorAll('.labs-section');
    labSections.forEach(section => {
        const visibleCards = Array.from(section.querySelectorAll('.lab-card')).filter(card => {
            return card.style.display !== 'none';
        });
        
        if (visibleCards.length === 0) {
            section.classList.add('hidden');
        } else {
            section.classList.remove('hidden');
        }
    });
}