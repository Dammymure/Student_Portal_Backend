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

  const teacherTable = aircode.db.table('teacher')

  const teacher = await teacherTable
  .where({email})
  .findOne()

  if(!teacher){
    context.status(401)
    return{"message":"email or password is not valid"}
  }
  
   const matchPassword = await bcrypt.compare(password, teacher.password)

    if(matchPassword){
    // Token generetion
    const accessToken = jwt.sign({
      "_id": teacher._id,
      "name": teacher.name,
      "email": teacher.email,
      "image": teacher.image,
      "className": teacher.className,
      "isAdmin":teacher.isAdmin
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:"1d"}                  
    );

    const currentTeacher = {...teacher, accessToken}
    await teacherTable.save(currentTeacher)
    console.log(teacher)
    context.status(200)
    return{accessToken}
  }else{
    context.status(401)
    return{"message":"email or password is not valid"}
  }
}