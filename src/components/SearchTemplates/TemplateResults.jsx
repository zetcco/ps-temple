import { useContext } from "react";
import TemplatesContext from "../../context/templates/TemplatesContext";
import Spinner from "../layout/Spinner/Spinner";
import TemplateItem from "./TemplateItem";

function TemplateResults() {

    const { templates, isFetching, getMoreTemplates, showPagination } = useContext(TemplatesContext);

    if (isFetching && templates.length === 0) {
        return (<Spinner/>)
    } else {
        return (
        <div className="container">
            <div className="xl:columns-4 lg:columns-3 md:columns-2 sm:columns-1 gap-0 mt-10">
                {templates.map((template, index) => {
                        return (
                            <TemplateItem template={template} key={index}/>
                        )
                    })
                }
            </div>
            {isFetching && <div className="pt-10"><Spinner/></div>}
            { showPagination && (<div className="flex pt-10">
                <p className="btn btn-primary mx-auto" onClick={getMoreTemplates}>Load more</p>
            </div>) }
        </div>
        );
    }
}

export default TemplateResults;