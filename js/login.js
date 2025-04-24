const form = document.getElementById('loginForm');
const successPopup = document.getElementById('successPopup');

// Email regex pattern
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const adminAccount = {
    name: "Admin",
    email: "admin@gym.com",
    password: "admin123",
    role: "admin"
};

let users;
if (localStorage.getItem('users')) {
    users = JSON.parse(localStorage.getItem('users'));
} else {
    users = [];
}
const adminExists = users.some(user => user.email === adminAccount.email);
if (!adminExists) {
    users.push(adminAccount);
    localStorage.setItem('users', JSON.stringify(users));
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input').forEach(input => input.classList.remove('error'));
    
    let hasError = false;
    
    if (email === '' || !emailPattern.test(email)) {
        document.getElementById('emailError').textContent = email === '' ? 
            'Vui lòng nhập email' : 
            'Email không hợp lệ';
        document.getElementById('email').classList.add('error');
        hasError = true;
    }
    
    if (password === '') {
        document.getElementById('passwordError').textContent = 'Vui lòng nhập mật khẩu';
        document.getElementById('password').classList.add('error');
        hasError = true;
    }
    
    if (!hasError) {
        const user = users.find(user => user.email === email && user.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            successPopup.style.display = 'flex';
            
            setTimeout(() => {
                if (user.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'home.html';
                }
            }, 2500);
        } else {
            document.getElementById('passwordError').textContent = 'Email hoặc mật khẩu không đúng';
            document.getElementById('password').classList.add('error');
        }
    }
});
