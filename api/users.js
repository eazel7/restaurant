const NodeRSA = require('node-rsa');
function Users(db, bus, pair) {
    this.users = db.collection('users');

    this.pair = pair;
    
    this.rsa = new NodeRSA(this.pair.privateKey);
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

Users.prototype.decodeToken = function (token) {
    if (!token) return Promise.reject(new Error('token is required'));

    try {
        var decrypted = this.rsa.decrypt(token, 'base64');
        var clear64 = new Buffer(decrypted, 'base64');
        var json = (new Buffer(clear64.toString(), 'base64')).toString();

        return Promise.resolve(JSON.parse(json));
    } catch (e) {
        console.log(e)
        return Promise.reject(e);
    }
};

Users.prototype.generateToken = function (profile) {
    if (!profile) return Promise.reject(new Error('profile is required'));

    var json64 = (new Buffer(JSON.stringify(profile))).toString('base64');

    var encrypted = this.rsa.encrypt(json64, 'base64');

    return Promise.resolve(encrypted);
}

Users.prototype.get = function (userId) {
    if (!userId) return Promise.reject(new Error('user id is required'));

    return new Promise(
        (resolve, reject) => {
            this.users.findOne({
                _id: userId
            }, (err, doc) => {
                if (err) return reject(err);
                
                resolve(doc);
            })
        }
    )
}

module.exports = Users;