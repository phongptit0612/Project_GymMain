const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const userSection = document.getElementById('userSection');
const nav = document.querySelector('nav');

if (currentUser) {
  // Add admin link if the user is an admin
  if (currentUser.role === 'admin') {
    const adminLink = document.createElement('a');
    adminLink.href = 'admin.html';
    adminLink.textContent = 'Admin Dashboard';
    nav.insertBefore(adminLink, nav.firstChild); // Add the link to the left of the nav bar
  }

  // Display user dropdown
  userSection.innerHTML = `
    <div class="user-dropdown">
      <span id="userName" class="user-name">${currentUser.name}</span>
      <div class="dropdown-content">
        <button id="logoutBtn">Đăng xuất</button>
      </div>
    </div>
  `;

  // Logout functionality
  document.getElementById('logoutBtn').addEventListener('click', function () {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  });
} else {
  // If no user is logged in, show login link
  userSection.innerHTML = '<a href="login.html">Đăng nhập</a>';
}