const Url = require('../models/url');
const axios = require('axios');
const cheerio = require('cheerio');
const url = require('../models/url');

exports.newUrl = async(req, res) => {
    if (req.body.liveurl) {
        await Url.find({ liveurl: req.body.liveurl }).then(async(value) => {
            if (value.length > 0) {
                req.session.urlId = value[0]._id;
                res.send('exist');
            } else {
                await axios.get(req.body.liveurl).then(async response => {
                    const $ = cheerio.load(response.data);
                    const urldata = $('script').first().next().text();
                    const livedata = JSON.parse(urldata);
                    try {
                        const datetime = new Date(new Date(livedata.dateCreated).toLocaleString("en-US", { timeZone: "Asia/Jakarta" }).toString());

                        const date = (Number(datetime.getDate()) < 10 ? "0" + datetime.getDate() : datetime.getDate()) + "/" +
                            ((Number(datetime.getMonth()) + 1) < 10 ? "0" + (Number(datetime.getMonth()) + 1) : (Number(datetime.getMonth()) + 1)) +
                            "/" + datetime.getFullYear();
                        const time = (datetime.getHours() < 10 ? ("0" + datetime.getHours()) : datetime.getHours()) + ":" + (
                            datetime.getMinutes() < 10 ? ("0" + datetime.getMinutes()) : datetime.getMinutes());
                        const url = new Url({
                            pageId: req.session.pageId,
                            liveurl: req.body.liveurl,
                            date: date,
                            time: time
                        })

                        await url.save().then((value) => {
                            req.session.urlId = value._id
                            res.send({
                                commentCount: livedata.commentCount,
                                authorId: livedata.author.identifier
                            })
                        }).catch(() => {
                            res.send(false)
                        })
                    } catch (error) {
                        res.send(false);
                    }
                })
            }
        })
    }
}

exports.getUrl = (req, res) => {
    Url.find({ pageId: req.session.pageId }).then((value) => {
        res.send(value);
    }).catch(() => {
        res.send();
    })
}

exports.deleteUrl = (req, res) => {
    if (req.body.id) {
        url.findByIdAndDelete({ _id: req.body.id }).then(() => {
            res.send(true)
        }).catch(() => {
            res.send(false)
        })
    } else {
        res.redirect('/tableurl');
    }
}

exports.saveUrlId = (req, res) => {
    if (req.body.urlId) {
        req.session.urlId = req.body.urlId;
        res.send(true);
    }
}