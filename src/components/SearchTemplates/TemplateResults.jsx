import { useContext } from "react";
import TemplatesContext from "../../context/templates/TemplatesContext";
import TemplateItem from "./TemplateItem";

function TemplateResults() {

    const { templates } = useContext(TemplatesContext);

    return (
        <div className="xl:columns-4 lg:columns-3 md:columns-2 sm:columns-1 gap-0 mt-10">
            {(templates.length !== 0) ? (
                templates.map((template, index) => {
                    return (
                        <TemplateItem template={template} key={index}/>
                    )
                })
            ) : (
                <h3>
                    No listing
                </h3>
            )}
        </div>
    );
}

export default TemplateResults;