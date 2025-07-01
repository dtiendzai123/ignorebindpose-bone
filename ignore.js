const BoneAimSwitch = {
  spineBindPoseMatrix: [
    [-0.5548112, -0.0359000079, 0.831201553, -0.260563046],
    [-0.831358,   0.0624267831, -0.5522192,   0.53829],
    [-0.03206457, -0.997403443, -0.06448084,  0.0559907332],
    [0.0, 0.0, 0.0, 1.0]
  ],

  spineTransformPosition: {
    x: -0.0214483067, y: 0.0, z: 4.768e-09
  },

  headBindPoseMatrix: [
    [-1.34559613E-13, 8.881784E-14, -1.0, 0.487912],
    [-2.84512817E-06, -1.0, 8.881784E-14, -2.842171E-14],
    [-1.0, 2.84512817E-06, -1.72951931E-13, 0.0],
    [0.0, 0.0, 0.0, 1.0]
  ],

  headTransformPosition: {
    x: -0.0456970781, y: -0.004478302, z: -0.0200432576
  },

  getCameraPosition() {
    return { x: 0, y: 1.5, z: -3 }; // ví dụ camera
  },

  getViewDirection() {
    return this.normalize({ x: 0.5, y: -0.5, z: 1 });
  },

  normalize(v) {
    const mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1e-6;
    return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
  },

  dotProduct(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  },

  vectorTo(from, to) {
    return { x: to.x - from.x, y: to.y - from.y, z: to.z - from.z };
  },

  multiplyMatrixPosition(matrix, pos) {
    return {
      x: matrix[0][0] * pos.x + matrix[0][1] * pos.y + matrix[0][2] * pos.z + matrix[0][3],
      y: matrix[1][0] * pos.x + matrix[1][1] * pos.y + matrix[1][2] * pos.z + matrix[1][3],
      z: matrix[2][0] * pos.x + matrix[2][1] * pos.y + matrix[2][2] * pos.z + matrix[2][3]
    };
  },

  aimAt(pos, label) {
    console.log(`🎯 AIM AT [${label}]`, pos.x.toFixed(6), pos.y.toFixed(6), pos.z.toFixed(6));
  },

  checkAndAim: function () {
    const cam = this.getCameraPosition();
    const viewDir = this.getViewDirection();

    const spineWorld = this.multiplyMatrixPosition(this.spineBindPoseMatrix, this.spineTransformPosition);
    const dirToSpine = this.normalize(this.vectorTo(cam, spineWorld));
    const dot = this.dotProduct(viewDir, dirToSpine);

    if (dot >= 0.98) {
      // camera nhìn vào vùng Spine → chuyển sang HEAD
      const headWorld = this.multiplyMatrixPosition(this.headBindPoseMatrix, this.headTransformPosition);
      this.aimAt(headWorld, "HEAD 🔒");
    } else {
      console.log("🚫 Not aiming spine, target not in view.");
    }
  },

  runLoop: function () {
    setInterval(() => {
      this.checkAndAim();
    }, 16); // 60 FPS
  }
};

BoneAimSwitch.runLoop();

