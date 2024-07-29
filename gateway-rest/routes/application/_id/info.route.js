const {Application} = require("../../../libs/models/Application");


module.exports = function(app, options, next) {
    app.get('/', async (request, reply) => {
        const { id } = request.params;

        const app = await Application.getById(id);
        if (app == null) {
            reply.send({
                error: "Invalid application!"
            });
            return;
        }

        delete app.secret;

        reply.send({
            ...app
        });
    });

    next();
}