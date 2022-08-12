import { db } from "../../firebase.config";
import { increment, doc, getDoc, setDoc } from "firebase/firestore";

export const getAllTags = async () => {
    const docRef = doc(db, "tags", "tags");
    const docSnap = await getDoc(docRef);
    return docSnap.data().tags;
}

// Set new tags to the 'tags' collection if there are any
export const updateAllTags = async (allTags) => {
    const docRef = doc(db, "tags", "tags");
    const obj = {};
    allTags.forEach(element => {
            obj[element] = increment(0)
        })
    setDoc(docRef, {tags: obj}, { merge: true }); // Set the above created object, merge with the existing values
}