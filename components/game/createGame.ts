import type PhaserNamespace from "phaser";

type PhaserModule = typeof PhaserNamespace;
type Graphics = PhaserNamespace.GameObjects.Graphics;

export type GameCallbacks = {
  onNear: (id: string | null) => void;
  onInteract: (id: string) => void;
  onStep: () => void;
};

export type GameHandle = {
  destroy: () => void;
  setPaused: (paused: boolean) => void;
  setDone: (ids: string[]) => void;
  setNight: (night: boolean) => void;
  swirl: () => void;
  interact: () => void;
};

type Rect = { x: number; y: number; w: number; h: number };
type RoomObject = { id: string; area: Rect; spot: { x: number; y: number } };
type Direction = "down" | "up" | "side";

const WIDTH = 336;
const HEIGHT = 288;
const SPEED = 90;
const NEAR_DISTANCE = 26;
const FLOOR = { x: 16, y: 48, w: 304, h: 224 };

const OBJECTS: RoomObject[] = [
  { id: "computer", area: { x: 24, y: 40, w: 72, h: 44 }, spot: { x: 60, y: 96 } },
  { id: "mixer", area: { x: 232, y: 40, w: 80, h: 44 }, spot: { x: 272, y: 96 } },
  { id: "mead", area: { x: 16, y: 130, w: 28, h: 84 }, spot: { x: 58, y: 172 } },
  { id: "books", area: { x: 292, y: 130, w: 28, h: 84 }, spot: { x: 278, y: 172 } },
  { id: "board", area: { x: 102, y: 6, w: 30, h: 34 }, spot: { x: 117, y: 58 } },
  { id: "door", area: { x: 148, y: 262, w: 40, h: 26 }, spot: { x: 168, y: 254 } },
];
const SOLIDS: Rect[] = [
  ...OBJECTS.filter(({ id }) => id !== "door" && id !== "board").map(({ area }) => area),
  { x: 284, y: 240, w: 26, h: 22 }, // plant
  { x: 20, y: 236, w: 22, h: 26 }, // brewing jug
];

const inRect = (x: number, y: number, r: Rect) =>
  x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;

function canStand(x: number, y: number) {
  const box = { left: x - 5, right: x + 5, top: y - 4, bottom: y + 4 };
  if (
    box.left < FLOOR.x ||
    box.right > FLOOR.x + FLOOR.w ||
    box.top < FLOOR.y ||
    box.bottom > FLOOR.y + FLOOR.h
  ) {
    return false;
  }
  return !SOLIDS.some(
    (r) => box.right > r.x && box.left < r.x + r.w && box.bottom > r.y && box.top < r.y + r.h
  );
}

function drawCharacter(ctx: CanvasRenderingContext2D, direction: Direction, step: number) {
  const rect = (color: string, x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };
  const outline = "#21161d";
  const skin = "#e9bd96";
  const skinDark = "#c9976f";
  const hair = "#4a2f1d";
  const hairLight = "#6b4a2f";
  const shirt = "#3b6ea5";
  const shirtLight = "#5a8fc4";
  const shirtDark = "#2f5885";
  const pants = "#2b3a55";
  const shoes = "#1c1d24";
  const stride = step === 1 ? 1 : step === 3 ? -1 : 0;

  if (direction === "side") {
    rect(outline, 3, 0, 11, 10);
    rect(outline, 3, 9, 9, 9);
    rect(pants, 5, 16, 4, 4);
    rect(shoes, 4 + stride * 2, 20, 6, 2);
    rect(shirt, 4, 10, 7, 7);
    rect(shirtLight, 8, 10, 3, 2);
    rect(shirtDark, 5 - stride, 11, 3, 5);
    rect(skin, 4, 1, 9, 8);
    rect(skinDark, 4, 7, 3, 2);
    rect(hair, 4, 1, 9, 3);
    rect(hair, 4, 1, 3, 6);
    rect(hairLight, 8, 1, 3, 1);
    rect(outline, 10, 5, 1, 2);
    return;
  }

  rect(outline, 1, 0, 12, 10);
  rect(outline, 0, 9, 14, 9);
  rect(pants, 3, 16, 3, 5 - Math.max(stride, 0));
  rect(pants, 8, 16, 3, 5 - Math.max(-stride, 0));
  rect(shoes, 3, 20 - Math.max(stride, 0), 3, 2);
  rect(shoes, 8, 20 - Math.max(-stride, 0), 3, 2);
  rect(shirt, 2, 10, 10, 7);
  rect(shirtLight, 3, 10, 8, 1);
  rect(shirtDark, 1, 10 + Math.max(stride, 0), 1, 5);
  rect(shirtDark, 12, 10 + Math.max(-stride, 0), 1, 5);
  rect(skin, 2, 1, 10, 8);
  rect(hair, 2, 1, 10, 3);
  rect(hairLight, 4, 1, 5, 1);
  if (direction === "up") {
    rect(hair, 2, 1, 10, 8);
    rect(hairLight, 4, 2, 6, 1);
  } else {
    rect(hair, 2, 1, 1, 5);
    rect(hair, 11, 1, 1, 5);
    rect(outline, 4, 5, 1, 2);
    rect(outline, 9, 5, 1, 2);
    rect(skinDark, 6, 7, 2, 1);
  }
}

