import { createContext, useState, useContext, useEffect } from "react";
import AuthContext from "../authentication/AuthProvider";
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../../firebase.config";

const UserContext = createContext();

export const UserProvider = ({children}) => {

    const [userData, setUserData] = useState();
    const { authenticatedUser } = useContext(AuthContext);

    useEffect(() => {
        ( async () => {
            try {
                const docRef = doc(db, "users", authenticatedUser.uid);
                const docSnap = await getDoc(docRef);
                console.log(docSnap.data());
            } catch (error) {
            }
        })()
    }, [authenticatedUser]);
    

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;