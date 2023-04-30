import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connection from "./config/dbconnection.js";
import * as dotenv from "dotenv";
import auth from "./routes/login.js";
import activity from './routes/activity.js';
import adminReport from './routes/adminReports.js';
import news from './routes/news.js';
import member from './routes/member.js';
import images from './routes/images.js';
import clubs from './routes/clubs.js';
import expense from './routes/expense.js';
import assets from './routes/assets.js';
// import download from './routes/downloadResouces.js';

dotenv.config();
const app = express();
const db = await connection();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
  })
);


app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use("/api/auth", auth);
app.use("/api/activity",activity);
app.use("/api/adminreporting",adminReport)
app.use("/api/news",news);
app.use("/api/member",member);
app.use("/api/images",images);
app.use("/api/clubs",clubs);
app.use("/api/expenses",expense);
app.use("/api/assets",assets);
// app.use("/api/download",downloadResources);

app.listen(PORT, () =>
  console.log(`Server Running on Port: http://localhost:${PORT}`)
);

process.on('SIGINT', () => {
  console.log('Closing connection...');
  db.end();
  process.exit();
});
