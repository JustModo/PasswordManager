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

localStorage.setItem("username", _username);

formData = new FormData();
formData.append('user_name', _username);
formData.append('password', _password);
// console.log(formData)

    try {
<<<<<<< HEAD
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
=======
        const response = await fetch('/login', {
            method: "post",
>>>>>>> 0d9e690db10b6dfbef3d9aa4316e52d1e8cb8f6a
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
=======
    } catch (error) {
        console.error('Error:', error.message);
>>>>>>> 0d9e690db10b6dfbef3d9aa4316e52d1e8cb8f6a
    }

}

<<<<<<< HEAD
<<<<<<< HEAD
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
=======

>>>>>>> 106888c (Add input boxes for Add entry page)
=======

>>>>>>> 0d9e690db10b6dfbef3d9aa4316e52d1e8cb8f6a
const register = document.getElementById("register");

register.addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "../html/register.html";
});


window.onload = async function() {
    try {
        let response = await fetch('/get_data', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            }
        });
        
        if(response.ok) {
            window.location.href = "../html/dashboard.html";
        } else if(!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error("Not Logged In..")

    }
};


<<<<<<< HEAD
<<<<<<< HEAD














>>>>>>> 22cbef5 (Add all other pages)
=======
>>>>>>> 7afbaba (Finish Frontend)
=======
>>>>>>> 0d9e690db10b6dfbef3d9aa4316e52d1e8cb8f6a
// function handleAuthRes(data) {
//     if(data.token){
//         localStorage.setItem('token', data.token);
//         console.log("Logged In...")
//     } else {
//         console.error('Login Failed:', data.error)
//     }
// }
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> b1b896f (Add api request changes)
=======
>>>>>>> a260428 (Dashboard Entry Update)
=======
>>>>>>> 0d9e690db10b6dfbef3d9aa4316e52d1e8cb8f6a
