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

export const writeFile = async (path,buffer)=>{

    return new Promise((resolve,reject)=>{
        fs.writeFile(path, buffer, (err) => {
        if (err) {
            console.log(err,"error in writing file");
            reject(err)
        }
        resolve()
        });
    })
}