import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWTKEY = process.env.JWTKEY;

const auth = async (req, res, next) => {
  try {

    // middleware for forget password
    
    if (req.query?.resetToken) {
      const token = req.query?.resetToken;
      const decodedData = jwt.verify(token, JWTKEY);
      req.userId = decodedData?.id;
      req.email = decodedData?.email;

      if (decodedData?.exp < Date.now() / 1000) {
        return res.status(401).send({ message: "Token had expired" });
      }

      next();
    } else {
      const token = req.headers.authorization?.split(" ")[1];
      let decodedData;
      if (!token) {
        return res.status(401).send({ message: "unauthorized" });
      }

      decodedData = jwt.verify(token, JWTKEY);
      req.userId = decodedData?.id;
      req.clubId = decodedData?.clubId;
      req.regionName = decodedData?.regionName;
      req.zoneName = decodedData?.zoneName;
      req.title = decodedData?.title;
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send({ message: "unauthorized" });
  }
};

export default auth;
