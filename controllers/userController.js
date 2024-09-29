const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Conexión a la base de datosssss
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'academia'
});

// lo de googleee
passport.use(new GoogleStrategy({
    clientID: '406948019678-fp1od6och197rgito2398allciok8ioq.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile;
    const email = emails[0].value;

    // verifica si existe el userrrr
    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], async (error, results) => {
        if (error) return done(error);
        
        if (results.length > 0) {
            // ci el usuario ya existe
            return done(null, results[0]);
        } else {
            // El usuario no existe, así que lo creamos
            const newUserQuery = 'INSERT INTO users (username, email, provider) VALUES (?, ?, ?)';
            connection.query(newUserQuery, [displayName, email, 'google'], (err, result) => { // Cambia a 'google'
                if (err) return done(err);
                const newUser = { id: result.insertId, username: displayName, email: email, provider: 'google' }; 
                return done(null, newUser);
            });
        }
    });
}));


// Registrar un nuevo usuarioooooo
exports.registerUser = async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    try {
        // Cifrar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserta el nuevo usuario en la base de datos
        const query = 'INSERT INTO users (username, password, email, provider, firstName, lastName) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(query, [username, hashedPassword, email, 'local', firstName, lastName], (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Error al registrar el usuario', error });
            }
            res.json({ message: 'Usuario registrado correctamente', userId: results.insertId });
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor', error });
    }
};


// Inicio de sesión incluyendo Google
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Validando datosssss
    if (!username || !password) {
        return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos' });
    }

    // Buscando al usuario en la dataaaa baese
    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], async (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error en el servidor', error });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const user = results[0];

        // Comparar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Si todo gucci, devolver un mensaje de éxitossssss
        res.json({ message: 'Inicio de sesión exitoso', userId: user.id });
    });
};
