import * as w4 from "./wasm4";

// Importing from seperate file so that I can ignore TS errors
import { ItemType, Item, LEVELS, outer_walls, Position2 } from "./levels";
import Direction from "./direction";
import * as music from "./music";
import {
  ALL_OP_CODES,
  BOARD_START_X,
  BOARD_START_Y,
  CHAR_HEIGHT,
  CHAR_WIDTH,
  MAX_OP_CODES,
  OpCodeType,
  PLAYER_SPRITE_LEN,
  SCREEN_SIZE,
  TEMPO,
} from "./constants";
import { TICKS } from "./globals";


//
// GLOBALS
//

let CURRENT_LEVEL: u8 = 1;
let IS_READING_INSTRUCTIONS = true;
let IS_IN_ENDGAME_CYCLE = false;

let ANIMATION_TICKS: u64 = 0;

let CPU_QUEUE: OpCode[] = [];
let CURRENT_OP_INDEX: i32 = 0;
let NEXT_OP_INDEX: i32 = 0;
let ACCUMULATOR: i8 = 0;

let IS_LEFT_MOUSE_PRESSED: u8 = 0;
let IS_RIGHT_MOUSE_PRESSED: u8 = 0;
let WAIT_TIL_NEXT_CYCLE = false;

let IS_INT_MENU_OPEN = false;
let INT_MENU_OP_INDEX: i32 = 0;
let INT_MENU_X: i32 = 0;
let INT_MENU_Y: i32 = 0;

let DISK = memory.data<u8>([1, 1]);

class Player {
  x: u8;
  y: u8;
  rot: Direction;
  coins: u8;
};

// NOTE: the plane of movement is in quadrant IV
const PLAYER: Player = {
  x: 0,
  y: 0,
  rot: Direction.EAST,
  coins: 0,
};


//
// SPRITES
//

const letter_exclamation = memory.data<u8>([
  0b010,
  0b010,
  0b010,
  0b000,
  0b010,
]);

const letter_plus = memory.data<u8>([
  0b000,
  0b010,
  0b111,
  0b010,
  0b000,
]);

const letter_minus = memory.data<u8>([
  0b000,
  0b000,
  0b111,
  0b000,
  0b000,
]);

const letter_slash = memory.data<u8>([
  0b001,
  0b010,
  0b010,
  0b010,
  0b100,
]);

const letter_0 = memory.data<u8>([
  0b111,
  0b101,
  0b101,
  0b101,
  0b111,
]);

const letter_1 = memory.data<u8>([
  0b110,
  0b010,
  0b010,
  0b010,
  0b111,
]);

const letter_2 = memory.data<u8>([
  0b111,
  0b001,
  0b111,
  0b100,
  0b111,
]);

const letter_3 = memory.data<u8>([
  0b111,
  0b001,
  0b011,
  0b001,
  0b111,
]);

const letter_4 = memory.data<u8>([
  0b101,
  0b101,
  0b111,
  0b001,
  0b001,
]);

const letter_6 = memory.data<u8>([
  0b111,
  0b100,
  0b111,
  0b101,
  0b111,
]);

const letter_7 = memory.data<u8>([
  0b111,
  0b001,
  0b001,
  0b001,
  0b001,
]);

const letter_8 = memory.data<u8>([
  0b111,
  0b101,
  0b111,
  0b101,
  0b111,
]);

const letter_question = memory.data<u8>([
  0b111,
  0b001,
  0b011,
  0b000,
  0b010,
]);

const letter_colon = memory.data<u8>([
  0b000,
  0b010,
  0b000,
  0b010,
  0b000,
]);

const letter_a = memory.data<u8>([
  0b111,
  0b101,
  0b111,
  0b101,
  0b101,
]);

const letter_b = memory.data<u8>([
  0b110,
  0b101,
  0b111,
  0b101,
  0b110,
]);

const letter_c = memory.data<u8>([
  0b111,
  0b100,
  0b100,
  0b100,
  0b111,
]);

const letter_d = memory.data<u8>([
  0b110,
  0b101,
  0b101,
  0b101,
  0b110,
]);

const letter_f = memory.data<u8>([
  0b111,
  0b100,
  0b110,
  0b100,
  0b100,
]);

const letter_h = memory.data<u8>([
  0b101,
  0b101,
  0b111,
  0b101,
  0b101,
]);

const letter_i = memory.data<u8>([
  0b111,
  0b010,
  0b010,
  0b010,
  0b111,
]);

const letter_k = memory.data<u8>([
  0b101,
  0b101,
  0b110,
  0b101,
  0b101,
]);

const letter_m = memory.data<u8>([
  0b11100,
  0b10111,
  0b10101,
  0b10101,
  0b10101,
]);

const letter_n = memory.data<u8>([
  0b1001,
  0b1101,
  0b1011,
  0b1001,
  0b1001,
]);

const letter_p = memory.data<u8>([
  0b111,
  0b101,
  0b111,
  0b100,
  0b100,
]);

const letter_q = memory.data<u8>([
  0b111,
  0b101,
  0b101,
  0b111,
  0b011,
]);

const letter_u = memory.data<u8>([
  0b101,
  0b101,
  0b101,
  0b101,
  0b111,
]);

