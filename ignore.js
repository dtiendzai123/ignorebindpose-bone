const GamePackages = {
  GamePackage1: "com.dts.freefireth",
  GamePackage2: "com.dts.freefiremax"
};
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
// BoneAimSwitch.runLoop(); // gộp vào AutoAimMasterLoop

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
// SmartSpine1AimSwitch.runLoop(); // gộp vào AutoAimMasterLoop

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
// SmartClavicleSwitch.runLoop(); // gộp vào AutoAimMasterLoop

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
// SmartRightClavSwitch.runLoop(); // gộp vào AutoAimMasterLoop


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
// SmartLeftForearmSwitch.runLoop(); // gộp vào AutoAimMasterLoop

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
// RightForeArmAimSwitch.runLoop(); // gộp vào AutoAimMasterLoop


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
// LeftLegAimSwitch.runLoop(); // gộp vào AutoAimMasterLoop

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
// RightLegAimSwitch.runLoop(); // gộp vào AutoAimMasterLoop


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
// HipsAimSwitch.runLoop(); // gộp vào AutoAimMasterLoop





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
// AimbotBoneHead.runLoop(); // gộp vào AutoAimMasterLoop


const DragAimLock_HardClamp = {
  headBindPose: {
    e00: -1.34559613E-13, e01: 8.881784E-14, e02: -1.0, e03: 0.487912,
    e10: -2.84512817E-06, e11: -1.0, e12: 8.881784E-14, e13: -2.842171E-14,
    e20: -1.0, e21: 2.84512817E-06, e22: -1.72951931E-13, e23: 0.0,
    e30: 0.0, e31: 0.0, e32: 0.0, e33: 1.0
  },

  headTransform: {
    position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
    rotation: { x: 0.0258174837, y: -0.08611039, z: -0.1402113, w: 0.9860321 },
    scale:    { x: 0.99999994, y: 1.00000012, z: 1.0 }
  },

  lastPos: { x: 0, y: 0, z: 0 },

  quaternionToMatrix(q) {
    const { x, y, z, w } = q;
    return [
      1 - 2 * y * y - 2 * z * z, 2 * x * y - 2 * z * w,     2 * x * z + 2 * y * w,
      2 * x * y + 2 * z * w,     1 - 2 * x * x - 2 * z * z, 2 * y * z - 2 * x * w,
      2 * x * z - 2 * y * w,     2 * y * z + 2 * x * w,     1 - 2 * x * x - 2 * y * y
    ];
  },

  multiplyMatrix4x4(A, B) {
    const result = Array(4).fill(0).map(() => Array(4).fill(0));
    for (let i = 0; i < 4; ++i)
      for (let j = 0; j < 4; ++j)
        for (let k = 0; k < 4; ++k)
          result[i][j] += A[i][k] * B[k][j];
    return result;
  },

  getWorldHeadPosition() {
    const bp = this.headBindPose;
    const t = this.headTransform;

    const bind = [
      [bp.e00, bp.e01, bp.e02, bp.e03],
      [bp.e10, bp.e11, bp.e12, bp.e13],
      [bp.e20, bp.e21, bp.e22, bp.e23],
      [bp.e30, bp.e31, bp.e32, bp.e33]
    ];

    const rot = this.quaternionToMatrix(t.rotation);

    const model = [
      [rot[0] * t.scale.x, rot[1] * t.scale.y, rot[2] * t.scale.z, t.position.x],
      [rot[3] * t.scale.x, rot[4] * t.scale.y, rot[5] * t.scale.z, t.position.y],
      [rot[6] * t.scale.x, rot[7] * t.scale.y, rot[8] * t.scale.z, t.position.z],
      [0, 0, 0, 1]
    ];

    const world = this.multiplyMatrix4x4(bind, model);
    return {
      x: world[0][3],
      y: world[1][3],
      z: world[2][3]
    };
  },

  clampAimToHead(target, maxDistance = 0.01) {
    const dx = target.x - this.lastPos.x;
    const dy = target.y - this.lastPos.y;
    const dz = target.z - this.lastPos.z;

    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
    if (dist > maxDistance) {
      const scale = maxDistance / dist;
      return {
        x: this.lastPos.x + dx * scale,
        y: this.lastPos.y + dy * scale,
        z: this.lastPos.z + dz * scale
      };
    }
    return target;
  },

  dragLockFrame() {
    const headPos = this.getWorldHeadPosition();
    const clamped = this.clampAimToHead(headPos);
    this.lastPos = clamped;

    // 🚨 Thay bằng API ngắm thật sự nếu có
    if (typeof GameAPI !== 'undefined' && GameAPI.setCrosshairTarget) {
      GameAPI.setCrosshairTarget(clamped.x, clamped.y, clamped.z);
    } else {
      console.log("🎯 [LOCK] bone_Head:", clamped.x.toFixed(4), clamped.y.toFixed(4), clamped.z.toFixed(4));
    }
  },

  run() {
    const interval = setInterval(() => {
      this.dragLockFrame();
    }, 16); // ~60fps
  }
};
// DragAimLock_HardClamp.run(); // gộp vào AutoAimMasterLoop
const AimLockAdvanced = {
  // Tọa độ và bindpose bone_Head
  boneHead: {
    position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
    rotation: { x: 0.0258174837, y: -0.08611039, z: -0.1402113, w: 0.9860321 },
    scale: { x: 0.99999994, y: 1.00000012, z: 1.0 },
    bindPose: {
      e00: -1.34559613E-13, e01: 8.881784E-14, e02: -1.0, e03: 0.487912,
      e10: -2.84512817E-06, e11: -1.0, e12: 8.881784E-14, e13: -2.842171E-14,
      e20: -1.0, e21: 2.84512817E-06, e22: -1.72951931E-13, e23: 0.0,
      e30: 0.0, e31: 0.0, e32: 0.0, e33: 1.0
    }
  },

  kalman: {
    Q: 0.01, R: 0.1, P: 1, K: 0.5,
    x: { x: 0, y: 0, z: 0 },
    update(measured) {
      for (let axis of ["x", "y", "z"]) {
        this.P += this.Q;
        this.K = this.P / (this.P + this.R);
        this.x[axis] += this.K * (measured[axis] - this.x[axis]);
        this.P *= (1 - this.K);
      }
      return { ...this.x };
    }
  },

  velocity: { x: 0, y: 0, z: 0 },
  lastPos: null,
  lastTime: Date.now(),

  quaternionToMatrix(q) {
    const { x, y, z, w } = q;
    return [
      1 - 2 * y * y - 2 * z * z, 2 * x * y - 2 * z * w,     2 * x * z + 2 * y * w, 0,
      2 * x * y + 2 * z * w,     1 - 2 * x * x - 2 * z * z, 2 * y * z - 2 * x * w, 0,
      2 * x * z - 2 * y * w,     2 * y * z + 2 * x * w,     1 - 2 * x * x - 2 * y * y, 0,
      0, 0, 0, 1
    ];
  },

  multiplyMatrices(A, B) {
    const result = Array(4).fill(0).map(() => Array(4).fill(0));
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        for (let k = 0; k < 4; k++)
          result[i][j] += A[i][k] * B[k][j];
    return result;
  },

  getWorldHeadPosition() {
    const t = this.boneHead;
    const bp = t.bindPose;

    const bind = [
      [bp.e00, bp.e01, bp.e02, bp.e03],
      [bp.e10, bp.e11, bp.e12, bp.e13],
      [bp.e20, bp.e21, bp.e22, bp.e23],
      [bp.e30, bp.e31, bp.e32, bp.e33]
    ];

    const rot = this.quaternionToMatrix(t.rotation);
    const model = [
      [rot[0] * t.scale.x, rot[1] * t.scale.y, rot[2] * t.scale.z, t.position.x],
      [rot[4] * t.scale.x, rot[5] * t.scale.y, rot[6] * t.scale.z, t.position.y],
      [rot[8] * t.scale.x, rot[9] * t.scale.y, rot[10] * t.scale.z, t.position.z],
      [0, 0, 0, 1]
    ];

    const worldMatrix = this.multiplyMatrices(bind, model);
    return {
      x: worldMatrix[0][3],
      y: worldMatrix[1][3],
      z: worldMatrix[2][3]
    };
  },

  setAim(x, y, z) {
    console.log("🎯 AimLock to bone_Head:", x.toFixed(6), y.toFixed(6), z.toFixed(6));
    // Bạn thay bằng API thật nếu có như: GameAPI.setAim(x, y, z);
  },

  update() {
    const now = Date.now();
    const dt = (now - this.lastTime) / 1000;
    const current = this.getWorldHeadPosition();

    if (this.lastPos) {
      this.velocity = {
        x: (current.x - this.lastPos.x) / dt,
        y: (current.y - this.lastPos.y) / dt,
        z: (current.z - this.lastPos.z) / dt
      };
    }

    const predicted = {
      x: current.x + this.velocity.x * dt,
      y: current.y + this.velocity.y * dt,
      z: current.z + this.velocity.z * dt
    };

    const filtered = this.kalman.update(predicted);
    this.setAim(filtered.x, filtered.y, filtered.z);

    this.lastPos = current;
    this.lastTime = now;
  },

  run(interval = 16) {
    setInterval(() => {
      this.update();
    }, interval);
  }
};
// AimLockAdvanced.run(); // gộp vào AutoAimMasterLoop

