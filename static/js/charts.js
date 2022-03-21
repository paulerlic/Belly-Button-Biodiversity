function init() {
    // Grab reference to dropdown element
    var selector = d3.select("#selDataset");
  
    // Use sample names to populate options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use first sample from list to build plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Dashboard init
  init();
  
  function optionChanged(newSample) {
    // Grab new data
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
      // Demographics
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter data for object with the matching sample number
      var resultArray = metadata.filter(sampleObject => sampleObject.id == sample);
      var result = resultArray[0];
      // Select the panel with id of #sample-metadata
      var PANEL = d3.select("#sample-metadata");
  
      // Clear any existing metadata
      PANEL.html("");
  
      // Object.entries add each key and value pair 
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  // 1. BuildCharts function.
  function buildCharts(sample) {
    // 2. Load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      console.log(data);
      // 3. Variable to hold the sample array. 
      var samples = data.samples;
      console.log(samples);
      // 4. Variable that  samples for the object with the sample number.
      var samplesArray = samples.filter(sampleObject => sampleObject.id == sample);
      console.log(samplesArray);
      //  5. Variable that holds first sample in the array.
      var samplesResult = samplesArray[0];
      console.log(samplesResult);
      // 6. Variables to hold  (otu_ids, otu_labels, and sample_values.)
      var otu_ids = samplesResult.otu_ids;
      console.log(otu_ids);
      var otu_labels = samplesResult.otu_labels;
      console.log(otu_labels);
      var sample_values = samplesResult.sample_values;
      console.log(sample_values);
  
      // Bar Chart
      // 7. Yticks for the bar chart.
      var yticks = otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse();
      console.log(yticks)
  
      // 8. Trace for the bar chart. 
      var barData = [{
          x: sample_values.slice(0,10).reverse(),
          y: yticks,
          text: otu_labels.slice(0,10).reverse(),
          name: "otu_ids",
          type: "bar",
          orientation: "h"
        }, 
      ];
      // 9. Layout for the bar chart. 
      var barLayout = {
          title: "Top 10 Bacteria Cultures Discovered",
          xaxis: { title: "Sample Value" },
          yaxis: { title: "OTU ID" },
          width: 460, 
          height: 390,
          margin: {
            l: 100,
            r: 50,
            t: 75,
            b: 75
          }
      };
      
      // 10. Plot data to the layout. 
      Plotly.newPlot("bar", barData, barLayout);
  
      // Bubble Chart
      // 1. Trace for bubble chart.
      var bubbleData = [{
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
              color: otu_ids,
              size: sample_values,
              colorscale: "Earth"
          }
      },
      ];
  
      // 2. Layout for bubble chart.
      var bubbleLayout = {
          title: "Bacteria Cultures per Sample",
          xaxis: { title: "OTU ID" },
          yaxis: { title: "Sample Value" },
          margin: {
              l: 75,
              r: 50,
              t: 75,
              b: 75
          }
      };
  
      // 3. Plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
      // Gauge Chart
      // 3. Variable for washing frequency.
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObject => sampleObject.id == sample);
      var result = resultArray[0];
      var wfreq = result.wfreq
      console.log(wfreq)
    
      // 4. Trace for the gauge chart.
      var gaugeData = [
          {
              domain: { x: [0, 1], y: [0, 1] },
              value: wfreq,
              title: { text: "Scrubs per Week" },
              type: "indicator",
              mode: "gauge+number",
              gauge: {
              bar: {color: 'white'},
                  axis: { range: [null, 10] },
                  steps: [
                      { range: [0, 2], color: 'rgba(245, 39, 39, 1)' },
                      { range: [2, 4], color: 'rgba(245, 140, 39, 1)' },
                      { range: [4, 6], color: 'rgba(242, 245, 39, 1)' },
                      { range: [6, 8], color: 'rgba(39, 245, 42, 1)' },
                      { range: [8, 10], color: 'rgba(46, 39, 245, 1)' },
                      ],
                }
          } 
      ];
      
      // 5. Layout the gauge chart.
      var gaugeLayout = { 
          width: 460, 
          height: 390,
          margin: { 
              l: 50,
              r: 50,
              t: 50, 
              b: 50 
          }
      };
  
      // 6. Plot gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);    
  
    });
  }
  