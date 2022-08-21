// @ts-nocheck

import * as w4 from "./wasm4";

import Direction from "./direction";
import { BOARD_X_MAX, BOARD_Y_MAX, TEMPO } from "./constants";

import { TICKS } from "./globals";

export enum ItemType {
  BUTTON,
  COIN,
  WALL,
  LASER,
};

export class Position2 {
  x: u8;
  y: u8;
  rot: Direction = Direction.EAST;
};

export const outer_walls: Item[] = [];

for (let x: u8 = 0; x <= BOARD_X_MAX; x++) {
  for (let y: u8 = 0; y <= BOARD_Y_MAX; y++) {
    if (
      ((x == 0) || (x == 13)) ||
      ((y == 0) || (y == 15))
    ) {
      outer_walls.push({
        kind: ItemType.WALL,
        pos: { x, y, rot: Direction.NORTH },
        action: null,
        disabled: false,
      });
    }
  }
}

export class Item {
  kind: ItemType;
  pos: Position2;
  disabled: boolean = false;
  action: ((lvl: Level, item: Item) => void) | null = null;
}

class Level {
  exit: Position2;
  spawn: Position2;
  items: Item[] = [];
  max_coins: u8 = 0;
  lasers: u8[] | null = null; // EAST/SOUTH laser must be first!
  setup: ((lvl: Level) => void) | null = null;
  update: ((lvl: Level) => void) | null = null;
};

const LEVEL_DEV: Level = {
  spawn: { x: 2, y: 5, rot: Direction.EAST },
  exit: { x: 9, y: 7 },
  max_coins: 0,
};

const LEVEL_1: Level = {
  spawn: { x: 4, y: 7 },
  exit: { x: 9, y: 7 },
};

const LEVEL_2: Level = {
  spawn: { x: 2, y: 7 },
  exit: { x: 11, y: 7 },
  items: [
    { kind: ItemType.LASER, pos: { x: 7, y: 1, rot: Direction.SOUTH } },
    { kind: ItemType.LASER, pos: { x: 7, y: 14, rot: Direction.NORTH } },
  ],
  lasers: [
    0, 1
  ],
  update: (lvl) => {
    lvl.items[0].disabled = TICKS >= ((TEMPO * 6) as u64);
  },
};

const LEVEL_3: Level = {
  spawn: { x: 5, y: 5 },
  exit: { x: 8, y: 8 },
  items: [
    { kind: ItemType.BUTTON, pos: { x: 0, y: 5, rot: Direction.EAST } },
  ],
};

const LEVEL_4: Level = {
  spawn: { x: 2, y: 7 },
  exit: { x: 11, y: 7 },
  items: [
    {
      kind: ItemType.BUTTON,
      pos: { x: 1, y: 7, rot: Direction.EAST },
      action: (lvl, item) => {
        lvl.items[1].disabled = true;
      },
    },
    { kind: ItemType.LASER, pos: { x: 7, y: 1, rot: Direction.SOUTH } },
    { kind: ItemType.LASER, pos: { x: 7, y: 14, rot: Direction.NORTH } },
  ],
  lasers: [
    1, 2
  ],
};

function disable(_: Level, item: Item): void {
  item.disabled = true;
}

const LEVEL_5: Level = {
  spawn: { x: 2, y: 3 },
  exit: { x: 2, y: 3 },
  max_coins: 36,
  items: [
    { kind: ItemType.COIN, pos: { x: 3, y: 3 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 4, y: 3 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 5, y: 3 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 6, y: 3 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 7, y: 3 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 8, y: 3 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 9, y: 3 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 10, y: 3 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 11, y: 3 }, action: disable },

    { kind: ItemType.COIN, pos: { x: 11, y: 3 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 11, y: 4 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 11, y: 5 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 11, y: 6 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 11, y: 7 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 11, y: 8 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 11, y: 9 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 11, y: 10 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 11, y: 11 }, action: disable },

    { kind: ItemType.COIN, pos: { x: 2, y: 4 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 2, y: 5 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 2, y: 6 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 2, y: 7 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 2, y: 8 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 2, y: 9 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 2, y: 10 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 2, y: 11 }, action: disable },

    { kind: ItemType.COIN, pos: { x: 2, y: 12 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 3, y: 12 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 4, y: 12 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 5, y: 12 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 6, y: 12 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 7, y: 12 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 8, y: 12 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 9, y: 12 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 10, y: 12 }, action: disable },
    { kind: ItemType.COIN, pos: { x: 11, y: 12 }, action: disable },
  ],
};

const LEVEL_6: Level = {
  spawn: { x: 9, y: 3, rot: Direction.SOUTH },
  exit: { x: 3, y: 3 },
  items: [
    { kind: ItemType.LASER, pos: { x: 1, y: 6, rot: Direction.EAST } },
    { kind: ItemType.LASER, pos: { x: 5, y: 6, rot: Direction.WEST } },

    { kind: ItemType.WALL, pos: { x: 6, y: 1 } },
    { kind: ItemType.WALL, pos: { x: 6, y: 2 } },
    { kind: ItemType.WALL, pos: { x: 6, y: 3 } },
    { kind: ItemType.WALL, pos: { x: 6, y: 4 } },
    { kind: ItemType.WALL, pos: { x: 6, y: 5 } },
    { kind: ItemType.WALL, pos: { x: 6, y: 6 } },

    { kind: ItemType.WALL, pos: { x: 6, y: 9 } },
    { kind: ItemType.BUTTON, pos: { x: 6, y: 8, rot: Direction.NORTH } },
    { kind: ItemType.BUTTON, pos: { x: 5, y: 9, rot: Direction.WEST } },
    {
      kind: ItemType.BUTTON,
      pos: { x: 6, y: 10, rot: Direction.SOUTH },
      action: (lvl, item) => {
        lvl.items[0].disabled = true;
      }
    },
    { kind: ItemType.BUTTON, pos: { x: 7, y: 9, rot: Direction.EAST } },
  ],
  lasers: [
    0, 1,
  ],
};

