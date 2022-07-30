function Tag({ value, onClose, type, size, tagid }) {
    return (
        <div className={ `badge badge-${type} badge-${size}` }>
            <p className="m-2">{value}</p>
            {onClose && 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current" onClick={() => onClose(tagid)}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg> 
            }
        </div>
    );
}

export default Tag;