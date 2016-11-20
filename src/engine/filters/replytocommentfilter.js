import AbstractFilter from './abstractfilter';

export default class ReplyToCommentFilter extends AbstractFilter {
    /**
     * @param {HTMLAnchorElement} element The link which direct to the profile of blocked user.
     * @returns {Array.<HTMLElement>}
     */
    getElements (element) {
        const rootElement = super._findRootContainer(element, 10);

        if (this._isValidCommentElement(rootElement)) {
            return [rootElement];
        }

        return [];
    }

    /**
     * Checks whether to given element is a root of the comment element.
     *
     * @private
     * @param {HTMLElement} element
     * @returns {Boolean}
     */
    _isValidCommentElement (element) {
        if (!super._isValidCommentElement(element)) {
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
