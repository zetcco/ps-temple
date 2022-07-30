import { useContext } from "react";
import TemplatesContext from "../../context/templates/TemplatesContext";
import TemplateItem from "./TemplateItem";

function TemplateResults() {

    const { templates } = useContext(TemplatesContext);

    return (
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-24 pt-10">
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