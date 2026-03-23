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
exports.LocalEmailQueue = void 0;
class LocalEmailQueue {
    constructor() {
        this.queue = [];
        this.running = false;
        this.idCounter = 0;
    }
    enqueue(job) {
        return __awaiter(this, void 0, void 0, function* () {
            this.queue.push(job);
            this.processNext();
            this.idCounter += 1;
            return String(this.idCounter);
        });
    }
    registerWorker(processor) {
        this.processor = processor;
        this.processNext();
    }
    processNext() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.running || !this.processor)
                return;
            const job = this.queue.shift();
            if (!job)
                return;
            this.running = true;
            try {
                yield this.processor(job);
            }
            finally {
                this.running = false;
                setImmediate(() => this.processNext());
            }
        });
    }
}
exports.LocalEmailQueue = LocalEmailQueue;
