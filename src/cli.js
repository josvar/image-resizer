#!/usr/bin/env node

import program from 'commander'
import process from 'process'
import path from 'path'
import fs from 'fs-extra'
import resize from './index'

const packageJson = require(path.resolve(__dirname, '../package.json'))

program.version(packageJson.version).usage('<command> [<args>]')

program
  .command('init [filename]')
  .usage('[options] [filename]')
  .action((filename = 'images.config.js') => {
    let destination = path.resolve(filename)

    if (!path.extname(filename).includes('.js')) {
      destination += '.js'
    }

    if (fs.existsSync(destination)) {
      console.error(`Destination ${destination} already exists, aborting.`)
      process.exit(1)
    }

    const output = fs.readFileSync(path.resolve(__dirname, '../config.stub.js'), 'utf8')
    fs.outputFileSync(destination, output)

    console.warn(`Generated ImageResizer config: ${destination}`)
    process.exit()
  })

program
  .command('resize [trash]')
  .option('-c, --config <path>', 'Path to config file')
  .option('-p, --preset <name>', "Preset's name")
  .option('-i, --input <path>', 'Input file or folder')
  .option('-o, --output <path>', 'Output file or folder')
  .action((trash, options) => {
    const defaultOptions = {
      config: './images.config.js',
      input: './input',
      output: './output',
      preset: 'default',
    }

    const configPath = options.config || defaultOptions.config

    const config = require(path.resolve(configPath))
    const preset = options.preset || defaultOptions.preset
    const presetConfig = config.presets[preset]
    const input = options.input || defaultOptions.input
    const output = options.output || defaultOptions.output

    if (!presetConfig) {
      console.error(`Preset ${preset} does not exists, aborting.`)
      process.exit(1)
    }

    console.warn(`Using config file: ${configPath}`)
    console.warn(`Using input folder: ${input}`)
    console.warn(`Using output folder: ${output}`)
    console.warn(`Using preset: ${preset}`)

    resize(input, output, presetConfig)
  })

program
  .command('*', null, {
    noHelp: true,
  })
  .action(() => {
    program.help()
  })

program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
  process.exit()
}
