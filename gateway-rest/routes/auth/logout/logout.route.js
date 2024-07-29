const {User} = require("../../../libs/models/User");
module.exports = function(app, options, next) {
    app.post('/', async (request, reply) => {
        const { token } = await request.body;
        if (!token) {
            return {
                error: "Invalid body!"
            }
        }

        try {
            //const user = await User.getByToken(token);
            //await User.randomizeToken(user.id);
            return {
                message: "Successfully logged out!"
            }
        } catch (err) {
            return {
                error: err
            }
        }
    });

    next();
}