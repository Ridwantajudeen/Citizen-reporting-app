document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('incidentForm');
    const incidentList = document.getElementById('incidentList');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const photoInput = document.getElementById('photo');
        let photo = '';

        if (photoInput.files.length > 0) {
            const file = photoInput.files[0];
            const reader = new FileReader();
            reader.onloadend = function() {
                photo = reader.result;
                saveIncident(title, description, category, photo);
            }
            reader.readAsDataURL(file);
        } else {
            saveIncident(title, description, category, photo);
        }
    });

    function saveIncident(title, description, category, photo) {
        const incidents = JSON.parse(localStorage.getItem('incidents')) || [];
        const incident = { title, description, category, photo, date: new Date() };
        incidents.push(incident);
        localStorage.setItem('incidents', JSON.stringify(incidents));
        loadIncidents();
        alert('Incident reported successfully!');
    }

    function loadIncidents() {
        const incidents = JSON.parse(localStorage.getItem('incidents')) || [];
        incidentList.innerHTML = '';
        incidents.forEach(incident => {
            const li = document.createElement('li');
            li.innerHTML = `
                <h3>${incident.title}</h3>
                <p>${incident.description}</p>
                <p><strong>Category:</strong> ${incident.category}</p>
                ${incident.photo ? `<img src="${incident.photo}" alt="${incident.title}" style="max-width: 100%;">` : ''}
                <p><em>${new Date(incident.date).toLocaleString()}</em></p>
            `;
            incidentList.appendChild(li);
        });
    }

    loadIncidents();
});
