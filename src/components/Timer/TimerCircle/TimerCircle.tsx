import { useEffect, useRef } from "react";
import * as d3 from 'd3';

function humanReadableTime(ms: number) {
    const s = Math.floor(ms / 1000);
    const renderM = Math.floor(s / 60).toString().padStart(2, '0');
    const renderS = (s % 60).toString().padStart(2, '0');
    return `${renderM}:${renderS}`;

}

export function TimerCircle(props: {
    amount: number,
    remaining: number,
}) {
    const svgEl = useRef(null);

    useEffect(() => {
        const svg = d3.select(svgEl.current);
        svg.selectChildren().remove();
        svg.append('g')
            .attr('id', 'timer-arc-g')
            .attr('transform', 'translate(32,32)')
            .attr('filter', 'drop-shadow(0 0 2px red)');

        svg.append('g')
            .attr('id', 'timer-text-g')
            .attr('transform', 'translate(200,200)');
    }, [])

    useEffect(() => {
        if (!svgEl.current) return;

        const x = d3.scaleLinear()
            .domain([0, props.amount])
            .range([0, 2 * Math.PI]);

        const hrText = humanReadableTime(props.remaining);
        const svg = d3.select(svgEl.current);
        svg.select('#timer-text-g').selectAll('#timer').data([humanReadableTime])
            .join((enter) =>
                enter.append('text')
                    .attr('id', 'timer')
                    .attr('fill', 'black')
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .attr('font-size', '32')
                    .text(hrText)
                ,
                (update) => update
                    .text(hrText)
                ,
                (exit) => exit
            );
        svg.select('#timer-arc-g').selectAll('path').data([props.remaining])
            .join((enter) =>
                enter.append('path')
                    .attr('stroke', 'black')
                    .attr('transform', `translate(${(200 - 32)}, ${(200 - 32)})`)
                    .attr('fill', 'rgb(200,0,0)')
                    .attr('stroke-width', 0)
                    .attr("d", d3.arc()({
                        innerRadius: 164,
                        outerRadius: 200 - 32,
                        startAngle: x(0),
                        endAngle: x(props.remaining)
                    })),
                (update) => update.attr("d", d3.arc()({
                    innerRadius: 164,
                    outerRadius: 200 - 32,
                    startAngle: x(0),
                    endAngle: x(props.remaining)
                })),
                (exit) => exit
            );
    }, [props.remaining])

    return <svg ref={svgEl} width={400} height={400}>
    </svg>
}