const letter_r = memory.data<u8>([
  0b111,
  0b101,
  0b111,
  0b110,
  0b101,
]);

const letter_t = memory.data<u8>([
  0b111,
  0b010,
  0b010,
  0b010,
  0b010,
]);

const letter_v = memory.data<u8>([
  0b101,
  0b101,
  0b101,
  0b101,
  0b010,
]);

const letter_x = memory.data<u8>([
  0b101,
  0b101,
  0b010,
  0b101,
  0b101,
]);

const letter_y = memory.data<u8>([
  0b101,
  0b101,
  0b101,
  0b010,
  0b010,
]);

const letter_z = memory.data<u8>([
  0b111,
  0b001,
  0b010,
  0b100,
  0b111,
]);

const player_sprite = memory.data<u8>([
  0b00000000,
  0b01111110,
  0b01111010,
  0b01111110,
  0b01111110,
  0b01111010,
  0b01111110,
  0b00000000,
]);

const exit_sprite = memory.data<u8>([
  0b11111111,
  0b10000001,
  0b10111101,
  0b10100101,
  0b10100101,
  0b10111101,
  0b10000001,
  0b11111111,
]);

const button_sprite = memory.data<u8>([
  0b00000000,
  0b00000000,
  0b10000000,
  0b10000000,
  0b10000000,
  0b10000000,
  0b00000000,
  0b00000000,
]);

const coin_sprite = memory.data<u8>([
  0b00000000,
  0b00000000,
  0b00000000,
  0b00011000,
  0b00011000,
  0b00000000,
  0b00000000,
  0b00000000,
]);

const coin_sprite_lower = memory.data<u8>([
  0b00000000,
  0b00000000,
  0b00000000,
  0b00000000,
  0b00011000,
  0b00011000,
  0b00000000,
  0b00000000,
]);

const laser_base_sprite = memory.data<u8>([
  0b00000000,
  0b10000000,
  0b10000000,
  0b10000000,
  0b10000000,
  0b10000000,
  0b10000000,
  0b00000000,
]);

const locked_sprite = memory.data<u8>([
  0b10001,
  0b01010,
  0b00100,
  0b01010,
  0b10001,
]);

const wall_sprite = memory.data<u8>([
  0b10_10_10_10, 0b10_10_10_10,
  0b10_01_01_01, 0b01_01_01_00,
  0b10_01_01_01, 0b01_01_01_00,
  0b10_01_01_01, 0b01_01_01_00,
  0b10_01_01_01, 0b01_01_01_00,
  0b10_01_01_01, 0b01_01_01_00,
  0b10_01_01_01, 0b01_01_01_00,
  0b10_00_00_00, 0b00_00_00_00,
]);

const logo_sprite = memory.data<u8>([
  // M     A       T   C       H   A      ' '  9       0   0       0
  0b00000000, 0b00000000, 0b00000000, 0b00000000, 0b00000000, 0b00000000,
  0b01110001, 0b11011101, 0b11010101, 0b11000001, 0b11011101, 0b11011100,
  0b01011101, 0b01001001, 0b00010101, 0b01000001, 0b01010101, 0b01010100,
  0b01010101, 0b11001001, 0b00011101, 0b11000001, 0b11010101, 0b01010100,
  0b01010101, 0b01001001, 0b00010101, 0b01000000, 0b01010101, 0b01010100,
  0b01010101, 0b01001001, 0b11010101, 0b01000001, 0b11011101, 0b11011100,
  0b00000000, 0b00000000, 0b00000000, 0b00000000, 0b00000000, 0b00000000,
]);


//
// GAME LOGIC
//

class OpCode {
  kind: OpCodeType;
  data: u8 = 0;
}

function op_to_string(op: OpCodeType): string {
  switch (op) {
    case OpCodeType.STEP: return "STEP";
    case OpCodeType.GOTO: return "GOTO";
    case OpCodeType.SLEEP: return "SLEEP";
    case OpCodeType.USE: return "USE";
    case OpCodeType.ROT: return "ROT";
    case OpCodeType.ADD: return "ADD";
    case OpCodeType.DEC: return "DEC";
    case OpCodeType.JIF: return "JIF";
    default: return "";
  }
}

function op_get_default_data(op: OpCodeType): u8 {
  switch (op) {
    case OpCodeType.GOTO:
    case OpCodeType.ADD:
    case OpCodeType.DEC:
    case OpCodeType.JIF:
    case OpCodeType.ROT:
      return 1;
    default: return 0;
  }
}

