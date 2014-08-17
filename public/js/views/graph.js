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
		
		var jsonData = {
						  "cols": [
								{label: 'Ano',"type":"string"},
								{label: 'Orçado',"type":"number"},
								{label: 'Realizado',"type":"number"}
							  ],
						  "rows": [dadosObject[0]]
								//[ {"c":[{"v":"2013"},{"v":50564.92},{"v":281.6}]}]
								//{"c":[{"v":"2014"},{"v":50564.92},{"v":4963.03}]}
						};
						
		//alert(JSON.stringify(dadosObject));
		//alert(JSON.stringify(dadosObject));
		//alert(JSON.stringify(jsonData));
						
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