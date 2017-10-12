var width = 500;
var height = 500;
var margins = {'top':30, 'bottom':40,'left':60,'right':30};
function get_tooltip(config){
	var tooltip = d3.select("#"+config.div_id).append('div')                                              
          .attr('class', 'tooltip')
          .attr("width","360px")
          .attr("height","360px");
    tooltip.append('div')                                       
          .attr('class', 'label');                                
             
    tooltip.append('div')                                         
          .attr('class', 'value');
    return tooltip

}
function tooltip_moseover(tooltip, label, value){
			tooltip.select('.label').html(label);
            tooltip.select('.value').html(value);
            tooltip.style('display', 'block');

}
function tooltip_moseout(tooltip){
tooltip.style('display', 'None');
}


function draw_xaxis(config){
	/*
	data should be in the form of list of objects
	*/
	var svg_width = config.svg_width || width
	var svg_height = config.svg_height || height
	var margins = config.margins || margins
	var target = config.target
	var data = config.data;
	var tick_param = config.tick_param || "X-AXIS"
	var tick_values = data.map( function(d){ return d[tick_param]});
	var num_ticks = config.num_ticks || data.length;
	var axis_name = config.axis_name || tick_param
	var xfactor = svg_width/data.length
    var xscale = d3.scaleOrdinal()
               .domain(tick_values)
               .range(data.map(function(d,i){ return i*xfactor}))
    var gap_from_yaxis = config.gap_from_yaxis || 0
	var scale = config.scale || xscale;
	var xaxis=d3.axisBottom(scale)
	            .ticks(num_ticks)
	axis = target.append("g")
	      .attr("transform","translate("+(margins.left+gap_from_yaxis)+","+(svg_height+margins.top)+")").call(xaxis)
	// axis.append("text")
	//     .attr("text-anchor", "middle")
	//     .attr("transform","translate("+ (svg_width-margins.left)/2 +","+(margins.bottom-5)+")")
	//     .attr("fill","blue")
	//     .attr('font-size',svg_width/25)
	//     .text(axis_name)
}
function draw_yaxis(config){
	/*
	data should be in the form of list of objects
	*/
	var svg_width = config.svg_width || width
	var svg_height = config.svg_height || height
	var margins = config.margins || margins
	var target = config.target
	var data = config.data;
	var tick_param = config.tick_param || "Y-AXIS"
	var tick_values = config.values || data.map( function(d){ return d[tick_param]});
	var num_ticks = config.num_ticks || data.length;
	var axis_name = config.axis_name || tick_param;
	var xfactor = svg_width/num_ticks;
	var max_param = d3.max(tick_values)
    var yscale = d3.scaleLinear()
               .domain([0, max_param])
               .range([height,0])
	var scale = config.scale || yscale;
	var yaxis=d3.axisLeft(scale)
	            .ticks(num_ticks)
	axis = target.append("g")
	      .attr("transform","translate("+margins.left+","+margins.top+")").call(yaxis)
	// axis.append("text")
	//     .attr("text-anchor", "middle")
	//     .attr("transform","translate(-"+margins.left/2+","+(svg_height-margins.top)/2+")")
	//     .attr("fill","blue")
	//     .attr('font-size',svg_width/25)
	//     .text(axis_name)
}
function draw_linegraph(config) {
	var data = config.data;
	var svg_width = config.svg_width || width;
	var svg_height = config.svg_height || height;
	var margins = config.margins || margins;
	var target = config.target;
	var x_param = config.x_param;
	var y_param = config.y_param;
	var x_param_values = data.map(function(d){return d[x_param]});
	var y_param_values = data.map(function(d){return d[y_param]});
	var num_ticks = config.num_ticks || data.length;
	var xfactor = svg_width/num_ticks;
	var yfactor = svg_height/num_ticks;
	var yscale = d3.scaleLinear()
	               .domain([0,d3.max(y_param_values)])
	               .range([svg_height,0]);
	var line = d3.line()
				.x(function(d,i){ return i*xfactor})
				.y(function(d){ return yscale(d)})
				.curve(d3.curveMonotoneX);
	draw_xaxis({'data':data,
				'target':target,
				'svg_width':svg_width,
				'svg_height':svg_height,
				'tick_param':x_param,
                'axis_name':config.xaxis_name || x_param,
                'margins':margins,
            });
	draw_yaxis({'data':data,
				'target':target,
				'svg_width':svg_width,
				'svg_height':svg_height,
				'tick_param':y_param,
                 'axis_name':config.yaxis_name || y_param,
                 'margins':margins,
                 'scale': yscale
             });

	var g = target.append("g").attr("transform","translate("+margins.left+","+margins.top+")");

	var path = g.append("path")
			.datum(y_param_values)
			.attr("class","line")
			.attr("stroke",config.line_color||"blue")
			.attr("fill",'None')
			.attr("d", line);
	var tooltip = get_tooltip(config)
		g.selectAll("dot")	
        .data(y_param_values)			
    .enter().append("circle")								
        .attr("r", 5)		
        .attr("cx", function(d,i) { return i*xfactor; })		 
        .attr("cy", function(d) { return yscale(d); })	
        .on("mouseover", function(d,i){
        	tooltip_moseover(tooltip, x_param_values[i], d)
        })
        .on("mouseout", function(d) {
		            	tooltip_moseout(tooltip)
		             });
}
function draw_bargraph(config){
	var data = config.data;
	var svg_width = config.svg_width || width;
	var svg_height = config.svg_height || height;
	var margin = config.margins || margins;
	var target = config.target;
	var x_param = config.x_param;
	var y_param = config.y_param;
    width = svg_width - margin.left - margin.right,
    height = svg_height - margin.top - margin.bottom;

	// set the ranges
	var x = d3.scaleBand()
	          .range([0, width])
	          .padding(0.1)
	          .domain(data.map(function(d) { return d[x_param]; }));
	var y = d3.scaleLinear()
	          .range([height, 0])
	          .domain([0, d3.max(data, function(d) { return d[y_param]; })]);

	          
	// append the svg object to the body of the page
	// append a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg = d3.select("#"+config.div_id).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", 
	          "translate(" + margin.left + "," + margin.top + ")");


	  // append the rectangles for the bar chart
	  svg.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d[x_param]); })
	      .attr("width", x.bandwidth())
	      .attr("y", function(d) { return y(d[y_param]); })
	      .attr("height", function(d) { return height - y(d[y_param]); });

	  // add the x Axis
	  svg.append("g")
	      .attr("transform", "translate(0," + height + ")")
	      .call(d3.axisBottom(x));

	  // add the y Axis
	  svg.append("g")
	      .call(d3.axisLeft(y));


}
function total(data, keys) {
	return data.map(function(d){
		s=0
		for (var i=0; i<keys.length; i++){
			s=s+d[keys[i]]
		}; return s;
	})
}

