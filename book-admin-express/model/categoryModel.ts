
import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
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

export default categorySchema ;