import React, { useState, useEffect } from 'react';
import './game.css';


function Game(props) {
	// const [state, setState] = useState({
	// 	board: getEmptyBoard(),
	// 	player: 1
	// });

	const [state, setState] = useState(getEmptyBoard());
  // const [myPlayer, setPlayer] = useState(1);

  let myPlayer = 1;

	function updateStateOnClick(prevBoard, playerNum, rowId, colId) {
		let newBoard = [];
		for (let i = 0; i < 3; i++) {
			let rowArr = [];
			for (let j = 0; j < 3; j++) {
				rowArr.push(prevBoard[i][j]);
			}
			newBoard.push(rowArr);
		}
		if (playerNum === 1 && newBoard[rowId][colId] === 0) {
			newBoard[rowId][colId] = 1;
      // setPlayer(2);
			myPlayer = 2;
		}
		if (playerNum === 2 && newBoard[rowId][colId] === 0) {
			newBoard[rowId][colId] = 2;
      // setPlayer(1);
			myPlayer = 1;
		}
		return newBoard;
	}


  function getStateFromServerEverySecond() {
    fetch('http://localhost:8001/get-state')
    .then((response) => response.json())
    .then((data) => {
      setState(data.state);
    });
  }

	useEffect(() => {
		document.addEventListener('click', (pointerEvent) => {
			let tileId = pointerEvent.target.id; // 'tile-0-1'
			console.log('tileId: ', tileId);
			if (tileId.substring(0, 4) === 'tile') {
				let splitted = tileId.split('-');
				let tileCoordinates = [parseInt(splitted[1]), parseInt(splitted[2])];
				console.log('tileCoordinates: ', tileCoordinates);
				console.log('myPlayer: ', myPlayer);
				setState(prevState => {
					let newState = updateStateOnClick(prevState, myPlayer, tileCoordinates[0], tileCoordinates[1]);
					return newState;
				});
        fetch('http://localhost:8001/set-player?row=' + splitted[1] + '&col=' + splitted[2])
        .then((response) => response.json())
        .then((data) => {
          console.log('dataaaaa:', data);
        });
			}

      const interval = setInterval(() => {
        getStateFromServerEverySecond();
      }, 1000);

      // return () => clearInterval(interval)

		})
	}, [])


	// console.log('getWinningTiles: ', getWinningTiles(state));
	// console.log('winningPlayer: ', winningPlayer(state));
	// console.log('strikeName: ', strikeName)

	let winner = winningPlayer(state);
	let strikeName = getStrikeThroughClassName(getWinningTiles(state));
	let onCircleTile;
	let onCrossTile;
	if (winner === 1) {
		onCircleTile = <div className={strikeName}></div>;
	} else if (winner === 2) {
		onCrossTile = <div className={strikeName}></div>;
	}
	let rows = state.map((arr, i) => {
		let rows = [];
		for (let j = 0; j < arr.length; j++){
			rows.push(
				<div className='tile' id={'tile-'+i+'-'+j} key={j}>
					{
						(arr[j] === 1) ? <div className='circle'>{onCircleTile}</div>: (arr[j] === 2) ?  
						<div><div className='cross1'></div><div className='cross2'></div>{onCrossTile}</div> : null
					}
				</div>
			)
		}
		return (
			<div className='row' id={'row-'+i} key={i}>
				{rows}
			</div>
		);
	});

	
	console.log('rendering.g...');
  console.log('local state: ', state);


  
  function handleOnClickState() {
    fetch('http://localhost:8001/get-state')
    .then((response) => response.json())
    .then((data) => {
      setState(data.state);
      let divBoard = document.getElementById('board');
      while (myPlayer !== data.player) {
        divBoard.style.pointerEvents = 'none';
        myPlayer = myPlayer === 1 ? 2 : 1;
      } 
      console.log('server.state: ', data.state);
      console.log('server.player: ', data.player);
      console.log('local.player: ', myPlayer);
    });
  }

  function handleOnClickNewGameButton() {
    fetch('http://localhost:8001/new-game')
    .then((response) => response.json())
    .then((data) => {
      console.log('fdsfas::: ', data);
    });
  }

 
	return (
    <div id='wrapper'>
      <div id='board'>
			  {rows}
      </div>
      <div>{winner !== 0 ? 'Player ' + winner + ' wins!' : null}</div>
      <div id='box' onClick={handleOnClickState} style={{width: '120px', height: '40px', backgroundColor: 'red'}}>Click me!</div>
      <div id='showData'>{state}</div>
      <button onClick={handleOnClickNewGameButton}>new game</button>
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















