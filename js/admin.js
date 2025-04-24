const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser || currentUser.role !== 'admin') {
    window.location.href = 'login.html';
}

// Add logout functionality for the logout link
document.querySelector('.logout').addEventListener('click', function(e) {
    e.preventDefault(); 
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
});
