## What's supported

#### Backend 
* all basic crud endpoints with partial updates for `question` and `user` models
* user auth using jwt tokens

#### Frontend
* User: Register, Login, Logout
* Question: Create, Read, Edit, Delete, Share
* Comment: Create, Read, Delete (other features will be implemented in the future)
 
### Try it

First clone the project `git clone https://github.com/Fibii/QA.git`
then create a `.env` file in the backend with the following properties
(specifically in `QA/backend`, if you use unix `touch QA/backend` should create it in the correct path)
```$xslt
DB=LINK_TO_DB (something like mongodb://db:port/qaTEST, qaTEST is the name of the db)
SECRET='SECRET'
API=LINK_TO_API_ENDPOINT (should be something like http://localhost:3001/api/)
```
go to backend dir `cd QA/backend` then `npm install` to install the dependencies required for the backend

go to frontend dir `cd QA/frontend` then `npm install` to install the dependencies required for the frontend

start the backend server `nodejs QA/backend/index.js` 

start the frontend react server:
`cd QA/frontend/` then `npm start`
