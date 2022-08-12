import { createContext, useReducer } from "react"
import TemplatesReducer from "./TemplatesReducer";

const TemplatesContext = createContext();

export const TemplatesProvider = ({children}) => {
    const init_state = {
        templates: [],
        template: {},
        isFetching: false,
        lastFetched: {},
        showPagination: false
    }

    const [state, dispatch] = useReducer(TemplatesReducer, init_state);

    return (
        <TemplatesContext.Provider value={{ 
                                            dispatch,                                
                                            templates: state.templates, 
                                            isFetching: state.isFetching, 
                                            lastFetched: state.lastFetched,
                                            lastQuery: state.lastQuery,
                                            template: state.template,
                                            showPagination: state.showPagination, }}>
            {children}
        </TemplatesContext.Provider>
    )
}

export default TemplatesContext;