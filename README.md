## Quest
This is a monorepo for the Quest web app, for a live version of the app, [click here](https://fibi.xyz/quest)

### What is Quest
- Quest is a question/answer webapp where users ask questions, and other users answer those questions,
both questions and answers have an upvote system, where users can upvote/downvote a question or a comment 

### Why should you use Quest ?
- Offer a community feedback for your product (like battlelog for the game battlefied 3 game, or steam forums for steam) ... 

- Use it as a ticket system for you client, such that they can ask questions, or report issues (like github issues)

- Use it as a question/answer platform, like google answers or yahoo answers 

### How to use Quest
Quest requires both `backend` and `frontend` to run, you can find the instructions to get both ends running here:
- [backend](https://github.com/Fibii/Quest/tree/master/backend)
- [frontend](https://github.com/Fibii/Quest/tree/master/frontend)


### Contribute 
We accept contributes from the community, specially new developer, just make sure
to use [eslint](https://eslint.org/) and follow [github workflow](https://guides.github.com/introduction/flow/) 



#### Backend 
* Restful API 
* All basic crud endpoints with partial updates for `question` and `user` models
* User auth using jwt tokens and cookies

#### Frontend
* User: Register, Login, Logout
* Question: Create, Read, Edit, Delete, Share, Upvote, Downvote
* Comment: Create, Read, Delete, Upvote, Downvote (other features will be implemented in the future)
 
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
