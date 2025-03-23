document.addEventListener("DOMContentLoaded", () => {
  const callbackButton = document.getElementById("callbacks-btn");
  const postsCont = document.getElementById("posts-container");

  // Function to fetch posts using a callback
  function fetchData(callback) {
    fetch("https://dummyjson.com/posts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to fetch posts");
        }
        return response.json();
      })
      .then((data) => callback(null, data))
      .catch((error) => callback(error, null));
  }

  // Function to render posts dynamically
  function renderPosts(posts) {
    const ul = document.createElement("ul");
    ul.classList.add("posts-list");

    posts.forEach((post) => {
      const li = document.createElement("li");
      let sliceIndex = post.body.length >= 147 ? 146 : post.body.length - 1;
      li.classList.add("card");

      li.innerHTML = `<h2 class="title">${post.title}</h2>`;
      const postBodyCont = document.createElement("div");
      const postBody = document.createElement("p");
      postBody.textContent = post.body.slice(0, sliceIndex);
      postBody.classList.add("body");
      const toggleElement = document.createElement("span");
      const viewMore = ` View More <span style="font-size:10px;">🡺</span>`;
      const viewLess = ` <span style="font-size:10px;">🡸</span> View Less`;
      toggleElement.innerHTML = viewMore;
      toggleElement.classList.add("toggle-btn");
      ul.style.alignItems = "stretch";

      // Toggle functionality
      toggleElement.onclick = function () {
        postBody.classList.toggle("expanded");
        if (postBody.classList.contains("expanded")) {
          postBody.textContent = post.body;
          li.classList.add("content-height");
        } else {
          li.classList.remove("content-height");
          postBody.textContent = post.body.slice(0, sliceIndex);
        }
        toggleElement.innerHTML = postBody.classList.contains("expanded")
          ? viewLess
          : viewMore;
      };

      postBodyCont.appendChild(postBody);
      postBodyCont.appendChild(toggleElement);
      li.appendChild(postBodyCont);

      ul.appendChild(li);
    });

    postsCont.innerHTML = "";
    postsCont.appendChild(ul);
  }

  // Handling button click to fetch posts using a callback
  function handleCallbacks(e) {
    postsCont.innerHTML = ` <section class="display-loader">
               
            <div class="loader"></div>
            <p> Loading . . . </p>
         </section>`;
    e.preventDefault();

    setTimeout(() => {
      postsCont.innerHTML = ` <section class="display-loader">
               
      <div class="loader"></div>
      <p>Callback executed after 5 seconds . . .</p> 
   </section>`;
      fetchData((error, data) => {
        if (error) {
          const errMsg =
            error.message === "Failed to fetch"
              ? "Network Error Occured"
              : error.message;
          postsCont.innerHTML = `<section class="display-loader " style="border-left:4px solid red;border-right:4px solid red;">
                <div class="error">!</div>
                <div style="text-align: left;">
                <p style="color:red;font-weight: bold;">Try Again!</p>
                    <p>${errMsg}</p></div> 
             </section>`;

          console.error(error);
        } else {
          renderPosts(data.posts);
        }
      });
    }, 5000);
  }

  callbackButton.addEventListener("click", handleCallbacks);
});
