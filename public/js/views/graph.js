window.GraphView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template(this.model.toJSON()));		
		google.load("visualization", "1", {callback:this.drawVisualization, packages:["corechart"]});		
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
		
		
		var jsonData = {
						  "cols": [
								{"type":"string"},
								{"type":"number"}
							  ],
						  "rows": [
								{"c":[{"v":"Mushrooms","f":null},{"v":3,"f":null}]},
								{"c":[{"v":"Onions","f":null},{"v":1,"f":null}]},
								{"c":[{"v":"Olives","f":null},{"v":1,"f":null}]},
								{"c":[{"v":"Zucchini","f":null},{"v":1,"f":null}]},
								{"c":[{"v":"Pepperoni","f":null},{"v":2,"f":null}]}
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

        var chart = new google.visualization.PieChart(this.$('#graph').get(0));
        chart.draw(data, options);

    }

});