import Tag from '../Tag';
import { Link } from 'react-router-dom';

function TemplateItem({ template }) {
    const imgPlaceholders = ["animals", "arch", "nature", "people", "tech", "grayscale", "sepia"]
    console.log();
    return (
    <Link to={`/template/${template.id}`}>
        <div className="card w-96 bg-base-100 shadow-xl" key={template.id}>
            <figure><img src={ `https://placeimg.com/400/225/${imgPlaceholders[Math.floor(Math.random()*(imgPlaceholders.length - 1))]}` } alt="Shoes"/></figure>
            <div className="card-body">
                <h2 className="card-title">
                    {template.data.title}
                    <div className="badge badge-secondary">NEW</div>
                </h2>
                <p>{template.id}</p>
                <div className="card-actions ">
                {template.data.tags.map(
                    (item, index) => { return (
                        <Tag type="outline" size="xs" key={index} value={item}/>
                    )}
                )}
                </div>
            </div>
        </div>
    </Link>
    )
}

export default TemplateItem;