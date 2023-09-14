import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();


export const uniqueName = (name) => {
  let filename = name.replace(/\s/g, "");
  filename = filename.toLowerCase();
  filename = filename.replace(/[^a-z0-9.]/g, "-");
  filename = filename.replace(/-+/g, "-").replace(/^-|-$/g, "");
  const uniqueSuffix = Date.now();
  filename = uniqueSuffix + "-" + filename;
  return filename;
};

export const writeFile = async (path, buffer) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, buffer, (err) => {
      if (err) {
        console.log(err, "error in writing file");
        reject(err);
      }
      resolve();
    });
  });
};

export const getCurrentIndianTime = () => {
  try {
    const istTime = new Date().toLocaleString(undefined, {
      timeZone: "Asia/Kolkata",
    });
    // const currentTime = new Date(istTime);
    return istTime;
  } catch (error) {
    console.error("Error fetching current time:", error);
    return null;
  }
};

export const canReport = (selectedMonth) => {

  const today = new Date(getCurrentIndianTime());
  const curMonth = today.getMonth() + 1;
  const prevMonth = curMonth === 1 ? 12 : curMonth - 1;
  const currentDate = today.getDate();
  const lastDateToReport = process.env.LAST_DATE_TO_REPORT;
  
  // condition to decide whether user can report
  if (selectedMonth == prevMonth) {
    // last date to report
    return currentDate <= lastDateToReport;
  } else if (selectedMonth == curMonth) {
    return true;
  }
  return false;
  // return selectedMonth >= curMonth;
};
