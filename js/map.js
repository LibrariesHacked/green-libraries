const fetchHex = fetch(greenLibraries.hexJson).then(res => res.json())
const fetchServices = fetch(greenLibraries.services).then(res => res.json())
const allData = Promise.all([fetchHex, fetchServices])
const hexMapEl = document.getElementById('div-library-hexmap')

let storedData = null

const buildHexMap = () => {
  hexMapEl.innerHTML = ''
  const hexdata = storedData[0]
  const serviceData = storedData[1]

  Object.keys(hexdata.hexes).forEach(code => {
    const service = serviceData.find(x => x.Code === code)
    if (service) {
      const greenLibrary = service['Green library']
      hexdata.hexes[code].greenLibrary = greenLibrary === true
      hexdata.hexes[code].colour = greenLibrary ? '#e3f3e2' : '#f2f2f2'
    }
  })

  new OI.hexmap(hexMapEl, {
    label: {
      show: true,
      clip: true,
      format: function (txt, attr) {
        const greenLibrary = attr.hex.greenLibrary
        const service = attr.hex.n

        var data_attrs = `data-service="${service}" data-green="${
          greenLibrary === true
        }"`

        const greenHex = `<tspan ${data_attrs} class="hexdata green">&check;</tspan>`
        const nonGreenHex = `<tspan ${data_attrs} class="hexdata">&nbsp;</tspan>`

        return greenLibrary ? greenHex : nonGreenHex
      }
    },
    hexjson: storedData[0]
  })

  tippy('#div-library-hexmap .hexmap-inner svg g', {
    trigger: 'click',
    content: reference => {
      const span = reference.querySelector('.hexdata')
      if (span && span.dataset.green) {
        const greenLibrary = span.dataset.green === 'true'
        const service = span.dataset.service

        const greenPopup = `<div class="popup"><span class="popup-title">${service}</span><br/>Signed</div>`
        const nonGreenPopup = `<div class="popup"><span class="popup-title">${service}</span><br/>Not yet signed</div>`
        return greenLibrary ? greenPopup : nonGreenPopup
      }
      return null
    },
    allowHTML: true
  })

  document.getElementById('p-data-loading').style.display = 'none'
}

allData.then(r => {
  storedData = r
  buildHexMap()
})
