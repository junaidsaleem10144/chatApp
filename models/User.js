const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: String,
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;

// const schema = new mongoose.Schema({
//   email: {
//     type: String,
//     trim: true,
//     lowercase: true,
//     unique: true,
//     validate: {
//         validator: function(v) {
//             return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
//         },
//         message: "Please enter a valid email"
//     },
//     required: [true, "Email required"]
// }
// });

// -------------OR ---------------------
//npm install --save-dev validator
// import { isEmail } from 'validator';
// ...
// validate: { validator: isEmail , message: 'Invalid email.' }

// --------- OR -----------
// const mongoose = require('mongoose')
// const validatorPackage = require('validator')

// const UserSchema = new mongoose.Schema({
//       .......

//       email: {
//         type: String,
//         unique: true,
//         required: [true, 'Email address is required'],
//         validate: {
//           validator: validatorPackage.isEmail,
//           message: 'Please provide a valid email',
//         },
//       },
//       .......

// })

// const model = mongoose.model('User', UserSchema)

// module.exports = model
