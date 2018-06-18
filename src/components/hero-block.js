const image = document.querySelector('.hero-block > .image')

const update = () => {
  window.requestAnimationFrame(update)

  const doc = document.documentElement
  const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
  const offset = (top / 10) * 0.5

  image.style.transform = `translate3d(0, ${offset}rem, 0)`
}

update()
