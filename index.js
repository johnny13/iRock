#!/usr/bin/env node

//  Runs the PUG command with a number of custom filters
//  Allowing for JSTransformer & other dynamic data to be applied on build

const path = require('path')
const pug = require('pug')
const fs = require('fs-extra')
const c = require('ansi-colors')
const package = require('./package.json')
const { draw, drawAsString } = require('terminal-img')
const jetpack = require('fs-jetpack')
const copy = require('recursive-copy')
const {
    codeblock,
    prismify,
    highlightify,
    scssify,
    markdownify,
    iconify,
    stylus,
} = require('./pug-filters')

const baseDirectory = './src/views/pages/'
const assetDirectory = './src/assets/'
const finalDirectory = './docs/'

const copyOptions = {
    overwrite: true,
    expand: true,
    dot: false,
    junk: false,
}

const options = {
    pretty: true,
    filters: {
        stylus,
        scssify,
        markdownify,
        highlightify,
        prismify,
        codeblock,
        iconify,
    },
}

async function startUp() {
    // await draw('Logo.png', { width: 80, height: 36 })
    console.log('iROCK PORTFOLIO BUILDER!', '')
    const allPages = jetpack.find(baseDirectory, { matching: '*.pug' })

    console.log('')
    console.log(c.red('PROJECT ' + package.name + ' VER. ' + package.version))

    console.log('')
    console.log(
        c.white.bold('TRANSFORMING PUG -> HTML') +
            ' ' +
            allPages.length +
            ' Pages Total'
    )

    allPages.forEach(function (path, index) {
        console.log(path)
        let object = jetpack.inspect(path)
        console.log(
            c.green.bold(' #' + index + '|  ') + c.white.bold(object.name)
        )
        buildWebpages(object.name)
    })
    console.log('', '', '')

    await copyAssets()
}

async function buildWebpages(pageName) {
    const html = pug.compileFile(
        baseDirectory + pageName,
        options
    )({
        pages: require(baseDirectory + 'webpages.json'),
        package: package,
    })

    const nameWithoutExtension = path.basename(baseDirectory + pageName, '.pug')
    console.log('Saving ' + nameWithoutExtension)
    await fs.writeFile(
        finalDirectory + nameWithoutExtension + '.html',
        html,
        (err) => {
            if (err) {
                console.error(err)
            }

            // file written successfully
            console.log(
                c.green.bold(finalDirectory + nameWithoutExtension + '.html'),
                c.green(' created successfully!')
            )
        }
    )
}

// @TODO: improve how this checks if a copy is needed.
async function copyAssets() {
    if (jetpack.exists(finalDirectory + 'robots.txt')) {
        console.log(c.green.bold('ASSETS NOT COPIED'))
    } else {
        console.log(c.green.bold('STARTING ASSET COPY...'))
        copy(assetDirectory, finalDirectory, copyOptions)
            .then(function (results) {
                console.log(
                    '\n',
                    c.green.bold('COPIED ' + results.length + ' FILES'),
                    '\n'
                )
            })
            .catch(function (error) {
                console.error(c.red.bold('COPY FAILURE!!! ' + error))
            })
    }
}

startUp()
