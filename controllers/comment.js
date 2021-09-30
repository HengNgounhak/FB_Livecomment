const Comment = require('../models/comment');
const cheerio = require('cheerio');
const Url = require('../models/url');
const axios = require('axios');
const fs = require('fs');

// exports.newComment = (req, res) => {
//     const comment = new Comment({
//         urlId: req.body.urlId,
//         commenter_name: req.body.commenter_name,
//         commenter_url: req.body.commenter_url,
//         content: req.body.content
//     })

//     comment.save().then(() => {
//         res.send(true)
//     }).catch(() => {
//         res.send(false)
//     })
// }

exports.getComment = (req, res) => {
    Comment.find({ urlId: req.session.urlId }).then((value) => {
        res.send(value);
    }).catch(() => {
        res.send();
    })
}

exports.deleteComment = (req, res) => {
    if (req.body.id) {
        Comment.findByIdAndDelete({ _id: req.body.id }).then(() => {
            res.send(true)
        }).catch(() => {
            res.send(false)
        })
    } else {
        res.redirect('/comment');
    }
}

exports.getAllComment = async(req, res) => {
    if (req.body) {
        for (var i = 0; i <= req.body.commentCount; i += 10) {
            await axios.get(`${req.body.mobileurl}&p=${i}&refid=52`).then(async response => {

                const $ = await cheerio.load(response.data);
                // console.log($('#m_story_permalink_view').length);
                await $('#m_story_permalink_view').first().find('h3').each(async(i, element) => {
                    if (i > 0 && $(element).text()) {
                        const commenter = $(element).text();
                        const link = $(element).children('a').attr('href');
                        const textcomment = $(element).next().text();

                        const comment = new Comment({
                            urlId: req.session.urlId,
                            commenter_name: commenter,
                            commenter_url: link,
                            content: textcomment,
                            isSelect: req.body.keyword ? ($(element).next().text().toLowerCase().includes(req.body.keyword.toLowerCase()) ? true : false) : false
                        })
                        await comment.save();
                    }
                })

                if (i == (parseInt(req.body.commentCount / 10) * 10)) {
                    res.send(true);
                };

            });

            // res.send(true);
            // console.log(i);
        }
    }

}