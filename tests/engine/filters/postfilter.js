/* global describe, it, beforeEach, afterEach, expect */

import PostFilter from '../../../src/engine/filters/postfilter';
import fullPost from './_html/full-post';

describe('Filters - PostFilter', () => {
    let filter, wholeBlock, linkElement, avatarElement, nestedInvalidLink;

    beforeEach(() => {
        const divElement = document.createElement('div');
        divElement.innerHTML = fullPost;

        document.body.appendChild(divElement);

        wholeBlock = document.getElementById('ignore-person-post-block');
        linkElement = document.getElementById('ignore-person-link');
        avatarElement = document.getElementById('ignore-person-avatar-link');

        filter = new PostFilter();
    });

    afterEach(() => {
        wholeBlock.parentElement.remove();
    });

    it('is initializable', () => {
        expect(filter).to.be.an.instanceof(PostFilter);
    });

    it('behaves as a filter', () => {
        expect(filter.getElements).to.be.a('function');
    });

    describe('getElements', () => {
        it('throws an error when given element is not an instance of HTMLAnchorElement', () => {
            expect(() => filter.getElements(wholeBlock)).to.throw(Error, 'Class is not an instance of HTMLAnchorElement. Given HTMLDivElement.');
        });

        it('returns an array with post element', () => {
            const elements = filter.getElements(linkElement);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(1);
            expect(elements[0]).to.equal(wholeBlock);
        });

        it('returns an empty array when post cannot be found', () => {
            const elements = filter.getElements(avatarElement);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(0);
        });

        it('returns an empty array when post cannot be found (parentElement does not contain `data-ft` or `data-gt` attribute)', () => {
            nestedInvalidLink = document.getElementById('invalid-link-1');

            const elements = filter.getElements(nestedInvalidLink);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(0);
        });
    });
});
