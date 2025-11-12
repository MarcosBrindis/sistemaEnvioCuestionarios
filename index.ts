import express from 'express';
import cors from 'cors';

import { testConnection } from './src/core/db/mysl/connection';
import { requestLogger } from './src/core/middleware/requestLogger';
import { errorHandler } from './src/core/middleware/errorHandler';
import typeQuestionRoutes from './src/typeQuestion/infrastructure/http/router/typeQuestionRoutes';
import questionRoutes from './src/question/infrastructure/http/router/questionRoutes';
import opcionPreguntaRoutes from './src/optionQuestion/infrastructure/http/router/opcionPreguntaRoutes';

const app = express();
const port = process.env.PORT || 3000;

async function startServer() {
    await testConnection();
    
    // Middlewares
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(requestLogger);
    
    // Rutas
    app.use('/api/tipo-pregunta', typeQuestionRoutes);
    app.use('/api/pregunta', questionRoutes);
    app.use('/api/opcion-pregunta', opcionPreguntaRoutes);

    // Ruta raíz
    app.get('/', (_req, res) => {
        res.send('servidor iniciado');
    });
    
    // Manejo de errores (debe ir al final)
    app.use(errorHandler);

    app.listen(port, () => {
        console.log('servidor corriendo en http://localhost:' + port);
    });
}

startServer();
