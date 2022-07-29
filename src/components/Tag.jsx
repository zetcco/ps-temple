function Tag({ value, onClose, tagid }) {
    return (
        <div className="m-2 bg-slate-300 flex space-x-2">
            <p>{value}</p>
            { onClose && <button onClick={() => onClose(tagid)}>close</button> }
        </div>
    );
}

export default Tag;