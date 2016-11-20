/* global describe, it, beforeEach, afterEach, expect, sinon */

import CommentFilter from '../../../src/engine/filters/commentfilter';
import fullComment from './_html/full-comment';
import repliesListToComment from './_html/replies-list-to-comment';

describe('Filters - CommentFilter', () => {
    let filter, wholeBlock, linkElement, avatarElement, nestedInvalidLink, controlElement;

    beforeEach(() => {
        const divElement = document.createElement('div');
        divElement.innerHTML = fullComment;

        document.body.appendChild(divElement);

        wholeBlock = document.getElementById('ignore-person-comment-block');
        linkElement = document.getElementById('ignore-person-link');
        avatarElement = document.getElementById('ignore-person-avatar-link');
        controlElement = document.getElementById('control-element');
        filter = new CommentFilter();
    });

    afterEach(() => {
        wholeBlock.parentElement.remove();
    });

    it('is initializable', () => {
        expect(filter).to.be.an.instanceof(CommentFilter);
    });

    it('behaves as a filter', () => {
        expect(filter.getElements).to.be.a('function');
    });

    describe('getElements', () => {
        it('throws an error when given element is not an instance of HTMLAnchorElement', () => {
            expect(() => filter.getElements(wholeBlock)).to.throw(Error, 'Class is not an instance of HTMLAnchorElement. Given HTMLDivElement.');
        });

        it('returns an array with comment element', () => {
            const elements = filter.getElements(linkElement);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(1);
            expect(elements[0]).to.equal(wholeBlock);
        });

        it('returns an empty array when whole block is invalid', () => {
            document.getElementById('reply-like-link').setAttribute('data-testid', 'ufi_reply_like_link');

            const elements = filter.getElements(linkElement);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(0);
        });

        it('returns an empty array when comment block cannot be found (out of the document)', () => {
            const elements = filter.getElements(avatarElement);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(0);
        });

        it('returns an empty array when comment block cannot be found (parentElement does not contain `data-ft` attribute)', () => {
            nestedInvalidLink = document.getElementById('invalid-link-1');

            const elements = filter.getElements(nestedInvalidLink);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(0);
        });

        it('returns an empty array when comment block cannot be found (parentElement does not contain class "UFIComment")', () => {
            nestedInvalidLink = document.getElementById('invalid-link-1');
            controlElement.classList.add('UFIRow');
            controlElement.setAttribute('data-ft', 'test');

            const elements = filter.getElements(nestedInvalidLink);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(0);
        });

        it('returns an empty array when comment block cannot be found (parentElement does not contain class "UFIRow")', () => {
            nestedInvalidLink = document.getElementById('invalid-link-1');
            controlElement.classList.add('UFIComment');
            controlElement.setAttribute('data-ft', 'test');

            const elements = filter.getElements(nestedInvalidLink);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(0);
        });

        it('returns an empty array when comment block cannot be found (parentElement is null) #1', () => {
            nestedInvalidLink = document.getElementById('invalid-link-2');

            const elements = filter.getElements(nestedInvalidLink);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(0);
        });

        it('returns an empty array when comment block cannot be found (parentElement is null) #2', () => {
            sinon.stub(avatarElement, 'parentElement', {
                get() {
                    return null;
                }
            });

            const elements = filter.getElements(avatarElement);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(0);
        });

        it('returns an array with a comment and replies to the comment', () => {
            wholeBlock.parentElement.insertAdjacentHTML('beforeend', repliesListToComment);

            const repliesElement = document.getElementById('replies-to-post');
            const elements = filter.getElements(linkElement);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(2);
            expect(elements[0]).to.equal(wholeBlock);
            expect(elements[1]).to.equal(repliesElement);
        });

        it('returns an array with comment only (replies container does not contain class "UFIReplyList")', () => {
            wholeBlock.parentElement.insertAdjacentHTML('beforeend', repliesListToComment);

            const repliesElement = document.getElementById('replies-to-post');
            repliesElement.classList.remove('UFIReplyList');

            const elements = filter.getElements(linkElement);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(1);
            expect(elements[0]).to.equal(wholeBlock);
        });

        it('returns an array with comment only (replies container does not exist)', () => {
            wholeBlock.parentElement.insertAdjacentHTML('beforeend', repliesListToComment);

            sinon.stub(wholeBlock, 'nextElementSibling', {
                get() {
                    return wholeBlock;
                }
            });

            const elements = filter.getElements(linkElement);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(1);
            expect(elements[0]).to.equal(wholeBlock);
        });
    });
});
