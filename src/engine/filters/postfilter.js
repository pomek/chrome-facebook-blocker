import AbstractFilter from './abstractfilter';

export default class PostFilter extends AbstractFilter {
    constructor () {
        super();
        /**
         * How many times needs to go up in order to get the root element.
         *
         * @private
         * @type {number}
         */
        this._deepLevel = 13;
    }

    /**
     * @param {HTMLAnchorElement} element The link which direct to the profile of blocked user.
     * @returns {Array.<HTMLElement>}
     */
    getElements (element) {
        const rootElement = super._findRootContainer(element, this._deepLevel);

        if (!rootElement) {
            return [];
        }

        if (rootElement.hasAttribute('data-ft') || rootElement.hasAttribute('data-gt')) {
            return [rootElement];
        }

        return [];
    }
}
