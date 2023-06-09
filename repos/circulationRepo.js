const { MongoClient } = require("Mongodb");
const ObjectId = require("Mongodb").ObjectId;

function circulationRepo() {
  const url = "mongodb://127.0.0.1:27017/";
  const dbName = "circulation";
  //Get Data
  function get(query, limit) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        let items = await db.collection("newspapers").find(query);
        /***********
             * Useful functions
            // collection.find({}).project({ a: 1 })                             // Create a projection of field a
            // collection.find({}).skip(1).limit(10)                          // Skip 1 and limit 10
            // collection.find({}).batchSize(5)                               // Set batchSize on cursor to 5
            // collection.find({}).filter({ a: 1 })                              // Set query on the cursor
            // collection.find({}).comment('add a comment')                   // Add a comment to the query, allowing to correlate queries
            // collection.find({}).addCursorFlag('tailable', true)            // Set cursor as tailable
            // collection.find({}).addCursorFlag('oplogReplay', true)         // Set cursor as oplogReplay
            // collection.find({}).addCursorFlag('noCursorTimeout', true)     // Set cursor as noCursorTimeout
            // collection.find({}).addCursorFlag('awaitData', true)           // Set cursor as awaitData
            // collection.find({}).addCursorFlag('exhaust', true)             // Set cursor as exhaust
            // collection.find({}).addCursorFlag('partial', true)             // Set cursor as partial
            // collection.find({}).addQueryModifier('$orderby', { a: 1 })        // Set $orderby {a:1}
            // collection.find({}).max(10)                                    // Set the cursor max
            // collection.find({}).maxTimeMS(1000)                            // Set the cursor maxTimeMS
            // collection.find({}).min(100)                                   // Set the cursor min
            // collection.find({}).returnKey(10)                              // Set the cursor returnKey
            // collection.find({}).setReadPreference(ReadPreference.PRIMARY)  // Set the cursor readPreference
            // collection.find({}).showRecordId(true)                         // Set the cursor showRecordId
            // collection.find({}).sort([['a', 1]])                           // Sets the sort order of the cursor query
            // collection.find({}).hint('a_1')                                // Set the cursor hint
                */

        if (limit > 0) {
          items = items.limit(limit);
        }
        resolve(await items.toArray());
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }
  //get By ID
  function getById(id) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        const item = await db
          .collection("newspapers")
          .findOne({ _id: new ObjectId(id) });
        resolve(item);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }
  //add data
  function addItem(item) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        addedItem = await db.collection("newspapers").insertOne(item);
        //console.log('item added');
        //console.log(addedItem);
        resolve(addedItem.ops);
        client.close();
      } catch (error) {
        reject(error);
        client.close();
      }
    });
  }
  //update data
  function updateItem(id, newitem) {
    return new Promise(async (resolve, reject) => {
        const client = new MongoClient(url);
        try {
          await client.connect();
          const db = client.db(dbName);
          const updateItem = await db.collection("newspapers")
          .findOneAndReplace({_id: new ObjectId(id)}, newitem);
          resolve(updatedItem.value);
          client.close();
        } catch (error) {
          reject(error);
        }
      });
  }
  //load data FN
  function loadData(data) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        results = await db.collection("newspapers").insertMany(data);
        //console.log(results);
        resolve(results);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  return { loadData, get, getById, addItem, updateItem };
}

module.exports = circulationRepo();
