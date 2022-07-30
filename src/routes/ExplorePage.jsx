import SearchByTags from "../components/SearchTemplates/SearchByTags";
import TemplateResults from "../components/SearchTemplates/TemplateResults";

function ExplorePage() {

    return(
        <div className="my-10">
            <SearchByTags/>
            <TemplateResults/>
        </div>
    );
}

export default ExplorePage;