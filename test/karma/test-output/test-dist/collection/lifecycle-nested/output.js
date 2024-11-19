export default function (msg, id = 'lifecycle-loads') {
  const listEntry = document.createElement('li');
  listEntry.innerText = msg;
  document.getElementById(id).appendChild(listEntry);
}