function run(op: OpCode): void {
  if (CURRENT_LEVEL < (LEVELS.length as u8)) {
    const level = LEVELS[CURRENT_LEVEL];

    if (level.update) level.update(level);
  }

  const last_x = PLAYER.x;
  const last_y = PLAYER.y;

  if (op.kind == OpCodeType.STEP) {
    if (PLAYER.rot == Direction.NORTH) PLAYER.y--;
    if (PLAYER.rot == Direction.SOUTH) PLAYER.y++;
    if (PLAYER.rot == Direction.EAST) PLAYER.x++;
    if (PLAYER.rot == Direction.WEST) PLAYER.x--;
  }
  else if (op.kind == OpCodeType.ROT) {
    PLAYER.rot <<= op.data;
    if (PLAYER.rot > Direction.WEST) PLAYER.rot >>= 4;

    music.rotate();
  }
  else if (op.kind == OpCodeType.GOTO) {
    NEXT_OP_INDEX = op.data;
  }
  else if (op.kind == OpCodeType.JIF && ACCUMULATOR == 0) {
    NEXT_OP_INDEX = op.data;
  }
  else if (op.kind == OpCodeType.ADD) {
    ACCUMULATOR += op.data;
  }
  else if (op.kind == OpCodeType.DEC) {
    ACCUMULATOR -= op.data;
  }

  if (ACCUMULATOR < 0) ACCUMULATOR = 0;
  if (ACCUMULATOR > 15) ACCUMULATOR = 15;

  if (CURRENT_LEVEL >= (LEVELS.length as u8)) {
    if (op.kind == OpCodeType.STEP) music.step();
    return;
  }

  const items = LEVELS[CURRENT_LEVEL].items.concat(outer_walls);

  let did_pickup_coin = false;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (!item.disabled && item.pos.x == PLAYER.x && item.pos.y == PLAYER.y) {
      if (item.kind == ItemType.WALL) {
        PLAYER.x = last_x;
        PLAYER.y = last_y;
      }

      // TODO: add "error" noise when USEing on non-useable item
      else if (op.kind == OpCodeType.USE && item.action) {
        item.action!(LEVELS[CURRENT_LEVEL], item);
        music.use_button();
      }

      else if (item.kind == ItemType.COIN) {
        item.disabled = true;
        PLAYER.coins++;
        did_pickup_coin = true;
        music.pickup_coin();
      }
    }
  }

  if (
    !did_pickup_coin &&
    (PLAYER.x != last_x || PLAYER.y != last_y)
  ) {
    music.step();
  }
}

function handle_op_code_click(): void {
  const mouse = load<u8>(w4.MOUSE_BUTTONS);

  for (let i = 0; i < ALL_OP_CODES.length; i++) {
    const pos = calculate_op_code_pos(i);
    const x: i16 = pos.x;
    const y: i16 = pos.y;
    const kind = ALL_OP_CODES[i];

    const len = op_to_string(kind).length;

    if (CPU_QUEUE.length >= MAX_OP_CODES) return;

    if (is_left_click(
      x,
      y,
      x - 1 + (len * (CHAR_WIDTH + 1)),
      y + CHAR_HEIGHT
    )) {
      IS_LEFT_MOUSE_PRESSED = 1;
      CPU_QUEUE.push({ kind, data: op_get_default_data(kind) });
    }
    else if (IS_LEFT_MOUSE_PRESSED && !(mouse & w4.MOUSE_LEFT)) {
      IS_LEFT_MOUSE_PRESSED = 0;
    }
  }
}

function run_game_step(): void {
  if (CURRENT_OP_INDEX >= CPU_QUEUE.length) reset_board();

  else if (CPU_QUEUE.length) {
    run(CPU_QUEUE[CURRENT_OP_INDEX]);
    CURRENT_OP_INDEX++;
  }

  if (!IS_IN_ENDGAME_CYCLE && can_use_exit()) {
    // TODO: play noise here
    CURRENT_LEVEL++;
    save_disk();
    reset_board();
    CPU_QUEUE = [];
    IS_INT_MENU_OPEN = false;
  }
}

function can_use_exit(): boolean {
  return (
    is_exit_open() &&
    PLAYER.x == LEVELS[CURRENT_LEVEL].exit.x &&
    PLAYER.y == LEVELS[CURRENT_LEVEL].exit.y
  );
}

function is_exit_open(): boolean {
  return PLAYER.coins >= LEVELS[CURRENT_LEVEL].max_coins;
}

function reset_board(): void {
  if (CURRENT_LEVEL >= (LEVELS.length as u8)) return;

  TICKS = 0;
  CURRENT_OP_INDEX = 0;
  NEXT_OP_INDEX = 0;
  ACCUMULATOR = 0;

  const level = LEVELS[CURRENT_LEVEL];

  for (let i = 0; i < level.items.length; i++) {
    level.items[i].disabled = false;
  }

  if (level.setup) level.setup!(level);

  PLAYER.x = level.spawn.x;
  PLAYER.y = level.spawn.y;
  PLAYER.rot = level.spawn.rot;
  PLAYER.coins = 0;
}

function is_player_dead(): boolean {
  if (CURRENT_LEVEL >= (LEVELS.length as u8)) return false;

  const lasers = LEVELS[CURRENT_LEVEL].lasers;

  if (!lasers) return false;

  for (let i = 0; i < lasers.length; i += 2) {
    const laser1 = LEVELS[CURRENT_LEVEL].items[lasers[i]];
    const laser2 = LEVELS[CURRENT_LEVEL].items[lasers[i + 1]];

    if (laser1.disabled) continue;

    if (laser1.pos.rot == Direction.EAST) {
      for (let j = laser1.pos.x; j < laser2.pos.x; j++) {
        if (PLAYER.x == j && PLAYER.y == laser1.pos.y) {
          music.sizzle();

          return true;
        }
      }
    }

    if (laser1.pos.rot == Direction.SOUTH) {
      for (let j = laser1.pos.y; j < laser2.pos.y; j++) {
        if (PLAYER.x == laser1.pos.x && PLAYER.y == j) {
          music.sizzle();

          return true;
        }
      }
    }
  }

  return false;
}

