import LineChart from '../components/LineChart';
import '../css/Graph.css';

const Graph = ({ currentStock }) => {
    return (
        <div className='graphSection'>
            <LineChart currentStock={currentStock.history ? currentStock : []} />
        </div>
    );
}

export default Graph;