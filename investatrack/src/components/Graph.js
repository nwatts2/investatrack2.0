import LineChart from '../components/LineChart';
import '../css/Graph.css';

const Graph = ({ currentStock, range, dataSelect }) => {
    return (
        <div className='graphSection'>
            <LineChart currentStock={currentStock.history ? currentStock : []} range={range} dataSelect={dataSelect} />
        </div>
    );
}

export default Graph;