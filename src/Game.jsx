import React, { useState, useReducer } from 'react';
import './game.css';

function boardReducerFunction(state, action) {
  switch (action.type) {
    case 'clicked_tile' :  {
      return {
        board: state.board = getEmptyBoard() /*do something with board */
      };
    }
  }
  throw Error('Unknown action: ', action.type);
}

function Game(props) {
	// const [board, setBoard] = useState(getEmptyBoard());
  const [boardState, dispatchFunction] = useReducer(boardReducerFunction, {board: getEmptyBoard()});

  function handleClickOnTile() {
    dispatchFunction({
      type: 'clicked_tile'
    });
  }

  const [clickable, setClickable] = useState(true);

	let winner = winningPlayer(board);
	let strikeName = getStrikeThroughClassName(getWinningTiles(board));
  let strikeThroughOnCircleTile;
	let strikeThroughOnCrossTile;
	if (winner === 1) {
		strikeThroughOnCircleTile = <div className={strikeName}></div>;
	} else if (winner === 2) {
		strikeThroughOnCrossTile = <div className={strikeName}></div>;
	}

  
  

  
	let rows = board.map((arr, i) => {
		let columns = [];
		for (let j = 0; j < arr.length; j++){
			columns.push(
				<div className='tile' id={`tile-${i}-${j}`} key={j} onClick={(event) => {
          let parsedIdArr = event.target.id.split('-');
          let rowId = parseInt(parsedIdArr[1]);
          let colId = parseInt(parsedIdArr[2]);

          if (clickable) {
            setBoard((prevBoard) => {
              let newBoard = getEmptyBoard();
              for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                  newBoard[i][j] = prevBoard[i][j];
                }
              }
              newBoard[rowId][colId] = 1;
              return newBoard;
            });
            fetch(`http://localhost:8001/set-player?row=${rowId}&col=${colId}&id=${props.playerId}`);
            setClickable(false);
          }
          console.log('clickable: ', clickable);

          const intervalId = setInterval(() => {
            fetch(`http://localhost:8001/get-state?id=${props.playerId}`)
            .then((response) => response.json())
            .then((data) => {
              console.log('data: ', data);
              if (data.player === 1) {
                // make it clickable
                setClickable(true);

                // update board
                setBoard((prevBoard) => {
                  let newState = getEmptyBoard();
                  for (let i = 0; i < data.state.length; i++) {
                    for (let j = 0; j < data.state[i].length; j++) {
                      newState[i][j] = data.state[i][j];
                    }
                  }
                  return newState;
                });
                clearInterval(intervalId);
              }
            })
          }, 1000)
        }}>
					{
						(arr[j] === 1) ? <div className='circle'>{strikeThroughOnCircleTile}</div> : 
            (arr[j] === 2) ? <div><div className='cross1'></div><div className='cross2'></div>{strikeThroughOnCrossTile}</div> : null
					}
				</div>
			)
		}
		return (
			<div className='row' id={`row-${i}`} key={i}>
				{columns}
			</div>
		);
	});

 

  console.log('props.playerId: ', props.playerId);

	return (
    <div id='wrapper' myId>
      <div id='board'>
			  {rows}
      </div>
      <div>{winner !== 0 ? 'Player ' + winner + ' wins!' : null}</div>
      <div id='box' style={{width: '120px', height: '40px', backgroundColor: 'red'}}>Click me!</div>
      <div id='showData'>{board}</div>
    </div>
	);
}





