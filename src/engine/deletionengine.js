export default class DeletionEngine {
    constructor () {
        /**
         * Collection of filters.
         *
         * @private
         * @type {Set}
         */
        this._filters = new Set();
    }

    /**
     * Appends a new filter to collection.
     *
     * The filter must contain the `getElements` method which returns an array with elements
     * to deletion. It means these elements contain a content which shouldn't be visible to
     * the user.
     *
     * @param {Object} filter An instance of filter.
     */
    add (filter) {
        if (typeof filter.getElements !== 'function') {
            throw new Error('Filter must contain a method "getElements".');
        }

        this._filters.add(filter);
    }

    /**
     * Removes given element from Document.
     *
     * Filters returns elements which contain content which should be removed.
     * Facebook allows commenting in different places:
     *   - as a post on the wall (also group, fan page, etc.),
     *   - as a comment for the post,
     *   - as a reply for the comment,
     *   - as a comment for a picture,
     *   - as a reply for the comment (in the picture).
     * For each case we need to include a specify filter.
     *
     * @param {HTMLAnchorElement} element The link which direct to the profile of blocked user.
     */
    remove (element) {
        Array.from(this._filters)
            .some((filter) => {
                const filteredElements = filter.getElements(element);
                const countElements = filteredElements.length;
                const removedElements = filteredElements.filter((item) => item.remove());

                return removedElements.length !== countElements;
            });
    }
}
