/* global describe, it, beforeEach, expect, sinon */

import DeletionEngine from '../../src/engine/deletionengine';

describe('DeletionEngine', () => {
    let engine;

    beforeEach(() => {
        engine = new DeletionEngine();
    });

    it('is initializable', () => {
        expect(engine).to.be.an.instanceof(DeletionEngine);
        expect(engine._filters.size).to.equal(0);
    });

    describe('adds a new filter', () => {
        it('successfully when filter contains method `getElements()`', () => {
            class StubFilter {
                getElements () {
                }
            }

            const objectFilter = {
                getElements() {
                }
            };

            expect(() => engine.add(objectFilter)).to.not.throw(Error);
            expect(engine._filters.size).to.equal(1);

            expect(() => engine.add(new StubFilter())).to.not.throw(Error);
            expect(engine._filters.size).to.equal(2);
        });

        it('throws an error when object does not contain method `getElements()`', () => {
            expect(() => engine.add({})).to.throw(Error, 'Filter must contain a method "getElements".');
            expect(engine._filters.size).to.equal(0);
        });
    });

    describe('removes', () => {
        it('execute added filters', () => {
            const filters = {
                first: {
                    getElements: sinon.stub().returns([])
                },
                second: {
                    getElements: sinon.stub().returns([])
                }
            };

            const divElement = document.createElement('div');

            engine.add(filters.first);
            engine.add(filters.second);
            engine.remove(divElement);

            expect(filters.first.getElements.calledOnce).to.equal(true);
            expect(filters.first.getElements.firstCall.args[0]).to.equal(divElement);
            expect(filters.second.getElements.calledOnce).to.equal(true);
            expect(filters.second.getElements.firstCall.args[0]).to.equal(divElement);
        });

        it('elements returned by filters', () => {
            const elements = {
                first: document.createElement('article'),
                second: document.createElement('section'),
                div: document.createElement('div')
            };

            const stubs = {
                firstElementRemove: sinon.stub(elements.first, 'remove'),
                secondElementRemove: sinon.stub(elements.second, 'remove')
            };

            const filter = {
                getElements: sinon.stub().returns([
                    elements.first,
                    elements.second
                ])
            };

            engine.add(filter);
            engine.remove(elements.div);

            expect(filter.getElements.calledOnce).to.equal(true);
            expect(filter.getElements.firstCall.args[0]).to.equal(elements.div);
            expect(stubs.firstElementRemove.calledOnce).to.equal(true);
            expect(stubs.secondElementRemove.calledOnce).to.equal(true);
        });

        it('only first elements returned by filters', () => {
            const elements = {
                article: document.createElement('article'),
                div: document.createElement('div')
            };

            const articleRemoveStub = sinon.stub(elements.article, 'remove');

            const filters = {
                first: {
                    getElements: sinon.stub().returns([])
                },
                second: {
                    getElements: sinon.stub().returns([elements.article])
                },
                third: {
                    getElements: sinon.stub().returns([])
                }
            };

            engine.add(filters.first);
            engine.add(filters.second);
            engine.add(filters.third);
            engine.remove(elements.div);

            expect(filters.first.getElements.calledOnce).to.equal(true);
            expect(filters.second.getElements.calledOnce).to.equal(true);
            expect(filters.third.getElements.called).to.equal(false);
            expect(articleRemoveStub.calledOnce).to.equal(true);
        });
    });
});
