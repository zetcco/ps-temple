import { useContext, useEffect } from "react";
import TemplateResults from "../components/SearchTemplates/TemplateResults";
import TemplatesContext from "../context/templates/TemplatesContext";
import { auth } from "../firebase.config";

function MyUploads() {

    const { getTemplates } = useContext(TemplatesContext);

    useEffect(() => {
        getTemplates("uploadedBy", "==", auth.currentUser.uid);
    }, [])

    return(
        <TemplateResults/>
    );
}

export default MyUploads;