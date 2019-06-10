import sharp from 'sharp'
import path from 'path'
import _ from 'lodash'
import uuidv4 from 'uuid/v4'

function resolveTokens(size, filepath) {
  let parsedFilepath = path.parse(filepath)

  return [
    { regex: /\[w\]/g, value: size.w || '' },
    { regex: /\[h\]/g, value: size.h || '' },
    { regex: /\[n\]/g, value: parsedFilepath.name || '' },
    { regex: /\[e\]/g, value: parsedFilepath.ext || '' },
    { regex: /\[b\]/g, value: parsedFilepath.base || '' },
    { regex: /\[uuid\]/g, value: uuidv4() },
  ]
}

function resolveOutputFilename(name, tokens) {
  tokens.forEach(tokenObj => {
    name = name.replace(tokenObj.regex, tokenObj.value)
  })

  return name.toLowerCase()
}

function resolveSize(sizeConfig) {
  const ratioH = (dw, dh, w) => {
    return parseInt((w * dh) / dw)
  }

  const ratioW = (dw, dh, h) => {
    return parseInt((h * dw) / dh)
  }

  if (_.isInteger(sizeConfig)) {
    return { w: sizeConfig }
  }

  if (sizeConfig.aspectRatio) {
    let dw = sizeConfig.aspectRatio.split(':')[0]
    let dh = sizeConfig.aspectRatio.split(':')[1]

    return sizeConfig.w
      ? { w: sizeConfig.w, h: ratioH(dw, dh, sizeConfig.w) }
      : { w: ratioW(dw, dh, sizeConfig.h), h: sizeConfig.h }
  }

  return sizeConfig
}

const resize = (filepath, output, config) => {
  const sizesConfig = config.sizes || []

  sizesConfig.forEach(sizeConfig => {
    let size = resolveSize(sizeConfig)
    let name = sizeConfig.name || config.name || '[b]'
    let jpegOptions = sizeConfig.jpeg || config.jpeg || null
    let resizeOptions = sizeConfig.resize || config.resize || {}

    if (_.isFunction(name)) {
      name = name(filepath)
    }

    const outputFilename = resolveOutputFilename(name, resolveTokens(size, filepath))

    let sharpedFile = sharp(path.resolve(filepath))

    sharpedFile.resize(size.w, size.h, resizeOptions)
    sharpedFile.jpeg(Object.assign({ quality: 85, progressive: true }, jpegOptions))
    sharpedFile.toFile(path.resolve(output, outputFilename), (err, info) => {})
  })
}

export default resize
