import React, { useState }  from 'react';
import axios from  'axios';

function FileUpload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const onFileChange = (e) => {
        setFile(e.target.files[0])
    };

    const onFileUpload = async () => {
        const formData = new FormData();
        // formData.append('file', file, file.name);
        formData.append('file', file);


        setLoading(true)

        try {
            // Make the POST request
            const response = await axios.post("http://localhost:8000/uploadfile", formData, {
                headers: 
                {
                    'Content-Type': 'multipart/form-data'
                }   
            });
        
            // Log the response data to the browser's console
            console.log("Response from backend:", response.data);
            setMessage(response.data.markdown || "File uploaded and parsed successfully")

        } catch (error) {
            console.error("There was an error uploading the file:", error);
            setMessage("Error uploading file");
        } finally {
            setLoading(false);
        }

    };

    return (
        <div>
            <h3>File upload</h3>
            <input type="file" onChange={onFileChange} />
            <button onClick={onFileUpload} disable={loading}>
                {loading ? 'Uploading...' : 'Upload'}
            </button>
            {message && <p>{message}</p>}
        </div>
    )
}
export default FileUpload;