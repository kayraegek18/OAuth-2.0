const crypto = require("crypto");

class Password {
    static async hash(password) {
        return crypto.createHash("sha256").update(password).digest("hex");
    }

    static async verify(password, hash) {
        return hash === crypto.createHash("sha256").update(password).digest("hex")
    }
}

module.exports = {
    Password
}