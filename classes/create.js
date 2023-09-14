// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const {verifyToken} = require('../helper/verifyToken')


module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context)
  if(tokenUser != null && tokenUser.isAdmin){
    const {students,assignment} = params
    if(!students){
            context.status(400)
      return{
        "message": "Students are mandatory"
      }
    }
    const classesTable = aircode.db.table("classes")

    try{
      console.log("CURRENT TEACHER: ",tokenUser)
      const oneStudent = {
        class: tokenUser.className,
        ...params,
        teacherId: tokenUser._id
      }
      
      const result = await classesTable.save(oneStudent)
      context.status(201)
      return{
        result  
      }
    }catch{
      context.status(500)
      return{"message": err.message}
    }
  }else{
    context.status(401)
    return{"message":"Token in invalid or user is not authorized"}
  }
 
};
