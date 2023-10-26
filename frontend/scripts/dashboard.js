
// const data = {
//     Amazon: {
//         url: "https://www.amazon.com",
//         Name: "Yash",
//         Password: "123"
//     },
//     Google: {
//         url: "https://www.google.com",
//         Name: "XYZ",
//         Password: "Secret"
//     }
// }

//-----------------------------------------------------------------------------------------(Getting Data)

async function getData() {
        try {
            let response = await fetch('/get_data', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                }
            });
            
            if(response.ok) {
                let userdata = await response.json();
                localStorage.setItem("userdata", JSON.stringify(userdata));
                getFieldName(userdata)
            } else if(!response.ok) {
                const errorMessage = await response.text();
                window.location.href = "../html/index.html";
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

//-----------------------------------------------------------------------------------------(Adds Values to Content Box)

const contentbox = document.querySelector('.objcontainer')

function updateListGui(field) {
        let content = contentbox.innerHTML.concat(
            `
            <div class="fielddiv" id="${field["fieldname"]}">
            <img id ="${field["fieldname"]}" src="${field["url"]}" onerror="this.onerror=null; this.src='../assets/internet.svg'">
            <p>${field["fieldname"]}</p>
             <button id="${field["fieldname"]}" class="entryview"></button>
             <button id="${field["fieldname"]}" class="editbutton"></button>
            </div>
            `
            )

        contentbox.innerHTML = content; 


        let btns = document.querySelectorAll('.entryview')
        let editbtns = document.querySelectorAll('.editbutton')
        let divs = document.querySelectorAll('.fielddiv')
        divs.forEach(div => {
            div.addEventListener('click', () => {
                updateInfoGui(div.id);
            });
        });
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                updateInfoGui(btn.id);
            });
        });
        editbtns.forEach(btn => {
            btn.addEventListener('click', () => {
                showEditPage(btn.id);
            });
        });       
}


//----------------------------------------------------------------------------------------- Search Bar and Content Formatting

function getFieldName(data) {                       //Gets All Field Values
  let fieldnamearray = []
  for(let field in data){
    let fieldname = field
    fieldnamearray.push(fieldname)
  }
  getDisplayList(fieldnamearray,data);
  //console.log(fieldnamearray)
}

function getFaviconUrl(fieldname,data) {
  let fielddata = data[fieldname]
  let url = fielddata["url"]
  url = url.replace("https://",'')
  faviconlink = `http://www.google.com/s2/favicons?domain=${url}`
  return faviconlink
}

function getDisplayList(fieldnames,userdata){
  contentbox.innerHTML = ''
  for(let i in fieldnames){
    let faviconurl = getFaviconUrl(fieldnames[i],userdata)
    let guidata = {
      fieldname: fieldnames[i],
      url: faviconurl
    }
    updateListGui(guidata)
  }
}

//----------------------------------------------------------------------------------------- Filter Search

const search = document.getElementById('search');

search.addEventListener('keyup', async function() {
    let result = search.value;
    if(result == ""){
        await getData()
    } else {
        getFilterList(result,JSON.parse(localStorage.getItem("userdata")))  
    }
});

function getFilterList(keyword,data) {                       //Gets Filtered Field Values
    let filterarray = []
    for(let field in data){
        if(field.toLowerCase().indexOf(keyword.toLowerCase()) !== -1){
            let fieldname = field
            filterarray.push(fieldname)
        }
    }
    getDisplayList(filterarray,data);
    //console.log(filterarray)
  }

//----------------------------------------------------------------------------------------- "Add Data" Window Logic

const addentry = document.getElementById('addentry')
const entrywindow = document.querySelector('#entrycontainer')

addentry.addEventListener('click', function() {
    entrywindow.classList.toggle("hidden");
    entrywindow.style.display = "flex";
    const otherbutton = document.getElementById('submitdatabtn')
    const editbutton = document.getElementById('submiteditdatabtn')
    const binbutton = document.getElementById('deletedata')
    binbutton.style.display = "none"
    otherbutton.style.display = "block";
    editbutton.style.display = "none";
    const inputbox = document.getElementById("sitenamefield")
    const urlfield = document.getElementById("urlfield")
    inputbox.value = ''
    urlfield.value = "https://"
    addFieldLogic()
})

const exitentrywin = document.getElementById('backbtn')

exitentrywin.addEventListener('click', function() {
    const binbutton = document.getElementById('deletedata')
    binbutton.style.display = "none"
    entrywindow.style.display = "none"
    localStorage.removeItem("editVal")
})

