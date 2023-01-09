import { useEffect, useState } from 'react';
import '../css/ModeSelector.css';

const ModeSelector = ({ mode, setMode }) => {
    const [style, setStyle] = useState({left: 0});

    useEffect(() => {
        if (mode === 'PERFORMANCE') {
            setStyle({left: '0%'});

        } else if (mode === 'STOCKS') {
            setStyle({left: '50%'});

        }

    }, [mode]);

    return (
        <div className='modeSelector'>
            <button onClick={() => {setMode('PERFORMANCE')}} className={mode === 'PERFORMANCE' ? 'modeButtonChecked' : 'modeButton'}>Performance</button>
            <span style={style} className='modeSelectorGraphic'>P</span>
            <button onClick={() => {setMode('STOCKS')}} className={mode === 'STOCKS' ? 'modeButtonChecked' : 'modeButton'} >Stocks</button>
        </div>
    );
}

export default ModeSelector;