import { createContext, useReducer, useState } from "react"
import { db } from "../../firebase.config";
import { doc, getDoc, setDoc, increment,  } from "firebase/firestore";
import TemplatesReducer from "./TemplatesReducer";

const TemplatesContext = createContext();

export const TemplatesProvider = ({children}) => {

    const [ isFetching, setIsFetching ] = useState(false);
    const [ allTags, setAllTags ] = useState({});

    const init_state = {
        templates: [],
        template: {},
        isFetching: false,
        lastFetched: {},
        showPagination: false
    }

    const [state, dispatch] = useReducer(TemplatesReducer, init_state);


    const getAllTags = async () => {
        try {
            setIsFetching(true);
            const docRef = doc(db, "tags", "tags");
            const docSnap = await getDoc(docRef);
            setAllTags(docSnap.data().tags);
            setIsFetching(false);
        } catch (error) {
            console.log(error);
        }
    }

    // Set new tags to the 'tags' collection if there are any
    const updateAllTags = async (allTags) => {
        try {
            const docRef = doc(db, "tags", "tags");
            const obj = {};
            allTags.forEach(element => {
                    obj[element] = increment(0)
                })
            setDoc(docRef, {tags: obj}, { merge: true }); // Set the above created object, merge with the existing values
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <TemplatesContext.Provider value={{ 
                                            dispatch,                                
                                            templates: state.templates, 
                                            isFetching: state.isFetching, 
                                            lastFetched: state.lastFetched,
                                            lastQuery: state.lastQuery,
                                            template: state.template,
                                            showPagination: state.showPagination, 
                                            allTags, 
                                            getAllTags, 
                                            updateAllTags }}>
            {children}
        </TemplatesContext.Provider>
    )
}

export default TemplatesContext;