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

    const createPageItem = (page, isActive = false) => {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item ${isActive ? 'active' : ''}`;
        pageItem.innerHTML = `<a class="page-link" href="#" onclick="loadEvents(${page})">${page}</a>`;
        return pageItem;
    };

    const createDots = () => {
        const dots = document.createElement('li');
        dots.className = 'page-item disabled';
        dots.innerHTML = `<span class="page-link">...</span>`;
        return dots;
    };

    // Add "Previous" arrow
    const prevPageItem = document.createElement('li');
    prevPageItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevPageItem.innerHTML = `<a class="page-link" href="#" aria-label="Previous" onclick="loadEvents(${currentPage - 1})"><span aria-hidden="true">&laquo;</span></a>`;
    pagination.appendChild(prevPageItem);

    // First three pages
    for (let page = 1; page <= 3; page++) {
        pagination.appendChild(createPageItem(page, page === currentPage));
    }

    // Dots between third and last pages
    if (currentPage > 4) {
        pagination.appendChild(createDots());
    }

    // Pages around current page
    if (currentPage > 3 && currentPage < totalPages - 2) {
        pagination.appendChild(createPageItem(currentPage - 1));
        pagination.appendChild(createPageItem(currentPage, true));
        pagination.appendChild(createPageItem(currentPage + 1));
    }

    // Dots before last two pages
    if (currentPage < totalPages - 3) {
        pagination.appendChild(createDots());
    }

    // Last two pages
    for (let page = totalPages - 1; page <= totalPages; page++) {
        if (page >= 4) {
            pagination.appendChild(createPageItem(page, page === currentPage));
        }
    }

    // Add "Next" arrow
    const nextPageItem = document.createElement('li');
    nextPageItem.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextPageItem.innerHTML = `<a class="page-link" href="#" aria-label="Next" onclick="loadEvents(${currentPage + 1})"><span aria-hidden="true">&raquo;</span></a>`;
    pagination.appendChild(nextPageItem);
}