// this returns [[x,x], [x,x], [x,x]]
function getWinningTiles(state) {
	let arr = [];
  // check ROW
  if ((state[0][0] === state[0][1]) || (state[1][0] === state[1][1]) || (state[2][0] === state[2][1])) {
    for (let i = 0; i < state.length; i++) {
      let savedOfOnes = [];
      let savedOfTwos = [];
      for (let j = 0; j < state[i].length; j++) {
        if (state[i][j] === 1) {
          savedOfOnes.push([i, j]);
        }
        if (state[i][j] === 2) {
          savedOfTwos.push([i, j]);
        }
      }
      if (savedOfOnes.length === 3) {
        for (let k = 0; k < savedOfOnes.length; k++) {
          arr.push(savedOfOnes[k]);
        }
      }
      if (savedOfTwos.length === 3) {
        for (let l = 0; l < savedOfTwos.length; l++) {
          arr.push(savedOfTwos[l]);
        }
      }
    }
  }
  // check COLUMN
  if ((state[0][0] === state[1][0]) || (state[0][1] === state[1][1]) || (state[0][2] === state[1][2])) {
    for (let i = 0; i < state.length; i++) {
      let savedOfOnes = [];
      let savedOfTwos = [];
      for (let j = 0; j < state[i].length; j++) {
        if (state[j][i] === 1) {
          savedOfOnes.push([j, i]);
        }
        if (state[j][i] === 2) {
          savedOfTwos.push([j, i]);
        }
      }
      if (savedOfOnes.length === 3) {
        for (let k = 0; k < savedOfOnes.length; k++) {
          arr.push(savedOfOnes[k]);
        }
      }
      if (savedOfTwos.length === 3) {
        for (let l = 0; l < savedOfTwos.length; l++) {
          arr.push(savedOfTwos[l]);
        }
      }
    }
  }
	// check LEFT-DIAGONAL
	if (state[0][0] === state[1][1]) {
		let savedOfOnes = [];
		let savedOfTwos = [];
		for (let i = 0; i < state.length; i++) {
			if (state[i][i] === 1) {
				savedOfOnes.push([i, i]);
			}
			if (state[i][i] === 2) {
				savedOfTwos.push([i, i]);
			}
		}
		if (savedOfOnes.length === 3) {
			for (let k = 0; k < savedOfOnes.length; k++) {
				arr.push(savedOfOnes[k]);
			}
		}
		if (savedOfTwos.length === 3) {
			for (let l = 0; l < savedOfTwos.length; l++) {
				arr.push(savedOfTwos[l]);
			}
		}
  }
	// check RIGHT-DIAGONAL
  if (state[0][2] === state[1][1]) {
    const rowOfLeftToRight = 0;
    const columnOfLeftToRight = 2;
    let savedOfOnes = [];
    let savedOfTwos = [];
    for (let i = 0; i < state.length; i++) {
      if (state[rowOfLeftToRight + i][columnOfLeftToRight - i] === 1) {
        savedOfOnes.push([rowOfLeftToRight + i, columnOfLeftToRight - i]);
      }
      if (state[rowOfLeftToRight + i][columnOfLeftToRight - i] === 2) {
        savedOfTwos.push([rowOfLeftToRight + i, columnOfLeftToRight - i]);
      }
    }
    if (savedOfOnes.length === 3) {
      for (let k = 0; k < savedOfOnes.length; k++) {
        arr.push(savedOfOnes[k]);
      }
    }
    if (savedOfTwos.length === 3) {
      for (let l = 0; l < savedOfTwos.length; l++) {
        arr.push(savedOfTwos[l]);
      }
    }
  }
	return arr;
}



function getStrikeThroughClassName(winningTilesArray) {
  let rowCounter = 0;
  let columnCounter = 0;
  let leftDiagonalCounter = 0;
  let rightDiagonalCounter = 0;
  for (let i = 0; i < winningTilesArray.length; i++) {
    let rowNum = winningTilesArray[0][0]; // 0
    let columnNum = winningTilesArray[0][1];
    let diffOfCoordinateNumbers = Math.abs(winningTilesArray[0][0] - winningTilesArray[0][1]);
    let sumOfCoordinateNumbers = winningTilesArray[0][0] + winningTilesArray[0][1];
    // check row
    // [[0, 0], [0, 1], [0, 2]]
    if (winningTilesArray[i][0] === rowNum) {
      rowCounter++;
    }
    // check column
    // [[0, 0], [1, 0], [2, 0]]
    if (winningTilesArray[i][1] === columnNum) {
      columnCounter++;
    }
    // check left diagonal
    // [[0, 0], [1, 1], [2, 2]]
    if (Math.abs(winningTilesArray[i][0] - winningTilesArray[i][1]) === diffOfCoordinateNumbers) {
      leftDiagonalCounter++;
    }
    // check right diagonal
    // [[0, 2], [1, 1], [2, 0]]
    if (winningTilesArray[i][0] + winningTilesArray[i][1] === sumOfCoordinateNumbers) {
      rightDiagonalCounter++;
    }
  }
  if (rowCounter === 3) {
    return 'strikeRow';
  } else if (columnCounter === 3) {
    return 'strikeColumn';
  } else if (leftDiagonalCounter === 3) {
    return 'strikeLeftDiagonal';
  } else if (rightDiagonalCounter === 3) {
    return 'strikeRightDiagonal';
  }
}





