import { useState, useEffect } from 'react';
import * as d3 from 'd3';

const LineChart = ({ currentStock }) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [data, setData] = useState([]);

    const formatDate = d3.timeFormat('%m/%d/%Y');
    const formatShortDate = d3.timeFormat("%m/%d");
    const formatLongDate = d3.timeFormat("%b %d, %Y");

    useEffect(() => {
        const tempData = [];

        if (currentStock && currentStock.history) {
            for (let x of currentStock.history) {
                tempData.push(x);
            }

            tempData.forEach((i) => {
                if (i.date) {
                    const tempDate = new Date(i.date);
                    const dateString = formatDate(tempDate)
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
    const height = 400 - margin.top - margin.bottom, width = 1000 - margin.left - margin.right;
    const color = 'orange';

    const yMin = d3.min(data, (d) => d.close);
    const yMax = d3.max(data, (d) => d.close);

    const getX = d3.scaleTime().domain(d3.extent(data, (d) => d.date)).range([0, width]);
    const getY = d3.scaleLinear().domain([yMin - 1, yMax + 2]).range([height, 0]);

    const getXAxis = (ref) => {
        const xAxis = d3.axisBottom(getX);
        d3.select(ref).call(xAxis.tickFormat(d3.timeFormat("%b %y")));
    };

    const getYAxis = (ref) => {
        const yAxis = d3.axisLeft(getY).tickSize(-width).tickPadding(7).tickFormat((x) => x.toLocaleString('en-US', {style: 'currency', currency:'USD', minimumFractionDigits:0})).ticks(6);
        d3.select(ref).call(yAxis);
    }

    const linePath = d3
                        .line()
                        .x((d) => getX(d.date))
                        .y((d) => getY(d.close))
                        .curve(d3.curveMonotoneX)(data);

    const areaPath = d3
                        .area()
                        .x((d) => getX(d.date))
                        .y0((d) => getY(d.close))
                        .y1(() => getY(yMin - 1))
                        .curve(d3.curveMonotoneX)(data);

    const handleMouseMove = (e) => {
        const bisect = d3.bisector((d) => d.date).left;
        const x0 = getX.invert(d3.pointer(e, this)[0])
        const index = bisect(data, x0, 1);
        setActiveIndex(index);
    }

    const handleMouseLeave = () => {
        setActiveIndex(null);
    }

    return (
            <svg
                className='graph'
                viewBox={`0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                >
                    <g className="axis" ref={getYAxis} />
                    <g
                        className="axis xAxis"
                        ref={getXAxis}
                        transform={`translate(0,${height})`} 
                    />

                    <path fill={color} d={areaPath} opacity={0.3} style={{ transition: "ease-out .1s" }} />
                    <path strokeWidth={3} fill='none' stroke={color} d={linePath} style={{ transition: "ease-out .1s" }} />

                    {data.map((item, index) => {
                        return (
                            <g key={index}>
                                <path
                                    className='mousePath'
                                    strokeWidth={index === activeIndex ? 2 : 0}
                                    d={`m ${getX(item.date)},0 0,${height}`}
                                    />
                                
                                {index === activeIndex &&
                                    <rect className='hoverBox'
                                        x={getX(item.date) - 200}
                                        y={getY(item.close) - 200}
                                        width={150}
                                        height={200}
                                        rx={15}
                                    />
                                }

                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 125}
                                    y={getY(item.close) - 175}
                                    style={{textDecoration: 'underline'}}
                                    textAnchor='middle'>
                                    {index === activeIndex ? currentStock.name : ''}
                                </text>

                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 125}
                                    y={getY(item.close) - 150}
                                    textAnchor='middle'>
                                    {index === activeIndex ? formatLongDate(item.date) : ''}
                                </text>

                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 165}
                                    y={getY(item.close) - 110}
                                    textAnchor='middle'>
                                    {index === activeIndex ? 'Open:' : ''}
                                </text>
                                
                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 90}
                                    y={getY(item.close) - 110}
                                    textAnchor='middle'>
                                    {index === activeIndex ? item.open.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency:'USD'
                                    }) : ''}
                                </text>

                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 165}
                                    y={getY(item.close) - 80}
                                    textAnchor='middle'>
                                    {index === activeIndex ? 'Close:' : ''}
                                </text>
                                
                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 90}
                                    y={getY(item.close) - 80}
                                    textAnchor='middle'>
                                    {index === activeIndex ? item.close.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency:'USD'
                                    }) : ''}
                                </text>

                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 165}
                                    y={getY(item.close) - 50}
                                    textAnchor='middle'>
                                    {index === activeIndex ? 'High:' : ''}
                                </text>
                                
                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 90}
                                    y={getY(item.close) - 50}
                                    textAnchor='middle'>
                                    {index === activeIndex ? item.high.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency:'USD'
                                    }) : ''}
                                </text>

                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 165}
                                    y={getY(item.close) - 20}
                                    textAnchor='middle'>
                                    {index === activeIndex ? 'Low:' : ''}
                                </text>
                                
                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 90}
                                    y={getY(item.close) - 20}
                                    textAnchor='middle'>
                                    {index === activeIndex ? item.low.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency:'USD'
                                    }) : ''}
                                </text>

                                <circle
                                    cx={getX(item.date)}
                                    cy={getY(item.close)}
                                    r={index === activeIndex ? 6 : 0}
                                    fill={color}
                                    strokeWidth={index === activeIndex ? 2 : 0}
                                    stroke='#fff'
                                    style={{ transition: "ease-out .1s" }}
                                />
                            </g>
                        )
                    })}
            </svg>
    );
}

export default LineChart;