function is_left_click(x1: i32, y1: i32, x2: i32, y2: i32): boolean {
  const mouse = load<u8>(w4.MOUSE_BUTTONS);

  return (
    !!(mouse & w4.MOUSE_LEFT) &&
    !IS_LEFT_MOUSE_PRESSED &&
    is_mouse_in_bounds(x1, y1, x2, y2)
  );
}

function is_right_click(x1: i32, y1: i32, x2: i32, y2: i32): boolean {
  const mouse = load<u8>(w4.MOUSE_BUTTONS);

  return (
    !!(mouse & w4.MOUSE_RIGHT) &&
    !IS_RIGHT_MOUSE_PRESSED &&
    is_mouse_in_bounds(x1, y1, x2, y2)
  );
}

function is_mouse_in_bounds(x1: i32, y1: i32, x2: i32, y2: i32): boolean {
  const mouse_x = load<i16>(w4.MOUSE_X);
  const mouse_y = load<i16>(w4.MOUSE_Y);

  return (
    mouse_x >= x1 &&
    mouse_x < x2 &&
    mouse_y >= y1 &&
    mouse_y < y2
  );
}


//
// DRAWING
//

function draw_letter(c: string, x: i32, y: i32): u8 {
  return draw_char(c.charCodeAt(0) as u8, x, y);
}

function draw_char(code: u8, x: i32, y: i32): u8 {
  // ignore space
  if (code == 0x20) return 3;

  const tmp = find_letter(code);
  const letter = tmp.letter;
  const flip_h = tmp.flip_h;
  const flip_v = tmp.flip_v;
  const width = tmp.width;

  if (!letter) return 0;

  let flags = w4.BLIT_1BPP;

  if (flip_v) {
    flags |= 0b10;
    x += 8 - width;
  }

  if (flip_h) flags |= 0b100;

  w4.blit(letter, x - 8 + width, y, 8, 5, flags);

  return width;
}

function draw_string(str: string, x: i32, y: i32): void {
  let wrote = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] == "\n") {
      wrote = 0;
      y += CHAR_HEIGHT + 1;
      continue;
    }

    wrote += draw_letter(str[i], wrote + x, y) + 1;
  }
}

class Letter {
  letter: usize;
  flip_h: boolean = false;
  flip_v: boolean = false;
  width: u8 = 3;
}

function find_letter(c: u8): Letter {
  switch (c) {
    case 0x21: return { letter: letter_exclamation }; // '!'
    case 0x2B: return { letter: letter_plus }; // '+'
    case 0x2D: return { letter: letter_minus }; // '-'
    case 0x2F: return { letter: letter_slash }; // '/'
    case 0x30: // '0'
    case 0x4F: // 'O'
      return { letter: letter_0 };
    case 0x31: return { letter: letter_1 }; // '1'
    case 0x32: return { letter: letter_2 }; // '2'
    case 0x33: return { letter: letter_3 }; // '3'
    case 0x34: return { letter: letter_4 }; // '4'
    case 0x35: // '5'
    case 0x53: // 'S'
      return { letter: letter_2, flip_h: true };
    case 0x36: // '6'
    case 0x47: // 'G'
      return { letter: letter_6 };
    case 0x37: return { letter: letter_7 }; // '7'
    case 0x38: return { letter: letter_8 }; // '8'
    case 0x39: return { letter: letter_6, flip_h: true, flip_v: true }; // '9'
    case 0x3F: return { letter: letter_question }; // '?'
    case 0x45: return { letter: letter_3, flip_v: true } ; // 'E'
    case 0x3A: return { letter: letter_colon }; // ':'
    case 0x41: return { letter: letter_a }; // 'A'
    case 0x42: return { letter: letter_b }; // 'B'
    case 0x43: return { letter: letter_c }; // 'C'
    case 0x44: return { letter: letter_d }; // 'D'
    case 0x46: return { letter: letter_f }; // 'F'
    case 0x48: return { letter: letter_h }; // 'H'
    case 0x49: return { letter: letter_i }; // 'I'
    case 0x4B: return { letter: letter_k }; // 'K'
    case 0x4A: return { letter: letter_7, flip_h: true }; // 'J'
    case 0x4C: return { letter: letter_7, flip_h: true, flip_v: true }; // 'L'
    case 0x4D: return { letter: letter_m, width: 5 }; // 'M'
    case 0x4E: return { letter: letter_n, width: 4 }; // 'N'
    case 0x50: return { letter: letter_p }; // 'P'
    case 0x51: return { letter: letter_q }; // 'Q'
    case 0x52: return { letter: letter_r }; // 'R'
    case 0x54: return { letter: letter_t }; // 'T'
    case 0x55: return { letter: letter_u }; // 'U'
    case 0x56: return { letter: letter_v }; // 'V'
    case 0x57: return { letter: letter_m, flip_h: true, flip_v: true, width: 5 }; // 'W'
    case 0x58: return { letter: letter_x }; // 'X'
    case 0x59: return { letter: letter_y }; // 'Y'
    case 0x5A: return { letter: letter_z }; // 'Z'
    default: return { letter: 0 };
  }
}

