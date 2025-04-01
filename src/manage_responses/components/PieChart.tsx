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
  legend: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: theme.spacing(2),
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(0.5),
    fontSize: "0.875rem",
  },
  legendColor: {
    width: "12px",
    height: "12px",
    marginRight: theme.spacing(0.5),
    borderRadius: "2px",
  },
}));

interface PieChartProps {
  data: Array<{ label: string; value: number }>;
  title: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const classes = useStyles();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Create pie generator
    const pie = d3
      .pie<{ label: string; value: number }>()
      .value((d) => d.value)
      .sort(null);

    // Create arc generator
    const arc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(0)
      .outerRadius(radius);

    // Create color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Generate pie chart data
    const pieData = pie(data);

    // Add slices
    const slices = svg
      .selectAll("path")
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i.toString()))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    // Add labels
    const labels = svg
      .selectAll("text")
      .data(pieData)
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "white")
      .style("font-weight", "bold")
      .text((d) => d.data.value);

    // Add title
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", -height / 2 + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(title);

    // Add hover effects
    slices
      .on("mouseover", function () {
        d3.select(this).style("opacity", 1);
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 0.7);
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

    slices
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(`${d.data.label}: ${d.data.value}`)
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
  }, [data, title]);

  return (
    <div className={classes.chartContainer}>
      <svg ref={svgRef}></svg>
      <div className={classes.legend}>
        {data.map((item, index) => (
          <div key={item.label} className={classes.legendItem}>
            <div
              className={classes.legendColor}
              style={{ backgroundColor: d3.schemeCategory10[index] }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
