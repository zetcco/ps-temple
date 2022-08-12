import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/layout/Spinner/Spinner";
import Tag from "../components/Tag";
import { fetchTemplate } from "../context/templates/TemplatesActions";
import TemplatesContext from "../context/templates/TemplatesContext";
import UserContext from "../context/user/UserContext";

function TemplatePage() {
    const { id } = useParams();
    const { template, dispatch } = useContext(TemplatesContext);
    const { userData, getUser } = useContext(UserContext)

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
                    <div className="absolute bottom-0 right-0 p-7">
                        <button className="btn btn-primary" onClick={() => window.open(template.gdriveLink, '_blank')}>Download</button>
                    </div>
                </div>
            </div> 
        );
    }
}

export default TemplatePage;