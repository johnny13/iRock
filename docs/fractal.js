// Global Vars
var fr = 60
var stage
var myCanvas
var hue
var bgHue
var circleHue
var drawOnce = false
var reset = true
var initialSize

// Setup
function setup() {
    // Create Stage
    var theWidth =
        document.body.offsetWidth > 767
            ? document.body.offsetWidth * 0.5
            : document.body.offsetWidth
    stage = createVector(Math.round(theWidth), document.body.offsetHeight)
    myCanvas = createCanvas(stage.x, stage.y)
    myCanvas.parent('homepageCanvas')
    frameRate(fr)

    // Set Background
    colorMode(HSB)
    mousePressed()
    // Set Fractal Size
    resize()

    window.addEventListener('resize', resize)
    // gskinner lab export
    // LabTemplate.loadComplete();
}

function resize() {
    var theWidth =
        window.innerWidth > 767 ? window.innerWidth * 0.5 : window.innerWidth
    resizeCanvas(Math.round(theWidth), window.innerHeight)
    if (window.innerWidth > window.innerHeight) {
        initialSize = window.innerWidth / 5
    } else {
        initialSize = window.innerHeight / 5
    }
}

// MOUSE EVENTS
function mousePressed() {
    // hue = random(240, 300);
    hue = random(0, 360)

    bgHue = hue
    bgHue = createVector(correctRotation(bgHue), 50, 20)
    background(bgHue.x, bgHue.y, bgHue.z)
    getCircleHue(bgHue.x)
    draw()
}

// SHAPE ADJUSTMENTS
function getCircleHue(c) {
    circleHue = bgHue.x + random(100, 120)
    circleHue = createVector(correctRotation(circleHue), 70, 80)
}

// FRACTAL
function fractal(x, y, d, i) {
    var myHue = circleHue.x + random(-20, 20)
    var myLightness = circleHue.z + random(-20, 20)

    fill(correctRotation(myHue), circleHue.y, myLightness)
    noStroke()
    ellipse(x, y, d, d)

    noLoop()

    if (d > 2) {
        var mixitup = 100
        fractal(
            x + d + random(-2 * mixitup, mixitup) / i,
            y + random(-1 * mixitup, mixitup),
            d / i,
            i
        )
        fractal(
            x - d + random(-1 * mixitup, mixitup) / i,
            y + random(-1 * mixitup, mixitup),
            d / i,
            i
        )
    }
}

// Update Canvas
function draw() {
    clear()
    background(bgHue.x, bgHue.y, bgHue.z)

    // Draw Fractal
    fractal(width / 2, height / 2, random(initialSize, initialSize * 2), 1.5)
}

// UTILITIES

// Correct Rotation – Works for colors and anything that uses 360 degree rotational values
function correctRotation(deg) {
    /*
  Corrects a rotation and if it:
  exceed 360 degrees or is less than 0
*/
    if (deg > 360) {
        deg -= 360
    } else if (deg < 0) {
        deg += 360
    }
    return deg
}
