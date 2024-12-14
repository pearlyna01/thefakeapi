const request = require('supertest');
const app = require('../index.js');
const mongoose = require('mongoose');

const express = require('express');
const bodyParser = require('body-parser');

describe('test CRUD functions', () => {
    // seed data before each test
    beforeEach(async () => {
        // add a message to mongodb 
        const client = await mongoose.createConnection(process.env.MONGODB_STR, { user: "user", pass: "pass" });
        const messageSchema = new mongoose.Schema({
            message: { type: String, required: true },
            number: { type: Number, required: true }
        });
        const Messages = client.model('Messages', messageSchema);
        await Messages.create({ message: "message", number: 0 });
        client.close();
    });

    // empty collection after each test
    afterEach(async () => {
        const client = await mongoose.createConnection(process.env.MONGODB_STR, { user: "user", pass: "pass" });
        const messageSchema = new mongoose.Schema({
            message: { type: String, required: true },
            number: { type: Number, required: true }
        });
        const Messages = client.model('Messages', messageSchema);
        await Messages.deleteMany({});
        client.close();
    });

    afterAll(async () => {
        await app.close();
    });

    it('create message', async () => {
        const res1 = await request(app)
            .post('/thefakeapi')
            .send({ message: "another message", number: 1 });
        expect(res1.text).toEqual("Your message is created!");
        const res2 = await request(app).get('/thefakeapi');
        expect(res2.body).toContainEqual({ message: "another message", number: 1 });
    });

    it('read messages', async () => {
        const res = await request(app).get('/thefakeapi');
        expect(res.body).toEqual([{ message: "message", number: 0 }]);
    });

    it('update a message', async () => {
        const res1 = await request(app)
            .post('/thefakeapi')
            .send({ message: "another message", number: 0 });
        expect(res1.text).toEqual("Your message is updated!");
        const res2 = await request(app).get('/thefakeapi');
        expect(res2.body).toContainEqual({ message: "another message", number: 0 });
    })

    it('delete a message', async () => {
        const res1 = await request(app)
            .delete('/thefakeapi/0');
        expect(res1.statusCode).toEqual(200);
        const res2 = await request(app).get('/thefakeapi');
        expect(res2.body).toEqual([]);
    });

    // requires a webhook tester url
    it('receive message from webhook', async () => {
        // mock another server
        let response;
        const httpServer = express();
        httpServer.use(express.json());
        httpServer.use(bodyParser.json());
        httpServer.post('/', (req, res) => {
            response = req.body;
            console.log(req.body)
        });
        var mockListener = httpServer.listen(8888, () => {
            console.log("Server is running at port 8888...");
        });

        await request(app)
            .post('/webhook')
            .send({ token: "itsjustatokensir", name: "Test", url: "http://localhost:8888/" })
            .expect(200, 'Url is registered to receive message updates');
        await request(app)
            .post('/thefakeapi')
            .send({ message: "hello", number: 1 })
            .expect(201, "Your message is created!");
            
        setTimeout(() => {
            expect(response).toEqual({ message: "hello", number: 1});
            mockListener.close();
        }, 50);
    });
});
