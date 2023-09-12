// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const {verifyToken} = require("../helper/verifyToken")


module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context)
  console.log(tokenUser)
  if(tokenUser != null && tokenUser.isAdmin){
    const {name,email,image,className} = params
    const { _id } = tokenUser;
    const teacherTable = aircode.db.table('teacher')
    const teacher = await teacherTable
    .where({_id})
    .projection({isAdmin: 0, password: 0, accessToken: 0})
    .findOne()

    if (name) teacher.name = name;
    if (email) teacher.email = email;
    if (image) teacher.image = image;      
    if (className) teacher.className = className;

    try{
      await teacherTable.save(teacher)
      context.status(200)
      return{
        ...teacher
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