const SmartSpine1AimSwitch = {
  spine1BindPose: [
    [0.113457531,  -0.08243211,   0.990117252,  -0.266050339],
    [-0.0724989,   -0.994582355, -0.0744961947, 0.0256437212],
    [0.990894139,  -0.06333027,  -0.1188191,    0.107845038],
    [0, 0, 0, 1]
  ],

  spine1Transform: {
    position: { x: -0.07381998, y: 0.0, z: 0.0 },
    rotation: { x: -0.014863, y: 0.221670672, z: -0.00825078, w: 0.97497344 },
    scale:    { x: 1.0, y: 0.99999994, z: 1.0 }
  },

  headBindPose: [
    [-1.34559613E-13, 8.881784E-14, -1.0, 0.487912],
    [-2.84512817E-06, -1.0, 8.881784E-14, -2.842171E-14],
    [-1.0, 2.84512817E-06, -1.72951931E-13, 0.0],
    [0.0, 0.0, 0.0, 1.0]
  ],

  headTransform: {
    position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 }
  },

  getCameraPosition() {
    return { x: 0, y: 1.5, z: -3 };
  },

  getViewDirection() {
    return this.normalize({ x: 0.5, y: -0.4, z: 1.0 }); // giả định hướng camera
  },

  normalize(v) {
    const mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1e-6;
    return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
  },

  dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  },

  sub(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  },

  multiplyMatrixAndPosition(mat, pos) {
    return {
      x: mat[0][0] * pos.x + mat[0][1] * pos.y + mat[0][2] * pos.z + mat[0][3],
      y: mat[1][0] * pos.x + mat[1][1] * pos.y + mat[1][2] * pos.z + mat[1][3],
      z: mat[2][0] * pos.x + mat[2][1] * pos.y + mat[2][2] * pos.z + mat[2][3]
    };
  },

  aimAt(pos, label) {
    console.log(`🎯 AIM TO [${label}]`, pos.x.toFixed(6), pos.y.toFixed(6), pos.z.toFixed(6));
  },

  checkAimSwitch() {
    const camPos = this.getCameraPosition();
    const viewDir = this.getViewDirection();

    const spine1World = this.multiplyMatrixAndPosition(this.spine1BindPose, this.spine1Transform.position);
    const dirToSpine1 = this.normalize(this.sub(spine1World, camPos));
    const dot = this.dot(viewDir, dirToSpine1);

    if (dot > 0.98) {
      const headWorld = this.multiplyMatrixAndPosition(this.headBindPose, this.headTransform.position);
      this.aimAt(headWorld, "bone_Head 🔒");
    } else {
      console.log("🚫 Ignoring bone_Spine1, not in aim direction");
    }
  },

  runLoop() {
    setInterval(() => {
      this.checkAimSwitch();
    }, 16); // 60 FPS
  }
};

SmartSpine1AimSwitch.runLoop();

const SmartClavicleSwitch = {
  // ========== Bindpose bone_LeftClav ==========
  clavBindPose: [
    [-4.91947334e-15, -2.220446e-14, 1.00000012, -0.06050579],
    [0.115966067, -0.9932532, 2.220446e-14, 0.016761886],
    [0.9932531, 0.115966052, 7.771561e-14, -0.102392569],
    [0, 0, 0, 1]
  ],

  clavTransform: {
    position: { x: -0.01913227, y: 3.8147e-08, z: 0.0 },
    rotation: { x: -2.14e-09, y: -3.57e-09, z: -0.07654541, w: 0.99706614 },
    scale:    { x: 0.99999994, y: 1.00000012, z: 1.0 }
  },

  // ========== Bindpose bone_Head ==========
  headBindPose: [
    [-1.34559613E-13, 8.881784E-14, -1.0, 0.487912],
    [-2.84512817E-06, -1.0, 8.881784E-14, -2.842171E-14],
    [-1.0, 2.84512817E-06, -1.72951931E-13, 0.0],
    [0, 0, 0, 1]
  ],

  headTransform: {
    position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 }
  },

  // ========== Math & Camera ==========
  getCameraPosition() {
    return { x: 0, y: 1.5, z: -3 };
  },

  getViewDirection() {
    return this.normalize({ x: 0.5, y: -0.4, z: 1 });
  },

  normalize(v) {
    const mag = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2) || 1e-6;
    return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
  },

  subtract(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  },

  dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  },

  multiplyMatrixAndPosition(matrix, pos) {
    return {
      x: matrix[0][0] * pos.x + matrix[0][1] * pos.y + matrix[0][2] * pos.z + matrix[0][3],
      y: matrix[1][0] * pos.x + matrix[1][1] * pos.y + matrix[1][2] * pos.z + matrix[1][3],
      z: matrix[2][0] * pos.x + matrix[2][1] * pos.y + matrix[2][2] * pos.z + matrix[2][3]
    };
  },

  aimAt(pos, label) {
    console.log(`🎯 AIM TO [${label}]`, pos.x.toFixed(6), pos.y.toFixed(6), pos.z.toFixed(6));
  },

  checkAim() {
    const camPos = this.getCameraPosition();
    const viewDir = this.getViewDirection();

    const clavWorld = this.multiplyMatrixAndPosition(this.clavBindPose, this.clavTransform.position);
    const dirToClav = this.normalize(this.subtract(clavWorld, camPos));
    const dot = this.dot(viewDir, dirToClav);

    if (dot > 0.98) {
      // Tâm đang hướng vào Left Clav → chuyển sang Head
      const headWorld = this.multiplyMatrixAndPosition(this.headBindPose, this.headTransform.position);
      this.aimAt(headWorld, "bone_Head 🔒");
    } else {
      console.log("🚫 Not aiming LeftClav, ignore aim");
    }
  },

  runLoop() {
    setInterval(() => {
      this.checkAim();
    }, 16); // 60 FPS
  }
};

