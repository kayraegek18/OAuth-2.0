const {User} = require("../../../libs/models/User.js");

module.exports = function(app, options, next) {
    app.post('/', async (request, reply) => {
        const { user_id, client_id, redirect_uri, scope } = await request.body;

        if (!user_id || !client_id || !redirect_uri || !scope) {
            return {
                error: "Invalid body!"
            }
        }

        try {
            const auth = await User.authorize(user_id, client_id, redirect_uri, scope);
            return {
                ...auth
            }
        } catch (e) {
            return {
                error: e
            }
        }
    });

    next();
}