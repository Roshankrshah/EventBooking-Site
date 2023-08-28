
if (localStorage.getItem('token')) {
    document.querySelector('.logoutBtn').classList.remove('disabled');
    document.querySelector('.logoutBtn').setAttribute('aria-disabled', 'false');
    document.querySelector('.booking').classList.remove('disabled');
    document.querySelector('.booking').setAttribute('aria-disabled', 'false');
    document.querySelector('.container').style.display = 'block';
}

const logoutBtn = document.querySelector('.logoutBtn');
const btn = document.querySelector('.btn');
const container = document.querySelector('.container');
const modal = document.querySelector('.modal-overlay');
const closeBtn = document.querySelector(".close-btn");
const confirmBtn = document.querySelector(".confirm-btn");

logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.replace("http://127.0.0.1:5500/frontend/login.html");
});

btn.addEventListener('click', () => {
    modal.classList.add('open-modal')
});

confirmBtn.addEventListener('click', () => {
    const title = document.getElementById('title').value;
    const price = +(document.getElementById('price').value);
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    if (
        title.trim().length === 0 ||
        price <= 0 ||
        description.trim().length === 0 ||
        date.trim().length === 0
    ) {
        alert('Fields cannot be Empty!!!')
        return;
    }
    const event = { title, price, description, date };
    console.log(event);

    const requestBody = {
        query: `
            mutation{
                createEvent(eventInput: {title: "${title}",description:"${description}",price:${price},date:"${date}"}){
                    _id
                    title
                    description
                    date
                    price
                }
            }`
    };

    const token = localStorage.getItem('token');

    fetch('http://localhost:3003/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData);
            const listEle = document.createElement('li');
            listEle.classList.add('events_list-item');

            listEle.innerHTML = `
            <div>
                <h3>${resData.data.createEvent.title}<h3>
                <h6> ₹${resData.data.createEvent.price}<span> - </span> ${new Date(resData.data.createEvent.date).toLocaleDateString()}<h6>
            </div>
            <div>
                <button class="viewbtn"> View Details</button>
            </div>`;
            listContainer.appendChild(listEle);
        })
        .catch(err => {
            console.log(err);
        })

    modal.classList.remove("open-modal");
})
closeBtn.addEventListener("click", () => {
    modal.classList.remove("open-modal");
});


const requestBody = {
    query: `
        query{
            events{
                _id
                title
                description
                date
                price
                creator{
                    _id
                    email
                }
            }
        }`
};

let eventList;
const listContainer = document.querySelector('.events_list');
let viewBtn;
fetch('http://localhost:3003/graphql', {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
        'Content-Type': 'application/json',
    }
})
    .then(res => {
        if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!');
        }
        return res.json();
    })
    .then(resData => {
        let events = resData.data.events;
        eventList = events.map(event => {
            const stringEvent = btoa(JSON.stringify(event));
            const innerEle = `<li class="events_list-item">
            <div>
                <h3>${event.title}<h3>
                <h6> ₹${event.price}<span> - </span> ${new Date(event.date).toLocaleDateString()}<h6>
            </div>
            <div>
                <button class="viewbtn" onclick="openViewModal('${stringEvent}')"> View Details</button>
            </div>
        </li>`
            return innerEle;
        }).join('');
        listContainer.innerHTML = eventList;

    })
    .catch(err => {
        console.log(err);
    });


const openViewModal = (event) => {
    const parsed = JSON.parse(atob(event));
    const viewModal = document.createElement('div');
    viewModal.classList.add('modal-overlay');
    viewModal.classList.add('open-modal');
    viewModal.innerHTML = `
    <div class="modal-container">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">${parsed.title}</h5>
            </div>
            <div class="modal-body">
                <h2>${parsed.title}</h2>
                <h5>${new Date(parsed.date).toLocaleDateString()}</h5>
                <p>${parsed.description}</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary viewclose-btn" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary book-btn">Book</button>
            </div>
        </div>
    </div>`;
    listContainer.appendChild(viewModal);
    let viewcloseBtn = document.querySelector(".viewclose-btn");
    let bookBtn = document.querySelector(".book-btn");

    viewcloseBtn.addEventListener("click", () => {
        listContainer.removeChild(viewModal);
    });

    bookBtn.addEventListener('click', () => {
        const token = localStorage.getItem('token');
        if (!token) {
            listContainer.removeChild(viewModal);
            return;
        }
        const bookBody = {
            query: `
            mutation{
                bookEvent(eventId:"${parsed._id}"){
                    _id
                    createdAt
                    updatedAt
                }
            }`
        };

        fetch('http://localhost:3003/graphql', {
            method: 'POST',
            body: JSON.stringify(bookBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                console.log(resData);
            })
            .catch(err => {
                console.log(err);
            })
        
        listContainer.removeChild(viewModal);
    });
}


