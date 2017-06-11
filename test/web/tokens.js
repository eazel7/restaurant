const Tokens = require('../../web/tokens');
const assert = require('assert')

describe('Tokens', () => {
    var pair = {
        "privateKey": "-----BEGIN RSA PRIVATE KEY-----\nMIIBOQIBAAJBALSTvzVNsVkF9CHXMhAX7yK/Lb2DTiIsjFYd2MIicmoOhlq1q2F/\nTlDSuXrBMozeLdzM1E98J2d8RjARKhKUgy8CAwEAAQJAJ4q+8R4tOrBKEGr+JHYJ\nQJOaoYgyQNt+c5EfmQtQAJcEOQuIjqiXKP/I/lHyMIP8i8j1DQgWnzYTxjtwc7Xr\n4QIhAP0/3AnW84iwnwf00YOrxA/cQmnhM6KBqBtqizCgP5EfAiEAtonT4FRHWMhg\nCj/5jnn08NJCOfItsjziy32hZdSde/ECIAT/FotHJ2Th/zE7/ko3wFWDxfeqzsb9\nAeEQmBBsiPSHAiBavoH6D2u4k0RLVCp3zeEapywNKnvVE7ebecT2no/7wQIgFi8q\n+qZYYJz/RYLcO+ItdwcerpFR8KN4QztD34l05Gw=\n-----END RSA PRIVATE KEY-----",
        "publicKey": "-----BEGIN RSA PUBLIC KEY-----\nMEgCQQC0k781TbFZBfQh1zIQF+8ivy29g04iLIxWHdjCInJqDoZatathf05Q0rl6\nwTKM3i3czNRPfCdnfEYwESoSlIMvAgMBAAE=\n-----END RSA PUBLIC KEY-----"
    };

    var target;

    beforeEach(function (done) {
        target = new Tokens(pair);

        done();
    });

    describe('.generateToken', () => {
        it('requires profile', (done) => {
            target.generateToken().then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'profile is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            )
        });

        it('generates token', (done) => {
            target.generateToken({
                user: 'user1',
                roles: ['admin']
            }).then(
                (token) => {
                    try {
                        assert(token);
                        assert.equal(typeof (token), 'string');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
                )
        });
    });

    describe('.decodeToken', () => {
        it('requires token', (done) => {
            target.decodeToken().then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'token is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            )
        })

        it('decodes token', (done) => {
            target.decodeToken('rSjrl70hlp2OfoQ7HzexwM33foC0DQzktbGdGwgBojhgufQxzXwvUAOqvgGixfnZLc+D4XgCRLswZe7pR0WjvGJ0K5JHujY/sD3xvP4gmLps9ao2w51f91VBmmR5jorcVDRmbAemznzLBZf36os0AmR9i489csw+Xv2wq6ih2VpAdvkudBI/oyEZB3Yy3TBmsYkpPR3cfpELwrx2evzyT9hOq+bziiz7SXRp0eXo3ncwssQLB1jusd+T2zWnWtxM').then(
                (profile) => {
                    try {
                        assert(profile);

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });
    });
});