const StrongPrecisionAimLock = {
  boneHead: {
    position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
    rotation: { x: 0.0258174837, y: -0.08611039, z: -0.1402113, w: 0.9860321 },
    scale: { x: 0.99999994, y: 1.00000012, z: 1.0 },
    bindPose: {
      e00: -1.34559613E-13, e01: 8.881784E-14, e02: -1.0, e03: 0.487912,
      e10: -2.84512817E-06, e11: -1.0, e12: 8.881784E-14, e13: -2.842171E-14,
      e20: -1.0, e21: 2.84512817E-06, e22: -1.72951931E-13, e23: 0.0,
      e30: 0.0, e31: 0.0, e32: 0.0, e33: 1.0
    }
  },

  kalman: {
    Q: 0.001, R: 0.01, P: 1, K: 0.5,
    x: { x: 0, y: 0, z: 0 },
    update(measured) {
      for (let axis of ["x", "y", "z"]) {
        this.P += this.Q;
        this.K = this.P / (this.P + this.R);
        this.x[axis] += this.K * (measured[axis] - this.x[axis]);
        this.P *= (1 - this.K);
      }
      return { ...this.x };
    }
  },

  lastPos: null,
  velocity: { x: 0, y: 0, z: 0 },
  lastTime: Date.now(),

  quaternionToMatrix(q) {
    const { x, y, z, w } = q;
    return [
      1 - 2 * y * y - 2 * z * z, 2 * x * y - 2 * z * w,     2 * x * z + 2 * y * w, 0,
      2 * x * y + 2 * z * w,     1 - 2 * x * x - 2 * z * z, 2 * y * z - 2 * x * w, 0,
      2 * x * z - 2 * y * w,     2 * y * z + 2 * x * w,     1 - 2 * x * x - 2 * y * y, 0,
      0, 0, 0, 1
    ];
  },

  multiplyMatrices(A, B) {
    const result = Array(4).fill(0).map(() => Array(4).fill(0));
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        for (let k = 0; k < 4; k++)
          result[i][j] += A[i][k] * B[k][j];
    return result;
  },

  getWorldHeadPosition() {
    const t = this.boneHead;
    const bp = t.bindPose;
    const bind = [
      [bp.e00, bp.e01, bp.e02, bp.e03],
      [bp.e10, bp.e11, bp.e12, bp.e13],
      [bp.e20, bp.e21, bp.e22, bp.e23],
      [bp.e30, bp.e31, bp.e32, bp.e33]
    ];
    const rot = this.quaternionToMatrix(t.rotation);
    const model = [
      [rot[0] * t.scale.x, rot[1] * t.scale.y, rot[2] * t.scale.z, t.position.x],
      [rot[4] * t.scale.x, rot[5] * t.scale.y, rot[6] * t.scale.z, t.position.y],
      [rot[8] * t.scale.x, rot[9] * t.scale.y, rot[10] * t.scale.z, t.position.z],
      [0, 0, 0, 1]
    ];
    const world = this.multiplyMatrices(bind, model);
    return { x: world[0][3], y: world[1][3], z: world[2][3] };
  },

  clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  },

  setAim(x, y, z) {
    console.log("🎯 Precision Aim:", x.toFixed(6), y.toFixed(6), z.toFixed(6));
    // Thay thế hàm này bằng API set aim thật nếu có
  },

  updateAim() {
    const now = Date.now();
    const dt = (now - this.lastTime) / 1000 || 0.016;

    const current = this.getWorldHeadPosition();
    if (this.lastPos) {
      this.velocity = {
        x: (current.x - this.lastPos.x) / dt,
        y: (current.y - this.lastPos.y) / dt,
        z: (current.z - this.lastPos.z) / dt
      };
    }

    // Dự đoán chuyển động
    const predicted = {
      x: current.x + this.velocity.x * dt,
      y: current.y + this.velocity.y * dt,
      z: current.z + this.velocity.z * dt
    };

    // Kalman Filter
    const filtered = this.kalman.update(predicted);

    // Giới hạn khoảng lệch (nếu muốn)
    const clamped = {
      x: this.clamp(filtered.x, current.x - 0.1, current.x + 0.1),
      y: this.clamp(filtered.y, current.y - 0.1, current.y + 0.1),
      z: this.clamp(filtered.z, current.z - 0.1, current.z + 0.1)
    };

    this.setAim(clamped.x, clamped.y, clamped.z);

    this.lastPos = current;
    this.lastTime = now;
  },

  run(interval = 16) {
    setInterval(() => this.updateAim(), interval);
  }
};
// StrongPrecisionAimLock.run(); // gộp vào AutoAimMasterLoop

