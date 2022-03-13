Exam:  
For User Collection:
. Roles( User, Admin ,SuperAdmin)
•Signup 
-  username , email , password ,     cPassword , phone , location ,  role default: user) 
- joi  validation
- Hash password and encrypt phone number 
- send verification email and pdf attachment before sign in )
   
•Signin
-  (email ,password) 
- (Joi validation)
- (compare password , generate token for logged in user)
   
•Update profile  
- (User must be login first and have valid token)
- Joi validation

•Update password
-  (old password , newPassword , cNewPassword) 
- ( the account owner only can change the password) 
- Joi validation

. forget password

. Block User
-  ( by admin and super admin) 

•user can deactivate his account
- by account owner only 

Admin(inserted manual first time in DB by superAdmin only )( in other word ,only super admin can add admins) 


For Admins collection: 
•	Add Admin
- ( Joi Validation) 
- ( send verification email before sign in  as an admin ) 
•	Get admin list (superAdmin only)
•	Delete admin( superAdmin only)
.     Updates admin 
 
For Posts Collection: 
•Create Post (title , desc , createdBy => ref :User) (Joi validation)
•edit post (Joi validation)(by post owner only)
•delete post( Joi validation)( post owner and admin) 
•user get  profile posts(post owner and admin)
•get posts ( User create the post must has activated account and not blocked by the admin or superadmin )   
.get all posts( admin and super admin)


For Reported Collection: 
•user can report posts with 
- ( userID , postID ,  reportComment
- (Joi validation)
•Review reported posts and take action to block post or not( admin and superadmin) 

**important note all data must run under validation using Joi ( body , param , query) 
Must user be signing and  have token to do any of this based on his role
** apply pagenation , search and find services on whole project
