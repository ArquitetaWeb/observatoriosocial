window.GraphView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template(this.model.toJSON()));		
		google.load("visualization", "1", {callback:this.drawVisualization(), packages:["corechart"]});		
        return this;
    },
	
	drawVisualization:function () {
        console.log("In draw visualization");		
		/*var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Work',     11],
          ['Eat',      2],
          ['Commute',  2],
          ['Watch TV', 2],
          ['Sleep',    7]
        ]);*/
		
		//alert(JSON.stringify(teste));		
		var jsonData = {
						  "cols": [
								{label: 'Ano',"type":"string"},
								{label: 'Orçado',"type":"number"},
								{label: 'Realizado',"type":"number"}
							  ],
						  "rows": [								
								{"c":[{"v":"2013"},{"v":277.9},{"v":281.6}]},
								{"c":[{"v":"2014"},{"v":331.9},{"v":null}]}
							  ]
						};
						
		var data = new google.visualization.DataTable(jsonData);
		
		var options = {
          title: 'AQUI FICA TITULO',
		  //is3D: true,
		  //pieHole: 0.4,
		  //legend: 'none',
		  //pieSliceText: 'label',
        };

        //var chart = new google.visualization.PieChart(this.$('#graph').get(0));
		var chart = new google.visualization.ColumnChart(this.$('#graph').get(0));
        chart.draw(data, options);

    }

});