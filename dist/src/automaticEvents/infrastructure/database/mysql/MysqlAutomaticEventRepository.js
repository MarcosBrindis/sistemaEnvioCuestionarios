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
exports.MysqlAutomaticEventRepository = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
function parseJsonPayload(raw) {
    try {
        return JSON.parse(raw);
    }
    catch (_a) {
        throw new Error('No se pudo parsear payload_json del evento automatico.');
    }
}
function parseJsonResult(raw) {
    if (!raw)
        return null;
    try {
        return JSON.parse(raw);
    }
    catch (_a) {
        return null;
    }
}
function mapEvent(row) {
    return {
        id_event: row.id_event,
        name: row.name,
        event_type: row.event_type,
        cron_expression: row.cron_expression,
        timezone: row.timezone,
        payload: parseJsonPayload(row.payload_json),
        is_active: row.is_active === 1,
        starts_at: row.starts_at,
        ends_at: row.ends_at,
        next_run_at: row.next_run_at,
        last_run_at: row.last_run_at,
        created_by: row.created_by,
        updated_by: row.updated_by,
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}
function mapRun(row) {
    return {
        id_run: row.id_run,
        id_event: row.id_event,
        scheduled_for: row.scheduled_for,
        started_at: row.started_at,
        finished_at: row.finished_at,
        status: row.status,
        attempts: row.attempts,
        triggered_by: row.triggered_by,
        error_message: row.error_message,
        result: parseJsonResult(row.result_json),
        created_at: row.created_at
    };
}
class MysqlAutomaticEventRepository {
    create(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const [result] = yield connection_1.MysqlConnection.execute(`
      INSERT INTO automatic_event
        (name, event_type, cron_expression, timezone, payload_json, is_active, starts_at, ends_at, next_run_at, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
                input.name,
                input.event_type,
                input.cron_expression,
                input.timezone,
                JSON.stringify(input.payload),
                input.is_active ? 1 : 0,
                (_a = input.starts_at) !== null && _a !== void 0 ? _a : null,
                (_b = input.ends_at) !== null && _b !== void 0 ? _b : null,
                (_c = input.next_run_at) !== null && _c !== void 0 ? _c : null,
                input.created_by,
                input.created_by
            ]);
            const created = yield this.findById(result.insertId);
            if (!created) {
                throw new Error('No se pudo crear el evento automatico.');
            }
            return created;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.query(`SELECT * FROM automatic_event ORDER BY id_event DESC`);
            return rows.map(mapEvent);
        });
    }
    findById(id_event) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.query(`SELECT * FROM automatic_event WHERE id_event = ? LIMIT 1`, [id_event]);
            const items = rows;
            if (!items.length)
                return null;
            return mapEvent(items[0]);
        });
    }
    update(id_event, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = [];
            const values = [];
            if (input.name !== undefined) {
                fields.push('name = ?');
                values.push(input.name);
            }
            if (input.event_type !== undefined) {
                fields.push('event_type = ?');
                values.push(input.event_type);
            }
            if (input.cron_expression !== undefined) {
                fields.push('cron_expression = ?');
                values.push(input.cron_expression);
            }
            if (input.timezone !== undefined) {
                fields.push('timezone = ?');
                values.push(input.timezone);
            }
            if (input.payload !== undefined) {
                fields.push('payload_json = ?');
                values.push(JSON.stringify(input.payload));
            }
            if (input.starts_at !== undefined) {
                fields.push('starts_at = ?');
                values.push(input.starts_at);
            }
            if (input.ends_at !== undefined) {
                fields.push('ends_at = ?');
                values.push(input.ends_at);
            }
            if (input.next_run_at !== undefined) {
                fields.push('next_run_at = ?');
                values.push(input.next_run_at);
            }
            fields.push('updated_by = ?');
            values.push(input.updated_by);
            fields.push('updated_at = NOW()');
            yield connection_1.MysqlConnection.execute(`UPDATE automatic_event SET ${fields.join(', ')} WHERE id_event = ?`, [...values, id_event]);
            return this.findById(id_event);
        });
    }
    setActive(id_event, is_active, updated_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.execute(`
      UPDATE automatic_event
      SET is_active = ?, updated_by = ?, updated_at = NOW()
      WHERE id_event = ?
      `, [is_active ? 1 : 0, updated_by, id_event]);
            return this.findById(id_event);
        });
    }
    createRun(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const [result] = yield connection_1.MysqlConnection.execute(`
      INSERT INTO automatic_event_run
        (id_event, scheduled_for, started_at, status, attempts, triggered_by)
      VALUES (?, ?, NOW(), 'running', 1, ?)
      `, [input.id_event, input.scheduled_for, (_a = input.triggered_by) !== null && _a !== void 0 ? _a : null]);
            const [rows] = yield connection_1.MysqlConnection.query(`SELECT * FROM automatic_event_run WHERE id_run = ? LIMIT 1`, [result.insertId]);
            const items = rows;
            if (!items.length) {
                throw new Error('No se pudo crear la ejecucion del evento.');
            }
            return mapRun(items[0]);
        });
    }
    finishRun(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            yield connection_1.MysqlConnection.execute(`
      UPDATE automatic_event_run
      SET
        status = ?,
        finished_at = NOW(),
        error_message = ?,
        result_json = ?
      WHERE id_run = ?
      `, [
                input.status,
                (_a = input.error_message) !== null && _a !== void 0 ? _a : null,
                input.result === undefined ? null : JSON.stringify(input.result),
                input.id_run
            ]);
            if (input.status === 'success') {
                const [runRows] = yield connection_1.MysqlConnection.query(`SELECT id_event FROM automatic_event_run WHERE id_run = ? LIMIT 1`, [input.id_run]);
                const idEvent = (_b = runRows[0]) === null || _b === void 0 ? void 0 : _b.id_event;
                if (idEvent) {
                    yield connection_1.MysqlConnection.execute(`UPDATE automatic_event SET last_run_at = NOW(), updated_at = NOW() WHERE id_event = ?`, [idEvent]);
                }
            }
        });
    }
    listRuns(id_event) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.query(`
      SELECT *
      FROM automatic_event_run
      WHERE id_event = ?
      ORDER BY id_run DESC
      LIMIT 100
      `, [id_event]);
            return rows.map(mapRun);
        });
    }
}
exports.MysqlAutomaticEventRepository = MysqlAutomaticEventRepository;
