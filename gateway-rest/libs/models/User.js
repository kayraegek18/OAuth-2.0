const { prisma } = require('../../index.js');
const { Snowflake } = require("../Snowflake");
const crypto = require("node:crypto");
const {Password} = require("../Password");
const {config} = require("../../index");

class User {
    constructor(data) {
        this.id = data.user_id;
        this.name = data.user_name;
        this.email = data.user_email;
        this.status = data.user_status;
        this.avatar = data.user_avatar;
        this.token = data.user_token;
        this.password = data.user_password;
        this.createdat = data.user_createdat;

        prisma.user_authorized_applications.findMany({
            where: {
                user_id: this.id
            }
        }).then(apps => {
            this.authorized_apps = apps.map(app => {
                return {
                    id: app.app_id,
                    scopes: app.scopes
                }
            });
        });
    }

    async getApplications() {
        return new Promise(async (resolve, reject) => {
            const apps = await prisma.applications.findMany({
                where: {
                    user_id: this.id
                }
            });
            if (apps.length <= 0) {
                reject("No applications found!");
                return;
            }
            resolve(apps);
        });
    }

    async getApplication(appId) {
        return new Promise(async (resolve, reject) => {
            appId = appId.toString();

            const app = await prisma.applications.findFirst({
                where: {
                    app_id: appId
                }
            });
            if (app == null) {
                reject("Application not found!");
                return;
            }
            const redirect = await prisma.application_redirect_urls.findMany({
                where: {
                    app_id: appId
                }
            });
            app.redirect_uris = redirect.map(red => red.redirect_uri);
            resolve(app);
        });
    }

    async createApplication(data) {
        return new Promise(async (resolve, reject) => {
            if (data.name == null) {
                reject("Missing parameters!");
                return;
            }

            const id = await Snowflake.generate();
            const secret = crypto.randomBytes(8).toString("hex");
            const app = await prisma.applications.create({
                data: {
                    app_id: id,
                    user_id: this.id,
                    app_name: data.name,
                    app_avatar: data.avatar || config.default_avatar,
                    app_secret: secret
                }
            });
            resolve(app);
        });
    }

    async addRedirectUri(appId, uri) {
        return new Promise(async (resolve, reject) => {
            appId = appId.toString();

            const app = await prisma.applications.findFirst({
                where: {
                    app_id: appId
                }
            });
            if (app == null) {
                reject("Application not found!");
                return;
            }

            const redirect = await prisma.application_redirect_urls.findFirst({
                where: {
                    app_id: appId,
                    redirect_uri: uri
                }
            });
            if (redirect != null) {
                reject("Redirect uri already exists!");
                return;
            }

            await prisma.application_redirect_urls.create({
                data: {
                    user_id: this.id,
                    app_id: appId,
                    redirect_uri: uri
                }
            });

            resolve();
        });
    }

    async removeRedirectUri(appId, uri) {
        return new Promise(async (resolve, reject) => {
            appId = appId.toString();

            const app = await prisma.applications.findFirst({
                where: {
                    app_id: appId
                }
            });
            if (app == null) {
                reject("Application not found!");
                return;
            }

            await prisma.application_redirect_urls.delete({
                where: {
                    user_id: this.id,
                    app_id: appId,
                    redirect_uri: uri
                }
            });

            resolve();
        });
    }

    async resetSecret(appId) {
        return new Promise(async (resolve, reject) => {
            appId = appId.toString();

            const app = await prisma.applications.findFirst({
                where: {
                    app_id: appId
                }
            });
            if (app == null) {
                reject("Application not found!");
                return;
            }

            const secret = crypto.randomBytes(8).toString("hex");
            await prisma.applications.update({
                where: {
                    app_id: appId
                },
                data: {
                    app_secret: secret
                }
            });

            resolve(secret);
        });
    }

