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
                        borderColor: 'rgba(0, 0, 255, 1)',
                        backgroundColor: 'rgba(0, 0, 255, 0.1)',
                        fill: false,
                        pointRadius: 5,
                        pointBackgroundColor: 'rgba(0, 0, 255, 1)',
                        pointBorderColor: '#fff',
                        pointHoverRadius: 7,
                        pointHoverBackgroundColor: 'rgba(0, 0, 255, 1)',
                        tension: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                        },
                        title: {
                            display: true,
                            text: 'Registrations per Day'
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Days'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Number of Registrations'
                            },
                            beginAtZero: true,
                            ticks: {
                                stepSize: 10
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error loading chart:', error));
}

