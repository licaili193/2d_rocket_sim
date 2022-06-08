class Earth {
  constructor(viewport, graphics) {
    this.viewport_ = viewport;
    this.graphics_ = graphics;

    this.graphics_
      .beginFill(0x2E8BC0)
      .drawCircle(0, 0, EARTH_RADIUS_KM);
    
    this.graphics_.zIndex = 0;
    this.viewport_.addChild(this.graphics_);
  }
}

class Ball {
  constructor(viewport, graphics) {
    this.viewport_ = viewport;
    this.graphics_ = graphics;

    this.graphics_.zIndex = 2;
    this.viewport_.addChild(this.graphics_);

    this.x_ = 0;
    this.y_ = 0;
  }

  setPosition(x, y) {
    this.x_ = x;
    this.y_ = -y;
    this.size_ = 1;
  }

  setSize(size) {
    this.size_ = size;
  }

  draw(zoomLevel) {
    this.graphics_.clear();
    this.graphics_
      .beginFill(0xFFFFFF)
      .drawCircle(this.x_, this.y_, this.size_ * zoomLevel);
  }
  
  onZoomed(zoomLevel) {
    this.draw(zoomLevel);
  }
}

class Arrow {
  constructor(viewport, graphics) {
    this.viewport_ = viewport;
    this.graphics_ = graphics;

    this.graphics_.zIndex = 1;
    this.viewport_.addChild(this.graphics_);

    this.x_ = 0;
    this.y_ = 0;
    this.theta_ = 0;
    this.length_ = 1;
  }

  setPosition(x, y) {
    this.x_ = x;
    this.y_ = -y;
  }

  setAngle(theta) {
    this.theta_ = theta;
  }

  setLength(length) {
    this.length_ = length;
  }

  draw(zoomLevel) {
    this.graphics_.clear();
    var linewidth = 50 * zoomLevel;
    this.graphics_.lineStyle(linewidth, 0xffd900, 1);
    this.graphics_
      .moveTo(this.x_, this.y_)
      .lineTo(this.x_ + this.length_ * zoomLevel * Math.cos(this.theta_), this.y_ - this.length_ * zoomLevel * Math.sin(this.theta_));
  }

  onZoomed(zoomLevel) {
    this.draw(zoomLevel);
  }
}