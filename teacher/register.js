// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const bcrypt = require('bcrypt');


module.exports = async function (params, context) {
  console.log('Received params:', params);
  console.log('Received context:', context);

  const {name, email, password, image, className} = params
  if(!name || !email || !password){
    context.status(400)
    return{"message":"All fields are rewuired"}
  }

  const teacherTable = aircode.db.table('teacher')

  const teacherExist = await teacherTable
    .where({email})
    .findOne()

  if(teacherExist){
    context.status(409)
    return{"message":"User already exists"}
  }

  try{
        const hashedPassword = await bcrypt.hash(password, 10)
        const newTeacher = {name, email, "password":hashedPassword,image, className, "isAdmin":true}

        await teacherTable.save(newTeacher)

        const result = await teacherTable
        .where({email})
        .projection({password: 0})
        .find()

        console.log("the teacher is :", result)
        context.status(201);

        return {...result};
    
  }catch{
         context.status(500)
         return{"message": err.message} 
  }
};
