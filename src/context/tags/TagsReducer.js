export default function TagsReducer(state, action) {
    switch (action.type) {
        case 'SET_ALL_TAGS':
            return {
                ...state,
                allTags: action.payload
            }
        case 'CLEAR_ALL_TAGS':
            return {
                ...state,
                allTags: []
            }
        case 'SET_LOADING':
            return {
                ...state,
                isFetching: action.payload
            }
        default:
            break;
    }
}