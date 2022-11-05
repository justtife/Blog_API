
# NodeJS Blog API

A minimal, secure RESTFUL api for NodeJS. This project includes user authentication system using PassportJS, access control of objects, encrypted hashing of passwords and  other secure features.

## URL
- Localhost
 http://localhost:5050/
 - Online
 https://blog-api.cyclic.app/


## Modules
The below shows a list of modules used as well as their function:

| Modules | Function |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **Express**                 | A popular Node Web framework used to build the server |
| **Mongoose**         | An Object Data Modeling (ODM) library for MongoDB and Node.js which was used to manage relationships between data, provides schema validation and translate between objects in code and the representation of those objects in MongoDB                                                          |
| **Dotenv**                  | A module that was used to access environment variables from a .env file into process.env                         |
| **Passport**        | An authentication module used to authenticate requests
| **Passport-Local**      | One of passport sub module that authenticates using a username and password in the project.
| **Passport-JWT**              | Also a passport sub module that was used to authenticate endpoints using a JSON web token.  
| **Jsonwebtoken**      | It was used to sign and verify tokens.
| **Bcrypt**           | Used to hash and compare hashed password                  
| **Cloudinary**           | Used for storing, transforming, and optimizing your media. It was mainly used to store user's image in the cloud  |
| **Compression**      | Handling compressed data. Used to compress response bodies for all request to enable faster output |
| **Cookie Parser**         | Used to parse cookies attached to the client request |
| **Cors**         | Shorthand for Cross-Origin Resource Sharing. A mechanism that allows or restricts requested resources on a web server|
| **Cross env**         | Used t run scripts that sets and uses environment variables across platforms|
| **Express Async Errors**         | Used to catch errors at runtime without using try/catch blocks in async functions|
| **XSS Clean**         | Used to sanitize user input coming from POST body, GET queries, and url params|
| **Validator**         | Used for email validation|
| **Multer**         | Used for handling multipart/form-data. It was primarily used for uploading files in this project.|
| **Express Rate Limit**         | Used to limit repeated requests to public APIs and/or endpoints to mainly prevent brute force attack and other forms of multiple request attack|
| **Helmet**         | Used to increase the HTTP header security                                                            |
| **Http Status Code**            | Simplifies rendering status codes compared to manual way to writing numbers   | **Lodash**            | Library used to restrict field outputs
| **Morgan**             | Used to log HTTP requests and errors, and simplifies the process                        
|

# Running Scripts

| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Runs full build in production mode. Can be invoked with `npm start`                  |
| `dev`                   | Runs full build in development mode. Can be invoked with `npm run dev`                                         |
| `test`                    | Runs build and run tests using jest. Can be invoked with `npm run test`        |





## Testing
The tests are  written in Jest and the assertions done using Supertest

```
  "devDependencies": {
    "jest": "^29.2.2",
    "supertest": "^6.3.1"
  }

```

### Example app.test.js
```
const app = require("../app");
const agent = require("supertest");




describe("Not Found Pages", () => {
  //Post Route
  it("should return a 404 error", async () => {
    await agent(app)
      .post("/testing_unknown_route")
      .expect("Content-Type", /json/)
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            message: "Route does not exist",
          })
        );
      });
  });
})


The above tests for post routes that do not exist
```

## Running tests using NPM Scripts

npm run test


# Routes
The api route used in this project are listed below:

