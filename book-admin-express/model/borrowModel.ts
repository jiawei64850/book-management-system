
import mongoose from "mongoose";


const borrowSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
  status: {
    type: String,
    default: 'on',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  backAt: {
    type: Number,
  },
  createAt: {
    type: Number,
    default: Date.now,
  },
  updateAt: {
    type: Number,
    default: Date.now,
  }
})

export default borrowSchema ;