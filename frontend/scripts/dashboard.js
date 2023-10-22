
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
            <div class="fielddiv">
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
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                updateInfoGui(btn.id);
            });
        });
        editbtns.forEach(btn => {
            btn.addEventListener('click', () => {
                updateInfoGui(btn.id);
            });
        });       
}


//----------------------------------------------------------------------------------------- Search Bar and Content Formatting


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

search.addEventListener('keyup', function() {
    let result = search.value;
    if(result == ""){
        getData()
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
    const inputbox = document.getElementById("sitenamefield")
    const urlfield = document.getElementById("urlfield")
    inputbox.value = ''
    urlfield.value = "https://"
    addFieldLogic()
})

const exitentrywin = document.getElementById('backbtn')

exitentrywin.addEventListener('click', function() {
    entrywindow.style.display = "none"
})

//----------------------------------------------------------------------------------------- Form Behaviour Logic

function addFieldLogic() {
    const forminputs = document.querySelectorAll('.inputfieldpanel div input[type="text"]')
    const formcheckbox = document.querySelectorAll('.inputfieldpanel div input[type="checkbox"]')
    formcheckbox.forEach((checkbox, index) => {
        forminputs[index].disabled = true
        forminputs[index].value = ''
        checkbox.checked = false;
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

function submitForm() {
    const form = document.getElementById('formdata')
    const formdata = new FormData(form)
    formatData(formdata)
}

function formatData(userdata) {
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
    // jsondata[sitename] = jsonuserdata
    // sendData(JSON.stringify(jsondata))
    console.log(sitename)
    sendData(formData)
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
            getData()
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

function validateData() {
    if(validateSitename() && validateUrl())
        submitForm();
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



//----------------------------------------------------------------------------------------- Display User Information

function updateInfoGui(field) {
    const title = document.getElementById('displayname')
    title.textContent = field
    removeBox()

    const data = JSON.parse(localStorage.getItem("userdata"))

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
console.log(masterusername)

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
    console.log("logging out")
    localStorage.removeItem("username")
    localStorage.removeItem("userdata")
    logOut()
})


//-----------------------------------------------------------------------------------------

// window.addEventListener('unload', function() {
//     logOut()
// });


window.onload = function() {
    getData();
    greet()
    // entrywindow.classList.toggle("hidden");
    // entrywindow.style.display = "flex";
};