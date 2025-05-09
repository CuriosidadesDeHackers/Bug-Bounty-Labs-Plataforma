document.addEventListener("DOMContentLoaded", function () {
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
                profesional: []
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
                profesional: "Nivel Profesional"
            };

            Object.keys(nivelesAgrupados).forEach(nivel => {
                const labs = nivelesAgrupados[nivel];
                if (labs.length > 0) {
                    const grupo = document.createElement("div");
                    grupo.className = "lab-group";

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

                                const downloadButton = document.createElement("button");
                                downloadButton.className = "btn download-btn";
                                downloadButton.textContent = "Descargar Lab";
                                downloadButton.onclick = () => window.open(lab.enlace, "_blank");

                                const writeupButton = document.createElement("button");
                                writeupButton.className = "btn writeup-btn";
                                writeupButton.textContent = "Ver Write-up";
                                writeupButton.writeupsData = lab.writeups || [];

                                const uploadButton = document.createElement("button");
                                uploadButton.className = "btn upload-btn";
                                uploadButton.innerHTML = "📤";
                                uploadButton.onclick = () => abrirSubidaWriteup(lab.lab_id);

                                card.innerHTML = `
                                    <h3>${lab.nombre}</h3>
                                    <p>Creador: ${lab.autor}</p>
                                    <div class="lab-meta">
                                        <span class="points">${lab.puntos} puntos</span>
                                    </div>
                                    <div class="lab-actions"></div>
                                `;
                                const actions = card.querySelector(".lab-actions");
                                actions.appendChild(downloadButton);
                                actions.appendChild(writeupButton);
                                actions.appendChild(uploadButton);
                                fila.appendChild(card);
                            }
                        });

                        grupo.appendChild(fila);
                    }

                    contenedor.appendChild(grupo);
                }
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
                }
            });
        });

    window.closeModal = function () {
        document.getElementById("writeup-modal").style.display = "none";
    };

    window.abrirSubidaWriteup = function (labId) {
        const modal = document.getElementById("upload-modal");
        document.getElementById("upload-lab-id").value = labId;
        modal.style.display = "block";
    };

    window.enviarWriteup = async function () {
        const labId = document.getElementById("upload-lab-id").value;
        const autor = document.getElementById("upload-autor").value;
        const url = document.getElementById("upload-url").value;

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
                    url: url
                })
            });

            if (response.ok) {
                alert("Write-up enviado para validación");
                document.getElementById("upload-modal").style.display = "none";
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

    window.cerrarUploadModal = function () {
        document.getElementById("upload-modal").style.display = "none";
    };

    // Close modal when clicking outside
    window.onclick = function(event) {
        const writeupModal = document.getElementById("writeup-modal");
        const uploadModal = document.getElementById("upload-modal");
        if (event.target === writeupModal) {
            writeupModal.style.display = "none";
        }
        if (event.target === uploadModal) {
            uploadModal.style.display = "none";
        }
    };

    // Close modal with Escape key
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            document.getElementById("writeup-modal").style.display = "none";
            document.getElementById("upload-modal").style.display = "none";
        }
    });
});