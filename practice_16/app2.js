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

    /*var obj = {
        name: 'Coffee Mug',
        price: 10,
    }
    //Insert one item
    const insertResult = await collection.insertOne(obj);
    console.log('Inserted documents =>', insertResult);*/

  
  var obj = [ 
              { name: "Book", price: 10 },
              { name: "Pencil", price: 5 },
              { name: "Calculator", price: 40 },
              { name: "Notebook", price: 15 },
              { name: "T-Shirt", price: 20 },
              { name: "Jacket", price: 20 }
            ]
    
    //insert a list
    //const insertResult = await collection.insertMany(obj);
    //console.log('Inserted documents =>', insertResult);
    
    //find one, for the case of many objs, it's gonna pick only the first one
    //const findResult = await collection.findOne({});
    //console.log('Found documents =>', findResult);

    //find many
    //var query = {name : "Book"};
    //var query = {price : 10};
    //var query = {name : /^C/}; //find var whose name starts with capital C
    //var query = {price : {$gt : 10}}; //find var whose price is greater than 10
    //how condition can be written, gt means greater than
    //var key = {price: "-1"}; // -1 for descending order, 1 for ascending

    //const findResult = await collection.find(query).toArray();
    //const findResult = await collection.find(query).sort(key).toArray(); 
    //sort the result, combined wiht find
    //console.log('Found documents =>', findResult);

    // var query = {name : "Book"};
    // var updateValue = {$set : {name : "Notebook", price: 13}};
    // const updateResult = await collection.updateOne(query, updateValue);
    // console.log('Updated documents =>', updateResult);

    // var query = {name :/^N/};
    // var updateValue = {$set : {name : "Book", price: 10}};
    // const updateResult = await collection.updateMany(query, updateValue);
    // console.log('Updated documents =>', updateResult);

    // var query = {name :"Book"};
    // const deleteResult = await collection.deleteOne(query);
    // console.log('Deleted documents =>', deleteResult);
    
    var query = {name :/^C/};
    const deleteResult = await collection.deleteMany(query);
    console.log('Deleted documents =>', deleteResult);



    return 'done.';
}


main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
