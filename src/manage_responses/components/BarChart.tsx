import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface BarChartProps {
  data: Array<{ label: string; value: number }>;
  title?: string;
  xLabel?: string;
  yLabel?: string;
}

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
    fontWeight: 500,
  },
}));

const BarChart: React.FC<BarChartProps> = ({ data, title, xLabel, yLabel }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const classes = useStyles();

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3
      .scaleBand()
      .range([0, width])
      .padding(0.2)
      .domain(data.map((d) => d.label));

    const y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, (d) => d.value) || 0]);

    // Create a more diverse color scale
    const colorScale = d3.scaleOrdinal([
      "#1976d2", // Blue
      "#2e7d32", // Green
      "#d32f2f", // Red
      "#ed6c02", // Orange
      "#9c27b0", // Purple
      "#2c3e50", // Dark Blue
      "#e91e63", // Pink
      "#00bcd4", // Cyan
      "#795548", // Brown
      "#607d8b", // Blue Grey
      "#4caf50", // Light Green
      "#f44336", // Light Red
      "#ff9800", // Light Orange
      "#9c27b0", // Light Purple
      "#3f51b5", // Indigo
    ]);

    // Add axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    svg.append("g").call(d3.axisLeft(y));

    // Add bars with different colors
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.label) || 0)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (_, i) => colorScale(i.toString()))
      .attr("rx", 4)
      .attr("ry", 4)
      .on("mouseover", function () {
        d3.select(this).transition().duration(200).attr("opacity", 0.8);
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).attr("opacity", 1);
      });

    // Add value labels on top of bars
    svg
      .selectAll(".value-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "value-label")
      .attr("x", (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .text((d) => d.value)
      .style("font-size", "12px")
      .style("fill", "#666");

    // Add axis labels
    if (xLabel) {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text(xLabel)
        .style("font-size", "14px")
        .style("fill", "#666");
    }

    if (yLabel) {
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .attr("text-anchor", "middle")
        .text(yLabel)
        .style("font-size", "14px")
        .style("fill", "#666");
    }

    // Add title
    if (title) {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .text(title)
        .style("font-size", "16px")
        .style("font-weight", "500")
        .style("fill", "#333");
    }
  }, [data, title, xLabel, yLabel]);

  return (
    <Box className={classes.container}>
      {title && <Typography className={classes.title}>{title}</Typography>}
      <svg ref={svgRef}></svg>
    </Box>
  );
};

export default BarChart;
