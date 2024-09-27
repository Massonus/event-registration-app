document.addEventListener('DOMContentLoaded', () => {
    let isInfiniteScroll = false;
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

    document.getElementById('sortBy').addEventListener('change', () => loadEvents());
    document.getElementById('sortOrder').addEventListener('change', () => loadEvents());

    document.getElementById('toggleMode').addEventListener('click', () => {
        isInfiniteScroll = !isInfiniteScroll;
        document.getElementById('pagination').style.display = isInfiniteScroll ? 'none' : 'flex';
        document.getElementById('loadMore').style.display = isInfiniteScroll ? 'block' : 'none';
        loadEvents();
    });

    document.getElementById('loadMore').addEventListener('click', () => {
        const currentPage = parseInt(document.querySelector('#pagination .page-item.active')?.textContent || 1);
        loadEvents(currentPage + 1, 8, true);
    });


});

function loadEvents(page = 1, limit = 8, append = false) {
    const sortBy = document.getElementById('sortBy').value;
    const sortOrder = document.getElementById('sortOrder').value;
    const isInfiniteScroll = document.getElementById('toggleMode').dataset.mode === 'infinite';

    fetch(`/api/events?sortBy=${sortBy}&order=${sortOrder}&page=${page}&limit=${limit}`)
        .then(response => response.json())
        .then(responseData => {
            const {events, totalEvents} = responseData;
            const totalPages = Math.ceil(totalEvents / limit);

            displayEvents(events, append);

            if (!isInfiniteScroll) {
                setupPagination(totalPages, page);
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки событий:', error);
        });
}


function displayEvents(events, append = false) {
    const eventList = document.getElementById('events-list');
    if (!append) eventList.innerHTML = '';

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

function registerForEvent(eventId) {
    window.location.href = `/register.html?eventId=${eventId}`;
}

function viewParticipants(eventId) {
    window.location.href = `/participants.html?eventId=${eventId}`;
}


function setupPagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) {
        return;
    }

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

    const prevPageItem = document.createElement('li');
    prevPageItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevPageItem.innerHTML = `<a class="page-link" href="#" aria-label="Previous" onclick="loadEvents(${currentPage - 1})"><span aria-hidden="true">&laquo;</span></a>`;
    pagination.appendChild(prevPageItem);

    if (totalPages <= 5) {
        for (let page = 1; page <= totalPages; page++) {
            pagination.appendChild(createPageItem(page, page === currentPage));
        }
    } else {

        if (currentPage <= 3) {
            for (let page = 1; page <= 3; page++) {
                pagination.appendChild(createPageItem(page, page === currentPage));
            }
            pagination.appendChild(createDots());
            pagination.appendChild(createPageItem(totalPages));
        } else if (currentPage >= totalPages - 2) {

            pagination.appendChild(createPageItem(1));
            pagination.appendChild(createDots());
            for (let page = totalPages - 2; page <= totalPages; page++) {
                pagination.appendChild(createPageItem(page, page === currentPage));
            }
        } else {

            pagination.appendChild(createPageItem(1));
            pagination.appendChild(createDots());
            pagination.appendChild(createPageItem(currentPage - 1));
            pagination.appendChild(createPageItem(currentPage, true));
            pagination.appendChild(createPageItem(currentPage + 1));
            pagination.appendChild(createDots());
            pagination.appendChild(createPageItem(totalPages));
        }
    }

    const nextPageItem = document.createElement('li');
    nextPageItem.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextPageItem.innerHTML = `<a class="page-link" href="#" aria-label="Next" onclick="loadEvents(${currentPage + 1})"><span aria-hidden="true">&raquo;</span></a>`;
    pagination.appendChild(nextPageItem);
}

