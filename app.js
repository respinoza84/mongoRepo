const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const circulationRepo = require("./repos/circulationRepo");
const data = require("./circulation.json");
const url = "mongodb://127.0.0.1:27017/";
const dbName = "circulation";
async function main() {
  const client = new MongoClient(url);
  await client.connect();
  try {
    //load Data
    const results = await circulationRepo.loadData(data);
    assert.equal(data.length, results.insertedCount);
/*
    //getData
    const getData = await circulationRepo.get();
    assert.equal(data.length, getData.length);
    //console.log(results.insertedCount, results.ops);

    //filterData
    const filterData = await circulationRepo.get({Newspaper: getData[4].Newspaper});
    assert.deepEqual(filterData[0], getData[4]);

    //Limit Data
    const limitData = await circulationRepo.get({},3);
    assert.equal(limitData.length, 3);
    
    //getDataById
    
    const id = getData[4]._id.toString();
    const byId = await circulationRepo.getById(id);
    assert.deepEqual(byId, getData[4])
    */
    //Add data
    const newItem = {      
        "Newspaper": "The Rasta Times",
        "Daily Circulation, 2004": 420,
        "Daily Circulation, 2013": 40,
        "Change in Daily Circulation, 2004-2013": 69,
        "Pulitzer Prize Winners and Finalists, 1990-2003": 33,
        "Pulitzer Prize Winners and Finalists, 2004-2014": 66,
        "Pulitzer Prize Winners and Finalists, 1990-2014": 120      
    };
    const addedItem = await circulationRepo.addItem(newItem);
    //console.log(addedItem);
    //bug todo: fix this bug
    assert(addedItem._id)
    const addedItemQuery = await circulationRepo.getById(addedItem._id);
    assert.deepEqual(addedItemQuery, newItem)

    // //Update data
    const updateItem = await circulationRepo.update(addedItem._id), {
        "Newspaper": "The Rasta 420 Times",
        "Daily Circulation, 2004": 420,
        "Daily Circulation, 2013": 40,
        "Change in Daily Circulation, 2004-2013": 69,
        "Pulitzer Prize Winners and Finalists, 1990-2003": 33,
        "Pulitzer Prize Winners and Finalists, 2004-2014": 66,
        "Pulitzer Prize Winners and Finalists, 1990-2014": 120 
    });
    const newAddedItemQuery = await circulationRepo.getById(addedItem._id);
    assert.equal(newAddedItemQuery.Newspaper, "The Rasta 420 Times");

    // //Delete data
    const deleteData = await circulationRepo.delete(data[0]._id);
    assert.equal(deleteData.length, 1);

    //console.log(await admin.serverStatus());
    //console.log(await admin.listDatabases());
    
    //client.close();
  } catch (error) {
    console.error(error);
  } finally {
    const admin = client.db(dbName).admin();
    await client.db(dbName).dropDatabase();

    //console.log(await admin.serverStatus());
    console.log(await admin.listDatabases());

    client.close();
  }
}

main();
