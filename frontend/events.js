
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
    ){
        alert('Fields cannot be Empty!!!')
        return;
    }
    const event = {title,price,description,date};
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
                    creator{
                        _id
                        email
                    }
                }
            }`
    };

    const token = localStorage.getItem('token');

    fetch('http://localhost:3003/graphql',{
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers:{
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + token
        }
    })
    .then(res=>{
        if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!');
        }
        return res.json();
    })
    .then(resData => {
        console.log(resData);
    })
    .catch(err=>{
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
fetch('http://localhost:3003/graphql',{
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers:{
        'Content-Type' : 'application/json',
    }
})
.then(res=>{
    if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
    }
    return res.json();
})
.then(resData => {
    let events = resData.data.events;
    eventList = events.map(event=>{
        return `<li class="events_list-item">${event.title}</li>`
    }).join('');
    console.log(eventList)
    const listContainer = document.querySelector('.events_list');
    listContainer.innerHTML = eventList;
})
.catch(err=>{
    console.log(err);
});





