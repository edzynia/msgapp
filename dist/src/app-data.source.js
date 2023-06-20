"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5455,
    username: 'admin',
    password: 'admin',
    database: 'main',
    entities: ['./dist/**/*.entity.js'],
    logging: false,
    synchronize: true,
});
