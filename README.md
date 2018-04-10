The website is located at https://afekabook-vadimkot.c9users.io/.

The website was made as a course project. It was made using JQuery, NodeJS, ExpressJS, Bootstrap, Twitter API, IBM ToneAnalyzer and is using MongoDB database. Everything was writting in Cloud9 (Now owned by Amazon and is part of AWS).

The website also has a development version which updates the GitHub. When decided, that version from GitHub is used to update production version.

This is a site which was made in the image of Facebook.

### It has the following features:

* #### Posting posts:  
  * Containing text only.
  * Containing uploaded image and text.
  * Containing images from links and text.
  * With different privacy (private or public).
* #### Editing posts:
  * Changing post text.
  * Change post image, as well as a different source.
  * Editing post privacy.
* #### Commenting on posts:
  * Posting comments to posts.
  * Editing the comments on the posts.
  * Deleting the comments from the post.
* ##### A bot:
  The bot samples a Tweet of a given personality on Twitter (In this case - realDonaldTrump or prattprattpratt) every 12 hours and posts their Tweet content as well as the tone analyzed by IBM ToneAnalyzer in their respective accounts. The amount of posts for the bot is limited to 10 and the oldest one will be deleted.

* ##### Sharing posts:
  Sharing a post will take all the content of the post and post it again, with the author being the current user.
* ##### Liking a post:
  Each post has a like counter which increases or decreases when someone likes or unlikes a post.
* ##### Adding a friend:
  A user can only see posts created by someone they added as a friend and only if said post has been marked as public. Adding friends does not require their permission.
* ##### Searching for users:
  Searching for users is done live and '*' returns everyone. The search however does not return those already added as a friend.
##### How to use the website:
Once a user is registered, they can post anything they would like. Anything marked as "Private" when creating a post will not be shown to any other user, unless later edited to "Public".
To add users, the user will need to search in the search box and then click on the user they would like to add. Searching and adding "realDonaldTrump" will show all the Tweets created when the bot took a sample.
Only the author of the post or the comment can edit or delete them.

### Some extra information:
##### Already created users:

* Username: a, password: a  
* Username: q, password: q  
* Username: w, password: w (A user without anyone added as friends)  
* Username: realDonaldTrump, password: a (The bot)  
* Username: prattprattpratt, password: a (Second bot for when the ToneAnalyzer is unable to analyzed the tone of the Tweet of the first bot)  
