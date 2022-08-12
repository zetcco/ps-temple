export default function TemplatesReducer(state, action) {
    switch (action.type) {
        case 'GET_TEMPLATES':
            return {
                ...state,
                templates: action.payload
            }
        case 'GET_TEMPLATE':
            return {
                ...state,
                template: action.payload
            }
        case 'CLEAR_TEMPLATES':
            return {
                ...state,
                templates: []
            }
        case 'SET_LAST_FETCHED':
            return {
                ...state,
                lastFetched: action.payload
            }
        case 'SET_LAST_QUERY':
            return {
                ...state,
                lastQuery: action.payload
            }
        case 'SET_LOADING':
            return {
                ...state,
                isFetching: action.payload
            }
        case 'SET_PAGINATION':
            return {
                ...state,
                showPagination: action.payload
            }
        default:
            console.log('Template reducer default action launched');
    }
}