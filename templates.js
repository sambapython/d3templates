var margins = {'top':30, 'bottom':40,'left':60,'right':30};
var width = 500;
var height = 500;
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
	axis.append("text")
	    .attr("text-anchor", "middle")
	    .attr("transform","translate("+ (svg_width-margins.left)/2 +","+(margins.bottom-5)+")")
	    .attr("fill","blue")
	    .attr('font-size',svg_width/25)
	    .text(axis_name)



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
	axis.append("text")
	    .attr("text-anchor", "middle")
	    .attr("transform","translate(-"+margins.left/2+","+(svg_height-margins.top)/2+")")
	    .attr("fill","blue")
	    .attr('font-size',svg_width/25)
	    .text(axis_name)
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

	g.append("path")
			.datum(y_param_values)
			.attr("class","line")
			.attr("stroke",config.line_color||"blue")
			.attr("fill",'None')
			.attr("d", line);
}
function draw_bargraph(config){
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
	draw_xaxis({'data':data,
				'target':target,
				'svg_width':svg_width,
				'svg_height':svg_height,
				'tick_param':x_param,
                'axis_name':config.xaxis_name || x_param,
                'margins':margins,
                'gap_from_yaxis':margins.left/2
            });
	draw_yaxis({'data':data,
				'target':target,
				'svg_width':svg_width,
				'svg_height':svg_height,
				'tick_param':y_param,
                 'axis_name':config.yaxis_name || y_param,
                 'margins':margins,
                 'scale': yscale,
                 'values': y_param_values.reverse()
             });
	var g = target.append("g").attr("transform","translate("+margins.left+","+margins.top+")");
	g.attr('transform',"translate("+(svg_width+margins.right)+","+(svg_height+margins.top)+"),rotate(180)")
	g.selectAll("rect")
				.data(y_param_values)
				.enter()
				.append("rect")
				.attr("width",svg_width/(num_ticks*2))
				.attr("height",function(d){ return svg_height-yscale(d)})
				.attr("x",function(d,i){ return i*xfactor})
				.attr('y',0)
				.attr("fill",config.bar_colors||"blue")
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
	var margins = config.margins || margins;
	var target = config.target;
	var x_param = config.x_param;
	var y_param = config.y_param;
	var x_param_values = data.map(function(d){return d[x_param]});
	var y_param_values = data.map(function(d){return d[y_param]});
	var num_ticks = config.num_ticks || data.length;
	var xfactor = svg_width/num_ticks;
	var yfactor = svg_height/num_ticks;
	var keys = Object.keys(data[0]).slice(1)
	var totals = total(data, keys)
	var yscale = d3.scaleLinear()
	               .domain([0,d3.max(totals)])
	               .range([svg_height,0]);
	var color = d3.scaleOrdinal()
    					.range(["#98abc5", "#8a89a6", "#7b6888"])
    					.domain(keys);
	draw_xaxis({'data':data,
				'target':target,
				'svg_width':svg_width,
				'svg_height':svg_height,
				'tick_param':x_param,
                'axis_name':config.xaxis_name || x_param,
                'margins':margins,
                'gap_from_yaxis':margins.left/2
            });
	draw_yaxis({'data':data,
				'target':target,
				'svg_width':svg_width,
				'svg_height':svg_height,
				'tick_param':y_param,
                 'axis_name':config.yaxis_name || y_param,
                 'margins':margins,
                 'scale': yscale,
                 //'values': y_param_values.reverse()
             });
	var g = target.append("g").attr("transform","translate("+margins.left+","+margins.top+")");
	g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d,i) { return i*xfactor; })
      .attr("y", function(d) { return yscale(d[1]); })
      .attr("height", function(d) { return yscale(d[0]) - yscale(d[1]); })
      .attr("width", svg_width/(num_ticks*2));
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
	var color = d3.scaleOrdinal()
    					.range(["#98abc5", "#8a89a6", "#7b6888"])
    					.domain(keys);
    var scale = d3.scaleLinear()
    				.domain([0,d3.max(values)])
    				.range([0,svg_height])

}