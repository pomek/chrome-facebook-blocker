/* global chrome */

export default class Storage {
    static get USERS () {
        return 'users';
    }

    /**
     * Updates the Chrome Storage.
     *
     * @returns {Promise}
     */
    set (keyOrSettings, value) {
        const settings = (typeof value === 'undefined') ? keyOrSettings : {
            [keyOrSettings]: value
        };

        return new Promise((resolve) => {
            chrome.storage.sync.set(settings, resolve);
        });
    }

    /**
     * Reads the storage and synchronizes the values with a local config.
     * @returns {Promise}
     */
    get (key) {
        const defaultSettings = {
            [Storage.USERS]: []
        };

        return new Promise((resolve) => {
            chrome.storage.sync.get(defaultSettings, (items) => resolve(items[key]));
        });
    }
}
