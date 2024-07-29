const {User} = require("../../../libs/models/User.js");

module.exports = function(app, options, next) {
    app.post('/', async (request, reply) => {
        const { access_token } = await request.body;

        if (!access_token) {
            return {
                error: "Invalid body!"
            }
        }

        try {
            const revoked = await User.revokeToken(access_token);
            return {
                ...revoked
            }
        } catch (e) {
            return {
                error: e
            }
        }
    });

    next();
}