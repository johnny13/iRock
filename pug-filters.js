/*jshint esversion: 6 */
var prism = require('jstransformer')(require('jstransformer-prismjs'))
var highlight = require('jstransformer')(require('jstransformer-highlight'))
var scss = require('jstransformer')(require('jstransformer-scss'))
var markdown = require('jstransformer')(require('jstransformer-markdown-it'))
var styl = require('stylus')

const codeblock = (block, option) => {
    let lang = 'html'
    let cName = ''
    let prevC = ''
    if (option) {
        lang = option.lang
        cName = option.class
        prevC = option.preClass
    }

    let fClass = 'documentation-content' + ' ' + cName

    let escaped = ''
    if (lang === 'html') {
        escaped = `<div class="preview-wrapper"><div class="mojo-preview ${prevC}">${block}</div></div>`
    }

    let highlightBlock = highlight.render(block, { language: lang }).body

    // prettier-ignore
    let highlighted = `<div class='mojo-highlight'><pre class="code" data-lang="${lang}"><code>${highlightBlock}</code></pre></div>`;

    let ex = "<span class='mojo-doclabel'>EXAMPLE</span>"

    let htmlTemplate =
        "<div class='mojo-docblock'>" + ex + escaped + highlighted + '</div>'

    let final = "<div class='" + fClass + "'>" + htmlTemplate + '</div>'

    return final
}

const prismify = (block, options) => {
    let lang = 'html'
    let cName = ''
    let prevC = ''
    if (options) {
        lang = options.lang
        cName = options.class
        prevC = options.preClass
    }

    let render = prism.render(block, { language: lang }).body

    // prettier-ignore
    let results = "<pre class='code' data-lang='" + lang + "'><code>" + render + "</code></pre>";
    return results
}

const highlightify = (block, options) => {
    let lang = options.lang || 'html'
    let oc = options.class || ''
    let render = highlight.render(block, { language: lang }).body

    // prettier-ignore
    let results = "<pre class='code " + oc + "' data-lang='" + lang + "'><code>" + render + "</code></pre>";
    return results
}

const scssify = (scssBlock, options) => {
    // Compile SCSS to CSS
    let cssResults = scss.render(scssBlock).body
    let preCode = true

    // Lets Highlight them!
    if (options.highlight) {
        cssResults = highlight.render(cssResults, { language: 'css' }).body
        scssBlock = highlight.render(scssBlock, { language: 'scss' }).body
    } else if (options.prism) {
        cssResults = prism.render(cssResults, { language: 'css' }).body
        scssBlock = prism.render(scssBlock, { language: 'scss' }).body
        preCode = false
    }

    let scssPre = `<pre data-lang="scss"><code>${scssBlock}</code></pre>`
    let cssPre = `<pre data-lang="css"><code>${cssResults}</code></pre>`
    if (!preCode) {
        scssPre = `${scssBlock}`
        cssPre = `${cssResults}`
    }

    let scssLabel = (cssLabel = '')
    if (options.label) {
        scssLabel = "<p class='mojo-docblock-label'>Uncompiled SCSS</p>"
        cssLabel = "<p class='mojo-docblock-label'>Compiled CSS</p>"
    }

    let scssTitle = ''
    if (options.title) {
        scssTitle = `<h3 class="mojo-docblock-title">${options.title}</h3>`
    }

    let scssCodeBlock = `<div class='mojo-docblock split'>${scssTitle}<div class="mojo-code-scss">${scssLabel}${scssPre}</div><div class='mojo-code-css'>${cssLabel}${cssPre}</div></div>`

    return scssCodeBlock
}
const markdownify = (block, options) => {
    let markdownBlock = markdown.render(block).body
    return markdownBlock
}
const iconify = (block, options) => {
    let label = "<p class='icon-label'>" + block + '</p>'
    let render = '<div>' + label + '</div>'
    return render
}
const stylus = (str, opts) => {
    let ret
    str = str.replace(/\\n /g, '')

    styl(str, opts).render(function (err, css) {
        if (err) throw err
        ret = css.replace(/\s/g, '')
    })
    return '\n<style>' + ret + '</style>'
}
module.exports = {
    codeblock,
    prismify,
    highlightify,
    scssify,
    markdownify,
    iconify,
    stylus,
}
