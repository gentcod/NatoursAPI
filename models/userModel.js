const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'User name is required'],
      // trim: true,
   },
   email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
   },
   photo: {
      type: String,
   },
   password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: 8,
   },
   passwordConfirm: {
      type: String,
      required: [true, 'Please confirm password'],
      validate: {
         validator: function(el) {
            return el === this.password;
         },
         message: 'Password does not match'
      }
   },
});

userSchema.pre('save', async function(next) {
   if (!this.isModified('password')) return next();

   this.password = await bcrypt.hash(this.password, 12);

   this.passwordConfirm = undefined;
   next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;