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
    showMessageOnScreen(response.data);
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
}

function showMessageOnScreen(response) {
  const messageContainer = document.getElementById("message-container");

  const showMessage = document.createElement("div");
  showMessage.className = "message";
  showMessage.textContent = `${response.username} : ${response.message}`;

  messageContainer.append(showMessage);
}
