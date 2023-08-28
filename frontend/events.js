
if(localStorage.getItem('token')){
    document.querySelector('.logoutBtn').classList.remove('disabled');
    document.querySelector('.logoutBtn').setAttribute('aria-disabled','false');
    document.querySelector('.booking').classList.remove('disabled');
    document.querySelector('.booking').setAttribute('aria-disabled','false');
}

const logoutBtn = document.querySelector('.logoutBtn');

logoutBtn.addEventListener('click',()=>{
    localStorage.clear();
    window.location.replace("http://127.0.0.1:5500/frontend/login.html");
})