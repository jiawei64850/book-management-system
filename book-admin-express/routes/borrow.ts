import { Book, Borrow } from "../model";
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const { current, pageSize, book, status, user } = req.query;
  const total = await Borrow.countDocuments({
    ...(book && { book }),
    ...(status && { status }),
    ...(user && { user }),
  });

  const session = req.session as any;
  let newUser = user;
  if (session.user && session.user.role === 'user') {
    newUser = session.user._id;
  }

  const data = await Borrow.find({
    ...(book && { book }),
    ...(status && { status }),
    ...(newUser && { user: newUser }),
  })
    .skip((Number(current) - 1) * Number(pageSize))
    .populate(['user', 'book'])
 
  
  res.status(200).json({ message: true, data, total });
});


router.post('/', async (req: Request, res: Response) => {
  const { book, user } = req.body;
  const borrow = new Borrow(req.body);
  const bookData = await Book.findOne({ _id: book })
  
  if(bookData) {
    if (bookData.stock > 0) {
      await borrow.save();
      await Book.findByIdAndUpdate(bookData._id, {stock: bookData.stock - 1})
      res.status(200).json({ success: true})
    } else {
      res.status(500).json({ message: "this book is not enough"})
    }
  } else {
    res.status(500).json({ message: 'this book is not existing'})
  }
  
  const obj = await borrow.save();
  return res.json({ success: true, code: 200 });
});


router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const borrow = await Borrow.findById(id);

  if (borrow) {
    await Borrow.deleteOne({ _id: id })
    res.status(200).json({ success: true })
  } else {
    res.status(500).json({ message: 'this borrow is not existing'})
  }

})

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const borrow = await Borrow.findById(id);
  
  if (borrow) {
    res.status(200).json({ data: borrow, success: true });
  } else {
    res.status(500).json({ message: 'this borrow is not existing.'});
  }
})

router.put('/back/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const borrow = await Borrow.findOneAndUpdate({ _id: id });
  if (borrow) {
    if (borrow.status === 'off') {
      res.status(500).json({ message: "this book has been returned" })
    } else {
      borrow.status = 'off'
      borrow.backAt = Date.now();
      await borrow.save()
      const book = await Book.findOne({ _id: borrow.book })

      if (book) {
        book.stock += 1;
      } else {
        res.status(500).json({ message: "this book is not existing"})
      }

      res.status(200).json({ success: true });
    }  
  } else {
    res.status(500).json({ message: "this borrow is not existing" });
  }
})

export default router;
