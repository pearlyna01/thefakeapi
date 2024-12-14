module.exports = async function globalTeardown() {
    const instance = globalThis.__MONGOINSTANCE;
    await instance.stop({ force: true });
};