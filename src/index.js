import glob from 'glob'
import path from 'path'
import resize from './resize'

const resizeImages = (input, output, config) => {
  const pattern = path.format({
    dir: input,
    base: '*.+(jpg|jpeg|gif|png)',
  })

  const filenames = glob.sync(pattern, { nodir: true })

  filenames.forEach(filepath => {
    resize(filepath, output, config)
  })
}

export default resizeImages
