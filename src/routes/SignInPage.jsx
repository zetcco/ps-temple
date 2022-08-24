import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "../context/authentication/AuthProvider";

function SignInPage() {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [isLoading, setIsLoading] = useState(false);

    const { signin, authenticatedUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signin(formData.email, formData.password);
        } catch (error) {
            toast.error('Wrong Emai/Password combination');
        }
        setIsLoading(false);
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
        <div className="mx-auto w-2/5">
            <form onSubmit={onSubmit}>
                <label className="label">
                    <span className="label-text">Enter your email</span>
                </label>
                <input type="text" placeholder="Type here" className="input input-bordered w-full" id='email' value={formData.email} onChange={onChange} required/>
                <label className="label">
                    <span className="label-text">Enter your password</span>
                </label>
                <input type="password" placeholder="Type here" className="input input-bordered w-full" id='password' value={formData.password} onChange={onChange} required/>
                {isLoading === false ? 
                    (
                        <button className="btn btn-primary btn-block mt-5 w-full" type="submit">Sign In</button>
                    ) : (
                        <button className="btn loading mt-5 w-full">Signing In</button>
                    )
                }
            </form>
        </div>
    );
}

export default SignInPage;