const InstantAimLock = {
  boneHead: {
    position: {
      x: -0.0456970781,
      y: -0.004478302,
      z: -0.0200432576
    },
    rotation: {
      x: 0.0258174837,
      y: -0.08611039,
      z: -0.1402113,
      w: 0.9860321
    },
    scale: {
      x: 0.99999994,
      y: 1.00000012,
      z: 1.0
    },
    bindPose: {
      e00: -1.34559613E-13, e01: 8.881784E-14, e02: -1.0, e03: 0.487912,
      e10: -2.84512817E-06, e11: -1.0, e12: 8.881784E-14, e13: -2.842171E-14,
      e20: -1.0, e21: 2.84512817E-06, e22: -1.72951931E-13, e23: 0.0,
      e30: 0.0, e31: 0.0, e32: 0.0, e33: 1.0
    }
  },

  quaternionToMatrix(q) {
    const { x, y, z, w } = q;
    return [
      1 - 2 * y * y - 2 * z * z,   2 * x * y - 2 * z * w,     2 * x * z + 2 * y * w, 0,
      2 * x * y + 2 * z * w,       1 - 2 * x * x - 2 * z * z, 2 * y * z - 2 * x * w, 0,
      2 * x * z - 2 * y * w,       2 * y * z + 2 * x * w,     1 - 2 * x * x - 2 * y * y, 0,
      0, 0, 0, 1
    ];
  },

  multiplyMatrices(A, B) {
    const result = Array(4).fill(0).map(() => Array(4).fill(0));
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        for (let k = 0; k < 4; k++)
          result[i][j] += A[i][k] * B[k][j];
    return result;
  },

  getBoneHeadWorldPosition() {
    const t = this.boneHead;
    const bp = t.bindPose;
    const bind = [
      [bp.e00, bp.e01, bp.e02, bp.e03],
      [bp.e10, bp.e11, bp.e12, bp.e13],
      [bp.e20, bp.e21, bp.e22, bp.e23],
      [bp.e30, bp.e31, bp.e32, bp.e33]
    ];
    const rot = this.quaternionToMatrix(t.rotation);
    const model = [
      [rot[0] * t.scale.x, rot[1] * t.scale.y, rot[2] * t.scale.z, t.position.x],
      [rot[4] * t.scale.x, rot[5] * t.scale.y, rot[6] * t.scale.z, t.position.y],
      [rot[8] * t.scale.x, rot[9] * t.scale.y, rot[10] * t.scale.z, t.position.z],
      [0, 0, 0, 1]
    ];
    const world = this.multiplyMatrices(bind, model);
    return { x: world[0][3], y: world[1][3], z: world[2][3] };
  },

  setAim(x, y, z) {
    console.log("🎯 Drag Lock (Instant) to bone_Head:", x.toFixed(6), y.toFixed(6), z.toFixed(6));
    // Gắn vào API thật nếu có:
    // GameAPI.setCrosshairTarget(x, y, z);
  },

  dragNow() {
    const headPos = this.getBoneHeadWorldPosition();
    this.setAim(headPos.x, headPos.y, headPos.z);
  }
};

