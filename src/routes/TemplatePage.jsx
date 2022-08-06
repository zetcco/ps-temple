import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/layout/Spinner/Spinner";
import Tag from "../components/Tag";
import TemplatesContext from "../context/templates/TemplatesContext";


function TemplatePage() {
    const { id } = useParams();
    const { template, getTemplate, isFetching } = useContext(TemplatesContext);

    useEffect(() => {
        getTemplate(id);
    }, []);

    if (template.length === 0 || isFetching) {
        return <Spinner/>
    } else {
        return(
            <div className="card lg:card-side bg-base-100 shadow-xl m-10">
                <div className="xl:w-1/2 lg:w-full md:w-full">
                    <img src={template.imageUrls[0]} alt="Album"/>
                </div>
                <div className="relative p-7">
                    <h2 className="card-title">{template.title}</h2>
                    <div className="card-actions w-1/2 space-x-2 mt-6">
                        { template.tags.map((tag) => <Tag value={tag}/>) }
                    </div>
                    <div className="absolute bottom-0 right-0 p-7">
                        <button className="btn btn-primary" onClick={() => window.open(template.gdriveLink, '_blank')}>Download</button>
                    </div>
                </div>
            </div> 
        );
    }
}

export default TemplatePage;