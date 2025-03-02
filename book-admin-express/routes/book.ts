import { Book } from "../model";
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const { current = 1, pageSize = 20, name, author, category } = req.query;
  const data = await Book.find({
    ...(name && { name }),
    ...(author && { author }),
    ...(category && { category }),
  })
    .skip((Number(current) - 1) * Number(pageSize))
    .populate('category')
    .limit(Number(pageSize));
  const total = await Book.countDocuments({
    ...(name && { name }),
    ...(author && { author }),
    ...(category && { category }),
  });
  return res.status(200).json({ data, total });
});


router.post('/', (req: Request, res: Response) => {
  const body = req.body;
  console.log(body);
  
  const bookModel = new Book({ ...body });
  bookModel.save();
  return res.json({ success: true, code: 200 });
});


router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await Book.findByIdAndDelete(id);
  return res.status(200).json({ success: true });

})

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const book = await Book.findById(id).populate('category');
  
  if (book) {
    res.status(200).json({ data: book, success: true });
  } else {
    res.status(500).json({ message: 'this book is not existing.'});
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  const body = req.body;
  const { id } = req.params;
  await Book.findOneAndUpdate({ _id: id }, body);
  return res.status(200).json({ success: true });
})

export default router;
