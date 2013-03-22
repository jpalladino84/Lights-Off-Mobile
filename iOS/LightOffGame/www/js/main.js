
var BoardManager = {};
BoardManager.panels = [];

BoardManager.Panel = function(attr){
	this.id = attr.id;
	this.state = attr.state;
	this.north = (attr.north > 0) ? attr.north : null;
	this.south = (attr.south > 0 && attr.south <= 25) ? attr.south : null;
	this.east = (attr.east > 0 && attr.east <= 25) ? attr.east : null;
	this.west = (attr.west > 0) ? attr.west : null;	
}
BoardManager.Panel.prototype.toggle = function toggle() {
	this.state = !this.state;
	$(this).trigger("TOGGLE_EVENT");	
}
BoardManager.Panel.prototype.setState = function setState(state) {
	this.state = state;
	$(this).trigger("TOGGLE_EVENT");
}
BoardManager.Panel.prototype.getState = function getState() {
	return this.state;
}

BoardManager.Panel.prototype.reset = function reset() {
	this.state = false;	
	$(this).trigger("TOGGLE_EVENT");
}

BoardManager.board = {
    panels: BoardManager.panels,
	init: function(){
		var borderEast = 0;
		var borderWest = 0;
		
		for(var i = 1; i <= 25; i++){
			borderEast++;
			borderWest++;
			var panel = new BoardManager.Panel({ id: "panel" + i, state: false, north: i - 5, east: i + 1, south: i + 5, west: i - 1 });
			$(panel).bind("TOGGLE_EVENT",function(){
			    BoardManager.board.draw_panels(this);
			})
			this.panels.push(panel);
			
			var panelElem = document.createElement('div');
			panelElem.id = "panel"+i;		
	
			$("#gameBoard")[0].appendChild(panelElem);
			
			$('#'+panelElem.id).live("tap", function(event){	
				var panelId = event.target.id
				var panel;
				for (var i in BoardManager.board.panels) {
				    if (BoardManager.board.panels[i].id === panelId) {
				        panel = BoardManager.board.panels[i];
						break;
					}
				}					
				BoardManager.board.toggle_panels(panel);			
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
	resetBoard: function () {
	    if (LevelManager.CurrentLevel) {
	        for (var i in this.panels) {
	            if (this.panels[i].state)
	                this.panels[i].reset();
	        }
	        LevelManager.Level.init(LevelManager.CurrentLevel);
	        return;
	    } else {
	        for (var i in this.panels) {
	            if (this.panels[i].state)
	                this.panels[i].reset();
	        }
	    }
	}	
}

var LevelManager = {};
LevelManager.CurrentLevel = {};
LevelManager.Level =  {
    id: "",
    init : function(level) {
        this.id = level.name;
        this.pattern = level.pattern;

        BoardManager.board.setPanels(this.pattern);
        LevelManager.CurrentLevel = level;
    }
}

LevelManager.Level1 = {
    name: "Level 1",
    pattern: [7, 11, 12, 13, 17]
};

LevelManager.Level2 = {
    name: "Level 2",
    pattern: [0, 1, 3, 4, 5, 9, 15, 19, 20, 21, 23, 24]
};

LevelManager.Level3 = {
    name: "Level 3",
    pattern: [0, 4, 6, 8, 16, 18, 20, 24]
}

LevelManager.Level4 = {
    name: "Level 4",
    pattern: [2, 10, 14, 22]
}

LevelManager.Level5 = {
    name: "Level 5",
    pattern: [12]
}