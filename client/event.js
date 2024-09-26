document.addEventListener('DOMContentLoaded', () => {
    loadEvents();

    const eventForm = document.getElementById('event-form');
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const eventDate = document.getElementById('eventDate').value;
        const organizer = document.getElementById('organizer').value;

        fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                eventDate,
                organizer
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                loadEvents();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
});

function loadEvents() {
    fetch('/api/events')
        .then(response => response.json())
        .then(events => {
            const eventList = document.getElementById('events-list');
            eventList.innerHTML = ''; // Очищаем старый список
            events.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.innerHTML = `
                    <h2>${event.title}</h2>
                    <p>${event.description}</p>
                    <p>Date: ${new Date(event.eventDate).toLocaleDateString()}</p>
                    <p>Organizer: ${event.organizer}</p>
                    <button onclick="registerForEvent('${event._id}')">Register</button>
                    <button onclick="viewParticipants('${event._id}')">View Participants</button>
                `;
                eventList.appendChild(eventElement);
            });
        });
}
