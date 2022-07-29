import { useContext } from "react";
import TemplatesContext from "../../context/templates/TemplatesContext";
import TemplateItem from "./TemplateItem";

function TemplateResults() {

    const { templates } = useContext(TemplatesContext);

    return (
        <div>
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