// Gọi hàm khi cần drag: 
// ví dụ trong khung onDrag hoặc khung update frame:
InstantAimLock.dragNow();


const NeckTrackerLock = {
  boneNeck: {
    position: {
      x: -0.143705,
      y: -0.010202,
      z: 0.0
    },
    rotation: {
      x: 0.0,
      y: 0.0,
      z: -0.14392,
      w: 0.989589
    },
    scale: {
      x: 1.0,
      y: 1.0,
      z: 1.0
    },
    bindPose: {
      e00: 0.0,     e01: 0.0,     e02: -1.0,    e03: 0.535892,
      e10: 1E-06,   e11: -1.0,    e12: 0.0,     e13: 0.000255,
      e20: -1.0,    e21: -1E-06,  e22: 0.0,     e23: 0.0,
      e30: 0.0,     e31: 0.0,     e32: 0.0,     e33: 1.0
    }
  },

  kalman: {
    Q: 0.00001, R: 0.0001, P: 1, K: 0.5,
    x: { x: 0, y: 0, z: 0 },
    update(measure) {
      for (let k of ['x', 'y', 'z']) {
        this.P += this.Q;
        this.K = this.P / (this.P + this.R);
        this.x[k] += this.K * (measure[k] - this.x[k]);
        this.P *= (1 - this.K);
      }
      return { ...this.x };
    }
  },

  quaternionToMatrix(q) {
    const { x, y, z, w } = q;
    return [
      1 - 2*y*y - 2*z*z, 2*x*y - 2*z*w,     2*x*z + 2*y*w,     0,
      2*x*y + 2*z*w,     1 - 2*x*x - 2*z*z, 2*y*z - 2*x*w,     0,
      2*x*z - 2*y*w,     2*y*z + 2*x*w,     1 - 2*x*x - 2*y*y, 0,
      0, 0, 0, 1
    ];
  },

  multiply4x4(A, B) {
    const out = Array(4).fill(0).map(() => Array(4).fill(0));
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        for (let k = 0; k < 4; k++)
          out[i][j] += A[i][k] * B[k][j];
    return out;
  },

  getWorldNeckPosition() {
    const t = this.boneNeck;
    const bp = t.bindPose;

    const bind = [
      [bp.e00, bp.e01, bp.e02, bp.e03],
      [bp.e10, bp.e11, bp.e12, bp.e13],
      [bp.e20, bp.e21, bp.e22, bp.e23],
      [bp.e30, bp.e31, bp.e32, bp.e33]
    ];

    const rot = this.quaternionToMatrix(t.rotation);

    const model = [
      [rot[0]*t.scale.x, rot[1]*t.scale.y, rot[2]*t.scale.z, t.position.x],
      [rot[4]*t.scale.x, rot[5]*t.scale.y, rot[6]*t.scale.z, t.position.y],
      [rot[8]*t.scale.x, rot[9]*t.scale.y, rot[10]*t.scale.z, t.position.z],
      [0, 0, 0, 1]
    ];

    const world = this.multiply4x4(bind, model);

    return {
      x: world[0][3],
      y: world[1][3],
      z: world[2][3]
    };
  },

  setAim(x, y, z) {
    console.log("🎯 Lock Neck:", x.toFixed(6), y.toFixed(6), z.toFixed(6));
    // GameAPI.setCrosshairTarget(x, y, z); // nếu dùng trong hệ thống thực
  },

  run() {
    const loop = () => {
      const raw = this.getWorldNeckPosition();
      const filtered = this.kalman.update(raw);
      this.setAim(filtered.x, filtered.y, filtered.z);
      if (typeof requestAnimationFrame !== "undefined") requestAnimationFrame(loop);
      else setTimeout(loop, 16);
    };
    loop();
  }
};
// NeckTrackerLock.run(); // gộp vào AutoAimMasterLoop

