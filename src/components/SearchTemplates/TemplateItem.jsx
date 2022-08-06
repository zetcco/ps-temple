import { Link } from 'react-router-dom';

function TemplateItem({ template }) {

    const openDownloadLink = (e) => {
        e.stopPropagation();
        template.data.psdUrl === '' ? window.open(template.data.gdriveLink, '_blank') : window.open(template.data.psdUrl, '_blank')
    }

    return (
        <div className="card bg-base-100 shadow-xl m-3" key={template.id}>
            <div className="absolute inset-0 z-10 bg-black text-center flex flex-col items-center justify-center opacity-0 hover:opacity-100 bg-opacity-70 duration-300">
                <Link to={`/template/${template.id}`} target="_blank">
                    <button className="absolute top-0 right-0 p-4 text-white hover:text-primary"> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M16.8,17.1c0,1.1-0.9,1.9-1.9,1.9H6.9C5.9,19,5,18.1,5,17.1V9.2c0-1.1,0.9-1.9,1.9-1.9h3.7v-1H6.9C5.3,6.2,4,7.5,4,9.2v7.9
                                C4,18.7,5.3,20,6.9,20h7.9c1.6,0,2.9-1.3,2.9-2.9v-3.7h-1V17.1z"/>
                            <polygon points="14.6,4 14.6,5 18.3,5 8.2,15.1 8.9,15.8 19,5.7 19,9.4 20,9.4 20,4 	"/>
                        </svg>
                    </button>
                </Link>
                <div className='absolute bottom-0 right-0 p-4 space-x-1'>
                    <button className="text-white hover:text-rose-500"> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12,19.6l-7.3-7.3c-1.8-1.8-1.8-4.6,0-6.4c0.9-0.9,2-1.3,3.2-1.3s2.3,0.5,3.2,1.3L12,6.8l0.9-0.9c0.9-0.9,2-1.3,3.2-1.3
                                    c1.2,0,2.3,0.5,3.2,1.3c1.8,1.8,1.8,4.6,0,6.4L12,19.6z M7.9,5.5c-1,0-1.9,0.4-2.5,1C4,8,4,10.2,5.4,11.6l6.6,6.6l6.6-6.6
                                    c1.4-1.4,1.4-3.7,0-5.1c-1.3-1.3-3.7-1.3-5.1,0L12,8.2l-1.6-1.6C9.7,5.9,8.9,5.5,7.9,5.5z"/>
                        </svg>
                    </button>
                    <button className="text-white hover:text-primary" onClick={openDownloadLink}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <polygon points="16.5,14.5 12.4,18.5 12.4,4.5 11.6,4.5 11.6,18.5 7.5,14.5 7,15 12,20 17,15 "/>
                        </svg>
                    </button>
                </div>
            </div>
            <figure>
                <div className="flex flex-wrap content-center">
                    <img src={template.data.imageUrls[0]} alt="Shoes"/>
                </div>
            </figure>
        </div>
    )
}

export default TemplateItem;