export default function TagsReducer(state, action) {
    switch (action.type) {
        case 'SET_PARENT_TAGS':
            return {
                ...state,
                parentTags: action.payload
            }
        case 'CLEAR_PARENT_TAGS':
            return {
                ...state,
                parentTags: []
            }
        case 'SET_CHILD_TAGS':
            return {
                ...state,
                childTags: action.payload
            }
        case 'SET_LOADING_PARENT_TAGS':
            return {
                ...state,
                fetchingParentTags: action.payload
            }
        case 'SET_LOADING_CHILD_TAGS':
            return {
                ...state,
                fetchingChildTags: action.payload
            }
        default:
            break;
    }
}