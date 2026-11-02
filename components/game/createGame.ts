import type PhaserNamespace from "phaser";

type PhaserModule = typeof PhaserNamespace;

export type GameCallbacks = {
  onNear: (id: string | null) => void;
  onInteract: (id: string) => void;
};

export type GameHandle = {
  destroy: () => void;
  setPaused: (paused: boolean) => void;
  setFound: (ids: string[]) => void;
  interact: () => void;
};

type Rect = { x: number; y: number; w: number; h: number };
type RoomObject = { id: string; area: Rect; spot: { x: number; y: number } };

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
  { id: "door", area: { x: 148, y: 262, w: 40, h: 26 }, spot: { x: 168, y: 254 } },
];
const SOLIDS: Rect[] = [
  ...OBJECTS.filter(({ id }) => id !== "door").map(({ area }) => area),
  { x: 284, y: 240, w: 26, h: 22 }, // plant
  { x: 20, y: 236, w: 22, h: 26 }, // brewing jug
];

type Direction = "down" | "up" | "side";

function drawCharacter(ctx: CanvasRenderingContext2D, direction: Direction, step: number) {
  const rect = (color: string, x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };
  const skin = "#e9bd96";
  const hair = "#4a2f1d";
  const shirt = "#3b6ea5";
  const shirtDark = "#2f5885";
  const pants = "#2b3a55";
  const shoes = "#1c1d24";
  const stride = step === 1 ? 1 : step === 3 ? -1 : 0;

  if (direction === "side") {
    rect(pants, 5, 16, 4, 5);
    rect(shoes, 5 + stride * 2, 20, 5, 2);
    rect(pants, 5 + stride, 16, 4, 4);
    rect(shirt, 4, 9, 7, 8);
    rect(shirtDark, 5 - stride, 10, 3, 6);
    rect(skin, 3, 1, 9, 8);
    rect(hair, 3, 0, 9, 3);
    rect(hair, 3, 0, 3, 7);
    rect(shoes, 9, 4, 1, 2);
    return;
  }

  rect(pants, 3, 16, 3, 5 - Math.max(stride, 0));
  rect(pants, 8, 16, 3, 5 - Math.max(-stride, 0));
  rect(shoes, 3, 20 - Math.max(stride, 0), 3, 2);
  rect(shoes, 8, 20 - Math.max(-stride, 0), 3, 2);
  rect(shirt, 2, 9, 10, 8);
  rect(shirtDark, 1, 10 + Math.max(stride, 0), 1, 5);
  rect(shirtDark, 12, 10 + Math.max(-stride, 0), 1, 5);
  rect(skin, 2, 1, 10, 8);
  rect(hair, 2, 0, 10, 3);
  if (direction === "up") {
    rect(hair, 2, 0, 10, 8);
  } else {
    rect(hair, 2, 0, 1, 5);
    rect(hair, 11, 0, 1, 5);
    rect(shoes, 4, 5, 1, 2);
    rect(shoes, 9, 5, 1, 2);
  }
}

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

