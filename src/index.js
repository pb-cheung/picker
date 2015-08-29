define(function(require,exports,module){
	var $ = require("common/jquery");
	var PICKER = require("lib/picker");


	var obj = {
		init: function(){
			//console.log(picker);
			var picker1 = new PICKER();
			picker1.addSelect($("#select-pcd"));
		}
	}

	obj.init();
	module.exports = obj;
});