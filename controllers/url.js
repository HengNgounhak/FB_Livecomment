const Url = require('../models/url');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

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
        // await axios.get("https://mobile.facebook.com/imp.Tyyy/videos/4354280941306829").then(async(value) => {
        //         const cheer = await cheerio.load(await value.data);
        //         const urldata = await cheer('script').first().html();

        //         //     if (urldata) {
        //         // const livedata = JSON.parse(urldata);
        //         res.send(urldata);
        //     })
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        const url = 'https://mobile.facebook.com/imp.Tyyy/videos/4354280941306829';
        await page.goto(url);
        await page.waitForSelector(".km676qkl").catch(() => {
            console.log('error waitForSelector')
        });
        // console.log(arrayCmt);
        const item = await page.evaluate(async() => {
            // const cmt = Array.from(document.querySelectorAll("div[class='l9j0dhe7 ll8tlv6m rq0escxv j83agx80 pfnyh3mw e5nlhep0 hv4rvrfc dati1w0a ecm0bbzt btwxx1t3 lzcic4wl']")).map(
            //     c => {
            //         // let link = c.querySelector("a[class='oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl gmql0nx0 gpro0wi8']");
            //         return {
            //             // linkUserNId: link.href,
            //             writer: c.querySelector("span[class='d2edcug0 hpfvmrgz qv66sw1b c1et5uql oi732d6d ik7dh3pa ht8s03o8 a8c37x1j keod5gw0 nxhoafnm aigsh9s9 d9wwppkn fe6kdd0r mau55g9w c8b282yb mdeji52x e9vueds3 j5wam9gi lrazzd5p oo9gr5id']").innerText,
            //             comment: c.querySelector("div[class='kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x c1et5uql'] > div") ? c.querySelector("div[class='kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x c1et5uql'] > div").innerHTML : ""
            //         }
            //     }
            // );
            const cmt = document.getElementsByTagName('script');
            return cmt[2]
        })
        res.send(item);
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