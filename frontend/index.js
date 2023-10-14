let loginb = document.getElementById("loginb");
let _username;
let _password;

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
        getLD();
        return;
    }
}

function getLD() {
    _username = document.getElementById("username").value;
    _mpassword = document.getElementById("password").value;
    let loginData = {
        user_name: _username,
        password: _password
    }
    fetch('http://127.0.0.1:5000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(res => {
        return res.json()
    })
    .then(data => {
        handleAuthRes(data);
    })
    .catch(error => console.log(`You have ${error}`))
}

function handleAuthRes(data) {
    if(data.token){
        localStorage.setItem('token', token.data);
        console.log("Logged In...")
    } else {
        console.error('Login Failed:', data.error)
    }
}