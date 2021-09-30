document.getElementsByClassName('toliveurl')[0].style.display = 'none';
document.getElementsByClassName('toliveurl')[1].style.display = 'none';
document.getElementById("btnLogin").style.display = 'none';

async function toComment(id) {
    await axios.post('/saveurlid', { urlId: id }).then((value) => {
        if (value.data) {
            document.location.href = "/comment";
        }
    })
}

async function getUrl(usertype) {
    await axios.get('/geturl').then((value) => {
        const parent = document.getElementById('tableurl');
        const type = usertype == "Admin" ? '' : 'class="d-none"'
        if (value.data.length > 0) {
            value.data.forEach((value) => {
                const child = document.createElement('tr');
                child.id = 'tr' + value._id;
                child.innerHTML = `
                    <td scope="row" onclick="toComment('${value._id}')" class="text-break">${value.liveurl}</td>
                    <td onclick="toComment('${value._id}')">${value.date}</td>
                    <td onclick="toComment('${value._id}')">${value.time}</td>
                    <td ${type}><i id="${value._id}" onclick="deleteUrl(this.id, '${value.liveurl}')" class="fas fa-trash-alt"></i></td>
                `

                parent.appendChild(child);
            })
        } else {
            const child = document.createElement('tr');
            if (usertype == "Admin") {
                child.innerHTML = '<td>Empty</td><td>Empty</td><td>Empty</td><td>Empty</td>';
            } else {
                child.innerHTML = '<td>Empty</td><td>Empty</td><td>Empty</td>';
            }

            parent.appendChild(child);
        }
    })
}

function deleteUrl(id, url) {
    const parent = document.getElementById('modelDelete');
    const child = document.createElement('p');
    child.className = 'text-danger text-break';
    child.innerText = "Remove " + url + " ?";
    parent.appendChild(child);
    document.getElementById('toDelete').click();
    $("body").one('click', '#agree', async function() {
        await axios.post('/deleteurl', {
            id: id
        }).then((value) => {
            if (value.data) {
                document.getElementById('tr' + id).remove();
                tocancelmodel(); //to remove old text in model
            }
        })
    })
}

async function typeuser() {
    await axios.get('/getuser').then((value) => {
        value.data.type != "Admin" ? document.getElementById('editColumn').style.display = "none" : "";
        getUrl(value.data.type)
    })
}

typeuser();