# Unnamed Password Manager
### Introduction
This is a password manager. Keep your passwords safe. :><br>

### Features:
 - Fully local storage
 - Symmetric AES encryption
 - Multiple users
 - Cross platform
 - Web ui

## Working
Why use Unnamed Password Manager (UNPM)
### Before UNPM
"Never use common password"
    - A wise person
```mermaid
flowchart LR
    vw[Visit Website]
        --> s[Sign up using unique password]
        --> fp["Forgot Password 😭"]
    vw[Visit Website]
        --> sa[Sign up with common password]
        --> gh[Get all your accounts hacked]
```
### After UNPM
```mermaid
flowchart LR
    vw[Visit Website]
        --> s[Sign up using unique password]
        --> sp[Save password safely in UNPM]
    vwa[Visit Website again]
        --> gp[Get password using our web-app]
        --> l[Login]
```

## FAQ
#### How to Backup?
 - Check where AppData is standard stored if your OS is not mentioned here.
 - Linux:
 - - Backup the file at the location "~/.local/share/Unnamed_Password_Manager/\<USERNAME\>"
 - - Paste it in the same location or follow the directions for the OS.


# Dev docs
## Rest API
##### WARNING:
    Do NOT use this api for ANY reason EXCEPT if usage is ONLY local, i.e.,
    this api is NOT built for usage over an external network and doing so
    WILL NOT BE SECURE
###### Note: 
    Server throws 405 METHOD NOT ALLOWED if the url is mistyped

```mermaid
sequenceDiagram
    autonumber
    actor User
    box App
    participant Frontend
    participant Backend
    end

    Note over User, Backend : LOGIN
    User -->> Frontend : Wants to login
    Frontend -->> Backend : { user_name : "...", password : "..." } to /login
    Backend -->> Frontend : Success : http 200
    Backend -->> Frontend : user_name / password not given : http 400
    Backend -->> User : user_name / password is wrong : http 403

    Note over User, Backend : LOGOUT
    User -->> Frontend : Wants to logout
    Frontend -->> Backend : /logout
    Backend -->> Frontend : Success : http 200
    Backend -->> User : Not logged in : http 403

    Note over User, Backend : ADD USER
    User -->> Frontend : Wants to add user
    Frontend -->> Backend : { user_name : "...", password : "..." } to /add_user
    Backend -->> Frontend : Success : http 200
    Backend -->> Frontend : user_name / password not given : http 400
    Backend -->> User : user_name is taken : http 403

    Note over User, Backend : GET DATA
    User -->> Frontend : field/ entry, etc.
    Frontend -->> Backend : /get_data
    Backend -->> User : Not logged in : http 403

    Note over User, Backend : CHANGE PASSWORD
    User -->> Frontend : Wants to change password
    Frontend -->> Backend : { password : "..." } to /change_password
    Backend -->> Frontend : password not given : http 400
    Backend -->> User : Not logged in : http 403

    Note over User, Backend : ADD ENTRY
    User -->> Frontend : Wants to add entry
    Frontend -->> Backend : entry data to /add_entry
    Note over Frontend, Backend : entry data is { entry_name : "...", fields : "..." }
    Note over Frontend, Backend : fields should be string({ field1 : "...", field2 : "...", ... })
    Backend -->> Frontend : Entry data is not correct : http 400
    Backend -->> User : Not logged in : http 403

    Note over User, Backend : DELETE ENTRY
    User -->> Frontend : Wants to delete entry
    Frontend -->> Backend : { entry_name : "..." } to /delete_entry
    Backend -->> Frontend : entry_name not given : http 400
    Backend -->> User : Not logged in or entry_name does not exist : http 403

    Note over User, Backend : EDIT ENTRY NAME
    User -->> Frontend : Wants to change entry name
    Frontend -->> Backend : { old_entry_name : "...", new_entry_name : "..." }
    Backend -->> Frontend : Success : http 200
    Backend -->> Frontend : old or new entry names not given : http 400
    Backend -->> User : Old user name doesn't exist or the new one already exists
```
