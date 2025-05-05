import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://localhost:27017';

const client=new MongoClient(MONGODB_URI);
const clientPromise=client.connect();


export default clientPromise;