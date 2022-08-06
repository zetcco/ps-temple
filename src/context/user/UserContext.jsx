import { createContext, useState } from "react";
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../../firebase.config";

const UserContext = createContext();

export const UserProvider = ({children}) => {

    const [userData, setUserData] = useState();

    const getUser = async (id) => {
        try {
            const docRef = doc(db, "users", id);
            const docSnap = await getDoc(docRef);
            setUserData(docSnap.data())
        } catch (error) {
            //console.log(error);
        }
    } 

    return (
        <UserContext.Provider value={{ userData, getUser }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;