    static async authorize(user_id, app_id, redirect_uri, scopes) {
        return new Promise(async (resolve, reject) => {
            // FIND APPLICATION
            const app = await prisma.applications.findFirst({
                where: {
                    app_id: app_id
                }
            });
            if (app == null) {
                reject("Application not found!");
                return;
            }

            // CHECK REDIRECT URI
            const redirect = await prisma.application_redirect_urls.findFirst({
                where: {
                    app_id: app_id,
                    redirect_uri: redirect_uri
                }
            });
            if (redirect == null) {
                reject("Invalid redirect uri!");
                return;
            }

            // CHECK IF USER ALREADY AUTHORIZED
            const auth = await prisma.user_authorized_applications.findFirst({
                where: {
                    user_id: user_id,
                    app_id: app_id
                }
            });
            if (auth != null) {
                if (auth.scopes !== scopes) {
                    // SET NEW SCOPES
                    await prisma.user_authorized_applications.update({
                        where: {
                            user_id: user_id,
                            app_id: app_id
                        },
                        data: {
                            scopes: scopes
                        }
                    });
                }

                // REVOKE ALL ACCESS TOKENS FOR THIS APP
                await prisma.user_access_tokens.deleteMany({
                    where: {
                        user_id: user_id,
                        app_id: app_id
                    }
                });
            } else {
                // AUTHORIZE APPLICATION
                await prisma.user_authorized_applications.create({
                    data: {
                        user_id: user_id,
                        app_id: app_id,
                        scopes: scopes
                    }
                });
            }

            // GENERATE AUTHORIZATION CODE
            const code = crypto.randomBytes(32).toString("hex");
            await prisma.user_grant_codes.create({
                data: {
                    user_id: user_id,
                    app_id: app_id,
                    scopes: scopes,
                    code: code
                }
            });

            resolve({
                code: code
            });
        });
    }

    static async getToken(appId, appSecret, grantType, code, redirectUri){
        return new Promise(async (resolve, reject) => {
            const grant = await prisma.user_grant_codes.findFirst({
                where: {
                    code: code
                }
            });
            if (grant == null) {
                reject("Invalid grant code!");
                return;
            }

            // CHECK GRANT EXPIRATION
            const now = new Date();
            if (grant.expires_at < now) {
                reject("Grant code expired!");
                return;
            }

            const app = await prisma.applications.findFirst({
                where: {
                    app_id: appId,
                    app_secret: appSecret
                }
            });
            if (app == null) {
                reject("Invalid application!");
                return;
            }

            if (app.app_id !== grant.app_id) {
                reject("Invalid application!");
                return;
            }

            const redirect = await prisma.application_redirect_urls.findMany({
                where: {
                    app_id: appId,
                    redirect_uri: redirectUri
                }
            });
            if (redirect.length <= 0) {
                reject("Invalid redirect uri!");
                return;
            }
            for (let i = 0; i < redirect.length; i++) {
                if (redirect[i].redirect_uri !== redirectUri) {
                    reject("Invalid redirect uri!");
                    return;
                }
            }

            const token = crypto.randomBytes(32).toString("hex");
            await prisma.user_access_tokens.create({
                data: {
                    user_id: grant.user_id,
                    app_id: grant.app_id,
                    scopes: grant.scopes,
                    access_token: token
                }
            });

            // REVOKE GRANT CODE
            await prisma.user_grant_codes.delete({
                where: {
                    code: code
                }
            });

            resolve({
                access_token: token
            });
        });
    }

    static async revokeToken(token) {
        return new Promise(async (resolve, reject) => {
            const access = await prisma.user_access_tokens.findFirst({
                where: {
                    access_token: token
                }
            });
            if (access == null) {
                reject("Invalid access token!");
                return;
            }

            await prisma.user_access_tokens.delete({
                where: {
                    access_token: token
                }
            });

            resolve();
        });
    }

