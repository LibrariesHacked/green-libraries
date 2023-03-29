const fetchHexJson = fetch(greenLibraries.hexJson).then(res => res.json())
const fetchServicesData = fetch(greenLibraries.services).then(res => res.json())
const allData = Promise.all([fetchHexJson, fetchServicesData])
const hexMapElement = document.getElementById('div-library-hexmap')

let storedData = null

const buildHexMap = () => {
  hexMapElement.innerHTML = ''
  var hexdata = storedData[0]
  var serviceData = storedData[1]

  Object.keys(hexdata.hexes).forEach(hexCode => {
    var service = serviceData.find(x => x.Code === hexCode)
    if (service) {
      var greenLibrary = service['Green library']

      hexdata.hexes[hexCode].greenLibrary = greenLibrary === true
      hexdata.hexes[hexCode].colour = greenLibrary ? '#f1f8e9' : '#fafafa'
    }
  })

  new OI.hexmap(hexMapElement, {
    label: {
      show: true,
      clip: true,
      format: function (txt, attr) {
        var greenLibrary = attr.hex.greenLibrary
        var service = attr.hex.n

        var data_attrs = `data-service="${service}" data-green="${greenLibrary === true}"`

        var greenHex = `<tspan ${data_attrs} class="hexdata green">&check;</tspan>`
        var nonGreenHex = `<tspan ${data_attrs} class="hexdata">&nbsp;</tspan>`

        return greenLibrary ? greenHex : nonGreenHex
      }
    },
    hexjson: storedData[0]
  })

  tippy('#div-library-hexmap .hexmap-inner svg g', {
    trigger: 'click',
    content: reference => {
      var span = reference.querySelector('.hexdata')
      if (span && span.dataset.green) {
        var greenLibrary = span.dataset.green === 'true'
        var service = span.dataset.service

        var greenPopup = `<div><span class="span-service">${service}</span><br/>Signed up &check;</div>`
        var nonGreenPopup = `<div><span class="span-service">${service}</span><br/>Not yet signed up</div>`
        return greenLibrary ? greenPopup : nonGreenPopup
      }
      return null
    },
    allowHTML: true
  })

  document.getElementById('p-data-loading').style.display = 'none'
}

allData.then(res => {
  storedData = res
  buildHexMap()
})
