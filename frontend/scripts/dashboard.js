
//-----------------------------------------------------------------------------------------(Getting Data)
let globaldata;


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
                //console.log(userdata)
                globaldata = userdata
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
             <button id="${field["fieldname"]}" class="entrybutton"> Show </button>
            </div>
            `
            )

        contentbox.innerHTML = content; 


        let btns = document.querySelectorAll('.entrybutton')
        btns.forEach(btn => {
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
        getFilterList(result,globaldata)
        //console.log(result);
        
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
    console.log(formdata)
}



//----------------------------------------------------------------------------------------- Display User Information

function updateInfoGui(call) {
    console.log(call)
}

//----------------------------------------------------------------------------------------- Welcome Message

const greettext = document.querySelector('#greetname')
const masterusername = localStorage.getItem("username");
console.log(masterusername)

function greet(){
    greettext.textContent = masterusername;
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