SmartClavicleSwitch.runLoop();

const SmartRightClavSwitch = {
  // ========== Right Clavicle ==========
  rightClavBindPose: [
    [-2.589753e-06, -0.999969959, -0.00774364034, 0.08466149],
    [-6.48462037e-06, 0.007743638, -0.9999698, 0.7433083],
    [0.9999997, -2.53946064e-06, -6.504481e-06, 4.86830731e-06],
    [0, 0, 0, 1]
  ],

  rightClavTransform: {
    position: { x: -0.143704757, y: -0.0102021145, z: -6.00741643e-08 },
    rotation: { x: 6.180791e-14, y: 3.99176855e-07, z: -0.143920109, w: 0.989589334 },
    scale:    { x: 1.49999118, y: 1.49999118, z: 1.49999118 }
  },

  // ========== Head ==========
  headBindPose: [
    [-1.34559613e-13, 8.881784e-14, -1.0, 0.487912],
    [-2.84512817e-06, -1.0, 8.881784e-14, -2.842171e-14],
    [-1.0, 2.84512817e-06, -1.72951931e-13, 0.0],
    [0, 0, 0, 1]
  ],

  headTransform: {
    position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 }
  },

  // ========== Math & Logic ==========
  getCameraPosition() {
    return { x: 0, y: 1.5, z: -3 };
  },

  getViewDirection() {
    return this.normalize({ x: 0.4, y: -0.2, z: 1.0 }); // hướng nhìn giả định
  },

  normalize(v) {
    const mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1e-6;
    return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
  },

  subtract(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  },

  dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  },

  multiplyMatrixAndPosition(matrix, pos) {
    return {
      x: matrix[0][0] * pos.x + matrix[0][1] * pos.y + matrix[0][2] * pos.z + matrix[0][3],
      y: matrix[1][0] * pos.x + matrix[1][1] * pos.y + matrix[1][2] * pos.z + matrix[1][3],
      z: matrix[2][0] * pos.x + matrix[2][1] * pos.y + matrix[2][2] * pos.z + matrix[2][3]
    };
  },

  aimAt(pos, label) {
    console.log(`🎯 AIM TO [${label}]`, pos.x.toFixed(6), pos.y.toFixed(6), pos.z.toFixed(6));
  },

  checkAim() {
    const camPos = this.getCameraPosition();
    const viewDir = this.getViewDirection();

    const clavWorld = this.multiplyMatrixAndPosition(this.rightClavBindPose, this.rightClavTransform.position);
    const dirToClav = this.normalize(this.subtract(clavWorld, camPos));
    const dot = this.dot(viewDir, dirToClav);

    if (dot > 0.98) {
      const headWorld = this.multiplyMatrixAndPosition(this.headBindPose, this.headTransform.position);
      this.aimAt(headWorld, "bone_Head 🔒");
    } else {
      console.log("🚫 Ignoring RightClav, not aiming it");
    }
  },

  runLoop() {
    setInterval(() => {
      this.checkAim();
    }, 16); // 60 FPS
  }
};

SmartRightClavSwitch.runLoop();


