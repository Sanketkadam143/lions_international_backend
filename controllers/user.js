import connection from "../config/dbconnection.js";
const db = connection();
export const Profiles=async(req,res)=>{
  const id=req.id;
  try{
    const sql="SELECT * FROM users WHERE id=?";
    const data = await db.promise().query(sql,[id]);
    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const addUser = async (req, res) => {
 

    const {
        firstName,
        middleName,
        lastName,
        address1,
        address2,
        city,
        state,
        postalCode,
        email,
        phone,
        spouseName,
        dob,
        occupation,
        gender,
        password,
        
    } = req.body;
    const clubId =req.clubId;
    const id=req.id;
    try {

      const data=await db.promise().query(
        "UPDATE users SET firstName = ?, middleName = ?, lastName = ?,address1=?, address2 = ?, city = ?, state = ?,postalCode=?, email = ?, phone = ?, spouseName = ?, dob = ?, occupation = ?, gender = ?, password = ? ,clubId=? WHERE id = ?",
        [
          firstName,
          middleName,
          lastName,
          address1,
          address2,
          city,
          state,
          postalCode,
          email,
          phone,
          spouseName,
          dob,
          occupation,
          gender,
          password,
          clubId
        ]
      );     
      console.log(data);
      return res.status(200).json({ successMessage: "Profile Updated" });
     
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };