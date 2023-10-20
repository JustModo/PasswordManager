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
<<<<<<< HEAD
<<<<<<< HEAD
        const response = await fetch('http://127.0.0.1:5000/', {
            method: 'POST',
            headers: {
=======
        const response = await fetch('/login', {
            method: "post",
<<<<<<< HEAD
<<<<<<< HEAD
            /*headers: {
>>>>>>> b1b896f (Add api request changes)
=======
            /* headers: {
>>>>>>> 22cbef5 (Add all other pages)
                'Content-Type': 'application/json'
            }*/
=======
>>>>>>> d7982e1 (Add error message to login, Fix Internal Error 500)
=======
        const response = await fetch('/login', {
            method: "post",
>>>>>>> a260428 (Dashboard Entry Update)
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


<<<<<<< HEAD
        console.log(`Got token: ${token}`)
    } catch (error) {
        console.error('Error:', error.message);
=======
    } catch (error) {
<<<<<<< HEAD
        console.log(error);
        if(error instanceof TypeError && error.message === 'Failed to fetch'){
            console.log("Failed Server")
        }
>>>>>>> b1b896f (Add api request changes)
=======
        console.error('Error:', error.message);
>>>>>>> d7982e1 (Add error message to login, Fix Internal Error 500)
    }

}

<<<<<<< HEAD
<<<<<<< HEAD
function handleAuthRes(data) {
    if(data.token){
        localStorage.setItem('token', token.data);
        console.log("Logged In...")
    } else {
        console.error('Login Failed:', data.error)
    }
}
=======
=======
const register = document.getElementById("register");

register.addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "../html/register.html";
});


















>>>>>>> 22cbef5 (Add all other pages)
// function handleAuthRes(data) {
//     if(data.token){
//         localStorage.setItem('token', data.token);
//         console.log("Logged In...")
//     } else {
//         console.error('Login Failed:', data.error)
//     }
// }
<<<<<<< HEAD
>>>>>>> b1b896f (Add api request changes)
=======
>>>>>>> a260428 (Dashboard Entry Update)
