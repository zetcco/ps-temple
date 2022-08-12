import Tag from "../Tag";
import { useState, useContext } from "react";
import TemplatesContext from "../../context/templates/TemplatesContext";
import { fetchTemplates, templates_per_page } from "../../context/templates/TemplatesActions";

function SearchByTags() {

    const [searchTags, setSearchTags] = useState([]);

    const { dispatch } = useContext(TemplatesContext);

    const onKeyUp = (e) => {
        if (e.key === ',') {
            setSearchTags([ ...searchTags, e.target.value.slice(0, -1).trim().toLowerCase()]);
            e.target.value = '';
        }
    }

    const onClose = (index) => {
        setSearchTags(searchTags.filter((val, i) =>  {
            return index !== i;
        }));
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        dispatch({ type: 'SET_LOADING', payload: true });

        const query = {field:"tags", condition:"array-contains-any", value:searchTags};
        dispatch({ type: 'SET_LAST_QUERY', payload: query });

        const { templates, lastFetched } = await fetchTemplates(query);

        dispatch({ type: 'SET_LAST_FETCHED', payload: lastFetched });

        if (templates.length >= templates_per_page) {
            dispatch({ type: 'SET_PAGINATION', payload: true });
        }
        dispatch({ 
            type: 'GET_TEMPLATES',
            payload: templates
        });

        dispatch({ type: 'SET_LOADING', payload: false });
    }

    //const quickTagSearch = (value) => {
        //getTemplates("tags", "array-contains-any", [value]);
    //}

    return(
    <div>
        <div className="grid grid-cols-4">
            <div className="xl:col-span-2 lg:col-span-3 md:col-span-3 col-span-3">
                {/*<div className="mb-2">
                    <Tag value={"test"} onClick={() => quickTagSearch("test")}/>
                </div> */}
                <form className="grid grid-cols-4" onSubmit={onSubmit}>   
                    <input type="text" id='test' placeholder="Seperate tags by commas" className="input rounded-r-none input-primary col-span-3" onKeyUp={onKeyUp}/>
                    <button className="btn btn-primary rounded-l-none" type="submit">Search</button>
                </form>
            </div>
        </div>
        <div className="card-actions pt-3">
            {searchTags.length !== 0 && searchTags.map((tag, i) => <Tag size="lg" type="primary" value={tag} onClose={onClose} key={i} tagid={i}/>)}
        </div>
    </div>
    )
}

export default SearchByTags;