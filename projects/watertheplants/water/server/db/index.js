const { MongoClient } = require("mongodb");
const { triggerEvent } = require("../events");

const dbName = "jarvisLogs";
const collectionName = "logs";
const MAX_RESULTS = 100;

let db;

function startDB(url) {
  if (db) {
    return;
  }

  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  client.connect(err => {
    if (err) {
      triggerEvent("dbError", err);
    } else {
      triggerEvent("dbConnect", err);
      db = client.db(dbName);
      db.on("close", () => {
        triggerEvent("dbClose");
        db = undefined;
      });
    }
  });
}

function formatLog(msg) {
  return { time: new Date().getTime(), msg };
}

function insertLog(msg) {
  const collection = db.collection(collectionName);

  collection.insertOne(formatLog(msg), (err, result) => {
    if (err !== null) {
      triggerEvent("dbError", err);
    } else {
      triggerEvent("dbInsert", result);
    }
  });
}

function readLogs(callback, limit = MAX_RESULTS) {
  db.collection(collectionName)
    .find({})
    .limit(limit)
    .toArray((err, docs) => {
      if (err !== null) {
        triggerEvent("dbError", err);
      } else {
        triggerEvent("dbRead", docs);
        callback(docs);
      }
    });
}

module.exports = {
  insertLog,
  readLogs,
  startDB
};
