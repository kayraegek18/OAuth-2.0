const { User } = require("../../../libs/models/User.js");

module.exports = function(app, options, next) {
    app.post('/', async (request, reply) => {
        const { username, email, password } = await request.body;
        if (!username && !email) {
            return {
                error: "Invalid body!"
            }
        }
        if (!password) {
            return {
                error: "Invalid body!"
            }
        }

        try {
            const token = await User.verify(username, email, password);
            const user = await User.getByToken(token);
            return {
                message: "Successfully logged in!",
                token,
                user_id: user.id
            }
        } catch (err) {
            return {
                error: err
            }
        }
    });

    next();
}