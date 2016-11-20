/* global describe, it, beforeEach, afterEach, expect, sinon */

import AbstractFilter from '../../../src/engine/filters/abstractfilter';

describe('Filters - AbstractFilter', () => {
    let filter, elements;

    beforeEach(() => {
        elements = {
            article: document.createElement('article'),
            div: document.createElement('div'),
            ul: document.createElement('ul'),
            li: document.createElement('li'),
            a: document.createElement('a'),
        };

        Object.keys(elements).forEach((item) => {
            document.body.appendChild(elements[item]);
        });

        filter = new AbstractFilter();
    });

    afterEach(() => {
        Object.keys(elements).forEach((item) => {
            document.body.removeChild(elements[item]);
        });
    });

    it('is initializable', () => {
        expect(filter).to.be.an.instanceof(AbstractFilter);
    });

    it('behaves as a abstract filter', () => {
        expect(filter.getElements).to.not.be.a('function');
    });

    describe('_isValidCommentElement', () => {
        describe('returns true', () => {
            it('when given element can be a root element', () => {
                elements.div.setAttribute('data-ft', '{}');
                elements.div.classList.add('UFIComment', 'UFIRow');

                expect(filter._isValidCommentElement(elements.div)).to.equal(true);
            });
        });

        describe('returns false', () => {
            it('when element is not an instance of HTMLElement', () => {
                expect(filter._isValidCommentElement(null)).to.equal(false);
            });

            it('when element does not contain attribute "data-ft"', () => {
                expect(filter._isValidCommentElement(elements.div)).to.equal(false);
            });

            it('when element does not contain class "UFIComment"', () => {
                elements.div.setAttribute('data-ft', '{}');
                elements.div.classList.add('UFIRow');

                expect(filter._isValidCommentElement(elements.div)).to.equal(false);
            });

            it('when element does not contain class "UFIRow"', () => {
                elements.div.setAttribute('data-ft', '{}');
                elements.div.classList.add('UFIComment');

                expect(filter._isValidCommentElement(elements.div)).to.equal(false);
            });
        });
    });

    describe('_findRootContainer', () => {
        it('throws an error when element is not an instance of HTMLAnchorElement', () => {
            expect(() => {
                filter._findRootContainer(elements.div, 0);
            }).to.throw(Error, 'Class is not an instance of HTMLAnchorElement. Given HTMLDivElement.');
        });

        it('returns root element', () => {
            sinon.stub(elements.a, 'parentElement', {
                get() {
                    return elements.li;
                }
            });
            sinon.stub(elements.li, 'parentElement', {
                get() {
                    return elements.ul;
                }
            });
            sinon.stub(elements.ul, 'parentElement', {
                get() {
                    return elements.div;
                }
            });

            expect(filter._findRootContainer(elements.a, 3)).to.equal(elements.div);
        });

        it('returns null when parent of the element is null', () => {
            sinon.stub(elements.a, 'parentElement', {
                get() {
                    return null;
                }
            });

            expect(filter._findRootContainer(elements.a, 0)).to.equal(null);
        });

        it('returns null when any parent the element is null #1', () => {
            sinon.stub(elements.a, 'parentElement', {
                get() {
                    return elements.li;
                }
            });
            sinon.stub(elements.li, 'parentElement', {
                get() {
                    return elements.ul;
                }
            });
            sinon.stub(elements.ul, 'parentElement', {
                get() {
                    return elements.div;
                }
            });
            sinon.stub(elements.div, 'parentElement', {
                get() {
                    return null;
                }
            });

            expect(filter._findRootContainer(elements.a, 4)).to.equal(null);
        });

        it('returns null when any parent the element is null #2', () => {
            sinon.stub(elements.a, 'parentElement', {
                get() {
                    return elements.li;
                }
            });
            sinon.stub(elements.li, 'parentElement', {
                get() {
                    return null;
                }
            });

            expect(filter._findRootContainer(elements.a, 4)).to.equal(null);
        });

    });
});
