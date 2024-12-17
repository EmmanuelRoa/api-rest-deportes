import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT
};

async function testConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log(chalk.green('Database connected successfully'));
        await connection.end();
    } catch (error) {
        console.error(chalk.red('Database connection failed:'), error);
    }
}

testConnection();