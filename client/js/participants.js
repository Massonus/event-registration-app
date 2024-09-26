document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');

    fetch(`/api/participants/${eventId}`)
        .then(response => response.json())
        .then(participants => {
            const participantsList = document.getElementById('participants-list');
            const eventTitle = document.getElementById('event-title');

            if (participants.length === 0) {
                eventTitle.innerHTML = 'No participants found for this event';
                return;
            }

            eventTitle.innerHTML = `"${participants[0].eventTitle}" participants`;

            participants.forEach(participant => {
                const participantElement = document.createElement('div');
                participantElement.classList.add('col-md-4', 'mb-4');
                participantElement.innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${participant.name}</h5>
                                <p class="card-text">${participant.email}</p>
                            </div>
                        </div>
                    `;
                participantsList.appendChild(participantElement);
            });
        })
        .catch(error => console.error('Error:', error));
});