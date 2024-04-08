function App() {
  const [countryData, setCountryData] = React.useState([]);
  const [dataType, setDataType] = React.useState("casesPerOneMillion");

  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://disease.sh/v3/covid-19/countries?sort=" + dataType
      );
      const data = await response.json();
      console.log(data);
      setCountryData(data);
    }
    fetchData();
  }, [dataType]);

  return (
    <div>
      <h1>Covid States</h1>
      <select
        name="datatype"
        id="datatype"
        onChange={(e) => setDataType(e.target.value)}
        value={dataType}
      >
        <option value="casesPerOneMillion">Cases Per One Million</option>
        <option value="cases">Cases</option>
        <option value="deaths">Deaths</option>
        <option value="tests">Tests</option>
        <option value="deathsPerOneMillion">Death Per One Million</option>
      </select>
      <div className="visHolder">
        <BarChart
          data={countryData}
          height={500}
          widthOfBar={5}
          width={countryData.length * 5}
          dataType={dataType}
        ></BarChart>
      </div>
    </div>
  );
}

function BarChart({ data, height, width, widthOfBar, dataType }) {
  const svgRef = React.useRef();
  React.useEffect(() => {
    createBarChart();
  }, [data]);

  const createBarChart = () => {
    const countryData = data.map((country) => country[dataType]);
    const countries = data.map((country) => country.country);

    let tooltip = d3
      .select(".visHolder")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    const dataMax = d3.max(countryData);
    const yScale = d3.scaleLinear().domain([0, dataMax]).range([0, height]);

    const svg = d3.select("svg");
    svg.selectAll("*").remove();
    
    svg
      .selectAll("rect")
      .data(countryData)
      .enter()
      .append("rect")
      .style("fill", (d, i) => (i % 2 === 0 ? "#9595ff" : "#44ff44"))
      .attr("x", (d, i) => i * widthOfBar)
      .attr("y", (d) => height - yScale(d + dataMax * 0.1))
      .attr("height", (d) => yScale(d + dataMax * 0.1))
      .attr("width", widthOfBar)

      .on("mouseover", (d, i) => {
        tooltip.style("opacity", 0.9);
        tooltip
          .html(countries[i] + `<br/> ${dataType}:` + d)
          .style("left", i * widthOfBar + 20 + "px")
          .style("top", d3.event.pageY - 170 + "px");
      });
  };

  return <svg width={width} height={height}></svg>;
}

ReactDOM.render(<App />, document.getElementById("root"));