// TODO: cleanup this func
function draw_outlines(): void {
  store<u16>(w4.DRAW_COLORS, 0x10);
  w4.rect(0, 0, SCREEN_SIZE, SCREEN_SIZE);

  store<u16>(w4.DRAW_COLORS, 0x02);
  w4.line(0, 0, SCREEN_SIZE - 1, 0);
  w4.line(0, 0, 0, SCREEN_SIZE - 1);

  store<u16>(w4.DRAW_COLORS, 0x04);
  w4.line(SCREEN_SIZE - 1, SCREEN_SIZE - 1, 1, SCREEN_SIZE - 1);
  w4.line(SCREEN_SIZE - 1, SCREEN_SIZE - 1, SCREEN_SIZE - 1, 1);

  store<u16>(w4.DRAW_COLORS, 0x02);
  w4.line(BOARD_START_X, 0, BOARD_START_X, SCREEN_SIZE - 2);

  store<u32>(w4.DRAW_COLORS, 0x04);
  w4.blit(logo_sprite, BOARD_START_X + 1, 1, 48, 7, w4.BLIT_1BPP,);
}

function draw_level(): void {
  store<u16>(w4.DRAW_COLORS, 0x33);
  w4.rect(SCREEN_SIZE - 63, 1, 62, 7);

  store<u16>(w4.DRAW_COLORS, 0x10);
  draw_string(
    PLAYER.coins.toString() + "/" + LEVELS[CURRENT_LEVEL].max_coins.toString(),
    SCREEN_SIZE - CHAR_WIDTH * 17,
    2
  );

  store<u16>(w4.DRAW_COLORS, 0x10);
  draw_string("LEVEL", SCREEN_SIZE - CHAR_WIDTH * 9, 2);
  draw_string(CURRENT_LEVEL.toString(), SCREEN_SIZE - CHAR_WIDTH - 2, 2);
}

function draw_lines(): void {
  const x = 5;
  const y = 17;

  for (let line = 1; line <= MAX_OP_CODES; line++) {
    store<u16>(w4.DRAW_COLORS, 0x20);

    let str = line.toString();
    if (str.length == 1) str = ` ${str}`;

    draw_string(
      str,
      x,
      ((line - 1) * (CHAR_HEIGHT + 2)) + y
    );

    if ((line - 1) >= CPU_QUEUE.length) continue;

    store<u16>(
      w4.DRAW_COLORS,
      CURRENT_OP_INDEX == line ? 0x40 : 0x30
    );

    const op_code = CPU_QUEUE[line - 1];
    const op_str = op_to_string(op_code.kind);

    draw_string(
      op_str,
      x + (CHAR_WIDTH * 4),
      ((line - 1) * (CHAR_HEIGHT + 2)) + y
    );

    if (op_code.data) {
      draw_string(
        op_code.data.toString(),
        x + ((CHAR_WIDTH + 1) * (4 + op_str.length)),
        ((line - 1) * (CHAR_HEIGHT + 2)) + y
      );
    }
  }
}

function handle_line_click(): void {
  const x = 5;
  const y = 17;

  for (let i = 0; i < CPU_QUEUE.length; i++) {
    const op_code = CPU_QUEUE[i];
    const op_str = op_to_string(op_code.kind);

    const startx = x + ((CHAR_WIDTH + 1) * (4 + op_str.length));
    const starty = i * (CHAR_HEIGHT + 2) + y;

    const mouse = load<u8>(w4.MOUSE_BUTTONS);

    if (is_left_click(
      startx,
      starty,
      startx + (op_code.data.toString().length * (CHAR_WIDTH + 1)) - 1,
      starty + CHAR_HEIGHT,
    )) {
      IS_INT_MENU_OPEN = true;
      INT_MENU_OP_INDEX = i;
      INT_MENU_X = startx;
      INT_MENU_Y = starty;
    }
    else if (IS_LEFT_MOUSE_PRESSED && !(mouse & w4.MOUSE_LEFT)) {
      IS_LEFT_MOUSE_PRESSED = 0;
    }

    if (is_right_click(
      x,
      starty,
      startx + (op_code.data.toString().length * (CHAR_WIDTH + 1)) - 1,
      starty + CHAR_HEIGHT,
    )) {
      CPU_QUEUE.splice(i, 1);
      IS_RIGHT_MOUSE_PRESSED = 1;
    }
    else if (IS_RIGHT_MOUSE_PRESSED && !(mouse & w4.MOUSE_RIGHT)) {
      IS_RIGHT_MOUSE_PRESSED = 0;
    }
  }
}

