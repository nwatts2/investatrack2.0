import '../css/ModeSelector.css';

const ModeSelector = ({ mode, setMode }) => {
    return (
        <div className='modeSelector'>
            <button onClick={() => {setMode('PERFORMANCE')}} className={mode === 'PERFORMANCE' ? 'modeButtonChecked' : 'modeButton'}>Performance</button>
            <button onClick={() => {setMode('STOCKS')}} className={mode === 'STOCKS' ? 'modeButtonChecked' : 'modeButton'} >Stocks</button>
        </div>
    );
}

export default ModeSelector;