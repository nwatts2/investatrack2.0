import { useEffect } from 'react';
import '../css/DataSelector.css'

const DataSelector = ({ graphMode, dataSelect, setDataSelect, range }) => {
    useEffect(() => {
        if (graphMode === 'STOCKS') {
            if (range[0] === '1d') {
                setDataSelect((prev) => {return {...prev, Open: false, Close: false, High: false, Low: false, Price: true, Cash: false}});
            } else if (range[0] !== '5d') {
                if (!dataSelect.Open && !dataSelect.Close && !dataSelect.High && !dataSelect.Low) {
                    setDataSelect((prev) => {return {...prev, Open: true, Close: true, High: true, Low: true, Price: false, Cash: false}});
                } else {
                    setDataSelect((prev) => {return {...prev, Price: false, Cash: false}});
                }
            }
        } else if (graphMode === 'PERFORMANCE') {
            if (range[0] === '1d') {
                setDataSelect((prev) => {return {...prev, Open: false, Close: false, High: false, Low: false, Price: true}});
            } else if (range[0] !== '5d') {
                if (!dataSelect.Open && !dataSelect.Close && !dataSelect.High && !dataSelect.Low) {
                    setDataSelect((prev) => {return {...prev, Open: true, Close: true, High: true, Low: true, Price: false}});
                } else {
                    setDataSelect((prev) => {return {...prev, Price: false}});
                }
            }
        }
        

    }, [range]);

    useEffect(() => {
        if (graphMode === 'STOCKS') {
            if (range[0] === '1d' || range[0] === '5d') {
                setDataSelect((prev) => {return {...prev, Open: false, Close: false, High: false, Low: false, Price: true, Cash: false}})
            } else {
                setDataSelect((prev) => {return {...prev, Open: true, Close: true, High: true, Low: true, Price: false, Cash: false}})
            }
        } else if (graphMode === 'PERFORMANCE') {
            setDataSelect((prev) => {return {...prev, High: false, Low: false, price:false, Open: true, Close: true}});
        }

    }, [graphMode]);

    function toggleData (type) {
        if (dataSelect[type]) {
            if (graphMode === 'STOCKS') {
                if (type === 'Open') {
                    if (!(!dataSelect.Close && !dataSelect.High && !dataSelect.Low && !dataSelect.Price)) {
                        setDataSelect((prev) => {return {...prev, Open: false}})
                    }
                }
                else if (type === 'Close') {
                    if (!(!dataSelect.Open && !dataSelect.High && !dataSelect.Low && !dataSelect.Price)) {
                        setDataSelect((prev) => {return {...prev, Close: false}})
                    }
                }
                else if (type === 'High') {
                    if (!(!dataSelect.Close && !dataSelect.Open && !dataSelect.Low && !dataSelect.Price)) {
                        setDataSelect((prev) => {return {...prev, High: false}})
                    }
                }
                else if (type === 'Low') {
                    if (!(!dataSelect.Close && !dataSelect.High && !dataSelect.Open && !dataSelect.Price)) {
                        setDataSelect((prev) => {return {...prev, Low: false}})
                    }
                }
                else if (type === 'Price') {
                    if (!(!dataSelect.Close && !dataSelect.High && !dataSelect.Open && !dataSelect.Low)) {
                        setDataSelect((prev) => {return {...prev, Price: false}})
                    }
                }
            } else if (graphMode === 'PERFORMANCE') {
                if (type === 'Open') {
                    if (!(!dataSelect.Close && !dataSelect.High && !dataSelect.Low && !dataSelect.Price && !dataSelect.Cash)) {
                        setDataSelect((prev) => {return {...prev, Open: false}})
                    }
                }
                else if (type === 'Close') {
                    if (!(!dataSelect.Open && !dataSelect.High && !dataSelect.Low && !dataSelect.Price && !dataSelect.Cash)) {
                        setDataSelect((prev) => {return {...prev, Close: false}})
                    }
                }
                else if (type === 'High') {
                    if (!(!dataSelect.Close && !dataSelect.Open && !dataSelect.Low && !dataSelect.Price && !dataSelect.Cash)) {
                        setDataSelect((prev) => {return {...prev, High: false}})
                    }
                }
                else if (type === 'Low') {
                    if (!(!dataSelect.Close && !dataSelect.High && !dataSelect.Open && !dataSelect.Price && !dataSelect.Cash)) {
                        setDataSelect((prev) => {return {...prev, Low: false}})
                    }
                }
                else if (type === 'Price') {
                    if (!(!dataSelect.Close && !dataSelect.High && !dataSelect.Open && !dataSelect.Low && !dataSelect.Cash)) {
                        setDataSelect((prev) => {return {...prev, Price: false}})
                    }
                } else if (type === 'Cash') {
                    if (!(!dataSelect.Close && !dataSelect.High && !dataSelect.Open && !dataSelect.Low && !dataSelect.Price)) {
                        setDataSelect((prev) => {return {...prev, Cash: false}})
                    }
                } 
            }
                       
        } else {
            if (type === 'Open') {setDataSelect((prev) => {return {...prev, Open: true}})}
            else if (type === 'Close') {setDataSelect((prev) => {return {...prev, Close: true}})}
            else if (type === 'High') {setDataSelect((prev) => {return {...prev, High: true}})}
            else if (type === 'Low') {setDataSelect((prev) => {return {...prev, Low: true}})}
            else if (type === 'Price') {setDataSelect((prev) => {return {...prev, Price: true}})}
            else if (type === 'Cash') {setDataSelect((prev) => {return {...prev, Cash: true}})}                                                
        }
    }

    return (
        <div className='dataSelector'>
            <button className={dataSelect.Open ? 'selected' : ''} onClick={() => {toggleData('Open')}} disabled={range[0] !== '1d' ? false : true} >Open</button>
            <button className={dataSelect.Close ? 'selected' : ''} onClick={() => {toggleData('Close')}} disabled={range[0] !== '1d' ? false : true} >Close</button>
            {graphMode === 'STOCKS' &&
                <button className={dataSelect.High ? 'selected' : ''} onClick={() => {toggleData('High')}} disabled={range[0] !== '1d' ? false : true} >High</button>
            }
            {graphMode === 'STOCKS' &&
                <button className={dataSelect.Low ? 'selected' : ''} onClick={() => {toggleData('Low')}} disabled={range[0] !== '1d' ? false : true} >Low</button>
            }
            <button className={dataSelect.Price ? 'selected' : ''} onClick={() => {toggleData('Price')}} disabled={(range[0] === '5d' || range[0] === '1d') ? false : true} >{graphMode === 'STOCKS' ? 'Price' : 'Value'}</button>
            {graphMode === 'PERFORMANCE' &&
                <button className={dataSelect.Cash ? 'selected' : ''} onClick={() => {toggleData('Cash')}} >Cash</button>
            }
        </div>
    );
}

export default DataSelector;