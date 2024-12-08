const request = require('supertest');
const app = require('../index.js');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mockDB;
describe('test CRUD functions', () => {
    beforeAll(async () => {
        // start mock mongodb
        const mockMongod = await MongoMemoryServer.create({
            instance: { port: 27017 },
            auth: {
                enable: true,
                customRootName: "user",
                customRootPwd: "pass"
            }
        });
        mockDB = mockMongod;

        // add a message to mongodb 
        const client = await mongoose.createConnection(mockMongod.getUri(), { user: "user", pass: "pass" });
        const messageSchema = new mongoose.Schema({
            message: { type: String, required: true },
            number: { type: Number, required: true }
        });
        const Messages = client.model('Messages', messageSchema);
        await Messages.create({ message: "message", number: 0 });
    });

    afterAll(async () => {
        await app.close();
        await mockDB.stop();
    });

    it('read messages', async () => {
        const res = await request(app).get('/thefakeapi');
        expect(res.body).toEqual([{ message: "message", number: 0 }]);
    });

    // requires a webhook tester url
    it.skip('receive message from webhook', async () => {
        await request(app)
            .post('/webhook')
            .send({ token: "itsjustatokensir", name: "Test", url: "http://webhook" })
            .expect(200, 'Url is registered to receive message updates');
        await request(app)
            .post('/thefakeapi')
            .send({ message: "hello", number: 1 })
            .expect(200, "Your message is created!");
    });
});
