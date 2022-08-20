import { createContext, useReducer } from "react";
import TagsReducer from "./TagsReducer";

const TagsContext = createContext();

export const TagsProvider = ({children}) => {

    const init_state = {
        parentTags: [],
        fetchingParentTags: false,
        childTags: [],
        fetchingChildTags: true
    }

    const [state, tags_dispatcher] = useReducer(TagsReducer, init_state);

    return (
        <TagsContext.Provider value={{
                                tags_dispatcher,
                                parentTags: state.parentTags,
                                fetchingParentTags: state.fetchingParentTags,
                                childTags: state.childTags,
                                fetchingChildTags: state.fetchingChildTags
                            }}    
        > {children} </TagsContext.Provider>
    )
}

export default TagsContext;