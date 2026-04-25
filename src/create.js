const toast = document.createElement("div")
toast.id = "toast"
document.body.appendChild(toast)
 
let toastTimer
function mostrarError(msg) {
    toast.textContent = msg
    toast.classList.add("visible")
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 3000)
}

const form = document.querySelector("#add-serie")
form.addEventListener("submit", (e) => {
  e.preventDefault()

  const nombre = document.querySelector("#name").value
  const current_ep = document.querySelector("#current").value
  const total_ep = document.querySelector("#total").value
  const img = document.querySelector("#imagen").value

  const serie = {
    name: nombre,
    current_ep: parseInt(current_ep),
    total_ep: parseInt(total_ep),
    img: img
  }

  agregarSerie(serie)
})


function agregarSerie(serie) {
  fetch("https://series-tracker-rk1z.onrender.com/series", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(serie)})
  .then(res => {
    if (res.ok) {
        window.location.href = "/index.html"
    } else {
      return res.text().then(msg => mostrarError(msg))
    }
  })
  .catch(() => {
    mostrarError("No se pudo conectar con el servidor.")
  })
}


document.getElementById("back").addEventListener("click", () => {
    window.location.href = "/index.html"
})
