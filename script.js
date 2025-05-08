// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('writeup-modal');
    const writeupBtns = document.querySelectorAll('.writeup-btn');
    const closeModal = document.querySelector('.close-modal');
    const writeupContent = document.getElementById('writeup-content');

    writeupBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const labId = this.dataset.writeup;
            // Fetch write-up content from API
            fetchWriteup(labId).then(content => {
                writeupContent.innerHTML = content;
                modal.style.display = 'block';
            });
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Download functionality
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const labId = this.dataset.lab;
            // Implement download logic
            alert('Iniciando descarga del laboratorio...');
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('¡Gracias por tu mensaje! Te responderemos pronto.');
            contactForm.reset();
        });
    }
});

async function fetchWriteup(labId) {
    try {
        const response = await fetch(`/api/writeups/${labId}`);
        const data = await response.json();
        return data.content;
    } catch (error) {
        return '<p>Error al cargar el write-up. Por favor, intenta más tarde.</p>';
    }
}