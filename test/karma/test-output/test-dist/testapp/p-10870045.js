function output(e, t = "lifecycle-loads") {
  const n = document.createElement("li");
  n.innerText = e, document.getElementById(t).appendChild(n);
}

export { output as o }