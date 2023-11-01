loginForm = document.getElementById('loginForm')
function getStoredUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}
loginForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const Users =getStoredUsers();
    const IsUserRegistered = Users.find(user => user.username === username);
    if(IsUserRegistered){
        
        if(IsUserRegistered.password === password){
            window.location.href = 'facturas.html'

        }
        else{
            alert("El usuario y la contraseña no coinciden")
            return 
        }
      
    }else{
        alert('Usuario no registrado');
    }
    return 
})
