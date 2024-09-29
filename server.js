// Importamos a nuestro buen amigo express, que nos ayudará a montar el servidorrrr
const express = require('express');

// express-session nos guarda las sesiones de users
const session = require('express-session');

// Invocamos a express para crear nuestra app
const app = express();

// Ponemos el puertoooouu
const PORT = process.env.PORT || 5000;

// Importamos al mysql2
const mysql = require('mysql2');

// Llamamos a Passport para la autenticazaooou
const passport = require('passport');

// La estrategia de Google
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configuramos la sesión
app.use(session({ 
    secret: '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', // Esta es la clave secreta
    resave: false,  // para ahorrar espacioooo y no guardar sesion
    saveUninitialized: true // Guardamos la sesión aunque no la hayamos usado aún
}));

// Inicializamos Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuramos Google para que la gente pueda entrar con su cuenta de Google
passport.use(new GoogleStrategy({
    clientID: '406948019678-fp1od6och197rgito2398allciok8i...', // La clave secreta
    clientSecret: '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', // Esto también
    callbackURL: '/auth/google/callback' // te manda de vuelta a esta url si todo esta ok
}, 
(accessToken, refreshToken, profile, done) => {
    // Aquí puedes guardar el perfil del usuario, actualizar la data base
    return done(null, profile); // si todo bien puede ingresar
}));

// Aquí le decimos a Passport cómo identificar al usuario en la sesión y cómo reconocerlo cuando vuelva a iniciar
passport.serializeUser((user, done) => {
    done(null, user); // Guardamos al usuario
});

passport.deserializeUser((user, done) => {
    done(null, user); // Cuando vuelva, Passport lo reconoce y lo deja entrar al usuario
});

// Creamos la ruta para empezar la autenticación con Google, queremos su perfil y su email
app.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// tras iniciar sesion nos vamos al home
app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }), // Si falla va de vuelta la inicio
    (req, res) => {
        res.redirect('/');
    }
);

// Usamos el middleware express.json para poder recibir datos JSON en las peticiones
app.use(express.json());

// Importamos nuestras rutas de usuarios
const userRoutes = require('./routes/userRoutes');

// usamos las rutas de los usuarios 
app.use('/api/users', userRoutes);

// Archivos estáticos (HTML, CSS, etc.) que están en la carpeta 'public'
app.use(express.static('public'));

// Ruta de prueba para ver si el servidor funciona
app.get('/api', (req, res) => {
    res.send('Servidor funcionando'); 
});

// Iniciamos el servidor, con el puerto de antes
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`); 
});

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: '', 
    database: 'academia'
});

// Conectamos a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos: ' + err.stack); // Si falla hacemos que se muestre en la consola
        return;
    }
    console.log('Conectado a la base de datos como ID ' + connection.threadId);
});

// Ruta POST para registrar usuarios
app.post('/api/register', (req, res) => {
    const { username, password } = req.body; // Tomamos el nombre de usuario y contraseña de la solicitud
    
    res.json({ message: 'Usuario registrado correctamente', username }); //avisamos que el user queda registrado
});