function drawRoom(g: PhaserNamespace.GameObjects.Graphics) {
  const rect = (color: number, x: number, y: number, w: number, h: number) => {
    g.fillStyle(color);
    g.fillRect(x, y, w, h);
  };

  // Floor and walls.
  rect(0x8a5a3a, 0, 0, WIDTH, HEIGHT);
  for (let y = 48; y < HEIGHT; y += 16) {
    rect(0x74492d, 0, y, WIDTH, 1);
    for (let x = (y / 16) % 2 ? 0 : 24; x < WIDTH; x += 48) rect(0x74492d, x, y, 1, 16);
  }
  rect(0x3f2c3a, 0, 0, WIDTH, 40);
  rect(0x56394a, 0, 8, WIDTH, 24);
  rect(0x2b1d27, 0, 40, WIDTH, 8);
  rect(0x2b1d27, 0, 0, 16, HEIGHT);
  rect(0x2b1d27, 320, 0, 16, HEIGHT);
  rect(0x2b1d27, 0, 272, WIDTH, 16);

  // Window with a night sky.
  rect(0x2b1d27, 138, 4, 60, 32);
  rect(0x1b2a4a, 141, 7, 54, 26);
  rect(0xf4e7b0, 178, 10, 8, 8);
  rect(0x1b2a4a, 176, 9, 5, 6);
  [[147, 12], [156, 22], [166, 11], [188, 26], [151, 29]].forEach(([x, y]) =>
    rect(0xd6e4ff, x, y, 1, 1)
  );
  rect(0x2b1d27, 167, 7, 2, 26);
  rect(0x2b1d27, 141, 19, 54, 2);

  // Waveform posters.
  rect(0x2b1d27, 104, 8, 26, 22);
  rect(0xd9c9a8, 106, 10, 22, 18);
  [3, 7, 11, 5, 9, 12, 6, 3].forEach((h, i) => rect(0x7c3f3a, 108 + i * 2.5, 19 - h / 2, 1.5, h));
  rect(0x2b1d27, 206, 8, 22, 22);
  rect(0x4f7a9d, 208, 10, 18, 18);
  rect(0xe6b34a, 213, 15, 8, 8);
  rect(0x4f7a9d, 215, 17, 4, 4);

  // Furniture shadows.
  rect(0x5f3c26, 26, 84, 70, 4);
  rect(0x5f3c26, 234, 84, 78, 4);
  rect(0x5f3c26, 44, 134, 4, 80);
  rect(0x5f3c26, 288, 134, 4, 80);

  // Rug.
  rect(0x7c3f3a, 100, 120, 136, 92);
  rect(0xc98f4e, 106, 126, 124, 80);
  rect(0x7c3f3a, 112, 132, 112, 68);

  // Computer desk.
  rect(0x5b3a24, 24, 62, 72, 22);
  rect(0x432a1a, 24, 80, 72, 4);
  rect(0x23262f, 44, 40, 32, 22);
  rect(0x6fc3d9, 47, 43, 26, 15);
  rect(0xd6f1f7, 50, 46, 14, 2);
  rect(0xd6f1f7, 50, 50, 18, 2);
  rect(0x23262f, 56, 62, 8, 4);
  rect(0x3a3d48, 42, 70, 36, 6);
  rect(0xe8e2d0, 84, 66, 6, 6);
  rect(0x8a5a3a, 85, 67, 4, 2);

  // Desk lamp.
  rect(0x23262f, 31, 58, 2, 6);
  rect(0x23262f, 27, 64, 10, 2);
  rect(0xe6b34a, 27, 53, 10, 5);

  // Mixing desk with speakers.
  rect(0x5b3a24, 232, 62, 80, 22);
  rect(0x432a1a, 232, 80, 80, 4);
  rect(0x23262f, 234, 38, 14, 24);
  rect(0x23262f, 296, 38, 14, 24);
  rect(0x6c6f7d, 238, 44, 6, 6);
  rect(0x6c6f7d, 300, 44, 6, 6);
  rect(0x3a3d48, 252, 64, 40, 14);
  for (let i = 0; i < 6; i++) {
    rect(0x1c1d24, 256 + i * 6, 66, 2, 10);
    rect(i % 2 ? 0xe6b34a : 0x6fc3d9, 255 + i * 6, 68 + (i * 3) % 7, 4, 2);
  }

  // Mead shelf.
  rect(0x5b3a24, 16, 130, 28, 84);
  [150, 176, 202].forEach((shelfY, row) => {
    rect(0x432a1a, 16, shelfY, 28, 4);
    for (let i = 0; i < 3; i++) {
      rect(row === 1 ? 0xc77d2e : 0xe6a93c, 20 + i * 8, shelfY - 13, 6, 13);
      rect(0xf1e3c6, 22 + i * 8, shelfY - 17, 2, 4);
    }
  });

  // Bookshelf.
  const bookColors = [0x9d4f4a, 0x4f7a9d, 0xd1a24b, 0x5f8f5f, 0x8a6aa8];
  rect(0x5b3a24, 292, 130, 28, 84);
  [150, 176, 202].forEach((shelfY, row) => {
    rect(0x432a1a, 292, shelfY, 28, 4);
    for (let i = 0; i < 6; i++) {
      const height = 13 + ((i + row) % 3) * 2;
      rect(bookColors[(i + row) % bookColors.length], 295 + i * 4, shelfY - height, 3, height);
    }
  });

  // Front door, doormat, and a plant.
  rect(0x5b3a24, 148, 268, 40, 20);
  rect(0x432a1a, 152, 272, 32, 16);
  rect(0xe6b34a, 178, 278, 3, 3);
  rect(0x6e6a4f, 150, 254, 36, 12);
  rect(0x9a5b3d, 288, 244, 18, 18);
  rect(0x4f8a4f, 284, 226, 26, 20);
  rect(0x6aa96a, 291, 218, 12, 12);

  // Brewing jug on the floor.
  rect(0x5f3c26, 22, 258, 22, 4);
  rect(0xc77d2e, 22, 240, 20, 20);
  rect(0xe6a93c, 24, 242, 16, 14);
  rect(0xc9d4d6, 29, 232, 6, 8);
  rect(0x8a5a3a, 30, 228, 4, 4);
}

