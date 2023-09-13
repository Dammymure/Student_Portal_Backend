// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const {verifyToken} = require("../helper/verifyToken")

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context)
  console.log(tokenUser)
  if(tokenUser != null && tokenUser.isAdmin){
    const {_id} = tokenUser;
    const teacherTable = aircode.db.table('teacher')
    const teacher = await teacherTable
    .where({_id})
    .findOne()

    try{
      const result = await teacherTable.delete(teacher)
      context.status(204)
      return{
        result
      }
    }catch(err){
      context.status(500)
      return{
        "message": err.message
      }
    }
  }else{
    context.status(401)
    return{
      "message":"Token is in valid or the user is not authorized"
    }
  }
};
