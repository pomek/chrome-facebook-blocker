import Storage from './chrome/storage';
import utils from './utils';

const settings = new Storage();
const elements = {
    blockPersonForm: document.getElementById('block-new-user'),
    userGroup: document.getElementById('user-profile-group'),
    userInput: document.getElementById('user-profile'),
    userError: document.getElementById('user-profile-error'),
    helpInfoTitle: document.getElementById('user-profile-help-title'),
    helpInfo: document.getElementById('user-profile-help'),
    table: {
        container: document.getElementById('table-user'),
        data: document.getElementById('table-user-data'),
        template: document.getElementById('table-user-template'),
        empty: document.getElementById('table-empty-list'),
    }
};

// Show additional block with information about user's profile.
elements.helpInfoTitle.addEventListener('click', () => {
    elements.helpInfoTitle.classList.add('hidden');
    elements.helpInfo.classList.remove('hidden');
});

elements.blockPersonForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const userName = elements.userInput.value.trim();

    if (!userName) {
        return setError(`User's profile cannot be empty.`);
    }

    utils.validateName(userName)
        .then(() => {
            return settings.get(Storage.USERS);
        })
        .then((users) => {
            users.push({
                name: userName,
                createdAt: utils.getCurrentDateAsString()
            });

            elements.userInput.value = '';

            return settings.set(Storage.USERS, users);
        })
        .then(renderBlockedUsers)
        .catch((err) => {
            setError(err.message);
        });

});

elements.userInput.addEventListener('input', () => {
    if (!elements.userError.classList.contains('hidden') && elements.userInput.value.trim()) {
        setError(null);
    }
});

document.addEventListener('DOMContentLoaded', renderBlockedUsers);

function setError (message) {
    if (elements.userError.firstChild) {
        elements.userError.firstChild.remove();
    }

    if (message) {
        elements.userError.appendChild(new Text(message));
        elements.userError.removeAttribute('aria-hidden');
        elements.userError.classList.remove('hidden');
        elements.userGroup.classList.add('has-error');

    } else {
        elements.userGroup.classList.remove('has-error');
        elements.userError.classList.add('hidden');
        elements.userError.setAttribute('aria-hidden', 'true');
    }
}

function removeUser (nickName, trElement) {
    settings.get(Storage.USERS)
        .then((newUsers) => {
            const usersAfterDeletion = newUsers.filter((item) => item.name !== nickName);

            return settings.set(Storage.USERS, usersAfterDeletion);
        })
        .then(() => {
            trElement.remove();
            renderBlockedUsers();
        });
}

function renderBlockedUsers () {
    settings.get(Storage.USERS)
        .then((users) => {
            while (elements.table.data.firstChild) {
                elements.table.data.removeChild(elements.table.data.firstChild);
            }

            if (users.length === 0) {
                elements.table.container.classList.add('hidden');
                elements.table.empty.classList.remove('hidden');
            } else {
                elements.table.container.classList.remove('hidden');
                elements.table.empty.classList.add('hidden');
            }

            fillTable(users);
        });
}

function fillTable (users) {
    users.forEach((userItem) => {
        const clonedTemplate = document.importNode(elements.table.template, true);

        const templateElements = {
            name: clonedTemplate.content.querySelector('#table-user-name'),
            date: clonedTemplate.content.querySelector('#table-user-date'),
            remove: clonedTemplate.content.querySelector('#table-user-remove'),
            parent: clonedTemplate.content.querySelector('#table-user-parent')
        };

        Object.keys(templateElements).forEach((elementId) => {
            templateElements[elementId].removeAttribute('id');
        });

        templateElements.name.appendChild(new Text(userItem.name));
        templateElements.date.appendChild(new Text(userItem.createdAt));

        templateElements.remove.addEventListener('click', () => {
            templateElements.remove.disabled = true;

            removeUser(userItem.name, templateElements.parent);
        });

        elements.table.data.appendChild(clonedTemplate.content);
    });
}
