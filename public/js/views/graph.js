window.GraphView = Backbone.View.extend({
	
    initialize:function () {
        this.render();
		var dadosObject;
    },

    render:function () {
		dadosObject = this.model.toJSON();
        $(this.el).html(this.template(this.model.toJSON()));		
		google.load("visualization", "1", {callback:this.drawVisualization, packages:["corechart"]});		
        return this;
    },
	
	drawVisualization:function () {
        console.log("In draw visualization");	
		
		var objCount=0;
		for(_obj in dadosObject) objCount++;
		//alert(objCount);
		
		var newObject = [];
		for (i = 0; i < objCount-2; i++) { 
			newObject.push(dadosObject[i]);
		}
		
		//var objCount=0;
		//for(_obj in newObject) objCount++;
		//alert(objCount);

		var jsonData = {
						  "cols": [
								{label: 'secretaria',"type":"string"},
								{label: 'Orçado',"type":"number"},
								{label: 'Realizado',"type":"number"}
							  ],
						  "rows": newObject
								//[ {"c":[{"v":"2013"},{"v":50564.92},{"v":281.6}]}]
								//{"c":[{"v":"2014"},{"v":50564.92},{"v":4963.03}]}
						};
						
		//alert(JSON.stringify(dadosObject));
		//alert(dadosObject._graph);
		//alert(JSON.stringify(newObject));
		//alert(newObject[0].c[0].f);
		//alert(objCount);
		//alert(JSON.stringify(dadosObject));
		//alert(JSON.stringify(jsonData));
						
		var data = new google.visualization.DataTable(jsonData);		
		
		var options = {
          title: (window.location.href.indexOf("children") == -1) ? 'Orçamento Geral das Secretarias - Prefeitura Municipal' : newObject[0].c[0].v,
		  is3D: true,
		  width: '100%',
		  height: '100%',
		  chartArea: {
            left: "10%",
            top: "5%",
            height: "80%",
            width: "80%"
		  },
		  //pointSize: 15,
		  //pieHole: 0.4,
		  //legend: 'none',
		  //pieSliceText: 'label',
        };
		
		var chart;		
		if (window.location.href.indexOf("stacked") != -1) options['isStacked'] = true;
		if (dadosObject._graph.indexOf("pie") == 0) {
			chart = new google.visualization.PieChart(this.$('#graph').get(0));
		} else if (dadosObject._graph.indexOf("barra") == 0) {
			chart = new google.visualization.BarChart(this.$('#graph').get(0));
		} else if (dadosObject._graph.indexOf("line") == 0) {
			chart = new google.visualization.LineChart(this.$('#graph').get(0));
		} else {
			chart = new google.visualization.ColumnChart(this.$('#graph').get(0));
		}		
				
		var url = location.href;
		var value = url.substring(url.lastIndexOf('/') + 1);
		var newUrl = url.replace(value, 'children?secretaria=')
			
		function selectHandler() {
          var selectedItem = chart.getSelection()[0];
          if (selectedItem) {
            var topping = data.getValue(selectedItem.row, 0);
			location.href = newUrl + topping;					
          }
        }
		
		if (window.location.href.indexOf("children") == -1) { 
			google.visualization.events.addListener(chart, 'select', selectHandler); 
		}
		
        chart.draw(data, options);
		
		function resizeHandler () {
			chart.draw(data, options);
		}
		if (window.addEventListener) {
			window.addEventListener('resize', resizeHandler, false);
		}
		else if (window.attachEvent) {
			window.attachEvent('onresize', resizeHandler);
		}
    }
});