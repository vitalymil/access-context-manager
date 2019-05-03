
const MongoClient = require('mongodb').MongoClient;

const MONGODB_URL = 'mongodb://acm_mongo:27017/acm';
const MONGODB_COLLECTION = 'contexts';

let _client;

const init = async () => {
    if (!_client) {
        _client = await MongoClient.connect(MONGODB_URL);
    }

    await _client
        .db()
        .collection(MONGODB_COLLECTION)
        .createIndex({ 'name': 1 }, { unique: true });
}

const create = async (attributes) => {
    try {
        await _client
            .db()
            .collection(MONGODB_COLLECTION)
            .insertOne(attributes);
    }
    catch (err) {
        if (err.code === 11000) {
            throw 'NAME_EXISTS';
        }

        throw err;
    }
}

const get = async (name) => {
    return await _client
                    .db()
                    .collection(MONGODB_COLLECTION)
                    .findOne({ name });
}

module.exports = {
    init,
    create,
    get
}