const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'eCommerce';

let client;
let db;

module.exports.init = async () => {
    client = new MongoClient(url, { useUnifiedTopology: true }, {useNewUrlParser: true });
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        db = client.db(dbName);
    } catch (err) {
        console.log(err.stack);
    }

};

module.exports.find = async (collection, object) => {
    return await db
        .collection(collection)
        .find(object)
        .toArray();
};