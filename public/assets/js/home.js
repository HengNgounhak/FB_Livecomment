async function getUser(id, username, email) {
    await axios.post('/checkuser', {
        fbId: id,
        username: username,
        email: email
    }).then(async(result) => {
        if (result.data) {
            await axios.post('/user', {
                fbId: id,
                username: username,
                email: email
            }).then((result) => {
                if (result.data) {
                    document.location.href = "/page";
                }
            }).catch((e) => {
                console.log(e);
            })
        } else {
            document.getElementById('btnLogin').click();
            document.getElementById('modelMoreInformation').style.display = 'inline';
            document.getElementById('modelFBLogin').style.display = 'none';
            const form = document.getElementById('moreInformationForm');
            form.addEventListener('submit', async e => {
                e.preventDefault();
                const telephone = e.target.usertelephone.value;
                const address = e.target.useraddress.value;
                await newUser(fbId, username, email, telephone, address)
            })
        }
    }).catch((e) => {
        console.log(e);
    })
}

async function newUser(fbId, username, email, telephone, address) {
    await axios.post('/newuser', {
        fbId: fbId,
        username: username,
        email: email,
        telephone: telephone,
        address: address
    }).then((result) => {
        if (result.data) {
            document.location.href = "/price";
        }
    }).catch((e) => {
        console.log(e);
    })
}