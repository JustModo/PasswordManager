let loginb = document.getElementById("loginb");

loginb.addEventListener("click", validateLogin);

function validateName() {
var name = document.getElementById("username").value;
    if(name=='' || name==null){
            document.getElementById("errlabel").innerHTML = "Enter Username!";
            setTimeout(()=> {
                document.getElementById("errlabel").innerHTML = "";
            },3000)
        return false;
    } else {
        return true;
    }
}

function validatePass() {
    var pass = document.getElementById("password").value;
        if(pass=='' || pass==null){
                document.getElementById("errlabel").innerHTML = "Enter Password!";
            setTimeout(()=> {
                document.getElementById("errlabel").innerHTML = "";
            },3000)
                return false;
        } else {
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

formData = new FormData();
formData.append('user_name', _username);
formData.append('password', _password);
console.log(formData)

    try {
        const response = await fetch('/login', {
            method: "post",
            body: formData
        });
        
        if(response.ok) {
            window.location.href = "../html/dashboard.html";
        } else if(!response.ok) {
            const errorMessage = await response.text();
            document.getElementById("errlabel").innerHTML = errorMessage;
                setTimeout(()=> {
                    document.getElementById("errlabel").innerHTML = "";
                },3000)
            throw new Error(errorMessage);
        }
        
        // const data = await response.json();
        // const token = data.token;
        // console.log(`Got token: ${token}`)
        // console.log(data)
        // handleAuthRes(data);


    } catch (error) {
        console.error('Error:', error.message);
    }

}

const register = document.getElementById("register");

register.addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "../html/register.html";
});


















// function handleAuthRes(data) {
//     if(data.token){
//         localStorage.setItem('token', data.token);
//         console.log("Logged In...")
//     } else {
//         console.error('Login Failed:', data.error)
//     }
// }
