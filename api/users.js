function Users(db, bus) {
    this.users = db.collection('users');
}

Users.prototype.listUsers = function () {
    return new Promise(
        (resolve, reject) => {
            this.users.find({}).toArray((err, docs) => {
                if (err) return reject(err);

                resolve(docs.map((doc) => {
                    return {
                        _id: doc._id,
                        name: doc.name
                    }
                }))
            })
        }
    )
}

Users.prototype.checkPin = function (userId, pin) {
    if (!userId) return Promise.reject(new Error('user id is required'));
    if (!pin) return Promise.reject(new Error('pin is required'));
    
    return new Promise(
        (resolve, reject) => {
            this.users.findOne({_id: userId, pin: pin}, (err, doc) => {
                if (err) return reject(err);

                if (!doc) return reject(new Error('invalid pin'));

                resolve();
            })
        }
    )
}

Users.prototype.create = function (name, roles, pin) {
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