import mysql from "mysql2";
import * as dotenv from "dotenv";

dotenv.config();

const HOST = process.env.MYSQLHOST;
const USERNAME = process.env.MYSQLUSER;
const PASSWORD = process.env.MYSQLPASSWORD;
const DATABASE = process.env.MYSQLDATABASE;
const PORT = process.env.MYSQLPORT;
const PROTOCOL = process.env.MYSQLPROTOCOL || 'tcp';

let connection;

function createConnection() {
  if (connection) return connection;

  connection = mysql.createConnection({
    host: HOST,
    user: USERNAME,
    password: PASSWORD,
    database: DATABASE,
    port: PORT,
    protocol: PROTOCOL
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
