const fastify = require("fastify")({ logger: true });
const path = require("node:path");

//const database = require("./libs/Database");
const config = require("./config");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async ()=> {
    await fastify.register(require('@fastify/autoload'), {
        dir: path.join(__dirname, 'routes'),
        indexPattern: /.*route.js$/,
        autoHooks: true,
        autoHooksPattern: /.*hooks.js$/,
        cascadeHooks: true,
        routeParams: true
    });
    await fastify.register(require("@fastify/cors"), {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    });
    await fastify.register(require("@fastify/multipart"));
    await fastify.register(require("@fastify/rate-limit"), {
        max: 100,
        timeWindow: "1 minute",
    });

    await fastify.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    });
})();

module.exports = {
    fastify,
    prisma,
    config
};