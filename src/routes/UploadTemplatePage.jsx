import { Timestamp } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import Tag from "../components/Tag";
import { uploadTemplate } from '../context/templates/TemplatesActions';
import { toast } from "react-toastify";
import TagsContext from "../context/tags/TagsContext";
import { getChildTags, getParentTags, updateAllTags } from '../context/tags/TagsActions';

function UploadTemplatePage() {

    const initialFormData =  {
        title: '',
        parentTag: '',
        newParentTag: '',
        tags: [],
        imageFiles: [],
        gdriveLink: '',
        uploadTime: Timestamp.fromDate(new Date())
    }
    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [ uploadProgress, setUploadProgress ] = useState(0);

    const { parentTags,  fetchingParentTags, childTags, fetchingChildTags, tags_dispatcher } = useContext(TagsContext);

    useEffect(() => {
        setParentTags(tags_dispatcher);
    }, [tags_dispatcher])

    useEffect(() => {
        setFormData(prevState => {
            return {...prevState, parentTag: ''}
        });
    }, [formData.newParentTag]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {    
            const tags = formData.tags.split(",").map((tag) => (tag.trim().toLowerCase())).filter((item) => {
                return item !== ""
            });

            await uploadTemplate(formData, setUploadProgress); // second argument is a callback function to set the progression of the upload

            // Set new tags (if there are any) to all tags collection
            await updateAllTags((formData.newParentTag !== '' ? formData.newParentTag : formData.parentTag).toLowerCase(), tags); // Either one of parentTag or newParentTag would be a empty string.

            toast.success('Submission successfull');
        } catch (error) {
            console.log(error);
            toast.error('Error when uploading template');
        }
        setIsLoading(false);
        setFormData(initialFormData);
        setParentTags(tags_dispatcher);
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
            case 'parentTag':
                setFormData({
                    ...formData,
                    parentTag: e.target.value
                })

                tags_dispatcher({ type: 'SET_LOADING_CHILD_TAGS', payload: true });
                try {
                    const tags = await getChildTags(e.target.value);
                    tags_dispatcher( { type: 'SET_CHILD_TAGS', payload: tags });
                } catch (error) {
                    toast.error('Error fetching child tags');
                    console.log(error);
                }
                tags_dispatcher({ type: 'SET_LOADING_CHILD_TAGS', payload: false });
                break;
            case 'parentTagType':
                setFormData({
                    ...formData,
                    newParentTag: e.target.value
                })
                break;
            default:
                break;
        }
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
                    <span className="label-text">Enter Parent Tag</span>
                </label>
                <div className="flex">
                    <select id='parentTag' className="select select-primary w-1/5 mr-2" onChange={onMutate} value={formData.parentTag === '' ? "default" : formData.parentTag} disabled={formData.newParentTag !== ''}>
                        <option value={"default"} disabled>Select Parent Tag</option>
                        {fetchingParentTags ? <option>Loading tags..</option> : parentTags.map((tag, index) => {
                            return (<option key={index}>{tag.id}</option>)
                        } )}
                    </select>
                    <input type="text" placeholder="Or type a new one" className="input input-bordered w-full" id='parentTagType' onChange={onMutate} value={formData.newParentTag}/>
                </div>
                <label className="label">
                    <span className="label-text">Enter Template tags</span>
                </label>
                <div className="flex">
                    <div className="dropdown mx-2">
                        <label tabIndex="0" className={`btn btn-primary text-xl ${(formData.parentTag === '') && 'btn-disabled'}`}>+</label>
                        <div tabIndex="0" className="dropdown-content p-2 shadow bg-base-100 rounded-box w-80 h-40 overflow-auto">
                            {fetchingChildTags ? <p>Loading tags..</p> : childTags.tags.map((tag, index) => {
                                return (<Tag value={tag} key={index} className={"m-1"} onClick={() => quickAddTag(tag)}/>)
                            } )}
                        </div>
                    </div>
                    <input type="text" placeholder="Seperate each tag by comma" className="input input-bordered w-full" id='tags' onChange={onMutate} value={formData.tags} required/>
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

const setParentTags = async (dispatcher) => {
    dispatcher({ type: 'SET_LOADING_PARENT_TAGS', payload: true });
    try {
        const tags = await getParentTags();
        dispatcher( { type: 'SET_PARENT_TAGS', payload: tags.docs });
    } catch (error) {
        toast.error('Error fetching parent tags');
        console.log(error);
    }
    dispatcher({ type: 'SET_LOADING_PARENT_TAGS', payload: false });
}

export default UploadTemplatePage;