async function addfriend(e) {
  try {
    e.preventDefault(e);

    const token = localStorage.getItem("token");
    const groupname = localStorage.getItem("groupname");
    const email = document.getElementById("email").value;

    const obj = {
      email,
      groupname,
    };

    const response = await axios.post(
      "http://16.171.175.10:3000/group/addfriend",
      obj,
      { headers: { Authorization: token } }
    );

    window.location.href = "../Groupchat/groupchat.html";
  } catch (err) {
    console.log(err);
  }
}
