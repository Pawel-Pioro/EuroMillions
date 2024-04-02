import { useState, useEffect, useRef } from 'react'
import axios from 'axios';

function NormalNumberInput({chosenNums, setChosenNums}) {
  const numbers = Array.from({length: 50}, (_, i) => i+1);
  const btnGrid = numbers.map((num) => {

    function searchList(list, item) {
      for (let i = 0; i < list.length; i++) {
          if (list[i] === item) {
              return true; // Item found
          }
      }
      return false; // Item not found
    }

    const isChosen = searchList(chosenNums["normal"], num);
    const bgColor = isChosen ? 'DodgerBlue' : 'white';
    const textColor = isChosen ? 'white' : 'black';
    const borderColor = isChosen ? 'DodgerBlue' : 'black';
    const handleClick = () => {
      if (isChosen) {
        // delete from chosen
        setChosenNums(prevState => ({
          ...chosenNums,
          normal: prevState["normal"].filter((n) => n !== num)
        }));
      } else {
        // add to chosen
        if (chosenNums["normal"].length < 5) {
          setChosenNums(prevState => ({
            ...chosenNums, 
            normal: [...prevState["normal"], num]
          })
          );
        }
      }
    };
    return (
      <div key={num} className="col-1" style={{minWidth: '50px'}}>
        <button id={num} disabled={chosenNums["normal"].length === 5 && !isChosen} chosen={isChosen.toString()} className="btn btn-circle" style={{
          width: '50px',
          minWidth: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: bgColor,
          color: textColor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: `1px solid ${borderColor}`,
          }}
          onClick={handleClick}
        >{num}</button>
      </div>
    );
  });

  const buttons = <div className="row" style={{maxWidth: '800px'}}>{btnGrid}</div>

  return (
    <div className="col-8">
      <h1>Number Input</h1>

      <h3><b>{chosenNums["normal"].length} of 5</b></h3>

      <div className="progress" style={{maxWidth: '800px'}}>
        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: chosenNums["normal"].length/5*100 + '%'}}></div>
      </div>
      {buttons}

    </div>
  )
}

function StarNumberInput({ chosenNums, setChosenNums }) {

  const numbers = Array.from({length: 12}, (_, i) => i+1);
  const btnGrid = numbers.map((num) => {

    function searchList(list, item) {
      for (let i = 0; i < list.length; i++) {
          if (list[i] === item) {
              return true; // Item found
          }
      }
      return false; // Item not found
    }

    const isChosen = searchList(chosenNums["star"], num);
    const bgColor = isChosen ? 'gold' : 'white';
    const textColor = isChosen ? 'black' : 'black';
    const borderColor = isChosen ? 'gold' : 'goldenRod';
    const handleClick = () => {
      if (isChosen) {
        // delete from chosen
        setChosenNums(prevState => ({
          ...chosenNums,
          star: prevState["star"].filter((n) => n !== num)
        }));
      } else {
        // add to chosen
        if (chosenNums["star"].length < 2) {
          setChosenNums(prevState => ({
            ...chosenNums, 
            star: [...prevState["star"], num]
          })
          );
        }
      }
    };
    return (
      <div key={num} className="col-1" style={{minWidth: '50px'}}>
        <button id={num} disabled={chosenNums["star"].length === 2 && !isChosen} chosen={isChosen.toString()} className="btn btn-circle" style={{
          maxWidth: '50px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: bgColor,
          color: textColor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: `1px solid ${borderColor}`,
          }}
          onClick={handleClick}
        >{num}</button>
      </div>
    );
  });

  const buttons = <div className="row g-1" style={{maxWidth: '800px'}}>{btnGrid}</div>

  return (
    <div className='col-4'>
      <h1>Star Number Input</h1>

      <h3><b>{chosenNums["star"].length} of 2</b></h3>

      <div className="progress" >
        <div className="progress-bar progress-bar-striped bg-warning progress-bar-animated" role="progressbar" style={{width: chosenNums["star"].length/2*100 + '%', color: 'black'}}></div>
      </div>
      {buttons}

    </div>
  )
}

function App() {

  const [generatedNumbers, setGeneratedNumbers] = useState({});
  const [chosenNums, setChosenNums] = useState({
    normal: [],
    star: []
  });
  const [result, setResult] = useState({
    normal: 0,
    star: 0,
    showResult: false,
    payout: 0,
    correctNumbers: {
      normal: 0,
      star: 0
    }
  });

  useEffect(() => {
    axios.get('http://localhost:8000/api/generateNumbers')
        .then(response => {
          setGeneratedNumbers( {
            normal: response.data.normalChoice,
            star: response.data.starChoice
          });
          
        })
        .catch(error => {
          console.log(error);
      });

  }, []);

  function returnResult(){
    axios.post('http://localhost:8000/api/returnResult', {
        generatedNumbers: generatedNumbers,
        chosenNumbers: chosenNums
      })
    .then(response => {
      setResult({
        normal: response.data.winningNums.normal,
        star: response.data.winningNums.star,
        payout: response.data.payout,
        showResult: true,
        correctNumbers: {
          normal: response.data.correctNums.normal,
          star: response.data.correctNums.star
        }
      });
    })
    .catch(error => {
      console.log(error);
    });
  }

  return (
    <div className="container">
      <h1>EuroMillions</h1>
      <hr/>
      
      <div className='row'>
      <NormalNumberInput chosenNums={chosenNums} setChosenNums={setChosenNums}/>

      <StarNumberInput chosenNums={chosenNums} setChosenNums={setChosenNums}/>
      </div>

      <button className="btn btn-primary w-100" disabled={chosenNums["normal"].length < 5 || chosenNums["star"].length < 2} onClick={returnResult}>Submit</button>

      {result.showResult &&
        <>
        <h1>Winning Numbers: </h1>
        <h2>Normal Numbers: {
        generatedNumbers.normal.map(number => {

          if (chosenNums["normal"].includes(number)) {
            return <span key={number} style={{color: 'green'}}>{number} </span>;
          } else {
            return <span key={number}>{number} </span>;
          }
        })
        }</h2>
        <h2>Star Numbers: {
        generatedNumbers.star.map(number => {

          if (chosenNums["star"].includes(number)) {
            return <span key={number} style={{color: 'green'}}>{number} </span>;
          } else {
            return <span key={number}>{number} </span>;
          }
        })
        }</h2>

        <h3>You won {result.normal} normal numbers and {result.star} star numbers</h3>
        <h3>Your payout is £{result.payout}</h3>
        </>
      }
    </div>
  )
}

export default App
