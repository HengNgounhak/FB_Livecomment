document.getElementById('more').style.display = "none";
document.getElementById('list').style.display = "none";

function toAddNewPage() {
    document.getElementById('formNewPage').style.display = '';
    document.getElementById('newPage').style.display = 'none';
}

function cancelAddNewPage() {
    document.getElementById('newPageName').value = '';
    document.getElementById('formNewPage').style.display = 'none';
    document.getElementById('newPage').style.display = 'block';
}

async function submitNewPage() {
    const pageName = document.getElementById('newPageName').value;
    const pageStatus = document.getElementById('newPageStatus').value;
    if (pageName) {
        await axios.post('/newpage', {
            name: pageName,
            status: pageStatus
        }).then(() => {
            document.location.href = "/tablepage";
        })
    }
}

function editPage(id) {
    document.getElementById('form' + id.substring(1)).style.display = '';
    document.getElementById('tr' + id.substring(1)).style.display = 'none';
}

function cancelEditPage(id, name) {
    document.getElementById('newPageName' + id.substring(1)).value = name;
    document.getElementById('form' + id.substring(1)).style.display = 'none';
    document.getElementById('tr' + id.substring(1)).style.display = '';
}

async function submitEditPage(id) {
    const pageName = document.getElementById('newPageName' + id.substring(1)).value;
    const pageStatus = document.getElementById('newPageStatus' + id.substring(1)).value;
    if (pageName) {
        await axios.post('/editpage', {
            id: id.substring(1),
            name: pageName,
            status: pageStatus
        }).then(() => {
            document.location.href = "/tablepage";
        })
    }
}

async function tourl(id) {
    await axios.post('/savepageid', { pageId: id }).then((value) => {
        if (value.data) {
            document.location.href = "/tableurl";
        }
    })
}

async function getUserPage() {
    var url = new URL(window.location.href);
    var fbId = url.searchParams.get("fbId");
    if (fbId) {
        await axios.post('/getuserpage', { fbId: fbId }).then((value) => {
            const parent = document.getElementById('tablePage');
            if (value.data.length > 0) {
                value.data.forEach((value) => {
                    const child = document.createElement('tr');
                    child.id = 'tr' + value._id;
                    child.innerHTML = `
                <td scope="row" onclick="tourl('${value._id}')">${value.name}</td>
                <td onclick="tourl('${value._id}')">${value.status}</td>
                <td><i id="@${value._id}" onclick="editPage(this.id)" class="fas fa-edit"></i><i id="${value._id}" onclick="deletePage(this.id, '${value.name}')" class="fas fa-trash-alt ml-2"></i></td>
                `

                    const child2 = document.createElement('tr');
                    child2.id = 'form' + value._id;
                    child2.style.display = 'none';
                    const selectE = value.status == "Enable" ? "selected" : "";
                    const selectD = value.status == "Disable" ? "selected" : "";
                    child2.innerHTML = `
                <td scope="row"><input type="text" class="form-control form-control-sm" id="newPageName${value._id}" value="${value.name}" placeholder="Page name"></td>
                <td>
                    <select class="custom-select custom-select-sm" id="newPageStatus${value._id}" >
                        <option value="Enable" ${selectE}>Enable</option>
                        <option value="Disable" ${selectD}>Disable</option>
                    </select>
                </td>
                <td class="h5 align-middle"><i id="&${value._id}" onclick="cancelEditPage(this.id, '${value.name}')" class="fas fa-times text-danger"></i><i id="0${value._id}" onclick="submitEditPage(this.id)" class="fas fa-check text-success ml-2"></i></td>
            `
                    parent.appendChild(child);
                    parent.appendChild(child2);
                })
            } else {
                const child = document.createElement('tr');
                child.innerHTML = "<td>Empty</td><td>Empty</td><td>Empty</td>";
                parent.appendChild(child);
            }
        })
    } else {
        window.history.back();
    }
}

function deletePage(id, pagename) {
    const parent = document.getElementById('modelDelete');
    const child = document.createElement('p');
    child.className = 'text-danger text-break';
    child.innerText = "Do you want to delete page " + pagename + " ?";
    parent.appendChild(child);
    document.getElementById('toDelete').click();
    $("body").one('click', '#agree', async function() {
        await axios.post('/deletepage', {
            id: id
        }).then((value) => {
            if (value.data) {
                document.getElementById('tr' + id).remove();
                tocancelmodel(); //to remove old text in model
            }
        })
    })
}


getUserPage()