    static async getByAccessToken(token) {
        return new Promise(async (resolve, reject) => {
            const access = await prisma.user_access_tokens.findFirst({
                where: {
                    access_token: token
                }
            });
            if (access == null) {
                reject("Invalid access token!");
                return;
            }

            // CHECK ACCESS TOKEN EXPIRATION
            const now = new Date();
            if (access.expires_at < now) {
                reject("Access token expired!");
                return;
            }

            const user = await prisma.users.findFirst({
                where: {
                    user_id: access.user_id
                },
                select: {
                    user_id: access.scopes.split(",").includes("identify"),
                    user_name: access.scopes.split(",").includes("identify"),
                    user_email: access.scopes.split(",").includes("email"),
                    user_status: access.scopes.split(",").includes("identify"),
                    user_avatar: access.scopes.split(",").includes("identify"),
                    user_token: false,
                    user_password: false,
                    user_createdat: access.scopes.split(",").includes("identify")
                }
            });
            if (user == null) {
                reject("User not found!");
                return;
            }

            if (access.scopes.split(",").includes("applications")) {
                const apps = await prisma.applications.findMany({
                    where: {
                        user_id: user.user_id
                    }
                });

                user.applications = apps.map(app => {
                    return {
                        id: app.app_id,
                        name: app.app_name,
                        description: app.app_description,
                        avatar: app.app_avatar,
                        created_at: app.app_createdat
                    }
                });
            }

            // REVOKE ACCESS TOKEN
            await prisma.user_access_tokens.delete({
                where: {
                    access_token: token
                }
            });

            resolve(user);
        });
    }

    static async create(name, email, password) {
        return new Promise(async (resolve, reject) => {
            const user = await prisma.users.findFirst({
                where: {
                    user_name: name
                }
            });
            if (user != null) {
                reject("Username already taken!");
                return;
            }

            const user2 = await prisma.users.findFirst({
                where: {
                    user_email: email
                }
            });
            if (user2 != null) {
                reject("Email already taken!");
                return;
            }

            const hash = await Password.hash(password);
            const id = await Snowflake.generate();
            const token = crypto.createHash("sha256").update(`${id}${name}${email}${hash}${crypto.randomBytes(32)}`).digest("hex");

            await prisma.users.create({
                data: {
                    user_id: id,
                    user_name: name,
                    user_email: email,
                    user_avatar: config.default_avatar,
                    user_token: token,
                    user_password: hash
                }
            });

            resolve(token);
        });
    }

    static async verify(name, email, password) {
        return new Promise(async (resolve, reject) => {
            let user;
            if ((user = await this.getByName(name)) != null) {
                const hash = await Password.hash(password);
                const userList = await prisma.users.findMany({
                    where: {
                        user_name: name,
                        user_password: hash
                    }
                });
                if (userList.length <= 0) {
                    reject("Password is wrong!");
                    return;
                }
                //const token = await this.randomizeToken(user.id);
                resolve(userList[0].user_token);
            } else {
                if ((user = await this.getByEmail(email)) != null) {
                    const hash = await Password.hash(password);
                    const userList = await prisma.users.findMany({
                        where: {
                            user_email: email,
                            user_password: hash
                        }
                    });
                    if (userList.length <= 0) {
                        reject("Password is wrong!");
                        return;
                    }
                    //const token = await this.randomizeToken(user.id);
                    resolve(userList[0].user_token);
                } else {
                    reject("User not found!");
                }
            }
        });
    }

    static async randomizeToken(userId) {
        return new Promise(async (resolve, reject) => {
            const user = await this.getById(userId);
            if (user == null) {
                reject("User not found!");
                return;
            }

            const hash = await Password.hash(user.password);
            const token = crypto.createHash("sha256").update(`${userId}${user.name}${user.email}${hash}${crypto.randomBytes(32)}`).digest("hex");

            await prisma.users.update({
                where: {
                    user_id: userId
                },
                data: {
                    user_token: token
                }
            });
            resolve(token);
        });
    }

    static async getById(id) {
        const user = await prisma.users.findFirst({
            where: {
                user_id: id
            }
        });
        if (user == null) {
            return null;
        }
        return new User(user);
    }

    static async getByName(name) {
        const user = await prisma.users.findFirst({
            where: {
                user_name: name
            }
        });
        if (user == null) {
            return null;
        }
        return new User(user);
    }

    static async getByEmail(email) {
        const user = await prisma.users.findFirst({
            where: {
                user_email: email
            }
        });
        if (user == null) {
            return null;
        }
        return new User(user);
    }

    static async getByToken(token) {
        const user = await prisma.users.findFirst({
            where: {
                user_token: token
            }
        });
        if (user == null) {
            return null;
        }
        return new User(user);
    }

    static async getAll() {
        const users = await prisma.users.findMany();
        return users.map(user => new User(user));
    }
}

module.exports = {
    User
}