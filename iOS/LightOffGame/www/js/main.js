
var BoardManager = {};
BoardManager.panels = [];
BoardManager.activePanels = [];
BoardManager.freeplay = false;

BoardManager.Panel = {
	init: function(attr){
		return {
			id : attr.id,
			state : attr.state,
			north : (attr.north > 0) ? attr.north : null,
			south : (attr.south > 0 && attr.south <= 25) ? attr.south : null,
			east : (attr.east > 0 && attr.east <= 25) ? attr.east : null,
			west : (attr.west > 0) ? attr.west : null,
			toggle: function() {
				this.state = !this.state;
				$(this).trigger("TOGGLE_EVENT");			    
			},
			setState: function(state) {
				this.state = state;
				$(this).trigger("TOGGLE_EVENT");
			},
			getState: function() {
				return this.state;
			},
			reset: function() {
				this.state = false;	
				$(this).trigger("TOGGLE_EVENT");
			}
		}
	}
}

BoardManager.board = {
    panels: BoardManager.panels,
	init: function(){
		var borderEast = 0;
		var borderWest = 0;
		
		for(var i = 1; i <= 25; i++){
			borderEast++;
			borderWest++;
			var panel = BoardManager.Panel.init({ id: "panel" + i, state: false, north: i - 5, east: i + 1, south: i + 5, west: i - 1 });
		    $(panel).bind("TOGGLE_EVENT", function() {
		        BoardManager.board.draw_panels(this);
		    });
			this.panels.push(panel);
			
			var panelElem = document.createElement('div');
			panelElem.id = "panel"+i;		
	
			$("#gameBoard")[0].appendChild(panelElem);
			
			$('#' + panelElem.id).live("tap", function (event) {
			    var panelId = event.target.id, panel = {};

			    for (var i in BoardManager.board.panels) {
			        if (BoardManager.board.panels[i].id === panelId) {
			            panel = BoardManager.board.panels[i];
			            break;
			        }
			    }
			    BoardManager.board.toggle_panels(panel);

			    if (BoardManager.board.checkBoardStatus() && !BoardManager.freeplay) {
			        $(LevelManager.CurrentLevel).trigger("LEVEL_COMPLETE");
			        
			    }
			});
			
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
		    this.panels[panel.north - 1].toggle();
		}
		if(panel.south){
			this.panels[panel.south-1].toggle();
		}
		if(panel.east){
			this.panels[panel.east-1].toggle();
		}
	    if (panel.west) {
	        this.panels[panel.west - 1].toggle();
	    }
	},
	resetBoard: function (override) {
	    if (LevelManager.CurrentLevel && !override) {
	        for (var i in this.panels) {
	            if (this.panels[i].state)
	                this.panels[i].reset();
	        }
	        LevelManager.Level.init(LevelManager.CurrentLevel);
	        return;
	    } else if (override){
	        for (var i in this.panels) {
	            if (this.panels[i].state)
	                this.panels[i].reset();
	        }
	    }
	    BoardManager.activePanels = [];
	},
	checkBoardStatus: function () {
	    for (var i in BoardManager.board.panels)
	        if (BoardManager.board.panels[i].state)
	            return false;

	    return true;
	}
}

var LevelManager = {};
LevelManager.CurrentLevel = {};
LevelManager.Level = {
    id: 0,
    name: "",
    score: 0,
    init: function(level) {
        this.id = level.id;
        this.name = level.name;
        this.pattern = level.pattern;

        BoardManager.freeplay = false;
        BoardManager.board.resetBoard(true);
        BoardManager.board.setPanels(this.pattern);
        $(LevelManager.CurrentLevel).unbind("LEVEL_COMPLETE");
        LevelManager.CurrentLevel = level;        
        $(LevelManager.CurrentLevel).bind("LEVEL_COMPLETE", function (e) {
            $.mobile.changePage($("#levelSummary"), "pop");            
        });
        BoardManager.activePanels = [];
    }
};

LevelManager.getLevel = function(levelId) {
    return LevelManager["Level" + levelId];
};

LevelManager.Level1 = {
    id: 1,
    name: "Level 1",
    pattern: [7, 11, 12, 13, 17],
    moves: 1
};

LevelManager.Level2 = {
    id: 2,
    name: "Level 2",
    pattern: [0, 1, 3, 4, 5, 9, 15, 19, 20, 21, 23, 24],
    moves: 4
};

LevelManager.Level3 = {
    id: 3,
    name: "Level 3",
    pattern: [0, 4, 6, 8, 16, 18, 20, 24],
    moves: 4
}

LevelManager.Level4 = {
    id: 4,
    name: "Level 4",
    pattern: [0, 1, 3, 4, 10, 11, 13, 14, 20, 21, 23, 24],
    moves: 6
}

LevelManager.Level5 = {
    id: 5,
    name: "Level 5",
    pattern: [1, 5, 7, 11, 13, 17, 19, 23],
    moves: 8
}