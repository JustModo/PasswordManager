
const search = document.getElementById('search');
let globaldata;

search.addEventListener('keyup', function() {
    let result = search.value;
    if(result == ""){
        updatelist(globaldata)
    } else {
        console.log(result);
        updatelist(globaldata)
    }
});

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
                console.log(userdata)
                globaldata = userdata
                updatelist(userdata);
            } else if(!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }


// function addlist(userdata) {
//     let masterdata = [];
//     for (let field in userdata){
//         masterdata.push(userdata[field])
//     }
//     console.log(...masterdata)
//     updatelist(masterdata)
// }

const contentbox = document.querySelector('.objcontainer')

function updatelist(userdata) {
        contentbox.innerHTML = ''
        for(let field in userdata){
            let fields = userdata[field];
            for (let data in fields) {
                if (fields.hasOwnProperty(data)) {
                    let value = fields[data];
                    updategui(field, data, value)
                    console.log(field, data, value)
                }
        
            }
        }
            
}

function updategui(title, key, value) {
    console.log(`${title},${key},${value}`)
    let content = contentbox.innerHTML.concat(`<div>${title},${key},${value}</div>`)
    contentbox.innerHTML = content;
}

window.onload = function() {
    getData();
};