//----------------------------------------------------------------------------------------- Form Behaviour Logic

function addFieldLogic() {
    const forminputs = document.querySelectorAll('.inputfieldpanel div input[type="text"]')
    const formcheckbox = document.querySelectorAll('.inputfieldpanel div input[type="checkbox"]')
    formcheckbox.forEach((checkbox, index) => {
        if(forminputs[index].id=="u_input" || forminputs[index].id=="p_input"){
            forminputs[index].disabled = false
            forminputs[index].value = ''
            checkbox.checked = true;
        } 
        else {
            forminputs[index].disabled = true
            forminputs[index].value = ''
            checkbox.checked = false;
        }

    })
    formcheckbox.forEach((checkbox, index) =>
        checkbox.addEventListener('change', function(){
            forminputs[index].disabled = !checkbox.checked;
            if(forminputs[index].disabled){
                forminputs[index].value = ''
            }
        })
    )
}

//----------------------------------------------------------------------------------------- Form Data Logic

async function submitForm() {
    const form = document.getElementById('formdata')
    const formdata = new FormData(form)
    await formatData(formdata)
}

async function formatData(userdata) {
    const formData = new FormData()
    const objData = {}
    let sitename;
    userdata.forEach((value, key)=>{
        if(key == 'sitename'){
            sitename = value;
        }else {
            objData[key] = value;
        }
    })
    formData.append("entry_name", sitename)
    formData.append("fields", JSON.stringify(objData))
    // console.log(sitename)
    await sendData(formData)
}

//----------------------------------------------------------------------------------------- Post Entry Data to API

const errorlabel = document.querySelector('.fieldcontainer label')

async function sendData(formData){
    try {
        const response = await fetch('/add_entry', {
            method: "POST",
            body: formData 
        });
        if(response.ok){
            confirmation()
            setTimeout(() => {
                entrywindow.style.display = "none"
                localStorage.removeItem("editVal")
            }, 1000);
            await getData()
        }
        if(!response.ok){
            const errorMessage = await response.text();
                errorlabel.textContent = errorMessage
                setTimeout(()=>{
                    errorlabel.textContent = ''
                },3000)
                throw new Error(errorMessage);
        }
    } catch(error){
        console.error(error)
    }  
}

//----------------------------------------------------------------------------------------- Form Data Validation Logic

async function validateData() {
    if(validateSitename() && validateUrl())
        await submitForm();
        return;
}

function validateSitename(){
    const sitename = document.getElementById('sitenamefield').value
    if(sitename =='' || sitename == null){
        errorlabel.textContent = "Enter Sitename!"
        setTimeout(()=>{
            errorlabel.textContent = ''
        },3000)
        return false;
    } else{
        return true;
    }
}

function validateUrl(){
    const url = document.getElementById('urlfield').value
    const urlPattern = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
    if(url == '' || url ==null){
        errorlabel.textContent = "Enter URL!"
        setTimeout(()=>{
            errorlabel.textContent = ''
        },3000)
        return false;
    }else if(!urlPattern.test(url)){
        errorlabel.textContent = "Enter Valid URL!"
        setTimeout(()=>{
            errorlabel.textContent = ''
        },3000)
        return false;
    }else{
        return true;
    }
}

//----------------------------------------------------------------------------------------- Edit Page Logic

function showEditPage(field) {
    entrywindow.classList.toggle("hidden");
    entrywindow.style.display = "flex";
    const otherbutton = document.getElementById('submitdatabtn')
    const editbutton = document.getElementById('submiteditdatabtn')
    const binbutton = document.getElementById('deletedata')
    otherbutton.style.display = "none";
    editbutton.style.display = "block";
    binbutton.style.display = "block";
    const inputbox = document.getElementById("sitenamefield")
    const urlfield = document.getElementById("urlfield")
    inputbox.value = ''
    urlfield.value = ""
    addFieldEditLogic(field)
}

