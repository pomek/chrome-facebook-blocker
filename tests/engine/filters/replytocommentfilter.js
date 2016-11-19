/* global describe, it, beforeEach, afterEach, expect */

import ReplyToCommentFilter from '../../../src/engine/filters/replytocommentfilter';

let replyForCommentFb = `
<div id="ignore-person-reply-block" class="UFIRow _48ph _4204 UFIComment _4oep" role="article" aria-label="Reply to Comment" data-ft="">
    <div class="_3b-9" id="control-element">
        <div>
            <div spacing="medium" direction="left" class="clearfix">
                <div class="_ohe lfloat">
                    <a id="ignore-person-avatar-link" data-ft="" data-hovercard="" href="" class="img _8o _8s UFIImageBlockImage" tabindex="-1" aria-hidden="true">
                        <img alt="" class="img UFIActorImage _54ru img" src="">
                    </a>
                </div>
                <div class="">
                    <div class="UFIImageBlockContent _42ef clearfix" direction="right">
                        <!-- The <a> below is not part of the Facebook code. 
                            Test requires additional elements in order to verify whether to work proper. -->
                        <a id="invalid-link-2" href="">Invalid link.</a>
                        <div class="_ohf rfloat">
                            <button class="UFICommentCloseButtonFake _50zy _50-0 _50z- _5upp _42ft" tabindex="-1" type="button" title="Delete">
                                <!-- react-text: 178 -->Delete
                                <!-- /react-text -->
                            </button>
                        </div>
                        <div class="">
                            <div class="UFICommentContentBlock">
                                <div class="UFICommentContent">
                                    <span>
                                        <a id="ignore-person-link" data-ft="" class=" UFICommentActorName" data-hovercard="" dir="ltr" href="">
                                            <!-- react-text: 184 -->Some name.
                                            <!-- /react-text -->
                                        </a>
                                    </span>
                                    <span>
                                        <span>
                                            <!-- The <a> below is not part of the Facebook code. 
                                                Test requires additional elements in order to verify whether to work proper. -->
                                            <a id="invalid-link-1" href="">Invalid link.</a>
                                            <!-- react-text: 187 -->
                                            <!-- /react-text -->
                                            <span data-ft="">
                                                <span class="UFICommentBody">
                                                    <span>
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis id ipsum nec faucibus. Nunc placerat, felis sit amet elementum lacinia, enim orci scelerisque ipsum, vitae dapibus turpis ipsum eget lectus. Aliquam sollicitudin nunc in massa tristique tincidunt ac et augue. Donec a finibus massa.
                                                    </span>
                                                </span>
                                            </span>
                                        </span>
                                    </span>
                                    <span></span>
                                </div>
                                <div class="fsm fwn fcg UFICommentActions">
                                    <a id="reply-like-link" class="UFILikeLink" data-ft="" data-testid="ufi_reply_like_link" href="#" role="button" title="Like it">
                                        Like it!
                                    </a>
                                    <span role="presentation" aria-hidden="true"> · </span>
                                    <a class="UFIReplyLink" href="#" role="button">
                                        Reply
                                    </a>
                                    <span role="presentation" aria-hidden="true"> · </span>
                                    <span>
                                        <a class="uiLinkSubtle" href="" data-ft="" data-testid="ufi_comment_timestamp">
                                            <abbr class="livetimestamp" title="Some day." data-utime="1479581319" data-shorten="true">13 hours</abbr>
                                        </a>
                                    </span>
                                </div>
                                <span>
                                    <a aria-label="Hide" class="UFICommentCloseButton _50zy _50-0 _50z- _5upp _42ft" data-testid="ufi_comment_close_button" data-hover="tooltip" data-tooltip-alignh="center" data-tooltip-content="Hide" href="#"></a>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

describe('Filters - ReplyToCommentFilter', () => {
    let filter, wholeBlock, linkElement, avatarElement, nestedInvalidLink, controlElement;

    beforeEach(() => {
        const divElement = document.createElement('div');
        divElement.innerHTML = replyForCommentFb;

        document.body.appendChild(divElement);

        wholeBlock = document.getElementById('ignore-person-reply-block');
        linkElement = document.getElementById('ignore-person-link');
        avatarElement = document.getElementById('ignore-person-avatar-link');
        controlElement = document.getElementById('control-element');
        filter = new ReplyToCommentFilter();
    });

    afterEach(() => {
        wholeBlock.parentElement.remove();
    });

    it('is initializable', () => {
        expect(filter).to.be.an.instanceof(ReplyToCommentFilter);
    });

    it('behaves as a filter', () => {
        expect(filter.getElements).to.be.a('function');
    });

    describe('getElements', () => {
        it('throws an error when given element is not an instance of HTMLAnchorElement', () => {
            expect(() => filter.getElements(wholeBlock)).to.throw(Error, 'Class is not an instance of HTMLAnchorElement. Given HTMLDivElement.');
        });

        it('returns an array with "reply for a comment" element', () => {
            const elements = filter.getElements(linkElement);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(1);
            expect(elements[0]).to.equal(wholeBlock);
        });

        it('returns an empty array when whole block is invalid', () => {
            document.getElementById('reply-like-link').setAttribute('data-testid', 'ufi_comment_like_link');

            const elements = filter.getElements(linkElement);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(0);
        });

        it('returns an empty array when "reply for the comment" element cannot be found (out of document)', () => {
            const elements = filter.getElements(avatarElement);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(0);
        });

        it('returns an empty array when "reply for the comment" element cannot be found (parentElement does not contain `data-ft` attribute)', () => {
            nestedInvalidLink = document.getElementById('invalid-link-1');

            const elements = filter.getElements(nestedInvalidLink);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(0);
        });

        it('returns an empty array when "reply for the comment" element cannot be found (parentElement does not contain class "UFIComment")', () => {
            nestedInvalidLink = document.getElementById('invalid-link-1');
            controlElement.classList.add('UFIRow');
            controlElement.setAttribute('data-ft', 'test');

            const elements = filter.getElements(nestedInvalidLink);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(0);
        });

        it('returns an empty array when "reply for the comment" element cannot be found (parentElement does not contain class "UFIRow")', () => {
            nestedInvalidLink = document.getElementById('invalid-link-1');
            controlElement.classList.add('UFIComment');
            controlElement.setAttribute('data-ft', 'test');

            const elements = filter.getElements(nestedInvalidLink);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(0);
        });

        it('returns an empty array when "reply for the comment" element cannot be found (parentElement is null)', () => {
            nestedInvalidLink = document.getElementById('invalid-link-2');

            const elements = filter.getElements(nestedInvalidLink);

            expect(elements).to.be.a('array');
            expect(elements.length).to.equal(0);
        });
    });
});
