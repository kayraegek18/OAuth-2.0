module.exports = function(app, options, next) {
    app.get('/', (request, reply) => {
        return {
            owner: 'mineala',
            version: '1.0.0',
            description: 'Gateway RESTful API'
        }
    });

    next();
}