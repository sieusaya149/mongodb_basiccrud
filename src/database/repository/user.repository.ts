import { ObjectId, Db, Collection } from "mongodb";
import { stringify } from "querystring";
import Database from "..";
import createUserCollection from '../model/user.model'
interface IUser {
    _id?: ObjectId;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export class User implements IUser{
    _id?: ObjectId;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(name: string, email: string, password: string)
    {
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = this.updatedAt = new Date()
    }
    public getUser(): User {
        return this
    }
}

type Filter = {
    name?: string,
    email?: string
}

export class UserRepo {
    private static instance: UserRepo
    private userCollection!: Collection
    private constructor() {
        createUserCollection(Database.getInstance().getDb())
    }
    public static getInstance(): UserRepo
    {
        if(!UserRepo.instance)
        {
            UserRepo.instance = new UserRepo()
            UserRepo.instance.setUserCollection('users')
        }
        return UserRepo.instance
    }

    private setUserCollection(collectionName: string): Collection
    {
        return this.userCollection = Database.getInstance().getDb().collection(collectionName)
    }

    public async addOneUser(user: User)
    {
        try {
            const insertResult = await this.userCollection.insertOne(user)
            return `insert one user success with result ${JSON.stringify(insertResult, null, 4)}`
        } catch (error) {
            throw new Error(`insert one user failed with reason ${error}`)
        }
    }

    public async addManyUsers(listUser: User[])
    {
        try {
            const insertResult = await this.userCollection.insertMany(listUser)
            return `insert many users success with result ${JSON.stringify(insertResult, null, 4)}`
        } catch (error) {
            throw new Error(`insert many users failed with reason ${error}`)
        }
    }

    public async updateUserById(id: string,
                                name: string | undefined,
                                email: string | undefined,
                                password: string | undefined)
    {
        
        const objId = new ObjectId(id)
        try {
            const filter = {"_id": objId}
            const updateUser: Partial<User> = { updatedAt: new Date()};
            if (name) {
                updateUser.name = name;
            }
            if (email) {
                updateUser.email = email;
            }
            if (password) {
                updateUser.password = password;
            }
            const insertResult = await this.userCollection.updateOne(filter, {"$set": updateUser})
            return `update by id success with result ${JSON.stringify(insertResult, null, 4)}`
        } catch (error) {
            throw new Error(`udpate by id failed with reason ${error}`)
        }
    }

    public async updateUserByAtr(atr: any,
                                 name: string | undefined,
                                 email: string | undefined,
                                 password: string | undefined)
    {
        const filter: Filter = {}
        if(atr.by === 'email')
        {
            filter.email = atr.val
        }
        else if(atr.by === 'name')
        {
            filter.name = atr.val
        }
        else
        {
            throw new Error("Please correct atr value")
        }
        try {
            const updateUser: Partial<User> = { updatedAt: new Date()};
            if (name) {
                updateUser.name = name;
            }
            if (email) {
                updateUser.email = email;
            }
            if (password) {
                updateUser.password = password;
            }
            const insertResult = await this.userCollection.updateMany(filter, {"$set": updateUser})
            console.log(`update user by atr success with result ${JSON.stringify(insertResult, null, 4)}`)
        } catch (error) {
            throw new Error(`update user by atr failed with reason ${error}`)
        }
    }

    public async getUserById(id: string)
    {
        const objId = new ObjectId(id)
        try {
            const filter = {"_id": objId}
            const result = await this.userCollection.findOne(filter)
            delete result?.password
            return result
        } catch (error) {
            throw new Error(`Find user by ${id} failed with reason ${error}`)
        }
    }

    public async getAllUser()
    {
        // const userCollection = this.getUserCollection('users')
        try {
            const cursor = this.userCollection.find({})
            const listUser = await cursor.toArray()
            const result = []
            for (const user of listUser)
            {
                delete user.password
                result.push(user)
            }
            return result
        } catch (error) {
            throw new Error(`Find all users failed with reason ${error}`)
        }
    }

    
    public async getUserByAtr(atr: any)
    {
        const filter: Filter = {}
        if(atr.by === 'email')
        {
            filter.email = atr.val
        }
        else if(atr.by === 'name')
        {
            filter.name = atr.val
        }
        else
        {
            throw new Error("Please correct atr value")
        }
        try {
            const cursor = this.userCollection.find(filter)
            const listUser = await cursor.toArray()
            const result = []
            for (const user of listUser)
            {
                delete user.password
                result.push(user)
            }
            return result
            
        } catch (error) {
            throw new Error(`Get user by atr failed with reason ${error}`)
        }
    }

    public async deleteUserById(id: string)
    {
        const objId = new ObjectId(id)
        try {
            const filter = {"_id": objId}
            const result = await this.userCollection.deleteOne(filter)
            return result
        } catch (error) {
            throw new Error(`delete user by ${id} failed with reason ${error}`)
        }
    }


    public async deleteUserByAtr(atr: any)
    {
        type Filter = {
            name?: string,
            email?: string
        }
        const filter: Filter = {}
        if(atr.by === 'email')
        {
            filter.email = atr.val
        }
        else if(atr.by === 'name')
        {
            filter.name = atr.val
        }
        else
        {
            throw new Error("Please correct atr value")
        }
        try {
            const result = await this.userCollection.deleteMany(filter)
            return `delete user successs by atr success ${JSON.stringify(result)}`            
        } catch (error) {
            throw new Error(`find user by atr failed with reason ${error}`)
        }
    }

    public async deleteAllUser()
    {
        try {
            const result = await this.userCollection.deleteMany({})
            return `delete all user successs by atr success ${JSON.stringify(result)}`    
        } catch (error) {
            throw new Error(`delete all user failed with reason ${error}`)
        }
    }
}