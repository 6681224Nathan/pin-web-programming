// //-----------Practice------------//   
// Collection name: "student_records"

// [
//     { name: "Bob", courseid: "egci111", coursename: "computer programming", mark: 80 },
//     { name: "Tom", courseid: "egci111", coursename: "computer programming", mark: 50 },
//     { name: "Sue", courseid: "egci427", coursename: "web programming", mark: 90 },
//     { name: "John", courseid: "egci427", coursename: "web programming", mark: 70 },
//     { name: "Jame", courseid: "egci472", coursename: "web programming", mark: 60 },
// ]

// 1) Find who take "computer programming"
// 2) Find who have mark >60
// 3) Find the student name start with J*
// //------------------------------------//

//-----------------------//
// 1. Insert these 2 items below.

// var obj = [ 
//               { name: "Computer", price: 1000 },
//               { name: "Cup", price: 15 }
//             ]


// 2. Show the items that the price > 15 sorting by price (ascending order)

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
    const collection = db.collection('student_records');

    /*var obj = {
        name: 'Coffee Mug',
        price: 10,
    }
    //Insert one item
    const insertResult = await collection.insertOne(obj);
    console.log('Inserted documents =>', insertResult);*/

  
  var obj = [
    { name: "Bob", courseid: "egci111", coursename: "computer programming", mark: 80 },
    { name: "Tom", courseid: "egci111", coursename: "computer programming", mark: 50 },
    { name: "Sue", courseid: "egci427", coursename: "web programming", mark: 90 },
    { name: "John", courseid: "egci427", coursename: "web programming", mark: 70 },
    { name: "Jame", courseid: "egci472", coursename: "web programming", mark: 60 },
    ]
    
    //insert a list
    const insertResult = await collection.insertMany(obj);
    console.log('Inserted documents =>', insertResult);

    
    // 1) Find who take "computer programming"
    var query = {coursename : "computer programming"};
    var key = {price: "1"};
    var findResult = await collection.find(query).sort(key).toArray(); 
    console.log('Those who tae computer programming =>', findResult);
    // 2) Find who have mark >60
    var query = {mark : {$gt : 60}};
    var key = {price: "1"};
    var findResult = await collection.find(query).sort(key).toArray(); 
    console.log('Those who have more than 60 mark', findResult);
    // 3) Find the student name start with J*
    var query = {name : /^J/};
    var key = {price: "1"};
    var findResult = await collection.find(query).sort(key).toArray(); 
    console.log('Name start with capital J', findResult);


    
    //find one, for the case of many objs, it's gonna pick only the first one
    //const findResult = await collection.findOne({});
    //console.log('Found documents =>', findResult);

    //find many
    //var query = {name : "Book"};
    //var query = {price : 10};
    //var query = {name : /^C/}; //find var whose name starts with capital C
    // var query = {price : {$gt : 15}}; //find var whose price is greater than 10
    //how condition can be written, gt means greater than
    // var key = {price: "1"}; // -1 for descending order, 1 for ascending

    //const findResult = await collection.find(query).toArray();
    // const findResult = await collection.find(query).sort(key).toArray(); 
    //sort the result, combined wiht find
    // console.log('Found documents =>', findResult);

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
    
    // var query = {name :/^C/};
    // const deleteResult = await collection.deleteMany(query);
    // console.log('Deleted documents =>', deleteResult);

    // var query = {price : {$gt : 15}};
    // var key = {price: "1"};
    // const findResult = await collection.find(query).sort(key).toArray(); 
    // console.log('Found documents =>', findResult);


    
    return 'done.';
}


main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());

