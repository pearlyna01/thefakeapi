const express = require('express');
const helmet = require('helmet');
const winston = require('winston');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const port = process.env.PORT;
const connectStr = process.env.MONGODB_STR;
const apiToken = process.env.APITOKEN;

// create a logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
});

/* MongoDB connection and schema */
// connect to mongodb
mongoose.connect(`${connectStr}`)
    .then(() => logger.info('Connected to MongoDB!'))
    .catch(error => logger.error("Unable to connect to MongoDB!", error));

// schema to create a message
const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    number: { type: Number, required: true }
});
// message model
const Messages = mongoose.model('Messages', messageSchema);
// schema to register a url
const urlSchema = new mongoose.Schema({
    url: { type: String, required: true },
    name: { type: String, required: true }
});
// url model
const Url = mongoose.model('Url', urlSchema);

// implement security headers
app.use(helmet());

// Send new message updates to registered urls
async function sendUpdates(message) {
    await Url.find({})
        .then(async (list) => {
            if (list.length > 0) {
                list.forEach(async (item) => {
                    fetch(item.url, {
                        method: "post",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ message: message })
                    }).then((response) => {
                        logger.info(`Message is successfuly sent to url: ${item.url}`);
                    }).catch((error) => {
                        logger.error(`Message is unable sent to url: ${item.url}`);
                        logger.error(error);
                    })
                });
            }
        }).catch(error => { 
            throw new Error("Unable to find urls"); 
        });
}

/* CRUD operations */
// Create or Update a message
app.post('/thefakeapi', async (req, res, next) => {
    logger.info(`Request: method: ${req.method}, URL: ${req.url}, body: ${JSON.stringify(req.body)}, params: ${JSON.stringify(req.params)}`);

    const { message, number } = req.body;
    if (message == undefined || number == undefined) {
        next(new Error("Missing message or number"));
    }
    try {
        const messageId = await Messages.find({ number: number });
        // update if there is message
        if (messageId.length > 0) {
            await Messages.findOneAndUpdate({ _id: messageId[0]._id }, { $set: { message: message } });
            await sendUpdates(message);
            res.send("Your message is updated!");
        } else {
            await Messages.create({ message: message, number: number });
            await sendUpdates(message);
            res.status(201).send("Your message is created!");
        }
    } catch (error) {
        next(error);
    }
});

// Read all messages
app.get('/thefakeapi', async (req, res, next) => {
    logger.info(`Request: method: ${req.method}, URL: ${req.url}, body: ${JSON.stringify(req.body)}, params: ${JSON.stringify(req.params)}`);
    try {
        const list = await Messages.find({});
        const mapList = list.map(aMessage => ({ number: aMessage.number, message: aMessage.message }));
        res.send(mapList);
    } catch (error) {
        next(error);
    }
});

// Delete a message
app.delete('/thefakeapi/:number', async (req, res, next) => {
    logger.info(`Request: method: ${req.method}, URL: ${req.url}, body: ${JSON.stringify(req.body)}, params: ${JSON.stringify(req.params)}`);
    const number = req.params.number;
    if (number == undefined) {
        next(new Error("Missing number"));
    }
    try {
        await Messages.deleteOne({ number: number });
        res.status(200).send();
    } catch (error) {
        next(error);
    }
});

// Webhook
// Register url
app.post('/webhook', async (req, res, next) => {
    logger.info(`Request: method: ${req.method}, URL: ${req.url}, body: ${JSON.stringify(req.body)}, params: ${JSON.stringify(req.params)}`);
    const { url, name, token } = req.body;
    if (url == undefined || name == undefined || apiToken !== token) {
        next(new Error("Missing url or name or incorrect api token."));
    }
    try {
        const urlId = await Url.find({ name: name });
        // update if there is a url
        if (urlId.length > 0) {
            console.log(urlId)
            await Url.findOneAndUpdate({ _id: urlId[0]._id }, { $set: { url: url } });
        } else {
            await Url.create({ name: name, url: url });
        }
        res.status(200).send('Url is registered to receive message updates');
    } catch (error) {
        next(error);
    }
});


// Return 404 for paths that do not exist
app.use((req, res) => {
    res.status(404);
});

// Error handler
app.use((err, req, res, next) => {
    logger.error(err.stack);

    res.status(err.status || 500).json({
        message: 'General Error',
    });
});

// START THE SERVER
const index = app.listen(port, () => {
    logger.info(`thefakeapi is listening on port ${port}`)
});

module.exports = index;