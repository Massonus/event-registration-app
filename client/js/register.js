document.getElementById('registration-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = '';

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const birthDate = document.getElementById('birthDate').value;
    const heardFrom = document.querySelector('input[name="heardFrom"]:checked');

    let errors = [];

    if (!name) {
        errors.push('Full name is required.');
    }
    if (!email) {
        errors.push('Email is required.');
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        errors.push('Invalid email format.');
    }
    if (!birthDate) {
        errors.push('Date of birth is required.');
    }
    if (!heardFrom) {
        errors.push('Please select where you heard about the event.');
    }

    if (errors.length > 0) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger';
        alert.innerHTML = `<ul>${errors.map(error => `<li>${error}</li>`).join('')}</ul>`;
        alertContainer.appendChild(alert);
        return;
    }

    const eventId = new URLSearchParams(window.location.search).get('eventId');

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            eventId,
            name,
            email,
            birthDate,
            heardFrom: heardFrom.value
        })
    })
        .then(response => {
            if (response.ok) {
                alert('Successfully registered!');
                window.location.href = '/';
            } else {
                alert('Failed to register');
            }
        })
        .catch(error => console.error('Error:', error));
});
