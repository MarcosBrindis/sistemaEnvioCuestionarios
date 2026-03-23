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
exports.EnqueueEmailUseCase = void 0;
class EnqueueEmailUseCase {
    constructor(queue) {
        this.queue = queue;
    }
    execute(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!payload.to || !payload.subject) {
                throw new Error('Los campos to y subject son obligatorios.');
            }
            const jobId = yield this.queue.enqueue(payload);
            return { jobId };
        });
    }
}
exports.EnqueueEmailUseCase = EnqueueEmailUseCase;
