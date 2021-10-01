document.getElementsByClassName('tolivecomment')[0].style.display = 'none';
document.getElementsByClassName('tolivecomment')[1].style.display = 'none';
document.getElementById("btnLogin").style.display = 'none';

const livecommentform = document.getElementById('livecommentform');

livecommentform.addEventListener('submit', async e => {
    e.preventDefault();

    const liveurl = e.target.elements.inputliveurl.value;
    const keyword = e.target.elements.inputKeyword.value;

    if (keyword) {
        getcomment(liveurl, keyword)
    } else {
        document.getElementById('btnConfirm').click();
        $("body").one('click', '#nokeyword', async function() {
            getcomment(liveurl, keyword);
        });
    }

})

async function getcomment(liveurl, keyword) {
    if (liveurl) {
        document.getElementById('btnLoading').click();
        async function saveUrl(resolve, reject) {
            await axios.post('/savenew', { liveurl: liveurl }).then((value) => {
                resolve(value.data);
            }).catch((err) => {
                reject(err);
            })
        }
        let promise = new Promise(function(resolve, reject) {
            saveUrl(resolve, reject);
        })

        promise.then(async(resolve) => {
            if (resolve == 'exist') {
                document.location.href = "/comment";
            } else if (resolve) {
                await axios.post('/getcomment', {
                    keyword: keyword,
                    commentCount: resolve.commentCount,
                    mobileurl: resolve.mobileurl.replace('https://www', 'https://mobile')
                }).then((value) => {
                    if (value.data) {
                        document.location.href = "/comment";
                    }
                }).catch(() => {
                    document.location.href = "/livecomment";
                })
            } else {
                document.getElementById('processing').style.display = 'none';
                document.getElementById('wrongurl').style.display = 'block';
            }
        }).catch((reject) => {
            console.log("err", reject);

        })
    }
}