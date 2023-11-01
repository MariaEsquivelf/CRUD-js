const singupForm = document.querySelector('#signForm');
function getStoredUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}
singupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.querySelector('#userName').value;
    const name = document.querySelector('#name').value;
    const password = document.querySelector('#password').value;

    const Users = getStoredUsers();
    console.log(Users)

    const IsUserRegistered = Users.find(user => user.username === username);
    if (IsUserRegistered) {
        return alert('El usuario ya esta registrado');
    }

    Users.push({
        username: username,
        name: name,
        password: password
    });

    localStorage.setItem('users', JSON.stringify(Users));
    window.location.href = 'login.html';

    alert('Registro exitoso');
});
