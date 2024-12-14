
module.exports = async function globalSetup() {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const instance = await MongoMemoryServer.create({
        instance: { port: 27017 },
        auth: {
            enable: true,
            customRootName: "user",
            customRootPwd: "pass"
        }
    });
    globalThis.__MONGOINSTANCE = instance;

};