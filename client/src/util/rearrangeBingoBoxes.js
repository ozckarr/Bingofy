function rearrangeBingoBoxes(bingoBoxes) {
  // temp...
  const playersOrder = [
    1,
    24,
    2,
    23,
    3,
    22,
    4,
    21,
    5,
    20,
    6,
    19,
    7,
    18,
    8,
    17,
    9,
    16,
    10,
    15,
    11,
    14,
    12,
    13,
    0,
  ];
  let newBoxOrder = new Array(25).fill({});
  for (let i = 0; i < playersOrder.length; i++) {
    newBoxOrder[i] = bingoBoxes[playersOrder[i]];
  }
  return newBoxOrder;
}

export default rearrangeBingoBoxes;
