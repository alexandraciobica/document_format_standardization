from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# @app.get("/")
# def root():
#     return {"Hello" : "World"}

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


@app.post("/uploadfile")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    # return {"filename": file.filename}
    # Return a JSON response with the result
    return JSONResponse(content={"filename": file.filename, "message": "File uploaded successfully"})


