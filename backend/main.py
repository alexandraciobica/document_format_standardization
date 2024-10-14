from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from bs4 import BeautifulSoup
import markdownify
import pymupdf4llm
# import pathlib


app = FastAPI()

@app.get("/")
def root():
    return {"Hello" : "World"}

# Configure CORS middleware
origins = [
    "http://localhost:3000",  # Allow requests from the React frontend
    # You can also allow more origins or use "*" to allow all origins
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

#------------------- HTML from JSON
#---------------------------------------------------------
def extract_html_from_json(json_file_path):
    with open(json_file_path, 'r') as file:
        data = json.load(file)

        html_content = data.get("body", {}).get("export_view", {}).get("value", "")
        return html_content


def html_to_markdown(html_content):
    soup = BeautifulSoup(html_content, "html.parser")

    markdown_content = markdownify.markdownify(str(soup), heading_style="ATX")
    return markdown_content


#------------------- PDF
#---------------------------------------------------------
def parse_pdf_to_markdown(file_path: str) -> str:
    try:
        docs = pymupdf4llm.to_markdown(doc=file_path, 
                            #    page_chunks = True,
                            #    write_images=True,
                            #    image_path=f"../data/processed/usermanual_output/",
                            #    image_size_limit=0.05
                               )
        
        # if not os.path.exists("processed"):
        #     os.makedirs("processed")
        
        # Optional: Save the markdown to a file if needed
        # output_path = pathlib.Path(f"processed/{pathlib.Path(file_path).stem}_output.md")
        # output_path.write_bytes(docs.encode('utf-8'))
                # Ensure the output is valid text (checking for complex objects like Rects)
        if isinstance(docs, (bytes, str)):  # Expect text or bytes
            return docs.decode('utf-8') if isinstance(docs, bytes) else docs

        # return docs
    except Exception as e:
        raise ValueError(f"Error parsing PDF file: {str(e)}")
    

def parse_document(file_path: str, file_extension: str) -> str:
    if file_extension == '.txt':
        with open(file_path, 'r') as file:
            content = file.read()
            print(f"File content: {content}")  # Print the content of the file
            print(f"File path: {file_path}")   # Print the file path for debugging
        return content

    elif file_extension == '.pdf':
        content = parse_pdf_to_markdown(file_path)
        return content
    elif file_extension == '.json':
        html_content = extract_html_from_json(file_path)
        content = html_to_markdown(html_content)
        return content
    else: 
        raise ValueError("Unsuported file type")
    
    # with open(file_path, 'r') as file:
    #     # print(f"The filepath izzzz: {file_path}")
        
    #     content = file.read()  # Read the content
    #     print(f"File content: {content}")  # Print the content of the file
    #     print(f"File path: {file_path}")   # Print the file path for debugging
    #     return content  # Return the content to the calling function    


@app.post("/uploadfile")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()

    # Print the contents of the uploaded file before saving
    # print(f"File contents before saving: {contents.decode('utf-8')}")  # Decode bytes to string for printing

    upload_folder = "uploads"
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    # print(f"File is: {file}")
    # Save the upload file
    file_location = os.path.join(upload_folder, file.filename)

    with open(file_location, "wb") as buffer:
        buffer.write(contents)

    # Get the file extension
    _, file_extension = os.path.splitext(file.filename)

    try:
        parsed_content = parse_document(file_location, file_extension.lower())
        print(f"Parsed content: {parsed_content}")
    except Exception as error:
        return JSONResponse(content={"error": str(error)}, status_code=500)
    
    os.remove(file_location)
    
    # Return a JSON response with the result
    return JSONResponse(content={"markdown": parsed_content, "filename": file.filename})
