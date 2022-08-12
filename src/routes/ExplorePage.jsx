import { useContext, useEffect } from "react";
import SearchByTags from "../components/SearchTemplates/SearchByTags";
import TemplateResults from "../components/SearchTemplates/TemplateResults";
import TemplatesContext from "../context/templates/TemplatesContext";

function ExplorePage() {

    const { dispatch } = useContext(TemplatesContext);

    useEffect(() => {
        dispatch({ type: 'SET_PAGINATION', payload: false });
        dispatch({ type: 'CLEAR_TEMPLATES' });
    }, [dispatch]);

    return(
        <div className="my-10">
            <SearchByTags/>
            <TemplateResults/>
        </div>
    );
}

export default ExplorePage;