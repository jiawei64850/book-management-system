"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bookSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
});
exports.default = bookSchema;