export function createGame(
  Phaser: PhaserModule,
  parent: HTMLElement,
  callbacks: GameCallbacks
): GameHandle {
  let paused = false;
  let found = new Set<string>();
  let interactNow = () => {};

  class WorkshopScene extends Phaser.Scene {
    private player!: PhaserNamespace.GameObjects.Image;
    private shadow!: PhaserNamespace.GameObjects.Ellipse;
    private highlight!: PhaserNamespace.GameObjects.Graphics;
    private meters!: PhaserNamespace.GameObjects.Graphics;
    private cursorBlink!: PhaserNamespace.GameObjects.Rectangle;
    private keys!: Record<string, PhaserNamespace.Input.Keyboard.Key>;
    private markers = new Map<string, PhaserNamespace.GameObjects.Graphics>();
    private celebrated = new Set<string>();
    private target: { x: number; y: number } | null = null;
    private pendingId: string | null = null;
    private nearId: string | null = null;
    private direction: Direction = "down";
    private walkTime = 0;
    private dustTime = 0;
    private reduceMotion = false;

    create() {
      this.reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      drawRoom(this.add.graphics());
      this.addGlow(32, 58, 30, 0xffc966);
      this.addGlow(168, 36, 36, 0x7f9fd9);
      this.addBubbles();

      this.meters = this.add.graphics();
      this.cursorBlink = this.add.rectangle(66, 51, 3, 2, 0xd6f1f7);
      this.highlight = this.add.graphics();

      (["down", "up", "side"] as Direction[]).forEach((direction) => {
        for (let step = 0; step < 4; step++) {
          const texture = this.textures.createCanvas(`player-${direction}-${step}`, 14, 22);
          drawCharacter(texture!.getContext(), direction, step);
          texture!.refresh();
        }
      });
      this.shadow = this.add.ellipse(168, 193, 14, 6, 0x000000, 0.28);
      this.player = this.add.image(168, 190, "player-down-0").setOrigin(0.5, 0.86);

      OBJECTS.forEach(({ id, area }) => {
        const marker = this.add.graphics();
        marker.fillStyle(0xffe08a);
        marker.fillTriangle(-5, -7, 5, -7, 0, 0);
        marker.setPosition(area.x + area.w / 2, Math.max(area.y - 2, 14));
        marker.setDepth(1000);
        this.markers.set(id, marker);
        if (!this.reduceMotion) {
          this.tweens.add({ targets: marker, y: marker.y - 4, duration: 500, yoyo: true, repeat: -1 });
        }
      });

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
        this.tweens.add({
          targets: bubble,
          y: 243,
          alpha: 0.2,
          duration: 1500 + i * 400,
          delay: i * 500,
          repeat: -1,
        });
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
      for (let i = 0; i < 6; i++) {
        const level = this.reduceMotion ? 4 : 3 + Math.abs(Math.sin(time / (170 + i * 37))) * 7;
        this.meters.fillStyle(i % 2 ? 0xe6b34a : 0x6fc3d9);
        this.meters.fillRect(255 + i * 6, 76 - level, 4, 2);
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
    }

    update(time: number, delta: number) {
      this.drawLiveDetails(time);
      this.markers.forEach((marker, id) => {
        marker.setVisible(!found.has(id));
        if (found.has(id) && !this.celebrated.has(id)) {
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
        this.dustTime += delta;
        if (this.dustTime > 260 && !this.reduceMotion) {
          this.dustTime = 0;
          this.dust();
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
    width: WIDTH,
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
    setFound: (ids) => {
      found = new Set(ids);
    },
    interact: () => interactNow(),
  };
}
