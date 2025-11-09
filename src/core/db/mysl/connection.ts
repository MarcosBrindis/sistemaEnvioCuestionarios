import mysql from 'mysql2/promise';
import { dbEnv, validateDBEnv } from './env';

validateDBEnv();

export const MysqlConnection = mysql.createPool({
    host: dbEnv.host,
    user: dbEnv.user,
    password: dbEnv.password,
    database: dbEnv.database,
    port: dbEnv.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: true
    }
})

export async function testConnection() {
    try {
        await MysqlConnection.query('SELECT 1');
        console.log('conxion establecida a la base de datos');
    }catch (error) {
        console.error(error);
        process.exit(1);
    }
}
