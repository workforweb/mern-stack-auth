# mern-stack-auth

## Server:
rename env.txt to .env 

### fill to run application

NODE_ENV=development

# Port number
PORT=<Server Port Number> 

SERVER_NAME=<Server Name>  
API_URL=<Api Url>  
# URL of client application
CLIENT_URL=<Cliet Url>  

# Database Config
MONGO_INITDB_ROOT_USERNAME=<Mongodb Root Username>  
MONGO_INITDB_ROOT_PASSWORD=<Mongodb Root Passsword>  
MONGO_INITDB_DATABASE=<Mongodb Database Name>  
DB_LOCAL_PORT=<Mongodb Local Port>  
DB_DOCKER_PORT=<Mongodb Docker Port>  
DB_HOST=<DB Host i.e., Localhost>  

mainly for authenticate user with two JWT tokens first access (short lived) and second refresh token (for one year) 
Role based user authorization, and server side validation also added.

## Client:

using 
react-hook-form for form submission, 
yup for client side validation, 
@tanstack/react-query and axios for http request,
and React context for manage the state 


