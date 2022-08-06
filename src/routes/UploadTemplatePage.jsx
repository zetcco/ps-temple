import { Timestamp } from "firebase/firestore";
import { useContext, useState } from "react";
import TemplatesContext from "../context/templates/TemplatesContext";
import Tag from "../components/Tag";

function UploadTemplatePage() {

    const initialFormData =  {
        title: '',
        tags: [],
        imageFiles: [],
        gdriveLink: '',
        uploadTime: Timestamp.fromDate(new Date())
    }
    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(false);

    const { uploadTemplate, allTags, getAllTags, isFetching, uploadProgress } = useContext(TemplatesContext);

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await uploadTemplate(formData);
        setIsLoading(false);
        setFormData(initialFormData);
    }
    
    const onMutate = async (e) => {
        switch (e.target.id) { 
            case 'tags':
                setFormData({
                    ...formData,
                    tags: e.target.value
                })
                break;
            case 'title':
                setFormData({
                    ...formData,
                    title: e.target.value
                })
                break;
            case 'dropzone-file-image':
                console.log(
                )
                setFormData({
                    ...formData,
                    imageFiles: e.target.files
                });
                break;
            case 'dropzone-file-psd':
                setFormData({
                    ...formData,
                    psdFiles: e.target.files
                });
                break;
            case 'gdrive':
                setFormData({
                    ...formData,
                    gdriveLink: e.target.value
                });
                break;
            default:
                break;
        }
    }

    const getTags = async () => {
        await getAllTags();
    }

    const quickAddTag = (value) => {
        setFormData({
            ...formData,
            tags: (formData.tags.length !== 0 ? `${formData.tags}, ${value}` : value)
        })
    }

    return(
    <div className="mx-auto w-3/5">
        <form onSubmit={onSubmit}>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Enter Template Title</span>
                </label>
                <input type="text" placeholder="Type here" className="input input-bordered w-full" id='title' onChange={onMutate} value={formData.title} required/>
                <label className="label">
                    <span className="label-text">Enter Template tags</span>
                </label>
                <div className="flex">
                    <input type="text" placeholder="Seperate each tag by comma" className="input input-bordered w-full" id='tags' onChange={onMutate} value={formData.tags} required/>
                    <div className="dropdown ml-2">
                        <label tabIndex="0" className="btn btn-primary text-xl" onClick={getTags}>+</label>
                        <div tabIndex="0" className="dropdown-content p-2 shadow bg-base-100 rounded-box w-80 h-40 overflow-auto">
                            {isFetching ? <p>Loading tags..</p> : Object.keys(allTags).map((tag, index) => {
                                return (<Tag value={tag} key={index} className={"m-1"} onClick={() => quickAddTag(tag)}/>)
                            } )}
                        </div>
                    </div>
                </div>
                <label className="label">
                    <span className="label-text">Upload images</span>
                </label>
                <div className="flex justify-center items-center w-full">
                    <label htmlFor="dropzone-file-image" className="flex flex-col justify-center items-center w-full rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100">
                        <div className="flex flex-col justify-center items-center pt-5 pb-6">
                            <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file-image" type="file" className="hidden" onChange={onMutate} multiple required/>
                    </label>
                </div>
                {formData.imageFiles.length > 0 && [...formData.imageFiles].map(
                    (file, index) => {
                        return (
                            <div className="flex space-x-4 items-center" key={index}>
                                <span className="label-text">{file.name}</span>
                                <progress className="progress progress-primary inline-flex align-middle" value={uploadProgress} max="100"></progress>
                            </div>
                        )
                    }
                )}
                
                <label className="label">
                    <span className="label-text">Google Drive URL</span>
                </label>
                <input type="text" placeholder="Paste URL here" className="input input-bordered w-full" id='gdrive' value={formData.gdriveLink} onChange={onMutate}/>
                {isLoading === false ? 
                    (
                        <button className="btn btn-primary btn-block mt-5" type="submit" disabled={
                            formData.title === '' ||
                            formData.tags === '' ||
                            formData.imageFiles.length === 0 ||
                            formData.gdriveLink === ''
                        }>Submit</button>
                    ) : (
                        <button className="btn loading mt-5">Submitting</button>
                    )
                }
            </div>
        </form>
    </div>

    );
}

export default UploadTemplatePage;