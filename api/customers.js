function Customers(db, bus) {
    this.customers = db.collection('customers');
    this.bus = bus;
}

Customers.prototype.create = function (name) {
    if (!name) return Promise.reject(new Error('name is required'));

    return new Promise(
        (resolve, reject) => {
            var id = require('shortid').generate();

            this.customers.insert({
                _id: id,
                name: name
            }, (err) => {
                if (err) return reject(err);

                resolve(id);
            })
        }
    )
}

module.exports = Customers;