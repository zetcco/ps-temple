import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../context/authentication/AuthProvider";

function SignInPage() {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const { signin, authenticatedUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        await signin(formData.email, formData.password);
        navigate('/');
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    if (authenticatedUser) {
        return (
            <Navigate to='/'/>
        )
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type='text' id='email' value={formData.email} onChange={onChange}/>
                <input type='password' id='password' value={formData.password} onChange={onChange}/>
                <button type='submit'>Sign In</button>
            </form>
        </div>
    );
}

export default SignInPage;