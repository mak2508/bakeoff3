class Button {
  constructor({text='', size, position, callback, color=[200,200,200], active=false}) {
    this.text = text
    this.size = size
    this.position = position
    this.callback = callback
    this.color = color
    this.active = active
    this.constructor.instances.push(this)
  }
  static checkButtonPress() {
    for (i=0; i<this.instances.length; i++) {
      let button = this.instances[i]
      if (button.active && didMouseClick(...button.position, ...button.size)) {
        button.callback()
        break // only first active button gets pressed
      }
    }
  }
  updateText(text) {
    this.text = text
  }
  updateSize(width, height) {
    this.size = [width, height]
  }
  updatePosition(x, y) {
    this.position = [x, y]
  }
  draw() {
    if (this.active) {
      strokeWeight(1);
      stroke(150);
      fill(...this.color)
      rect(...this.position, ...this.size)
      noStroke()
      fill(50)
      textAlign(CENTER)
      textFont('Helvetica', 13)
      text(this.text.split('').join(' '), ...this._getTextPosition())
    }
  }
  mousePressed() {
    this.callback()
  }
  show() {
    this.active = true
  }
  hide() {
    this.active = false
  }
  _getTextPosition() {
    return [this.position[0] + this.size[0]/2,
            this.position[1] + 4*this.size[1]/7]
  }
}
Button.instances = []
