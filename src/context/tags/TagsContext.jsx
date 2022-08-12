import { createContext, useReducer } from "react";
import TagsReducer from "./TagsReducer";

const TagsContext = createContext();

export const TagsProvider = ({children}) => {

    const init_state = {
        allTags: [],
        isFetching: false
    }

    const [state, tags_dispatcher] = useReducer(TagsReducer, init_state);

    return (
        <TagsContext.Provider value={{
                                tags_dispatcher,
                                allTags: state.allTags,
                                isTagsFetching: state.isFetching
                            }}    
        > {children} </TagsContext.Provider>
    )
}

export default TagsContext;