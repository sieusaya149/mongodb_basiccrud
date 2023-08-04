import Database from ".."
import { Collection, Db } from "mongodb"
// this file will create a validation and type for user
const user_collection = 'users'
const userSchema = {
    "$jsonSchema": {
      "bsonType": "object",
      "required": ["name", "email", "password", "createdAt", "updatedAt"],
      "properties": {
        "name": {
          "bsonType": "string",
          "maxLength": 200,
          "minLength": 6,
          "description": "Must be a string with length is between 6 and 200 size"
        },
        "email": {
          "bsonType": "string",
          "maxLength": 200,
          "minLength": 10,
          "description": "Must be a string and a valid email address."
        },
        "password": {
          "bsonType": "string",
          "description": "Must be a string."
        },
        "createdAt": {
          "bsonType": "date",
          "description": "Must be a date."
        },
        "updatedAt": {
          "bsonType": "date",
          "description": "Must be a date."
        }
      }
    }
}
// create collections
export default async function createUserCollection(dbInstance: Db)
{
    const cursor = dbInstance.listCollections()
    const listCollection = await cursor.toArray()
    const collectionExists = listCollection.some(item => item.name === user_collection);
    if(collectionExists)
    {
      console.log(`the collection ${user_collection} exist`)
      return
    }
    dbInstance.createCollection(user_collection, {validator: userSchema})
    .then(() => console.log(`the collection ${user_collection} was created`))
    .catch((err) => console.log(`the collection was created faild with ${err}`))
}

