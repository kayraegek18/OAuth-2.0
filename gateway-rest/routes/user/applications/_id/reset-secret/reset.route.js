const {User} = require("../../../../../libs/models/User.js");

module.exports = function(app, options, next) {
    app.post('/', async (request, reply) => {
        if (request.headers["x-token"]) {
            const token = request.headers["x-token"];
            const user = await User.getByToken(token);
            if (user == null) {
                reply.send({
                    error: "Invalid token!"
                })
                return;
            }

            const app = await user.getApplication(request.params.id);
            if (app == null) {
                reply.send({
                    error: "Invalid application!"
                })
                return;
            }

            try {
                const newSecret = await user.resetSecret(app.app_id);
                reply.send({
                    success: true,
                    secret: newSecret
                })
            } catch (e) {
                reply.send({
                    error: e.message
                })
            }
        } else {
            reply.send({
                error: "No token!"
            })
        }
    });

    next();
}