import { serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from '../firebase.config';
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../firebase.config';

function UploadTemplatePage() {

    const [formData, setFormData] = useState({
        title: '',
        tags: [],
        uploadTime: serverTimestamp()
    });

    const onSubmit = async (e) => {
        e.preventDefault();

        // Upload the images
        const imageUrls = await Promise.all(
            [...formData.imageFiles].map( (image) => uploadFile(image))
        ).catch( () => {
            console.log('Images did not upload');
            return;
        }) 

        // Set other required data
        const submitData = {
            ...formData,
            uploadedBy: auth.currentUser.uid,
            imageUrls
        }

        delete submitData.imageFiles;

        await addDoc(collection(db, "templates"), submitData);
    }

    // Upload a sinfle file to the Firebase storage
    const uploadFile = async (file) => {
        return new Promise((resolve, reject) => {
            // Upload file and metadata to the object 'images/mountains.jpg'
            const storageRef = ref(storage, 'images/' + auth.currentUser.uid + '-' + uuidv4() + '-' +  file.name);
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
                    tags: e.target.value.split(",")
                })
                break;
            case 'title':
                setFormData({
                    ...formData,
                    title: e.target.value
                })
                break;
            case 'images':
                setFormData({
                    ...formData,
                    imageFiles: e.target.files
                });
                break;
            default:
                break;
        }
    }

    return(
        <div>
            <form onSubmit={onSubmit}>
                <input type='text' id='title' placeholder="Title" onChange={onMutate} required/>
                <input type='text' id='tags' placeholder="tags" onChange={onMutate} required/>
                <input type='file' id='images' onChange={onMutate} multiple required/>
                <button type='submit'>Upload Template</button>
            </form>
        </div>
    );
}

export default UploadTemplatePage;