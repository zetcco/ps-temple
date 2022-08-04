import { createContext, useEffect, useState } from "react"
import { db } from "../../firebase.config";
import { collection, query, where, getDocs, orderBy, limit, startAfter, doc, getDoc, setDoc, increment, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const TemplatesContext = createContext();

export const TemplatesProvider = ({children}) => {

    const [ templates, setTemplates ] = useState([]);
    const [ isFetching, setIsFetching ] = useState(false);
    const [ allTags, setAllTags ] = useState({});

    const [ lastQuery, setLastQuery ] = useState();
    const [ lastFetched, setLastFetched ] = useState();
    const [ showPagination, setShowPagination ] = useState(false);

    useEffect(() => {
        if (templates.length === 0)
            setShowPagination(false);
    }, [templates])

    const getTemplates = async (key, condition, value) => {
        setIsFetching(true);
        try {
            const q = query(collection(db, "templates"), where(key, condition, value), orderBy('uploadTime', 'desc'), limit(10));
            const querySnapshot = await getDocs(q);

            setLastQuery({key,condition, value});

            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
            setLastFetched(lastVisible);

            const templates = [];
            querySnapshot.forEach( (doc) => {
                templates.push({
                    id: doc.id,
                    data: doc.data()
                })
            } )
            setTemplates(templates);
            setShowPagination(true);
        } catch (error) {
            toast.error(error);
        }
        setIsFetching(false);
    }

    const getMoreTemplates = async () => {
        setIsFetching(true);
        try {
            const q = query(collection(db, "templates"), where(lastQuery.key, lastQuery.condition, lastQuery.value), orderBy('uploadTime', 'desc'), startAfter(lastFetched), limit(10));
            const querySnapshot = await getDocs(q);

            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
            setLastFetched(lastVisible);

            const templates = [];
            querySnapshot.forEach( (doc) => {
                templates.push({
                    id: doc.id,
                    data: doc.data()
                })
            } )
            if (templates.length === 0) setShowPagination(false);
            setTemplates((prevState) => [...prevState, ...templates]);
        } catch (error) {
            toast.error(error);
        }
        setIsFetching(false);
    }

    const uploadTemplate = async (data) => {
        await addDoc(collection(db, "templates"), data);
    }

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
        <TemplatesContext.Provider value={{ templates, isFetching, setTemplates, getTemplates, getMoreTemplates, uploadTemplate, showPagination, allTags, getAllTags, updateAllTags }}>
            {children}
        </TemplatesContext.Provider>
    )
}

export default TemplatesContext;