function handle_int_menu_click(): void {
  const mouse = load<u8>(w4.MOUSE_BUTTONS);
  if (!(mouse & w4.MOUSE_LEFT)) {
    IS_LEFT_MOUSE_PRESSED = 0;
  }

  if (!is_left_click(0, 0, SCREEN_SIZE, SCREEN_SIZE)) return;

  const op_code = CPU_QUEUE[INT_MENU_OP_INDEX];

  let tmp: u8 = op_code.data;

  // only process if clicking inside of menu
  if (is_left_click(
      INT_MENU_X - 2,
      INT_MENU_Y - CHAR_HEIGHT - 3,
      INT_MENU_X + 9,
      INT_MENU_Y + 14,
  )) {
    // clicking the "+" button
    if (is_left_click(
        INT_MENU_X - 1,
        INT_MENU_Y - CHAR_HEIGHT - 2,
        INT_MENU_X + 7,
        INT_MENU_Y - 2,
    )) {
      tmp = op_code.data + 1;
      IS_LEFT_MOUSE_PRESSED = 1;
    }
    // clicking the "-" button
    else if (is_left_click(
        INT_MENU_X - 1,
        INT_MENU_Y + CHAR_HEIGHT + 2,
        INT_MENU_X + 7,
        INT_MENU_Y + 13,
    )) {
      tmp = op_code.data - 1;
      IS_LEFT_MOUSE_PRESSED = 1;
    }
  }
  // clicking outside the menu
  else {
    IS_INT_MENU_OPEN = false;
  }

  let max_data_value: u8 = 20;

  if (op_code.kind == OpCodeType.ROT) max_data_value = 3;
  if (op_code.kind == OpCodeType.JIF || op_code.kind == OpCodeType.GOTO) {
   max_data_value = CPU_QUEUE.length as u8;
  }

  if (tmp <= 0) tmp = 1;
  if (tmp > max_data_value) tmp = max_data_value;

  op_code.data = tmp;
}

function draw_op_codes(): void {
  store<u16>(w4.DRAW_COLORS, 0x20);

  for (let i = 0; i < ALL_OP_CODES.length; i++) {
    const pos = calculate_op_code_pos(i);
    draw_string(op_to_string(ALL_OP_CODES[i]), pos.x, pos.y);

    if ((CURRENT_LEVEL == 0) || (i < (CURRENT_LEVEL as i32))) continue;

    // TODO: clean this up
    {
      let x = BOARD_START_X + ((i % 4) * 28);
      let y = BOARD_START_Y + (16 * 8);
      const is_first_row = (i / 4) == 0;
      if (!is_first_row) y += (~~(i / 4) * 11) + 1;

      store<u16>(w4.DRAW_COLORS, 0x22);
      w4.rect(x, y, 27, 11);

      store<u16>(w4.DRAW_COLORS, 0x02);
      w4.line(x, y, x + 27, y);
      w4.line(x, y, x, y + 11);

      store<u16>(w4.DRAW_COLORS, 0x10);
      w4.blit(
        locked_sprite,
        x + 8,
        y + 3,
        8,
        5,
        w4.BLIT_1BPP,
      );
    }
  }
}

function calculate_op_code_pos(i: i32): Position2 {
  let x = BOARD_START_X + ((i % 4) * 28);
  let y = BOARD_START_Y + (16 * 8) + 1;
  const is_first_row = (i / 4) == 0;

  if (!is_first_row) y += 10;

  const str = op_to_string(ALL_OP_CODES[i]);

  let pix = (26 - (str.length * 4)) / 2;

  x += pix + 2;
  y += 3;

  return { x: x as u8, y: y as u8, rot: Direction.NORTH };
}

function draw_board(): void {
  draw_exit();

  store<u16>(w4.DRAW_COLORS, 0x30);
  draw_player();

  store<u32>(w4.DRAW_COLORS, 0x1234);

  const items = LEVELS[CURRENT_LEVEL].items.concat(outer_walls);

  for (let i = 0; i < items.length; i++) {
    draw_item(items[i]);
  }

  const lasers = LEVELS[CURRENT_LEVEL].lasers;
  if (!lasers) return;

  for (let i = 0; i < lasers.length; i += 2) {
    draw_laser(items[lasers[i]], items[lasers[i + 1]]);
  }
}

function draw_laser(laser1: Item, laser2: Item): void {
  store<u16>(w4.DRAW_COLORS, 0x04);

  if (laser1.disabled) return;

  if (laser1.pos.rot == Direction.EAST) {
    w4.rect(
      (BOARD_START_X + laser1.pos.x * 8) + 1,
      (BOARD_START_Y + 4 + laser1.pos.y * 8) - 1,
      ((laser2.pos.x - laser1.pos.x + 1) * 8) - 2,
      2,
    );
  }

  if (laser1.pos.rot == Direction.SOUTH) {
    w4.rect(
      (BOARD_START_X + 4 + laser1.pos.x * 8) - 1,
      (BOARD_START_Y + laser1.pos.y * 8) + 1,
      2,
      ((laser2.pos.y - laser1.pos.y + 1) * 8) - 2,
    );
  }
}

function rotation_to_flag(rot: Direction): i32 {
  let flags = 0;

  if (rot & Direction.NORTH_OR_SOUTH) flags |= w4.BLIT_ROTATE;
  if (rot & Direction.SOUTH_WEST) flags |= w4.BLIT_FLIP_X;

  return flags;
}

function draw_player(): void {
  const flags = w4.BLIT_1BPP | rotation_to_flag(PLAYER.rot);

  draw_board_sprite(player_sprite, PLAYER.x, PLAYER.y, flags);
}

function draw_exit(): void {
  store<u16>(w4.DRAW_COLORS, is_exit_open() ? 0x40 : 0x20);

  draw_board_sprite(
    exit_sprite,
    LEVELS[CURRENT_LEVEL].exit.x,
    LEVELS[CURRENT_LEVEL].exit.y,
    w4.BLIT_1BPP,
  );
}

