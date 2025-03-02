"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { current, pageSize, book, status, user } = req.query;
    const total = yield model_1.Borrow.countDocuments(Object.assign(Object.assign(Object.assign({}, (book && { book })), (status && { status })), (user && { user })));
    const session = req.session;
    let newUser = user;
    if (session.user && session.user.role === 'user') {
        newUser = session.user._id;
    }
    const data = yield model_1.Borrow.find(Object.assign(Object.assign(Object.assign({}, (book && { book })), (status && { status })), (newUser && { user: newUser })))
        .skip((Number(current) - 1) * Number(pageSize))
        .populate(['user', 'book']);
    res.status(200).json({ message: true, data, total });
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { book, user } = req.body;
    const borrow = new model_1.Borrow(req.body);
    const bookData = yield model_1.Book.findOne({ _id: book });
    if (bookData) {
        if (bookData.stock > 0) {
            yield borrow.save();
            yield model_1.Book.findByIdAndUpdate(bookData._id, { stock: bookData.stock - 1 });
            res.status(200).json({ success: true });
        }
        else {
            res.status(500).json({ message: "this book is not enough" });
        }
    }
    else {
        res.status(500).json({ message: 'this book is not existing' });
    }
    const obj = yield borrow.save();
    return res.json({ success: true, code: 200 });
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const borrow = yield model_1.Borrow.findById(id);
    if (borrow) {
        yield model_1.Borrow.deleteOne({ _id: id });
        res.status(200).json({ success: true });
    }
    else {
        res.status(500).json({ message: 'this borrow is not existing' });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const borrow = yield model_1.Borrow.findById(id);
    if (borrow) {
        res.status(200).json({ data: borrow, success: true });
    }
    else {
        res.status(500).json({ message: 'this borrow is not existing.' });
    }
}));
router.put('/back/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const borrow = yield model_1.Borrow.findOneAndUpdate({ _id: id });
    if (borrow) {
        if (borrow.status === 'off') {
            res.status(500).json({ message: "this book has been returned" });
        }
        else {
            borrow.status = 'off';
            borrow.backAt = Date.now();
            yield borrow.save();
            const book = yield model_1.Book.findOne({ _id: borrow.book });
            if (book) {
                book.stock += 1;
            }
            else {
                res.status(500).json({ message: "this book is not existing" });
            }
            res.status(200).json({ success: true });
        }
    }
    else {
        res.status(500).json({ message: "this borrow is not existing" });
    }
}));
exports.default = router;
