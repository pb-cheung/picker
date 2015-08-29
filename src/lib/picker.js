define(function(require,exports,module){
	var $ = require("common/jquery");
	require("lib/distpicker.data");
	
	function PICKER(){
		target: document.body
	}

	PICKER.prototype = {
		
		DOM: function(){
			return '<div data-toggle="distpicker">'+
		'<select data-province="---- 选择省 ----" id="province"></select>'+
		'<select data-city="---- 选择市 ----" id="city"></select>'+
		'<select data-district="---- 选择区 ----" id="area"></select>'+
		'</div>'
		+'<div class="mod-dropdown-menu ui-fl-l ui-mr-medium"><a href="javascript:void(0);" class="button mod-dropdown-menu__switch"><label class="mod-dropdown-menu__label">北京</label><i class="mod-dropdown-menu__arrow"></i></a><ul class="mod-dropdown-menu__list"><li class="mod-dropdown-menu__item"><a href="javascript:void(0);">选项1</a></li></ul></div><div class="mod-dropdown-menu  ui-fl-l ui-mr-medium"><a href="javascript:void(0);" class="button mod-dropdown-menu__switch"><label class="mod-dropdown-menu__label"></label><i class="mod-dropdown-menu__arrow"></i></a><ul class="mod-dropdown-menu__list"><li class="mod-dropdown-menu__item"><a href="javascript:void(0);">选项1</a></li></ul></div><div class="mod-dropdown-menu ui-fl-l ui-mr-medium"><a href="javascript:void(0);" class="button mod-dropdown-menu__switch"><label class="mod-dropdown-menu__label"></label><i class="mod-dropdown-menu__arrow"></i></a><ul class="mod-dropdown-menu__list"><li class="mod-dropdown-menu__item"><a href="javascript:void(0);">选项1</a></li></ul></div>'
		;
		},
		addSelect: function(target){
			//console.log(ChineseDistricts);
			var _this = this;
			_this.target = target;
			_this.initDom();

		},
		initDom: function(){//初始化DOM结构
			var _this = this;
			_this.target.html(_this.DOM());
		}
	}

	module.exports = PICKER;
});