function addFieldEditLogic(field){
    const forminputs = document.querySelectorAll('.inputfieldpanel div input[type="text"]')
    const formcheckbox = document.querySelectorAll('.inputfieldpanel div input[type="checkbox"]')
    const url = document.getElementById('urlfield')
    const sitename = document.getElementById('sitenamefield')
    const userdata = JSON.parse(localStorage.getItem("userdata"))
    localStorage.setItem("editVal", field)

    sitename.value = field
    url.value = userdata[field]["url"]

    formcheckbox.forEach((checkbox, index) => {
        forminputs[index].disabled = true

        switch (forminputs[index].id) {
            case "u_input":
                forminputs[index].value = userdata[field]["Username"] ?? "";
                break;
            case "p_input":
                forminputs[index].value = userdata[field]["Password"] ?? "";
                break;
            case "e_input":
                forminputs[index].value = userdata[field]["Email"] ?? "";
                break;
            case "n_input":
                forminputs[index].value = userdata[field]["PhNumber"] ?? "";
                break;   
        }

        if(forminputs[index].value == ""){
            checkbox.checked = false;
        } else {
            checkbox.checked = true;
        }

        forminputs[index].disabled = !checkbox.checked;
        checkbox.addEventListener('change', function(){
            forminputs[index].disabled = !checkbox.checked;
            if(forminputs[index].disabled){
                forminputs[index].value = ''
            }
        })

    })

}

//----------------------------------------------------------------------------------------- Edit Data Validation

async function validateDataEdit() {
    if(validateEditSitename() && validateEditUrl())
        await editData();
        return;
}

function validateEditSitename(){
    const sitename = document.getElementById('sitenamefield').value
    if(sitename =='' || sitename == null){
        errorlabel.textContent = "Enter Sitename!"
        setTimeout(()=>{
            errorlabel.textContent = ''
        },3000)
        return false;
    } else{
        return true;
    }
}

function validateEditUrl(){
    const url = document.getElementById('urlfield').value
    const urlPattern = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
    if(url == '' || url ==null){
        errorlabel.textContent = "Enter URL!"
        setTimeout(()=>{
            errorlabel.textContent = ''
        },3000)
        return false;
    }else if(!urlPattern.test(url)){
        errorlabel.textContent = "Enter Valid URL!"
        setTimeout(()=>{
            errorlabel.textContent = ''
        },3000)
        return false;
    }else{
        return true;
    }
}

//----------------------------------------------------------------------------------------- Delete Entry Button

async function deleteEntry() {
    const formData = new FormData()
    formData.append("entry_name", localStorage.getItem("editVal"))
    try {
        const response = await fetch('/delete_entry', {
            method: "POST",
            body: formData 
        });
        if(response.ok){
            console.log(`Deleted ${localStorage.getItem("editVal")}`)
            localStorage.removeItem("editVal")
            await getData()
            confirmation()
            const infobox = document.querySelector('.infobox')
            const infopanel = document.querySelector('.infopanel')
            const popupdivparent = document.querySelector('.popupdivparent')
            const popupdiv = document.querySelector('.popupdivchild')
            entrywindow.style.display = "none"
            infobox.style.display = 'flex'
            infopanel.style.display = 'none'
            popupdivparent.style.display = "none"
            popupdiv.innerHTML = ''
        }
        if(!response.ok){
            isError = true
            const errorMessage = await response.text();
                errorlabel.textContent = errorMessage
                setTimeout(()=>{
                    errorlabel.textContent = ''
                },3000)
                throw new Error(errorMessage);
        }
    } catch(error){
        console.error(error)
    }
}

//----------------------------------------------------------------------------------------- Delete Entry Popup

function deleteEntryConfirm() {
    const popupdivparent = document.querySelector('.popupdivparent')
    const popupdiv = document.querySelector('.popupdivchild')
    popupdivparent.style.display = "flex"
    popupdiv.innerHTML = "<div class='c1f'><label>Are You Sure?</label></div>\n <div class='c1l'><button onclick='await deleteEntry()'>Yes</button> <button onclick='closePopup()'>No</button></div>"
}

//----------------------------------------------------------------------------------------- Change Pass Entry Popup

function changePassConfirm() {
    const popupdivparent = document.querySelector('.popupdivparent')
    const popupdiv = document.querySelector('.popupdivchild')
    popupdivparent.style.display = "flex"
    popupdiv.innerHTML = "<div class='c2'><input id='c2i1' placeholder='Enter Password' type='password'></input><input id='c2i2' placeholder='Confirm Password' type='password'></input><label id='passerrlabel'></label><button id='changepassbtn' onclick='await changePass()'>Submit</button></div>"
}

async function changePass() {
    const password = document.getElementById('c2i1').value
    const confirmpassword = document.getElementById('c2i2').value
    const errlabel = document.getElementById('passerrlabel')
    if(password != confirmpassword){
        errlabel.textContent = "Password Must Match!"
        setTimeout(()=>{
            errlabel.textContent = ''
        },3000)
    } 
    else if(password==""|| confirmpassword==""){
        errlabel.textContent = "Password Can't Be Blank!"
        setTimeout(()=>{
            errlabel.textContent = ''
        },3000)
    }
    else if(password == confirmpassword){
        await sendPass(password)
    }
}

