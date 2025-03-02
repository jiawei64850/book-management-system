import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  nickName: {
    type: String,
  },
  password: {
    type: String,
  },
  sex: {
    type: String,
  },
  role: {
    type: String,
  },
  status: {
    type: String,
  },
  createAt: {
    type: Number,
    default: Date.now,
  },
  updateAt: {
    type: Number,
    default: Date.now,
  }
});

export default userSchema;