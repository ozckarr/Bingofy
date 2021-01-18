function rearrangeBingoBoxes(bingoBoxes, playerInfo) {
  let mergedList = [];

  // Merges all data
  for (let i = 0; i < playerInfo.boxOrder.length; i++) {
    mergedList.push({
      ...playerInfo.boxOrder[i],
      title: bingoBoxes[i].title,
      summery: bingoBoxes[i].summery,
    });
  }

  // Takes the order for the rearrangement
  let playersOrder = [];
  for (let i = 0; i < playerInfo.boxOrder.length; i++) {
    playersOrder.push(playerInfo.boxOrder[i].placement);
  }

  let newBoxOrder = new Array(25).fill({});
  for (let i = 0; i < playersOrder.length; i++) {
    newBoxOrder[i] = mergedList[playersOrder[i]];
  }

  return newBoxOrder;
}

export default rearrangeBingoBoxes;
