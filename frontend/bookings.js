const listContainer = document.querySelector('.booked_events_list');

const requestBody = {
    query:`
        query{
            bookings{
                _id
                createdAt
                event{
                    _id
                    title
                    date
                }
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
            listEle.classList.add('booked_list-item');
            const innerEle = resData.data.bookings.map(booking=>{
                return `
                    <p>${booking.event.title}<span> - </span> ${new Date(booking.createdAt).toLocaleDateString()}</p>
                `;
            }).join('');
            
            listContainer.innerHTML = innerEle;
        })
        .catch(err => {
            console.log(err);
        })