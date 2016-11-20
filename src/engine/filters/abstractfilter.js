export default /* abstract */ class AbstractFilter {
    /**
     * Checks whether to given element is a root of the comment element.
     *
     * @protected
     * @param {HTMLElement} element
     * @returns {Boolean}
     */
    _isValidCommentElement (element) {
        if (!(element instanceof HTMLElement)) {
            return false;
        }

        if (!element.hasAttribute('data-ft')) {
            return false;
        }

        if (!element.classList.contains('UFIComment') || !element.classList.contains('UFIRow')) {
            return false;
        }

        return true;
    }

    /**
     * Tries to find the root element of whole user post.
     *
     * @protected
     * @param {HTMLAnchorElement} element The link which direct to the profile of blocked user.
     * @param {Number} howDeepIsElement How many times needs to go up in order to get the root element.
     * @returns {HTMLElement}
     */
    _findRootContainer (element, howDeepIsElement) {
        if (!(element instanceof HTMLAnchorElement)) {
            throw new Error(`Class is not an instance of HTMLAnchorElement. Given ${ element.constructor.name }.`);
        }

        // A link which directs to the user profile is wrapped inside a lot of elements.
        // From the link point of view - we need to go up n times. After that pointer will
        // indicate to the whole post element.

        let wholeBlock = element.parentElement;

        if (!wholeBlock) {
            return null;
        }

        // Try/catch prevents when `wholeBlock.parentElement` does not exist. It means
        // given element is not a post.
        try {
            for (let i = 0; i < (howDeepIsElement - 1); ++i) {
                wholeBlock = wholeBlock.parentElement;
            }

            return wholeBlock;
        } catch (e) {
            return null;
        }
    }
}
