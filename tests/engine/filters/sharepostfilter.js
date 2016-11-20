/* global describe, it, beforeEach, afterEach, expect, sinon */

import SharePostFilter from '../../../src/engine/filters/sharepostfilter';
import sharePoll from './_html/shared-poll';
import shareEvent from './_html/shared-event';
import shareImage from './_html/shared-image';

const scenarios = {
    poll: sharePoll
    // event: shareEvent,
    // photo: shareImage
};

describe('Filters - SharePostFilter', () => {
    let filter;

    beforeEach(() => {
        filter = new SharePostFilter();
    });

    it('is initializable', () => {
        expect(filter).to.be.an.instanceof(SharePostFilter);
    });

    it('behaves as a filter', () => {
        expect(filter.getElements).to.be.a('function');
    });

    Object.keys(scenarios).forEach((scenarioName) => {
        describe(scenarioName, () => {
            let wholeBlock, linkElement, avatarElement, nestedInvalidLink, controlElement;

            beforeEach(() => {
                const divElement = document.createElement('div');
                divElement.innerHTML = scenarios[scenarioName];

                document.body.appendChild(divElement);

                wholeBlock = document.getElementById('ignore-person-root-content');
                linkElement = document.getElementById('ignore-person-link');
                avatarElement = document.getElementById('ignore-person-avatar-link');
                controlElement = document.getElementById('control-element');
            });

            afterEach(() => {
                wholeBlock.parentElement.remove();
            });

            it('throws an error when given element is not an instance of HTMLAnchorElement', () => {
                expect(() => filter.getElements(wholeBlock)).to.throw(Error, 'Class is not an instance of HTMLAnchorElement. Given HTMLDivElement.');
            });

            it('returns an array with element', () => {
                const elements = filter.getElements(linkElement);

                expect(elements).to.be.a('array');
                expect(elements.length).to.equal(1);
                expect(elements[0]).to.equal(wholeBlock);
            });

            it('returns an empty array when post cannot be found (out of the document)', () => {
                const elements = filter.getElements(avatarElement);

                expect(elements).to.be.a('array');
                expect(elements.length).to.equal(0);
            });

            it('returns an empty array when element cannot be found (parentElement does not contain `data-ft` or `data-gt` attribute)', () => {
                nestedInvalidLink = document.getElementById('invalid-link-1');

                const elements = filter.getElements(nestedInvalidLink);

                expect(elements).to.be.a('array');
                expect(elements.length).to.equal(0);
            });

            it('returns an empty array when element cannot be found (parentElement is null) #1', () => {
                nestedInvalidLink = document.getElementById('invalid-link-2');

                const elements = filter.getElements(nestedInvalidLink);

                expect(elements).to.be.a('array');
                expect(elements.length).to.equal(0);
            });

            it('returns an empty array when element cannot be found (parentElement is null) #2', () => {
                sinon.stub(avatarElement, 'parentElement', {
                    get() {
                        return null;
                    }
                });

                const elements = filter.getElements(avatarElement);

                expect(elements).to.be.a('array');
                expect(elements.length).to.equal(0);
            });
        });
    });
});
