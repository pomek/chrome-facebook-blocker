let settings = {};

/**
 * Mock of `chrome.storage.sync` API.
 */
const storage = {
    get(data, callback) {
        let settingsToReturn = {};

        Object.keys(data).forEach((key) => {
            if (typeof settings[key] !== 'undefined') {
                settingsToReturn[key] = settings[key];
            } else {
                settingsToReturn[key] = data[key];
            }

            callback(settingsToReturn);
        });
    },

    set(data, callback) {
        Object.keys(data).forEach((key) => {
            settings[key] = data[key];
        });

        callback();
    },

    clear() {
        settings = {};
    },

    get settings() {
        return settings;
    }
};

export default storage;
