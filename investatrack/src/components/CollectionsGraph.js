import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import '../css/CollectionsGraph.css';

const Chart = ({ currentStock }) => {
    const [data, setData] = useState([]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tempRange = new Date(today.toISOString());
    tempRange.setDate(today.getDate() - 14);
    const range = ['14d', tempRange];

    const colors = ['steelblue', 'orange', 'mediumseagreen', '#ff6961'];

    useEffect(() => {
        const tempData = [];

        if (currentStock && currentStock.history) {
            for (let x of currentStock.history) {
                tempData.push(x);
            }

            tempData.forEach((i) => {
                if (i.date) {
                    const tempDate = new Date(i.date);
                    i.date = tempDate;
                }
                i.close = Number(i.close);
            });
        
            if (JSON.stringify(tempData) !== JSON.stringify(data)) {
                setData(tempData);
            }
        }

    }, [JSON.stringify(currentStock)]);

    
    const margin = {top:0, right:0, bottom:0, left:0};
    const height = 180 - margin.top - margin.bottom, width = 200 - margin.left - margin.right;

    const yMin = d3.min(data, (d) => {
        if(d.date > range[1]) {
            return d.close;
        }
    });

    const yMax = d3.max(data, (d) => {
        if(d.date > range[1]) {
            return d.close;
        }
    });

    const getX = d3.scaleTime().domain(d3.extent(data, (d) => {if (d.date > range[1]) {return d.date}})).range([0, width]);
    const getY = d3.scaleLinear().domain([yMin - (.1 * (yMax - yMin)), yMax + (.1 * (yMax - yMin))]).range([height, 0]);

    const getXAxis = (ref) => {
        const xAxis = d3.axisBottom(getX).ticks(0);
        d3.select(ref).call(xAxis);
    };

    const getYAxis = (ref) => {
        const yAxis = d3.axisLeft(getY).ticks(0);
        d3.select(ref).call(yAxis);
    }

    const closePath = d3
                        .line()
                        .x((d) => getX(d.date))
                        .y((d) => getY(d.close))
                        .defined(((d) => d.date > range[1]))
                        .curve(d3.curveMonotoneX)(data);

    const areaPath = d3
                        .area()
                        .x((d) => getX(d.date))
                        .y0((d) => getY(d.close))
                        .y1(() => getY(yMin - 1))
                        .curve(d3.curveMonotoneX)(data);

    return (
            <svg
                className='collectionsGraph'
                viewBox={`0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`}
                >
                    <g className="axis" ref={getYAxis} />
                    <g
                        className="axis xAxis"
                        ref={getXAxis}
                        transform={`translate(0,${height})`} 
                    />

                    {//<path fill={color} d={areaPath} clipPath='url(#collectionsBoundingBox)' opacity={0.3} style={{ transition: "ease-out .25s" }} />
                    }

                    <path strokeWidth={6} fill='none' stroke={colors[1]} d={closePath} style={{ transition: "ease-out .25s" }} />
            </svg>
    );
}

const CollectionsGraph = ({ currentStock }) => {
    return (
        <div className='collectionsGraphSection'>
            <Chart currentStock={currentStock} />
        </div>
    );
};

export default CollectionsGraph;