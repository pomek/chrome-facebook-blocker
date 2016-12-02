/* global describe, it, beforeEach, afterEach, expect, sinon, window, before */

import utils from '../src/utils';
import Storage from '../src/chrome/storage';
import linkElements from './_html/link-elements';
import chromeStorage from './_stubs/chrome-storage-sync';

describe('Utils', () => {
    before(() => {
        window.chrome = window.chrome || {};
        window.chrome.storage = window.chrome.storage || {};
        window.chrome.storage.sync = chromeStorage;
    });

    describe('getBlockedUsers', () => {
        beforeEach((done) => {
            chromeStorage.set({
                [Storage.USERS]: [
                    {name: 'pomekPL', createdAt: ''},
                    {name: '123456', createdAt: ''}
                ]
            }, done);
        });

        it('should be a function', () => {
            expect(utils.getBlockedUsers).to.be.a('function');
        });

        it('returns list of blocked users as array', () => {
            return utils.getBlockedUsers()
                .then((users) => {
                    expect(users).to.be.a('array');
                    expect('/pomekPL').to.match(users[0]);
                    expect('/profile.php?id=123456').to.match(users[1]);
                });
        });
    });

    describe('getElementsToFilter', () => {
        let rootElement;

        beforeEach(() => {
            rootElement = document.createElement('div');
            rootElement.innerHTML = linkElements;
            document.body.appendChild(rootElement);
        });

        afterEach(() => {
            rootElement.remove();
        });

        it('should be a function', () => {
            expect(utils.getElementsToFilter).to.be.a('function');
        });

        it('returns proper links as array', () => {
            const links = [
                document.getElementById('el-1'),
                document.getElementById('el-3')
            ];

            const getBlockedUsersStub = sinon.stub(utils, 'getBlockedUsers')
                .returns(Promise.resolve([
                    /\/First/i,
                    /\/Second/i
                ]));

            return utils.getElementsToFilter()
                .then((elements) => {
                    expect(elements).to.deep.equal(links);
                    expect(getBlockedUsersStub.calledOnce).to.equal(true);
                });
        });
    });

    describe('getCurrentDateAsString', () => {
        let clock;

        it('should be a function', () => {
            expect(utils.getCurrentDateAsString).to.be.a('function');
        });

        it('returns formatted date', () => {
            clock = sinon.useFakeTimers(new Date(2016, 11, 20, 14, 20).getTime());
            expect(utils.getCurrentDateAsString()).to.equal('2016-12-20 14:20');
            clock.restore();

            clock = sinon.useFakeTimers(new Date(2016, 2, 8, 4, 1).getTime());
            expect(utils.getCurrentDateAsString()).to.equal('2016-03-08 04:01');
            clock.restore();
        });
    });

    describe('validateName', () => {
        beforeEach((done) => {
            chromeStorage.set({
                [Storage.USERS]: [
                    {name: 'pomekPL', createdAt: ''}
                ]
            }, done);
        });

        it('should be a function', () => {
            expect(utils.validateName).to.be.a('function');
        });

        it('throws an error when name is already taken', () => {
            return utils.validateName('pomekPL')
                .then(
                    () => {
                        throw new Error('Expected that a promise will be rejected.');
                    },
                    (err) => {
                        expect(err).to.be.an.instanceof(Error);
                        expect(err.message).to.equal('Given profile is already disabled.');
                    }
                );
        });

        it('throws an error when name contains white spaces', () => {
            return utils.validateName('pomek PL')
                .then(
                    () => {
                        throw new Error('Expected that a promise will be rejected.');
                    },
                    (err) => {
                        expect(err).to.be.an.instanceof(Error);
                        expect(err.message).to.equal('Profile name cannot contain white space.');
                    }
                );
        });

        it('resolves a promise when name is available', () => {
            return utils.validateName('pomek')
                .then(() => {
                    expect('This name is available.').to.be.a('string');
                });
        });
    });
});
