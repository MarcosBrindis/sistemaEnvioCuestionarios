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
exports.TriggerAutomaticEvent = void 0;
class TriggerAutomaticEvent {
    constructor(repository, executor) {
        this.repository = repository;
        this.executor = executor;
    }
    execute(id_event, triggered_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.repository.findById(id_event);
            if (!event) {
                return null;
            }
            const run = yield this.repository.createRun({
                id_event,
                scheduled_for: new Date(),
                triggered_by
            });
            try {
                const result = yield this.executor.execute(event);
                yield this.repository.finishRun({
                    id_run: run.id_run,
                    status: 'success',
                    result
                });
                return { run_id: run.id_run, status: 'success', result };
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Error desconocido al ejecutar el evento.';
                yield this.repository.finishRun({
                    id_run: run.id_run,
                    status: 'failed',
                    error_message: message
                });
                throw new Error(message);
            }
        });
    }
}
exports.TriggerAutomaticEvent = TriggerAutomaticEvent;
