"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepo = exports.User = void 0;
const mongodb_1 = require("mongodb");
const __1 = __importDefault(require(".."));
const user_model_1 = __importDefault(require("../model/user.model"));
class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = this.updatedAt = new Date();
    }
    getUser() {
        return this;
    }
}
exports.User = User;
class UserRepo {
    constructor() {
        (0, user_model_1.default)(__1.default.getInstance().getDb());
    }
    static getInstance() {
        if (!UserRepo.instance) {
            UserRepo.instance = new UserRepo();
            UserRepo.instance.setUserCollection('users');
        }
        return UserRepo.instance;
    }
    setUserCollection(collectionName) {
        return this.userCollection = __1.default.getInstance().getDb().collection(collectionName);
    }
    async addOneUser(user) {
        try {
            const insertResult = await this.userCollection.insertOne(user);
            return `insert one user success with result ${JSON.stringify(insertResult, null, 4)}`;
        }
        catch (error) {
            throw new Error(`insert one user failed with reason ${error}`);
        }
    }
    async addManyUsers(listUser) {
        try {
            const insertResult = await this.userCollection.insertMany(listUser);
            return `insert many users success with result ${JSON.stringify(insertResult, null, 4)}`;
        }
        catch (error) {
            throw new Error(`insert many users failed with reason ${error}`);
        }
    }
    async updateUserById(id, name, email, password) {
        const objId = new mongodb_1.ObjectId(id);
        try {
            const filter = { "_id": objId };
            const updateUser = { updatedAt: new Date() };
            if (name) {
                updateUser.name = name;
            }
            if (email) {
                updateUser.email = email;
            }
            if (password) {
                updateUser.password = password;
            }
            const insertResult = await this.userCollection.updateOne(filter, { "$set": updateUser });
            return `update by id success with result ${JSON.stringify(insertResult, null, 4)}`;
        }
        catch (error) {
            throw new Error(`udpate by id failed with reason ${error}`);
        }
    }
    async updateUserByAtr(atr, name, email, password) {
        const filter = {};
        if (atr.by === 'email') {
            filter.email = atr.val;
        }
        else if (atr.by === 'name') {
            filter.name = atr.val;
        }
        else {
            throw new Error("Please correct atr value");
        }
        try {
            const updateUser = { updatedAt: new Date() };
            if (name) {
                updateUser.name = name;
            }
            if (email) {
                updateUser.email = email;
            }
            if (password) {
                updateUser.password = password;
            }
            const insertResult = await this.userCollection.updateMany(filter, { "$set": updateUser });
            console.log(`update user by atr success with result ${JSON.stringify(insertResult, null, 4)}`);
        }
        catch (error) {
            throw new Error(`update user by atr failed with reason ${error}`);
        }
    }
    async getUserById(id) {
        const objId = new mongodb_1.ObjectId(id);
        try {
            const filter = { "_id": objId };
            const result = await this.userCollection.findOne(filter);
            result === null || result === void 0 ? true : delete result.password;
            return result;
        }
        catch (error) {
            throw new Error(`Find user by ${id} failed with reason ${error}`);
        }
    }
    async getAllUser() {
        // const userCollection = this.getUserCollection('users')
        try {
            const cursor = this.userCollection.find({});
            const listUser = await cursor.toArray();
            const result = [];
            for (const user of listUser) {
                delete user.password;
                result.push(user);
            }
            return result;
        }
        catch (error) {
            throw new Error(`Find all users failed with reason ${error}`);
        }
    }
    async getUserByAtr(atr) {
        const filter = {};
        if (atr.by === 'email') {
            filter.email = atr.val;
        }
        else if (atr.by === 'name') {
            filter.name = atr.val;
        }
        else {
            throw new Error("Please correct atr value");
        }
        try {
            const cursor = this.userCollection.find(filter);
            const listUser = await cursor.toArray();
            const result = [];
            for (const user of listUser) {
                delete user.password;
                result.push(user);
            }
            return result;
        }
        catch (error) {
            throw new Error(`Get user by atr failed with reason ${error}`);
        }
    }
    async deleteUserById(id) {
        const objId = new mongodb_1.ObjectId(id);
        try {
            const filter = { "_id": objId };
            const result = await this.userCollection.deleteOne(filter);
            return result;
        }
        catch (error) {
            throw new Error(`delete user by ${id} failed with reason ${error}`);
        }
    }
    async deleteUserByAtr(atr) {
        const filter = {};
        if (atr.by === 'email') {
            filter.email = atr.val;
        }
        else if (atr.by === 'name') {
            filter.name = atr.val;
        }
        else {
            throw new Error("Please correct atr value");
        }
        try {
            const result = await this.userCollection.deleteMany(filter);
            return `delete user successs by atr success ${JSON.stringify(result)}`;
        }
        catch (error) {
            throw new Error(`find user by atr failed with reason ${error}`);
        }
    }
    async deleteAllUser() {
        try {
            const result = await this.userCollection.deleteMany({});
            return `delete all user successs by atr success ${JSON.stringify(result)}`;
        }
        catch (error) {
            throw new Error(`delete all user failed with reason ${error}`);
        }
    }
}
exports.UserRepo = UserRepo;
//# sourceMappingURL=user.repository.js.map