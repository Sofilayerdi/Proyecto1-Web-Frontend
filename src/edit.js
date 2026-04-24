const params = new URLSearchParams(window.location.search)
const id = params.get("id")

if (!id) {
    alert("No se encontró el ID de la serie. Volviendo al inicio...")
    window.location.href = "index.html"
}

fetch(`http://localhost:8000/series/${id}`)
    .then(res => {
        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`)
        return res.json()
    })
    .then(serie => {
        document.getElementById("titulo-serie").textContent = serie.name
        document.getElementById("name").value = serie.name
        document.getElementById("current").value = serie.current_ep
        document.getElementById("total").value = serie.total_ep
        document.getElementById("imagen").value = serie.img
    })
    .catch(err => {
        console.error("Error al cargar la serie:", err)
        alert("No se pudo cargar la información de la serie.")
    })

document.querySelector("#add-serie").addEventListener("submit", (e) => {
    e.preventDefault()

    const serie = {
        name: document.getElementById("name").value,
        current_ep: parseInt(document.getElementById("current").value),
        total_ep: parseInt(document.getElementById("total").value),
        img: document.getElementById("imagen").value
    }

    fetch(`http://localhost:8000/series/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serie)
    })
    .then(res => {
        if (res.ok) {
            window.location.href = "index.html"
        } else {
            alert("Error al guardar los cambios.")
        }
    })
    .catch(err => {
        console.error("Error al editar la serie:", err)
        alert("No se pudo conectar con el servidor.")
    })
})

document.getElementById("back").addEventListener("click", () => {
    window.location.href = "index.html"
})