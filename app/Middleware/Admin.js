"use strict";

class Admin {
    async handle({ auth, response }, next) {
        if (auth.user.status !== 'admin') {
            return response.badRequest('У вас нет прав.');
        }
        await next();
    }
}
exports.default = Admin;
