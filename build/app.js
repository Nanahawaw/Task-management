"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const auth_1 = __importDefault(require("./routes/auth"));
const task_1 = __importDefault(require("./routes/task"));
const comment_1 = __importDefault(require("./routes/comment"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const knex_1 = __importDefault(require("knex"));
const objection_1 = require("objection");
const websockets_1 = require("./websockets");
//import knex config
const knexfile_1 = __importDefault(require("./knexfile"));
const taskService_1 = require("./services/taskService");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = (0, websockets_1.setupWebSocket)(server);
const PORT = process.env.PORT || 3000;
// Initialize Knex instance
const knex = (0, knex_1.default)(knexfile_1.default);
// Bind Knex instance to Objection models
objection_1.Model.knex(knex);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/auth', auth_1.default);
app.use('/api/tasks', task_1.default);
app.use('/api/comments', comment_1.default);
//set the websocket instance iin taskservice
taskService_1.taskService.setIo(io);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
