let loginb = document.getElementById("loginb");

loginb.addEventListener("click", validateLogin);

function validateName() {
var name = document.getElementById("username").value;
    if(name=='' || name==null){
        // console.log("falsevn");
            document.getElementById("errlabel").innerHTML = "Enter Username!";
            setTimeout(()=> {
                document.getElementById("errlabel").innerHTML = "";
            },3000)
        return false;
    } else {
        // console.log("truevn");
        return true;
    }
}

function validatePass() {
    var pass = document.getElementById("password").value;
        if(pass=='' || pass==null){
            // console.log("falsevp");
                document.getElementById("errlabel").innerHTML = "Enter Password!";
            setTimeout(()=> {
                document.getElementById("errlabel").innerHTML = "";
            },3000)
                return false;
        } else {
            // console.log("truevp");
            return true;
        }
    }

function validateLogin() {
    if(validateName() && validatePass()) {
        getAuth();
        return;
    }
}

async function getAuth() {
let _username = document.getElementById("username").value;
let _password = document.getElementById("password").value;
    try {
        const response = await fetch('http://127.0.0.1:5000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_name: _username,
                password: _password
            })
        });
        
        if(!response.ok) {
            throw new Error('Connection was not Ok!');
        }

        const data = await response.json();
        const token = data.token;

        console.log(`Got token: ${token}`)
    } catch (error) {
        console.log('Error', error);
    }
        
}

function handleAuthRes(data) {
    if(data.token){
        localStorage.setItem('token', token.data);
        console.log("Logged In...")
    } else {
        console.error('Login Failed:', data.error)
    }
}