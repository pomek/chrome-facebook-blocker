const utils = {
    /**
     * Returns a list of blocked users.
     *
     * @returns {Array.<RegExp>}
     */
    getBlockedUsers() {
        const users = [
            'NotExistingFacebookUsers' // Todo: Temproary code coverage fix.
        ];

        return users.map((nickName) => new RegExp(`/${ nickName }`, 'i'));
    },

    /**
     * Return a list of elements that will be parsed by filters.
     *
     * @returns {Array.<HTMLAnchorElement>}
     */
    getElementsToFilter() {
        const users = utils.getBlockedUsers();

        return Array.from(document.querySelectorAll('a[data-hovercard]'))
            .filter((element) => {
                const childNodes = element.childNodes;

                // Facebook links contain instance of Text or instances of Comment (2x) and Text (1x).
                if (childNodes.length !== 1 && childNodes.length !== 3) {
                    return false;
                }

                if (!(childNodes[0] instanceof Text) && !(childNodes[1] instanceof Text)) {
                    return false;
                }

                return users.some((user) => element.href.match(user));
            });
    }
};

export default utils;
