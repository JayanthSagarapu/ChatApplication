async function creategroup(e) {
  try {
    e.preventDefault(e);

    const token = localStorage.getItem("token");
    const groupname = document.getElementById("groupname").value;

    const obj = {
      groupname,
    };

    const response = await axios.post(
      "http://16.171.175.107:3000/group/creategroup",
      obj,
      { headers: { Authorization: token } }
    );

    localStorage.setItem("groupname", response.data.creategroup.groupname);

    window.location.href = "../Groupchat/groupchat.html";
  } catch (err) {
    console.log(err);
  }
}
