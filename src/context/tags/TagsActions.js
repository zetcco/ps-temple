import { db } from "../../firebase.config";
import { collection, increment, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

// Get all the parent tags
export const getParentTags = async () => {
    const collRef = collection(db, "tags");
    const collSnap = await getDocs(collRef);
    return collSnap;
}

// Set new tags to the 'tags' collection if there are any
export const updateAllTags = async (parentTag, childTags) => {
    const docRef = doc(db, "tags", parentTag);
    setDoc(docRef, {tags: [...new Set(childTags)], usage: increment(0)}, { merge: true }); // Set the above created object, merge with the existing values
}

// Get sub tags of a specified parent tag
export const getChildTags = async (parent_tag) => {
    const docRef = doc(db, "tags", parent_tag);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}