| Name | Function |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **/api/v1/signup**                 | Signup Route: Used to create a new user |
| **/api/v1/login**         | Login Route: To sign user's in                                                           |
| **/api/v1/update**                  | Update Route: To update user's profile information including setting a new user image.                            |
| **/api/v1/change-password**        | Change Password Route: Used to change to a new password 
| **/api/v1/forgot-password**      | Forgot Password Route: Create a new password when user forgets password by answering a security question 
| **/api/v1/logout**              | Logout Route: To Log user out  
| **/api/v1/delete-account**      | Delete Account Route: Delete user details from database
| **/api/v1/article/create**           | Create Article: Used to create a new article  
| **api/v1/article/my-articles**           | User's Article: Gets all article written by one user(logged in user)  
| **/api/v1/article/all**           | All Articles: Gets all articles published by different authors
| **/api/v1/article/:id**           | GET method: Gets a single article                  
| **/api/v1/article/:id**           | PATCH method: Used to publisha single article(Only by the author that created the article)  |
| **/api/v1/article/:id**      | DELETE method: Deletes a single article(Can be done only by the author which creates the article) |
| **/api/v1/article/:id/edit**      | Update Single Article: Edits a single article(Can be done only by the author which creates the article) |
| **/api/v1/comment/:id**      | POST method: Used to comment on a single article |
| **/api/v1/comment/:id**      | DELETE method: Deletes a single comment made on an article(Can be done only by logged in users) |
| **/api/v1/article/:id/reply**      | Reply: Used to reply on a comment 

# Models
### User
| Field  |  Data Type | Constraints  |
|---|---|---|
|  id |  ObjectId |  required |
|  name.first |  String |  required |
|  name.last | String  |  required|
|  email  |  String |  required  |
|  password     | String  |  required |
|  securityQuestion |   String |  required  |
|  image |  String |  optional, default: "" |
|  isVerified |  Boolean |  default: false |


### Article
| Field  |  Data Type | Constraints  |
|---|---|---|
|  title |  String |  required |
|  description |  String |  required |
|  author | Schema.ObjectId  |  required|
|  state  |  String |  enum: ("Draft","Published"), default: "Draft"  |
|  read_count     | Number  |  optional |
|  reading_time |   Number |  optional  |
|  tags |  Array |  optional |
|  body |  String |  required |
|  createdAt |  Date |  required |
|  updatedAt |  Date |  required |

### Comment
| Field  |  Data Type | Constraints  |
|---|---|---|
|  title |  String |  required |
|  body |  String |  required |
|  article | String  |  required|
|  replies  |  Array |  optional |
|  user     | Schema.ObjectId  |  required |
|  createdAt |  Date |  required |
|  updatedAt |  Date |  required |

### Token
| Field  |  Data Type | Constraints  |
|---|---|---|
|  refreshToken |  String |  required |
|  ip |  String |  required |
|  userAgent | String  |  required|
|  isValid  |  Boolean |  default:true |
|  user     | Schema.ObjectId  |  required |
|  createdAt |  Date |  required |


# APIs
---

### Signup User

- Route: http://localhost:5050/api/v1/signup
- Method: POST
- Body: 
```
{"email": "testuser@example.com","password":"Password123","firstname": "Test","lastname": "User","securityQuestion": "Hello World"
}
```

- Responses

Success
```
{
    "message": {
        "detail": "User created successfully",
        "status": "Success",
        "user": {
            "name": {
                "first": "Test",
                "last": "User"
            },
            "image": "",
            "isVerified": false,
            "_id": "6365488968cc61a8bc6ec2b3",
            "email": "testuser@example.com"
        }
    }
}
```
---
### Login User

- Route: http://localhost:5050/api/v1/signup
- Method: POST
- Body: 
```
{"password": "Password1234","email": 'testuser@example.com"}
```

- Responses

Success
```
{
    "message": {
        "detail": "User logged In Successfully",
        "status": "Success",
        "user": {
            "name": {
                "first": "Test",
                "last": "User"
            },
            "_id": "6365488968cc61a8bc6ec2b3",
            "image": "",
            "isVerified": false,
            "email": "testuser@example.com"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJCb2x1d2F0aWZlIiwidXNlcklEIjoiNjM2NTJlNjllOTNmNTRhODllNTZiZWQ0In0sInJlZnJlc2hUb2tlbiI6IjYxZmM5Y2ExOTBhYmJmODhkNDBkZTEyOGFiYjU2NDNkNTAyYjUyNGRiOTBlMTJjMWI3NGMxMDg3OGZlMWM5MWI2ZDc5YTdiYWM3YjQ4Njg4IiwiaWF0IjoxNjY3NTgxOTYzLCJleHAiOjE2NzExODE5NjN9.aESSw_y4PMQVqdXzbOMaxBMeMm4gxsWsBoR_vsrnWi4",
        "expires": 3600
    }
}
```
---
### Update User

