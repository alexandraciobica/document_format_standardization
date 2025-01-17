
## Docker 

`CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]`
This command starts the Uvicorn server when the container runs

- By specifying `--host 0.0.0.0` in the Uvicorn command, you allow the container to be accessed from external machines (like your development machine or production server). Without this, Docker wouldn't be able to expose the service beyond the container.
- The `--reload` flag makes FastAPI auto-reload the server when code changes are detected, which is useful during development. However, it is not recommended for production because it consumes additional resources.

### Build the Docker image
`docker build -t document-format-app .`

### Run the Docker container
`docker run -d -p 8000:8000 --name document-app-container document-format-app`

- `-d`: Runs the container in detached mode (in the background).
- `-p 8000:8000`: Maps port 8000 of the host machine to port 8000 in the container, allowing you to access the FastAPI app via `http://localhost:8000`.
- `--name document-app-container`: Assigns a custom name to your container.
- `document-format-app`: The name of the Docker image you built.



### Rebuilding the Image After Code Changes


`docker build -t document-format-app .`

`docker stop document-app-container`

`docker rm document-app-container`

`docker run -d -p 8000:8000 --name document-app-container document-format-app`


If you can't make curl requests, make sure to add the port in the docker-compose.yml.

curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:8000/items?item=orange'
curl -X GET 'http://127.0.0.1:8000/items/20'
curl -X GET 'http://127.0.0.1:8000/items?limit=3' 
curl -X GET 'http://127.0.0.1:8000/items'   

curl -X POST -H "Content-Type: application/json" -d '{"text":"apple"}' 'http://127.0.0.1:8000/items'

If you wanna check something in the docker container logs:
`docker logs document-app-container`

curl -L -X 'POST' \
  'http://127.0.0.1:8000/uploadfile/' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@example.txt'

curl -L -X 'POST' 'http://127.0.0.1:8000/uploadfile/' -H 'accept: application/json' -H 'Content-Type: multipart/form-data' -F 'file=@example.txt'



-------


The errors I was getting in browser console:
1. `Access to XMLHttpRequest at 'http://localhost:8000/uploadfile' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`

2. `There was an error uploading the files: Q {message: 'Network Error', name: 'AxiosError', code: 'ERR_NETWORK',`

3. `POST http://localhost:8000/uploadfile net::ERR_FAILED 200 (OK)`

What helped:
1. Checking if the ports are visible for both frontend and backend
2. Adding  CORS Middleware configuration to FastApi so that the file is sent successfully.

`origins = [`
    `"http://localhost:3000",  # Allow requests from the React frontend`
    `# You can also allow more origins or use "*" to allow all origins`
`]`

`app.add_middleware(`
    `CORSMiddleware,`
    `allow_origins=origins,`
    `allow_credentials=True,`
    `allow_methods=["*"],  # Allow all HTTP methods`
    `allow_headers=["*"],  # Allow all headers`
`)`