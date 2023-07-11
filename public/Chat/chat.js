async function sendMessage(e) {
  try {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const message = document.getElementById("message-field").value;

    const obj = {
      message,
    };

    const response = await axios.post(
      "http://localhost:3000/chat/sendmessage",
      obj,
      { headers: { Authorization: token } }
    );
    console.log(response.data.chatDetails);

    response.data.chatDetails.username = "you";
    showMessageOnScreen(response.data.chatDetails);
    document.getElementById("message-field").value = "";
  } catch (err) {
    console.log(err);
  }
}

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
    const decodeJwt = parseJwt(token);
    console.log("decodeJwt", decodeJwt);

    const dropdown = document.getElementById("groups");

    const groups = await axios.get(
      "http://localhost:3000/chat/showall-groups",
      {
        headers: { Authorization: token },
      }
    );

    groups.data.groups.forEach((group) => {
      const option = document.createElement("option");
      option.value = group.groupname;
      option.textContent = group.groupname;
      dropdown.appendChild(option);
    });

    const response = await axios.get("http://localhost:3000/chat/getmessages", {
      headers: { Authorization: token },
    });

    console.log(response.data.chat);

    let array = [];

    if (response.data.chat.length > 10) {
      let n = response.data.chat.length - 1;

      while (array.length < 10) {
        array.push(response.data.chat[n]);
        n--;
      }
    } else {
      array = response.data.chat.reverse();
    }

    array = array.reverse();

    localStorage.setItem("oldmsgsArray", JSON.stringify(array));

    let chat = JSON.parse(localStorage.getItem("oldmsgsArray"));
    // document.getElementById("message-container").innerText = " ";

    chat.forEach((ele) => {
      if (ele.userid === decodeJwt.userid) {
        ele.username = "you";
      }
      showMessageOnScreen(ele);
    });
  } catch (err) {
    console.log(err);
  }
});

function showMessageOnScreen(response) {
  const messageContainer = document.getElementById("message-container");

  const showMessage = document.createElement("div");
  showMessage.className = "message";
  showMessage.textContent = `${response.username} : ${response.message}`;

  messageContainer.append(showMessage);
}

function showcreateGroup() {
  window.location.href = "../Creategroup/creategroup.html";
  // document.getElementById("creategroup-container").style.display = "block";
  // document.getElementById("creategroup-btn").style.display = "none";
}

function usergroups() {
  const group = document.getElementById("groups").value;
  localStorage.setItem("groupname", group);

  window.location.href = "../Groupchat/groupchat.html";
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
