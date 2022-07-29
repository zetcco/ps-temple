import { useContext } from "react";
import SearchByTags from "../components/SearchTemplates/SearchByTags";
import TemplateResults from "../components/SearchTemplates/TemplateResults";

function ExplorePage() {

    return(
        <div>
            <SearchByTags/>
            <TemplateResults/>
        </div>
    );
}

export default ExplorePage;