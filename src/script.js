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
    // TODO: Most probably we would check only `addedNodes`.
    if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
        // Run once on 200ms.
        if (new Date() - lastCalledTime < 200) {
            return;
        }

        lastCalledTime = new Date();
        utils.getElementsToFilter().map((element) => engine.remove(element));
    }
});

documentObserver.observe(document, {childList: true, subtree: true});
