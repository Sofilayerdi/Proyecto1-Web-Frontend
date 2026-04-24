let paginaActual = 1

document.addEventListener("DOMContentLoaded", () => {
    cargarSeries(paginaActual);

    let debounceTimer
    document.getElementById("buscar").addEventListener("input", () => {
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
            paginaActual = 1
            cargarSeries(paginaActual)
        }, 300)
    })

})



function cargarSeries(page) {
  const q = document.getElementById("buscar").value.trim()  
  fetch(`https://series-tracker-rk1z.onrender.com/series?page=${page}&limit=5&q=${encodeURIComponent(q)}`)
  .then(res => res.json())
  .then(series => {
    if (!series || series.length === 0) {
        if (paginaActual > 1) {
            paginaActual--
            cargarSeries(paginaActual)
        } else {
            document.querySelector(".lista").innerHTML = ""
            document.getElementById("after").disabled = true
            document.getElementById("before").disabled = true
        }
        return
    }

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
        window.location.href = '/edit.html?id=' + serie.id
      })

    })
  })
}

function eliminarSerie(id) {
    fetch(`https://series-tracker-rk1z.onrender.com/series/${id}`, {
        method: "DELETE"
    })
    .then(res => {
        if (res.ok) {
            cargarSeries(paginaActual)
        }
    })
}

