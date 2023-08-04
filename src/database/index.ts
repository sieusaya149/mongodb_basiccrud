// this file will handle create connection with mongodb by mongodb driver
import {MongoClient, Db, MongoClientOptions} from 'mongodb'

const uriConnection = `mongodb+srv://hunghoang:chobicon1@clusterstwitterproject.w9an3wj.mongodb.net/`
const dbOption = {
    maxPoolSize: 5, // maintain up 5 sockets connection
    minPoolSize: 2, // maintain up 2 sockets connection
    connectTimeoutMS: 60000, // give up initial connection after 60 seconds
    socketTimeoutMS: 45000 //Close sockets after 45s of inactivity
} as MongoClientOptions
// I think beside with create a new connection with mongo db, we should keep this connection till the application close
// then I choose sigleton pattern for keeping the database connection or the database instance

class Database{
    private static instance: Database;
    private client?: MongoClient // the client connection 
    private db?: Db // the db that we use in the project
    private status: Boolean = false; // true for connected, false for disconnect
    // should use private contructor for retrict create outside class zone
    private constructor(uriString: string, options?: MongoClientOptions)
    {
        this.client = new MongoClient(uriString, options)
    }

    public get Status()
    {
        return this.status
    }

    static getInstance()
    {
        if(!Database.instance)
        {
            Database.instance = new Database(uriConnection)
        }
        return Database.instance;
    }

    public async connect()
    {
        if(this.status)
        {
            console.log("already connect to db")
            return
        }
        if(!this.client)
        {
            console.log('should create instance before connect')
            return 
        }
        try {
            await this.client.connect()
            this.status = true
            console.log("Connected to DB")
        } catch (error) {
            console.log(error)
        }
    }

    public async disconnect()
    {
        if(!this.status)
        {
            console.log("the db does not be connected")
        }
        if(!this.client)
        {
            console.log('should create instance before connect')
            return 
        }
        try {
            await this.client.close()
            this.status = false
            console.log("Disconected to DB")
        } catch (error) {
            console.log(error)
        }
    }

    public setDb(nameDb: string)
    {
        if(!this.client)
        {
            console.log('should create instance before connect')
            return 
        }
        this.db = this.client.db(nameDb)
    }

    public getDb(): any
    {
        return this.db
    }
}

export = Database