import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Spinner from '../components/layout/Spinner/Spinner';
import AuthContext from '../context/authentication/AuthProvider';

function PrivateRoute({ children, redirect }) {

    const { authenticatedUser, checkingStatus } = useContext(AuthContext);
    const location = useLocation();

    // Wait if auth is still getting data
    if (checkingStatus) {
        return <Spinner/>
    }

    // If user is not currently logged in, Redirect to sign in page
    if (!authenticatedUser && !checkingStatus) {
        return <Navigate to="/signin" state={ {from: location} } replace/>
    }

    return children;
}

export default PrivateRoute;