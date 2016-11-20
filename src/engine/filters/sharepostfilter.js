import PostFilter from './postfilter';

export default class SharePostFilter extends PostFilter {
    constructor () {
        super();
        
        this._deepLevel = 15;
    }
}
