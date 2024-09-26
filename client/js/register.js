document.getElementById('registration-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const birthDate = document.getElementById('birthDate').value;
    const heardFrom = document.querySelector('input[name="heardFrom"]:checked').value;

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
            heardFrom
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