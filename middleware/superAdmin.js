import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWTKEY = process.env.JWTKEY;

const superAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    let decodedData;
    if (!token) {
      return res.status(401).send({ message: "unauthorized" });
    }
    decodedData = jwt.verify(token, JWTKEY);
    if(decodedData.role!=="superadmin"){
        return res.status(401).send({message:"not a superadmin"});
    }
    req.userId = decodedData?.id;
    req.clubId = decodedData?.clubId;
    req.regionName = decodedData?.regionName;
    req.zoneName = decodedData?.zoneName;
    req.title= decodedData?.title;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({ message: "unauthorized" });
  }
};

export default superAuth;
