const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const userSection = document.getElementById('userSection');
const nav = document.querySelector('nav');

if (currentUser) {
  if (currentUser.role === 'admin') {
    const adminLink = document.createElement('a');
    adminLink.href = 'admin.html';
    adminLink.textContent = 'Admin Dashboard';
    nav.insertBefore(adminLink, nav.firstChild); 
  }

  userSection.innerHTML = `
    <div class="user-dropdown">
      <span id="userName" class="user-name">${currentUser.name}</span>
      <div class="dropdown-content">
        <button id="logoutBtn">Đăng xuất</button>
      </div>
    </div>
  `;

  document.getElementById('logoutBtn').addEventListener('click', function () {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  });
} else {
  userSection.innerHTML = '<a href="login.html">Đăng nhập</a>';
}

