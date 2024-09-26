document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');

    loadParticipants(eventId);

    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const searchQuery = document.getElementById('searchQuery').value.trim();
        if (searchQuery) {
            loadParticipants(eventId, searchQuery);
        }
    });

    document.getElementById('resetSearch').addEventListener('click', function () {
        document.getElementById('searchQuery').value = '';
        loadParticipants(eventId);
    });
});

function loadParticipants(eventId, searchQuery = '') {
    fetch(`/api/participants/${eventId}?search=${searchQuery}`)
        .then(response => response.json())
        .then(participants => {
            const participantsList = document.getElementById('participants-list');
            const eventTitle = document.getElementById('event-title');

            participantsList.innerHTML = '';

            if (participants.length === 0) {
                eventTitle.innerHTML = searchQuery
                    ? `No participants found for the search query "${searchQuery}"`
                    : 'No participants found for this event';
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
}
