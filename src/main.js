let paginaActual = 1

document.addEventListener("DOMContentLoaded", () => {
    cargarSeries(paginaActual);
})

function cargarSeries(page) {
  fetch(`http://localhost:8000/series?page=${page}&limit=5`)
  .then(res => res.json())
  .then(series => {
    if (series.length === 0) {
        paginaActual--
        return
    }
    document.getElementById("after").disabled = series.length < 5
    document.getElementById("before").disabled = paginaActual === 1

    const contenedor = document.querySelector(".lista");
    contenedor.innerHTML = "";
    series.forEach(serie => {
      const card = document.createElement("div")
      card.className = "card"
      card.innerHTML = `
          <img src="${serie.img}" alt="${serie.name}" onerror="this.style.background='#FBEAF0'"/>
          <div class="card-body">
              <h3>${serie.name}</h3>
              <p>Ep. ${serie.current_ep} / ${serie.total_ep}</p>
              <progress value="${serie.current_ep}" max="${serie.total_ep}"></progress>
              <div class="card-actions">
                  <button class="edit" data-id="${serie.id}">Editar</button>
                  <button class="delete" data-id="${serie.id}">Borrar</button>
              </div>
          </div>
      `
      contenedor.appendChild(card)

      card.querySelector(".delete").addEventListener("click", () => {
          eliminarSerie(serie.id)
      })

      card.querySelector(".edit").addEventListener("click", () => {
        window.location.href = 'edit.html?id=' + serie.id
      })

    })
  })
}

function eliminarSerie(id) {
    fetch(`http://localhost:8000/series/${id}`, {
        method: "DELETE"
    })
    .then(res => {
        if (res.ok) {
            cargarSeries(paginaActual)
        }
    })
}

document.getElementById("addSerie").addEventListener("click", () => {
    window.location.href = "create.html"
})


document.getElementById("before").addEventListener("click", () => {
    if (paginaActual > 1) {
        paginaActual--
        cargarSeries(paginaActual)
    }
})

document.getElementById("after").addEventListener("click", () => {
    paginaActual++;
    cargarSeries(paginaActual);
})


