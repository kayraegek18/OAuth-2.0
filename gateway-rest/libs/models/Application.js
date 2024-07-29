const { prisma } = require('../../index.js');

class Application {
    constructor(data) {
        this.owner = data.user_id || null;
        this.id = data.app_id;
        this.name = data.app_name;
        this.description = data.app_description;
        this.avatar = data.app_avatar;
        this.secret = data.app_secret;
        this.created_at = data.app_createdat;
        this.redirect_urls = data.urls;
    }

    static async getById(id) {
        return new Promise(async (resolve, reject) => {
            const app = await prisma.applications.findFirst({
                where: {
                    app_id: id
                }
            });

            const redirect_urls = await prisma.application_redirect_urls.findMany({
                where: {
                    app_id: id
                }
            });

            if (!app) {
                reject("Application not found!");
                return;
            }

            app.urls = redirect_urls;

            resolve(new Application(app));
        });
    }
}

module.exports = {
    Application
}