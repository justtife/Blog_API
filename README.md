



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
![ISC License][license-shield]



# NodeJS Blog API

A minimal, secure RESTFUL api for NodeJS. This project includes user authentication system using PassportJS, access control of objects, encrypted hashing of passwords and  other secure features.

## URL
- Localhost:
 http://localhost:5050/
 - Online:
 https://blog-api.cyclic.app/

### Built Using

This section shows a list of frameworks, tools and libraries used during the execution of this project.

![Javascript][JAVASCRIPT]
![NodeJS][NodeJS]
![NPM][NPM]
![ExpressJS][EXPRESS]
![MongoDB][MONGODB]
![Jest][JEST]
![JWT][JWT]
![Markdown][MARKDOWN]
![Visual Studio Code][VISUALSTUDIOCODE]
![JSON][JSON]
![Prettier][PRETTIER]

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

```
npm run test
```


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

- Route: 
   - http://localhost:5050/api/v1/signup
   - https://blog-api.cyclic.app/api/v1/signup
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

- Route: 
  - http://localhost:5050/api/v1/login
  - https://blog-api.cyclic.app/api/v1/login
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

- Route: 
  - http://localhost:5050/api/v1/update
  - https://blog-api.cyclic.app/api/v1/update
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

- Route: 
  - http://localhost:5050/api/v1/forgot-password
  - https://blog-api.cyclic.app/api/v1/forgot-password
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

- Route: 
  - http://localhost:5050/api/v1/change-password
  - https://blog-api.cyclic.app/api/v1/change-password
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

### Delete Account

- Route: 
  - http://localhost:5050/api/v1/delete-account
  - https://blog-api.cyclic.app/api/v1/delete-account
- Method: DELETE
- Cookies
    - req.signedCookies("accessToken")
    - req.signedCookies("refreshToken")
- Body: 
```
    {securityQuestion:"Hello World"}
```

- Responses

Success
```
{
    "message": {
        "detail": "User Account successfully deleted",
        "status": "Success"
    }
}

//Account gets deleted along with articles associated with the author
```
---
### Create Article

- Route: 
  - http://localhost:5050/api/v1/article/create
  - https://blog-api.cyclic.app/api/v1/article/create
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
### Publish Article

- Route: 
  - http://localhost:5050/api/v1/article/1234567890
  - https://blog-api.cyclic.app/api/v1/article/1234567890
- Method: PATCH
- Cookies
    - req.signedCookies("accessToken")
    - req.signedCookies("refreshToken")

- Responses

Success
```
     {
        message: {
          "detail": "Article has been published",
          "status": "success",
          "article": {
            "title": "Hello World",
            "description": "Lorem Ipsum dolor sit amet",
            "author": "6365488968cc61a8bc6ec2b3",
            "state": "Published",
            "read_count": 0,
            "reading_time": 1,
            "tags": [
                "NodeJs,"ExpressJS","MongoDB"
            ],
            "body": "One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve",
            "_id": "6365492a68cc61a8bc6ec2c8",
            "createdAt": "2022-11-04T17:17:30.032Z"
        }
        },
      }
```
---
### Update Article

- Route: 
  - http://localhost:5050/api/v1/article/1234567890/edit
  - https://blog-api.cyclic.app/api/v1/1234567890/edit
- Method: PATCH
- Cookies
    - req.signedCookies("accessToken")
    - req.signedCookies("refreshToken")
    - 
- Body: 
```
    {title:"Hello World",description: "Lorem Ipsum dolor sit amet",body: "One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve",tags:["NodeJs","ExpressJS","MongoDB"]}
```
- Responses

Success
```{
    "message": {
        "detail": "Article successfully updated",
        "status": "Success",
        "article": {
            "_id": "636531cd467ab4b3754b412d",
            "title": "Hello World",
            "description": "Lorem Ipsum dolor sit amet",
            "author": "63652e69e93f54a89e56bed4",
            "state": "Published",
            "read_count": 1,
            "reading_time": 1,
            "tags": [
                "NodeJs","ExpressJS","MongoDB"
            ],
            "body": "One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve",
            "createdAt": "2022-11-04T15:37:49.620Z"
        }
    }
}
```
---
### Get All Article

- Route: 
  - http://localhost:5050/api/v1/article/all
  - https://blog-api.cyclic.app/api/v1/article/all
- Method: GET
- Cookies
    - req.signedCookies("accessToken")
    - req.signedCookies("refreshToken")
- Responses

