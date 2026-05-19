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
exports.CreateAutomaticEvent = void 0;
const validation_1 = require("./validation");
class CreateAutomaticEvent {
    constructor(repository) {
        this.repository = repository;
    }
    execute(request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!((_a = request.name) === null || _a === void 0 ? void 0 : _a.trim())) {
                throw new Error('name es obligatorio.');
            }
            (0, validation_1.validateCronExpression)(request.cron_expression);
            (0, validation_1.validateTimezone)(request.timezone);
            (0, validation_1.validatePayloadByType)(request.event_type, request.payload);
            const input = {
                name: request.name.trim(),
                event_type: request.event_type,
                cron_expression: request.cron_expression,
                timezone: request.timezone,
                payload: request.payload,
                is_active: (_b = request.is_active) !== null && _b !== void 0 ? _b : true,
                starts_at: (0, validation_1.parseOptionalDate)(request.starts_at, 'starts_at'),
                ends_at: (0, validation_1.parseOptionalDate)(request.ends_at, 'ends_at'),
                next_run_at: (0, validation_1.parseOptionalDate)(request.next_run_at, 'next_run_at'),
                created_by: request.created_by
            };
            return this.repository.create(input);
        });
    }
}
exports.CreateAutomaticEvent = CreateAutomaticEvent;
