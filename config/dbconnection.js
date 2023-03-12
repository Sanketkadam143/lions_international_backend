import mysql from "mysql2";
import * as dotenv from "dotenv";

dotenv.config();

const HOST = process.env.HOST;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;

let connection;

function createConnection() {
    if(connection) return connection;
    connection = mysql.createConnection({
        host: HOST,
        user: USERNAME,
        password: PASSWORD,
        database: DATABASE
    });
    connection.connect((err) => {
        if (err) {
            console.log(`Error connecting to the database: ${err}`);
        } else {
            console.log("Successfully connected to the database.");
        }
    });
    return connection;
}

export default createConnection;