Success
```
{
    "message": {
        "detail": "All Articles",
        "status": "Success",
        "countPerPage": 3,
        "numOfArticles": 3,
        "articles": [
            {
                "_id": "63653111467ab4b3754b4127",
                "title": "Mongodb",
                "description": "Working with No SQL Database",
                "author": "63652e69e93f54a89e56bed4",
                "state": "Published",
                "read_count": 9,
                "reading_time": 3,
                "tags": [
                    "MongoDB, No SQL, Database"
                ],
                "body": "In this article I want to tell you what MongoDB is and if you should try it out.\n\nLet me start with describing my experience with it. The first time I tried it was about 4 years ago, when it was on trend and everybody wanted to give it a shot, as NoSQL was what every startup needed!!! (not really, but we’ll talk about it later.)But I didn’t get anywhere with it at that point, played around with it a little bit, even used it for some MVP, but not for any serious projects.",
                "createdAt": "2022-11-04T15:34:41.203Z",
                "user": {
                    "name": {
                        "first": "Test",
                        "last": "User"
                    },
                    "_id": "1234567890",
                    "email": "testuser@gmail.com"
                },
                "id": "63653111467ab4b3754b4127"
            },
            {
                "_id": "636531cd467ab4b3754b412d",
                "title": "Jest Test",
                "description": "Test Driven Development",
                "author": "63652e69e93f54a89e56bed4",
                "state": "Published",
                "read_count": 1,
                "reading_time": 1,
                "tags": [
                    null
                ],
                "body": "In this article I want to tell you what MongoDB is and if you should try it out.\\n\\nLet me start with describing my experience with it. ",
                "createdAt": "2022-11-04T15:37:49.620Z",
                "user": {
                    "name": {
                        "first": "Boluwatife",
                        "last": "Farinu"
                    },
                    "_id": "63652e69e93f54a89e56bed4",
                    "email": "farinubolu@gmail.com"
                },
                "id": "636531cd467ab4b3754b412d"
            },
            {
                "_id": "6365492a68cc61a8bc6ec2c8",
                "title": "Python API Test",
                "description": "Pytest and Test Driven Development",
                "author": "6365488968cc61a8bc6ec2b3",
                "state": "Published",
                "read_count": 5,
                "reading_time": 1,
                "tags": [
                    "python,test"
                ],
                "body": "Writing python test using pytest library. Test driven development",
                "createdAt": "2022-11-04T17:17:30.032Z",
                "user": null,
                "id": "6365492a68cc61a8bc6ec2c8"
            }
        ]
    }
}
```
---
### Get single author articles

- Route: 
  - http://localhost:5050/api/v1/article/my-articles
  - https://blog-api.cyclic.app/api/v1/article/my-articles
- Method: GET
- Cookies
    - req.signedCookies("accessToken")
    - req.signedCookies("refreshToken")
- Responses

Success
```
{
    "message": {
        "detail": "User:63652e69e93f54a89e56bed4 Articles",
        "countPerPage": 3,
        "numOfArticles": 3,
        "status": "Success",
        "articles": [
            {
                "_id": "63653111467ab4b3754b4127",
                "title": "Mongodb",
                "description": "Working with No SQL Database",
                "author": "63652e69e93f54a89e56bed4",
                "state": "Published",
                "read_count": 9,
                "reading_time": 3,
                "tags": [
                    "MongoDB, No SQL, Database"
                ],
                "body": "In this article I want to tell you what MongoDB is and if you should try it out.\n\nLet me start with describing my experience with it. The first time I tried it was about 4 years ago, when it was on trend and everybody wanted to give it a shot, as NoSQL was what every startup needed!!! (not really, but we’ll talk about it later.) So it has basically everything you can get from an SQL database along with saving it via the pipeline format and with more legible syntax.\n\nHere’s an example from the docs:",
                "createdAt": "2022-11-04T15:34:41.203Z",
                "updatedAt": "2022-11-04T22:49:11.351Z",
                "__v": 0,
                "id": "63653111467ab4b3754b4127"
            },
            {
                "_id": "636531cd467ab4b3754b412d",
                "title": "NodeJS",
                "description": "Javvascript run time environment",
                "author": "63652e69e93f54a89e56bed4",
                "state": "Published",
                "read_count": 1,
                "reading_time": 2,
                "tags": [
                    "Javascript, Node, NPM"
                ],
                "body": "Being the most popular programming language, JavaScript is also one of the most universal software development technologies.  The interest in this technology peaked in 2017, as per Google Trends, and remains high.\n\n",
                "createdAt": "2022-11-04T15:37:49.620Z",
                "updatedAt": "2022-11-04T17:11:33.611Z",
                "__v": 0,
                "id": "636531cd467ab4b3754b412d"
            },
            {
                "_id": "6366174fb59e7ff02c51ddca",
                "title": "API Test",
                "description": "Pytest and Test Driven Development",
                "author": "63652e69e93f54a89e56bed4",
                "state": "Draft",
                "read_count": 0,
                "reading_time": 1,
                "tags": [
                    "python,test"
                ],
                "body": "Writing python test using pytest library. Test driven development",
                "createdAt": "2022-11-05T07:57:03.720Z",
                "updatedAt": "2022-11-05T07:57:03.720Z",
                "__v": 0,
                "id": "6366174fb59e7ff02c51ddca"
            }
        ]
    }
}
```
---
### Get a single article

