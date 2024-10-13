import React, { useState }  from 'react';
import axios from  'axios';


class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null
        };
    }

    onFileChange = event => {
        this.setState({
            selectedFile: event.target.files[0]
        });
    };

    onFileUpload = () => {
        const formData = new FormData()

        formData.append(
            "file",
            this.state.selectedFile,
            this.state.selectedFile.name
        );

        // try {
            console.log(this.state.selectedFile);
    
        // Make the POST request
        axios.post("http://localhost:8000/uploadfile", formData, {
            headers: 
            {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.error("There was an error uploading the files:", error)
        })

        //     // Log the response data to the browser's console
        //     console.log("Response from backend:", response.data);
        // } catch (error) {
        //     console.error("There was an error uploading the file:", error);
        // }

    };

    render() {
        return(
            <div>
                <h3>File upload</h3>
                <div>
                    <input type='file' onChange={this.onFileChange} />
                    <button onClick={this.onFileUpload}>
                        Upload
                    </button>

                </div>
            </div>
        )
    }

}

export default FileUpload;