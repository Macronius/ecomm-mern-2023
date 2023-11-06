import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// METHOD
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// PRE - before saved to database
userSchema.pre('save', async function (next) {
  // if this is not a modified password, then call the next piece of mongoose-middleware 
  // aka, if anything other than password (i.e., name, email), then move on because only need to bcrypt passwords
  if (!this.isModified('password')) {
    next();
  }
  //
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
}) // hash password before saved to db
// Q-04


const User = mongoose.model("User", userSchema);

export default User;
