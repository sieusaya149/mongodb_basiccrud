"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// this file will handle start server
const app_1 = __importDefault(require("./app"));
const port = 3000;
// starting the server on specific port
app_1.default.listen(port, () => {
    console.log(`The server listen on ${port}`);
});
//# sourceMappingURL=index.js.map