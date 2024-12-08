const request = require('supertest');
const app = require('../index.js');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server-core');

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
        const client = mongoose.createConnection(mockMongod.getUri());
        // message model
        const Messages = client.model('Messages', messageSchema);
        // schema to register a url
        const urlSchema = new mongoose.Schema({
            url: { type: String, required: true },
            name: { type: String, required: true }
        });
    });
      
    afterAll(async () => {
        await app.close();
        await mockDB.stop();
    });

    it('read messages', async () => {
        const res = await request(app).get('/thefakeapi');
        expect(res.body).toEqual([]);
    });
});
