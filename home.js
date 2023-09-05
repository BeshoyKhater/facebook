getPosts()

let lastPage = 1;
// posts 
function getPosts(page = 1) {
    loader(true)
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=4&page=${page}`)
        .then(function (response) {
            loader(false)
            lastPage = response.data.meta.last_page
            const data = response.data.data;
            for (item of data) {
                // show or hide button edit
                let user = getCurrentUser();
                let isMyPost = user != null && item.author.id == user.id
                let buttonContentEdit = ``
                let buttonContentDelete = ``
                if (isMyPost) {
                    buttonContentEdit = `<button class="btn btn-secondary"  onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(item))}')" ><i class="fa-solid fa-user-pen"></i></button>`
                    buttonContentDelete = `<button type="button" class="btn btn-danger" style="box-shadow: none;" onclick="deletePostBtnClicked(${item.id})"><i class="fa-regular fa-trash-can"></i></button>`
                }
                let content = `
                <div class="card mt-md-5 mt-4" >
                <div class="card-header d-flex justify-content-between align-items-center ">
                    <div class="d-flex justify-content-start align-items-center " style="cursor: pointer;" onclick="userClicked(${item.author.id})">
                        <img src=${item.author.profile_image} class="rounded-circle border border-2 ">
                        <h5 class="fw-bold">${item.author.username} </h5>
                    </div>
                    <div>
                        ${buttonContentEdit}
                        ${buttonContentDelete}
                    </div>
                </div>
                <div class="card-body" onclick= "postClicked(${item.id})">
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
                document.querySelector("#posts").innerHTML += content
                const divId = `post-tags-${item.id}`
                if (item.tags.length == 0) {
                    document.getElementById(divId).innerHTML += `<button class="btn btn-sm rounded-5" style="background-color: gray; color: white;">
                    Police
                    </button>`
                } else {
                    for (tag of item?.tags) {
                        let tagsContent = `<button class="btn btn-sm rounded-5" style="background-color: gray; color: white; margin-right: .5rem;">
                        p
                        </button>`
                        document.getElementById(divId).innerHTML += tagsContent
                    }
                }
            }
        }).finally(() => loader(false))
}





let currentPage = 1
const handleInfiniteScroll = () => {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if (endOfPage && currentPage < lastPage) {
        currentPage += + 1
        getPosts(currentPage)
        console.log(currentPage)
    }
};
window.addEventListener("scroll", handleInfiniteScroll);



function userClicked(id) {
    window.location = `profile.html?userid=${id}`
}

