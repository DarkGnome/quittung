/* global html2canvas, jsPDF */

async function printPage () {
  const canvas = await html2canvas(document.body)
  document.body.appendChild(canvas)

  var doc = new jsPDF({
    orientation: 'landscape',
    format: 'a6'
  })
  doc.fromHTML($('body').get(0), 1000, 1000, { width: 900 })
  // doc.autoPrint()

  // doc.text('Hello!', 1, 10);
  const date = new Date().toISOString().slice(0, 10)
  console.log(date)
  doc.save('Quittung ' + date + '.pdf')
}

// window.onload = printPage
