// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
require('dotenv').config

module.exports = async function (params, context) {
  const {email, password} = params

  if(!email || !password){
    context.status(400)  
    return{"message":"All fields are mandatory"}
  }

  const studentTable = aircode.db.table('student')

  const student = await studentTable
  .where({email})
  .findOne()

  if(!student){
    context.status(401)
    return{"message":"email or password is not valid"}
  }
  
   const matchPassword = await bcrypt.compare(password, student.password)

    if(matchPassword){
    // Token generetion
    const accessToken = jwt.sign({
      "_id": student._id,
      "name": student.name,
      "email": student.email,
      "image": student.image,
      "className": student.className,
      "isAdmin":student.isAdmin
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:"1d"}                  
    );

    const currentStudent = {...student, accessToken}
    await studentTable.save(currentStudent)
    console.log(student)
    context.status(200)
    return{accessToken}
  }else{
    context.status(401)
    return{"message":"email or password is not valid"}
  }
}