document.getElementById("btnLogin").style.display = 'none';

// document.getElementById('more').setAttribute('style', 'display: none !important');
// document.getElementById('list').setAttribute('style', 'display:  !important');
document.getElementsByClassName('tolivecomment')[0].style.display = 'none';
document.getElementsByClassName('topage')[0].style.display = 'none';
document.getElementsByClassName('toliveurl')[0].style.display = 'none';
document.getElementsByClassName('tolivecomment')[1].style.display = 'none';
document.getElementsByClassName('topage')[1].style.display = 'none';
document.getElementsByClassName('toliveurl')[1].style.display = 'none';

async function getPage() {
    await axios.get('/getpage').then((value) => {
        const parent = document.getElementById('showPageList');
        if (value.data.length > 0) {
            value.data.forEach((value) => {
                const child = document.createElement('div');
                child.innerHTML = `
                <div class="m-2" style="min-width: 230px; min-height: 230px; border: 2px solid #2F86B9">
                    <div class="m-3">
                        <div class="w-100" style="height: 200px; background-image: url('/assets/image/pageIcon.png'); background-position: center; background-repeat: no-repeat; background-size: cover; border-radius: 50%;"></div>
                    </div>
                    <div class="d-bd text-white text-center p-3" style="position: relative;">
                        <p class="m-0" style="max-width: 180px;">${value.name}</p>
                    </div>
                </div>
            `
                child.onclick = async() => {
                    await axios.post('/savepageid', { pageId: value._id }).then((value) => {
                        if (value.data) {
                            document.location.href = "/livecomment";
                        }
                    })
                }
                parent.appendChild(child);
            })
        } else {
            const child = document.createElement('div');
            child.innerHTML = `
            <div class="m-2" style="min-width: 230px; min-height: 230px; border: 2px solid #2F86B9">
            <div class="m-3">
                <div class="w-100" style="height: 200px; background-image: url('/assets/image/pageIcon.png'); background-position: center; background-repeat: no-repeat; background-size: cover; border-radius: 50%;"></div>
            </div>
            <div class="d-bd text-white text-center p-3" style="position: relative;">
                <p class="m-0" style="max-width: 180px;">No page created</p>
            </div>
        </div>
                `;
            parent.appendChild(child);
        }
    })
}

getPage();