const StableLock = {
  boneHead: {
    position: {
      x: -0.0456970781,
      y: -0.004478302,
      z: -0.0200432576
    },
    rotation: {
      x: 0.0258174837,
      y: -0.08611039,
      z: -0.1402113,
      w: 0.9860321
    },
    scale: {
      x: 0.99999994,
      y: 1.00000012,
      z: 1.0
    },
    bindPose: {
      e00: -1.34559613E-13, e01: 8.881784E-14, e02: -1.0, e03: 0.487912,
      e10: -2.84512817E-06, e11: -1.0, e12: 8.881784E-14, e13: -2.842171E-14,
      e20: -1.0, e21: 2.84512817E-06, e22: -1.72951931E-13, e23: 0.0,
      e30: 0.0, e31: 0.0, e32: 0.0, e33: 1.0
    }
  },

  kalman: {
    Q: 0.00001, R: 0.0001, P: 1, K: 0.5,
    x: { x: 0, y: 0, z: 0 },
    update(measure) {
      for (let k of ['x', 'y', 'z']) {
        this.P += this.Q;
        this.K = this.P / (this.P + this.R);
        this.x[k] = this.x[k] + this.K * (measure[k] - this.x[k]);
        this.P *= (1 - this.K);
      }
      return { ...this.x };
    }
  },

  quaternionToMatrix(q) {
    const { x, y, z, w } = q;
    return [
      1 - 2 * y * y - 2 * z * z,   2 * x * y - 2 * z * w,     2 * x * z + 2 * y * w, 0,
      2 * x * y + 2 * z * w,       1 - 2 * x * x - 2 * z * z, 2 * y * z - 2 * x * w, 0,
      2 * x * z - 2 * y * w,       2 * y * z + 2 * x * w,     1 - 2 * x * x - 2 * y * y, 0,
      0, 0, 0, 1
    ];
  },

  multiply4x4(A, B) {
    const out = Array(4).fill(0).map(() => Array(4).fill(0));
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        for (let k = 0; k < 4; k++)
          out[i][j] += A[i][k] * B[k][j];
    return out;
  },

  getWorldHeadPosition() {
    const t = this.boneHead;
    const bp = t.bindPose;
    const bind = [
      [bp.e00, bp.e01, bp.e02, bp.e03],
      [bp.e10, bp.e11, bp.e12, bp.e13],
      [bp.e20, bp.e21, bp.e22, bp.e23],
      [bp.e30, bp.e31, bp.e32, bp.e33]
    ];
    const rot = this.quaternionToMatrix(t.rotation);
    const model = [
      [rot[0]*t.scale.x, rot[1]*t.scale.y, rot[2]*t.scale.z, t.position.x],
      [rot[4]*t.scale.x, rot[5]*t.scale.y, rot[6]*t.scale.z, t.position.y],
      [rot[8]*t.scale.x, rot[9]*t.scale.y, rot[10]*t.scale.z, t.position.z],
      [0, 0, 0, 1]
    ];
    const world = this.multiply4x4(bind, model);
    return {
      x: world[0][3],
      y: world[1][3],
      z: world[2][3]
    };
  },

  getRecoilOffset() {
    // Recoil compensation - đây là nơi bạn có thể thay đổi để phù hợp vũ khí
    return {
      x: 0.0003,  // đẩy ngược lên tí cho giảm lệch
      y: 0.0002,
      z: 0.0001
    };
  },

  applyRecoilCompensation(pos) {
    const offset = this.getRecoilOffset();
    return {
      x: pos.x - offset.x,
      y: pos.y - offset.y,
      z: pos.z - offset.z
    };
  },

  setAim(x, y, z) {
    console.log("🎯 Aim with Recoil Compensation:", x.toFixed(6), y.toFixed(6), z.toFixed(6));
    // GameAPI.setCrosshairTarget(x, y, z); // mở dòng này nếu đã tích hợp với API game
  },

  runStableLock() {
    const update = () => {
      const rawPos = this.getWorldHeadPosition();
      const filtered = this.kalman.update(rawPos);
      const finalAim = this.applyRecoilCompensation(filtered);
      this.setAim(finalAim.x, finalAim.y, finalAim.z);

      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(update);
      } else {
        setTimeout(update, 16);
      }
    };
    update();
  }
};

