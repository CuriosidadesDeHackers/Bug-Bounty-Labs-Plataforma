document.addEventListener("DOMContentLoaded", function() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);

    // Mobile menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-container ul');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            }
        });

        // Handle dropdowns in mobile view
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.dropbtn');
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                    
                    // Close other dropdowns
                    dropdowns.forEach(other => {
                        if (other !== dropdown) {
                            other.classList.remove('active');
                        }
                    });
                }
            });
        });
    }

    // Close modals when clicking overlay
    overlay.addEventListener('click', function() {
        const writeupModal = document.getElementById("writeup-modal");
        const uploadModal = document.getElementById("upload-modal");
        const labInfos = document.querySelectorAll('.lab-info');
        
        writeupModal.style.display = "none";
        uploadModal.style.display = "none";
        overlay.classList.remove('active');
        
        labInfos.forEach(info => {
            info.classList.remove('active');
        });
    });

    // Close modals with Escape key
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            const writeupModal = document.getElementById("writeup-modal");
            const uploadModal = document.getElementById("upload-modal");
            const labInfos = document.querySelectorAll('.lab-info');
            const overlay = document.querySelector('.modal-overlay');
            
            writeupModal.style.display = "none";
            uploadModal.style.display = "none";
            overlay.classList.remove('active');
            
            labInfos.forEach(info => {
                info.classList.remove('active');
            });

            // Also close mobile menu
            if (menuToggle && navMenu) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            }
        }
    });

    // Fetch and display machines
    fetch("/static/maquinas.json")
        .then(response => response.json())
        .then(data => {
            const currentPath = window.location.pathname;
            const categoriaActual = currentPath.substring(currentPath.lastIndexOf("/") + 1, currentPath.lastIndexOf("."));

            const contenedor = document.querySelector(".labs-grid");
            if (!contenedor) return;
            contenedor.innerHTML = "";

            const nivelesAgrupados = {
                principiante: [],
                avanzado: [],
                profesional: [],
                experto: []
            };

            data
                .filter(lab => lab.categoria === categoriaActual)
                .forEach(lab => {
                    const nivel = lab.nivel?.toLowerCase();
                    if (nivelesAgrupados[nivel]) {
                        nivelesAgrupados[nivel].push(lab);
                    }
                });

            const traducciones = {
                principiante: "Nivel Principiante",
                avanzado: "Nivel Avanzado",
                profesional: "Nivel Profesional",
                experto: "Nivel Experto"
            };

            Object.keys(nivelesAgrupados).forEach(nivel => {
                const labs = nivelesAgrupados[nivel];
                if (labs.length > 0) {
                    const grupo = document.createElement("div");
                    grupo.className = "lab-group";
                    grupo.setAttribute('data-difficulty', nivel);

                    const titulo = document.createElement("h2");
                    titulo.textContent = traducciones[nivel] || nivel;
                    grupo.appendChild(titulo);

                    for (let i = 0; i < labs.length; i += 2) {
                        const fila = document.createElement("div");
                        fila.className = "lab-row";

                        [labs[i], labs[i + 1]].forEach(lab => {
                            if (lab) {
                                const card = document.createElement("div");
                                card.className = "lab-card";
                                card.setAttribute('data-difficulty', nivel);

                                const downloadButton = document.createElement("button");
                                downloadButton.className = "btn download-btn";
                                downloadButton.textContent = "Descargar Lab";
                                downloadButton.onclick = () => window.open(lab.enlace, "_blank");

                                const writeupButton = document.createElement("button");
                                writeupButton.className = "btn writeup-btn";
                                writeupButton.textContent = "Ver Write-up";
                                writeupButton.writeupsData = lab.writeups || [];
                                writeupButton.machineName = lab.nombre;

                                const uploadButton = document.createElement("button");
                                uploadButton.className = "btn upload-btn";
                                uploadButton.innerHTML = "📤";
                                uploadButton.onclick = () => abrirSubidaWriteup(lab.lab_id, lab.nombre);

                                const infoButton = document.createElement("button");
                                infoButton.className = "info-btn";
                                infoButton.innerHTML = "ℹ️";
                                infoButton.onclick = () => toggleInfo(card);

                                card.innerHTML = `
                                    <h3>${lab.nombre}</h3>
                                    <div class="lab-meta">
                                        <span class="points">${lab.puntos} puntos</span>
                                    </div>
                                    <div class="lab-actions"></div>
                                    <div class="lab-info">
                                        <button class="close-info" onclick="toggleInfo(this.parentElement.parentElement)">×</button>
                                        <h4>${lab.nombre}</h4>
                                        <img src="/static/imagenes/${lab.categoria}.jpg" alt="${lab.nombre}">
                                        <p><strong>Autor:</strong> ${lab.autor}</p>
                                        <p><strong>Dificultad:</strong> ${lab.dificultad}</p>
                                        <p><strong>Categoría:</strong> ${lab.categoria}</p>
                                        <p><strong>Fecha:</strong> ${lab.fecha || 'No disponible'}</p>
                                    </div>
                                `;

                                const actions = card.querySelector(".lab-actions");
                                actions.appendChild(downloadButton);
                                actions.appendChild(writeupButton);
                                actions.appendChild(uploadButton);
                                card.appendChild(infoButton);
                                fila.appendChild(card);
                            }
                        });

                        grupo.appendChild(fila);
                    }

                    contenedor.appendChild(grupo);
                }
            });

            // Add filter functionality
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const difficulty = button.getAttribute('data-difficulty');
                    
                    // Remove active class from all buttons and add to clicked button
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    // Show/hide lab groups based on difficulty
                    document.querySelectorAll('.lab-group').forEach(group => {
                        if (difficulty === 'all' || group.getAttribute('data-difficulty') === difficulty) {
                            group.style.display = 'block';
                        } else {
                            group.style.display = 'none';
                        }
                    });
                });
            });

            document.addEventListener("click", function (e) {
                if (e.target.classList.contains("writeup-btn")) {
                    const writeups = e.target.writeupsData || [];
                    const modal = document.getElementById("writeup-modal");
                    const contenido = document.getElementById("writeup-contenido");
                    contenido.innerHTML = "";

                    if (writeups.length > 0) {
                        writeups.forEach(item => {
                            const link = document.createElement("a");
                            link.href = item.url;
                            link.textContent = item.titulo;
                            link.target = "_blank";
                            link.className = "writeup-link";
                            contenido.appendChild(link);
                        });
                    } else {
                        contenido.innerHTML = "<p>No hay writeups disponibles para este laboratorio.</p>";
                    }

                    modal.style.display = "block";
                    overlay.classList.add('active');
                }
            });
        });
});

