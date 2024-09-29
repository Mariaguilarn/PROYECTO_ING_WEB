document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita que el formulario se envíe de forma predeterminada, asi dice gpt

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verifica si ta todo correcto
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('FirstName:', firstName);
    console.log('LastName:', lastName);
    console.log('email:', email);

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, firstName, lastName, email }),
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (data.message) {
            alert(data.message); // Muestra un mensaje de éxito o errorrrr al userrr
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
});


document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    console.log(data);
    if (data.message === 'Inicio de sesión exitoso') {
        alert('Login exitoso');
    } else {
        alert('Login fallido: ' + data.message);
    }
});

// Lógica para mostrar/ocultar el form
document.getElementById('showLogin').addEventListener('click', function() {
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
});

document.getElementById('showRegister').addEventListener('click', function() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
});

document.getElementById('googleLogin').addEventListener('click', function() {
    window.location.href = '/auth/google'; // Redirige a lo de Google
});
