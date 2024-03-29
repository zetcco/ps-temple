import { collection, query, where, getDocs, deleteDoc, orderBy, limit, startAfter, doc, getDoc, addDoc } from "firebase/firestore";
import { db, auth } from "../../firebase.config";
import { uploadFile } from "./ImageFileHandling";

// Number of teamplates that should be displayed per page
export const templates_per_page = 10;

export const fetchTemplates = async ({field, condition, value}) => {
    const q = query(collection(db, "templates"), where(field, condition, value), orderBy('uploadTime', 'desc'), limit(templates_per_page));
    const querySnapshot = await getDocs(q);

    const lastFetched = querySnapshot.docs[querySnapshot.docs.length - 1];

    const templates = [];
    querySnapshot.forEach( (doc) => {
        templates.push({
            id: doc.id,
            data: doc.data()
        })
    } )

    return { templates, lastFetched };
}

export const fetchMoreTemplates = async (lastQuery, lastFetched) => {
    const q = query(collection(db, "templates"), where(lastQuery.field, lastQuery.condition, lastQuery.value), orderBy('uploadTime', 'desc'), startAfter(lastFetched), limit(templates_per_page));
    const querySnapshot = await getDocs(q);

    const new_lastFetched = querySnapshot.docs[querySnapshot.docs.length - 1];

    const new_templates = [];
    querySnapshot.forEach( (doc) => {
        new_templates.push({
            id: doc.id,
            data: doc.data()
        })
    } )

    return { new_templates, new_lastFetched };
}

export const fetchTemplate = async (id) => {
    const docRef = doc(db, "templates", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

export const uploadTemplate = async (formData, progressCallback) => {
    // Upload the images
    const imageUrls = await Promise.all(
        Array.from(formData.imageFiles).map( (image) => {
            return uploadFile(image, 'images', progressCallback);
        })
    )
    
    // Add tags
    const tags = formData.tags.split(",").map((tag) => (tag.trim().toLowerCase())).filter((item) => {
        return item !== ""
    });

    // Add tags using the file name
    tags.push(...formData.imageFiles[0].name.split(".")[0].split(" "));

    // Determine between new parent tag or not
    if (formData.newParentTag === '') {
        formData = {...formData, tags: tags.push(formData.parentTag)}
        delete formData.parentTag;
    } else {
        formData = {...formData, tags: tags.push(formData.newParentTag)}
        delete formData.newParentTag;
    }

    // Set other required data
    const submitData = {
        ...formData,
        uploadedBy: auth.currentUser.uid,
        tags: [...new Set(tags)],
        imageUrls
    }

    delete submitData.imageFiles;
    delete submitData.psdFiles;
    delete submitData.parentTag;

    await addDoc(collection(db, "templates"), submitData);

    progressCallback(0);

    return true
}

export const deleteTemplate = async (templateID) => {
    await deleteDoc(doc(db, "templates", templateID));
}