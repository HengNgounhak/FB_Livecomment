const Url = require('../models/url');
const axios = require('axios');
const cheerio = require('cheerio');

// exports.newUrl = async(req, res) => {
//     if (req.body.liveurl) {
//         // await Url.find({ liveurl: req.body.liveurl }).then(async(value) => {
//         //     if (value.length > 0) {
//         //         req.session.urlId = value[0]._id;
//         //         res.send('exist');
//         //     } else {
//         try {
//             await axios.get(`${req.body.liveurl.replace('https://www', 'https://mobile')}`).then(async response => {
//                 // res.send("hmmm")
//                 // try {
//                 const ch = await cheerio.load(response.data);
//                 const urldata = await ch('script').first().next().html();

//                 //     if (urldata) {
//                 // const livedata = JSON.parse(urldata);
//                 res.sent(urldata);
//                 // try {
//                 //     const datetime = new Date(new Date(livedata.dateCreated).toLocaleString("en-US", { timeZone: "Asia/Jakarta" }).toString());

//                 //     const date = (Number(datetime.getDate()) < 10 ? "0" + datetime.getDate() : datetime.getDate()) + "/" +
//                 //         ((Number(datetime.getMonth()) + 1) < 10 ? "0" + (Number(datetime.getMonth()) + 1) : (Number(datetime.getMonth()) + 1)) +
//                 //         "/" + datetime.getFullYear();
//                 //     const time = (datetime.getHours() < 10 ? ("0" + datetime.getHours()) : datetime.getHours()) + ":" + (
//                 //         datetime.getMinutes() < 10 ? ("0" + datetime.getMinutes()) : datetime.getMinutes());
//                 //     const myurl = new Url({
//                 //         pageId: req.session.pageId,
//                 //         liveurl: req.body.liveurl,
//                 //         date: date,
//                 //         time: time
//                 //     })

//                 //     try {
//                 //         const result = await myurl.save().then((value) => {
//                 //             req.session.urlId = value._id
//                 //         })
//                 //         if (result) {
//                 //             res.send({
//                 //                 commentCount: livedata.commentCount,
//                 //                 mobileurl: livedata.url
//                 //             })
//                 //         }

//                 //     } catch (error) {
//                 //         res.send(false)
//                 //     }

//                 // } catch (error) {
//                 //     res.send(false);
//                 // }
//                 //     }
//                 // } catch (err) {
//                 //     res.send('false cheerio')
//                 // }
//             }).catch((err) => {
//                 res.send(err);
//             })
//         } catch (error) {
//             res.send(error)
//         }
//         //     }
//         // })
//     }
// }

exports.savenewurl = async(req, res) => {
    if (req.body.liveurl) {
        await axios.get("https://mobile.facebook.com/imp.Tyyy/videos/4354280941306829").then(async(value) => {
            const cheer = await cheerio.load(await value.data);
            const urldata = await cheer('script').first().next().html();

            //     if (urldata) {
            // const livedata = JSON.parse(urldata);
            res.send(await value.data);
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