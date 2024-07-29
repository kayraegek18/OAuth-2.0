const {User} = require("../../../libs/models/User.js");

module.exports = function(app, options, next) {
    app.get('/', async (request, reply) => {
        if (request.headers["x-token"]) {
            const token = request.headers["x-token"];
            const user = await User.getByToken(token);
            if (user == null) {
                reply.send({
                    error: "Invalid token!"
                })
                return;
            }

            delete user.token;
            delete user.password;

            return {
                ...user
            }
        } else {
            reply.send({
                error: "No token!"
            })
        }
    });

    next();
}