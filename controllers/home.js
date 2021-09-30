const jwt = require('jsonwebtoken');
// const secret = "1234567890";
const User = require('../models/user');

exports.home = (req, res) => {
    res.render("home");
}

exports.loginUser = (req, res) => {
    const myUser = {
        fbId: req.body.fbId,
        username: req.body.username,
        email: req.body.email
    }

    const token = jwt.sign({
        data: myUser
    }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 * 4 });

    res.cookie('me', token, { expire: 3600 * 1000 * 24 });
    // store user information to session
    req.session.user = myUser;

    res.send('success');
}

exports.checkUser = (req, res) => {
    if (req.body.fbId) {
        User.find({ fbId: req.body.fbId }).then((value) => {
            if (value.length > 0) {
                User.findOneAndUpdate({ fbId: req.body.fbId }, { useFindAndModify: false }).then(user => {
                    // console.log(user);
                    if (user) {
                        user.username = req.body.username;
                        user.email = req.body.email;
                        res.send(true)
                        return user.save();
                    } else {
                        res.send(false)
                    }
                }).catch(err => {
                    res.send(false);
                })
            } else {
                res.send(false)
            }
        })

    } else {
        res.redirect('/');
    }
}

exports.newUser = async(req, res) => {
    if (req.body) {
        const user = new User({
            fbId: req.body.fbId,
            username: req.body.username,
            email: req.body.email,
            telephone: req.body.telephone,
            address: req.body.address,
            type: "Temporary",
            status: "Enable"
        })

        await user.save().then(() => {
            res.send(true)
        }).catch((err) => {
            console.log(err);
        })
    }

}

exports.getUser = (req, res) => {
    User.find({ fbId: req.session.user.fbId }).then((value) => {
        req.session.usertype = value[0].type;
        res.send(value[0]);
    }).catch(() => {
        res.send();
    })
}

exports.getAllUser = (req, res) => {
    User.find().then((value) => {
        res.send(value);
    }).catch(() => {
        res.send();
    })
}

exports.deleteUser = (req, res) => {
    if (req.body.id) {
        User.findByIdAndDelete({ _id: req.body.id }).then(() => {
            res.send(true)
        }).catch(() => {
            res.send(false)
        })
    } else {
        res.redirect('/user');
    }
}

exports.editUser = (req, res) => {
    User.findByIdAndUpdate(req.body.id).then((value) => {
        // value.username = req.body.username;
        // value.email = req.body.email;
        value.telephone = req.body.telephone;
        value.address = req.body.address;
        value.type = req.body.type;
        value.status = req.body.status;
        res.send(true);
        return value.save();
    })
}