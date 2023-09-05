const links1 = document.querySelectorAll('.underline ul li a');
const menuBtn1 = document.querySelector("#menu-btn")
const menu1 = document.querySelector("#menu")

links1.forEach((link) => {
    link.addEventListener("click", () => {
        links1.forEach((link) => {
            link.classList.remove("active")
        })
        link.classList.add("active")
        if (window.innerWidth < 991) {
            menu1.classList.toggle("right")
            menuBtn1.classList.toggle("closeMenu")
        }
    })
})

menuBtn1.addEventListener("click", () => {
    menuBtn1.classList.toggle("closeMenu")
    menu1.classList.toggle("right")
})

setupUI()
showPostsProfile()
function setupUI() {
    const token = localStorage.getItem("token")
    const login = document.querySelectorAll("#login")
    const register = document.querySelectorAll("#register")
    const logout = document.querySelectorAll("#logout")

    if (token == null) {
        login.forEach((btn) => {
            btn.style.visibility = "visible"
        })
        register.forEach((btn) => {
            btn.style.visibility = "visible"
        })
        logout.forEach((btn) => {
            btn.style.setProperty("display", "none", "important")
        })
        if (document.querySelector("#add-post") != null) {
            document.querySelector("#add-post").classList.add("d-none")
        }
        if (document.querySelector("#send-comment") != null) {
            document.querySelector("#send-comment").style.setProperty("display", "none", "important")
        }
    } else {
        login.forEach((btn) => {
            btn.style.visibility = "hidden"
        })
        register.forEach((btn) => {
            btn.style.visibility = "hidden"
        })
        logout.forEach((btn) => {
            btn.style.setProperty("display", "block")
        })
        if (document.querySelector("#add-post") != null) {
            document.querySelector("#add-post").classList.remove("d-none")
            document.querySelector("#add-post").classList.add("d-flex")
        }
        if (document.querySelector("#send-comment") != null) {
            document.querySelector("#send-comment").style.setProperty("display", "block", "important")
        }
        getDataFormLocale()
    }
}




// get data user
function getDataFormLocale() {
    const userLocal = JSON.parse(localStorage.getItem("user"))
    document.querySelectorAll("#user-nav").forEach((i) => {
        i.innerHTML = `
                <img src=${userLocal.profile_image} style="width: 3rem; height: 3rem; object-fit: contain; border-radius: 50%; margin-right: .5rem;"> 
                <span style="color: white; font-size: 16px;">${userLocal.name}</span>
            `
    })
}



//logout
function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showSuccessAlert("Logged out successfully", "success")
    setupUI()
}


//alert
function showSuccessAlert(customMessage, customType) {
    const alertPlaceholder = document.getElementById("success-alert")

    const alert = (message, type) => {
        const wrapper = document.createElement("div")
        wrapper.innerHTML =
            `<div class="alert alert-${type} alert-dismissible" role="alert" id="alert-side">
                <div>${message}</div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `

        alertPlaceholder.append(wrapper)
    }
    alert(customMessage, customType)
    setTimeout(() => {
        const alertHide = bootstrap.Alert.getOrCreateInstance("#alert-side")
        alertHide.close()
    }, 3000);
}


