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

            const { uri } = request.body;
            if (uri == null) {
                reply.send({
                    error: "Missing parameters!"
                })
                return;
            }

            try {
                await user.addRedirectUri(app.app_id, uri);
                reply.send({
                    success: true
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

    app.delete('/', async (request, reply) => {
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

            const { uri } = request.body;
            if (uri == null) {
                reply.send({
                    error: "Missing parameters!"
                })
                return;
            }

            try {
                await user.removeRedirectUri(app.app_id, uri);
                reply.send({
                    success: true
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