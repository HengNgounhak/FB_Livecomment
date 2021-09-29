const Page = require('../models/page');

exports.newPage = (req, res) => {
    const page = new Page({
        fbId: req.session.user.fbId,
        name: req.body.name,
        status: req.body.status
    })

    page.save().then(() => {
        res.send(true)
    }).catch(() => {
        res.send(false)
    })
}

exports.getPage = (req, res) => {
    Page.find({ fbId: req.session.user.fbId }).then((value) => {
        res.send(value);
    }).catch(() => {
        res.send();
    })
}
exports.getUserPage = (req, res) => {
    Page.find({ fbId: req.body.fbId }).then((value) => {
        res.send(value);
    }).catch(() => {
        res.send();
    })
}

exports.deletePage = (req, res) => {
    if (req.body.id) {
        Page.findByIdAndDelete({ _id: req.body.id }).then(() => {
            res.send(true)
        }).catch(() => {
            res.send(false)
        })
    } else {
        res.redirect('/tablepage');
    }
}

exports.editPage = (req, res) => {
    Page.findByIdAndUpdate(req.body.id).then((value) => {
        value.name = req.body.name;
        value.status = req.body.status;
        res.send(true);
        return value.save();
    })
}

exports.savePageId = (req, res) => {
    if (req.body.pageId) {
        req.session.pageId = req.body.pageId;
        res.send(true);
    }
}