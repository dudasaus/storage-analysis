import { useEffect, useMemo, useRef } from "react";
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
    w?: number,
    h?: number,
    strokeWidth?: number,
    margin?: number,
}) {
    const svgEl = useRef(null);

    const size = useMemo(() => {
        const w = props.w ?? 400;
        const h = props.w ?? 400;
        const margin = props.margin ?? 16;
        const strokeWidth = props.strokeWidth ?? 8;
        return {
            w,
            h,
            margin,
            strokeWidth,
            innerW: w - margin * 2,
            innerH: h - margin * 2,
            cx: w / 2,
            cy: h / 2,
            xStart: margin,
            yStart: margin,
        }
    }, [props.w, props.h]);

    const x = useMemo(() => {
        return d3.scaleLinear()
            .domain([0, props.amount])
            .range([0, 2 * Math.PI]);
    }, [props.amount])

    useEffect(() => {
        const svg = d3.select(svgEl.current);
        svg.selectChildren().remove();
        svg.append('g')
            .attr('id', 'timer-arc-bg-g')
            .attr('transform', `translate(${size.margin}, ${size.margin})`)
            .append('path')
                    .attr('transform', `translate(${(size.cx - size.margin)}, ${(size.cy - size.margin)})`)
                    .attr('fill', 'rgb(200,0,0)')
                    .attr('stroke-width', 0)
                    .attr("d", d3.arc()({
                        innerRadius: size.cx - size.margin - size.strokeWidth,
                        outerRadius: size.cx - size.margin,
                        startAngle: x(0),
                        endAngle: x(props.amount)
                    }))
        svg.append('g')
            .attr('id', 'timer-arc-g')
            .attr('transform', `translate(${size.margin}, ${size.margin})`)
            .attr('filter', 'drop-shadow(0 0 2px red)');

        svg.append('g')
            .attr('id', 'timer-text-g')
            .attr('transform', `translate(${size.cx}, ${size.cy})`);
    }, [])

    useEffect(() => {
        if (!svgEl.current) return;
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
                (exit) => exit.remove()
            );
        svg.select('#timer-arc-g').selectAll('path').data([props.remaining].filter(c => c > 0))
            .join((enter) =>
                enter.append('path')
                    .attr('stroke', 'black')
                    .attr('transform', `translate(${(size.cx - size.margin)}, ${(size.cy - size.margin)})`)
                    .attr('fill', 'rgb(200,0,0)')
                    .attr('stroke-width', 0)
                    .attr("d", d3.arc()({
                        innerRadius: size.cx - size.margin - size.strokeWidth,
                        outerRadius: size.cx - size.margin,
                        startAngle: x(0),
                        endAngle: x(props.remaining)
                    })),
                (update) => update.attr("d", d3.arc()({
                    innerRadius: size.cx - size.margin - (props.strokeWidth ?? 8),
                    outerRadius: size.cx - size.margin,
                    startAngle: x(0),
                    endAngle: x(props.remaining)
                })),
                (exit) => exit.remove()
            );
    }, [props.remaining])

    return <svg ref={svgEl} width={size.w} height={size.h}>
    </svg>
}