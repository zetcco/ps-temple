import { createContext, useEffect, useState } from "react"
import { db, auth, storage } from "../../firebase.config";
import { collection, query, where, getDocs, orderBy, limit, startAfter, doc, getDoc, setDoc, increment, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import Resizer from "react-image-file-resizer";

const TemplatesContext = createContext();

export const TemplatesProvider = ({children}) => {

    const [ templates, setTemplates ] = useState([]);
    const [ isFetching, setIsFetching ] = useState(false);
    const [ allTags, setAllTags ] = useState({});

    const [ lastQuery, setLastQuery ] = useState();
    const [ lastFetched, setLastFetched ] = useState();
    const [ showPagination, setShowPagination ] = useState(false);
    const [ uploadProgress, setUploadProgress ] = useState(0);

    useEffect(() => {
        if (templates.length === 0)
            setShowPagination(false);
    }, [templates])

    const getTemplates = async (key, condition, value) => {
        setIsFetching(true);
        try {
            const q = query(collection(db, "templates"), where(key, condition, value), orderBy('uploadTime', 'desc'), limit(10));
            const querySnapshot = await getDocs(q);

            setLastQuery({key,condition, value});

            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
            setLastFetched(lastVisible);

            const templates = [];
            querySnapshot.forEach( (doc) => {
                templates.push({
                    id: doc.id,
                    data: doc.data()
                })
            } )
            setTemplates(templates);
            setShowPagination(true);
        } catch (error) {
            toast.error(error);
        }
        setIsFetching(false);
    }

    const getMoreTemplates = async () => {
        setIsFetching(true);
        try {
            const q = query(collection(db, "templates"), where(lastQuery.key, lastQuery.condition, lastQuery.value), orderBy('uploadTime', 'desc'), startAfter(lastFetched), limit(10));
            const querySnapshot = await getDocs(q);

            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
            setLastFetched(lastVisible);

            const templates = [];
            querySnapshot.forEach( (doc) => {
                templates.push({
                    id: doc.id,
                    data: doc.data()
                })
            } )
            if (templates.length === 0) setShowPagination(false);
            setTemplates((prevState) => [...prevState, ...templates]);
        } catch (error) {
            toast.error(error);
        }
        setIsFetching(false);
    }

    const uploadTemplate = async (formData) => {
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

            // Upload the psd files
            const psdUrl = formData.psdFiles.length > 0 ? await uploadFile(formData.psdFiles[0], 'psds').catch( () => {
                console.log('PSD did not upload');
                return;
            }) : '';

            const tags = formData.tags.split(",").map((tag) => (tag.trim().toLowerCase()));

            // Set new tags (if there are any) to all tags collection
            await updateAllTags(tags);

            // Set other required data
            const submitData = {
                ...formData,
                tags,
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
                    setUploadProgress(progress);
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

    const getAllTags = async () => {
        try {
            setIsFetching(true);
            const docRef = doc(db, "tags", "tags");
            const docSnap = await getDoc(docRef);
            setAllTags(docSnap.data().tags);
            setIsFetching(false);
        } catch (error) {
            console.log(error);
        }
    }

    // Set new tags to the 'tags' collection if there are any
    const updateAllTags = async (allTags) => {
        try {
            const docRef = doc(db, "tags", "tags");
            const obj = {};
            allTags.forEach(element => {
                    obj[element] = increment(0)
                })
            setDoc(docRef, {tags: obj}, { merge: true }); // Set the above created object, merge with the existing values
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <TemplatesContext.Provider value={{ templates, isFetching, setTemplates, getTemplates, getMoreTemplates, uploadTemplate, showPagination, allTags, getAllTags, updateAllTags, uploadProgress }}>
            {children}
        </TemplatesContext.Provider>
    )
}

export default TemplatesContext;