// login
function loginBtnClicked() {
    const username = document.querySelector("#username-input").value;
    const password = document.querySelector("#password-input").value;

    const params = {
        "username": username,
        "password": password
    }
    loader(true)
    axios.post("https://tarmeezacademy.com/api/v1/login", params)
        .then((response) => {
            loader(false)
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("user", JSON.stringify(response.data.user))

            const modal = document.querySelector("#login-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showSuccessAlert("Logged in successfully", "success")
            setupUI()
            document.querySelector("#login-error-username").innerHTML = ""
            document.querySelector("#login-error-password").innerHTML = ""
            document.querySelector("#username-input").style.borderColor = ""
            document.querySelector("#password-input").style.borderColor = ""
            document.querySelector("#password-input").value = ""
            document.querySelector("#username-input").value = ""
        })
        .catch((error) => {
            const errorName = error.response.data.errors.email
            const errorPassword = error.response.data.errors.password
            errorName ? document.querySelector("#login-error-username").innerHTML = errorName : document.querySelector("#login-error-username").innerHTML = ""
            errorPassword ? document.querySelector("#login-error-password").innerHTML = errorPassword : document.querySelector("#login-error-password").innerHTML = ""
            errorName ? document.querySelector("#username-input").style.borderColor = "red" : document.querySelector("#username-input").style.borderColor = ""
            errorPassword ? document.querySelector("#password-input").style.borderColor = "red" : document.querySelector("#password-input").style.borderColor = ""
        }).finally(() => loader(false))
}

//register 
function registerBtnClicked() {
    const name = document.querySelector("#register-name-input").value;
    const username = document.querySelector("#register-username-input").value;
    const password = document.querySelector("#register-password-input").value;
    const email = document.querySelector("#register-email-input").value;
    const image = document.querySelector("#register-image-input").files[0];

    let formData = new FormData()
    formData.append("name", name)
    formData.append("username", username)
    formData.append("email", email)
    formData.append("password", password)
    formData.append("image", image)
    loader(true)
    axios.post("https://tarmeezacademy.com/api/v1/register", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
        .then((response) => {
            loader(false)
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("user", JSON.stringify(response.data.user))

            const modal = document.querySelector("#register-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showSuccessAlert("New User Registered Successfully", "success")
            setupUI()
            document.querySelector("#error-username").innerHTML = ""
            document.querySelector("#error-email").innerHTML = ""
            document.querySelector("#error-password").innerHTML = ""
            document.querySelector("#register-username-input").style.borderColor = ""
            document.querySelector("#register-email-input").style.borderColor = ""
            document.querySelector("#register-password-input").style.borderColor = ""
            document.querySelector("#register-name-input").value = ""
            document.querySelector("#register-username-input").value = ""
            document.querySelector("#register-password-input").value = ""
            document.querySelector("#register-email-input").value = ""
        })
        .catch((error) => {
            const usernameError = error.response.data.errors.username;
            const emailError = error.response.data.errors.email;
            const passwordError = error.response.data.errors.password;
            usernameError ? document.querySelector("#error-username").innerHTML = usernameError : document.querySelector("#error-username").innerHTML = ""
            emailError ? document.querySelector("#error-email").innerHTML = emailError : document.querySelector("#error-email").innerHTML = ""
            passwordError ? document.querySelector("#error-password").innerHTML = passwordError : document.querySelector("#error-password").innerHTML = ""
            usernameError ? document.querySelector("#register-username-input").style.borderColor = "red" : document.querySelector("#register-username-input").style.borderColor = ""
            passwordError ? document.querySelector("#register-password-input").style.borderColor = "red" : document.querySelector("#register-password-input").style.borderColor = ""
            emailError ? document.querySelector("#register-email-input").style.borderColor = "red" : document.querySelector("#register-email-input").style.borderColor = ""
        }).finally(() => loader(false))
}

function getCurrentUser() {
    let user = null
    const storageUSer = localStorage.getItem("user")
    if (storageUSer != null) {
        user = JSON.parse(storageUSer)
    }
    return user
}

function deletePostBtnClicked(postId) {
    let postModal = new bootstrap.Modal(document.querySelector("#delete-post"), {})
    postModal.toggle()
    document.querySelector("#yes-delete").addEventListener("click", () => {
        loader(true)
        axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postId}`,
            {
                headers: {
                    "authorization": `Bearer ${localStorage.getItem("token")}`
                }
            }
        )
            .then((response) => {
                loader(false)
                const modal = document.querySelector("#delete-post")
                const modalInstance = bootstrap.Modal.getInstance(modal)
                modalInstance.hide()
                showSuccessAlert("The post has been successfully deleted", "success")
                if (document.querySelector("#posts") != null) {
                    document.querySelector("#posts").innerHTML = ""
                    getPosts()
                }
                if (document.querySelector("#profile-posts") != null) {
                    document.querySelector("#profile-posts").innerHTML = ""
                    showPostsProfile()
                }
            })
            .catch((error) => {
                const message = error.response.data.message
                showSuccessAlert(message, "danger")
            }).finally(() => loader(false))
    })
}

//create new post 
function createNewPostClicked() {
    let postId = document.querySelector("#post-id-input").value
    let isCreate = postId == null || postId == ""

    const title = document.querySelector("#post-title-input").value;
    const body = document.querySelector("#post-body-input").value;
    const image = document.querySelector("#post-image-input").files[0];

    let formData = new FormData()
    formData.append("title", title)
    formData.append("body", body)
    formData.append("image", image)

    let url = ``

    if (isCreate) {
        url = `https://tarmeezacademy.com/api/v1/posts`
    } else {
        formData.append("_method", "put")
        url = `https://tarmeezacademy.com/api/v1/posts/${postId}`
    }
    loader(true)
    axios.post(url, formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                "authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }
    )
        .then((response) => {
            loader(false)
            const modal = document.querySelector("#add-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showSuccessAlert("New Post HAs Been Created", "success")
            if (document.querySelector("#posts") != null) {
                document.querySelector("#posts").innerHTML = ""
                getPosts()
            }
            if (document.querySelector("#profile-posts") != null) {
                document.querySelector("#profile-posts").innerHTML = ""
                showPostsProfile()
            }

        })
        .catch((error) => {
            const message = error.response.data.message
            showSuccessAlert(message, "danger")
        }).finally(() => loader(false))
}

function editPostBtnClicked(postObj) {
    let post = JSON.parse(decodeURIComponent(postObj))
    document.querySelector("#post-id-input").value = post.id
    document.querySelector("#post-modal-title").innerHTML = "Edit Post"
    document.querySelector("#post-modal-submit-btn").innerHTML = "Update"
    let postModal = new bootstrap.Modal(document.querySelector("#add-modal"), {})
    postModal.toggle()
    document.querySelector("#post-title-input").value = post.title;
    document.querySelector("#post-body-input").value = post.body;
}

function NewPostModalClicked() {
    document.querySelector("#post-id-input").value = ""
    document.querySelector("#post-modal-title").innerHTML = "Create A New Post"
    document.querySelector("#post-modal-submit-btn").innerHTML = "Create"
    let postModal = new bootstrap.Modal(document.querySelector("#add-modal"), {})
    postModal.toggle()
    document.querySelector("#post-title-input").value = "";
    document.querySelector("#post-body-input").value = "";
}


// show post page profile
function showPostsProfile() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let value = params.userid
    const userId = getCurrentUser().id
    if (value == null) {
        value = userId
    }
    loader(true)
    axios.get(`https://tarmeezacademy.com/api/v1/users/${value}/posts`)
        .then(function (response) {
            loader(false)
            const data = response.data.data.reverse();
            for (item of data) {
                let isMyPost = item != null && item.author.id == userId
                let buttonContentEdit = ``
                let buttonContentDelete = ``
                if (isMyPost) {
                    buttonContentEdit = `<button class="btn btn-secondary"  onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(item))}')" ><i class="fa-solid fa-user-pen"></i></button>`
                    buttonContentDelete = `<button type="button" class="btn btn-danger" style="box-shadow: none;" onclick="deletePostBtnClicked(${item.id})"><i class="fa-regular fa-trash-can"></i></button>`
                }
                let content = `
                                <div class="card mt-md-5 mt-4" >
                                <div class="card-header d-flex justify-content-between align-items-center ">
                                    <div class="d-flex justify-content-start align-items-center ">
                                        <img src=${item.author.profile_image} class="rounded-circle border border-2 " >
                                        <h5 class="fw-bold">${item.author.username} </h5>
                                    </div>
                                    <div>
                                        ${buttonContentEdit}
                                        ${buttonContentDelete}
                                    </div>
                                </div>
                                <div class="card-body" onclick="postClicked(${item.id})">
                                    <img src=${item.image}  alt="img" class="rounded-3">
                                    <h6 class="mt-3">${item.created_at}</h6>
                                    <h4 class="my-2">${item.title}</h4>
                                    <p>${item.body}</p>
                                </div>
                                <div class="card-footer text-muted">
                                    <span class="text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen"
                                            viewBox="0 0 16 16">
                                            <path
                                                d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                                        </svg> 
                                        (${item.comments_count}) Comments
                
                                        <span id="post-tags-${item.id}"></span>
                                    </span>
                                </div>
                            </div>
                            `
                if (document.querySelector("#profile-posts") != null) {
                    document.querySelector("#profile-posts").innerHTML += content
                }
            }
        }).finally(() => loader(false))

}

function postClicked(id) {
    window.location = `post.html?postId=${id}`
}


function loader(show = true) {
    if (show) {
        document.querySelector("#loader").style.visibility = "visible"
    } else {
        document.querySelector("#loader").style.visibility = "hidden"
    }
}