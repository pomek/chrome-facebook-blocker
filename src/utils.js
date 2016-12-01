import Storage from './chrome/storage';

const utils = {
    /**
     * Returns a list of blocked users.
     *
     * @returns {Promise<Array.<RegExp>>}
     */
    getBlockedUsers() {
        return new Storage().get(Storage.USERS)
            .then((users) => {
                users = users.map((item) => {
                    const name = item.name.replace(/\./g, '\\.');

                    return new RegExp(`/${ name }|/profile\\.php\\?id=${ name }`);
                });

                return Promise.resolve(users);
            });
    },

    /**
     * Return a list of elements that will be parsed by filters.
     *
     * @returns {Promise<Array.<HTMLAnchorElement>>}
     */
    getElementsToFilter() {
        return utils.getBlockedUsers()
            .then((users) => {
                const elements = Array.from(document.querySelectorAll('a[data-hovercard]'))
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

                return Promise.resolve(elements);
            });
    },

    /**
     * Checks whether the given name can be blocked.
     *
     * @param {String} name
     * @returns {Promise}
     */
    validateName(name) {
        const settings = new Storage();

        return settings.get(Storage.USERS)
            .then((users) => {
                const isBusy = users.some((item) => item.name === name);

                if (isBusy) {
                    throw new Error('Given profile is already disabled.');
                }

                if (name.match(/\s/)) {
                    throw new Error('Profile name cannot contain white space.');
                }
            });
    },

    /**
     * Returns current date as a string in format 'YYYY-MM-DD GG:HH'.
     *
     * @returns {String}
     */
    getCurrentDateAsString() {
        const date = new Date();
        const day = date.getDay();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hour = date.getHours();
        const mins = date.getMinutes();

        return `${year}-${prependChar(month)}-${prependChar(day)} ${prependChar(hour)}:${prependChar(mins)}`;
    }
};

/**
 * @param {Number} number
 * @param {Number} length
 * @param {String} char
 * @returns {String}
 */
function prependChar (number, length = 2, char = '0') {
    number = number.toString();

    if (number.length >= length) {
        return number;
    }

    return new Array(length - number.length + 1).join(char) + number;
}

export default utils;
