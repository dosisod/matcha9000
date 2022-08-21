# Matcha9000

A puzzle game for programmers.

![Screenshot](https://raw.githubusercontent.com/dosisod/matcha9000/testing/img/demo.png)

## How To Play

You move your player around the board using op codes. Click on an op code in the bottom
right, and it will be added to the queue on the left. Different op codes are unlocked at
different levels:

| Op Code    | Level | Description |
|------------|-------|-------------|
| `STEP`     | 1     | Move one square forwards |
| `SLEEP`    | 2     | Do nothing |
| `ROT` `N`  | 3     | Make `N` clock-wise rotations |
| `USE`      | 4     | Use a button |
| `GOTO` `N` | 5     | Goto line `N` |
| `ADD` `N`  | 6     | Add `N` to the accumulator |
| `DEC` `N`  | 7     | Subtract `N` from the accumulator |
| `JIF` `N`  | 8     | Jump to line `N` if the accumulator is zero |

Clicking on the argument (`N`) for an op code allows you to change its value.

## Running

Go to to the [releases](https://github.com/dosisod/matcha9000/releases) page to get the most
recent build. They are available in standalone HTML and native Linux/Windows/MacOS binaries.

Alternatively, you can install from [WAPM](https://wapm.io/):

```
$ wapm install dosisod/matcha9000
```
