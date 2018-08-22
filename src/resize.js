import sharp from 'sharp'
import path from 'path'
import _ from 'lodash'

function resolveTokens(size, filepath) {
  let parsedFilepath = path.parse(filepath)

  return [
    { regex: /\[w\]/g, value: size.w || '' },
    { regex: /\[h\]/g, value: size.h || '' },
    { regex: /\[n\]/g, value: parsedFilepath.name || '' },
    { regex: /\[e\]/g, value: parsedFilepath.ext || '' },
    { regex: /\[b\]/g, value: parsedFilepath.base || '' },
  ]
}

function resolveOutputFilename(name, tokens) {
  tokens.forEach(tokenObj => {
    name = name.replace(tokenObj.regex, tokenObj.value)
  })

  return name
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

    const outputFilename = resolveOutputFilename(name, resolveTokens(size, filepath))

    let sharpedFile = sharp(path.resolve(filepath))

    sharpedFile.resize(size.w, size.h)
    sharpedFile.jpeg(Object.assign({ quality: 85, progressive: true }, config.jpeg))
    sharpedFile.toFile(path.resolve(output, outputFilename), (err, info) => {})
  })
}

export default resize
