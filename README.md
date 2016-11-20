# Chrome Facebook Blocker

[![Build Status](https://travis-ci.org/pomek/chrome-facebook-blocker.svg?branch=master)](https://travis-ci.org/pomek/chrome-facebook-blocker)
[![Test Coverage](https://codeclimate.com/github/pomek/chrome-facebook-blocker/badges/coverage.svg)](https://codeclimate.com/github/pomek/chrome-facebook-blocker/coverage)
[![Code Climate](https://codeclimate.com/github/pomek/chrome-facebook-blocker/badges/gpa.svg)](https://codeclimate.com/github/pomek/chrome-facebook-blocker)
[![Dependency Status](https://david-dm.org/pomek/chrome-facebook-blocker/status.svg)](https://david-dm.org/pomek/chrome-facebook-blocker#info=dependencies)
[![devDependency Status](https://david-dm.org/pomek/chrome-facebook-blocker/dev-status.svg)](https://david-dm.org/pomek/chrome-facebook-blocker#info=devDependencies)

## About the extension

This extension is still under heavy development and is not recommended to use it on your browser.

## Testing

In order to test this extension, follow instruction below:

1. Clone this repository.
2. Install required dependencies (`npm install`).
3. Insert profiles which should be blocked (`./src/utils.js`).
4. Compile the extension (`node_modules/.bin/gulp compile`).
5. [Install the extension in Chrome.](https://developer.chrome.com/extensions/getstarted#unpacked)

If you have any idea how to improve this extension, please leave a ticket.

## Development

* `gulp compile` - compiles the whole script into executable file,
* `gulp test` - runs the tests,
* `gulp lint` - run the linter (need to be improved).
