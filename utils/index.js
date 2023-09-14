import fs from "fs";

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
