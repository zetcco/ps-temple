import Tag from "../Tag";
import { useState, useContext } from "react";
import TemplatesContext from "../../context/templates/TemplatesContext";

function SearchByTags() {

    const [searchTags, setSearchTags] = useState([]);

    const { getTemplates } = useContext(TemplatesContext);

    const onKeyUp = (e) => {
        if (e.key === ',') {
            setSearchTags([ ...searchTags, e.target.value.slice(0, -1)]);
            e.target.value = '';
        }
    }

    const onClose = (index) => {
        setSearchTags(searchTags.filter((val, i) =>  {
            return index !== i;
        }));
    }

    const onSubmit = (e) => {
        e.preventDefault();
        getTemplates("tags", "array-contains-any", searchTags);
    }
    return(
    <div>
        <div className="grid grid-cols-4">
            <div className="xl:col-span-2 lg:col-span-3 md:col-span-3 col-span-3">
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