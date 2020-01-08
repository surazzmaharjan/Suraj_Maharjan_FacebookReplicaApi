const express = require('express');
const User = require('../models/user')
const TimeLine = require('../models/timelinedata')
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require("path");
const router = new express.Router()
const bcrypt = require('bcrypt');

/*
* to upload image in uploads directory
*/
const storage = multer.diskStorage({
     destination: "./public/uploads",
     filename: (req, file, callback) => {
         let ext = path.extname(file.originalname);
         callback(null,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      `${file.fieldname}-${Date.now()}${ext}`);
     }
 });
 
 const imageFileFilter = (req, file, cb) => {
     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
         return cb(new Error("You can upload only image files!"), false);
     }
     cb(null, true);
 };
 
 const upload = multer({
     storage: storage,
     fileFilter: imageFileFilter
 })
 




/*
* register data of user
*/

 router.post("/register", (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    var myData = new User(req.body);
    myData.save().then(function(){
         res.json('User register successfully');
    }).catch(function(e){
    
    if (e.name === 'ValidationError'){
         return res.status(500).json({ message: 'Email is already taken' })

    }else{
         res.send(e)
    }
    });
});


/*
*  upload image in directory of user
*/

router.post("/upload",upload.single('profileimage'), (req, res) => {
    res.json(req.file);
 
});



/*
* verify email and password for login
*/

 router.post('/apilogin', (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user == null) {
                let err = new Error('Email not found!');
                err.status = 401;
                return next(err);
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then((isMatch) => {
                        if (!isMatch) {
                            let err = new Error('Password does not match!');
                            err.status = 400;
                            return next(err);
                        }
                        let token = jwt.sign({ _id: user._id }, process.env.SECRET);
                        res.json({ status: 'Login success!', token: token });
                    }).catch(next);
            }
        }).catch(next);
})





router.get('/users/me', auth.verifyUser, (req, res, next) => {
    res.json({ _id: req.user._id, firstname: req.user.firstname, lastname: req.user.lastname, email: req.user.email, profileimage: req.user.profileimage,gender: req.user.gender,date: req.user.date });
});



router.get('/timelines',auth.verifyUser,(req,res)=>{
    TimeLine.find().then(function(timeline){
         res.json(timeline);
    }).catch(function(e){
     
            res.send(e)
       
    });
    });



router.post("/timelineregister", upload.single('timelineimage'),(req, res) => {
    req.body.timelineimage= req.file.filename;
    var myData = new TimeLine(req.body);
    myData.save().then(function(){
    res.send('inserted successfully');
    }).catch(function(e){
    res.send(e)
    });
});




module.exports=router;