// Chạy hệ thống aimlock mượt có bù giật
StableLock.runStableLock();

const AimLockWithRecoilComp = {
  boneHead: {
    position: {
      x: -0.0456970781,
      y: -0.004478302,
      z: -0.0200432576
    },
    rotation: {
      x: 0.0258174837,
      y: -0.08611039,
      z: -0.1402113,
      w: 0.9860321
    },
    scale: {
      x: 0.99999994,
      y: 1.00000012,
      z: 1.0
    },
    bindPose: {
      e00: -1.34559613E-13, e01: 8.881784E-14, e02: -1.0, e03: 0.487912,
      e10: -2.84512817E-06, e11: -1.0, e12: 8.881784E-14, e13: -2.842171E-14,
      e20: -1.0, e21: 2.84512817E-06, e22: -1.72951931E-13, e23: 0.0,
      e30: 0.0, e31: 0.0, e32: 0.0, e33: 1.0
    }
  },

  kalman: {
    Q: 0.00001, R: 0.0001, P: 1, K: 0.5,
    x: { x: 0, y: 0, z: 0 },
    update(measure) {
      for (let k of ['x', 'y', 'z']) {
        this.P += this.Q;
        this.K = this.P / (this.P + this.R);
        this.x[k] += this.K * (measure[k] - this.x[k]);
        this.P *= (1 - this.K);
      }
      return { ...this.x };
    }
  },

  quaternionToMatrix(q) {
    const { x, y, z, w } = q;
    return [
      1 - 2*y*y - 2*z*z, 2*x*y - 2*z*w,   2*x*z + 2*y*w, 0,
      2*x*y + 2*z*w,     1 - 2*x*x - 2*z*z, 2*y*z - 2*x*w, 0,
      2*x*z - 2*y*w,     2*y*z + 2*x*w,   1 - 2*x*x - 2*y*y, 0,
      0, 0, 0, 1
    ];
  },

  multiply4x4(A, B) {
    const out = Array(4).fill(0).map(() => Array(4).fill(0));
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        for (let k = 0; k < 4; k++)
          out[i][j] += A[i][k] * B[k][j];
    return out;
  },

  getWorldHeadPosition() {
    const t = this.boneHead;
    const bp = t.bindPose;
    const bind = [
      [bp.e00, bp.e01, bp.e02, bp.e03],
      [bp.e10, bp.e11, bp.e12, bp.e13],
      [bp.e20, bp.e21, bp.e22, bp.e23],
      [bp.e30, bp.e31, bp.e32, bp.e33]
    ];
    const rot = this.quaternionToMatrix(t.rotation);
    const model = [
      [rot[0]*t.scale.x, rot[1]*t.scale.y, rot[2]*t.scale.z, t.position.x],
      [rot[4]*t.scale.x, rot[5]*t.scale.y, rot[6]*t.scale.z, t.position.y],
      [rot[8]*t.scale.x, rot[9]*t.scale.y, rot[10]*t.scale.z, t.position.z],
      [0, 0, 0, 1]
    ];
    const world = this.multiply4x4(bind, model);
    return {
      x: world[0][3],
      y: world[1][3],
      z: world[2][3]
    };
  },

  getRecoilOffset() {
    // Điều chỉnh bù giật tại đây tùy súng
    return {
      x: 0.0002,
      y: 0.00015,
      z: 0.0001
    };
  },

  applyRecoilCompensation(pos) {
    const offset = this.getRecoilOffset();
    return {
      x: pos.x - offset.x,
      y: pos.y - offset.y,
      z: pos.z - offset.z
    };
  },

  setAim(x, y, z) {
    console.log("🎯 AimLock with Recoil:", x.toFixed(6), y.toFixed(6), z.toFixed(6));
    // GameAPI.setCrosshairTarget(x, y, z); // dùng nếu có tích hợp với game
  },

  run() {
    const loop = () => {
      const head = this.getWorldHeadPosition();
      const smoothed = this.kalman.update(head);
      const aim = this.applyRecoilCompensation(smoothed);
      this.setAim(aim.x, aim.y, aim.z);
      if (typeof requestAnimationFrame !== 'undefined') requestAnimationFrame(loop);
      else setTimeout(loop, 16); // fallback nếu không có rAF
    };
    loop();
  }
};

