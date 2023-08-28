
if(localStorage.getItem('token')){
    document.querySelector('.booking').classList.remove('disabled');
    document.querySelector('.booking').setAttribute('aria-disabled',false);
}