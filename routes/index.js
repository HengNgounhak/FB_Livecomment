const express = require('express');
const router = express.Router();
const home = require('../controllers/home');
const page = require('../controllers/page');
const url = require('../controllers/url');
const comment = require('../controllers/comment');

router.get('/', home.home);
router.post('/user', home.loginUser);
router.post('/checkuser', home.checkUser);
router.post('/newuser', home.newUser);
router.get('/getuser', home.getUser);
router.get('/getalluser', home.getAllUser);
router.post('/deleteuser', home.deleteUser);
router.post('/edituser', home.editUser);

router.post('/newpage', page.newPage);
router.get('/getpage', page.getPage);
router.post('/getuserpage', page.getUserPage);
router.post('/deletepage', page.deletePage);
router.post('/editpage', page.editPage);
router.post('/savepageid', page.savePageId);

router.post('/savenew', url.newUrl);
router.get('/geturl', url.getUrl);
router.post('/deleteurl', url.deleteUrl);
router.post('/saveurlid', url.saveUrlId);

router.post('/getcomment', comment.getAllComment);
router.get('/gettablecomment', comment.getComment);
router.post('/deletecomment', comment.deleteComment);

router.get('/price', (req, res) => {
    if (req.session.user) {
        res.render('price');
    } else {
        res.redirect('/')
    }
});

router.get('/page', (req, res) => {
    if (req.session.user) {
        res.render('page');
    } else {
        res.redirect('/')
    }
});

router.get('/livecomment', (req, res) => {
    if (req.session.user) {
        res.render('livecomment');
    } else {
        res.redirect('/')
    }
});

router.get('/tableurl', (req, res) => {
    if (req.session.user) {
        res.render('tableurl');
    } else {
        res.redirect('/')
    }
});

router.get('/comment', (req, res) => {
    if (req.session.user) {
        res.render('tablecomment');
    } else {
        res.redirect('/')
    }
});

router.get('/user', (req, res) => {
    if (req.session.user) {
        if (req.session.usertype == "Admin") {
            res.render('tableuser');
        } else {
            res.redirect('/page')
        }

    } else {
        res.redirect('/')
    }
});

router.get('/tablepage', (req, res) => {
    if (req.session.user) {
        if (req.session.usertype == "Admin") {
            res.render('tablepage');
        } else {
            res.redirect('/page')
        }

    } else {
        res.redirect('/')
    }
});

router.post('/ifsameuser', (req, res) => {
    if (req.body.fbId) {
        if (req.session.user.fbId == req.body.fbId) {
            res.send(true)
        } else {
            req.session.destroy();
            res.send(false)
        }
    }
})

router.get('/logout', (req, res) => {
    // clear session
    req.session.destroy();
    res.send('success');
})

router.post('/appID', (req, res) => {
    res.send(process.env.CLIENTID);
})

router.get('/privacy', (req, res) => {
    // if (req.session.user) {
    //     res.render('tablepage');
    // } else {
    //     res.redirect('/')
    // }
    res.render('privacy');
});

router.get('/term', (req, res) => {
    // if (req.session.user) {
    //     res.render('tablepage');
    // } else {
    //     res.redirect('/')
    // }
    res.render('term');
});

module.exports = router;