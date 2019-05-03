
const express = require('express');
const bodyParser = require('body-parser');

const controllers = require('./controllers');
const dataStore = require('./context-data-store');

const createExpressApp = async () => {
    const app = express();

    await dataStore.init();

    app.use(bodyParser.json());

    app.post('/resources', async (req, res, next) => {
        try {
            await controllers.createContext(req.body, dataStore);
            res.sendStatus(201).end();
            next();
        }
        catch (err) {
            next(err);
        }
    });

    app.get('/resources/:name', async (req, res, next) => {
        try {
            const context = await controllers.getContext(req.params.name, 
                req.query.ip, dataStore);
            res.status(200).send(context).end();
            next();
        }
        catch (err) {
            next(err);
        }
    });

    app.use((err, _, res, next) => {
        if (err) {
            const status = err.status || 500;
            const message = err.message || 'internal server error';

            res.status(status).send(message).end();
        }

        next();
    });

    return app;
}

module.exports = createExpressApp;
