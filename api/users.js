function Users(db, bus) {
    this.users = db.collection('users');
}

Users.prototype.createUser = function (name, roles, pin) {
    if (!name) return Promise.reject(new Error('name is required'));
    if (!roles || roles.length <= 0) return Promise.reject(new Error('roles are required'));
    if (!pin) return Promise.reject(new Error('pin is required'));

    return new Promise(
        (resolve, reject) => {
            var id = require('shortid').generate();

            this.users.insert({
                _id: id,
                name: name,
                roles: roles,
                pin: pin
            }, (err) => {
                if (err) return reject(err);

                resolve(id);
            })
        }
    )
}

module.exports = Users;