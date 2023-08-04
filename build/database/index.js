"use strict";
// this file will handle create connection with mongodb by mongodb driver
const mongodb_1 = require("mongodb");
const uriConnection = `mongodb+srv://hunghoang:chobicon1@clusterstwitterproject.w9an3wj.mongodb.net/`;
const dbOption = {
    maxPoolSize: 5,
    minPoolSize: 2,
    connectTimeoutMS: 60000,
    socketTimeoutMS: 45000 //Close sockets after 45s of inactivity
};
// I think beside with create a new connection with mongo db, we should keep this connection till the application close
// then I choose sigleton pattern for keeping the database connection or the database instance
class Database {
    // should use private contructor for retrict create outside class zone
    constructor(uriString, options) {
        this.status = false; // true for connected, false for disconnect
        this.client = new mongodb_1.MongoClient(uriString, options);
    }
    get Status() {
        return this.status;
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database(uriConnection);
        }
        return Database.instance;
    }
    async connect() {
        if (this.status) {
            console.log("already connect to db");
            return;
        }
        if (!this.client) {
            console.log('should create instance before connect');
            return;
        }
        try {
            await this.client.connect();
            this.status = true;
            console.log("Connected to DB");
        }
        catch (error) {
            console.log(error);
        }
    }
    async disconnect() {
        if (!this.status) {
            console.log("the db does not be connected");
        }
        if (!this.client) {
            console.log('should create instance before connect');
            return;
        }
        try {
            await this.client.close();
            this.status = false;
            console.log("Disconected to DB");
        }
        catch (error) {
            console.log(error);
        }
    }
    setDb(nameDb) {
        if (!this.client) {
            console.log('should create instance before connect');
            return;
        }
        this.db = this.client.db(nameDb);
    }
    getDb() {
        return this.db;
    }
}
module.exports = Database;
//# sourceMappingURL=index.js.map