
# NodeJS Blog API

A minimal, secure RESTFUL api for NodeJS. This project includes user authentication system using PassportJS, access control of objects, encrypted hashing of passwords and  other secure features.


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
|




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
|


