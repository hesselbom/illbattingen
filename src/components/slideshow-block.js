import { tns } from 'tiny-slider/src/tiny-slider.module'
import 'tiny-slider/dist/tiny-slider.css'

const blocks = document.querySelectorAll('.slideshow-block')

for (let i = 0; i < blocks.length; i++) {
  const block = blocks[i]
  const ul = block.querySelector('ul')

  tns({
    container: ul,
    autoplay: true,
    autoplayButtonOutput: false,
    nav: false,
    mode: 'gallery'
  })
}
