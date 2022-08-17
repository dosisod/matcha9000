enum Direction {
  NORTH = 1,
  EAST = 2,
  SOUTH = 4,
  WEST = 8,

  NORTH_EAST = NORTH | EAST,
  SOUTH_EAST = SOUTH | EAST,
  SOUTH_WEST = SOUTH | WEST,
  NORTH_WEST = NORTH | WEST,

  NORTH_OR_SOUTH = NORTH | SOUTH,
  EAST_OR_WEST = EAST | WEST,
};

export default Direction;
