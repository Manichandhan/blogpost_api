# blogpost_api

## Description
                             These Rest apis are used to Register a User with verifying Email 
                user credentials will be saved. User Can Make a Post upload A photo and write
                Some description about it.Users can Like a Post or can Comment a Post.In this
                Manner User can unlike a Post or remove a Comment for Post.Comments will only
                be removed by user who commented or the User who posted can delete the comme-
                -nt.Routes which work with creating a Post,like,comment,unlike,removing comm-
                -ent will have a middleware for authenticating user with JWT Token.

                
## User Registration Routes

### Register
    EndPoint: Post-'/auth/register'
    Description: Allows users to create a new account otp will sent to email & enter otp in the console because this is not production ready.
                 Joi schema validation will be used to validate user details & strong password.Jwt token will be created and stored in Cookies

    Request Body:{
    "email":"user@gmail.com",
    "username":"user786",
    "password":"psk@1234"
    }

### Login
     EndPoint: Post-'/auth/login'
     Description: user can login with this route.If user Exists It will Create Jwt Tokens. One token valid for 10 Mins and another Refresh Token
                  last for One day. These tokens will stored in Cookies

     Request Body:{
     "username":"user786",
     "password":"psk@1234"
     }

### logout
     EndPoint: Delete-'/auth/logout'
     Description: user can logout and jwt tokens will revoked. In case if anyone wants to login with same tokens will not permitted to use apis

     Request Body:{
     "username":"user786"
     }

## BlogPost Routes

### Get All Posts
     EndPoint: Get-'/api/v1/blogposts/getAll'
     Description: users can get All posts that were created by all users

### Create A Post
      EndPoint: Post-'/api/v1/blogposts/createPost'
      Description: User Can create Post by uploading a photo or multiple photos.There is no restriction for file format and size of files
      as it was not meant for production Ready.form input fields must be sent to create post. form input fields:username,description,files

      Request Body:{
      }
      username:user786
      description: some content to write
      files: somfil.png
      files: phic.jpeg

 ### Delete A Post
      EndPoint: Delete-'/api/v1/blogposts/:id'
      Description: The user can delete a post by ID. Post can be deleted Only by the user Who created It
      Request Body:{
      "username": "user786"
      }
### Get A Post
     EndPoint: Get-'/api/v1/blogposts/:id'
     Description: The user can get a Post by its ID.

## LIKE AND COMMENT ROUTES

### Like A Post
     EndPoint: Post-'api/v1/like/post/:id/like
     Description: The user can like a post. In the URL endpoint, we pass the post ID.

### Likes For Post
     Endpoint: GET- 'api/v1/like/post/:id/getLikes'
     Description: The User can get a count of Likes for a Post and the Usernames who liked the post.we need to pass post ID in Url

### Unlike A Post
     Endpoint: Delete-'api/v1/like/post/:id/unlike'
     Description: The user can unlike a post and it will be updated in the post document.

### Comment A Post
     Endpoint: Post-'api/v1/comment/post/:id/comment'
     Description:users can comment multiple times for a post.As mentioned below Json Body must be sent.pass Post Id in the url. 
     Request Body:{
     "username": "Mani786",
     "comment": "some comment to write"
     }

### Get All Comments
     Endpoint:Get-'api/v1/comment/post/:id/getAllcomments'
     Description: User can query all comments for a Post by ID

### Delete A comment
     Endpoint: Delete-'api/v1/comment/:id/deleteComment'
     Description: user can delete a comment By passing same comment & username in request body or by commentId User can delete a comment.
     Request Body:{
     "commentId":"6561eabb9b990e5af539eabe"   
     "username": "user@786"
     }
     or
     request Body:{
     "comment": "some comment"
     "username": "user@786"
     }
     
      


