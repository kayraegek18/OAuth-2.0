const {User} = require("../../../libs/models/User.js");

module.exports = function(app, options, next) {
    app.addHook('preHandler', async (request, reply) => {
        /*const authorization = request.headers.authorization;
        const xToken = request.headers['x-token'];

        if (!authorization && !xToken) {
            reply.send({
                error: "No authorization header!"
            })
            return;
        }

        if (authorization) {
            const token = authorization.split(" ")[1];
            const tokenType = authorization.split(" ")[0];
            if (tokenType !== "Bearer") {
                reply.send({
                    error: "Invalid token type!"
                })
                return;
            }
            const user = await User.getByAccessToken(token);
            if (user == null) {
                reply.send({
                    error: "Invalid token!"
                })
                return;
            }

            request.user = user;
            return;
        }

        if (xToken) {
            const user = await User.getByToken(xToken);
            if (user == null) {
                reply.send({
                    error: "Invalid token!"
                })
                return;
            }

            request.user = user;
            return;
        }

        reply.send({
            error: "Invalid token!"
        });*/
    });

    next();
}