const SmartLeftForearmSwitch = {
  // ========== Left ForeArm ==========
  leftForearmBindPose: [
    [-0.636317, 0.000971268862, 0.771427035, -0.527112365],
    [-0.0195463989, 0.9996577, -0.0173816178, -0.0119081419],
    [-0.7711799, -0.0261388365, -0.6360804, 0.562801],
    [0, 0, 0, 1]
  ],

  leftForearmTransform: {
    position: { x: -0.0479800031, y: -0.000254631741, z: 7.923394e-08 },
    rotation: { x: -2.080476e-06, y: 6.93676043e-07, z: -0.000398159027, w: 0.99999994 },
    scale:    { x: 1.0, y: 1.0, z: 1.0 }
  },

  // ========== Head ==========
  headBindPose: [
    [-1.34559613e-13, 8.881784e-14, -1.0, 0.487912],
    [-2.84512817e-06, -1.0, 8.881784e-14, -2.842171e-14],
    [-1.0, 2.84512817e-06, -1.72951931e-13, 0.0],
    [0, 0, 0, 1]
  ],

  headTransform: {
    position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 }
  },

  // ========== Math Utilities ==========
  getCameraPosition() {
    return { x: 0, y: 1.5, z: -3 }; // giả lập
  },

  getViewDirection() {
    return this.normalize({ x: 0.3, y: -0.1, z: 1.0 });
  },

  normalize(v) {
    const m = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1e-6;
    return { x: v.x / m, y: v.y / m, z: v.z / m };
  },

  subtract(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  },

  dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  },

  multiplyMatrixAndPosition(matrix, pos) {
    return {
      x: matrix[0][0] * pos.x + matrix[0][1] * pos.y + matrix[0][2] * pos.z + matrix[0][3],
      y: matrix[1][0] * pos.x + matrix[1][1] * pos.y + matrix[1][2] * pos.z + matrix[1][3],
      z: matrix[2][0] * pos.x + matrix[2][1] * pos.y + matrix[2][2] * pos.z + matrix[2][3]
    };
  },

  aimAt(pos, label) {
    console.log(`🎯 AIM TO [${label}]`, pos.x.toFixed(6), pos.y.toFixed(6), pos.z.toFixed(6));
  },

  checkAim() {
    const camPos = this.getCameraPosition();
    const viewDir = this.getViewDirection();

    const armWorld = this.multiplyMatrixAndPosition(this.leftForearmBindPose, this.leftForearmTransform.position);
    const dirToArm = this.normalize(this.subtract(armWorld, camPos));
    const dot = this.dot(viewDir, dirToArm);

    if (dot > 0.98) {
      // Nếu đang nhìn vào tay → chuyển sang đầu
      const headWorld = this.multiplyMatrixAndPosition(this.headBindPose, this.headTransform.position);
      this.aimAt(headWorld, "bone_Head 🔒");
    } else {
      console.log("🛑 Not aiming forearm — ignore aim.");
    }
  },

  runLoop() {
    setInterval(() => {
      this.checkAim();
    }, 16); // 60Hz
  }
};

SmartLeftForearmSwitch.runLoop();

