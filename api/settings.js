function Settings(db, bus) {
    this.settings = db.collection('settings');
    this.bus = bus;
}

Settings.prototype.get = function (key) {
    if (!key) return Promise.reject(new Error('key is required'));

    return new Promise(
        (resolve, reject) => {
            this
            .settings
            .findOne(
                {
                    _id: key
                },
                (err, doc) => {
                    if (err) return reject(err);

                    if (!doc) return resolve(null);

                    resolve(doc.value);
                }
            )
        }
    )
};

Settings.prototype.set = function (key, value) {
    if (!key) return Promise.reject(new Error('key is required'));

    return new Promise(
        (resolve, reject) => {
            this.settings.findOne(
                {
                    _id: key
                },
                (err, old) => {
                    if (err) return reject(err);

                    if (old && value) {
                        this.settings.update({
                            _id: key
                        }, {
                            $set: {
                                value: value
                            }
                        }, (err) => {
                            if (err) return reject(err);

                            resolve();
                        })
                    } else if (!old) {
                        this.settings.insert({
                            _id: key,
                            value: value
                        }, (err) => {
                            if (err) return reject(err);

                            resolve();
                        })
                    } else if (old && value === null) {
                        this.settings.remove({
                            _id: key
                        }, (err) => {
                            if (err) return reject(err);

                            resolve();
                        })
                    } else resolve();
                }
            )
        }
    )
};

module.exports = Settings;