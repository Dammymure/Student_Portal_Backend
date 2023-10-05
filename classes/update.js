// // // @see https://docs.aircode.io/guide/functions/
// // const aircode = require('aircode');
// // const {verifyToken} = require("../helper/verifyToken")


// // module.exports = async function (params, context) {
// //   const tokenUser = await verifyToken(context)
// //   console.log(tokenUser)
// //   if(tokenUser != null && tokenUser.isAdmin){
// //     const {className, students: newStudents, assignment} =params;

// //     const classesTable = aircode.db.table("classes")

// //     try{
// //       const findClass = await classesTable
// //       .where({className})
// //       .findOne() 

// //     if (className = null) findClass.className = tokenUser.className;
// //     if (assignment) findClass.assignment = assignment;


// //       const mergedStudents = [...findClass.students, ...newStudents];
// //        const result = await classesTable.save({className, students: mergedStudents, assignment })

// //       console.log(findClass)
// //       console.log("YOUR RSULT IS ",result)
// //       context.status(200)
// //       return result 
// //     }catch(err){
// //       context.status(500)
// //       return{"message": err.message}  
// //     }
// //   }else{
// //     context.status(401)
// //     return{"message":"Token in invalid or user is not authorized"}
// //   }
// // };

// const aircode = require('aircode');
// const { verifyToken } = require("../helper/verifyToken");

// module.exports = async function (params, context) {
//   const tokenUser = await verifyToken(context);

//   if (tokenUser != null && tokenUser.isAdmin) {
//     const { className, students: newStudents, assignment } = params;

//     const classesTable = aircode.db.table("classes");

//     try {
//       const findClass = await classesTable
//         .where({ className })
//         .findOne();

//       if (!findClass) {
//         context.status(404);
//         return { "message": "Class not found" };
//       }

//       // If className or assignment are provided, update them
//       if (className) findClass.className = className;
//       if (assignment) findClass.assignment = assignment;

//       // Merge the existing students with newStudents
//       const mergedStudents = [...findClass.students, ...newStudents];

//       // Update the students field only
//       findClass.students = mergedStudents;

//       // Save the updated class
//       const result = await classesTable.save(findClass);

//       context.status(200);
//       return result;
//     } catch (err) {
//       context.status(500);
//       return { "message": err.message };
//     }
//   } else {
//     context.status(401);
//     return { "message": "Token is invalid or user is not authorized" };
//   }
// };

const aircode = require('aircode');
const { verifyToken } = require("../helper/verifyToken");

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);

  if (tokenUser != null && tokenUser.isAdmin) {
    const { className, students: newStudents, assignment } = params;

    const classesTable = aircode.db.table("classes");

    try {
      const findClass = await classesTable
        .where({ class:tokenUser.className })
        .findOne();

      if (!findClass) {
        context.status(404);
        return { "message": "Class not found" };
      }

      // If className or assignment are provided, update them
      if (className) findClass.className = className;
      if (assignment) findClass.assignment = assignment;

      // Merge the existing students with newStudents
      if (newStudents) {
        findClass.students = [...findClass.students, ...newStudents];
      }

      // Save the updated class
      const result = await classesTable.save(findClass);

      context.status(200);
      return result;
    } catch (err) {
      context.status(500);
      return { "message": err.message };
    }
  } else {
    context.status(401);
    return { "message": "Token is invalid or user is not authorized" };
  }
};

