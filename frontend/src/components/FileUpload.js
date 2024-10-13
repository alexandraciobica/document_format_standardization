import React, { useState }  from 'react';
import axios from  'axios';


// class FileUpload extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             selectedFile: null,
//             message: '',
//             setMessage: '',
//         };
//     }

//     onFileChange = event => {
//         this.setState({
//             selectedFile: event.target.files[0]
//         });
//     };

//     onFileUpload = () => {
//         const formData = new FormData()

//         formData.append(
//             "file",
//             this.state.selectedFile,
//             this.state.selectedFile.name
//         );

//         // try {
//             console.log(this.state.selectedFile);
    
//         // Make the POST request
//         axios.post("http://localhost:8000/uploadfile", formData, {
//             headers: 
//             {
//                 'Content-Type': 'multipart/form-data'
//             }
//         }).then(response => {
//             console.log(response.data);
//             setMessage(response.data.markdown || "File uploaded and parsed successfully")
//         }).catch(error => {
//             console.error("There was an error uploading the files:", error)
//             setMessage('Error uploading file');
//         })

//         //     // Log the response data to the browser's console
//         //     console.log("Response from backend:", response.data);
//         // } catch (error) {
//         //     console.error("There was an error uploading the file:", error);
//         // }

//     };

//     render() {
//         return(
//             <div>
//                 <h3>File upload</h3>
//                 <div>
//                     <input type='file' onChange={this.onFileChange} />
//                     <button onClick={this.onFileUpload}>
//                         {/* Upload */}
//                         {message && <p>{message}</p>}
//                     </button>

//                 </div>
//             </div>
//         )
//     }

// }

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