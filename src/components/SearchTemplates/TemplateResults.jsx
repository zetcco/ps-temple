import { useContext } from "react";
import { fetchMoreTemplates, templates_per_page } from "../../context/templates/TemplatesActions";
import TemplatesContext from "../../context/templates/TemplatesContext";
import Spinner from "../layout/Spinner/Spinner";
import TemplateItem from "./TemplateItem";

function TemplateResults() {

    const { dispatch, templates, isFetching, showPagination, lastQuery, lastFetched } = useContext(TemplatesContext);

    const handlePagination = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        const { new_templates, new_lastFetched } = await fetchMoreTemplates(lastQuery, lastFetched);
        dispatch({ type: 'SET_LAST_FETCHED', payload: new_lastFetched});
        if (templates_per_page > new_templates.length || new_templates.length === 0) dispatch({ type: 'SET_PAGINATION', payload: false });
        dispatch({ type: 'GET_TEMPLATES', payload: [...templates, ...new_templates]});
        dispatch({ type: 'SET_LOADING', payload: false });
    }

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
                <p className="btn btn-primary mx-auto" onClick={handlePagination}>Load more</p>
            </div>) }
        </div>
        );
    }
}

export default TemplateResults;