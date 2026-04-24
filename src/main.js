document.addEventListener("DOMContentLoaded", () => {
    cargarSeries();
})

function cargarSeries() {
  fetch("http://localhost:8000/series")
  .then(res => res.json())
  .then(series => {
    const contenedor = document.querySelector(".lista");
    contenedor.innerHTML = "";
    series.forEach(serie =>{
      const card = document.createElement("div")
      card.className = "card"
      card.innerHTML = `
                      <img src="${serie.img}" alt="${serie.name}"/>
                      <h3>${serie.name}</h3>
                      <p>Episodio actual: ${serie.current_ep}</p>
                      <p>Total episodios: ${serie.total_ep}</p>
                      `
      contenedor.appendChild(card)
    })
  })
}

