document.getElementById('more').style.display = "none";
document.getElementById('list').style.display = "none";

function editUser(id) {
    document.getElementById('form' + id.substring(1)).style.display = '';
    document.getElementById('tr' + id.substring(1)).style.display = 'none';
}

function cancelEditUser(id, username, email, telephone, address) {
    // document.getElementById('newusername' + id.substring(1)).value = username;
    // document.getElementById('newemail' + id.substring(1)).value = email;
    document.getElementById('newtelephone' + id.substring(1)).value = telephone;
    document.getElementById('newaddress' + id.substring(1)).value = address;
    document.getElementById('form' + id.substring(1)).style.display = 'none';
    document.getElementById('tr' + id.substring(1)).style.display = '';
}

async function submitEditUser(id) {
    // const username = document.getElementById('newusername' + id.substring(1)).value;
    // const email = document.getElementById('newemail' + id.substring(1)).value;
    const telephone = document.getElementById('newtelephone' + id.substring(1)).value;
    const address = document.getElementById('newaddress' + id.substring(1)).value;
    const type = document.getElementById('newtype' + id.substring(1)).value;
    const status = document.getElementById('newstatus' + id.substring(1)).value;
    if (username && email && telephone && address && type && status) {
        await axios.post('/edituser', {
            id: id.substring(1),
            // username: username,
            // email: email,
            telephone: telephone,
            address: address,
            type: type,
            status: status
        }).then(() => {
            document.location.href = "/user";
        })
    }
}

function deleteUser(id, username) {

    const parent = document.getElementById('modelDelete');
    const child = document.createElement('p');
    child.className = 'text-danger text-break';
    child.innerText = "Delete user " + username + " ?";
    parent.appendChild(child);
    document.getElementById('toDelete').click();
    $("body").one('click', '#agree', async function() {
        await axios.post('/deleteuser', {
            id: id
        }).then((value) => {
            if (value.data) {
                document.getElementById('tr' + id).remove();
                tocancelmodel(); //to remove old text in model
            }
        })
    })
}

function gotoPage(fbId) {
    document.location.href = "/tablepage?fbId=" + fbId;
}

async function getAllUser() {
    await axios.get('/getalluser').then((value) => {
        const parent = document.getElementById('alluser');
        if (value.data) {
            value.data.forEach((value) => {
                const child = document.createElement('tr');
                child.id = 'tr' + value._id;
                child.innerHTML = `
                    <td scope="row">${value.username}</td>
                    <td>${value.email?value.email:'None'}</td>
                    <td>${value.telephone}</td>
                    <td class="text-break">${value.address}</td>
                    <td>${value.type}</td>
                    <td>${value.status}</td>
                    <td><i id="a${value._id}" onclick="editUser(this.id)" class="fas fa-edit"></i><i id="${value._id}" onclick="deleteUser(this.id, '${value.username}')" class="fas fa-trash-alt ml-2"></i></td>
                `
                    // child.onclick = gotoPage(value.fbId);
                for (var i = 0; i < child.children.length - 1; i++) {
                    child.children[i].onclick = () => {
                        document.location.href = "/tablepage?fbId=" + value.fbId;
                    }
                }

                const child2 = document.createElement('tr');
                child2.id = 'form' + value._id;
                child2.style.display = 'none';
                const selectAdmin = value.type == "Admin" ? "selected" : "";
                const selectClient = value.type == "Client" ? "selected" : "";
                const selectTemporary = value.type == "Temporary" ? "selected" : "";
                const selectE = value.status == "Enable" ? "selected" : "";
                const selectD = value.status == "Disable" ? "selected" : "";
                child2.innerHTML = `
                <td scope="row">${value.username}</td>
                    <td>${value.email}</td>
                <td scope="row"><input type="text" class="form-control form-control-sm" id="newtelephone${value._id}" value="${value.telephone}" placeholder="Telephone"></td>
                <td scope="row"><input type="text" class="form-control form-control-sm" id="newaddress${value._id}" value="${value.address}" placeholder="Address"></td>
                <td>
                    <select class="custom-select custom-select-sm" id="newtype${value._id}" >
                        <option value="Admin" ${selectAdmin}>Admin</option>
                        <option value="Client" ${selectClient}>Client</option>
                        <option value="Temporary" ${selectTemporary}>Temporary</option>
                    </select>
                </td>
                <td>
                    <select class="custom-select custom-select-sm" id="newstatus${value._id}" >
                        <option value="Enable" ${selectE}>Enable</option>
                        <option value="Disable" ${selectD}>Disable</option>
                    </select>
                </td>
                <td class="h5 align-middle"><i id="&${value._id}" onclick="cancelEditUser(this.id, '${value.username}', '${value.email}', '${value.telephone}', '${value.address}')" class="fas fa-times text-danger"></i><i id="0${value._id}" onclick="submitEditUser(this.id)" class="fas fa-check text-success ml-2"></i></td>
            `
                parent.appendChild(child);
                parent.appendChild(child2);
            })
        }
    })
}

getAllUser();