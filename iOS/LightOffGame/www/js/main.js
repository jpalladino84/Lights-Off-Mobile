
var Panel = function(attr){
	this.id = attr.id;
	this.state = attr.state;
	this.north = (attr.north > 0) ? attr.north : null;
	this.south = (attr.south > 0 && attr.south <= 25) ? attr.south : null;
	this.east = (attr.east > 0 && attr.east <= 25) ? attr.east : null;
	this.west = (attr.west > 0) ? attr.west : null;	
}
Panel.prototype.toggle = function toggle(){
	this.state = !this.state;
	$(this).trigger("TOGGLE_EVENT");	
}
Panel.prototype.setState = function setState(state){
	this.state = state;
	$(this).trigger("TOGGLE_EVENT");
}
Panel.prototype.getState = function getState(){
	return this.state;
}

Panel.prototype.reset = function reset(){
	this.state = false;	
	$(this).trigger("TOGGLE_EVENT");
}
var panels = [];
var board = {
	panels: panels,
	init: function(){
		var borderEast = 0;
		var borderWest = 0;
		
		for(var i = 1; i <= 25; i++){
			borderEast++;
			borderWest++;
			var panel = new Panel({id:"panel"+i,state:false,north:i-5,east:i+1,south:i+5,west:i-1});
			$(panel).bind("TOGGLE_EVENT",function(){
				board.draw_panels(this);  			
			})
			this.panels.push(panel);
			
			var panelElem = document.createElement('div');
			panelElem.id = "panel"+i;		
	
			$("#gameBoard")[0].appendChild(panelElem);
			
			$('#'+panelElem.id).live("tap", function(event){	
				var panelId = event.target.id
				var panel;
				for(var i in board.panels){
					if(board.panels[i].id === panelId) {
						panel = board.panels[i];
						break;
					}
				}					
				board.toggle_panels(panel);			
			})
			
			if(borderEast % 5 == 0)
				panel.east = null;
			
			if(borderWest % 5 == 1)
				panel.west = null;
			
			this.draw_panels(panel);
		}
	},
	draw_panels: function(panel){			
		$("#"+panel.id).removeClass(!panel.state ? "on" : "off").addClass(panel.state ? "on" : "off");			
	},
	setPanels: function(foo){
		if(foo instanceof Array)	
			for(var i in foo)
				this.panels[foo[i]].setState(true);
	},
	getPanel: function(id){
		for(var i in this.panels){
			if(this.panels[i].id == id)
				return this.panels[i];
		}
	},		
	toggle_panels: function(panel){	
		panel.toggle();
		if(panel.north){
			this.panels[panel.north-1].toggle();
		}
		if(panel.south){
			this.panels[panel.south-1].toggle();
		}
		if(panel.east){
			this.panels[panel.east-1].toggle();
		}
		if(panel.west){
			this.panels[panel.west-1].toggle();		
		}												
	},
	resetBoard: function(){
		for(var i in this.panels){
			if(this.panels[i].state)
				this.panels[i].reset();	
		}
	}	
}


