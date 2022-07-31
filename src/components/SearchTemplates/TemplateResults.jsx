import { useContext } from "react";
import TemplatesContext from "../../context/templates/TemplatesContext";
import TemplateItem from "./TemplateItem";

function TemplateResults() {

    const { templates, isFetching } = useContext(TemplatesContext);

    if (isFetching) {
        return (<div>Loading...</div>)
    } else {
        return (
            <div className="xl:columns-4 lg:columns-3 md:columns-2 sm:columns-1 gap-0 mt-10">
                {templates.map((template, index) => {
                        return (
                            <TemplateItem template={template} key={index}/>
                        )
                    })
                }
            </div>
        );
    }
}

export default TemplateResults;