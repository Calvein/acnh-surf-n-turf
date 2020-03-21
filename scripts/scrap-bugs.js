// This script has to be run manually in the console
// on https://animalcrossing.fandom.com/wiki/Bugs_(New_Horizons)

const formatText = (el) => el.textContent.trim()
const formatImage = (el) => $('img', el).attr('data-src')
const formatPrice = (el) =>
  parseInt(formatText(el).replace(',', ''), 10) || null
const formatMonths = (els) => els.map((el) => formatText(el) === '✓')

const data = $('.jquery-tablesorter:first tbody tr')
  .get()
  .map((el) => {
    const [name, image, price, location, time, ...months] = Array.from(
      el.children,
    )

    return {
      name: formatText(name),
      image: formatImage(image),
      price: formatPrice(price),
      location: formatText(location),
      time: formatText(time),
      months: formatMonths(months),
    }
  })
  .filter((d) => d.name !== 'Unknown')

copy(data)
