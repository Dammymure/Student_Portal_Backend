// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const {verifyToken} = require("../helper/verifyToken")


module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context)
  console.log(tokenUser)
  if(tokenUser != null){
    const {name,email,image,className} = params
    const { _id } = tokenUser;
    const studentTable = aircode.db.table('student')
    const student = await studentTable
    .where({_id})
    .projection({isAdmin: 0, password: 0, accessToken: 0})
    .findOne()

    if (name) student.name = name;
    if (email) student.email = email;
    if (image) student.image = image;      
    if (className) student.className = className;

    try{
      await studentTable.save(student)
      context.status(200)
      return{
        ...student
      }
      }catch(err){
        context.status(500)
        return {
          "message": err.message
        }
        }
  }else{
    context.status(401)
    return{
      "message": "Token invalid or user is not authorized"
    }
  }
  
};