// Bắt đầu chạy hệ thống AimLock
// AimLockWithRecoilComp.run(); // gộp vào AutoAimMasterLoop

// ====================== AUTO AIM MASTER LOOP ======================
const AutoAimMasterLoop = {
  systems: [],
  register(system, methodName) {
    if (system && typeof system[methodName] === "function") {
      this.systems.push(() => system[methodName]());
    }
  },
  run(interval = 16) {
    setInterval(() => {
      for (const update of this.systems) update();
    }, interval);
  }
};

// Đăng ký tất cả hệ thống auto-aim
AutoAimMasterLoop.register(BoneAimSwitch, "checkAndAim");
AutoAimMasterLoop.register(SmartSpine1AimSwitch, "checkAimSwitch");
AutoAimMasterLoop.register(SmartClavicleSwitch, "checkAim");
AutoAimMasterLoop.register(SmartRightClavSwitch, "checkAim");
AutoAimMasterLoop.register(SmartLeftForearmSwitch, "checkAim");
AutoAimMasterLoop.register(RightForeArmAimSwitch, "checkAim");
AutoAimMasterLoop.register(LeftLegAimSwitch, "checkAim");
AutoAimMasterLoop.register(RightLegAimSwitch, "checkAim");
AutoAimMasterLoop.register(HipsAimSwitch, "checkAim");

AutoAimMasterLoop.register(AimbotBoneHead, "runLoop");
AutoAimMasterLoop.register(DragAimLock_HardClamp, "dragLockFrame");
AutoAimMasterLoop.register(AimLockAdvanced, "update");
AutoAimMasterLoop.register(StrongPrecisionAimLock, "updateAim");
AutoAimMasterLoop.register(InstantAimLock, "dragNow");
AutoAimMasterLoop.register(NeckTrackerLock, "run");

// 🚀 Khởi chạy tất cả hệ thống
AutoAimMasterLoop.run();
