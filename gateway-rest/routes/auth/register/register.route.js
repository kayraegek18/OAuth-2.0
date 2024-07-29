const { User } = require("../../../libs/models/User.js");
const {config} = require("../../../index.js");

module.exports = function(app, options, next) {
    app.post('/', async (request, reply) => {
        const { username, email, password } = await request.body;
        if (!username || !email || !password) {
            return {
                error: "Invalid body!"
            }
        }

        try {
            const token = await User.create(username, email, password);
            const user = await User.getByToken(token);

            reply.send({
                message: "Successfully registered!",
                token,
                user_id: user.id
            })
        } catch (err) {
            console.log(err);
            reply.send({
                error: err
            })
        }
    });

    next();
}