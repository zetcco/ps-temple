import Resizer from "react-image-file-resizer";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { auth, storage } from "../../firebase.config";

// Upload a sinfle file to the Firebase storage
export const uploadFile = async (file, type, progressCallback) => {
    const resizedImageData = await resizeFile(file);
    const resizedImage = await dataURIToBlob(resizedImageData);

    return new Promise((resolve, reject) => {
        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, type + '/' + auth.currentUser.uid + '-' + uuidv4() + '-' +  resizedImage.name);
        const uploadTask = uploadBytesResumable(storageRef, resizedImage);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressCallback(progress);
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

// Resize the file
const resizeFile = (file) => new Promise(resolve => {
    Resizer.imageFileResizer(file, 1280, 1280, 'JPEG', 60, 0,
    uri => {
    resolve(uri);
    }, 'base64' );
});

// Convert data uri into blob data (image data into image)
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
