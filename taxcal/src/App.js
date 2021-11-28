import { useState } from 'react';
import Axios from 'axios';
import Popup from 'reactjs-popup';
import './App.css';

function App() {
  const[basic, setBasic] = useState(0)
  const[lta, setLta] = useState(0)
  const[hra, setHra] = useState(0)
  const[food, setFood] = useState(0)
  const[inv80C, setInv80c] = useState(0)
  const[medi, setMedi] = useState(0)
  const[rent, setRent] = useState(0)
  const[city, setCity] = useState('')
  const[appliHra, setAppliHra] = useState(0)
  const[tax, setTax] = useState(0)
  const[isFormSubmitted, setIsFormSubmitted] = useState(false)


  const calculateAppHraNonMetro = () =>  {
    let appHra = hra
    if (appHra > (basic * (50/100))){
      appHra= basic * (50/100)
      console.log(appHra)
    } else if (appHra > (rent * (10/100))){
      appHra=rent * (10/100)
      console.log(appHra)
      
    }
    console.log(appHra)
    setAppliHra(appHra)
  };

    const calculateAppHraMetro = () =>  {
    let appHra = hra
    if (appHra > (basic * (40/100))){
      appHra= basic * (40/100)
    } else if (appHra > (rent * (10/100))){
      appHra=rent * (10/100)
    }
    setAppliHra(appHra)
    console.log(appHra)
  };

  const taxableIncomeCalulation = async () => {
    let taxInc;
    if (city === 'Metro City'){
     await calculateAppHraMetro()
    } else{
      await calculateAppHraNonMetro()
    }
    taxInc = basic+ lta + hra + food - (appliHra + inv80C + medi)

    setTax(taxInc)
    console.log(taxInc)
  }

  const cityTypeSelect = (event) => {
    setCity(event.target.value)
    taxableIncomeCalulation()
  }
 
  const onSubmitSuccess = () => {
    console.log('post started')
    Axios.post("https://backend-tax.herokuapp.com/details", {
      basic: basic,
      lta: lta,
      hra: hra,
      food: food,
      inv80C: inv80C,
      medi: medi,
      rent: rent,
      city: city
    }).then(() => {
      console.log('success')
    });

    setIsFormSubmitted(true)
  };


  return (
    <div className="App">
      <h1 className="heading">Taxable Income Calculator</h1>
      <form className="card-div">
      <div>
      <p className="sub-heading">Salary Information</p>
      <div className="top-input-div">
        <label htmlFor="basic">Basic</label>
        <input id="basic" type="number" placeholder="Enter Amount" onChange={(event) => setBasic(event.target.valueAsNumber)} />
        <label>LTA</label>
        <input type="number" placeholder="Enter Amount" onChange={(event) => setLta(event.target.valueAsNumber)} />
        <label>HRA</label>
        <input type="number" placeholder="Enter Amount" onChange={(event) => setHra(event.target.valueAsNumber)} />
        <label>Food Allowance</label>
        <input type="number" placeholder="Enter Amount" onChange={(event) => setFood(event.target.valueAsNumber)} />
      </div>
      </div>
      <div>
      
      <p className="sub-heading">Expenditure Information</p>
      <div className="top-input-div">
        <label>Investments under Section 80C</label>
        <input type="number" placeholder="Enter Amount" onChange={(event) => setInv80c(event.target.valueAsNumber)} />
        <label>Actual Rent paid</label>
        <input type="number" placeholder="Enter Amount" onChange={(event) => setRent(event.target.valueAsNumber)} />
        <label>Medical Premium Paid</label>
        <input type="number" placeholder="Enter Amount" onChange={(event) => setMedi(event.target.valueAsNumber)} />
        <label>City type</label>
        <select value={city} className="city-select" onChange={cityTypeSelect}>
          <option value="Metro City" >Metro City</option>
          <option value="Non-Metro City">Non-Metro City</option>
        </select>
      </div>
      </div>
      </form>
      
        <Popup
                  modal
                  trigger={
                    <button type="button"  className="submit-button">Submit</button>
                  }
                  className="popup-content"
                >
                  {close => (
                    <div className="modal-container">
                      <div className="align-column">
                        {isFormSubmitted ? (<p className="modal-desc">Successfully Submitted</p>) :(<p className="modal-desc">Taxable Income is : {tax}</p>)}
                        <div className="align-row">
                          <button
                            type="button"
                            className={isFormSubmitted ?   "close-button-none" : "cancel-button"}
                            onClick={() => close()}
                          >
                            Cancel
                          </button>

                          <button type="button" className={isFormSubmitted ? "close-button" : "close-button-none"} onClick={() => close()}>close</button>

                          <button type="button" className={isFormSubmitted ?  "close-button-none" : "confirm-button" } onClick={onSubmitSuccess} >
                            Confirm
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Popup>
                
      
    </div>
  );
}

export default App;
