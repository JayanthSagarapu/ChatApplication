function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("token");
    const groupcontainer = document.getElementById("user-groups");

    const groups = await axios.get(
      "http://localhost:3000/chat/showall-groups",
      {
        headers: { Authorization: token },
      }
    );

    console.log(groups.data);

    groups.data.groups.forEach((group) => {
      const button = document.createElement("button");
      button.value = group.groupname;
      button.textContent = group.groupname;
      button.id = "group";
      button.className = "text-white";
      button.style =
        "height : 45px; padding:5px; margin:2px; background-color: transparent; font-weight:400; font-size:20px;";

      button.onclick = async (e) => {
        e.preventDefault();
        try {
          const group = e.target.textContent;
          console.log(group);
          localStorage.setItem("groupname", group);

          window.location.href = "../Groupchat/groupchat.html";
        } catch (err) {
          console.log(err);
        }
      };

      groupcontainer.append(button);
    });
  } catch (err) {
    console.log(err);
  }
});

function showcreateGroup() {
  window.location.href = "../Creategroup/creategroup.html";
  // document.getElementById("creategroup-container").style.display = "block";
  // document.getElementById("creategroup-btn").style.display = "none";
}

// async function creategroup(e) {
//   try {
//     e.preventDefault(e);

//     const token = localStorage.getItem("token");
//     const groupname = document.getElementById("groupname").value;

//     const obj = {
//       groupname,
//     };

//     const response = await axios.post(
//       "http://localhost:3000/group/creategroup",
//       obj,
//       { headers: { Authorization: token } }
//     );

//     localStorage.setItem("groupname", response.data.creategroup.groupname);

//     document.getElementById("creategroup-btn").style.display = "block";
//     document.getElementById("creategroup-container").style.display = "none";

//     window.location.href = "../Groupchat/groupchat.html";
//   } catch (err) {
//     console.log(err);
//   }
// }
