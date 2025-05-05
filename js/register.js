const form = document.getElementById('registerForm');
const successPopup = document.getElementById('successPopup');
//regex emailemail
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input').forEach(input => input.classList.remove('error'));
    
    let hasError = false;
    
    if (name === '' || name.length < 2) {
        document.getElementById('nameError').textContent = name === '' ? 
            'Tên không được để trốngtrống' : 
            'Tên phải có it nhất 2 ký tự';
        document.getElementById('name').classList.add('error');
        hasError = true;
    }
    
    if (email === '' || !emailPattern.test(email)) {
        document.getElementById('emailError').textContent = email === '' ? 
            'Email không được để trốngtrống' : 
            'Email không hợp lệlệ';
        document.getElementById('email').classList.add('error');
        hasError = true;
    }
    
    if (password === '' || password.length < 8) {
        document.getElementById('passwordError').textContent = password === '' ? 
            'Mật khẩu không được để trống' : 
            'Độ dài mật khẩu phải ít nhất 8 ký tựtự';
        document.getElementById('password').classList.add('error');
        hasError = true;
    }
    
    if (confirmPassword === '' || confirmPassword !== password) {
        document.getElementById('confirmPasswordError').textContent = confirmPassword === '' ? 
            'Xác nhận mật khẩu không được để trống' : 
            'Mật khẩu xác nhận không khớp';
        document.getElementById('confirmPassword').classList.add('error');
        hasError = true;
    }
    
    if (!hasError) {
        let users;
        if (localStorage.getItem('users')) {
            users = JSON.parse(localStorage.getItem('users'));
        } else {
            users = [];
        }
        
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            document.getElementById('emailError').textContent = 'Email already registered';
            document.getElementById('email').classList.add('error');
            return;
        }
        
        const newUser = {
            name: name,
            email: email,
            password: password,
            role: 'customer'
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        successPopup.style.display = 'flex';
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2500);
    }
});