import DeleteEngine from './engine/deletionengine';
import PostFilter from './engine/filters/postfilter';
import CommentFilter from './engine/filters/commentfilter';
import ReplyToCommentFilter from './engine/filters/replytocommentfilter';
import SharePostFilter from './engine/filters/sharepostfilter';
import utils from './utils';

const engine = new DeleteEngine();

engine.add(new PostFilter());
engine.add(new CommentFilter());
engine.add(new ReplyToCommentFilter());
engine.add(new SharePostFilter());

let lastCalledTime = new Date();

const documentObserver = new MutationObserver((mutations) => {
    const hasAddedNodes = mutations.some((itemMutation) => itemMutation.addedNodes.length);

    if (!hasAddedNodes) {
        return;
    }

    // Run once on 500ms.
    if (new Date() - lastCalledTime < 500) {
        return;
    }

    lastCalledTime = new Date();
    utils.getElementsToFilter()
        .then((elements) => {
            elements.map((item) => engine.remove(item))
        });
});

documentObserver.observe(document, {childList: true, subtree: true});
