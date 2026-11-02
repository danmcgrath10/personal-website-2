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
const SOLIDS: Rect[] = OBJECTS.filter(({ id }) => id !== "door").map(({ area }) => area);

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
    private player!: PhaserNamespace.GameObjects.Graphics;
    private keys!: Record<string, PhaserNamespace.Input.Keyboard.Key>;
    private markers = new Map<string, PhaserNamespace.GameObjects.Graphics>();
    private target: { x: number; y: number } | null = null;
    private pendingId: string | null = null;
    private nearId: string | null = null;

    create() {
      drawRoom(this.add.graphics());

      const shadow = this.add.graphics();
      shadow.fillStyle(0x000000, 0.25);
      shadow.fillEllipse(0, 0, 14, 6);
      this.player = this.add.graphics();
      this.player.fillStyle(0x3b6ea5);
      this.player.fillRect(-5, -12, 10, 12);
      this.player.fillStyle(0x2b3a55);
      this.player.fillRect(-5, -2, 4, 5);
      this.player.fillRect(1, -2, 4, 5);
      this.player.fillStyle(0xe9bd96);
      this.player.fillRect(-5, -22, 10, 10);
      this.player.fillStyle(0x4a2f1d);
      this.player.fillRect(-5, -24, 10, 5);
      this.player.setData("shadow", shadow);
      this.player.setPosition(168, 190);

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      OBJECTS.forEach(({ id, area }) => {
        const marker = this.add.graphics();
        marker.fillStyle(0xffe08a);
        marker.fillTriangle(-5, -7, 5, -7, 0, 0);
        marker.setPosition(area.x + area.w / 2, Math.max(area.y - 2, 14));
        this.markers.set(id, marker);
        if (!reduceMotion) {
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
      });
    }

    update(_time: number, delta: number) {
      this.markers.forEach((marker, id) => marker.setVisible(!found.has(id)));
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
      const shadow = this.player.getData("shadow") as PhaserNamespace.GameObjects.Graphics;
      shadow.setPosition(this.player.x, this.player.y + 3);
      this.player.setDepth(this.player.y);

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
