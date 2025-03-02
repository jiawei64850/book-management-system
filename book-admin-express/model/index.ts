import mongoose from "mongoose";
import userSchema from "./userModel";
import bookSchema from "./bookModel";
import categorySchema from "./categoryModel";
import borrowSchema from "./borrowModel";
var uri = 
  "mongodb+srv://karwailau64850:OUBg0KOORmBerXmx@cluster0.mbgwfxq.mongodb.net/LibraryManagementSystem?retryWrites=true&w=majority&appName=Cluster0"
async function main() {
  mongoose.connect(uri);
}

main()
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.log(err);
  })


const User = mongoose.model("User", userSchema);
const Book = mongoose.model("Book", bookSchema);
const Category = mongoose.model("Category", categorySchema);
const Borrow = mongoose.model("Borrow", borrowSchema);
export { User, Book, Category, Borrow };

