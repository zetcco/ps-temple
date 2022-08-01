import { useContext, useEffect } from "react";
import SearchByTags from "../components/SearchTemplates/SearchByTags";
import TemplateResults from "../components/SearchTemplates/TemplateResults";
import TemplatesContext from "../context/templates/TemplatesContext";

function ExplorePage() {

    const { setTemplates } = useContext(TemplatesContext);

    useEffect(() => {
        setTemplates([]);
    }, [setTemplates]);

    return(
        <div className="my-10">
            <SearchByTags/>
            <TemplateResults/>
        </div>
    );
}

export default ExplorePage;