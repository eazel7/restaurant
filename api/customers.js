function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function Customers(db, bus) {
    this.customers = db.collection('customers');
    this.bus = bus;
}

Customers.prototype.search = function (filter) {
    if (!filter) return Promise.reject(new Error('filter is required'));

    return new Promise(
        (resolve, reject) => {
            var regex = escapeRegExp(filter);

            this.customers.find({
                name: {
                    $regex: regex,
                    $options: 'gi'
                }
            })
            .toArray(
                (err, docs) => {
                    if (err) return reject(err);

                    resolve(docs);
                }
            )
        }
    )
}

Customers.prototype.get = function (customerId) {
    if (!customerId) return Promise.reject(new Error('customer id is required'));

    return new Promise(
        (resolve, reject) => {
            this
                .customers
                .findOne({
                    _id: customerId
                },
                (err, doc) => {
                    if (err) return reject(err);

                    resolve(doc);
                });
        }
    )
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
            });
        }
    );
};

module.exports = Customers;