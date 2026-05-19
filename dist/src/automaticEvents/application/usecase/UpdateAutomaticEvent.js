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
exports.UpdateAutomaticEvent = void 0;
const validation_1 = require("./validation");
class UpdateAutomaticEvent {
    constructor(repository) {
        this.repository = repository;
    }
    execute(id_event, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const current = yield this.repository.findById(id_event);
            if (!current) {
                return null;
            }
            if (request.cron_expression !== undefined) {
                (0, validation_1.validateCronExpression)(request.cron_expression);
            }
            if (request.timezone !== undefined) {
                (0, validation_1.validateTimezone)(request.timezone);
            }
            const mergedEventType = (_a = request.event_type) !== null && _a !== void 0 ? _a : current.event_type;
            const mergedPayload = (_b = request.payload) !== null && _b !== void 0 ? _b : current.payload;
            (0, validation_1.validatePayloadByType)(mergedEventType, mergedPayload);
            if (request.name !== undefined && !request.name.trim()) {
                throw new Error('name no puede estar vacio.');
            }
            const input = {
                name: (_c = request.name) === null || _c === void 0 ? void 0 : _c.trim(),
                event_type: request.event_type,
                cron_expression: request.cron_expression,
                timezone: request.timezone,
                payload: request.payload,
                starts_at: (0, validation_1.parseOptionalDate)(request.starts_at, 'starts_at'),
                ends_at: (0, validation_1.parseOptionalDate)(request.ends_at, 'ends_at'),
                next_run_at: (0, validation_1.parseOptionalDate)(request.next_run_at, 'next_run_at'),
                updated_by: request.updated_by
            };
            return this.repository.update(id_event, input);
        });
    }
}
exports.UpdateAutomaticEvent = UpdateAutomaticEvent;
