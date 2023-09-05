getPost()
function getPost() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let value = params.postId
    loader(true)
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${value}`)
        .then(function (response) {
            loader(false)
            const comments = response.data.data.comments
            const data = response.data.data;
            const content = `
                <div class="card mt-md-5 mt-4">
                <div class="card-header d-flex justify-content-start align-items-center ">
                    <img src=${data.author.profile_image} class="rounded-circle border border-2 ">
                    <h5 class="fw-bold">${data.author.username} </h5>
                </div>
                <div class="card-body">
                    <img src=${data.image}  alt="img" class="rounded-3">
                    <h6 class="mt-3">${data.created_at}</h6>
                    <h4 class="my-2">${data.title}</h4>
                    <p>${data.body}</p>
                </div>
                <div class="card-footer text-muted">
                    <span class="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen"
                            viewBox="0 0 16 16">
                            <path
                                d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                        </svg> 
                        (${data.comments_count}) Comments

                        <span id="post-tags-${data.id}"></span>
                    </span>
                </div>
                <div class="comments" id="comments-div">
                </div>
                <div class="send-comment" id="send-comment">
                    <input type="text"  id="add-comment" placeholder="add your comment...">
                    <button type="button" class="btn btn-primary send" onclick="createNewComment(${data.id})"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
                </div>
                `
            document.querySelector("#post").innerHTML = content
            const divId = `post-tags-${data.id}`
            if (data.tags == 0) {
                document.getElementById(divId).innerHTML += `<button class="btn btn-sm rounded-5" style="background-color: gray; color: white;">
                        Police
                    </button>`
            } else {
                for (tag of data?.tags) {
                    let tagsContent = `<button class="btn btn-sm rounded-5" style="background-color: gray; color: white; margin-right: .5rem;">
                            p
                        </button>`
                    document.getElementById(divId).innerHTML += tagsContent
                }
            }
            if (comments != null) {
                comments.forEach((comment) => {
                    document.querySelector("#comments-div").innerHTML += `
                            <div class="comment">
                                <img src=${comment.author.profile_image} > <span>${comment.author.username}</span>
                                <p class="mt-1">${comment.body}</p>
                                <hr>
                            </div>
                        `
                });
            }
        }).finally(() => loader(false))
}


function createNewComment(id) {
    const body = document.querySelector("#add-comment").value;
    let params = {
        "body": body
    }

    loader(true)
    axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`, params,
        {
            headers: {
                "authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }
    )
        .then((response) => {
            loader(false)
            getPost()
            showSuccessAlert("The Comment Has Been Created Successfully", "success")
        })
        .catch((error) => {
            const message = error.response.data.message
            showSuccessAlert(message, "danger")
        }).finally(() => loader(false))
}