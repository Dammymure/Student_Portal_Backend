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

  const studentTable = aircode.db.table('student')

  const studentExist = await studentTable
    .where({email})
    .findOne()

  if(studentExist){
    context.status(409)
    return{"message":"Student already exists"}
  }

  try{
        const hashedPassword = await bcrypt.hash(password, 10)
        const newStudent = {name, email, "password":hashedPassword,image, className, "isAdmin":false}

        await studentTable.save(newStudent)

        const result = await studentTable
        .where({email})
        .projection({password: 0})
        .find()

        console.log("the student is :", result)
        context.status(201);

        return {...result};
    
  }catch{
         context.status(500)
         return{"message": err.message} 
  }
};