function makeRect(g: Graphics) {
  return (color: number, x: number, y: number, w: number, h: number) => {
    g.fillStyle(color);
    g.fillRect(x, y, w, h);
  };
}

// A box with a dark outline, a lit top edge, and a shaded lower edge.
function box(
  rect: ReturnType<typeof makeRect>,
  x: number,
  y: number,
  w: number,
  h: number,
  base: number,
  light: number,
  dark: number
) {
  rect(0x21161d, x - 1, y - 1, w + 2, h + 2);
  rect(base, x, y, w, h);
  rect(light, x, y, w, 1);
  rect(dark, x, y + h - 2, w, 2);
}

function drawRoom(g: Graphics) {
  const rect = makeRect(g);

  // Floorboards with slight color changes from plank to plank.
  rect(0x8a5a3a, 0, 0, WIDTH, HEIGHT);
  const planks = [0x8a5a3a, 0x93623f, 0x825436, 0x8e5d3c];
  for (let row = 0; row < 15; row++) {
    const y = 48 + row * 16;
    for (let i = -1; i < 8; i++) {
      const x = i * 48 + (row % 2 ? 24 : 0);
      rect(planks[Math.abs(row * 3 + i) % planks.length], x, y, 48, 16);
      rect(0x6a4229, x, y, 1, 16);
      rect(0x9c6b47, x + 1, y + 1, 46, 1);
      if ((row + i) % 3 === 0) rect(0x74492d, x + 14, y + 7, 9, 1);
    }
    rect(0x6a4229, 0, y, WIDTH, 1);
  }

  // Walls and baseboard.
  rect(0x56394a, 0, 0, WIDTH, 40);
  for (let x = 0; x < WIDTH; x += 8) rect(0x5e4052, x, 0, 4, 32);
  rect(0x3f2c3a, 0, 32, WIDTH, 8);
  rect(0x6a4a5a, 0, 32, WIDTH, 1);
  rect(0x2b1d27, 0, 40, WIDTH, 8);
  rect(0x4f3424, 0, 44, WIDTH, 4);
  rect(0x2b1d27, 0, 0, 16, HEIGHT);
  rect(0x2b1d27, 320, 0, 16, HEIGHT);
  rect(0x2b1d27, 0, 272, WIDTH, 16);
  rect(0x3f2c3a, 15, 48, 1, 224);
  rect(0x3f2c3a, 320, 48, 1, 224);

  // Window with a night sky.
  box(rect, 139, 5, 58, 30, 0x1b2a4a, 0x26396a, 0x16223c);
  [[147, 12], [156, 25], [166, 11], [188, 28], [151, 30], [176, 24]].forEach(([x, y]) =>
    rect(0xd6e4ff, x, y, 1, 1)
  );
  rect(0xf4e7b0, 180, 9, 7, 7);
  rect(0xf4e7b0, 179, 10, 9, 5);
  rect(0x1b2a4a, 178, 9, 5, 5);
  rect(0x2b1d27, 167, 5, 2, 30);
  rect(0x2b1d27, 139, 19, 58, 2);
  rect(0x5b3a24, 137, 35, 62, 3);

  // Waveform and speaker posters.
  box(rect, 103, 7, 28, 25, 0xb98a55, 0xcfa26c, 0x9c7240);
  rect(0xf1e3c6, 106, 10, 8, 7);
  rect(0x9fd0d9, 117, 10, 10, 6);
  rect(0xf7d98a, 107, 20, 9, 8);
  rect(0xe8a5a0, 119, 19, 9, 8);
  [[109, 10], [121, 10], [110, 20], [122, 19]].forEach(([x, y]) => rect(0xb0473f, x, y, 2, 2));
  box(rect, 207, 9, 20, 20, 0x4f7a9d, 0x6793b6, 0x3f6885);
  rect(0xe6b34a, 212, 14, 10, 10);
  rect(0x4f7a9d, 214, 16, 6, 6);
  rect(0xe6b34a, 216, 18, 2, 2);

  // Rug.
  rect(0x000000, 101, 122, 136, 92);
  rect(0x7c3f3a, 100, 120, 136, 92);
  rect(0xc98f4e, 105, 125, 126, 82);
  rect(0x8a4a42, 109, 129, 118, 74);
  for (let x = 113; x < 226; x += 8) {
    rect(0xa8634f, x, 133, 4, 2);
    rect(0xa8634f, x, 197, 4, 2);
  }
  for (let i = 0; i < 6; i++) {
    rect(0xc98f4e, 96, 124 + i * 15, 4, 2);
    rect(0xc98f4e, 236, 124 + i * 15, 4, 2);
  }

  // Computer desk.
  rect(0x5f3c26, 26, 85, 70, 3);
  box(rect, 24, 62, 72, 21, 0x5b3a24, 0x7a5233, 0x432a1a);
  rect(0x4c3020, 30, 72, 60, 1);
  box(rect, 44, 40, 32, 21, 0x23262f, 0x3a3d48, 0x1c1d24);
  rect(0x6fc3d9, 47, 43, 26, 15);
  rect(0xd6f1f7, 50, 46, 14, 2);
  rect(0xd6f1f7, 50, 50, 18, 2);
  rect(0x23262f, 56, 62, 8, 3);
  box(rect, 42, 69, 36, 6, 0x3a3d48, 0x54586a, 0x23262f);
  box(rect, 84, 66, 6, 6, 0xe8e2d0, 0xffffff, 0xc9c2ad);
  rect(0x8a5a3a, 85, 67, 4, 2);
  rect(0x23262f, 31, 58, 2, 6);
  box(rect, 27, 64, 10, 2, 0x23262f, 0x3a3d48, 0x23262f);
  box(rect, 27, 53, 10, 5, 0xe6b34a, 0xf7d98a, 0xbd8f33);

  // Mixing desk with speakers.
  rect(0x5f3c26, 234, 85, 78, 3);
  box(rect, 232, 62, 80, 21, 0x5b3a24, 0x7a5233, 0x432a1a);
  [234, 296].forEach((x) => {
    box(rect, x, 38, 14, 24, 0x23262f, 0x3a3d48, 0x1c1d24);
    rect(0x6c6f7d, x + 4, 42, 6, 6);
    rect(0x1c1d24, x + 6, 44, 2, 2);
    rect(0x6c6f7d, x + 3, 51, 8, 8);
    rect(0x1c1d24, x + 5, 53, 4, 4);
  });
  box(rect, 252, 64, 40, 14, 0x3a3d48, 0x54586a, 0x23262f);
  for (let i = 0; i < 6; i++) rect(0x1c1d24, 256 + i * 6, 66, 2, 10);

  // Mead shelf.
  box(rect, 16, 130, 28, 84, 0x5b3a24, 0x7a5233, 0x432a1a);
  [150, 176, 202].forEach((shelfY, row) => {
    rect(0x432a1a, 18, shelfY - 18, 24, 18);
    rect(0x7a5233, 16, shelfY, 28, 2);
    rect(0x3a2416, 16, shelfY + 2, 28, 2);
    for (let i = 0; i < 3; i++) {
      const x = 20 + i * 8;
      rect(row === 1 ? 0xc77d2e : 0xe6a93c, x, shelfY - 12, 6, 12);
      rect(0xfff0c2, x + 1, shelfY - 11, 1, 7);
      rect(0xf1e3c6, x + 2, shelfY - 16, 2, 4);
      rect(0x8a5a3a, x + 2, shelfY - 17, 2, 1);
    }
  });

  // Bookshelf.
  const bookColors = [0x9d4f4a, 0x4f7a9d, 0xd1a24b, 0x5f8f5f, 0x8a6aa8];
  box(rect, 292, 130, 28, 84, 0x5b3a24, 0x7a5233, 0x432a1a);
  [150, 176, 202].forEach((shelfY, row) => {
    rect(0x432a1a, 294, shelfY - 18, 24, 18);
    rect(0x7a5233, 292, shelfY, 28, 2);
    rect(0x3a2416, 292, shelfY + 2, 28, 2);
    for (let i = 0; i < 6; i++) {
      if (row === 1 && i === 3) continue;
      const height = 12 + ((i + row) % 3) * 2;
      rect(bookColors[(i + row) % bookColors.length], 295 + i * 4, shelfY - height, 3, height);
      rect(0xf1e3c6, 295 + i * 4, shelfY - height + 3, 3, 1);
    }
  });

  // Front door and doormat.
  box(rect, 148, 268, 40, 20, 0x5b3a24, 0x7a5233, 0x432a1a);
  rect(0x432a1a, 152, 272, 32, 16);
  rect(0xe6b34a, 178, 278, 3, 3);
  rect(0x57533e, 150, 254, 36, 12);
  rect(0x6e6a4f, 152, 256, 32, 8);

  // Plant.
  rect(0x000000, 286, 260, 24, 3);
  box(rect, 288, 245, 18, 16, 0x9a5b3d, 0xb97653, 0x7c4730);
  rect(0x3f7040, 284, 228, 26, 18);
  rect(0x4f8a4f, 286, 224, 22, 18);
  rect(0x6aa96a, 291, 218, 12, 12);
  rect(0x86c286, 293, 220, 4, 4);

  // Brewing jug on the floor.
  rect(0x5f3c26, 21, 260, 24, 3);
  box(rect, 22, 240, 20, 20, 0xc77d2e, 0xe6a93c, 0xa86726);
  rect(0xe6a93c, 24, 242, 16, 14);
  rect(0xfff0c2, 25, 243, 2, 10);
  box(rect, 29, 233, 6, 7, 0xc9d4d6, 0xe8f0f2, 0xa8b4b6);
  rect(0x8a5a3a, 30, 229, 4, 4);
}