function draw_stackedbarchar(config){
	var data = config.data;
	var svg_width = config.svg_width || width;
	var svg_height = config.svg_height || height;
	var margin = config.margins || margins;
	var target = config.target;
	var x_param = config.x_param;
	var y_param = config.y_param;
	var x_param_values = data.map(function(d){return d[x_param]});
	var y_param_values = data.map(function(d){return d[y_param]});
	var num_ticks = config.num_ticks || data.length;
	var keys = Object.keys(data[0]).slice(1)
	var totals = total(data, keys)
	var width = svg_width - margin.left - margin.right;
    var height = svg_height - margin.top - margin.bottom;

    var svg = d3.select("#"+config.div_id).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom);
	var g= svg.append("g")
	    .attr("transform", 
	          "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scaleBand()
	    .rangeRound([0, width])
	    .padding(0.3)
	    .align(0.3)
	    x.domain(data.map(function(d) { return d[x_param]; }));

	var y = d3.scaleLinear()
	    .range([height, 0])
	    y.domain([0, d3.max(totals)]).nice();

	var z = d3.scaleOrdinal(d3.schemeCategory20)
				.domain(keys);
	var stack = d3.stack();

	g.selectAll(".serie")
    .data(stack.keys(keys)(data))
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data[x_param]); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(num_ticks))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks(num_ticks+3).pop()))
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .attr("fill", "#000")
      .text(y_param);

  var legend = g.selectAll(".legend")
    .data(keys.reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
      .style("font", "10px sans-serif");

  legend.append("rect")
      .attr("x", width + 18)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width + 44)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .text(function(d) { return d; });  
}

function draw_pie(config){

	var data = config.data;
	var svg_width = config.svg_width || width;
	var svg_height = config.svg_height || height;
	var margins = config.margins || margins;
	var target = config.target;
	var name_param = config.name_param
	var value_param = config.value_param
	var keys = data.map(function(d){ return d[name_param]})
	var values = data.map(function(d){return d[value_param]})
	var color = d3.scaleOrdinal(d3.schemeCategory10);
	var radius = Math.min(svg_height, svg_width) / 2
    var pie = d3.pie()
    			.value(function(d){return d[value_param]})

    var arc = d3.arc()
  		.innerRadius(0)
  		.outerRadius(radius);
  	var slices = pie(data)
  	var g = target.append("g").attr("transform","translate("+(margins.left+svg_width/2)+","+(margins.bottom+svg_height/2)+")");

	var g1 = g.selectAll('.arc')
  	 .data(slices)
     .enter()
     .append('g')
     .attr("class","arc");

	var tooltip = get_tooltip(config)

    g1.append("path")
     .attr('d', arc)
     .attr('fill', function(d) {
          return color(d.data[value_param]);
        })
     .on("mouseover", function(d) {
     		tooltip_moseover(tooltip,d.data[name_param],d.data[value_param])       	
		             })
	 .on("mouseout", function(d) {
		            	tooltip_moseout(tooltip)
		             });
    var labelArc = d3.arc()
    	.outerRadius(radius)
    	.innerRadius(0);
    	
    var vlaueArc = d3.arc()
    	.outerRadius(radius*2+margins.bottom)
    	.innerRadius(0);
     // inside text
     g1.append("text")
      .attr("transform", function(d) { centroid = labelArc.centroid(d);
      	return "translate(" + centroid + ")"; })
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .text(function(d) { return d.data[value_param]; })
      .attr("fill","black")
      .attr("font-size",10);

      //out side text
      g1.append("text")
      .attr("transform", function(d) { centroid = vlaueArc.centroid(d);
      	return "translate(" + centroid + ")"; })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.data[name_param]; })
      .attr("fill","black");
      if(config.chart_name){
      	target.append("text").attr("class","chartname").text(config.chart_name)
      						.attr("transform","translate("+(svg_width+margins.right)/2+","+(svg_height+margins.left)+")").attr("fill","black")


      }
      

}