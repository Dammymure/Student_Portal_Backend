// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const {verifyToken} = require('../helper/verifyToken')


module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context)
  const { className } = params
  
  if(tokenUser != null && tokenUser.isAdmin){
    const classesTable = aircode.db.table('classes')

  const classes = await classesTable
  .where({className})
  .find() 

  const count = await classesTable
  .where({className})
  .count()


  return{
    count,
    className,
    classes,
  }
  }else{
    context.status(401)
    return{"message":"Token invalid or user is not authorized"}
  }
  

};
