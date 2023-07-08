async function sendMessage() {
  try {
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
