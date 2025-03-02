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
    const { current = 1, pageSize = 20, name, author, category } = req.query;
    const data = yield model_1.Book.find(Object.assign(Object.assign(Object.assign({}, (name && { name })), (author && { author })), (category && { category })))
        .skip((Number(current) - 1) * Number(pageSize))
        .populate('category')
        .limit(Number(pageSize));
    const total = yield model_1.Book.countDocuments(Object.assign(Object.assign(Object.assign({}, (name && { name })), (author && { author })), (category && { category })));
    return res.status(200).json({ data, total });
}));
router.post('/', (req, res) => {
    const body = req.body;
    console.log(body);
    const bookModel = new model_1.Book(Object.assign({}, body));
    bookModel.save();
    return res.json({ success: true, code: 200 });
});
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield model_1.Book.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const book = yield model_1.Book.findById(id).populate('category');
    if (book) {
        res.status(200).json({ data: book, success: true });
    }
    else {
        res.status(500).json({ message: 'this book is not existing.' });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.params;
    yield model_1.Book.findOneAndUpdate({ _id: id }, body);
    return res.status(200).json({ success: true });
}));
exports.default = router;
