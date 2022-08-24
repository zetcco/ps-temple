import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/layout/Spinner/Spinner";
import Tag from "../components/Tag";
import { deleteTemplate, fetchTemplate } from "../context/templates/TemplatesActions";
import TemplatesContext from "../context/templates/TemplatesContext";
import UserContext from "../context/user/UserContext";

function TemplatePage() {
    const { id } = useParams();
    const { template, dispatch } = useContext(TemplatesContext);
    const { userData, getUser } = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        ( async () => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                const template = await fetchTemplate(id);
                dispatch({ type: 'GET_TEMPLATE', payload: template });
                getUser(template.uploadedBy);
            } catch (error) {
                console.log(error);
                toast.error('Error fetching template details');
            }
            dispatch({ type: 'SET_LOADING', payload: false });
        })()
    }, [dispatch, id]);

    const handleDelete = async () => {
        await deleteTemplate(id);
        navigate('/');
    }

    if (!userData || template.length === 0) {
        return <Spinner/>
    } else {
        return(
            <div className="card lg:card-side bg-base-100 shadow-xl m-10">
                <div className="xl:w-1/2 lg:w-full md:w-full">
                    <img src={template.imageUrls[0]} alt="Album"/>
                </div>
                <div className="relative p-7">
                    <h2 className="text-3xl antialiased font-bold">{template.title}</h2>
                    <h2 className="text-base antialiased mt-6">{userData.email}</h2>
                    <h2 className="text-base antialiased">{new Date(template.uploadTime.seconds * 1000).toLocaleString()}</h2>
                    <div className="card-actions w-1/2 space-x-2 mt-6">
                        { template.tags.map((tag, index) => <Tag value={tag} key={index}/>) }
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 p-7">
                    <button className="btn btn-primary" onClick={() => window.open(template.gdriveLink, '_blank')}>Download</button>
                </div>
                <div className="absolute top-0 right-0 p-7">
                    <label htmlFor="modal-delete-confirm" className="text-neutral hover:text-error cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path className="st0" d="M19.6,7.2c0-1.6-1.3-2.8-2.8-2.8h-2.6V4.1c0-1.5-1.2-2.7-2.7-2.7S8.8,2.6,8.8,4.1v0.2H6.2
                            c-1.6,0-2.8,1.3-2.8,2.8c0,1.3,0.9,2.4,2.1,2.7v11.4c0,1.6,1.3,3,3,3h6.3c1.6,0,3-1.3,3-3V9.9C18.8,9.5,19.6,8.5,19.6,7.2z
                            M10.8,4.1c0-0.4,0.3-0.7,0.7-0.7c0.4,0,0.7,0.3,0.7,0.7v0.2h-1.4V4.1z M7.4,21.3V10h1.4v12.2H8.3C7.8,22.2,7.4,21.8,7.4,21.3z
                            M12.2,10v12.2h-1.4V10H12.2z M15.6,21.3c0,0.5-0.4,1-1,1h-0.5V10h1.4V21.3z M16.8,8H6.2C5.7,8,5.3,7.6,5.3,7.2s0.4-0.8,0.8-0.8h2.6
                            h5.4h2.6c0.5,0,0.8,0.4,0.8,0.8S17.3,8,16.8,8z"/>
                        </svg>
                    </label>
                </div>
                
                <input type="checkbox" id="modal-delete-confirm" className="modal-toggle" />
                <div className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirm Delete</h3>
                        <p className="py-4">Are you sure you want to delete this template?</p>
                        <div className="modal-action">
                            <label htmlFor="modal-delete-confirm" className="btn btn-outline btn-error">Cancel</label>
                            <label htmlFor="modal-delete-confirm" className="btn btn-error" onClick={handleDelete}>Delete</label>
                        </div>
                    </div>
                </div>
            </div> 
        );
    }
}

export default TemplatePage;