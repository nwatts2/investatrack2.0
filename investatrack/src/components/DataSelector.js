import '../css/DataSelector.css'

const DataSelector = ({ dataSelect, setDataSelect }) => {
    function toggleData (type) {
        if (dataSelect[type]) {
            if (type === 'Open') {
                if (!(!dataSelect.Close && !dataSelect.High && !dataSelect.Low)) {
                    setDataSelect((prev) => {return {...prev, Open: false}})
                }
            }
            else if (type === 'Close') {
                if (!(!dataSelect.Open && !dataSelect.High && !dataSelect.Low)) {
                    setDataSelect((prev) => {return {...prev, Close: false}})
                }
            }
            else if (type === 'High') {
                if (!(!dataSelect.Close && !dataSelect.Open && !dataSelect.Low)) {
                    setDataSelect((prev) => {return {...prev, High: false}})
                }
            }
            else if (type === 'Low') {
                if (!(!dataSelect.Close && !dataSelect.High && !dataSelect.Open)) {
                    setDataSelect((prev) => {return {...prev, Low: false}})
                }
            }            
        } else {
            if (type === 'Open') {setDataSelect((prev) => {return {...prev, Open: true}})}
            else if (type === 'Close') {setDataSelect((prev) => {return {...prev, Close: true}})}
            else if (type === 'High') {setDataSelect((prev) => {return {...prev, High: true}})}
            else if (type === 'Low') {setDataSelect((prev) => {return {...prev, Low: true}})}            
        }
    }

    return (
        <div className='dataSelector'>
            <button className={dataSelect.Open ? 'selected' : ''} onClick={() => {toggleData('Open')}} >Open</button>
            <button className={dataSelect.Close ? 'selected' : ''} onClick={() => {toggleData('Close')}} >Close</button>
            <button className={dataSelect.High ? 'selected' : ''} onClick={() => {toggleData('High')}} >High</button>
            <button className={dataSelect.Low ? 'selected' : ''} onClick={() => {toggleData('Low')}} >Low</button>
        </div>
    );
}

export default DataSelector;