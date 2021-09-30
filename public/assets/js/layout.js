let fbId, username, email, token;

function tocancelmodel() {
    const text = document.getElementsByClassName('text-danger text-break');
    for (var i = 0; i < text.length; i++) {
        text[i].remove();
    }
}

if ((window.location.pathname != '/') && (window.location.pathname != '/term') && (window.location.pathname != '/privacy')) {
    userProfile()
}

window.fbAsyncInit = async function() {
    await axios.post('/appID').then((result) => {
        if (result.data) {
            // console.log(result.data)
            FB.init({
                appId: result.data,
                cookie: true,
                xfbml: true,
                version: 'v11.0'
            });

            FB.getLoginStatus(function(response) {
                statusChangeCallback(response);
            });
        }
    })
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response) {
    if (response.status === 'connected') {
        token = response.authResponse.accessToken;
        console.log('Logged in and authenticated');
        setElements(true);
        testAPI();
    } else {
        console.log('Not authenticated');
        setElements(false);
    }
}


function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

function setElements(isLogin) {
    if (isLogin) {
        document.getElementById("btnLogin").style.display = 'none';
        document.querySelector("#list > li").style.display = 'inline';
        document.getElementById("more").style.display = 'block';
        document.getElementById("usericon").style.display = 'block';

    } else {
        document.getElementById("btnLogin").style.display = 'block';
        document.getElementById("list").style.display = 'none';
        document.getElementById("more").style.display = 'none';
        document.getElementById("usericon").style.display = 'none';
    }
}

async function logout() {
    await axios.get('/logout').then((result) => {
        if (result.data) {
            FB.logout(function(respone) {
                // console.log(respone);
                if (respone) {
                    setElements(false);
                    document.location.href = "/";
                }
            })
        }
    })
}

async function testAPI() {
    await FB.api('/me?fields=name,email,picture.type(large)', async function(response) {
        // console.log(response);
        if (response && !response.error) {
            username = response.name;
            email = response.email;
            fbId = response.id;

            if (window.location.pathname == '/') {
                try {
                    await getUser(fbId, username, email);
                } catch (error) {
                    console.log(error);
                }
            }

            if ((window.location.pathname != '/') && (window.location.pathname != '/term') && (window.location.pathname != '/privacy')) {
                await axios.post('/ifsameuser', { fbId: fbId }).then((value) => {
                    if (!value.data) {
                        setElements(false);
                        document.location.href = "/";
                    }
                })
            }
        }
    })
}

async function moreInformation() {
    document.getElementById('btnLogin').click();
    document.getElementById('modelMoreInformation').style.display = 'inline';
    document.getElementById('modelFBLogin').style.display = 'none';
    const form = document.getElementById('moreInformationForm');
    await form.addEventListener('submit', async e => {
        e.preventDefault();
        const telephone = e.target.usertelephone.value;
        const address = e.target.useraddress.value;
        await newUser(fbId, username, email, telephone, address)
    })
}

async function userProfile() {
    await axios.get('/getuser').then((response) => {
        if (response.data.email) {
            document.getElementById('email').innerText = response.data.email;
        }
        document.getElementById('username').innerText = response.data.username;
        document.getElementById('mytelephone').innerText = response.data.telephone;
        document.getElementById('myaddress').innerText = response.data.address;
    })
}