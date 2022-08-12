import { useContext, useEffect } from "react";
import TemplateResults from "../components/SearchTemplates/TemplateResults";
import TemplatesContext from "../context/templates/TemplatesContext";
import { auth } from "../firebase.config";
import { fetchTemplates, templates_per_page } from "../context/templates/TemplatesActions";

function MyUploads() {

    const { dispatch } = useContext(TemplatesContext);

    useEffect(() => {
        //getTemplates("uploadedBy", "==", auth.currentUser.uid);
        ( async () => {
            dispatch({ type: 'SET_LOADING', payload: true });

            const query = {field:"uploadedBy", condition:"==", value:auth.currentUser.uid};
            dispatch({ type: 'SET_LAST_QUERY', payload: query });

            const { templates, lastFetched } = await fetchTemplates(query);

            dispatch({ type: 'SET_LAST_FETCHED', payload: lastFetched });

            if (templates.length >= templates_per_page) {
                dispatch({ type: 'SET_PAGINATION', payload: true });
            }
            dispatch({ 
                type: 'GET_TEMPLATES',
                payload: templates
            });

            dispatch({ type: 'SET_LOADING', payload: false });
        })()
    }, [dispatch])

    return(
        <TemplateResults/>
    );
}

export default MyUploads;