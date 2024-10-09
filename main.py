from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel

app = FastAPI()

@app.get("/")
def root():
    return {"Hello" : "World"}


@app.post("/uploadfile")
async def upload_file(file: UploadFile = File(...)):
    return {"filename": file.filename}

