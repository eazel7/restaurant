function Stats(db, bus) {
    this.orders = db.collection('orders');
    this.bus = bus;
}

Stats.prototype.listOrdersBetweenDates = function (from, to) {
    return new Promise(
        (resolve, reject) => {
            this.orders.find({
                date: {
                    $gte: from,
                    $lte: to
                }
            }).toArray( 
                (err, docs) => {
                    if (err) return reject(err);

                    resolve(docs);
                })
        }
    );
};

module.exports = Stats;