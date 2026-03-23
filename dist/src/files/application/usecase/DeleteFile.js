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
exports.DeleteFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class DeleteFile {
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullFilePath = this.findFilePathById(id);
            if (!fullFilePath) {
                throw new Error('Archivo no encontrado');
            }
            if (fs_1.default.existsSync(fullFilePath)) {
                fs_1.default.unlinkSync(fullFilePath);
            }
        });
    }
    findFilePathById(id) {
        const baseDir = path_1.default.join(process.cwd(), 'uploads');
        if (!fs_1.default.existsSync(baseDir)) {
            return null;
        }
        const entries = fs_1.default.readdirSync(baseDir, { withFileTypes: true });
        const queue = entries.map((entry) => path_1.default.join(baseDir, entry.name));
        while (queue.length > 0) {
            const current = queue.shift();
            if (!current) {
                continue;
            }
            const stats = fs_1.default.statSync(current);
            if (stats.isDirectory()) {
                const innerEntries = fs_1.default.readdirSync(current, { withFileTypes: true });
                innerEntries.forEach((entry) => queue.push(path_1.default.join(current, entry.name)));
                continue;
            }
            const extension = path_1.default.extname(current);
            const filename = path_1.default.basename(current, extension);
            if (filename === id) {
                return current;
            }
        }
        return null;
    }
}
exports.DeleteFile = DeleteFile;
