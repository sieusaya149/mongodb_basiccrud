"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./database"));
const user_repository_1 = require("./database/repository/user.repository");
// initial connection to db
const dbInstance = database_1.default.getInstance();
dbInstance.connect();
dbInstance.setDb('crudbasic');
const userReposeInstance = user_repository_1.UserRepo.getInstance();
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    dbInstance.disconnect()
        .then(() => process.exit(0));
});
// create instance of express
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
// define basic routes for the project
app.get('/hello-world', (req, res) => {
    res.status(200).json('Hello World');
});
// INSERT
app.post('/addOneUser', async (req, res) => {
    const { name, email, password } = req.body;
    const newUser = new user_repository_1.User(name, email, password);
    userReposeInstance.addOneUser(newUser)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(`${err}`));
});
app.post('/addManyUsers', async (req, res) => {
    const listUser = [];
    for (const user of req.body) {
        const { name, email, password } = user;
        const newUser = new user_repository_1.User(name, email, password);
        listUser.push(newUser);
    }
    // 
    userReposeInstance.addManyUsers(listUser)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(`${err}`));
});
// READ
app.get('/getUserById', (req, res) => {
    const { id } = req.body;
    userReposeInstance.getUserById(id)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(`${err}`));
});
app.get('/getUserByAtr', (req, res) => {
    const { atr } = req.body;
    userReposeInstance.getUserByAtr(atr)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(`${err}`));
});
app.get('/getAllUser', (req, res) => {
    userReposeInstance.getAllUser()
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(`${err}`));
});
// UPDATE
app.put('/updateUserById', async (req, res) => {
    const { id, name, email, password } = req.body;
    await userReposeInstance.updateUserById(id, name, email, password)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(`${err}`));
});
app.put('/updateUserByAtr', async (req, res) => {
    const { atr, name, email, password } = req.body;
    userReposeInstance.updateUserByAtr(atr, name, email, password)
        .then(result => res.status(200).json(`update user by atr success`))
        .catch(err => res.status(400).json(`${err}`));
});
// DELETE
app.delete('/deleteUserById', async (req, res) => {
    const { id } = req.body;
    const result = await userReposeInstance.deleteUserById(id)
        .then(rs => {
        let message = "";
        if (rs.deletedCount > 0) {
            message = `delete user with ${id} success`;
        }
        else {
            message = `user with ${id} does not exist`;
        }
        return res.status(200).json(message);
    })
        .catch(err => res.status(400).json(`${err}`));
});
app.delete('/deleteUserByAtr', async (req, res) => {
    const { atr } = req.body;
    userReposeInstance.deleteUserByAtr(atr)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(`${err}`));
});
app.delete('/deleteAllUser', async (req, res) => {
    userReposeInstance.deleteAllUser()
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(`${err}`));
});
module.exports = app;
//# sourceMappingURL=app.js.map