const RightForeArmAimSwitch = {
  // ========= Right ForeArm =========
  rightForeArmBindPose: [
    [ 0.636316955,  0.0009695268,  0.771427035,  -0.5271124 ],
    [ 0.0195491333, 0.9996575,    -0.0173816122, -0.011908141 ],
    [-0.771179736,  0.0261409469,  0.6360802,    -0.562800944 ],
    [ 0, 0, 0, 1 ]
  ],
  rightForeArmTransform: {
    position: { x: 0.0, y: 0.0, z: 0.0 },
    rotation: { x: -0.499999642, y: 0.500000358, z: 0.499999642, w: 0.500000358 },
    scale:    { x: 1.0, y: 1.0, z: 1.0 }
  },

  // ========= Head =========
  headBindPose: [
    [-1.34559613e-13, 8.881784e-14, -1.0, 0.487912],
    [-2.84512817e-06, -1.0, 8.881784e-14, -2.842171e-14],
    [-1.0, 2.84512817e-06, -1.72951931e-13, 0.0],
    [0, 0, 0, 1]
  ],
  headTransform: {
    position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 }
  },

  // ========= Math & Logic =========
  getCameraPosition() {
    return { x: 0, y: 1.6, z: -3 }; // camera giả định
  },
  getViewDirection() {
    return this.normalize({ x: 0.2, y: -0.1, z: 1.0 });
  },
  normalize(v) {
    const mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1e-6;
    return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
  },
  subtract(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  },
  dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  },
  multiplyMatrixAndPosition(m, p) {
    return {
      x: m[0][0]*p.x + m[0][1]*p.y + m[0][2]*p.z + m[0][3],
      y: m[1][0]*p.x + m[1][1]*p.y + m[1][2]*p.z + m[1][3],
      z: m[2][0]*p.x + m[2][1]*p.y + m[2][2]*p.z + m[2][3]
    };
  },
  aimAt(pos, label) {
    console.log(`🎯 AIM TO [${label}]:`, pos.x.toFixed(6), pos.y.toFixed(6), pos.z.toFixed(6));
  },

  checkAim() {
    const cam = this.getCameraPosition();
    const dir = this.getViewDirection();

    const armWorld = this.multiplyMatrixAndPosition(
      this.rightForeArmBindPose,
      this.rightForeArmTransform.position
    );
    const aimVec = this.normalize(this.subtract(armWorld, cam));
    const dotProduct = this.dot(dir, aimVec);

    if (dotProduct > 0.985) {
      // Hướng đúng vào RightForeArm → chuyển sang Head
      const headWorld = this.multiplyMatrixAndPosition(
        this.headBindPose,
        this.headTransform.position
      );
      this.aimAt(headWorld, "bone_Head 🔒");
    } else {
      console.log("🛑 Ignored RightForeArm — not aiming.");
    }
  },

  runLoop() {
    setInterval(() => {
      this.checkAim();
    }, 16); // 60Hz
  }
};

RightForeArmAimSwitch.runLoop();


const LeftLegAimSwitch = {
  // ========== Left Leg ==========
  leftLegBindPose: [
    [-0.2573126, 0.378739476, 0.889014244, -0.4047346],
    [ 0.387405455, 0.88325423, -0.26415652, 0.0330787748],
    [-0.8852722, 0.2764382, -0.373998284, 0.4432086],
    [0, 0, 0, 1]
  ],
  leftLegTransform: {
    position: { x: -0.05506518, y: 0.0648240447, z: -9.536743e-09 },
    rotation: { x: 2.63404742e-09, y: 2.634309e-09, z: -0.7071068, w: 0.7071068 },
    scale: { x: 1.0, y: 1.0, z: 1.0 }
  },

  // ========== Head ==========
  headBindPose: [
    [-1.34559613e-13, 8.881784e-14, -1.0, 0.487912],
    [-2.84512817e-06, -1.0, 8.881784e-14, -2.842171e-14],
    [-1.0, 2.84512817e-06, -1.72951931e-13, 0.0],
    [0, 0, 0, 1]
  ],
  headTransform: {
    position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 }
  },

  // ========== Math & Aim Logic ==========
  getCameraPosition() {
    return { x: 0, y: 1.6, z: -3 }; // camera giả lập
  },
  getViewDirection() {
    return this.normalize({ x: 0.1, y: -0.1, z: 1.0 });
  },
  normalize(v) {
    const mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1e-6;
    return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
  },
  subtract(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  },
  dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  },
  multiplyMatrixAndPosition(m, p) {
    return {
      x: m[0][0]*p.x + m[0][1]*p.y + m[0][2]*p.z + m[0][3],
      y: m[1][0]*p.x + m[1][1]*p.y + m[1][2]*p.z + m[1][3],
      z: m[2][0]*p.x + m[2][1]*p.y + m[2][2]*p.z + m[2][3]
    };
  },
  aimAt(pos, label) {
    console.log(`🎯 AIM TO [${label}]:`, pos.x.toFixed(6), pos.y.toFixed(6), pos.z.toFixed(6));
  },

  checkAim() {
    const cam = this.getCameraPosition();
    const dir = this.getViewDirection();

    const legWorld = this.multiplyMatrixAndPosition(
      this.leftLegBindPose,
      this.leftLegTransform.position
    );
    const aimVec = this.normalize(this.subtract(legWorld, cam));
    const dotProduct = this.dot(dir, aimVec);

    if (dotProduct > 0.985) {
      // Đang ngắm vào LeftLeg → chuyển sang Head
      const headWorld = this.multiplyMatrixAndPosition(
        this.headBindPose,
        this.headTransform.position
      );
      this.aimAt(headWorld, "bone_Head 🔒");
    } else {
      console.log("🛑 Đang không nhắm vào bone_LeftLeg.");
    }
  },

  runLoop() {
    setInterval(() => {
      this.checkAim();
    }, 16); // khoảng 60 lần/giây
  }
};

