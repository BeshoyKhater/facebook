function showUser() {
    const userId = getCurrentUser().id
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let value = params.userid
    if (value == null) {
        value = userId
    }
    loader(true)
    document.querySelector("#heeder-profile").innerHTML = ""
    axios.get(`https://tarmeezacademy.com/api/v1/users/${value}`)
        .then(function (response) {
            loader(false)
            const data = response.data.data;

            let content = `
                <div class="header mt-md-5 mt-4" >
                    <div class=" row d-flex align-items-center justify-content-between g-md-5 g-3">
                        <div class="col-lg-4 col-md-6 col-12">
                            <div class="left d-flex align-items-center">
                                <img src=${data.profile_image}  alt="img">
                                <div class="username">
                                    <h4>${data.email}</h4>
                                    <h4>${data.username}</h4>
                                    <h4>${data.name}</h4>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-4 col-12">
                            <div class="right">
                                <div class="d-flex align-items-end ">
                                    <h2>${data.posts_count}</h2>
                                    <span>Posts</span>
                                </div>
                                <div class="d-flex align-items-end ">
                                    <h2>${data.comments_count}</h2>
                                    <span>Comments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <h2 class="posts-name">${data.name} Posts</h2>
            `
            document.querySelector("#heeder-profile").innerHTML = content
        }).finally(() => loader(false))
}

showUser()
