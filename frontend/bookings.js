const listContainer = document.querySelector('.bookings_list');

const requestBody = {
    query: `
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
        const innerEle = resData.data.bookings.map(booking => {
            return `
                <li class="bookings_item">
                    <div class="bookings_item-data">
                        ${booking.event.title}<span> - </span> ${new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                    <div class="bookings_item-actions">
                        <button class="cancel_booking-btn" onClick = "deleteBooking('${booking._id}')">Cancel</button>
                    </div>
                </li>
                `;
        }).join('');

        listContainer.innerHTML = innerEle;
    })
    .catch(err => {
        console.log(err);
    })

const deleteBooking = bookingId => {
    console.log(bookingId);
    const deleteBody = {
        query: `
            mutation{
                cancelBooking(bookingId: "${bookingId}"){
                    _id
                    title
                }
            }`
    };

    fetch('http://localhost:3003/graphql', {
        method: 'POST',
        body: JSON.stringify(deleteBody),
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
    location.reload();
}