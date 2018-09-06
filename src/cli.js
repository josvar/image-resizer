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
    let config = options.config
    if (!config) {
      console.error(`Missing config [-c] option, aborting.`)
      process.exit(1)
    }
    config = require(path.resolve(options.config))

    const preset = options.preset
    if (!preset) {
      console.error(`Missing preset [-p] option, aborting.`)
      process.exit(1)
    }
    const presetConfig = config.presets[preset]

    const input = options.input
    if (!input) {
      console.error(`Missing input [-i] option, aborting.`)
      process.exit(1)
    }

    const output = options.output
    if (!output) {
      console.error(`Missing output [-o] option, aborting.`)
      process.exit(1)
    }

    if (!presetConfig) {
      console.error(`Preset ${preset} does not exists, aborting.`)
      process.exit(1)
    }

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
