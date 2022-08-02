import { serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from '../firebase.config';
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Resizer from "react-image-file-resizer";

function UploadTemplatePage() {

    const initialFormData =  {
        title: '',
        tags: [],
        imageFiles: [],
        psdFiles: [],
        gdriveLink: '',
        uploadTime: serverTimestamp()
    }
    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        try { 
            // Upload the images
            const resizedImages = await Promise.all([...formData.imageFiles].map(
                (image) => resizeFile(image)
            ));
            const convertedImages = await Promise.all(resizedImages.map(
                (image) => dataURIToBlob(image)
            ));
            const imageUrls = await Promise.all(
                convertedImages.map( (image) => uploadFile(image, 'images'))
            ).catch( () => {
                console.log('Images did not upload');
                return;
            }) 

            // Upload the images
            const psdUrl = formData.psdFiles.length > 0 ? await uploadFile(formData.psdFiles[0], 'psds').catch( () => {
                console.log('PSD did not upload');
                return;
            }) : '';

            // Set other required data
            const submitData = {
                ...formData,
                tags: formData.tags.split(",").map((tag) => (tag.trim().toLowerCase())),
                uploadedBy: auth.currentUser.uid,
                imageUrls,
                psdUrl
            }

            delete submitData.imageFiles;
            delete submitData.psdFiles;

            await addDoc(collection(db, "templates"), submitData);

            toast.success('Submission successful');
        } catch (error) {
            console.log(error);
            toast.error('Error submitting template');
        }

        setIsLoading(false);
        setFormData(initialFormData);
    }

    const dataURIToBlob = (dataURI) => {
        const splitDataURI = dataURI.split(",");
        const byteString =
        splitDataURI[0].indexOf("base64") >= 0
            ? atob(splitDataURI[1])
            : decodeURI(splitDataURI[1]);
        const mimeString = splitDataURI[0].split(":")[1].split(";")[0];
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new Blob([ia], { type: mimeString });
    };

    // Upload a sinfle file to the Firebase storage
    const uploadFile = async (file, type) => {
        return new Promise((resolve, reject) => {
            // Upload file and metadata to the object 'images/mountains.jpg'
            const storageRef = ref(storage, type + '/' + auth.currentUser.uid + '-' + uuidv4() + '-' +  file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                }, 
                (error) => {
                    reject(error) 
                }, 
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            )
        });
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

    const resizeFile = (file) => new Promise(resolve => {
        Resizer.imageFileResizer(file, 1280, 1280, 'JPEG', 60, 0,
        uri => {
        resolve(uri);
        }, 'base64' );
    });

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
                <input type="text" placeholder="Seperate each tag by comma" className="input input-bordered w-full" id='tags' onChange={onMutate} value={formData.tags} required/>
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
                            <span className="label-text" key={index}>{file.name}</span>
                        )
                    }
                )}
                

                <label className="label">
                    <span className="label-text">Upload Photohop file</span>
                </label>
                <div className="flex justify-center items-center w-full">
                    <label htmlFor="dropzone-file-psd" className="flex flex-col justify-center items-center w-full rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100">
                        <div className="flex flex-col justify-center items-center pt-5 pb-6">
                            <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PSD file</p>
                        </div>
                        <input id="dropzone-file-psd" type="file" className="hidden" onChange={onMutate}/>
                    </label>
                </div>
                {formData.psdFiles.length > 0 && <span className="label-text">{formData.psdFiles[0].name}</span>}

                <label className="label">
                    <span className="label-text">Google Drive URL</span>
                </label>
                <input type="text" placeholder="Paste URL here" className="input input-bordered w-full" id='gdrive' value={formData.gdriveLink} onChange={onMutate}/>

                {isLoading === false ? 
                    (
                        <button className="btn btn-primary btn-block mt-5" type="submit">Submit</button>
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