async function sendPass(password) {
    const errlabel = document.getElementById('passerrlabel')
    const formData = new FormData()
    formData.append("password", password)
    try {
        const response = await fetch('/change_password', {
            method: "POST",
            body: formData 
        });
        if(response.ok){
            console.log(`Password Changed!`)
            confirmation()
            const popupdivparent = document.querySelector('.popupdivparent')
            const popupdiv = document.querySelector('.popupdivchild')
            popupdivparent.style.display = "none"
            popupdiv.innerHTML = ''
        }
        if(!response.ok){
            isError = true
            const errorMessage = await response.text();
                errlabel.textContent = errorMessage
                setTimeout(()=>{
                    errlabel.textContent = ''
                },3000)
                throw new Error(errorMessage);
        }
    } catch(error){
        console.error(error)
    }   
}

//----------------------------------------------------------------------------------------- Edit Data Submission Logic

async function editData() {
    const backbtn = document.getElementById('backbtn')
    const submitbtn = document.getElementById('submiteditdatabtn')
    const binbutton = document.getElementById('deletedata')
    binbutton.disabled = true
    backbtn.disabled = true
    submitbtn.disabled = true
    const form = document.getElementById('formdata')
    const formeditdata = new FormData(form)
    await editDataHandler(formeditdata)
}

let isError;

