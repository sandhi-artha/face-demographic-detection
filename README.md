Detect where faces are in an image and store them in database
link: https://sandhi-artha.github.io/face-demographic-detection/

Directions
 - register with any name and password, email must be unique, sign in if you've created one before
 - Paste a link and click detect button to detect a face in that image
 or
 - Take a screenshot of an image, copy to clipboard and paste in the input box, then hit detect

Updates:
1. just realized filesystems in Heroku are ephemeral, so it deletes static files (stored images and blobs) every reset and every cycling. eventhough user files are stored in db, it failed to retrieve the image static urls refered in the db
2. working to create branched version without database and routings, only the face detection with added feature of downloading the image and cropped face, will be named: face-cropper++

Icons by Icons8
