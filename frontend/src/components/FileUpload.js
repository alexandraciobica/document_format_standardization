import React, { useState }  from 'react';
import axios from  'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function FileUpload() {
    const [file, setFile] = useState(null);
    const [markdownContent, setMarkdownContent] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onFileChange = (e) => {
        setFile(e.target.files[0])
        setMarkdownContent('');  
        setError('');
    
    };

    const onFileUpload = async () => {
        const formData = new FormData();
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
            setMarkdownContent(response.data.markdown || "File uploaded and parsed successfully")

        } catch (error) {
            console.error("There was an error uploading the file:", error);
            setError("Error uploading file");
        } finally {
            setLoading(false);
        }

    };

    return (
        <div>
            <div className='file-upload'>
                <h3>File upload</h3>
                <input type="file" onChange={onFileChange} />
                <button onClick={onFileUpload} disable={loading}>
                    {loading ? 'Uploading...' : 'Upload and Convert'}
                </button>
                {error && <p className='error'>{error}</p>}
            </div>

            { markdownContent && (
                <div className='markdown-result'>
                    <h2>Markdown Preview of {file.name}:</h2>
                    <pre>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
                    </pre>
                </div>
            )}
        </div>
    )
}
export default FileUpload;