const xhr = new XMLHttpRequest();
//xhr.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", true);
xhr.open("GET", './dataset.json', true);
xhr.onreadystatechange = () => {
    if(xhr.readyState === 4 && xhr.status === 200){
        const dataset = JSON.parse(xhr.responseText).data;
        console.log(dataset);
        createBarChart(dataset);
    }
}
xhr.send(); 
const createBarChart = (dataset) => {
    const w = 850;
    const h = 500;
    const padding = 40;
    console.log(dataset)
    
    const title = d3.select(".container")
                    .append("h1")
                    .text("United States GDP")
                    .style("font-size", "40px")
                    .style("font-weight", "500")

    const svg = d3.select(".container")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .style("background", "white");
    
    const xScale = d3.scaleLinear()
                    .domain([1947, 2015])
                    .range([padding, w - padding])
    
    const yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset, (d) => d[1])])
                    .range([h- padding, padding])
    
    console.log(yScale(243.1))
    console.log(xScale(1947))
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("width", 3)
        .attr("height", (d) => h - padding - yScale(d[1]))
            .attr("x", (d, i) =>  {
                const year = parseInt(d[0].match(/\d\d\d\d/)[0]);
                const yearCount = dataset.filter((item) => parseInt(item[0].match(/\d\d\d\d/)[0]) === year).length;
                const offset = (i % yearCount + Math.floor(yearCount / 2)) * 3;
                return (xScale(year) + offset) - 4.5;
        })
        .attr("y", (d) => yScale(d[1]))
        .attr("class", "rectHover")
        .attr("fill", "rgb(51, 173, 255)")
    

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("class", "gx")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis)

    svg.append("g")
        .attr("transform", "translate(" + padding + ", 0)")
        .call(yAxis)

    const gxElement = document.querySelectorAll(".gx g text");

    let years = [];
    gxElement.forEach(d => {
        years.push(d.textContent)
    })

    for(let i = 0; i < years.length; i++){
        gxElement[i].textContent = years[i].match(/\d/g).join(""); 
    }
    
    const author = d3.select(".container")
                    .append("h3")
                    .text("DENIS URIAS RODRIGUEZ GARCIA")
    
    const rects = document.querySelectorAll("rect")
    const rectInfo = document.querySelector(".rectInfo");
    const year = document.querySelector(".year");
    const mount = document.querySelector(".mount");
    let i = 1;
    rects.forEach((rect) => {
        if(i <= 4){
            rect.classList.add("Q" + i);
        }
        if(i === 4){
            i = 1;
        }else{
            i++;
        }
    })
    rects.forEach((rect) => {
        rect.addEventListener("mouseover", (e) => {
                const QE = rect.className.baseVal.match(/Q\d/)[0]
                const xInfo = e.target.attributes[2].value;
                rectInfo.style.display = "flex";
                rectInfo.style.right = ((940 - xInfo) - 40) + "px";
                year.textContent = rect.__data__[0].match(/\d\d\d\d/)[0] + " " + QE;
                mount.textContent = "$" + rect.__data__[1] + " Billion";
        })
        rect.addEventListener("mouseout", (e) => {
            rectInfo.style.display = "none";
        })
    })
}