LeftLegAimSwitch.runLoop();

const RightLegAimSwitch = {
  // ========== Right Leg ==========
  rightLegBindPose: [
    [-0.5548109, -0.035899926, 0.8312015, -0.260563076],
    [-0.8313583, 0.062426772, -0.5522193, 0.538290262],
    [-0.0320646, -0.997403741, -0.06448076, 0.0559905954],
    [0, 0, 0, 1]
  ],
  rightLegTransform: {
    position: { x: -0.05104271, y: -0.00664260844, z: 0.0112954779 },
    rotation: { x: 0.005462859, y: 0.04022036, z: -0.128533632, w: 0.9908742 },
    scale:    { x: 0.9999998, y: 1.0, z: 1.00000012 }
  },

  // ========== Head ==========
  headBindPose: [
    [-1.34559613e-13, 8.881784e-14, -1.0, 0.487912],
    [-2.84512817e-06, -1.0, 8.881784e-14, -2.842171e-14],
    [-1.0, 2.84512817e-06, -1.72951931e-13, 0.0],
    [0, 0, 0, 1]
  ],
  headTransform: {
    position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 }
  },

  // ========== Math & Aim ==========
  getCameraPosition() {
    return { x: 0, y: 1.6, z: -3 };
  },
  getViewDirection() {
    return this.normalize({ x: 0.1, y: -0.1, z: 1.0 });
  },
  normalize(v) {
    const mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1e-6;
    return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
  },
  subtract(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  },
  dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  },
  multiplyMatrixAndPosition(m, p) {
    return {
      x: m[0][0]*p.x + m[0][1]*p.y + m[0][2]*p.z + m[0][3],
      y: m[1][0]*p.x + m[1][1]*p.y + m[1][2]*p.z + m[1][3],
      z: m[2][0]*p.x + m[2][1]*p.y + m[2][2]*p.z + m[2][3]
    };
  },
  aimAt(pos, label) {
    console.log(`🎯 AIM TO [${label}]:`, pos.x.toFixed(6), pos.y.toFixed(6), pos.z.toFixed(6));
  },

  checkAim() {
    const cam = this.getCameraPosition();
    const dir = this.getViewDirection();

    const legWorld = this.multiplyMatrixAndPosition(
      this.rightLegBindPose,
      this.rightLegTransform.position
    );
    const aimVec = this.normalize(this.subtract(legWorld, cam));
    const dotProduct = this.dot(dir, aimVec);

    if (dotProduct > 0.985) {
      // Nếu đang nhắm vào right leg → chuyển sang lock head
      const headWorld = this.multiplyMatrixAndPosition(
        this.headBindPose,
        this.headTransform.position
      );
      this.aimAt(headWorld, "bone_Head 🔒");
    } else {
      console.log("⛔ Không nhắm vào bone_RightLeg");
    }
  },

  runLoop() {
    setInterval(() => {
      this.checkAim();
    }, 16); // ~60 lần/giây
  }
};

RightLegAimSwitch.runLoop();


