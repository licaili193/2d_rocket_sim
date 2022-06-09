class Engine {
  constructor(timestep) {
    this.dt_ = timestep;
    this.dt_2_ = timestep / 2;
    this.dt_6_ = timestep / 6;
  }

  static acceleration(x, y) {
    // Convert into KM first since we will use GM_10M6
    x = x / 1000;
    y = y / 1000;
    const rSquare = x*x + y*y;
    const a = GM_10M6 / rSquare;
    return [-x / Math.sqrt(rSquare) * a, -y / Math.sqrt(rSquare) * a];
  }

  step_(r0x, r0y, v0x, v0y) {
    const k1r = [v0x, v0y];
    const k1v = Engine.acceleration(r0x, r0y);

    const k2r = [v0x + k1v[0] * this.dt_2_, v0y + k1v[1] * this.dt_2_];
    const k2v = Engine.acceleration(r0x + k1r[0] * this.dt_2_, r0y + k1r[1] * this.dt_2_);

    const k3r = [v0x + k2v[0] * this.dt_2_, v0y + k2v[1] * this.dt_2_];
    const k3v = Engine.acceleration(r0x + k2r[0] * this.dt_2_, r0y + k2r[1] * this.dt_2_);

    const k4r = [v0x + k3v[0] * this.dt_, v0y + k3v[1] * this.dt_];
    const k4v = Engine.acceleration(r0x + k3r[0] * this.dt_, r0y + k3r[1] * this.dt_);

    const rx = r0x + this.dt_6_ * (k1r[0] + 2 * k2r[0] + 2 * k3r[0] + k4r[0]);
    const ry = r0y + this.dt_6_ * (k1r[1] + 2 * k2r[1] + 2 * k3r[1] + k4r[1]);
    const vx = v0x + this.dt_6_ * (k1v[0] + 2 * k2v[0] + 2 * k3v[0] + k4v[0]);
    const vy = v0y + this.dt_6_ * (k1v[1] + 2 * k2v[1] + 2 * k3v[1] + k4v[1]);

    return [rx, ry, vx, vy];
  }

  setInitialCondition(rx, ry, vx, vy) {
    this.rx_ = rx;
    this.ry_ = ry;
    this.vx_ = vx;
    this.vy_ = vy;
  }

  getCurrentResult() {
    return [this.rx_, this.ry_, this.vx_, this.vy_];
  }

  step(n) {
    for  (let i = 0; i < n; i++) {
      const res = this.step_(this.rx_, this.ry_, this.vx_, this.vy_);
      this.rx_ = res[0];
      this.ry_ = res[1];
      this.vx_ = res[2];
      this.vy_ = res[3];
    }
  }
}