const LEVEL_7: Level = {
  spawn: { x: 2, y: 3, rot: Direction.SOUTH },
  exit: { x: 10, y: 9 },
  items: [
    { kind: ItemType.LASER, pos: { x: 4, y: 1, rot: Direction.SOUTH } },
    { kind: ItemType.LASER, pos: { x: 4, y: 14, rot: Direction.NORTH } },
    { kind: ItemType.LASER, pos: { x: 6, y: 1, rot: Direction.SOUTH } },
    { kind: ItemType.LASER, pos: { x: 6, y: 14, rot: Direction.NORTH } },
    { kind: ItemType.LASER, pos: { x: 8, y: 1, rot: Direction.SOUTH } },
    { kind: ItemType.LASER, pos: { x: 8, y: 14, rot: Direction.NORTH } },

    { kind: ItemType.BUTTON, pos: { x: 1, y: 5, rot: Direction.EAST },
      action: (lvl, item) => lvl.items[0].disabled = true
    },
    { kind: ItemType.BUTTON, pos: { x: 1, y: 7, rot: Direction.EAST },
      action: (lvl, item) => lvl.items[2].disabled = true
    },
    { kind: ItemType.BUTTON, pos: { x: 1, y: 9, rot: Direction.EAST },
      action: (lvl, item) => lvl.items[4].disabled = true
    },
  ],
  lasers: [
    0, 1,
    2, 3,
    4, 5,
  ],
};

const LEVEL_8: Level = {
  spawn: { x: 10, y: 11, rot: Direction.NORTH },
  exit: { x: 8, y: 11 },
  max_coins: 3,
  items: [
    { kind: ItemType.LASER, pos: { x: 7, y: 8, rot: Direction.EAST } },
    { kind: ItemType.LASER, pos: { x: 12, y: 8, rot: Direction.WEST } },

    { kind: ItemType.LASER, pos: { x: 6, y: 1, rot: Direction.SOUTH } },
    { kind: ItemType.LASER, pos: { x: 6, y: 7, rot: Direction.NORTH } },

    { kind: ItemType.LASER, pos: { x: 1, y: 8, rot: Direction.EAST } },
    { kind: ItemType.LASER, pos: { x: 5, y: 8, rot: Direction.WEST } },

    { kind: ItemType.LASER, pos: { x: 6, y: 9, rot: Direction.SOUTH } },
    { kind: ItemType.LASER, pos: { x: 6, y: 14, rot: Direction.NORTH } },

    { kind: ItemType.WALL, pos: { x: 6, y: 8 } },

    { kind: ItemType.COIN, pos: { x: 10, y: 5 } },
    { kind: ItemType.COIN, pos: { x: 2, y: 5 } },
    { kind: ItemType.COIN, pos: { x: 2, y: 11 } },
  ],
  lasers: [
    0, 1,
    2, 3,
    4, 5,
    6, 7,
  ],
  setup: (lvl) => lvl.items[0].disabled = true,
  update: (lvl) => {
    const tmp = TICKS % (TEMPO * 32) / TEMPO;

    lvl.items[0].disabled = tmp < 8;
    lvl.items[2].disabled = tmp >= 8 && tmp < 16;
    lvl.items[4].disabled = tmp >= 16 && tmp < 24;
    lvl.items[6].disabled = tmp >= 24;
  }
};

let LEVEL_9_BITMASK = 0;

const LEVEL_9: Level = {
  spawn: { x: 2, y: 7, rot: Direction.EAST },
  exit: { x: 11, y: 7 },
  items: [
    { kind: ItemType.LASER, pos: { x: 9, y: 1, rot: Direction.SOUTH } },
    { kind: ItemType.LASER, pos: { x: 9, y: 14, rot: Direction.NORTH } },

    { kind: ItemType.WALL, pos: { x: 4, y: 6 } },
    { kind: ItemType.WALL, pos: { x: 5, y: 6 } },
    { kind: ItemType.WALL, pos: { x: 6, y: 6 } },
    { kind: ItemType.WALL, pos: { x: 7, y: 6 } },

    { kind: ItemType.BUTTON, pos: { x: 4, y: 7, rot: Direction.SOUTH },
      action: (lvl, item) => {
        LEVEL_9_BITMASK |= 0b1000;
        lvl.update!(lvl);
      }
    },
    { kind: ItemType.BUTTON, pos: { x: 5, y: 7, rot: Direction.SOUTH } },
    { kind: ItemType.BUTTON, pos: { x: 6, y: 7, rot: Direction.SOUTH } },
    { kind: ItemType.BUTTON, pos: { x: 7, y: 7, rot: Direction.SOUTH },
      action: (lvl, item) => {
        LEVEL_9_BITMASK |= 0b0001;
        lvl.update!(lvl);
      }
    },
  ],
  lasers: [
    0, 1
  ],
  setup: (lvl) => LEVEL_9_BITMASK = 0,
  update: (lvl) => {
    if (LEVEL_9_BITMASK == 0b1001) {
      lvl.items[0].disabled = true;
    }
  }
};

export const LEVELS: Level[] = [
  LEVEL_DEV,
  LEVEL_1,
  LEVEL_2,
  LEVEL_3,
  LEVEL_4,
  LEVEL_5,
  LEVEL_6,
  LEVEL_7,
  LEVEL_8,
  LEVEL_9,
];