function draw_item(item: Item): void {
  if (item.disabled && item.kind == ItemType.COIN) return;

  let sprite: usize = 0;
  let flag = w4.BLIT_1BPP;

  if (item.kind == ItemType.BUTTON) {
    store<u16>(w4.DRAW_COLORS, 0x20);
    sprite = button_sprite;
  }
  else if (item.kind == ItemType.COIN) {
    store<u16>(w4.DRAW_COLORS, 0x30);
    sprite = coin_sprite;

    if ((ANIMATION_TICKS + (item.pos.x * 10) + (item.pos.y * 10)) % 80 < 40) {
      sprite = coin_sprite_lower;
    }
  }
  else if (item.kind == ItemType.LASER) {
    store<u16>(w4.DRAW_COLORS, 0x20);
    sprite = laser_base_sprite;
  }
  else if (item.kind == ItemType.WALL) {
    store<u32>(w4.DRAW_COLORS, 0x1234);
    sprite = wall_sprite;
    flag = w4.BLIT_2BPP;
  }
  else return;

  draw_board_sprite(
    sprite,
    item.pos.x,
    item.pos.y,
    flag | rotation_to_flag(item.pos.rot),
  );
}

function draw_board_sprite(sprite: usize, x: i32, y: i32, flags: u32): void {
  w4.blit(
    sprite,
    BOARD_START_X + (x * PLAYER_SPRITE_LEN),
    BOARD_START_Y + (y * PLAYER_SPRITE_LEN),
    PLAYER_SPRITE_LEN,
    PLAYER_SPRITE_LEN,
    flags
  );
}

function draw_accumulator(): void {
  store<u16>(w4.DRAW_COLORS, 0x02);
  w4.rect(0, 0, BOARD_START_X, 9);

  if (CURRENT_LEVEL >= 6) {
    store<u16>(w4.DRAW_COLORS, 0x10);
    draw_string("  ACC: " + ACCUMULATOR.toString(), 5, 2);
  }
  else {
    store<u16>(w4.DRAW_COLORS, 0x10);
    w4.blit(locked_sprite, BOARD_START_X / 2 - 5, 2, 8, 5, w4.BLIT_1BPP);
  }
}


function draw_int_menu(): void {
  if (!IS_INT_MENU_OPEN) return;

  store<u16>(w4.DRAW_COLORS, 0x40);

  w4.rect(
    INT_MENU_X - 2,
    INT_MENU_Y - CHAR_HEIGHT - 3,
    2 * (CHAR_WIDTH + 1) + 3,
    3 * (CHAR_HEIGHT + 1) + 3,
  );

  store<u16>(w4.DRAW_COLORS, 0x44);
  w4.rect(
    INT_MENU_X - 1,
    INT_MENU_Y - CHAR_HEIGHT - 2,
    2 * (CHAR_WIDTH + 1) + 2,
    CHAR_HEIGHT + 1,
  );

  w4.rect(
    INT_MENU_X - 1,
    INT_MENU_Y + CHAR_HEIGHT + 1,
    2 * (CHAR_WIDTH + 1) + 2,
    CHAR_HEIGHT + 1,
  );

  store<u16>(w4.DRAW_COLORS, 0x10);
  draw_string("+", INT_MENU_X + 2, INT_MENU_Y - CHAR_HEIGHT - 2);
  draw_string("-", INT_MENU_X + 2, INT_MENU_Y + CHAR_HEIGHT + 2);
}

function show_instructions(): void {
  // TODO: dedupe this code

  store<u16>(w4.DRAW_COLORS, 0x10);
  w4.rect(0, 0, SCREEN_SIZE, SCREEN_SIZE);

  store<u16>(w4.DRAW_COLORS, 0x02);
  w4.line(0, 0, SCREEN_SIZE - 1, 0);
  w4.line(0, 0, 0, SCREEN_SIZE - 1);

  store<u16>(w4.DRAW_COLORS, 0x04);
  w4.line(SCREEN_SIZE - 1, SCREEN_SIZE - 1, 1, SCREEN_SIZE - 1);
  w4.line(SCREEN_SIZE - 1, SCREEN_SIZE - 1, SCREEN_SIZE - 1, 1);


  store<u16>(w4.DRAW_COLORS, 0x40);
  draw_string("MATCHA 9000", 3, 3);

  store<u16>(w4.DRAW_COLORS, 0x20);
  draw_string(
    "- LEFT CLICK ON AN OP CODE TO ADD IT\n\n" +
    "- RIGHT CLICK TO DELETE IT\n\n" +
    "- CLICK ON ARGUMENT TO CHANGE IT\n\n" +
    "- PRESS Z+X TO FORCE RESTART CART\n\n" +
    "- PRESS R TO RESTART CURRENT LEVEL\n\n\n\n" +
    "         CLICK NEXT TO START",
    3,
    17
  );

  store<u16>(w4.DRAW_COLORS, 0x33);
  w4.rect(
    SCREEN_SIZE - 24,
    SCREEN_SIZE - CHAR_HEIGHT - 8,
    20,
    CHAR_HEIGHT + 4
  );

  if (is_left_click(
    SCREEN_SIZE - 24,
    SCREEN_SIZE - CHAR_HEIGHT - 8,
    SCREEN_SIZE - 4,
    SCREEN_SIZE - CHAR_HEIGHT + 2
  )) {
    IS_READING_INSTRUCTIONS = false;
    IS_LEFT_MOUSE_PRESSED = 1;
    save_disk();
    return;
  }

  store<u16>(w4.DRAW_COLORS, 0x10);
  draw_string("NEXT", SCREEN_SIZE - 22, SCREEN_SIZE - CHAR_HEIGHT - 6);
}

