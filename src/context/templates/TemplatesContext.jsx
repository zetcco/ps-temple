import { createContext, useState } from "react"
import { db } from "../../firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";

const TemplatesContext = createContext();

export const TemplatesProvider = ({children}) => {

    const [ templates, setTemplates ] = useState([]);
    const [ isFetching, setIsFetching ] = useState(true);

    const getTemplates = async (key, condition, value) => {
        const q = query(collection(db, "templates"), where(key, condition, value));
        const querySnapshot = await getDocs(q);
        setIsFetching(false);

        const templates = [];
        querySnapshot.forEach( (doc) => {
            templates.push({
                id: doc.id,
                data: doc.data()
            })
        } )
        setTemplates(templates);
    }

    return (
        <TemplatesContext.Provider value={{ templates, isFetching, setTemplates, getTemplates }}>
            {children}
        </TemplatesContext.Provider>
    )
}

export default TemplatesContext;