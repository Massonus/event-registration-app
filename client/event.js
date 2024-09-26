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

function loadEvents(page = 1, limit = 8) {
    fetch('/api/events')
        .then(response => response.json())
        .then(events => {
            const totalEvents = events.length;
            const totalPages = Math.ceil(totalEvents / limit);
            const start = (page - 1) * limit;
            const end = start + limit;

            displayEvents(events.slice(start, end));
            setupPagination(totalPages, page);
        });
}

function displayEvents(events) {
    const eventList = document.getElementById('events-list');
    eventList.innerHTML = '';

    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'col-md-3 event-card';

        eventElement.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${event.title}</h5>
                    <p class="card-text">${event.description}</p>
                    <p class="card-text"><small class="text-muted">Date: ${new Date(event.eventDate).toLocaleDateString()}</small></p>
                    <p class="card-text"><small class="text-muted">Organizer: ${event.organizer}</small></p>
                    <button class="btn btn-primary" onclick="registerForEvent('${event._id}')">Register</button>
                    <button class="btn btn-secondary" onclick="viewParticipants('${event._id}')">View</button>
                </div>
            </div>
        `;
        eventList.appendChild(eventElement);
    });
}

function setupPagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let page = 1; page <= totalPages; page++) {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item ${page === currentPage ? 'active' : ''}`;
        pageItem.innerHTML = `<a class="page-link" href="#" onclick="loadEvents(${page})">${page}</a>`;
        pagination.appendChild(pageItem);
    }
}
