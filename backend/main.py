from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil

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


def parse_document(file_path: str) -> str:
    with open(file_path, 'r') as file:
        print(f"The filepath izzzz: {file_path}")
        
        content = file.read()  # Read the content
        print(f"File content: {content}")  # Print the content of the file
        print(f"File path: {file_path}")   # Print the file path for debugging
        return content  # Return the content to the calling function    


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
        # shutil.copyfileobj(file.file, buffer)
        buffer.write(contents)

    try:
        parsed_content = parse_document(file_location)
        print(f"Parsed content: {parsed_content}")
    except Exception as error:
        return JSONResponse(content={"error": str(error)}, status_code=500)
    
    os.remove(file_location)
    
    # Return a JSON response with the result
    return JSONResponse(content={"markdown": parsed_content})

    # return JSONResponse(content={"filename": file.filename, "message": "File uploaded successfully"})

