const inputEmail = document.getElementById('InputEmail');
const inputPassword = document.getElementById('InputPassword');
const loginForm = document.querySelector('.login-container');
const signupForm = document.querySelector('.signup-container');

let form = signupForm;
if (loginForm !== null) {
    form = loginForm;
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
            query Login($email: String!, $password: String!) {
                login(email: $email, password: $password){
                    userId
                    token
                    tokenExpiration
                }
            }`,
            variables:{
                email: email,
                password: password
            }
    };

    if (loginForm === null) {
        requestBody = {
            query: `
            mutation CreateUser($email: String!, $password: String!){
                createUser(userInput:{email:$email,password:$password}){
                    _id
                    email
                }
            }`,
            variables:{
                email: email,
                password: password
            }
        }
    }

    fetch('http://localhost:3003/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json'
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
            if(loginForm){
                localStorage.setItem('token', resData.data.login.token);
                localStorage.setItem('userId', resData.data.login.userId);
                localStorage.setItem('tokenExpiration',resData.data.login.tokenExpiration);
                window.location.replace("/frontend/events.html");
            }else{
                if(resData.data.createUser)
                    alert('User Created, Now you can Login');
                else{
                    alert('User Already Exist,You can Login');
                }
            }
        })
        .catch(err => {
            console.log(err);
        })
})