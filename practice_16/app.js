//-----------------------//
//Run MONGODB (MAC OS)
//>    ./mongod --dbpath data/

//--------------------------//
const { MongoClient } = require('mongodb');


// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'ProductDB';

async function main() {
    //DB connection
    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db(dbName);
    const collection = db.collection('products');

    var obj = {
        name: 'Coffee Mug',
        price: 10,
    }
    //Insert one item
    const insertResult = await collection.insertOne(obj);
    console.log('Inserted documents =>', insertResult);


    return 'done.';
}


main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
