/* global describe, it, beforeEach, afterEach, expect, sinon */

import utils from '../src/utils';
import linkElements from './_html/link-elements';

describe('Utils', () => {
    describe('getBlockedUsers', () => {
        it('should be a function', () => {
            expect(utils.getBlockedUsers).to.be.a('function');
        });

        it('returns list of blocked users as array', () => {
            const users = utils.getBlockedUsers();

            expect(users).to.be.a('array');
        });
    });

    describe('getElementsToFilter', () => {
        let rootElement;

        beforeEach(()=> {
            rootElement = document.createElement('div');
            rootElement.innerHTML = linkElements;
            document.body.appendChild(rootElement);
        });

        afterEach(()=> {
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

            const getBlockedUsersStub = sinon.stub(utils, 'getBlockedUsers').returns([
                /\/First/i,
                /\/Second/i
            ]);

            expect(utils.getElementsToFilter()).to.deep.equal(links);
            expect(getBlockedUsersStub.calledOnce).to.equal(true);
        });
    });
});
