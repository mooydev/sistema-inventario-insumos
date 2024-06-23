import express from 'express';
import cors from 'cors';
import db from './database/db.js';
import router from './routes/routes.js';
import session from 'express-session';

const app = express();

app.use(cors());
app.use(express.json());

// Configura el middleware de sesión antes de las rutas
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use('/insumos', router);

try {
    await db.authenticate();
    console.log('Conexion exitosa')
} catch (error) {
    console.log(`Error de conexion:' + ${error}`);
}

app.listen(8000, ()=>{
    console.log('Server on port http://localhost:8000/');
})
