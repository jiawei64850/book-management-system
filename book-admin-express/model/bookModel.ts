
import mongoose from "mongoose";


const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  author: {
    type: String,
    require: true,
  },
  cover: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  description: {
    type: String,
  },
  stock: {
    type: Number,
    default: 0,
  },
  publishAt: {
    type: Number,
    default: null,
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

export default bookSchema;