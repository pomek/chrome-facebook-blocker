const elements = {
    blockPersonForm: document.getElementById('block-new-user'),
    userGroup: document.getElementById('user-profile-group'),
    userInput: document.getElementById('user-profile'),
    userError: document.getElementById('user-profile-error'),
    helpInfoTitle: document.getElementById('user-profile-help-title'),
    helpInfo: document.getElementById('user-profile-help')
};

elements.helpInfoTitle.addEventListener('click', () => {
    elements.helpInfoTitle.classList.add('hidden');
    elements.helpInfo.classList.remove('hidden');
});

elements.blockPersonForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (!elements.userInput.value.trim()) {
        return setError(`User's profile cannot be empty.`);
    }
});

elements.userInput.addEventListener('input', () => {
    if (!elements.userError.classList.contains('hidden') && elements.userInput.value.trim()) {
        setError(null);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
});

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
