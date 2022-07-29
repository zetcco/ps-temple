import { createContext, useEffect, useState } from "react";
import { auth } from "../../firebase.config";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [ authenticatedUser, setAuthenticatedUser ] = useState(null);     // Will hold the info about the currently logged in user
    const [ checkingStatus, setCheckingStatus ] = useState(true);           // Indicator to know if 'Auth' is still getting data

    const signin = async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
        setCheckingStatus(false);
    }

    useEffect(() => {
        // Add a listener to the Auth. (So that this fires when logged in/out state changes)
        const unsubscribeFunc = onAuthStateChanged(auth, (user) => {
            setAuthenticatedUser(user)
            setCheckingStatus(false);
        })

        return unsubscribeFunc;     // onIdTokenChanged() returns a function to remove/unsubsctribe the listener. By returning it here, that listener will stop when the component unmounts
    }, []);

    return(
        <AuthContext.Provider value={{ authenticatedUser, signin, checkingStatus }}>
            {children} 
        </AuthContext.Provider>
    );
}

export default AuthContext;