- Route: http://localhost:5050/api/v1/update
- Method: PATCH
- Cookies
    - req.signedCookies("accessToken")
    - req.signedCookies("refreshToken")
- Body: 
```
{"email": "testuser@example.com","image":"user.jpg","firstname": "Test","lastname": "User","securityQuestion": "Hello World"
}
```
- Responses

Success
```
{
    "message": {
        "detail": "User account successfully updated",
        "status": "Success",
        "user": {
            "name": {
                "first": "Test",
                "last": "User"
            },
            "_id": "63652b971104ae8c774e103b",
            "image": "user-images/image_1667574689527_dp_sxxtjf http://res.cloudinary.com/dllgzg6si/image/upload/v1667574691/user-images/image_1667574689527_user.jpg",
            "isVerified": false,
            "email": "testuser@example.com"
        }
    }
}
```
---
### Forgot Password

- Route: http://localhost:5050/api/v1/forgot-password
- Method: PATCH
- Body: 
```
{"email": "testuser@example.com","password": "Password1234","securityQuestion": "Hello World"
}
```
-Responses

Success
```
{
    "message": {
        "detail": "Password updated successfully",
        "status": "Success"
    }
}
```

---
### Change Password

- Route: http://localhost:5050/api/v1/change-password
- Method: PATCH
- Cookies
    - req.signedCookies("accessToken")
    - req.signedCookies("refreshToken")
- Body: 
```
{oldPassword: "Password1234",newPassword: "Password4321"}
```
- Responses

Success
```
{
    "message": {
        "detail": "Password changed successfully",
        "status": "Success"
    }
}
```
---
### Create Article

- Route: http://localhost:5050/api/v1/article/create
- Method: POST
- Cookies
    - req.signedCookies("accessToken")
    - req.signedCookies("refreshToken")
- Body: 
```
    {title:"Hello World",description: "Lorem Ipsum dolor sit amet",body: "One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve",tags:["NodeJs","ExpressJS","MongoDB"]}
```

- Responses

Success
```
{
    "message": {
        "detail": "Article created successfully",
        "status": "Success",
        "article": {
            "title": "Hello World",
            "description": "Lorem Ipsum dolor sit amet",
            "author": "6365488968cc61a8bc6ec2b3",
            "state": "Draft",
            "read_count": 0,
            "reading_time": 1,
            "tags": [
                "NodeJs,"ExpressJS","MongoDB"
            ],
            "body": "One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve",
            "_id": "6365492a68cc61a8bc6ec2c8",
            "createdAt": "2022-11-04T17:17:30.032Z"
        }
    }
```
---
### Create comment

- Route: http://localhost:5050/api/v1/comment/create/6365492a68cc61a8bc6ec2c8
- Method: POST
- Cookies
    - req.signedCookies("accessToken")
    - req.signedCookies("refreshToken")
- Body: 
```

    {title:"Nice Write Up",body: "Lorem Ipsum dolor sit amet"}

```
- Responses

Success
```
{
    "message": {
        "detail": "Comment Submitted",
        "status": "success",
        "comment": {
            "title": "New Write Up",
            "body": "Lorem ipsum dolor sit amet",
            "article": "63653111467ab4b3754b4127",
            "user": "63652e69e93f54a89e56bed4",
            "replies": [],
            "_id": "636544c2257dc6da3dd5dbbc",
            "createdAt": "2022-11-04T16:58:42.919Z"
        }
    }
}
```
---

### Get Orders

- Route: http://localhost:5050/api/v1/comment/6365492a68cc61a8bc6ec2c8/reply
- Method: PATCH
- Cookies
    - req.signedCookies("accessToken")
    - req.signedCookies("refreshToken")
- Body: 
    {reply: "Wonderful. Exactly my thoughts on the artilcle"}
- Responses

Success
```
{
    "message": {
        "detail": "Reply submitted successfully",
        "status": "success"
    }
}
```
---

...

## Contributor
- Farinu Boluwatife
- farinubolu@gmail.com
