const {User} = require("../../../libs/models/User.js");

module.exports = function(app, options, next) {
    app.post('/', async (request, reply) => {
        const { client_id, client_secret, grant_type, code, redirect_uri } = await request.body;

        if (!client_id || !client_secret || !grant_type || !code || !redirect_uri) {
            return {
                error: "Invalid body!"
            }
        }

        try {
            const token = await User.getToken(client_id, client_secret, grant_type, code, redirect_uri);
            return {
                ...token
            }
        } catch (e) {
            return {
                error: e
            }
        }
    });

    next();
}