document.getElementById("addSerie").addEventListener("click", () => {
    window.location.href = "/create.html"
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



document.getElementById("descargar").addEventListener("click", async () =>{
    const q = document.getElementById("buscar").value.trim()
    const res = await fetch(`https://series-tracker-rk1z.onrender.com/series?limit=10000&q=${encodeURIComponent(q)}`)
    const series = await res.json()
    descargarXLSX(series)
} )

function descargarXLSX(series){
    //tabla de strings compartidos
    const strings = []
    const strIndex = (val) => {
        const s = String(val)
        let i = strings.indexOf(s)
        if (i === -1){
            strings.push(s)
            i = strings.length - 1
        }
        return i
    }

    const headers = ["ID", "Nombre", "Ep. Actual", "Total Ep.", "Imagen URL"]
    headers.forEach(strIndex)

    const rows = series.map(s => [
        { type: "n", value: s.id },
        { type: "s", value: strIndex(s.name) },
        { type: "n", value: s.current_ep },
        { type: "n", value: s.total_ep },
        { type: "s", value: strIndex(s.img) },
    ])

    //Construir XML de la hoja
    const colLetter = (i) => String.fromCharCode(65 + i) 

    //fila de encabezado
    let sheetRows = `<row r="1">`
    headers.forEach((_, i) => {
        sheetRows += `<c r="${colLetter(i)}1" t="s" s="1"><v>${i}</v></c>`
    })
    sheetRows += `</row>`

    //datos empiezan en fila 2
    rows.forEach((cells, rowIdx) =>{
        sheetRows += `<row r="${rowIdx + 2}">`
        cells.forEach((cell, colIdx) => {
            if (cell.type === "s") {
                sheetRows += `<c r="${colLetter(colIdx)}${rowIdx + 2}" t="s"><v>${cell.value}</v></c>`
            } else {
                sheetRows += `<c r="${colLetter(colIdx)}${rowIdx + 2}"><v>${cell.value}</v></c>`
            }
        })
        sheetRows += `</row>`
    })

    //archivos del paquete OOXML
    const files = {
        "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml"  ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml"
    ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml"
    ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/sharedStrings.xml"
    ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
  <Override PartName="/xl/styles.xml"
    ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`,
 
        "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"
    Target="xl/workbook.xml"/>
</Relationships>`,
 
        "xl/workbook.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
          xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Series" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`,
 
        "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"
    Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings"
    Target="sharedStrings.xml"/>
  <Relationship Id="rId3"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles"
    Target="styles.xml"/>
</Relationships>`,
 
        "xl/worksheets/sheet1.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>${sheetRows}</sheetData>
</worksheet>`,
 
        "xl/sharedStrings.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${strings.length}" uniqueCount="${strings.length}">
${strings.map(s => `  <si><t>${escapeXml(s)}</t></si>`).join("\n")}
</sst>`,
 
    
        "xl/styles.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <font><sz val="11"/><name val="Arial"/></font>
    <font><b/><sz val="11"/><name val="Arial"/></font>
  </fonts>
  <fills count="2">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
  </fills>
  <borders count="1">
    <border><left/><right/><top/><bottom/><diagonal/></border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="2">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0"/>
  </cellXfs>
</styleSheet>`,
    }

    //empaquetar y descargar
    const zipBytes = crearZip(files)
    const blob = new Blob([zipBytes], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "series.xlsx"
    a.click()
    URL.revokeObjectURL(a.href)
}

function escapeXml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
}

// Generador de ZIP
function crearZip(files) {
    const encoder = new TextEncoder()
    const localHeaders = []    // guardamos metadatos para el directorio central
    const partes = []          // bytes de cada sección
    let offset = 0             // posición actual en el stream
 
    for (const [nombre, contenido] of Object.entries(files)) {
        const nombreBytes  = encoder.encode(nombre)
        const datosBytes   = encoder.encode(contenido)
        const crc          = crc32(datosBytes)
        const tamanio      = datosBytes.length
 
        // Local file header
        const lh = new Uint8Array(30 + nombreBytes.length)
        const dvLH = new DataView(lh.buffer)
        dvLH.setUint32(0,  0x04034b50, true)   // firma
        dvLH.setUint16(4,  20, true)            // versión mínima (2.0)
        dvLH.setUint16(6,  0,  true)            // flags
        dvLH.setUint16(8,  0,  true)            // método: 0=STORE
        dvLH.setUint16(10, 0,  true)            // hora modificación
        dvLH.setUint16(12, 0,  true)            // fecha modificación
        dvLH.setUint32(14, crc,     true)       // CRC-32
        dvLH.setUint32(18, tamanio, true)       // tamaño comprimido
        dvLH.setUint32(22, tamanio, true)       // tamaño original
        dvLH.setUint16(26, nombreBytes.length, true)  // longitud nombre
        dvLH.setUint16(28, 0, true)             // longitud extra
        lh.set(nombreBytes, 30)
 
        localHeaders.push({ nombreBytes, crc, tamanio, offset })
        partes.push(lh, datosBytes)
        offset += lh.length + tamanio
    }
 
    // Central directory
    const cdOffset = offset
    for (const { nombreBytes, crc, tamanio, offset: lhOffset } of localHeaders) {
        const cd = new Uint8Array(46 + nombreBytes.length)
        const dvCD = new DataView(cd.buffer)
        dvCD.setUint32(0,  0x02014b50, true)   // firma directorio central
        dvCD.setUint16(4,  20, true)            // versión usada
        dvCD.setUint16(6,  20, true)            // versión mínima
        dvCD.setUint16(8,  0,  true)            // flags
        dvCD.setUint16(10, 0,  true)            // método: STORE
        dvCD.setUint16(12, 0,  true)            // hora
        dvCD.setUint16(14, 0,  true)            // fecha
        dvCD.setUint32(16, crc,     true)
        dvCD.setUint32(20, tamanio, true)
        dvCD.setUint32(24, tamanio, true)
        dvCD.setUint16(28, nombreBytes.length, true)
        dvCD.setUint16(30, 0, true)             // extra
        dvCD.setUint16(32, 0, true)             // comentario
        dvCD.setUint16(34, 0, true)             // disk start
        dvCD.setUint16(36, 0, true)             // atributo interno
        dvCD.setUint32(38, 0, true)             // atributo externo
        dvCD.setUint32(42, lhOffset, true)      // offset al local header
        cd.set(nombreBytes, 46)
        partes.push(cd)
        offset += cd.length
    }
 
    const eocd = new Uint8Array(22)
    const dvEOCD = new DataView(eocd.buffer)
    dvEOCD.setUint32(0,  0x06054b50, true)   // firma
    dvEOCD.setUint16(4,  0, true)            // número de disco
    dvEOCD.setUint16(6,  0, true)            // disco con directorio central
    dvEOCD.setUint16(8,  localHeaders.length, true)  // entradas en este disco
    dvEOCD.setUint16(10, localHeaders.length, true)  // total entradas
    dvEOCD.setUint32(12, offset - cdOffset,   true)  // tamaño del directorio central
    dvEOCD.setUint32(16, cdOffset, true)     // offset inicio directorio central
    dvEOCD.setUint16(20, 0, true)            // longitud comentario
    partes.push(eocd)
 
    // Concatenar todo en un solo Uint8Array
    const total = partes.reduce((acc, p) => acc + p.length, 0)
    const resultado = new Uint8Array(total)
    let pos = 0
    for (const p of partes) {
        resultado.set(p, pos)
        pos += p.length
    }
    return resultado
}

const CRC_TABLE = (() => {
    const t = new Uint32Array(256)
    for (let i = 0; i < 256; i++) {
        let c = i
        for (let j = 0; j < 8; j++) {
            c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
        }
        t[i] = c
    }
    return t
})()
 
function crc32(bytes) {
    let crc = 0xFFFFFFFF
    for (let i = 0; i < bytes.length; i++) {
        crc = CRC_TABLE[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8)
    }
    return (crc ^ 0xFFFFFFFF) >>> 0
}