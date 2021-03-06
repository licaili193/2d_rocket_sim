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
    this.size_ = 1;
    this.theta_ = 0;

    this.thrusting_ = false;

    this.indicatorLength_ = EARTH_RADIUS_KM / 15;
  }

  setPosition(x, y) {
    this.x_ = x;
    this.y_ = -y;
  }

  setAngle(theta) {
    this.theta_ = theta;
  }

  setSize(size) {
    this.size_ = size;
  }

  setThrusting(thrusting) {
    this.thrusting_ = thrusting;
  }

  draw(zoomLevel) {
    this.graphics_.clear();
    var linewidth = 50 * zoomLevel;
    this.graphics_
      .beginFill(0xFFFFFF)
      .drawCircle(this.x_, this.y_, this.size_ * zoomLevel)
      .endFill()
      .lineStyle(linewidth, 0xff0000, 1)
      .moveTo(this.x_, this.y_)
      .lineTo(this.x_ + this.indicatorLength_ * zoomLevel * Math.cos(this.theta_), this.y_ - this.indicatorLength_ * zoomLevel * Math.sin(this.theta_));
    
      if (this.thrusting_) {
        this.graphics_
          .beginFill(0xFF0000)
          .drawCircle(this.x_ - this.size_ * zoomLevel * Math.cos(this.theta_), this.y_ + this.size_ * zoomLevel * Math.sin(this.theta_), this.size_ / 2 * zoomLevel)
          .endFill();
      }
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

    this.hide = false;
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

  setHide(hide) {
    this.hide = hide;
  }

  draw(zoomLevel) {
    this.graphics_.clear();
    
    if (!this.hide) {
      var linewidth = 50 * zoomLevel;
      this.graphics_.lineStyle(linewidth, 0xffd900, 1);
      this.graphics_
        .moveTo(this.x_, this.y_)
        .lineTo(this.x_ + this.length_ * zoomLevel * Math.cos(this.theta_), this.y_ - this.length_ * zoomLevel * Math.sin(this.theta_));
    }
  }
}

class Trace {
  constructor(viewport, graphics) {
    this.viewport_ = viewport;
    this.graphics_ = graphics;

    this.graphics_.zIndex = 1;
    this.viewport_.addChild(this.graphics_);
  }

  draw(data, zoomLevel) {
    this.graphics_.clear();

    if (!data) {
      return;
    }
    
    var linewidth = 25 * zoomLevel;
    this.graphics_.lineStyle(linewidth, 0xaaaaaa, 1);
    for (let i = 1; i < data.length; i++) {
      this.graphics_
        .moveTo(data[i - 1][0], -data[i - 1][1])
        .lineTo(data[i][0], -data[i][1]);
    }
  }
}