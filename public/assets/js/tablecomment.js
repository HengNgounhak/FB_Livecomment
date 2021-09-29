document.getElementById("btnLogin").style.display = 'none';
let radios = document.querySelectorAll('.btn-group.btn-group-unselectable input[type="radio"]');
var commentData;
var selectAllComment = true;

radios.forEach(radio => {
    radio.addEventListener('click', function(e) {
        if (this.getAttribute('data-previous-value') == 'true') {
            e.target.checked = false;
        } else {
            radios.forEach(radio => {
                radio.setAttribute('data-previous-value', false)
            });
        }

        this.setAttribute('data-previous-value', e.target.checked);
    });
});

function selectcomment() {
    const item = document.getElementsByClassName('selectfalse');
    for (var i = 0; i < item.length; i++) {
        item[i].style.display = 'none';
    }
    selectAllComment = false;
}

function allcomment() {
    const item = document.getElementsByClassName('selectfalse');
    for (var i = 0; i < item.length; i++) {
        item[i].style.display = '';
    }
    selectAllComment = true;
}

function download() {
    var createXLSLFormatObj = [];

    /* XLS Head Columns */
    var xlsHeader = ["Username", "Comment"];

    /* XLS Rows Data */
    // var commentData = [{
    //     "EmployeeID": "EMP001",
    //     "FullName": "Jolly"
    // }];


    createXLSLFormatObj.push(xlsHeader);
    $.each(commentData, function(index, value) {
        var innerRowData = [];
        if (selectAllComment) {
            innerRowData.push(value.commenter_name);
            innerRowData.push(value.content);
            createXLSLFormatObj.push(innerRowData);
        } else {
            if (value.isSelect) {
                innerRowData.push(value.commenter_name);
                innerRowData.push(value.content);
                createXLSLFormatObj.push(innerRowData);
            }
        }
    });


    /* File Name */
    var filename = "Comment" + Date.now() + ".xlsx";

    /* Sheet Name */
    var ws_name = "Comment";

    var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);

    /* Add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws, ws_name);

    /* Add hyperlink to column username */
    $.each(commentData, function(index, value) {
        if (selectAllComment) {
            if (value.commenter_url) {
                ws[XLSX.utils.encode_cell({
                    c: 0,
                    r: index + 1
                })] = {
                    f: `=HYPERLINK("https://www.facebook.com${value.commenter_url}","${value.commenter_name}")`
                };
            }
        } else {
            if (value.isSelect) {
                if (value.commenter_url) {
                    ws[XLSX.utils.encode_cell({
                        c: 0,
                        r: index + 1
                    })] = {
                        f: `=HYPERLINK("https://www.facebook.com${value.commenter_url}","${value.commenter_name}")`
                    };
                }
            }
        }
    });

    /* Write workbook and Download */
    XLSX.writeFile(wb, filename);
}

async function getComment(usertype) {
    await axios.get('/gettablecomment').then((value) => {
        const type = usertype == "Admin" ? "" : 'class="d-none"';
        const parent = document.getElementById('tablecomment');
        commentData = [];
        commentData = value.data;
        if (value.data.length > 0) {
            value.data.forEach((value) => {
                const child = document.createElement('tr');
                child.id = 'tr' + value._id;
                child.className = `select${value.isSelect}`;
                const link = value.commenter_url ? `href="https://www.facebook.com${value.commenter_url}"` : "";
                const isCheck = value.isSelect ? '<i class="far fa-check-square h5 m-0"></i>' : '<i class="far fa-square h5 m-0"></i>';
                child.innerHTML = `
                    <td scope="row"><a class="dcolor" ${link} target="_blank">${value.commenter_name}</a></td>
                    <td class="text-break">${value.content}</td>
                    <td>${isCheck}</td>
                    <td ${type}><i id="${value._id}" onclick="deleteComment(this.id, '${value.commenter_name}')" class="fas fa-trash-alt"></i></td>
                `

                parent.appendChild(child);
            })
        } else {
            const child = document.createElement('tr');
            child.innerHTML = "<td>Empty</td><td>Empty</td><td>Empty</td><td>Empty</td>";
            parent.appendChild(child);
            // console.log("////")
        }
    })
}

function deleteComment(id, commenter) {
    const parent = document.getElementById('modelDelete');
    const child = document.createElement('p');
    child.className = 'text-danger text-break';
    child.innerText = "You want to delete comment by " + commenter + " ?";
    parent.appendChild(child);
    document.getElementById('toDelete').click();

    $("body").one('click', '#agree', async function() {
        await axios.post('/deletecomment', {
            id: id
        }).then((value) => {
            if (value.data) {
                for (var i = 0; i < commentData.length; i++) {
                    if (commentData[i]._id == id) {
                        commentData.splice(i, 1);
                    }
                }
                document.getElementById('tr' + id).remove();
                tocancelmodel(); //to remove old text in model
            }
        })

    })
}

async function typeuser() {
    await axios.get('/getuser').then((value) => {
        value.data.type != "Admin" ? document.getElementById('editColumn').style.display = "none" : "";
        getComment(value.data.type)
    })
}

typeuser();