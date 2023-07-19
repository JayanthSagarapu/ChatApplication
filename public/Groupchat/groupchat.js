const socket = io("http://16.171.175.107:3000/");

socket.on("connect", () => {
  // console.log(socket.id);
});

socket.on("receive", (message) => {
  console.log("message:", message);
  showMessageOnScreen(message);
});

async function sendMessage(e) {
  try {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const message = document.getElementById("message-field").value;
    const groupname = localStorage.getItem("groupname");

    const obj = {
      message,
    };

    const response = await axios.post(
      `http://16.171.175.107:3000/groupchat/sendmessage/${groupname}`,
      obj,
      { headers: { Authorization: token } }
    );

    // response.data.chatDetails.username = "you";
    // console.log(response.data.chatDetails);

    // showMessageOnScreen(response.data.chatDetails);

    const username = response.data.chatDetails.username;

    const obj2 = {
      message,
      username,
    };

    socket.emit("send-message", obj2);

    document.getElementById("message-field").value = "";
    // location.reload();
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
  const token = localStorage.getItem("token");

  const dropdown = document.getElementById("groups");
  const groups = await axios.get(
    "http://16.171.175.107:3000/groupchat/showall-groups",
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

  let headingh4a = document.getElementById("groupname");
  const groupname = localStorage.getItem("groupname");
  headingh4a.innerHTML = `Group Name : ${groupname}`;

  // setInterval(async () => {
  const decodeJwt = parseJwt(token);
  // console.log("decodeJwt", decodeJwt);
  try {
    const response = await axios.get(
      `http://16.171.175.107:3000/groupchat/getmessages/${groupname}`,
      {
        headers: { Authorization: token },
      },
      groupname
    );

    // console.log(response.data);

    if (response.data.usergroup[0].isAdmin === false) {
      document.getElementById("addfriendBtn").style.visibility = "hidden";
    }

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
    document.getElementById("message-container").innerText = " ";

    chat.forEach((ele) => {
      if (ele.userId === decodeJwt.userId) {
        ele.username = "you";
      }
      showMessageOnScreen(ele);
    });
  } catch (err) {
    console.log(err);
  }
  // }, 1000);
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

async function showFriends() {
  const ul = document.getElementById("friends-list");
  const token = localStorage.getItem("token");
  document.getElementById("friends-container").style.display = "block";

  const groupname = localStorage.getItem("groupname");

  const friends = await axios.get(
    `http://16.171.175.107:3000/groupchat/friends/${groupname}`,
    { headers: { Authorization: token } },
    groupname
  );

  ul.innerHTML = "  ";

  console.log(friends.data);

  if (friends.data.usergroup[0].isAdmin) {
    showAdminUsers(friends.data);
  } else {
    showNONAdminUsers(friends.data);
  }
}

function showAdminUsers(data) {
  const token = localStorage.getItem("token");
  data.friends.forEach((friend) => {
    const ul = document.getElementById("friends-list");
    const li = document.createElement("li");
    li.id = friend.userId;
    li.className = "text-white mb-2";
    li.style =
      "list-decoration : none ; padding:5px; background-color:rgb(46, 71, 109); display:flex; flex-direction:row;";

    const name = document.createElement("div");
    name.textContent = friend.name;
    name.style = "width:73px; background-color:transparent,";
    li.append(name);

    if (friend.isAdmin === false) {
      const adminbtn = document.createElement("button");
      showadminbtn(adminbtn, friend);

      li.appendChild(adminbtn);
    } else {
      const rmvadminbtn = document.createElement("button");
      removeadminBtn(rmvadminbtn, friend);

      li.appendChild(rmvadminbtn);
    }

    const remvebtn = document.createElement("button");
    remvebtn.textContent = "Remove";
    remvebtn.className = "float-right text-white ml-0";
    remvebtn.style = "background-color: rgb(4, 4, 36)";

    remvebtn.onclick = async (e) => {
      e.preventDefault();
      try {
        const friendId = friend.userId;
        const groupname = localStorage.getItem("groupname");

        await axios.delete(
          `http://16.171.175.107:3000/groupchat/deletefriend/${friendId}/${groupname}`,
          {
            headers: { Authorization: token },
          }
        );

        ul.removeChild(li);
        location.reload();
      } catch (err) {
        console.log(err);
      }
    };
    li.appendChild(remvebtn);

    ul.appendChild(li);
  });
}

async function showadminbtn(adminbtn, friend) {
  adminbtn.textContent = "Admin";
  adminbtn.className = "float-right text-white";
  adminbtn.style = "background-color: rgb(4, 4, 36);margin-left:30%";

  adminbtn.onclick = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // const friendname = e.target.parentElement.firstChild.textContent;
      const friendId = friend.userId;
      const groupname = localStorage.getItem("groupname");

      const obj = {
        friendId,
        groupname,
      };

      const admin = await axios.post(
        `http://16.171.175.107:3000/groupchat/adminfriend`,
        obj,
        {
          headers: { Authorization: token },
        }
      );
      adminbtn.textContent = "RemoveAdmin";
      removeadminBtn(adminbtn, friend);
      console.log(admin.data);
    } catch (err) {
      console.log(err);
    }
  };
}

async function removeadminBtn(rmvadminbtn, friend) {
  rmvadminbtn.textContent = "RemoveAdmin";
  rmvadminbtn.className = "float-right text-white";
  rmvadminbtn.style = "background-color: rgb(4, 4, 36)";

  rmvadminbtn.onclick = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // const friendname = e.target.parentElement.firstChild.textContent;
      const friendId = friend.userId;
      const groupname = localStorage.getItem("groupname");

      const obj = {
        friendId,
        groupname,
      };

      const rmvadmin = await axios.post(
        `http://16.171.175.107:3000/groupchat/rmvadmin`,
        obj,
        {
          headers: { Authorization: token },
        }
      );
      rmvadminbtn.textContent = "Admin";
      showadminbtn(rmvadminbtn, friend);
      console.log(rmvadmin.data);
    } catch (err) {
      console.log(err);
    }
  };
}

function showNONAdminUsers(data) {
  data.friends.forEach((friend) => {
    const ul = document.getElementById("friends-list");
    const li = document.createElement("li");
    li.textContent = friend.name;
    li.id = friend.userId;
    li.className = "text-white mb-2";
    li.style =
      "list-decoration : none; text-align:center;padding:5px; background-color:rgb(46, 71, 109)";
    ul.appendChild(li);
  });
}

function closefriendslist() {
  document.getElementById("friends-container").style.display = "none";
}

const formFile = document.getElementById("formElem");
formFile.addEventListener("submit", onsubmitfile);

async function onsubmitfile(event) {
  try {
    event.preventDefault();
    const groupname = localStorage.getItem("groupname");

    formData = new FormData(formFile);

    const token = localStorage.getItem("token");

    console.log("formData", formData);

    const response = await axios.post(
      `http://16.171.175.107:3000/file/sendfile/${groupname}`,
      formData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // const username = response.data.username;
    // const obj2 = {
    //   formData,
    //   username,
    // };

    // socket.emit("send-message", obj2);

    console.log(response.data);
    document.getElementById("sendFile").value = null;
    location.reload();
    //showMyMessageOnScreen(responce.data.data);
  } catch (error) {
    console.log(error);
  }
}
