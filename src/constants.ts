import "./wasm4";

export const MAX_OP_CODES: i32 = 20;
export const TEMPO = 20; // in hertz
export const SCREEN_SIZE = 160;

export const CHAR_WIDTH = 3;
export const CHAR_HEIGHT = 5;

export const BOARD_X_MAX: u8 = 13;
export const BOARD_Y_MAX: u8 = 15;

export enum OpCodeType {
  STEP,
  SLEEP,
  ROT,
  USE,
  GOTO,
  ADD,
  DEC,
  JIF,
};

export const ALL_OP_CODES: OpCodeType[] = [
  OpCodeType.STEP,
  OpCodeType.SLEEP,
  OpCodeType.ROT,
  OpCodeType.USE,
  OpCodeType.GOTO,
  OpCodeType.ADD,
  OpCodeType.DEC,
  OpCodeType.JIF,
];

export const PLAYER_SPRITE_LEN = 8;

export const BOARD_START_X = 48;
export const BOARD_START_Y = 8;
