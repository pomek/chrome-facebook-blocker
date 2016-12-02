import Storage from './chrome/storage';
import utils from './utils';

const settings = new Storage();

const elements = {
    form: {
        // Whole form.
        root: document.getElementById('block-user-form'),

        // Group of elements related to user's input.
        profileGroup: document.getElementById('block-user-profile-group'),

        // User's input.
        profileInput: document.getElementById('block-user-profile-input'),

        // Container for error.
        profileError: document.getElementById('block-user-profile-error'),

        // Label with information.
        helpLabel: document.getElementById('block-user-help-label'),

        // Information for user about user's Facebook profile.
        helpMessage: document.getElementById('block-user-help-message')
    },
    template: {
        // Whole template.
        root: document.getElementById('table-user-template'),

        // Container for blocked users.
        container: document.getElementById('table-user'),

        // Element where new users will be inserted.
        data: document.getElementById('table-user-data'),

        // Element which informs about empty list.
        empty: document.getElementById('table-empty-list')
    }
};

// Show additional block with information about user's profile.
elements.form.helpLabel.addEventListener('click', () => {
    elements.form.helpLabel.classList.add('hidden');
    elements.form.helpMessage.classList.remove('hidden');
});

// Handle user's input when user sent a form.
elements.form.root.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const userName = elements.form.profileInput.value.trim();

    if (!userName) {
        return setError(`User's profile cannot be empty.`);
    }

    utils.validateName(userName)
        .then(() => {
            return settings.get(Storage.USERS);
        })
        .then((users) => {
            elements.form.profileInput.value = '';

            users.push({
                name: userName,
                createdAt: utils.getCurrentDateAsString()
            });

            return settings.set(Storage.USERS, users);
        })
        .then(renderBlockedUsers)
        .catch((err) => {
            setError(err.message);
        });
});

// Handle user's input.
elements.form.profileInput.addEventListener('input', () => {
    if (
        !elements.form.profileError.classList.contains('hidden') &&
        elements.form.profileInput.value.trim()
    ) {
        setError(null);
    }
});

// Load blocked users when page is ready.
document.addEventListener('DOMContentLoaded', renderBlockedUsers);

/**
 * @param {String|null} message
 */
function setError (message) {
    if (elements.form.profileError.firstChild) {
        elements.form.profileError.firstChild.remove();
    }

    if (message) {
        elements.form.profileError.appendChild(new Text(message));
        elements.form.profileError.removeAttribute('aria-hidden');
        elements.form.profileError.classList.remove('hidden');
        elements.form.profileGroup.classList.add('has-error');

    } else {
        elements.form.profileGroup.classList.remove('has-error');
        elements.form.profileError.classList.add('hidden');
        elements.form.profileError.setAttribute('aria-hidden', 'true');
    }
}

/**
 * Removes user from the blocked list.
 *
 * @param {String} nickName
 */
function removeUser (nickName) {
    return settings.get(Storage.USERS)
        .then((newUsers) => {
            const usersAfterDeletion = newUsers.filter((item) => item.name !== nickName);

            return settings.set(Storage.USERS, usersAfterDeletion);
        });
}

/**
 * Render the blocked users.
 */
function renderBlockedUsers () {
    settings.get(Storage.USERS)
        .then((users) => {
            while (elements.template.data.firstChild) {
                elements.template.data.removeChild(elements.template.data.firstChild);
            }

            if (users.length === 0) {
                elements.template.container.classList.add('hidden');
                elements.template.empty.classList.remove('hidden');
            } else {
                elements.template.container.classList.remove('hidden');
                elements.template.empty.classList.add('hidden');
            }

            createSingleElement(users);
        });
}

/**
 * @param {Array} users
 */
function createSingleElement (users) {
    users.forEach((userItem) => {
        const template = document.importNode(elements.template.root, true);

        const templateElements = {
            name: template.content.querySelector('#table-user-name'),
            date: template.content.querySelector('#table-user-date'),
            remove: template.content.querySelector('#table-user-remove'),
            parent: template.content.querySelector('#table-user-parent')
        };

        Object.keys(templateElements).forEach((elementId) => {
            templateElements[elementId].removeAttribute('id');
        });

        templateElements.name.appendChild(new Text(userItem.name));
        templateElements.date.appendChild(new Text(userItem.createdAt));

        templateElements.remove.addEventListener('click', () => {
            templateElements.remove.disabled = true;

            removeUser(userItem.name)
                .then(renderBlockedUsers);
        });

        elements.template.data.appendChild(template.content);
    });
}
