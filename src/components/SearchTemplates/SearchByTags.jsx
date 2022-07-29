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
            <form onSubmit={onSubmit}>
                <input type='text' id='test' onKeyUp={onKeyUp}/>
                <button type='submit'>Search</button>
            </form>

            {searchTags.length !== 0 && searchTags.map((tag, i) => <Tag value={tag} onClose={onClose} key={i} tagid={i}/>)}
        </div>
    )
}

export default SearchByTags;