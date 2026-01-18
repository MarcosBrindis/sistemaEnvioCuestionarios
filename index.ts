import express from 'express';
import cors from 'cors';
import { swaggerUiSetup } from './src/config/swagger';
import swaggerUi from "swagger-ui-express";
import session from 'express-session';

import { testConnection } from './src/core/db/mysl/connection';
import { requestLogger } from './src/core/middleware/requestLogger';
import { errorHandler } from './src/core/middleware/errorHandler';
import typeQuestionRoutes from './src/typeQuestion/infrastructure/http/router/typeQuestionRoutes';
import questionRoutes from './src/question/infrastructure/http/router/questionRoutes';
import opcionPreguntaRoutes from './src/optionQuestion/infrastructure/http/router/opcionPreguntaRoutes';
import formRoutes from './src/form/infrastructure/http/router/formRoutes';
import egresadoRoutes from './src/egresado/infrastructure/http/routes/egresadoRoutes'
import respuestaRoutes from './src/respuesta/infrastructure/http/router/respuestaRoutes';
import groupRoutes from './src/group/infrastructure/http/router/groupRoutes';
import authRoutes from './src/auth/infrastructure/http/router/authRoutes';
import importarMiembrosRoutes from './src/importacionMiembros/infrastructure/http/router/importarMiembrosRoutes';
import suscripcionRoutes from './src/egresado-suscripcion/infrastructure/http/router/suscripcionRoutes';

import tipoCorreoRoutes from './src/typesMail/infrastructure/http/router/tipoCorreoRoutes';
import emailTemplateRouter from './src/emailTemplates/infrastructure/http/router/emailTemplateRouter';

const app = express();
const port = process.env.PORT || 3000;

async function startServer() {
    await testConnection();
    
    // Middlewares
    app.use(cors({
        origin: true,
        credentials: true
    }));
    app.use(express.json({ limit: '5mb' }));
    app.use(express.urlencoded({ extended: true, limit: '5mb' }));
    app.use(requestLogger);

    const requiredSessionVars = [
        'SESSION_SECRET',
        'SESSION_COOKIE_HTTPONLY',
        'SESSION_COOKIE_SECURE',
        'SESSION_COOKIE_SAMESITE',
        'SESSION_COOKIE_MAXAGE'
    ];
    const missingVars = requiredSessionVars.filter((v) => !(v in process.env));
    if (missingVars.length > 0) {
        throw new Error(`Faltan variables de entorno para la configuración de sesión: ${missingVars.join(', ')}`);
    }

    // Configuración de sesión estrictamente desde .env
    app.use(session({
        name: 'connect.sid',
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: process.env.SESSION_COOKIE_HTTPONLY === 'true',
            secure: process.env.SESSION_COOKIE_SECURE === 'true',
            sameSite: process.env.SESSION_COOKIE_SAMESITE as boolean | 'lax' | 'strict' | 'none',
            maxAge: Number(process.env.SESSION_COOKIE_MAXAGE)
        }
    }));

    // Rutas
    app.use('/api/tipo-pregunta', typeQuestionRoutes);
    app.use('/api/pregunta', questionRoutes);
    app.use('/api/opcion-pregunta', opcionPreguntaRoutes);
    app.use('/api/formulario', formRoutes);
    app.use('/api/respuesta', respuestaRoutes);
    app.use('/api/egresado', egresadoRoutes)
    app.use('/api/grupo', groupRoutes)
    app.use('/api/auth', authRoutes);
    app.use('/api', importarMiembrosRoutes);
    app.use('/api', suscripcionRoutes);

    app.use('/api', tipoCorreoRoutes);
    app.use('/api/templates-correo', emailTemplateRouter);

    // Ruta raíz
    app.get('/', (_req, res) => {
        res.send('servidor iniciado');
    });

    app.use("/docs", swaggerUi.serve, swaggerUiSetup);
    
    // Manejo de errores (debe ir al final)
    app.use(errorHandler);

    app.listen(port, () => {
        console.log('servidor corriendo en http://localhost:' + port);
    });
}

startServer();
