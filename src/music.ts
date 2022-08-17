import * as w4 from "./wasm4";

export function sizzle(): void {
  w4.tone(
    toneFrequency(650),
    toneDuration(0, 0, 5, 30),
    toneVolume(0, 100),
    toneFlags(3),
  );
}

export function step(): void {
  w4.tone(
    toneFrequency(360, 420),
    toneDuration(0, 0, 15, 10),
    toneVolume(0, 100),
    toneFlags(2),
  );
}

export function rotate(): void {
  w4.tone(
    toneFrequency(360, 560),
    toneDuration(0, 0, 15, 10),
    toneVolume(0, 100),
    toneFlags(2),
  );
}

export function use_button(): void {
  w4.tone(
    toneFrequency(300),
    toneDuration(0, 0, 10, 0),
    toneVolume(0, 100),
    toneFlags(0),
  );
}

export function pickup_coin(): void {
  w4.tone(
    toneFrequency(610, 1000),
    toneDuration(0, 0, 5, 0),
    toneVolume(0, 100),
    toneFlags(0),
  );
}

// stolen from: https://wasm4.org/play/sound-test

export function toneFrequency(freq1: i32 = 0, freq2: i32 = 0): u32 {
  return freq1 | (freq2 << 16);
}

export function toneDuration(attack: i32 = 0, decay: i32 = 0, sustain: i32 = 0, release: i32 = 0): u32 {
  return (attack << 24) | (decay << 16) | sustain | (release << 8);
}

export function toneVolume(peak: i32 = 0, volume: i32 = 0): u32 {
  return (peak << 8) | volume;
}

export function toneFlags(channel: i32 = 0, mode: i32 = 0, pan: i32 = 0): u32 {
  return channel | (mode << 2) | (pan << 4);
}
