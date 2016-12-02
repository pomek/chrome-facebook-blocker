/* global describe, it, beforeEach, afterEach, expect, window, before */

import Storage from '../../src/chrome/storage';
import chromeStorage from '../_stubs/chrome-storage-sync';

describe('Storage', () => {
    let settings;

    before(() => {
        window.chrome = window.chrome || {};
        window.chrome.storage = window.chrome.storage || {};
        window.chrome.storage.sync = chromeStorage;
    });

    beforeEach(() => {
        settings = new Storage();
    });

    afterEach(() => {
        chromeStorage.clear();
    });

    it('is initializable', () => {
        expect(settings).to.be.an.instanceof(Storage);
    });

    it('defines constants', () => {
        expect(Storage.USERS).to.equal('users');
    });

    describe('set', () => {
        it('allows set by passing key and value', () => {
            return settings.set('foo', 'bar')
                .then(() => {
                    expect(chromeStorage.settings.foo).to.equal('bar');
                });
        });

        it('allows set by passing whole object', () => {
            return settings.set({foo: 'bar', bar: 'foo'})
                .then(() => {
                    expect(chromeStorage.settings.foo).to.equal('bar');
                    expect(chromeStorage.settings.bar).to.equal('foo');
                });
        });
    });

    describe('get', () => {
        it('returns default values when they have not been set up before', () => {
            return settings.get(Storage.USERS)
                .then((users) => {
                    expect(users).to.be.a('array');
                    expect(users.length).to.equal(0);
                });
        });

        it('returns the same values like have set up before', () => {
            const users = ['pomekPL'];

            return settings.set(Storage.USERS, users)
                .then(() => {
                    return settings.get(Storage.USERS);
                })
                .then((settingsUsers) => {
                    expect(settingsUsers).to.equal(users);
                });
        });
    });
});
