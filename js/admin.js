const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser || currentUser.role !== 'admin') {
    window.location.href = 'login.html';
}

document.querySelector('.logout').addEventListener('click', function(e) {
    e.preventDefault(); 
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
});

let gymCourses = 0;
let yogaCourses = 0;
let zumbaCourses = 0;

