import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  chartContainer: {
    width: "100%",
    height: "400px",
    backgroundColor: "white",
    borderRadius: "8px",
    padding: theme.spacing(2),
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
}));

interface HistogramProps {
  data: number[];
  title: string;
  xLabel?: string;
  yLabel?: string;
  bins?: number;
}

const Histogram: React.FC<HistogramProps> = ({
  data,
  title,
  xLabel,
  yLabel,
  bins = 10,
}) => {
  const classes = useStyles();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create histogram generator
    const histogram = d3
      .histogram()
      .domain(d3.extent(data) as [number, number])
      .thresholds(bins);

    // Generate histogram data
    const histogramData = histogram(data);

    // Create scales
    const x = d3
      .scaleLinear()
      .domain([
        histogramData[0].x0 || 0,
        histogramData[histogramData.length - 1].x1 || 0,
      ])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(histogramData, (d) => d.length) || 0])
      .range([height, 0]);

    // Add axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("dx", "0.71em")
      .attr("dy", "0.71em")
      .attr("transform", "rotate(-45)");

    svg.append("g").call(d3.axisLeft(y));

    // Add bars
    svg
      .selectAll("rect")
      .data(histogramData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.x0 || 0))
      .attr("y", (d) => y(d.length))
      .attr("width", (d) => x(d.x1 || 0) - x(d.x0 || 0) - 1)
      .attr("height", (d) => height - y(d.length))
      .attr("fill", "#1976d2")
      .attr("rx", 4)
      .attr("ry", 4);

    // Add value labels on top of bars
    svg
      .selectAll(".value-label")
      .data(histogramData)
      .enter()
      .append("text")
      .attr("class", "value-label")
      .attr("x", (d) => x(d.x0 || 0) + (x(d.x1 || 0) - x(d.x0 || 0)) / 2)
      .attr("y", (d) => y(d.length) - 5)
      .attr("text-anchor", "middle")
      .text((d) => d.length);

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(title);

    // Add axis labels
    if (xLabel) {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text(xLabel);
    }

    if (yLabel) {
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .attr("text-anchor", "middle")
        .text(yLabel);
    }

    // Add hover effects
    svg
      .selectAll("rect")
      .on("mouseover", function () {
        d3.select(this).attr("fill", "#2196f3");
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#1976d2");
      });

    // Add tooltips
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("padding", "8px")
      .style("pointer-events", "none")
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)");

    svg
      .selectAll("rect")
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(
            `Range: ${d.x0?.toFixed(1)} - ${d.x1?.toFixed(1)}<br/>Count: ${
              d.length
            }`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px");
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px");
      })
      .on("mouseout", function () {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    return () => {
      tooltip.remove();
    };
  }, [data, title, xLabel, yLabel, bins]);

  return (
    <div className={classes.chartContainer}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default Histogram;
