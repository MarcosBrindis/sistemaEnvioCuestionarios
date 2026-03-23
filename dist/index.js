"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const swagger_1 = require("./src/config/swagger");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const express_session_1 = __importDefault(require("express-session"));
const connection_1 = require("./src/core/db/mysl/connection");
const requestLogger_1 = require("./src/core/middleware/requestLogger");
const errorHandler_1 = require("./src/core/middleware/errorHandler");
const typeQuestionRoutes_1 = __importDefault(require("./src/typeQuestion/infrastructure/http/router/typeQuestionRoutes"));
const questionRoutes_1 = __importDefault(require("./src/question/infrastructure/http/router/questionRoutes"));
const opcionPreguntaRoutes_1 = __importDefault(require("./src/optionQuestion/infrastructure/http/router/opcionPreguntaRoutes"));
const formRoutes_1 = __importDefault(require("./src/form/infrastructure/http/router/formRoutes"));
const egresadoRoutes_1 = __importDefault(require("./src/egresado/infrastructure/http/routes/egresadoRoutes"));
const laborAchievementRoutes_1 = __importDefault(require("./src/laborAchievement/infrastructure/http/router/laborAchievementRoutes"));
const respuestaRoutes_1 = __importDefault(require("./src/respuesta/infrastructure/http/router/respuestaRoutes"));
const academicAchievementRoutes_1 = __importDefault(require("./src/academicAchievement/infrastructure/http/router/academicAchievementRoutes"));
const groupRoutes_1 = __importDefault(require("./src/group/infrastructure/http/router/groupRoutes"));
const authRoutes_1 = __importDefault(require("./src/auth/infrastructure/http/router/authRoutes"));
const usuariosInternosRoutes_1 = require("./src/usuariosInternos/infrastructure/http/routes/usuariosInternosRoutes");
const importarMiembrosRoutes_1 = __importDefault(require("./src/importacionMiembros/infrastructure/http/router/importarMiembrosRoutes"));
const suscripcionRoutes_1 = __importDefault(require("./src/egresado-suscripcion/infrastructure/http/router/suscripcionRoutes"));
const surveyRouter_1 = __importDefault(require("./src/surveys/infrastructure/http/router/surveyRouter"));
const assignmentRouter_1 = __importDefault(require("./src/surveyAssignment/infrastructure/http/router/assignmentRouter"));
const tipoCorreoRoutes_1 = __importDefault(require("./src/typesMail/infrastructure/http/router/tipoCorreoRoutes"));
const emailTemplateRouter_1 = __importDefault(require("./src/emailTemplates/infrastructure/http/router/emailTemplateRouter"));
const account_router_1 = __importDefault(require("./src/mailing/infrastructure/http/router/account.router"));
const client_router_1 = __importDefault(require("./src/mailing/client/infrastructure/http/router/client.router"));
const sender_router_1 = __importDefault(require("./src/mailing/sender/infrastructure/http/router/sender.router"));
const distribution_router_1 = __importDefault(require("./src/distribution/infrastructure/http/router/distribution.router"));
const analytics_router_1 = __importDefault(require("./src/analytics/infrastructure/http/router/analytics.router"));
const datosDomiciliariosRoutes_1 = __importDefault(require("./src/datosDomiciliarios/infrastructure/http/routes/datosDomiciliariosRoutes"));
const datosLaboralesRoutes_1 = __importDefault(require("./src/datosLaborales/infrastructure/http/routes/datosLaboralesRoutes"));
const fileRoutes_1 = __importDefault(require("./src/files/infrastructure/http/router/fileRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, connection_1.testConnection)();
        // Middlewares
        app.use((0, cors_1.default)({
            origin: true,
            credentials: true
        }));
        app.use(express_1.default.json({ limit: '5mb' }));
        app.use(express_1.default.urlencoded({ extended: true, limit: '5mb' }));
        app.use(requestLogger_1.requestLogger);
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
        app.use((0, express_session_1.default)({
            name: 'connect.sid',
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: process.env.SESSION_COOKIE_HTTPONLY === 'true',
                secure: process.env.SESSION_COOKIE_SECURE === 'true',
                sameSite: process.env.SESSION_COOKIE_SAMESITE,
                maxAge: Number(process.env.SESSION_COOKIE_MAXAGE)
            }
        }));
        // Servir archivos estáticos desde la carpeta uploads
        app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
        // Rutas
        app.use('/api/tipo-pregunta', typeQuestionRoutes_1.default);
        app.use('/api/pregunta', questionRoutes_1.default);
        app.use('/api/opcion-pregunta', opcionPreguntaRoutes_1.default);
        app.use('/api/formulario', formRoutes_1.default);
        app.use('/api/respuesta', respuestaRoutes_1.default);
        app.use('/api/egresado/logros-laborales', laborAchievementRoutes_1.default);
        app.use('/api/egresado/logros-academicos', academicAchievementRoutes_1.default);
        app.use('/api/egresado', egresadoRoutes_1.default);
        app.use('/api/datos-domiciliarios', datosDomiciliariosRoutes_1.default);
        app.use('/api/datos-laborales', datosLaboralesRoutes_1.default);
        app.use('/api/files', fileRoutes_1.default);
        app.use('/api/grupo', groupRoutes_1.default);
        app.use('/api/auth', authRoutes_1.default);
        app.use('/api/admin/usuarios-internos', (0, usuariosInternosRoutes_1.createUsuariosInternosRoutes)());
        app.use('/api', importarMiembrosRoutes_1.default);
        app.use('/api', suscripcionRoutes_1.default);
        app.use('/api', tipoCorreoRoutes_1.default);
        app.use('/api/templates-correo', emailTemplateRouter_1.default);
        app.use('/api/encuestas', surveyRouter_1.default);
        app.use('/api/encuestas/:id', assignmentRouter_1.default);
        app.use('/mailing', account_router_1.default);
        app.use('/mailing', client_router_1.default);
        app.use('/mailing', sender_router_1.default);
        app.use('/distribution', distribution_router_1.default);
        app.use('/analytics', analytics_router_1.default);
        // Ruta raíz
        app.get('/', (_req, res) => {
            res.send('servidor iniciado');
        });
        app.use("/docs", swagger_ui_express_1.default.serve, swagger_1.swaggerUiSetup);
        // Manejo de errores (debe ir al final)
        app.use(errorHandler_1.errorHandler);
        app.listen(port, () => {
            console.log('servidor corriendo en http://localhost:' + port);
        });
    });
}
startServer();