const HipsAimSwitch = {
  // Bindpose bone_Hips
  hipsBindPose: [
    [-0.004590507, -0.999851167, 0.0165641839, 0.0533402786],
    [-0.0013007605, -0.0165581275, -0.999861956, 0.00351472667],
    [0.9999896, -0.00461155176, -0.00122370217, 0.0007634153],
    [0, 0, 0, 1]
  ],

  hipsTransform: {
    position: { x: -0.0533402227, y: -0.00351470942, z: -0.000763373333 },
    rotation: { x: 0.00634025969, y: 0.0412556976, z: -0.0370349, w: 0.9984419 },
    scale:    { x: 1.00000012, y: 1.00000012, z: 1.0 }
  },

  // Bindpose bone_Head (ví dụ)
  headBindPose: [
    [-1.34559613e-13, 8.881784e-14, -1.0, 0.487912],
    [-2.84512817e-06, -1.0, 8.881784e-14, -2.842171e-14],
    [-1.0, 2.84512817e-06, -1.72951931e-13, 0.0],
    [0, 0, 0, 1]
  ],
  headTransform: {
    position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 }
  },

  // Vector toán học cơ bản
  normalize(v) {
    const mag = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z) || 1e-6;
    return { x: v.x/mag, y: v.y/mag, z: v.z/mag };
  },
  subtract(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  },
  dot(a, b) {
    return a.x*b.x + a.y*b.y + a.z*b.z;
  },

  multiplyMatrixAndPosition(m, p) {
    return {
      x: m[0][0]*p.x + m[0][1]*p.y + m[0][2]*p.z + m[0][3],
      y: m[1][0]*p.x + m[1][1]*p.y + m[1][2]*p.z + m[1][3],
      z: m[2][0]*p.x + m[2][1]*p.y + m[2][2]*p.z + m[2][3]
    };
  },

  getCameraPosition() {
    // Ví dụ: vị trí camera người chơi
    return { x: 0, y: 1.6, z: -3 };
  },
  getViewDirection() {
    // Ví dụ: hướng camera, cần normalize
    return this.normalize({ x: 0, y: 0, z: 1 });
  },

  aimAt(pos, label) {
    console.log(`🎯 AIM TO [${label}]:`, pos.x.toFixed(6), pos.y.toFixed(6), pos.z.toFixed(6));
  },

  checkAim() {
    const cam = this.getCameraPosition();
    const dir = this.getViewDirection();

    const hipsWorldPos = this.multiplyMatrixAndPosition(this.hipsBindPose, this.hipsTransform.position);
    const aimVec = this.normalize(this.subtract(hipsWorldPos, cam));
    const dotProd = this.dot(dir, aimVec);

    if (dotProd > 0.985) { 
      // Nếu đang aim vào vùng hips, chuyển sang head
      const headWorldPos = this.multiplyMatrixAndPosition(this.headBindPose, this.headTransform.position);
      this.aimAt(headWorldPos, "bone_Head 🔒");
    } else {
      // Không aim vùng hips thì không làm gì (hoặc giữ trạng thái hiện tại)
      console.log("⛔ Không nhắm vào bone_Hips");
    }
  },

  runLoop() {
    setInterval(() => {
      this.checkAim();
    }, 16); // ~60FPS
  }
};

HipsAimSwitch.runLoop();





// Giả lập API game (thay bằng API thực tế)
const GameAPI = {
  getVisibleTargets() {
    // Trả về danh sách mục tiêu đang nhìn thấy, ví dụ:
    // [{ id, position: {x,y,z}, velocity: {x,y,z} }, ...]
    return [
      { id: 1, position: { x: 5.0, y: 1.6, z: 10.0 }, velocity: { x: 0.2, y: 0, z: -0.1 } },
      { id: 2, position: { x: -3.2, y: 1.5, z: 7.4 }, velocity: { x: 0, y: 0, z: 0 } }
    ];
  },
  setCrosshairTarget(x, y, z) {
    console.log(`🎯 Aim at: ${x.toFixed(3)}, ${y.toFixed(3)}, ${z.toFixed(3)}`);
  }
};

