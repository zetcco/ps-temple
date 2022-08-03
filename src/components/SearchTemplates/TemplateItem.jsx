import Tag from '../Tag';
import { Link } from 'react-router-dom';

function TemplateItem({ template }) {
    return (
        <div className="card bg-base-100 shadow-xl m-3" key={template.id}>
            <div className="absolute inset-0 z-10 bg-black text-center flex flex-col items-center justify-center opacity-0 hover:opacity-100 bg-opacity-70 duration-300">
                <div className='absolute bottom-0 right-0 p-4 space-x-1'>
                    <button className="text-white hover:text-rose-500"> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12,19.6l-7.3-7.3c-1.8-1.8-1.8-4.6,0-6.4c0.9-0.9,2-1.3,3.2-1.3s2.3,0.5,3.2,1.3L12,6.8l0.9-0.9c0.9-0.9,2-1.3,3.2-1.3
                                    c1.2,0,2.3,0.5,3.2,1.3c1.8,1.8,1.8,4.6,0,6.4L12,19.6z M7.9,5.5c-1,0-1.9,0.4-2.5,1C4,8,4,10.2,5.4,11.6l6.6,6.6l6.6-6.6
                                    c1.4-1.4,1.4-3.7,0-5.1c-1.3-1.3-3.7-1.3-5.1,0L12,8.2l-1.6-1.6C9.7,5.9,8.9,5.5,7.9,5.5z"/>
                        </svg>
                    </button>
                    <button className="text-white hover:text-primary" onClick={() => template.data.psdUrl === '' ? window.open(template.data.gdriveLink, '_blank') : window.open(template.data.psdUrl, '_blank')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <polygon points="16.5,14.5 12.4,18.5 12.4,4.5 11.6,4.5 11.6,18.5 7.5,14.5 7,15 12,20 17,15 "/>
                        </svg>
                    </button>
                </div>
            </div>
            <Link to={`/template/${template.id}`}>
                <figure>
                    <div className="flex flex-wrap content-center">
                        <img src={template.data.imageUrls[0]} alt="Shoes"/>
                    </div>
                </figure>
            </Link>
        </div>
    )
}

export default TemplateItem;