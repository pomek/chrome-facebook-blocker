export default class ReplyToCommentFilter {
    /**
     * @param {HTMLAnchorElement} element The link which direct to the profile of blocked user.
     * @returns {Array.<HTMLElement>}
     */
    getElements (element) {
        if (!(element instanceof HTMLAnchorElement)) {
            throw new Error(`Class is not an instance of HTMLAnchorElement. Given ${ element.constructor.name }.`);
        }

        // A link which directs to the user profile is wrapped inside a lot of elements.
        // From the link point of view - we need to go up 10 times. After that pointer will
        // indicate to the whole comment element.

        let wholeBlock = element.parentElement;

        // Try/catch prevents when `wholeBlock.parentElement` does not exist. It means
        // given element is not a post.
        try {
            for (let i = 0; i < 9; ++i) {
                wholeBlock = wholeBlock.parentElement;
            }

            if (!this._isValidCommentElement(wholeBlock)) {
                return [];
            }

            return [wholeBlock];
        } catch (e) {
            return [];
        }
    }

    /**
     * Checks whether to given element is a root of the comment element.
     *
     * @private
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

        // Comment and reply for the comment have one difference. Value for the attribute `[data-testid]` in "Like it!" button.
        const likeElement = element.querySelector('.UFICommentActions > .UFILikeLink[data-ft][data-testid="ufi_reply_like_link"]');

        if (!likeElement) {
            return false;
        }

        return true;
    }
}
