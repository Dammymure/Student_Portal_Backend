// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const {verifyToken} = require("../helper/verifyToken")

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context)
  console.log(tokenUser)
  if(tokenUser != null){
    const {_id} = tokenUser;
    const studentTable = aircode.db.table('student')
    const student = await studentTable
    .where({_id})
    .findOne()

    try{
      const result = await studentTable.delete(student)
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