const AimbotBoneHead = {
  boneHead: {
    position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
    rotation: { x: 0.0258174837, y: -0.08611039, z: -0.1402113, w: 0.9860321 },
    scale:    { x: 0.99999994, y: 1.00000012, z: 1.0 }
  },

  bindPose: {
    e00: -1.34559613E-13, e01: 8.881784E-14, e02: -1.0, e03: 0.487912,
    e10: -2.84512817E-06, e11: -1.0, e12: 8.881784E-14, e13: -2.842171E-14,
    e20: -1.0, e21: 2.84512817E-06, e22: -1.72951931E-13, e23: 0.0,
    e30: 0.0, e31: 0.0, e32: 0.0, e33: 1.0
  },

  quaternionToMatrix(q) {
    const { x, y, z, w } = q;
    return [
      1 - 2 * (y * y + z * z), 2 * x * y - 2 * z * w,     2 * x * z + 2 * y * w, 0,
      2 * x * y + 2 * z * w,   1 - 2 * (x * x + z * z),   2 * y * z - 2 * x * w, 0,
      2 * x * z - 2 * y * w,   2 * y * z + 2 * x * w,     1 - 2 * (x * x + y * y), 0,
      0, 0, 0, 1
    ];
  },

  buildMatrix(scale, rotationMatrix, position) {
    return [
      [rotationMatrix[0] * scale.x, rotationMatrix[1] * scale.y, rotationMatrix[2] * scale.z, position.x],
      [rotationMatrix[4] * scale.x, rotationMatrix[5] * scale.y, rotationMatrix[6] * scale.z, position.y],
      [rotationMatrix[8] * scale.x, rotationMatrix[9] * scale.y, rotationMatrix[10] * scale.z, position.z],
      [0, 0, 0, 1]
    ];
  },

  multiplyMatrix4x4(a, b) {
    const result = Array.from({ length: 4 }, () => Array(4).fill(0));
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        for (let i = 0; i < 4; i++) {
          result[row][col] += a[row][i] * b[i][col];
        }
      }
    }
    return result;
  },

  getWorldHeadPosition() {
    const bone = this.boneHead;
    const bind = this.bindPose;

    const rotMatrix = this.quaternionToMatrix(bone.rotation);
    const local = this.buildMatrix(bone.scale, rotMatrix, bone.position);

    const bindMatrix = [
      [bind.e00, bind.e01, bind.e02, bind.e03],
      [bind.e10, bind.e11, bind.e12, bind.e13],
      [bind.e20, bind.e21, bind.e22, bind.e23],
      [bind.e30, bind.e31, bind.e32, bind.e33]
    ];

    const world = this.multiplyMatrix4x4(bindMatrix, local);

    return {
      x: world[0][3],
      y: world[1][3],
      z: world[2][3]
    };
  },

  kalman: {
    x: { x: 0, y: 0, z: 0 },
    P: 1, K: 0, Q: 0.005, R: 0.1,
    update(measurement) {
      for (let axis of ["x", "y", "z"]) {
        this.P += this.Q;
        this.K = this.P / (this.P + this.R);
        this.x[axis] = this.x[axis] + this.K * (measurement[axis] - this.x[axis]);
        this.P = (1 - this.K) * this.P;
      }
      return { ...this.x };
    }
  },

  lastTime: Date.now(),
  runLoop() {
    const loop = () => {
      const now = Date.now();
      const dt = (now - this.lastTime) / 1000 || 0.016;
      this.lastTime = now;

      const headPos = this.getWorldHeadPosition();
      const filtered = this.kalman.update(headPos);

      // Gọi hàm aim
      this.setCrosshairTarget(filtered);

      setTimeout(loop, 16); // 60 FPS
    };
    loop();
  },

  setCrosshairTarget(pos) {
    console.log("🎯 Aiming at HEAD:", pos.x.toFixed(4), pos.y.toFixed(4), pos.z.toFixed(4));
    // Bạn thay bằng API set aim thật tại đây
  }
};

AimbotBoneHead.runLoop();
