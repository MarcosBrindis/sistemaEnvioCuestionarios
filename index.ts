import express from 'express';
import { testConnection } from './src/core/db/mysl/connection';

const app = express();
const port = process.env.PORT || 3000;

async function startServer() {
    await testConnection();
    
    app.get('/', (_req, res) => {
        res.send('servidor iniciado');
    });

    app.listen(port, () => {
        console.log('servidor corriendo en http://localhost:' + port);
    })
}

startServer();
