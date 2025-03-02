"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
exports.default = userSchema;
