const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const userSection = document.getElementById('userSection');

// Kiểm tra trạng thái đăng nhập và hiển thị tương ứng
if (currentUser) {
    // Nếu đã đăng nhập, hiển thị dropdown với tên người dùng
    userSection.innerHTML = `
        <div class="user-dropdown">
            <span id="userName" class="user-name">${currentUser.name}</span>
            <div class="dropdown-content">
                <button id="logoutBtn">Đăng xuất</button>
            </div>
        </div>
    `;

    // Xử lý đăng xuất
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
} else {
    userSection.innerHTML = '<a href="login.html">Đăng nhập</a>';
}