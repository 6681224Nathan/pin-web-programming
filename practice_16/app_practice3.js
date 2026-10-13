// Output shows the JSON data on the web browser by calling the URL.
// Example 
// 1) GET http://localhost:3000/courseid/:courseid
// 2) GET http://localhost:3000/gtmark/:mark
// 3) PUT http://localhost:3000/updatename/:name
// 4) POST http://localhost:3000/addstudent
// //--------------------------//
const { MongoClient } = require('mongodb');
const fs = require('fs').promises;


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

  
    
    
    // 1) Find who take "computer programming"
    var query = {coursename : "computer programming"};
    var key = {price: "1"};
    const findResult = await collection.find({}).toArray();

    console.log('Results =>', findResult);

    try {
        await fs.writeFile(__dirname + '/students.json', JSON.stringify(findResult, null, 2));
        console.log('File saved');
    } catch (err) {
        console.error('Error:', err.message);
    }

    const back = JSON.parse(fs.readFileSync(__dirname + '/students.json', 'utf8'));
    console.log('Read from file:', back);

main();
    


    
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

