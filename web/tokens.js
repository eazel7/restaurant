const NodeRSA = require('node-rsa');

function Tokens(pair) {
    this.pair = pair;

    this.rsa = new NodeRSA(this.pair.privateKey);
}

Tokens.prototype.decodeToken = function (token) {
    if (!token) return Promise.reject(new Error('token is required'));

    try {
        var decrypted = this.rsa.decrypt(token, 'base64');
        var clear64 = new Buffer(decrypted, 'base64');
        var json = (new Buffer(clear64.toString(), 'base64')).toString();

        return Promise.resolve(JSON.parse(json));
    } catch (e) {
        return Promise.reject(e);
    }
};

Tokens.prototype.generateToken = function (profile) {
    if (!profile) return Promise.reject(new Error('profile is required'));

    var json64 = (new Buffer(JSON.stringify(profile))).toString('base64');

    var encrypted = this.rsa.encrypt(json64, 'base64');

    return Promise.resolve(encrypted);
}

module.exports = Tokens;