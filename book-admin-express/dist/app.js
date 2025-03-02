"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("./routes/users"));
const book_1 = __importDefault(require("./routes/book"));
const category_1 = __importDefault(require("./routes/category"));
const borrow_1 = __importDefault(require("./routes/borrow"));
const login_1 = __importDefault(require("./routes/login"));
const logout_1 = __importDefault(require("./routes/logout"));
const express_1 = __importDefault(require("express"));
const express_jwt_1 = require("express-jwt");
const constant_1 = require("./constant");
const http_errors_1 = __importDefault(require("http-errors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
require('./model/index');
var app = (0, express_1.default)();
// view engine setup
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use((0, express_session_1.default)({
    secret: constant_1.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 24 * 1000 },
}));
app.use((0, express_jwt_1.expressjwt)({ secret: constant_1.SECRET_KEY, algorithms: ['HS256'] })
    .unless({ path: ['/api/login'] }));
app.use('/api/books', book_1.default);
app.use('/api/categories', category_1.default);
app.use('/api/users', users_1.default);
app.use('/api/borrows', borrow_1.default);
app.use('/api/login', login_1.default);
app.use('/api/logout', logout_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
app.listen('3005', () => {
    console.log('server start at 3005');
});
module.exports = app;
