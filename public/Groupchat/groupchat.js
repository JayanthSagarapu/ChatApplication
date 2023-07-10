async function sendMessage() {
  try {
    const token = localStorage.getItem("token");
    const message = document.getElementById("message-field").value;
    const groupname = localStorage.getItem("groupname");

    const obj = {
      message,
      groupname,
    };

    const response = await axios.post(
      "http://localhost:3000/groupchat/sendmessage",
      obj,
      { headers: { Authorization: token } }
    );
    response.data.chatDetails.username = "you";
    console.log(response.data.chatDetails);

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
      "http://localhost:3000/groupchat/showall-groups",
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

    let headingh4 = document.getElementById("groupname");
    const groupname = localStorage.getItem("groupname");
    headingh4.innerHTML = `Group Name : ${groupname}`;

    const response = await axios.get(
      `http://localhost:3000/groupchat/getmessages/${groupname}`,
      {
        headers: { Authorization: token },
      },
      groupname
    );

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

function addfriend() {
  window.location.href = "../Addfriend/addfriend.html";
}

function usergroups() {
  const group = document.getElementById("groups").value;
  localStorage.setItem("groupname", group);

  window.location.href = "../Groupchat/groupchat.html";
}
