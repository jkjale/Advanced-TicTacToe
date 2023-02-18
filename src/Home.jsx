import React, { useState, useRef } from 'react';
import Game from './Game.jsx';
import './home.css';

const PAGE = {
  HOME: 0,
  CREATE: 1,
  JOIN: 2,
  BOARD: 3
}

function Home(props) {
  const [page, setPage] = useState(0);
  const newPlayerName = useRef(null);
  const newPlayerId = useRef(null);

  let selectionDiv;
  let gamePrompt;

  function handleOnClickCreateGameButton() {
    setPage(PAGE.CREATE);
  }

  function handleOnClickJoinGameButton() {
    setPage(PAGE.JOIN);
  }

  function handleOnClickSubmitButton() {
    setPage(PAGE.BOARD);
    console.log('newPlayerName: ', newPlayerName.current.value);
    console.log('newPlayerId: ', newPlayerId.current.value);
    if (page === PAGE.CREATE) {
      fetch(`http://localhost:8001/create-game?name=${newPlayerName.current.value}&id=${newPlayerId.current.value}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('jakedataCreate: ', data);
      });
    }
    if (page === PAGE.JOIN) {
      fetch(`http://localhost:8001/join-game?name=${newPlayerName.current.value}&id=${newPlayerId.current.value}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('jakedataJoin: ', data);
      });
    }
  }

  function handleOnClickBackToHomeButton() {
    setPage(PAGE.HOME);
  }

  if (page === PAGE.HOME) {
    selectionDiv = (
    <div id='selections'>
      <button id='createGameButton' onClick={handleOnClickCreateGameButton}>Create New Game</button>
      <button id='joinGameButton' onClick={handleOnClickJoinGameButton}>Join Existing Game</button>
    </div>
    );
    gamePrompt = 'Hello Player, what would you like to do?';
    } 
  
  if (page === PAGE.CREATE || page === PAGE.JOIN) {
    selectionDiv = (
    <div>
      <form>
        <label htmlFor="player-name">Player Name: <input ref={newPlayerName} id='player-name' name='player-name' type="text"/></label>
        <label htmlFor="game-room-name">
          {page === 1 ? 'New Game Room Name: ' : 'Enter existing game ID: '} 
          <input ref={newPlayerId} id='game-room-name' type="text"/>
        </label>
      </form>
      <div id='buttonsDiv'>
        <button id='submitButton' onClick={handleOnClickSubmitButton}>Submit</button>
        <button id='backToHomeButton' onClick={handleOnClickBackToHomeButton}>Back to Home</button>
      </div>
    </div>
    );
    gamePrompt = page === PAGE.CREATE ? 'Create New Game' : 'Join a Game';
  } 

  let homePageDiv = (
    <div>
      <div id='title'>Advanced TicTacToe</div>
      <div id='prompt'>{gamePrompt}</div>
        {selectionDiv}
    </div>
  );

  let updatedDisplayOnPage = homePageDiv;

  if (page === PAGE.BOARD) {
    updatedDisplayOnPage = <Game playerId={newPlayerId.current.value}/>;
  } 

  return (
    updatedDisplayOnPage
  );
}



export default Home;