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
  }

  onResize() {
    const parent = this.app_.view.parentNode;
    this.app_.renderer.resize(parent.clientWidth, parent.clientHeight);
    this.viewport_.resize(parent.clientWidth, parent.clientHeight);
  }

  onZoomed() {
    this.craft.clear();
    this.craft
      .beginFill(0xFFFFFF)
      .drawCircle(0, -EARTH_RADIUS_KM, EARTH_RADIUS_KM / 50 * this.getZoomValue());
  }

  getZoomValue() {
    return Math.min(this.viewport_.worldScreenHeight, this.viewport_.worldScreenWidth) / EARTH_RADIUS_KM / 4;
  }

  init() {
    // Call resize once to set the initial size
    this.onResize();

    // Create Earth
    this.earth = new PIXI.Graphics()
      .beginFill(0x2E8BC0)
      .drawCircle(0, 0, EARTH_RADIUS_KM);
    this.viewport_.addChild(this.earth);

    // Create space craft
    this.craft = new PIXI.Graphics();
    this.viewport_.addChild(this.craft);

    // Fit content
    this.viewport_.fit(true, EARTH_RADIUS_KM * 3, EARTH_RADIUS_KM * 3);

    // Call zoom once to set the initial space craft size
    this.onZoomed();
  }
}