window.closeModal = function () {
    document.getElementById("writeup-modal").style.display = "none";
    document.querySelector('.modal-overlay').classList.remove('active');
};

window.abrirSubidaWriteup = function (labId, machineName) {
    const modal = document.getElementById("upload-modal");
    const overlay = document.querySelector('.modal-overlay');
    document.getElementById("upload-lab-id").value = labId;
    document.getElementById("upload-machine-name").value = machineName;
    modal.style.display = "block";
    overlay.classList.add('active');
};

window.cerrarUploadModal = function () {
    document.getElementById("upload-modal").style.display = "none";
    document.querySelector('.modal-overlay').classList.remove('active');
};

window.toggleInfo = function(card) {
    const info = card.querySelector('.lab-info');
    const overlay = document.querySelector('.modal-overlay');
    info.classList.toggle('active');
    overlay.classList.toggle('active');
};

window.enviarWriteup = async function () {
    const labId = document.getElementById("upload-lab-id").value;
    const autor = document.getElementById("upload-autor").value;
    const url = document.getElementById("upload-url").value;
    const machineName = document.getElementById("upload-machine-name").value;

    if (!autor || !url) {
        alert("Por favor, completa todos los campos");
        return;
    }

    try {
        const response = await fetch('/api/recibir-writeup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lab_id: labId,
                autor: autor,
                url: url,
                machine_name: machineName
            })
        });

        if (response.ok) {
            alert("Write-up enviado para validación");
            document.getElementById("upload-modal").style.display = "none";
            document.querySelector('.modal-overlay').classList.remove('active');
            document.getElementById("upload-autor").value = "";
            document.getElementById("upload-url").value = "";
        } else {
            const data = await response.json();
            alert(data.message || "Error al enviar el write-up");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al enviar el write-up");
    }
};
