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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomaticEventsController = void 0;
class AutomaticEventsController {
    constructor(createAutomaticEvent, getAutomaticEvents, getAutomaticEventById, updateAutomaticEvent, activateAutomaticEvent, deactivateAutomaticEvent, triggerAutomaticEvent, getAutomaticEventRuns) {
        this.createAutomaticEvent = createAutomaticEvent;
        this.getAutomaticEvents = getAutomaticEvents;
        this.getAutomaticEventById = getAutomaticEventById;
        this.updateAutomaticEvent = updateAutomaticEvent;
        this.activateAutomaticEvent = activateAutomaticEvent;
        this.deactivateAutomaticEvent = deactivateAutomaticEvent;
        this.triggerAutomaticEvent = triggerAutomaticEvent;
        this.getAutomaticEventRuns = getAutomaticEventRuns;
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const created_by = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!created_by) {
                    return res.status(401).json({ error: 'No autenticado' });
                }
                const data = yield this.createAutomaticEvent.execute(Object.assign(Object.assign({}, req.body), { created_by }));
                res.status(201).json({ data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    list(_req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.getAutomaticEvents.execute();
                res.status(200).json({ data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id_event = Number(req.params.id);
                if (Number.isNaN(id_event)) {
                    return res.status(400).json({ error: 'ID invalido.' });
                }
                const data = yield this.getAutomaticEventById.execute(id_event);
                if (!data) {
                    return res.status(404).json({ error: 'Evento automatico no encontrado.' });
                }
                res.status(200).json({ data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id_event = Number(req.params.id);
                if (Number.isNaN(id_event)) {
                    return res.status(400).json({ error: 'ID invalido.' });
                }
                const updated_by = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!updated_by) {
                    return res.status(401).json({ error: 'No autenticado' });
                }
                const data = yield this.updateAutomaticEvent.execute(id_event, Object.assign(Object.assign({}, req.body), { updated_by }));
                if (!data) {
                    return res.status(404).json({ error: 'Evento automatico no encontrado.' });
                }
                res.status(200).json({ data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    activate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id_event = Number(req.params.id);
                if (Number.isNaN(id_event)) {
                    return res.status(400).json({ error: 'ID invalido.' });
                }
                const updated_by = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!updated_by) {
                    return res.status(401).json({ error: 'No autenticado' });
                }
                const data = yield this.activateAutomaticEvent.execute(id_event, updated_by);
                if (!data) {
                    return res.status(404).json({ error: 'Evento automatico no encontrado.' });
                }
                res.status(200).json({ data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deactivate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id_event = Number(req.params.id);
                if (Number.isNaN(id_event)) {
                    return res.status(400).json({ error: 'ID invalido.' });
                }
                const updated_by = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!updated_by) {
                    return res.status(401).json({ error: 'No autenticado' });
                }
                const data = yield this.deactivateAutomaticEvent.execute(id_event, updated_by);
                if (!data) {
                    return res.status(404).json({ error: 'Evento automatico no encontrado.' });
                }
                res.status(200).json({ data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    trigger(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id_event = Number(req.params.id);
                if (Number.isNaN(id_event)) {
                    return res.status(400).json({ error: 'ID invalido.' });
                }
                const triggered_by = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!triggered_by) {
                    return res.status(401).json({ error: 'No autenticado' });
                }
                const data = yield this.triggerAutomaticEvent.execute(id_event, triggered_by);
                if (!data) {
                    return res.status(404).json({ error: 'Evento automatico no encontrado.' });
                }
                res.status(200).json({ data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    listRuns(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id_event = Number(req.params.id);
                if (Number.isNaN(id_event)) {
                    return res.status(400).json({ error: 'ID invalido.' });
                }
                const exists = yield this.getAutomaticEventById.execute(id_event);
                if (!exists) {
                    return res.status(404).json({ error: 'Evento automatico no encontrado.' });
                }
                const data = yield this.getAutomaticEventRuns.execute(id_event);
                res.status(200).json({ data });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AutomaticEventsController = AutomaticEventsController;
