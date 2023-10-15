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
            /* headers: {
                'Content-Type': 'application/json'
            }*/
            body: formData
        });
        
        if(response.ok) {
            window.location.href = "dashboard.html";
        } else if(!response.ok) {
            if (response.status === 403) {
                const error = new Error('Access denied: You do not have permission to access this resource.');
                    document.getElementById("errlabel").innerHTML = "Invalid Details!";
                setTimeout(()=> {
                    document.getElementById("errlabel").innerHTML = "";
                },3000)
                console.log(response)
                throw error;
            }
        }

        //error
        const errorData = await response.json();
        if (response.status === 401) {
            throw new Error('Invalid username or password')
        } else {
            throw new Error(errorData.error)    
        }
        
        // const data = await response.json();
        // const token = data.token;
        // console.log(`Got token: ${token}`)
        // console.log(data)
        // handleAuthRes(data);


    } catch (error) {
        console.log(error);
        if(error instanceof TypeError && error.message === 'Failed to fetch'){
            console.log("Failed Server")
        }
    }

}

const register = document.getElementById("register");

register.addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "register.html";
});


















// function handleAuthRes(data) {
//     if(data.token){
//         localStorage.setItem('token', data.token);
//         console.log("Logged In...")
//     } else {
//         console.error('Login Failed:', data.error)
//     }
// }