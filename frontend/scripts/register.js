const PORT = 5000
const errlabel = document.getElementById('errlabel')

function validateRegister() {
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const confirmpassword = document.getElementById('conpassword').value
    
    if(username== "" || password=="" || confirmpassword==""){
        errlabel.textContent = "Can't Leave Blank!"
        setTimeout(() => {
        errlabel.textContent = ""
        }, 3000);
    }
    else if(password != confirmpassword){
        errlabel.textContent = "Password Must Match!"
        setTimeout(() => {
        errlabel.textContent = ""
        }, 3000);
    }
    else if(password == confirmpassword && username!=''){
        createUser(username,password)
    }
}

async function createUser(username,password) {
    formData = new FormData()
    formData.append("user_name",username)
    formData.append("password", password)

    try {
        const response = await fetch(`http://127.0.0.1:${PORT}/add_user`, {
            method: "POST",
            body: formData
        });
        if(response.ok) {
           console.log("User Created!")
           Login(username,password)
        } else if(!response.ok) {
            const errorMessage = await response.text();
            errlabel.textContentL = errorMessage;
                setTimeout(()=> {
                    errlabel.textContent = "";
                },3000)
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function Login(username,password){
    formData = new FormData();
    formData.append('user_name', username);
    formData.append('password', password);

    try {
        const response = await fetch(`http://127.0.0.1:${PORT}/login`, {
            method: "post",
            body: formData
        });
        
        if(response.ok) {
            localStorage.setItem("username", username);
            window.location.href = "../html/dashboard.html";
        } else if(!response.ok) {
            const errorMessage = await response.text();
            document.getElementById("errlabel").innerHTML = errorMessage;
                setTimeout(()=> {
                    document.getElementById("errlabel").innerHTML = "";
                },3000)
            throw new Error(errorMessage);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}