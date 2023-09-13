// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const {verifyToken} = require("../helper/verifyToken")


module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context)
  if(tokenUser != null && tokenUser.isAdmin){
    const studentTable = aircode.db.table('student')
    
    const students = await studentTable
    .where()
    .find() 

    const count = await studentTable
    .where()
    .count()

    return{
    count,
    students
    }
  }
};
