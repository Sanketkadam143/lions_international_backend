import mysql from "mysql2";
import * as dotenv from "dotenv";

dotenv.config();

const HOST = process.env.MYSQLHOST;
const USERNAME = process.env.MYSQLUSER;
const PASSWORD = process.env.MYSQLPASSWORD;
const DATABASE = process.env.MYSQLDATABASE;
const PORT = process.env.MYSQLPORT;

let connection;

function createConnection() {
  return new Promise((resolve, reject) => {
    if (connection) {
      resolve(connection);
    } else {
      connection = mysql.createConnection({
        host: HOST,
        user: USERNAME,
        password: PASSWORD,
        database: DATABASE,
        port: PORT,
        timezone: 'utc',
      });

      connection.connect((err) => {
        if (err) {
          console.log(`Error connecting to the database: ${err}`);
          reject(err);
        } else {
          console.log("Successfully connected to the database.");
          resolve(connection);
          setInterval(() => {
            connection.ping();
          }, 30000); // send ping query every 30 seconds to keep the connection alive
        }
      });
    }
  });
}

export default createConnection;
