const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const userSection = document.getElementById('userSection');

if (currentUser) {
    userSection.innerHTML = `
        <div class="user-dropdown">
            <span id="userName" class="user-name">${currentUser.name}</span>
            <div class="dropdown-content">
                <button id="logoutBtn">Đăng xuất</button>
            </div>
        </div>
    `;

    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
} else {
    userSection.innerHTML = '<a href="login.html">Đăng nhập</a>';
}