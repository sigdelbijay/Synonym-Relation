((databaseConnector) => {
    'use strict';

    const path = require('path');
    const mongodb = require('mongodb');
    const MongoClient = mongodb.MongoClient;

    databaseConnector.init = (app) => {
        let dbUrl = `mongodb://localhost:27017/MyDb`;

        MongoClient.connect(dbUrl)
            .then((client) => {
                app.locals.db = client.db('MyDb');
                console.log('database connection success');
                // return client;
            })
            .catch((err) => {
                console.log(err + 'database connection error');
            });

    };

})(module.exports);