export function createGame(
  Phaser: PhaserModule,
  parent: HTMLElement,
  callbacks: GameCallbacks
): GameHandle {
  let paused = true;
  let done = new Set<string>();
  let night = false;
  let interactNow = () => {};
  let swirlNow = () => {};

  const portrait = parent.clientWidth / Math.max(parent.clientHeight, 1) < 0.85;
  const viewWidth = portrait ? 220 : WIDTH;

  class WorkshopScene extends Phaser.Scene {
    private player!: PhaserNamespace.GameObjects.Image;
    private shadow!: PhaserNamespace.GameObjects.Ellipse;
    private highlight!: Graphics;
    private meters!: Graphics;
    private cursorBlink!: PhaserNamespace.GameObjects.Rectangle;
    private screen!: Graphics;
    private fallenBook!: Graphics;
    private looseNote!: Graphics;
    private openDoor!: Graphics;
    private darkness!: PhaserNamespace.GameObjects.Rectangle;
    private bubbleTweens: PhaserNamespace.Tweens.Tween[] = [];
    private keys!: Record<string, PhaserNamespace.Input.Keyboard.Key>;
    private markers = new Map<string, Graphics>();
    private celebrated = new Set<string>();
    private target: { x: number; y: number } | null = null;
    private pendingId: string | null = null;
    private nearId: string | null = null;
    private direction: Direction = "down";
    private walkTime = 0;
    private stepTime = 0;
    private reduceMotion = false;
    private nightShown = false;

    create() {
      this.reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      drawRoom(this.add.graphics());
      this.addGlow(32, 58, 30, 0xffc966);
      this.addGlow(168, 36, 36, 0x7f9fd9);
      this.addBubbles();

      this.meters = this.add.graphics();
      this.screen = this.add.graphics();
      this.cursorBlink = this.add.rectangle(66, 51, 3, 2, 0xd6f1f7);
      this.highlight = this.add.graphics();

      this.fallenBook = this.add.graphics();
      const bookRect = makeRect(this.fallenBook);
      bookRect(0x21161d, 261, 219, 18, 11);
      bookRect(0x4f7a9d, 262, 220, 16, 9);
      bookRect(0xf1e3c6, 263, 228, 14, 1);
      bookRect(0xe6b34a, 267, 223, 6, 2);

      this.looseNote = this.add.graphics();
      const noteRect = makeRect(this.looseNote);
      noteRect(0x21161d, 116, 33, 11, 8);
      noteRect(0xf1e3c6, 117, 34, 9, 6);

      this.openDoor = this.add.graphics();
      const doorRect = makeRect(this.openDoor);
      doorRect(0xf4d98a, 152, 272, 32, 16);
      doorRect(0x432a1a, 148, 272, 4, 16);
      this.openDoor.setVisible(false);

      (["down", "up", "side"] as Direction[]).forEach((direction) => {
        for (let step = 0; step < 4; step++) {
          const texture = this.textures.createCanvas(`player-${direction}-${step}`, 14, 22);
          drawCharacter(texture!.getContext(), direction, step);
          texture!.refresh();
        }
      });
      this.shadow = this.add.ellipse(168, 193, 14, 6, 0x000000, 0.28);
      this.player = this.add.image(168, 190, "player-down-0").setOrigin(0.5, 0.86);

      this.darkness = this.add
        .rectangle(0, 0, WIDTH, HEIGHT, 0x0b0820, 0)
        .setOrigin(0)
        .setDepth(900);

      OBJECTS.forEach(({ id, area }) => {
        const marker = this.add.graphics();
        marker.fillStyle(0x21161d);
        marker.fillTriangle(-6, -8, 6, -8, 0, 1);
        marker.fillStyle(0xffe08a);
        marker.fillTriangle(-5, -7, 5, -7, 0, 0);
        marker.setPosition(area.x + area.w / 2, Math.max(area.y - 2, 14));
        marker.setDepth(1000);
        this.markers.set(id, marker);
        if (!this.reduceMotion) {
          this.tweens.add({ targets: marker, y: marker.y - 4, duration: 500, yoyo: true, repeat: -1 });
        }
      });

      const camera = this.cameras.main;
      camera.setBounds(0, 0, WIDTH, HEIGHT);
      if (portrait) camera.startFollow(this.player, true, 0.12, 0.12);

      const keyboard = this.input.keyboard!;
      const codes = Phaser.Input.Keyboard.KeyCodes;
      this.keys = {
        up: keyboard.addKey(codes.UP, false),
        down: keyboard.addKey(codes.DOWN, false),
        left: keyboard.addKey(codes.LEFT, false),
        right: keyboard.addKey(codes.RIGHT, false),
        w: keyboard.addKey(codes.W, false),
        a: keyboard.addKey(codes.A, false),
        s: keyboard.addKey(codes.S, false),
        d: keyboard.addKey(codes.D, false),
      };
      const onKey = (event: KeyboardEvent) => {
        if (!event.repeat) interactNow();
      };
      keyboard.on("keydown-E", onKey);
      keyboard.on("keydown-SPACE", onKey);
      keyboard.on("keydown-ENTER", onKey);

      interactNow = () => {
        if (!paused && this.nearId) callbacks.onInteract(this.nearId);
      };
      swirlNow = () => {
        this.bubbleTweens.forEach((tween) => {
          tween.timeScale = 3;
        });
      };

      this.input.on("pointerdown", (pointer: PhaserNamespace.Input.Pointer) => {
        if (paused) return;
        const object = OBJECTS.find(({ area }) => inRect(pointer.worldX, pointer.worldY, area));
        this.pendingId = object?.id ?? null;
        this.target = object ? { ...object.spot } : { x: pointer.worldX, y: pointer.worldY };
        this.ping(pointer.worldX, pointer.worldY);
      });
    }

    private addGlow(x: number, y: number, radius: number, color: number) {
      const glow = this.add.graphics();
      glow.setBlendMode(Phaser.BlendModes.ADD);
      glow.setDepth(950);
      for (let scale = 1; scale > 0.1; scale -= 0.1) {
        glow.fillStyle(color, 0.018);
        glow.fillCircle(x, y, radius * scale);
      }
      if (!this.reduceMotion) {
        this.tweens.add({ targets: glow, alpha: 0.65, duration: 1400, yoyo: true, repeat: -1 });
      }
    }

    private addBubbles() {
      for (let i = 0; i < 3; i++) {
        const bubble = this.add.rectangle(27 + i * 5, 256, 2, 2, 0xfff0c2);
        if (this.reduceMotion) {
          bubble.y = 248 + i * 3;
          continue;
        }
        this.bubbleTweens.push(
          this.tweens.add({
            targets: bubble,
            y: 243,
            alpha: 0.2,
            duration: 1500 + i * 400,
            delay: i * 500,
            repeat: -1,
          })
        );
      }
    }

    private ping(x: number, y: number) {
      const ring = this.add.circle(x, y, 3).setStrokeStyle(1, 0xffe08a).setDepth(999);
      this.tweens.add({
        targets: ring,
        scale: 2.5,
        alpha: 0,
        duration: 300,
        onComplete: () => ring.destroy(),
      });
    }

    private burst(x: number, y: number) {
      if (this.reduceMotion) return;
      for (let i = 0; i < 14; i++) {
        const angle = (i / 14) * Math.PI * 2;
        const distance = 18 + (i % 3) * 8;
        const spark = this.add
          .rectangle(x, y, 2, 2, i % 2 ? 0xffe08a : 0xffffff)
          .setDepth(1001);
        this.tweens.add({
          targets: spark,
          x: x + Math.cos(angle) * distance,
          y: y + Math.sin(angle) * distance,
          alpha: 0,
          duration: 550,
          ease: "Cubic.easeOut",
          onComplete: () => spark.destroy(),
        });
      }
    }

    private dust() {
      const puff = this.add.rectangle(this.player.x, this.player.y + 3, 2, 2, 0xd9c9a8, 0.6);
      this.tweens.add({
        targets: puff,
        y: puff.y - 3,
        alpha: 0,
        duration: 320,
        onComplete: () => puff.destroy(),
      });
    }

    private drawLiveDetails(time: number) {
      this.meters.clear();
      const live = done.has("mixer") && !this.reduceMotion;
      for (let i = 0; i < 6; i++) {
        const level = live ? 3 + Math.abs(Math.sin(time / (170 + i * 37))) * 7 : 3 + (i % 3);
        this.meters.fillStyle(i % 2 ? 0xe6b34a : 0x6fc3d9);
        this.meters.fillRect(255 + i * 6, 76 - level, 4, 2);
      }

      this.screen.clear();
      const computerDone = done.has("computer");
      if (computerDone) {
        this.screen.fillStyle(0x7fd98a);
        this.screen.fillRect(50, 54, 10, 2);
      }
      this.cursorBlink.setVisible(this.reduceMotion || Math.floor(time / 500) % 2 === 0);

      this.highlight.clear();
      const near = OBJECTS.find(({ id }) => id === this.nearId);
      if (near && !paused) {
        const { x, y, w, h } = near.area;
        const alpha = this.reduceMotion ? 0.9 : 0.55 + Math.sin(time / 180) * 0.35;
        this.highlight.lineStyle(1, 0xffe08a, alpha);
        this.highlight.strokeRect(x - 1, y - 1, w + 2, h + 2);
      }

      this.fallenBook.setVisible(!done.has("books"));
      this.looseNote.setVisible(!done.has("board"));
      if (night && !this.nightShown) {
        this.nightShown = true;
        this.openDoor.setVisible(true);
        if (this.reduceMotion) {
          this.darkness.setFillStyle(0x0b0820, 0.55);
        } else {
          this.tweens.addCounter({
            from: 0,
            to: 0.55,
            duration: 1200,
            onUpdate: (tween) => this.darkness.setFillStyle(0x0b0820, tween.getValue() ?? 0),
          });
        }
      }
    }

    update(time: number, delta: number) {
      this.drawLiveDetails(time);
      this.markers.forEach((marker, id) => {
        marker.setVisible(!done.has(id));
        if (done.has(id) && !this.celebrated.has(id)) {
          this.celebrated.add(id);
          const { area } = OBJECTS.find((object) => object.id === id)!;
          this.burst(area.x + area.w / 2, area.y + area.h / 2);
        }
      });
      if (paused) return;

      const step = (SPEED * delta) / 1000;
      const { up, down, left, right, w, a, s, d } = this.keys;
      let dx = Number(right.isDown || d.isDown) - Number(left.isDown || a.isDown);
      let dy = Number(down.isDown || s.isDown) - Number(up.isDown || w.isDown);

      if (dx || dy) {
        this.target = null;
        this.pendingId = null;
      } else if (this.target) {
        const offX = this.target.x - this.player.x;
        const offY = this.target.y - this.player.y;
        if (Math.hypot(offX, offY) <= step) {
          this.target = null;
        } else {
          dx = offX;
          dy = offY;
        }
      }

      const before = { x: this.player.x, y: this.player.y };
      if (dx || dy) {
        const length = Math.hypot(dx, dy);
        const nextX = this.player.x + (dx / length) * step;
        const nextY = this.player.y + (dy / length) * step;
        if (canStand(nextX, this.player.y)) this.player.x = nextX;
        if (canStand(this.player.x, nextY)) this.player.y = nextY;
        if (this.target && before.x === this.player.x && before.y === this.player.y) {
          this.target = null;
        }
      }

      const moving = before.x !== this.player.x || before.y !== this.player.y;
      if (moving) {
        if (Math.abs(dx) > Math.abs(dy)) {
          this.direction = "side";
          this.player.setFlipX(dx < 0);
        } else {
          this.direction = dy < 0 ? "up" : "down";
          this.player.setFlipX(false);
        }
        this.walkTime += delta;
        this.stepTime += delta;
        if (this.stepTime > 260) {
          this.stepTime = 0;
          callbacks.onStep();
          if (!this.reduceMotion) this.dust();
        }
      } else {
        this.walkTime = 0;
      }
      const frame = moving ? Math.floor(this.walkTime / 130) % 4 : 0;
      this.player.setTexture(`player-${this.direction}-${frame}`);
      this.shadow.setPosition(this.player.x, this.player.y + 3);
      this.player.setDepth(this.player.y);
      this.shadow.setDepth(this.player.y - 1);

      const near =
        OBJECTS.find(
          ({ spot }) =>
            Math.hypot(spot.x - this.player.x, spot.y - this.player.y) < NEAR_DISTANCE
        )?.id ?? null;
      if (near !== this.nearId) {
        this.nearId = near;
        callbacks.onNear(near);
      }
      if (this.pendingId && this.pendingId === near) {
        this.target = null;
        this.pendingId = null;
        callbacks.onInteract(near);
      } else if (!this.target) {
        this.pendingId = null;
      }
    }
  }

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: viewWidth,
    height: HEIGHT,
    pixelArt: true,
    backgroundColor: "#1b1420",
    banner: false,
    audio: { noAudio: true },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: WorkshopScene,
  });

  return {
    destroy: () => game.destroy(true),
    setPaused: (value) => {
      paused = value;
    },
    setDone: (ids) => {
      done = new Set(ids);
    },
    setNight: (value) => {
      night = value;
    },
    swirl: () => swirlNow(),
    interact: () => interactNow(),
  };
}
