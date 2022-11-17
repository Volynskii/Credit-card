import visaType from './visa.svg';
import masterCardType from './mastercard.svg';
import generatedYears from "./helpers/generate-years";
import {useEffect, useState} from "react";

function App() {
  let CARD_NAME = 'ALFACH BANK';
  let CARD_TYPES = {
    VISA: visaType,
    MASTERCARD: masterCardType
  };
  const monthOptions = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  let [activeCardType, setActiveCardType] = useState('');
  const yearOptions = generatedYears(10);

  let [firstInputVal,setFirstInputVal] = useState('');
  let [currentCvv,setCurrentCvv] = useState('')
  useEffect(() => {
    if (firstInputVal.startsWith("4")) {
      setActiveCardType(CARD_TYPES.VISA)
    }
    else if (firstInputVal.startsWith("5")) {
      setActiveCardType(CARD_TYPES.MASTERCARD)
    } else setActiveCardType('')
  },[firstInputVal, CARD_TYPES.MASTERCARD, CARD_TYPES.VISA])

  const [val, setVal] = useState("");

  const handleKeyDown = e => {
    console.log('User pressed: ', e.key);

    const input = e.target
    const key = e.key;
    switch (key) {
      case "ArrowLeft": {
        if (input.selectionStart === 0 && input.selectionEnd === 0) {
          const prev = input.previousElementSibling
          prev.focus()
          prev.selectionStart = prev.value.length - 1
          prev.selectionEnd = prev.value.length - 1
          e.preventDefault()
        }
        break
      }
      case "ArrowRight": {
        if (
            input.selectionStart === input.value.length &&
            input.selectionEnd === input.value.length
        ) {
          const next = input.nextElementSibling
          next.focus()
          next.selectionStart = 1
          next.selectionEnd = 1
          e.preventDefault()
        }
        break
      }
      case "Delete": {
        if (
            input.selectionStart === input.value.length &&
            input.selectionEnd === input.value.length
        ) {
          const next = input.nextElementSibling
          next.value = next.value.substring(1, next.value.length)
          next.focus()
          next.selectionStart = 0
          next.selectionEnd = 0
          e.preventDefault()
        }
        break
      }
      case "Backspace": {
        if (input.selectionStart === 0 && input.selectionEnd === 0) {
          const prev = input.previousElementSibling
          prev.value = prev.value.substring(0, prev.value.length - 1)
          prev.focus()
          prev.selectionStart = prev.value.length
          prev.selectionEnd = prev.value.length
          e.preventDefault()
        }
        break
      }
      default: {
        if (e.ctrlKey || e.altKey) return
        if (key.length > 1) return
        if (key.match(/^[^0-9]$/)) return e.preventDefault()

        e.preventDefault()

        const start = input.selectionStart
        const end = input.selectionEnd
        onInputChange(input, key)

      }
    }
  };

  function onInputChange(input, newValue) {
    const start = input.selectionStart
    const end = input.selectionEnd
    updateInputValue(input, newValue, start, end)
    focusInput(input, newValue.length + start)

  }

  function updateInputValue(input, extraValue, start = 0, end = 0) {
    const newValue = `${input.value.substring(
        0,
        start
    )}${extraValue}${input.value.substring(end, 4)}`
    input.value = newValue.substring(0, 4)
    if (newValue > 4) {
      const next = input.nextElementSibling
      if (next == null) return
      updateInputValue(next, newValue.substring(4))
    }
  }

  function focusInput(input, dataLength) {
    let addedChars = dataLength
    let currentInput = input
    while (addedChars > 4 && currentInput.nextElementSibling != null) {
      addedChars -= 4
      currentInput = currentInput.nextElementSibling
    }
    if (addedChars > 4) addedChars = 4
    if (currentInput.id === '0') setFirstInputVal(currentInput.value)
    currentInput.focus()
    currentInput.selectionStart = addedChars
    currentInput.selectionEnd = addedChars
  }

  const CardHeader = ({brandName, cardType, isReversed}) => {
   return (
       <>
         <div  className={isReversed ? "card-data-row-reverse": "card-data-row"}>
           <div className="brand-name">{brandName}</div>
           {cardType && <img data-logo src={cardType} className="logo" alt="card-type"/>}
         </div>
         </>
   )
  };
  return (
      <>
        <form className="credit-card">
          <div className="front">
            <CardHeader
                brandName={CARD_NAME}
                cardType={activeCardType}
                isReversed={false}
            />
            <fieldset className="form-group">
              <legend>Card Number</legend>
              <label htmlFor="cc-1">Card Number</label>
              <div onKeyDown={handleKeyDown} data-connected-inputs className="cc-inputs horizontal-input-stack">
                <input type="tel" maxLength="4" aria-label="Credit Card First 4 Digits" id="0" required
                       pattern="[0-9]{4}"/>
                <input type="tel" maxLength="4" aria-label="Credit Card Second 4 Digits" id="1" required
                       pattern="[0-9]{4}"/>
                <input type="tel" maxLength="4" aria-label="Credit Card Third 4 Digits" id="2" required
                       pattern="[0-9]{4}"/>
                <input type="tel" maxLength="4" aria-label="Credit Card Last 4 Digits" id="3" required
                       pattern="[0-9]{4}"/>
              </div>
            </fieldset>
            <div className="input-row">
              <div className="form-group name-group">
                <label htmlFor="name">Name</label>
                <input type="text"
                       id="name"
                       value={val}
                       onChange={e => setVal(e.target.value.replace(/[^a-z]/gi, ''))}
                       required/>
              </div>


              <fieldset className="form-group">
                <legend>Expiration</legend>
                <label htmlFor="expiration-month">Expiration</label>
                <div className="horizontal-input-stack">
                  <select id="expiration-month" aria-label="Expiration Month" required>
                    <option>01</option>
                    {monthOptions.map((option) => (
                        <option key={option}>{option}</option>
                    ))}
                  </select>
                  <select id="expiration-year" aria-label="Expiration Year" required data-expiration-year>
                    {yearOptions.map((yearOption) => (
                        <option key={yearOption}>{yearOption}</option>
                    ))}
                  </select>
                </div>
              </fieldset>
            </div>
          </div>
          <div className="back">
            <div className="stripe"/>
            <div className="form-group cvc-group">
              <label htmlFor="cvc">CVV</label>
              <input
                  value={currentCvv}
                  onChange={e => e.target.value.match(/^\d+$/) &&
                      setCurrentCvv(e.target.value)}
                  className="cvc-input" type="tel" maxLength="3" id="cvc" required/>
            </div>
          </div>
        </form>
      </>
  );
}

export default App;