//
// UPDATE/SETUP
//

export function update(): void {
  check_force_reload_cart();

  if (IS_READING_INSTRUCTIONS) {
    show_instructions();
    return;
  }

  draw_accumulator();
  draw_lines();
  draw_int_menu();

  if (CURRENT_LEVEL >= (LEVELS.length as u8)) {
    if (!IS_IN_ENDGAME_CYCLE) {
      IS_IN_ENDGAME_CYCLE = true;
      CURRENT_OP_INDEX = 0;
      CPU_QUEUE = [
        { kind: OpCodeType.ADD, data: 9 },
        { kind: OpCodeType.DEC, data: 1 },
        { kind: OpCodeType.STEP },
        { kind: OpCodeType.JIF, data: 6 },
        { kind: OpCodeType.GOTO, data: 2 },
        { kind: OpCodeType.ROT, data: 2 },
        { kind: OpCodeType.GOTO, data: 1 },
      ];

      PLAYER.x = 2;
      PLAYER.y = 7;
      PLAYER.rot = Direction.EAST;
    }

    store<u16>(w4.DRAW_COLORS, 0x40);
    draw_string("YOU WIN!!!", BOARD_START_X + 35, BOARD_START_Y + 40);

    store<u32>(w4.DRAW_COLORS, 0x1234);

    for (let i = 0; i < outer_walls.length; i++) {
      draw_item(outer_walls[i]);
    }

    store<u16>(w4.DRAW_COLORS, 0x33);
    w4.rect(SCREEN_SIZE - 63, 1, 62, 7);

    store<u16>(w4.DRAW_COLORS, 0x10);
    draw_string("0/0", SCREEN_SIZE - CHAR_WIDTH * 17, 2);

    store<u16>(w4.DRAW_COLORS, 0x10);
    draw_string("LEVEL", SCREEN_SIZE - CHAR_WIDTH * 9, 2);
    draw_string("?", SCREEN_SIZE - CHAR_WIDTH - 2, 2);

    draw_op_codes();
    draw_outlines()

    store<u16>(w4.DRAW_COLORS, 0x30);
    draw_player();

    TICKS++;
    ANIMATION_TICKS++;

    if (TICKS % TEMPO != 0) return;

    if (WAIT_TIL_NEXT_CYCLE) {
      WAIT_TIL_NEXT_CYCLE = false;
      return;
    }

    if (NEXT_OP_INDEX) {
      CURRENT_OP_INDEX = NEXT_OP_INDEX - 1;
      NEXT_OP_INDEX = 0;
    }

    run_game_step();

    return;
  }

  draw_board();
  draw_op_codes();
  draw_outlines()
  draw_level();

  if (IS_INT_MENU_OPEN) {
    handle_int_menu_click();
  } else {
    handle_op_code_click();
    handle_line_click();
  }

  TICKS++;
  ANIMATION_TICKS++;

  if (TICKS % TEMPO != 0) return;

  if (WAIT_TIL_NEXT_CYCLE) {
    WAIT_TIL_NEXT_CYCLE = false;
    reset_board();
    return;
  }

  if (NEXT_OP_INDEX) {
    CURRENT_OP_INDEX = NEXT_OP_INDEX - 1;
    NEXT_OP_INDEX = 0;
  }

  run_game_step();

  if (is_player_dead()) {
    WAIT_TIL_NEXT_CYCLE = true;
  }
}

export function start(): void {
  // https://github.com/morhetz/gruvbox
  store<u32>(w4.PALETTE, 0x282828, 0 * sizeof<u32>());
  store<u32>(w4.PALETTE, 0x665c54, 1 * sizeof<u32>());
  store<u32>(w4.PALETTE, 0xfbf1c7, 2 * sizeof<u32>());
  store<u32>(w4.PALETTE, 0x689d6a, 3 * sizeof<u32>());

  load_disk();
  check_force_reload_cart();

  reset_board();
  CPU_QUEUE = [];
}

function check_force_reload_cart(): void {
  if (load<u8>(w4.GAMEPAD1) & (w4.BUTTON_1 | w4.BUTTON_2)) {
    CURRENT_LEVEL = 1;
    IS_READING_INSTRUCTIONS = true;
    CPU_QUEUE = [];

    save_disk();
  }
}


//
// DISK
//

function save_disk(): void {
  store<u8>(DISK, CURRENT_LEVEL);
  store<u8>(DISK + 1, u8(IS_READING_INSTRUCTIONS));
  w4.diskw(DISK, 2);
}

function load_disk(): void {
  w4.diskr(DISK, 2);
  CURRENT_LEVEL = load<u8>(DISK);
  IS_READING_INSTRUCTIONS = load<u8>(DISK + 1) == 1;
}
