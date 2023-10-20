
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
            <div>
            <img src="${field["url"]}">
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

//-----------------------------------------------------------------------------------------

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
        if(field.toLowerCase().indexOf(keyword) !== -1){
            let fieldname = field
            filterarray.push(fieldname)
        }
    }
    getDisplayList(filterarray,data);
    //console.log(filterarray)
  }

//-----------------------------------------------------------------------------------------


function updateInfoGui(call) {
    console.log(call)
}

//-----------------------------------------------------------------------------------------

window.onload = function() {
    getData();
};