function checkWhichPlayerOwnsARow(state) {
  for (let i = 0; i < state.length; i++) {
    let playerOneRowCounter = 0;
    let playerTwoRowCounter = 0;
    for (let j = 0; j < state.length; j++) {
      if (state[i][j] === 1) {
        playerOneRowCounter++;
      } else if (state[i][j] === 2) {
        playerTwoRowCounter++;
      }
    }
    if (playerOneRowCounter === 3) {
      return 1;
    }
    if (playerTwoRowCounter === 3) {
      return 2;
    }
  }
  return 0;
}

function checkWhichPlayerOwnsAColumn(state) {
  for (let i = 0; i < state.length; i++) {
    let playerOneColumnCounter = 0;
    let playerTwoColumnCounter = 0;
    for (let j = 0; j < state.length; j++) {
      if (state[j][i] === 1) {
        playerOneColumnCounter++;
      } else if (state[j][i] === 2) {
        playerTwoColumnCounter++;
      }
    }
    if (playerOneColumnCounter === 3) {
      return 1;
    }
    if (playerTwoColumnCounter === 3) {
      return 2;
    }
  }
  return 0;
}

function checkWhichPlayerOwnsADiagonal(state) {
  let playerOneLeftDiagonalCounter = 0;
  let playerTwoLeftDiagonalCounter = 0;
  let playerOneRightDiagonalCounter = 0;
  let playerTwoRightDiagonalCounter = 0;
  // This loop takes care of the left diagonal case
  for (let i = 0; i < state.length; i++) {
    if (state[i][i] === 1) {
      playerOneLeftDiagonalCounter++;
    } else if (state[i][i] === 2) {
      playerTwoLeftDiagonalCounter++;
    }
  }
  const rowOfRightToLeft = 0;
  const columnOfRightToLeft = 2;
  // This loop takes care of the right diagonal case
  for (let i = 0; i < state.length; i++) {
    if (state[rowOfRightToLeft + i][columnOfRightToLeft - i] === 1) {
      playerOneRightDiagonalCounter++;
    } else if (state[rowOfRightToLeft + i][columnOfRightToLeft - i] === 2) {
      playerTwoRightDiagonalCounter++;
    }
  }
  if (playerOneLeftDiagonalCounter === 3 || playerOneRightDiagonalCounter === 3) {
    return 1;
  }
  if (playerTwoLeftDiagonalCounter === 3 || playerTwoRightDiagonalCounter === 3) {
    return 2;
  }
  return 0;
}

function winningPlayer(state) {
  let rowPlayer = checkWhichPlayerOwnsARow(state);
  let colPlayer = checkWhichPlayerOwnsAColumn(state);
  let diagPlayer = checkWhichPlayerOwnsADiagonal(state);
  if (rowPlayer !== 0) {
    return rowPlayer;
  }
  if (colPlayer !== 0) {
    return colPlayer;
  }
  return diagPlayer;
}




function getEmptyBoard() {
	const tiles = [];
	for (let i = 0; i < 3; i++) {
		const row = [];
		for (let j = 0; j < 3; j++) {
			row.push(0);
		}
		tiles.push(row);
	}
	return tiles;
}

export default Game;















