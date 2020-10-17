import React from 'react';
import ReactDOM from 'react-dom';
import cx from "classnames"
import './index.css';

import img_x from './img_x.png'
import img_o from './img_o.png'

function Square(props) {
	
	const squareCX = cx("square", {
		'light-square': props.light,
	})
	
    return (
      <button 
		className={squareCX} 
		onClick={props.onClick}>
			{props.value ? 
		<img 
			src={props.value==='X' ? img_x : img_o} 
			alt={props.value==='X' ? 'X' : 'O'} 
			width={"100px"} height={"100px"} 
			//style={{border: '5px solid black'}}
			/> : ' '}
	  </button>
    );
}

class Board extends React.Component {
  
  renderSquare(i) {
    return <Square 
	  value={this.props.squares[i]} 
	  light={this.props.lightSquares.includes(i)}
	  onClick={() => this.props.onClick(i)}
	/>;
  }
  
  render() {
	let board;
	let arr = [];
	for(let i = 0; i<3; i++){
		arr[i] = []
		for(let j = 0; j<3; j++)
			arr[i][j] = this.renderSquare(3*i + j)
	}
	board = arr.map( (row) => (<div className="board-row"> {row} </div>) )
	return (<div className="board">{board}</div>);
  }
}

const Switch = ({ rounded = false, isToggled, onToggle })  => {
	
	const sliderCX = cx("slider", {
		rounded: rounded
	})
	
	return (
		<label className="switch">
			<input type="checkbox" checked={isToggled} onChange={onToggle} />
			<span className={sliderCX} />
		</label>
	);
};

const DescSwitch = ({ rounded = false, isToggled, onToggle, desc })  => {
	
	return (
		<div className="desc-switch">
			<span>{desc}</span>
			<Switch 
				rounded={rounded}
				isToggled={isToggled}
				onToggle={onToggle}
			/>
		</div>
	);
};

class Game extends React.Component {
	constructor(props) {
		super(props);
		const xFirst = (Math.random() > 0.5) ? 1 : 0;
		this.state = {
			stepNumber: 0,
			history: [{
				move: '',
				squares: Array(9).fill(null),
			}],
			xIsFirst: xFirst,
			xIsNext: xFirst,
			sortAsc: true,
		};
	}
	
	handleClick(i) { 
	const history = this.state.history.slice(0, this.state.stepNumber + 1)
	const current = history[history.length - 1]
	  const squares = current.squares.slice();
	  if(calculateWinner(squares) || squares[i])
		return;
	  squares[i] = this.state.xIsNext ? 'X' : 'O';
	  this.setState({
		  stepNumber: history.length,
		  history: history.concat([{
			  move: '(' + (i%3 + 1) + ',' + Math.floor(i/3 + 1) + ')',
			  squares: squares,
			}]), 
		  xIsNext: !this.state.xIsNext,
	  });
  }
  
  jumpTo(step) {
	  this.setState({
		  stepNumber: step,
		  xIsNext: (step % 2) !== this.state.xIsFirst,
	  })
  }
  
  render() {
	  const history = this.state.history;
	  const current = history[this.state.stepNumber]
	  const calcWin = calculateWinner(current.squares)
	  const winner = calcWin ? calcWin[0] : null
	  const lightSquares = calcWin ? calcWin.slice(1,4) : []
	  const moves = history.map((step, move) => {
		  let desc = move ?
			'Przejdź do ruchu #' + move + ' ' + step.move : 
			'Przejdź na początek';
		  if( move === this.state.stepNumber )
			desc = (<b>{desc}</b>)
		  return (
			<li key={move}>
				<button className="moveBtn" onClick={() => this.jumpTo(move)}>{desc}</button>
			</li>
		  );
	  });
	  if(this.state.sortAsc)
		moves.reverse()
	  let status;
	if(winner){
		status = (
			<div>{'Wygrywa: '} 
				<img 
					src={winner==='X' ? img_x : img_o} 
					alt={winner==='X' ? 'X' : 'O'} 
					width={"100px"} height={"100px"}
				/>
			</div>
			
		);
	} else {
		if( this.state.stepNumber === 9 )
			status = 'Remis'
		else
	status = (
	<div>{'Następny gracz: '} 
		<img 
			src={this.state.xIsNext ? img_x : img_o} 
			alt={this.state.xIsNext ? 'X' : 'O'} 
			width={"100px"} height={"100px"} 
			//style={{border: '5px solid black'}}
		/>
	</div>);
	}
	
    return (
		  <div className="game">
			<h1>{"Tic Tac Toe"}</h1>
			
			<div className="game-board">
			  <Board 
				squares={current.squares}
				lightSquares={lightSquares}
				onClick={(i) => this.handleClick(i)}
			  />
			</div>
			
			<div className="game-info">
			  <div>{status}</div>
			  <ol>{moves}</ol>
			  
				<DescSwitch 
					desc={"Odwrócona kolejność"}
					rounded={true}
					isToggled={this.state.sortAsc} 
					onToggle={ () => this.setState({sortAsc: !this.state.sortAsc}) } />
			  
			</div>
			
			<div style={{clear: "both"}}></div>
			
		  </div>
    );
  }
}

function calculateWinner(squares){
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i< lines.length; i++){
		const [a, b, c] = lines[i];
		if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
			return [squares[a], a, b, c]
	}
	return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
