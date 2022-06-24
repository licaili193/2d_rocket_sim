class App {
  constructor() {
    // Create PIXI App
    this.app_ = new PIXI.Application({
      autoResize: true,
      resolution: devicePixelRatio, 
      antialias: true,
    });
    document.querySelector('#frame').appendChild(this.app_.view);

    // Create viewport
    this.viewport_ = new pixi_viewport.Viewport({
      screenWidth: 100,
      screenHeight: 100,
      worldWidth: EARTH_RADIUS_KM * 10,
      worldHeight: EARTH_RADIUS_KM * 10,

      interaction: this.app_.renderer.plugins.interaction
    });
    this.app_.stage.addChild(this.viewport_);

    // Config viewport
    this.viewport_.clampZoom({
      minWidth: EARTH_RADIUS_KM * 3,
      minHeight: EARTH_RADIUS_KM * 3,
      maxWidth: EARTH_RADIUS_KM * 50,
      maxHeight: EARTH_RADIUS_KM * 50,
    });
    this.viewport_.snap(0, 0, {
      time: 0,
    });

    this.viewport_.pinch().wheel({
      center: new PIXI.Point(0, 0),
    });

    // Add callback functions
    window.addEventListener('resize', this.onResize.bind(this));

    this.viewport_.on('zoomed', this.onZoomed.bind(this));

    // Initialization
    this.init();

    // Main loop
    this.period_ = 1000 / 3;
    setTimeout(this.tick.bind(this), this.period_);
  }

  onResize() {
    const parent = this.app_.view.parentNode;
    this.app_.renderer.resize(parent.clientWidth, parent.clientHeight);
    this.viewport_.resize(parent.clientWidth, parent.clientHeight);
  }

  onZoomed() {
    // On Zoomed event
  }

  getZoomValue() {
    return Math.min(this.viewport_.worldScreenHeight, this.viewport_.worldScreenWidth) / EARTH_RADIUS_KM / 4;
  }

  getFromUi(item) {
    if (document.getElementById(item)  !== undefined) {
      return document.getElementById(item).value;
    } else {
      return undefined;
    }
  }

  init() {
    // Call resize once to set the initial size
    this.onResize();

    // Create Earth
    this.earth = new Earth(this.viewport_, new PIXI.Graphics());

    // Create space craft
    this.craft = new Ball(this.viewport_, new PIXI.Graphics());
    this.craft.setSize(EARTH_RADIUS_KM / 50);

    // Create arrow
    this.arrow = new Arrow(this.viewport_, new PIXI.Graphics());
    this.arrow.setLength(EARTH_RADIUS_KM / 5);

    // Create trace
    this.trace = new Trace(this.viewport_, new PIXI.Graphics());

    // Fit content
    this.viewport_.fit(true, EARTH_RADIUS_KM * 3, EARTH_RADIUS_KM * 3);
    this.viewport_.sortChildren();

    // Call zoom once to set the initial space craft size
    this.onZoomed();

    // Simulation control
    this.stared_ = false;

    // Event handlers
    document.getElementById("startButton").addEventListener("click", this.onStart.bind(this));
    document.getElementById("stopButton").addEventListener("click", this.onStop.bind(this));
  }

  tick() {
    if (this.stared_) {
      // Simulating
      this.arrow.setHide(true);

      if (this.engine_ !== undefined) {
        this.engine_.step(1);
        const res = this.engine_.getCurrentResult();

        const newX = res[0] / 1000;
        const newY = res[1] / 1000;
        this.craft.setPosition(newX, newY);
        this.craft.setAngle(res[4]);

        if (this.traceData_.length < 1) {
          this.traceData_.push([newX, newY]);
        } else {
          const last = this.traceData_[this.traceData_.length - 1];
          if (((last[0] - newX) * (last[0] - newX) + (last[1] - newY) * (last[1] - newY)) >= MIN_TRACE_STEP_KM * MIN_TRACE_STEP_KM) {
            this.traceData_.push([newX, newY]);
          }
        }

        if (this.traceData_.length > MAX_TRACE_POINT) {
          this.traceData_.shift();
        }
      }
    } else {
      // Simulation stopped
      this.arrow.setHide(false);

      const x =  Number(this.getFromUi("initX"));
      const y = Number(this.getFromUi("initY"));
      const speed = Number(this.getFromUi("speed"));
      const theta = Number(this.getFromUi("angle"));
      const vx = Math.cos(theta) * speed;
      const vy = Math.sin(theta) * speed;
      const orientation = Number(this.getFromUi("orientation"));
      const angularVelocity = Number(this.getFromUi("omega"));

      const timestep = this.period_ * this.getFromUi("step") / 1000;

      this.craft.setPosition(x / 1000, y / 1000);
      this.craft.setAngle(orientation);
      this.arrow.setPosition(x / 1000, y / 1000);
      this.arrow.setAngle(theta);

      this.engine_ = new Engine(timestep);
      this.engine_.setInitialCondition(x, y, vx, vy, orientation, angularVelocity);

      this.traceData_ = [];
    }

    // Draw stuff
    this.craft.draw(this.getZoomValue());
    this.arrow.draw(this.getZoomValue());
    this.trace.draw(this.traceData_, this.getZoomValue());

    setTimeout(this.tick.bind(this), 1000 / 30);
  }

  onStart() {
    this.stared_ = true;

    let elements = document.querySelectorAll('[disable-when-sim]');
    for (let element of elements) {
      element.disabled = true;
    }
    elements = document.querySelectorAll('[disable-when-stop]');
    for (let element of elements) {
      element.disabled = false;
    }
  }

  onStop() {
    this.stared_ = false;

    this.engine_ = undefined;
    this.traceData_ = undefined;

    let elements = document.querySelectorAll('[disable-when-sim]');
    for (let element of elements) {
      element.disabled = false;
    }
    elements = document.querySelectorAll('[disable-when-stop]');
    for (let element of elements) {
      element.disabled = true;
    }
  }
}
