import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import '../css/Graph.css';

const Graph = ({ currentStock, range, dataSelect }) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [data, setData] = useState([]);
    const [recentData, setRecentData] = useState([]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const colors = ['steelblue', 'orange', 'mediumseagreen', '#ff6961', 'rgb(211, 113, 211)'];
    const hoverHeight = 200;

    const formatLongDate = d3.timeFormat("%b %d, %Y");

    useEffect(() => {
        const tempData = [];
        const tempRecentData = [];

        if (currentStock && currentStock.history) {
            for (let x of currentStock.history) {
                tempData.push(x);
            }

            if (currentStock.recentHistory) {
                for (let x of currentStock.recentHistory) {
                    tempRecentData.push(x);
                }

                tempRecentData.forEach((i) => {
                    if (i.date) {
                        const tempDate = new Date(i.date);
                        i.date = tempDate;
                    }
                    i.price = Number(i.price);
                });
            
                if (JSON.stringify(recentData) !== JSON.stringify(tempRecentData)) {
                    setRecentData(tempRecentData);
                }
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
    const height = 400 - margin.top - margin.bottom, width = 1000 - margin.left - margin.right;

    let yMin, yMax, getX, getY;

    if (range[0] !== '5d' && range[0] !== '1d') {
        yMin = d3.min(data, (d) => {
            if(d.date > range[1]) {
                const dataArray = [];
    
                if (dataSelect.Open) {dataArray.push(d.open)}
                if (dataSelect.Close) {dataArray.push(d.close)}
                if (dataSelect.High) {dataArray.push(d.high)}
                if (dataSelect.Low) {dataArray.push(d.low)}
    
                return Math.min(...dataArray);
            }
        });
    
        yMax = d3.max(data, (d) => {
            if(d.date > range[1]) {
                const dataArray = [];
    
                if (dataSelect.Open) {dataArray.push(d.open)}
                if (dataSelect.Close) {dataArray.push(d.close)}
                if (dataSelect.High) {dataArray.push(d.high)}
                if (dataSelect.Low) {dataArray.push(d.low)}
    
                return Math.max(...dataArray);
            }
        });

        getX = d3.scaleTime().domain(d3.extent(data, (d) => {if(d.date > range[1]) {return d.date}})).range([0, width]);
        getY = d3.scaleLinear().domain([yMin - (.1 * (yMax - yMin)), yMax + (.1 * (yMax - yMin))]).range([height, 0]);

    } else if (range[0] === '5d' ){
        yMin =  Math.min(d3.min(data, (d) => {
            if(d.date > range[1]) {
                const dataArray = [];
    
                if (dataSelect.Open) {dataArray.push(d.open)}
                if (dataSelect.Close) {dataArray.push(d.close)}
                if (dataSelect.High) {dataArray.push(d.high)}
                if (dataSelect.Low) {dataArray.push(d.low)}
    
                if (dataSelect.Open || dataSelect.Close || dataSelect.High || dataSelect.Low) {
                    return Math.min(...dataArray);
                } else {
                    return Infinity;
                }
                        }
        }), d3.min(recentData, (d) => {
            if(d.date > range[1]) {
                return d.price;
            }
        }));

        yMax = Math.max(d3.max(data, (d) => {
            if(d.date > range[1]) {
                const dataArray = [];
    
                if (dataSelect.Open) {dataArray.push(d.open)}
                if (dataSelect.Close) {dataArray.push(d.close)}
                if (dataSelect.High) {dataArray.push(d.high)}
                if (dataSelect.Low) {dataArray.push(d.low)}
    
                if (dataSelect.Open || dataSelect.Close || dataSelect.High || dataSelect.Low) {
                    return Math.max(...dataArray);
                } else {
                    return 0;
                }
            }
        }), d3.max(recentData, (d) => {
            if (d.date > range[1]) {
                return d.price;
            }
        }));

        getX = d3.scaleTime().domain(d3.extent(data.concat(recentData), (d) => {if(d.date > range[1]) {return d.date}})).range([0, width]);
        getY = d3.scaleLinear().domain([yMin - (.1 * (yMax - yMin)), yMax + (.1 * (yMax - yMin))]).range([height, 0]);

    } else if (range[0] === '1d' ){
        yMin =  d3.min(recentData, (d) => {
            if(d.date > range[1]) {
                return d.price;
            }
        });

        yMax = d3.max(recentData, (d) => {
            if (d.date > range[1]) {
                return d.price;
            }
        });

        getX = d3.scaleTime().domain(d3.extent(recentData, (d) => {if(d.date > range[1]) {return d.date}})).range([0, width]);
        getY = d3.scaleLinear().domain([yMin - (.1 * (yMax - yMin)), yMax + (.1 * (yMax - yMin))]).range([height, 0]);
    }

    const getXAxis = (ref) => {
        let tickText = '';

        if (range[0] === '1d') {
            tickText = '%-I:%M %p';
        } else if (range[0] === '5d') {
            tickText = '%b %d';
        }  else if (range[0] === '1m' || range[0] === 'MTD') {
            tickText = '%m/%d';
        } else if (range[0] === '6m') {
            tickText = '%b %Y';
        } else if (range[0] === '1y' || range[0] === 'YTD') {
            tickText = "%b '%y";
        }

        const xAxis = d3.axisBottom(getX).ticks(6);
        d3.select(ref).call(xAxis.tickFormat(d3.timeFormat(tickText)));
    };

    const getYAxis = (ref) => {
        const yAxis = d3.axisLeft(getY).tickSize(-width).tickPadding(7).tickFormat((x) => x.toLocaleString('en-US', {style: 'currency', currency:'USD', minimumFractionDigits:0})).ticks(6);
        d3.select(ref).call(yAxis);
    }

    const openPath = d3
                        .line()
                        .x((d) => getX(d.date))
                        .y((d) => getY(d.open))
                        //.defined(((d) => d.date > range[1]))
                        .curve(d3.curveMonotoneX)(data);

    const closePath = d3
                        .line()
                        .x((d) => getX(d.date))
                        .y((d) => getY(d.close))
                        //.defined(((d) => d.date > range[1]))
                        .curve(d3.curveMonotoneX)(data);

    const highPath = d3
                        .line()
                        .x((d) => getX(d.date))
                        .y((d) => getY(d.high))
                        //.defined(((d) => d.date > range[1]))
                        .curve(d3.curveMonotoneX)(data);
    const lowPath = d3
                        .line()
                        .x((d) => getX(d.date))
                        .y((d) => getY(d.low))
                        //.defined(((d) => d.date > range[1]))
                        .curve(d3.curveMonotoneX)(data);

    const pricePath = d3
                        .line()
                        .x((d) => getX(d.date))
                        .y((d) => getY(d.price))
                        //.defined(((d) => d.date > range[1]))
                        .curve(d3.curveMonotoneX)(recentData);

    const areaPath = d3
                        .area()
                        .x((d) => getX(d.date))
                        .y0((d) => getY(d.close))
                        .y1(() => getY(yMin - 1))
                        //.defined(((d) => d.date > range[1]))
                        .curve(d3.curveMonotoneX)(data);

    const handleMouseMove = (e) => {
        const bisect = d3.bisector((d) => d.date).left;
        const x0 = getX.invert(d3.pointer(e, this)[0])
        const index = bisect((range[0] === '5d' || range[0] === '1d') ? recentData : data, x0, 1);
        setActiveIndex(index);
    }

    const handleMouseLeave = () => {
        setActiveIndex(null);
    }
    return (
        <div className='graphSection'>
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

                    <clipPath id='boundingBox'>
                        <rect x='0' y='0' width={width} height={height} />
                    </clipPath>

                    {//<path fill={color} d={areaPath} clipPath='url(#boundingBox)' opacity={0.3} style={{ transition: "ease-out .25s" }} />
                    }

                    {(range[0] !== '1d' && dataSelect.Open) &&
                        <path strokeWidth={3} clipPath='url(#boundingBox)' fill='none' stroke={colors[0]} d={openPath} style={{ transition: "ease-out .25s" }} />
                    }

                    {(range[0] !== '1d' && dataSelect.Close) &&
                    <path strokeWidth={3} clipPath='url(#boundingBox)' fill='none' stroke={colors[1]} d={closePath} style={{ transition: "ease-out .25s" }} />
                    }

                    {(range[0] !== '1d' && dataSelect.High) &&
                        <path strokeWidth={3} clipPath='url(#boundingBox)' fill='none' stroke={colors[2]} d={highPath} style={{ transition: "ease-out .25s" }} />
                    }

                    {(range[0] !== '1d' && dataSelect.Low) &&
                        <path strokeWidth={3} clipPath='url(#boundingBox)' fill='none' stroke={colors[3]} d={lowPath} style={{ transition: "ease-out .25s" }} />
                    }

                    {((range[0] === '5d' || range[0] === '1d') && dataSelect.Price) &&
                        <path strokeWidth={3} clipPath='url(#boundingBox)' fill='none' stroke={colors[4]} d={pricePath} style={{ transition: "ease-out .25s" }} />
                    }

                    <rect strokeWidth={0} fill={colors[0]} x={60} y={450} width={30} height={5} rx={2}  />
                    <text x={100} y={458} fill='#fff' textAnchor='left' >Open</text>

                    <rect strokeWidth={0} fill={colors[1]} x={260} y={450} width={30} height={5} rx={2}  />
                    <text x={300} y={458} fill='#fff' textAnchor='left' >Close</text>

                    <rect strokeWidth={0} fill={colors[2]} x={460} y={450} width={30} height={5} rx={2}  />
                    <text x={500} y={458} fill='#fff' textAnchor='left' >High</text>

                    <rect strokeWidth={0} fill={colors[3]} x={660} y={450} width={30} height={5} rx={2}  />
                    <text x={700} y={458} fill='#fff' textAnchor='left' >Low</text>

                    <rect strokeWidth={0} fill={colors[4]} x={860} y={450} width={30} height={5} rx={2}  />
                    <text x={900} y={458} fill='#fff' textAnchor='left' >Price</text>

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
                                        y={hoverHeight - 200}
                                        width={150}
                                        height={200}
                                        rx={15}
                                    />
                                }

                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 125}
                                    y={hoverHeight - 175}
                                    style={{textDecoration: 'underline'}}
                                    textAnchor='middle'>
                                    {index === activeIndex ? currentStock.name : ''}
                                </text>

                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 125}
                                    y={hoverHeight - 150}
                                    textAnchor='middle'>
                                    {index === activeIndex ? formatLongDate(item.date) : ''}
                                </text>

                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 165}
                                    y={hoverHeight - 110}
                                    textAnchor='middle'>
                                    {index === activeIndex ? 'Open:' : ''}
                                </text>
                                
                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 90}
                                    y={hoverHeight - 110}
                                    textAnchor='middle'>
                                    {index === activeIndex ? item.open.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency:'USD'
                                    }) : ''}
                                </text>

                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 165}
                                    y={hoverHeight - 80}
                                    textAnchor='middle'>
                                    {index === activeIndex ? 'Close:' : ''}
                                </text>
                                
                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 90}
                                    y={hoverHeight - 80}
                                    textAnchor='middle'>
                                    {index === activeIndex ? item.close.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency:'USD'
                                    }) : ''}
                                </text>

                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 165}
                                    y={hoverHeight - 50}
                                    textAnchor='middle'>
                                    {index === activeIndex ? 'High:' : ''}
                                </text>
                                
                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 90}
                                    y={hoverHeight - 50}
                                    textAnchor='middle'>
                                    {index === activeIndex ? item.high.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency:'USD'
                                    }) : ''}
                                </text>

                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 165}
                                    y={hoverHeight - 20}
                                    textAnchor='middle'>
                                    {index === activeIndex ? 'Low:' : ''}
                                </text>
                                
                                <text
                                    fill="#fff"
                                    x={getX(item.date) - 90}
                                    y={hoverHeight - 20}
                                    textAnchor='middle'>
                                    {index === activeIndex ? item.low.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency:'USD'
                                    }) : ''}
                                </text>

                                {dataSelect.Open &&
                                    <circle
                                        cx={getX(item.date)}
                                        cy={getY(item.open)}
                                        r={index === activeIndex ? 6 : 0}
                                        fill={colors[0]}
                                        strokeWidth={index === activeIndex ? 2 : 0}
                                        stroke='#fff'
                                        style={{ transition: "ease-out .1s" }}
                                    />
                                }

                                {dataSelect.Close &&
                                    <circle
                                        cx={getX(item.date)}
                                        cy={getY(item.close)}
                                        r={index === activeIndex ? 6 : 0}
                                        fill={colors[1]}
                                        strokeWidth={index === activeIndex ? 2 : 0}
                                        stroke='#fff'
                                        style={{ transition: "ease-out .1s" }}
                                    />
                                }

                                {dataSelect.High &&
                                    <circle
                                        cx={getX(item.date)}
                                        cy={getY(item.high)}
                                        r={index === activeIndex ? 6 : 0}
                                        fill={colors[2]}
                                        strokeWidth={index === activeIndex ? 2 : 0}
                                        stroke='#fff'
                                        style={{ transition: "ease-out .1s" }}
                                    />
                                }

                                {dataSelect.Low &&
                                    <circle
                                        cx={getX(item.date)}
                                        cy={getY(item.low)}
                                        r={index === activeIndex ? 6 : 0}
                                        fill={colors[3]}
                                        strokeWidth={index === activeIndex ? 2 : 0}
                                        stroke='#fff'
                                        style={{ transition: "ease-out .1s" }}
                                    />
                                }
                            </g>
                        )
                    })}
            </svg>
        </div>
    );
}

export default Graph;