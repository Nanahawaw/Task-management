"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const task_1 = __importDefault(require("./routes/task"));
const comment_1 = __importDefault(require("./routes/comment"));
const tag_1 = __importDefault(require("./routes/tag"));
const notification_1 = __importDefault(require("./routes/notification"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/auth', auth_1.default);
app.use('/api/tasks', task_1.default);
app.use('/api/tags', tag_1.default);
app.use('/api/comments', comment_1.default);
app.use('/api/notifications', notification_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
