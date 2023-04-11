window.addEventListener('load', windowLoadHandler)

function windowLoadHandler() {
  var theCanvas = document.getElementById('flower')
  var context = theCanvas.getContext('2d')

  var bufferCanvas = document.createElement('canvas')
  bufferCanvas.width = theCanvas.width
  bufferCanvas.height = theCanvas.height
  var bufferContext = bufferCanvas.getContext('2d')

  var timer
  var wait
  var count
  var particleList
  var emitX
  var emitY
  var displayWidth
  var displayHeight
  var particleAlpha
  var baseColorR
  var baseColorG
  var baseColorB
  var r
  var g
  var b
  var phaseR
  var phaseG
  var phaseB
  var targetPhaseR
  var targetPhaseG
  var targetPhaseB
  var lastTargetPhaseR
  var lastTargetPhaseG
  var lastTargetPhaseB
  var phaseShiftDuration
  var phaseShiftCount
  var numberToAddEachFrame

  init()

  function init() {
    wait = 1
    count = wait - 1
    numberToAddEachFrame = 4

    particleAlpha = 1
    targetPhaseB = 0
    targetPhaseG = 0
    targetPhaseR = 0
    phaseShiftDuration = 2000
    phaseShiftCount = phaseShiftDuration - 1

    redF = 0.001
    greenF = 0.001
    blueF = 0.001

    displayHeight = theCanvas.height
    displayWidth = theCanvas.width
    emitX = displayWidth / 2
    emitY = displayHeight / 2
    particleList = {}

    timer - setInterval(onTimer, 1000 / 40)
  }

  function onTimer() {
    var i
    var theta
    var mag

    count++
    if (count >= wait) {
      var time = Date.now()
      phaseShiftCount++
      if (phaseShiftCount >= phaseShiftDuration) {
        phaseShiftCount = 0
        lastTargetPhaseB = targetPhaseB
        lastTargetPhaseG = targetPhaseG
        lastTargetPhaseR = targetPhaseR
        targetPhaseB = Math.random() * 5
        targetPhaseG = Math.random() * 5
        targetPhaseR = Math.random() * 5
      }

      phaseB =
        lastTargetPhaseB +
        (phaseShiftCount / phaseShiftDuration) *
          (targetPhaseB - lastTargetPhaseB)
      phaseG =
        lastTargetPhaseG +
        (phaseShiftCount / phaseShiftDuration) *
          (targetPhaseG - lastTargetPhaseG)
      phaseR =
        lastTargetPhaseR +
        (phaseShiftCount / phaseShiftDuration) *
          (targetPhaseR - lastTargetPhaseR)

      baseColorR = 32 + (0.5 + 0.5 * Math.cos(phaseR + time + redF)) * 223
      baseColorG = 32 + (0.5 + 0.5 * Math.cos(phaseG + time + greenF)) * 223
      baseColorB = 32 + (0.5 + 0.5 * Math.cos(phaseB + time + blueF)) * 223

      r = Math.floor(baseColorR + Math.random() * 0.5 * (255 - baseColorR))
      g = Math.floor(baseColorG + Math.random() * 0.5 * (255 - baseColorG))
      b = Math.floor(baseColorB + Math.random() * 0.5 * (255 - baseColorB))

      for (i = 0; i < numberToAddEachFrame; i++) {
        theta = Math.random() * Math.PI * 10
        mag = 0.2 * Math.random()
        var p = addParticle(
          emitX,
          emitY,
          Math.cos(theta) * 0.8,
          Math.sin(theta) * 0.8
        )
        p.color = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + particleAlpha + ')'

        p.accelX = 0
        p.accelY = 0
      }

      count = 0
    }
    updateParticles()
    drawing()
  }

  function updateParticles() {
    var p = particleList.first
    var nextParticle
    var k
    while (p != null) {
      nextParticle = p.next
      k = Math.random() * 0.00005
      if (p.right) {
        k *= -1
      }
      p.accelX += -k * p.velY
      p.accelY += k * p.velX

      p.velX += p.accelX
      p.velY += p.accelY

      p.x += p.velX
      p.y += p.velY

      p.radius = 3

      p = nextParticle
    }
  }

  function drawing() {
    bufferContext.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height)
    bufferContext.drawImage(theCanvas, 0, 0)

    context.clearRect(0, 0, theCanvas.width, theCanvas.height)
    context.globalAlpha = 0.99
    context.drawImage(bufferCanvas, 0, 0)
    context.globalAlpha = 1

    var p = particleList.first
    while (p != null) {
      context.fillStyle = p.color
      context.beginPath()
      context.arc(p.x, p.y, p.radius, 2, 5 * Math.PI, false)
      context.closePath()
      context.fill()
      p = p.next
    }
  }

  function Particle() {
    this.x = 0
    this.y = 0
    this.velX = 0
    this.velY = 0
    this.color = 'rgba(255, 0, 0, 0.5)'
    this.radius = 0
  }

  function addParticle(x, y, vx, vy) {
    var newParticle

    newParticle = new Particle()

    if (particleList.first == null) {
      particleList.first = newParticle
      newParticle.prev = null
      newParticle.next = null
    } else {
      newParticle.next = particleList.first
      particleList.first.prev = newParticle
      particleList.first = newParticle
      newParticle.prev = null
    }

    newParticle.x = x
    newParticle.y = y
    newParticle.velX = vx
    newParticle.velY = vy
    if (Math.random() < 0.5) {
      newParticle.right = true
    } else {
      newParticle.right = false
    }
    return newParticle
  }
}
