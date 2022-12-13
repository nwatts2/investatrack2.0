import '../css/RangeSelector.css';

const RangeSelector = ({ range, setRange }) => {
    const today = new Date();
    today.setHours(0,0,0,0);

    let tempRange = new Date(today.toISOString());

    function updateRange(label, days) {
        if (label === 'YTD') {
            tempRange.setMonth(0);
            tempRange.setDate(1);

        } else if (label === 'MTD') {
            tempRange.setDate(1);

        } else {
            tempRange.setDate(today.getDate() - days);

        }
        setRange([label, tempRange]);
    }

    return (
        <div className='rangeSelector'>
            <button className={range[0] === 'YTD' ? 'selected' : ''} onClick={() => {updateRange('YTD', 365)}}>YTD</button>
            <button className={range[0] === 'MTD' ? 'selected' : ''} onClick={() => {updateRange('MTD', 31)}}>MTD</button>
            <button className={range[0] === '1y' ? 'selected' : ''} onClick={() => {updateRange('1y', 365)}}>1y</button>
            <button className={range[0] === '6m' ? 'selected' : ''} onClick={() => {updateRange('6m', 183)}}>6m</button>
            <button className={range[0] === '1m' ? 'selected' : ''} onClick={() => {updateRange('1m', 31)}}>1m</button>
            <button className={range[0] === '5d' ? 'selected' : ''} onClick={() => {updateRange('5d', 5)}}>5d</button>
            <button className={range[0] === '1d' ? 'selected' : ''} onClick={() => {updateRange('1d', 1)}}>1d</button>
        </div>
    );
};

export default RangeSelector;