- Route: 
  - http://localhost:5050/api/v1/article/636531cd467ab4b3754b412d
  - https://blog-api.cyclic.app/api/v1/article/636531cd467ab4b3754b412d
- Method: GET
- Cookies
    - req.signedCookies("accessToken")
    - req.signedCookies("refreshToken")

- Responses

Success
```
{
    "message": {
        "detail": "Article with id:636531cd467ab4b3754b412d",
        "status": "Success",
        "article": {
            "_id": "636531cd467ab4b3754b412d",
            "title": "Jest Test",
            "description": "Test Driven Development",
            "author": "63652e69e93f54a89e56bed4",
            "state": "Published",
            "read_count": 2,
            "reading_time": 1,
            "tags": [
                null
            ],
            "body": "In this article I want to tell you what MongoDB is and if you should try it out.\\n\\nLet me start with describing my experience with it. The first time I tried it was about 4 years ago, when it was on trend and everybody wanted to give it a shot, as NoSQL was what every startup needed!!! (not really, but we’ll talk about it later.)But I didn’t get anywhere with it at that point, played around with it a little bit, even used it for some MVP, but not for any serious projects. And then I forgot about it for some time.",
            "createdAt": "2022-11-04T15:37:49.620Z",
            "__v": 1,
            "comments": [],
            "user": {
                "name": {
                    "first": "Boluwatife",
                    "last": "Farinu"
                },
                "_id": "63652e69e93f54a89e56bed4",
                "image": "",
                "isVerified": false,
                "email": "farinubolu@gmail.com"
            },
            "id": "636531cd467ab4b3754b412d"
        }
    }
}

//This article is populated with comments made on the article as well as the details of the author that created the article
```
---
### Delete Article

- Route: 
  - http://localhost:5050/api/v1/article/63652f7efc97f75460e251e7
  - https://blog-api.cyclic.app/api/v1/article/63652f7efc97f75460e251e7
- Method: DELETE
- Cookies
    - req.signedCookies("accessToken")
    - req.signedCookies("refreshToken")
- Body: 
```

    {securityQuestion:"Testing"}

```
- Responses

Success
```
    {
      message: { detail: "Article successfully Deleted", status: "Success" },
    }
```
---
### Create comment

- Route: 
  - http://localhost:5050/api/v1/comment/create/6365492a68cc61a8bc6ec2c8
  - https://blog-api.cyclic.app/api/v1/comment/create/6365492a68cc61a8bc6ec2c8
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
### Reply on a comment

- Route: 
  - http://localhost:5050/api/v1/comment/636544c2257dc6da3dd5dbbc/reply
  - https://blog-api.cyclic.app/api/v1/comment/636544c2257dc6da3dd5dbbc/reply
- Method: PATCH
- Cookies
    - req.signedCookies("accessToken")
    - req.signedCookies("refreshToken")
- Body: 
```

    {reply:"Exactly my thoughts about this article"}

```
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
### Delete comment

- Route: 
  - http://localhost:5050/api/v1/comment/636544c2257dc6da3dd5dbbc/
  - https://blog-api.cyclic.app/api/v1/comment/636544c2257dc6da3dd5dbbc/
- Method: DELETE
- Cookies
    - req.signedCookies("accessToken")
    - req.signedCookies("refreshToken")
- Responses

Success
```
    {
      message: { detail: "Comment successfully deleted", status: "success" },
    }
```
---

...

## Contributor
- Farinu Boluwatife

[![LinkedIn][linkedin-shield]][linkedin-url]
[![Gmail][gmail-shield]][gmail-url]

[contributors-shield]: https://img.shields.io/badge/CONTRIBUTOR-1-blue
[contributors-url]: https://github.com/justtife/Blog_API/graphs/contributors
[license-shield]: https://img.shields.io/badge/LICENSE-ISC-yellow
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/farinu-boluwatife-5817b319a/
[gmail-shield]: https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white
[gmail-url]: farinubolu@gmail.com

[NodeJS]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[NPM]: 	https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white
[MARKDOWN]: https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white
[JWT]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white
[JEST]: https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white
[EXPRESS]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[VISUALSTUDIOCODE]: https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white
[JAVASCRIPT]: https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E
[JSON]: https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white
[PRETTIER]: https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E
[MONGODB]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white


