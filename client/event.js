document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/events')
        .then(response => response.json())
        .then(events => {
            const eventList = document.getElementById('events-list');
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
});

function registerForEvent(eventId) {
    window.location.href = `/register.html?eventId=${eventId}`;
}

function viewParticipants(eventId) {
    window.location.href = `/participants.html?eventId=${eventId}`;
}
