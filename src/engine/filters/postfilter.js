export default class PostFilter {
    /**
     * @param {HTMLAnchorElement} element The link which direct to the profile of blocked user.
     * @returns {Array.<HTMLElement>}
     */
    getElements (element) {
        if (!(element instanceof HTMLAnchorElement)) {
            throw new Error(`Class is not an instance of HTMLAnchorElement. Given ${ element.constructor.name }.`);
        }

        // A link which directs to the user profile is wrapped inside a lot of elements.
        // From the link point of view - we need to go up 13 times. After that pointer will
        // indicate to the whole post element.

        let wholeBlock = element.parentElement;

        // Try/catch prevents when `wholeBlock.parentElement` does not exist. It means
        // given element is not a post.
        try {
            for (let i = 0; i < 12; ++i) {
                wholeBlock = wholeBlock.parentElement;
            }

            if (wholeBlock instanceof HTMLElement && (wholeBlock.hasAttribute('data-ft') || wholeBlock.hasAttribute('data-gt'))) {
                return [wholeBlock];
            }

            return [];
        } catch (e) {
            return [];
        }
    }
}
