document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');

    loadParticipants(eventId);
    loadRegistrationChart(eventId);

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

            eventTitle.innerHTML = `${participants[0].eventTitle} Participants`;

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

function loadRegistrationChart(eventId) {
    fetch(`/api/registrations/${eventId}/daily`)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('registrationChart').getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.dates,
                    datasets: [{
                        label: 'Registrations per Day',
                        data: data.counts,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Number of Registrations'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error loading chart:', error));
}
