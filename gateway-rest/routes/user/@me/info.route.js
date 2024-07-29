const {User} = require("../../../libs/models/User.js");

module.exports = function(app, options, next) {
    app.get('/', async (request, reply) => {
        const authorization = request.headers.authorization;

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

        return {
            user: {
                ...user,
            }
        }
    });

    next();
}