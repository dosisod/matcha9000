// @ts-nocheck

import * as w4 from "./wasm4";

import Direction from "./direction";
import { BOARD_X_MAX, BOARD_Y_MAX } from "./constants";

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
  items: Item[];
  max_coins: u8 = 0;
  lasers: u8[] | null = null; // EAST/SOUTH laser must be first!
  setup: ((lvl: Level) => void) | null = null;
  data: u8[] | null = null;
};

const LEVEL_DEV: Level = {
  spawn: { x: 2, y: 5, rot: Direction.EAST },
  exit: { x: 9, y: 7 },
  max_coins: 3,
  items: [
    { kind: ItemType.LASER, pos: { x: 1, y: 7, rot: Direction.EAST } },
    { kind: ItemType.LASER, pos: { x: 4, y: 7, rot: Direction.WEST } },
    { kind: ItemType.LASER, pos: { x: 7, y: 1, rot: Direction.SOUTH } },
    { kind: ItemType.LASER, pos: { x: 7, y: 4, rot: Direction.NORTH} },
    { kind: ItemType.WALL, pos: { x: 5, y: 7 } },
    { kind: ItemType.COIN, pos: { x: 6, y: 5 } },
    { kind: ItemType.COIN, pos: { x: 7, y: 5 } },
    { kind: ItemType.COIN, pos: { x: 8, y: 5 } },
    { kind: ItemType.COIN, pos: { x: 6, y: 6 } },
    { kind: ItemType.COIN, pos: { x: 7, y: 6 } },
    { kind: ItemType.COIN, pos: { x: 8, y: 6 } },
    { kind: ItemType.COIN, pos: { x: 6, y: 7 } },
    { kind: ItemType.COIN, pos: { x: 7, y: 7 } },
    { kind: ItemType.COIN, pos: { x: 8, y: 7 } },
    {
      kind: ItemType.BUTTON,
      pos: { x: 1, y: 5, rot: Direction.EAST },
      action: (lvl, item) => {
        lvl.items[0].disabled = !lvl.items[0].disabled;
      }
    },
  ],
  lasers: [
    0, 1,
    2, 3,
  ]
};

LEVEL_DEV.setup = (lvl) => {
  lvl.items[0].disabled = false;
  lvl.items[5].disabled = false;
  lvl.items[6].disabled = false;
  lvl.items[7].disabled = false;
};

const LEVEL_1: Level = {
  spawn: { x: 4, y: 7 },
  exit: { x: 9, y: 7 },
  items: [
    { kind: ItemType.BUTTON, pos: { x: 0, y: 5, rot: Direction.EAST } },
  ],
};

const LEVEL_2: Level = {
  spawn: { x: 4, y: 5 },
  exit: { x: 9, y: 9 },
  items: [],
};

const LEVEL_3: Level = {
  spawn: { x: 4, y: 5 },
  exit: { x: 7, y: 8 },
  items: [
    { kind: ItemType.BUTTON, pos: { x: 0, y: 5, rot: Direction.EAST } },
  ],
};

export const LEVELS: Level[] = [
  LEVEL_DEV,
  LEVEL_1,
  LEVEL_2,
  LEVEL_3,
];
