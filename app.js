document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('incidentForm');
    const incidentList = document.getElementById('incidentList');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const photoInput = document.getElementById('photo');
        const recaptchaResponse = grecaptcha.getResponse();

        if (!recaptchaResponse) {
            alert('Please complete the reCAPTCHA.');
            return;
        }

        let photo = '';

        if (photoInput.files.length > 0) {
            const file = photoInput.files[0];
            const reader = new FileReader();
            reader.onloadend = function() {
                photo = reader.result;
                saveIncident(title, description, category, photo, recaptchaResponse);
            }
            reader.readAsDataURL(file);
        } else {
            saveIncident(title, description, category, photo, recaptchaResponse);
        }
    });

    function saveIncident(title, description, category, photo, recaptchaResponse) {
        
        fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `secret=6Le7DPcpAAAAAHCv67-acvlDGGueKrFv8GKXc_nZ&response=${recaptchaResponse}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const incidents = JSON.parse(localStorage.getItem('incidents')) || [];
                const incident = { title, description, category, photo, date: new Date() };
                incidents.push(incident);
                localStorage.setItem('incidents', JSON.stringify(incidents));
                loadIncidents();
                alert('Incident reported successfully!');
                grecaptcha.reset();
            } else {
                alert('reCAPTCHA verification failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
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
