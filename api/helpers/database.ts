import * as dotenv from 'dotenv';
import * as mongoDB from 'mongodb';
import Game, {IGame} from './models/game';

export let collection: mongoDB.Collection;

export async function connectToDatabase () {
    dotenv.config();

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.MONGODB_ADDRESS || '');

    await client.connect();

    const db: mongoDB.Db = client.db(process.env.MONGODB_DB);

    const games: mongoDB.Collection = db.collection(process.env.MONGODB_COLLECTION || '');    

    collection = games;
}

export async function getHistory () {
    const history = (await collection.find({}).toArray());

    return history;
}

export async function insertToDb (data: IGame) {
    await collection.updateOne({gameId: data.gameId},{$set: data},{upsert:true}); //Updates game in DB (or inserts it if not present)
}