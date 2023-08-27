const inputEmail = document.getElementById('InputEmail');
const inputPassword = document.getElementById('InputPassword');
const loginForm = document.querySelector('.login-container');
const signupForm = document.querySelector('.signup-container');

let form = loginForm;
if (loginForm === null) {
    form = signupForm;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = inputEmail.value;
    const password = inputPassword.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
        return;
    }
    let requestBody = {
        query: `
            query{
                login(email: "${email}", password: "${password}"){
                    userId
                    token
                    tokenExpiration
                }
            }`
    };

    if (loginForm === null) {
        requestBody = {
            query: `
            mutation {
                createUser(userInput:{email:"${email}",password:"${password}"}){
                    _id
                    email
                }
            }`
        }
    }

    fetch('http://localhost:3003/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
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
})