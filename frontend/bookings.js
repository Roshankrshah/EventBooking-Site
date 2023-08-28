
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
        })
        .catch(err => {
            console.log(err);
        })