async function editDataHandler(editdata) {
    const objData = {}
    const userdata = JSON.parse(localStorage.getItem("userdata"))
    const entryname = localStorage.getItem("editVal")
    let sitename; //from edit data
    editdata.forEach((value, key)=>{
        if(key == 'sitename'){
            sitename = value;
        }else {
            objData[key] = value;
        }
    })

    const properties = ["Username", "Email", "PhNumber", "Password"]
    for(let property of properties){
        if(!(property in objData)){
            objData[property] = ""
        }
    }

    // console.log(objData)
    isError = false

    for(let field in objData){
        if (objData.hasOwnProperty(field)) {

            let value = objData[field]

            if(!(field in userdata[entryname])){
                await addNewField(entryname, field, value)
            } 
            else if(value != userdata[entryname][field]){
                await editFieldValue(entryname, field, value )
            } 

        }
    }

    if(sitename != entryname){
        await changeEntryName(entryname, sitename)
    }
    await getData()
    if(!isError){
        updateInfoGui(localStorage.getItem("editVal"))
        confirmation()
        setTimeout(() => {
            entrywindow.style.display = "none"
            binbutton.style.display = "none"
            localStorage.removeItem("editVal")
        }, 1000);
        const backbtn = document.getElementById('backbtn')
        const submitbtn = document.getElementById('submiteditdatabtn')
        const binbutton = document.getElementById('deletedata')
        binbutton.disabled = false
        backbtn.disabled = false
        submitbtn.disabled = false
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//----------------------------------------------------------------------------------------- Edit Data API Logic

async function addNewField(sitename, field, value) {
    const formData = new FormData()
    formData.append("entry_name", sitename)
    formData.append("field_name", field)
    formData.append("field_value", value)

    try {
        const response = await fetch('/add_field', {
            method: "POST",
            body: formData 
        });
        if(response.ok){
            console.log(`Added Field: ${field}, with Value "${value}"`)
        }
        if(!response.ok){
            isError = true
            const errorMessage = await response.text();
                errorlabel.textContent = errorMessage
                setTimeout(()=>{
                    errorlabel.textContent = ''
                },3000)
                throw new Error(errorMessage);
        }
    } catch(error){
        console.error(error)
    }     
    
}

async function editFieldValue(sitename, field, value) {
    const formData = new FormData()
    formData.append("entry_name", sitename)
    formData.append("field_name", field)
    formData.append("field_value", value)

    try {
        const response = await fetch('/edit_field_value', {
            method: "POST",
            body: formData 
        });
        if(response.ok){
            console.log(`Changed Value of Field: ${field} to "${value}"`)
        }
        if(!response.ok){
            isError = true
            const errorMessage = await response.text();
                errorlabel.textContent = errorMessage
                setTimeout(()=>{
                    errorlabel.textContent = ''
                },3000)
                throw new Error(errorMessage);
        }
    } catch(error){
        console.error(error)
    }  
}

async function changeEntryName(entryname, sitename) {
    const formData = new FormData()
    formData.append("old_entry_name", entryname)
    formData.append("new_entry_name", sitename)

    try {
        const response = await fetch('/edit_entry_name', {
            method: "POST",
            body: formData 
        });
        if(response.ok){
            console.log(`Changed EntryName from ${entryname} to "${sitename}"`)
            localStorage.setItem("editVal", sitename)
        }
        if(!response.ok){
            isError = true
            const errorMessage = await response.text();
                errorlabel.textContent = errorMessage
                setTimeout(()=>{
                    errorlabel.textContent = ''
                },3000)
                throw new Error(errorMessage);
        }
    } catch(error){
        console.error(error)
    }  
}
//----------------------------------------------------------------------------------------- Confirmation Box

function confirmation() {
    // console.log('Confirmed')
    const confirm = document.querySelector('.confirmdivparent')
    const tick = document.querySelector('.confirmdiv img')
    const confirmbox = document.querySelector('.confirmdiv')
    confirm.style.display = "flex"
    tick.classList.add('confirmfade')
    confirmbox.classList.add('confirmdivanimate')
    confirm.classList.add('confirmdivanimate')
    setTimeout(() => {
        confirm.style.display = "none"
        tick.classList.remove('confirmfade')
        confirmbox.classList.add('confirmdivanimate')
        confirm.classList.remove('confirmdivanimate')
    }, 1000);
}

//----------------------------------------------------------------------------------------- Display User Information

let previousClickListener = null
function updateInfoGui(field) {
    const title = document.getElementById('displayname')
    title.textContent = field
    removeBox()

    const data = JSON.parse(localStorage.getItem("userdata"))

    const linkButton = document.getElementById('linkbutton')

    function link() {
        const url = data[field]["url"]
        window.open(url, '_blank');
    }

    if(previousClickListener) {
        linkButton.removeEventListener('click', previousClickListener);
    }
    linkButton.addEventListener('click', link)

    previousClickListener = link;


    const inputmap = new Map();
    inputmap.set("dusername","div_u") 
    inputmap.set("demail","div_e")
    inputmap.set("dphnumber","div_ph")
    inputmap.set("dpassword","div_p")

    const propertyName = ["Username","Email","PhNumber","Password"]
    const buttonName = ["bdusername", "bdemail", "bdphnumber", "bdpassword"]
    let i = 0

    inputmap.forEach((div, element) =>{
        let input = document.getElementById(element)
        let block = document.querySelector(`.${div}`)
        let button = document.getElementById(buttonName[i])

        if(!data.hasOwnProperty(field) || !data[field][propertyName[i]]){  // 
            block.style.display = "none"
        } else {
            block.style.display = "flex"
            input.value = data[field][propertyName[i]]

            button.addEventListener('click', function() {
                input.select();
                input.setSelectionRange(0, 99999);

                navigator.clipboard.writeText(input.value)
                .then(function () {
                    button.classList.add('animate');
                    button.style.backgroundImage = 'url("../assets/tick.svg")'
                    setTimeout(() => {
                        button.classList.remove('animate');
                        button.style.backgroundImage = 'url("../assets/clipboard.svg")'
                    }, 1000);
                })
                .catch(function (err) {
                    console.error('Failed to copy text: ', err);
                });

            })
        }
        i++
    })
}

//----------------------------------------------------------------------------------------- Welcome Message

const greettext = document.querySelector('#greetname')
const masterusername = localStorage.getItem("username");
console.log(`Logged in as: ${masterusername}`)

function greet(){
    greettext.textContent = masterusername;
}

//----------------------------------------------------------------------------------------- InfoBox Logic

function removeBox() {
    const infobox = document.querySelector('.infobox')
    const infopanel = document.querySelector('.infopanel')
    infobox.style.display = 'none'
    infopanel.style.display = 'flex'
}
//----------------------------------------------------------------------------------------- Close Popup Box Logic

function closePopup() {
    const popupdivparent = document.querySelector('.popupdivparent')
    const popupdiv = document.querySelector('.popupdivchild')
    popupdivparent.style.display = "none"
    popupdiv.innerHTML = ""
}

//----------------------------------------------------------------------------------------- Logout

async function logOut() {
    try{
        await fetch("/logout", {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        })
        window.location.href = "../html/index.html";
    } catch(err) {
        console.log(err)
    }
}

const logoutbtn = document.querySelector("#logout")

logoutbtn.addEventListener('click', () => {
    console.log("Logging out")
    localStorage.clear()
    logOut()
})


//-----------------------------------------------------------------------------------------



window.onload = async function() {
    await getData();
    greet()
};
