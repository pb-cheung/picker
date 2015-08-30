define(function(require,exports,module){
	var $ = require("common/jquery");
	require("lib/distpicker.data");
	
	var PICKER = function(){
		target: document.body
	}

	PICKER.prototype = {
		
		domSelect: function(){
			return '<div data-toggle="distpicker">'+
			'<select data-province="---- 选择省 ----"></select>'+
			'<select data-city="---- 选择市 ----"></select>'+
			'<select data-district="---- 选择区 ----"></select>'+
			'</div>'
			+'<div class="mod-dropdown-menu ui-fl-l ui-mr-medium"><a href="javascript:void(0);" class="button mod-dropdown-menu__switch"><label class="mod-dropdown-menu__label">北京</label><i class="mod-dropdown-menu__arrow"></i></a><ul class="mod-dropdown-menu__list"><li class="mod-dropdown-menu__item"><a href="javascript:void(0);">选项1</a></li></ul></div><div class="mod-dropdown-menu  ui-fl-l ui-mr-medium"><a href="javascript:void(0);" class="button mod-dropdown-menu__switch"><label class="mod-dropdown-menu__label"></label><i class="mod-dropdown-menu__arrow"></i></a><ul class="mod-dropdown-menu__list"><li class="mod-dropdown-menu__item"><a href="javascript:void(0);">选项1</a></li></ul></div><div class="mod-dropdown-menu ui-fl-l ui-mr-medium"><a href="javascript:void(0);" class="button mod-dropdown-menu__switch"><label class="mod-dropdown-menu__label"></label><i class="mod-dropdown-menu__arrow"></i></a><ul class="mod-dropdown-menu__list"><li class="mod-dropdown-menu__item"><a href="javascript:void(0);">选项1</a></li></ul></div>'
			;
		},
		domNewoptions: function(){
			return '<li class="mod-dropdown-menu__item"><a href="javascript:void(0);"></a></li>';
		},
		addSelect: function(target){//target是css选择器字符串
			//console.log(ChineseDistricts);
			var _this = this;
			_this.target = target;
			_this.initDom();
			var data = new Distpikcer(target);
		},
		initDom: function(){//初始化DOM结构
			var _this = this;
			$(_this.target).html(_this.domSelect());
		}
	};

	var Distpikcer = function(target){
		this.target = target;
		this.$element = $(target).find("[data-toggle='distpicker']");
		this.defaults = {
			province: "--选择省--",
			city: "--选择市--",
			district: "--选择区--"
		};
		this.init();
	}
	Distpikcer.prototype = {
		constructor: Distpikcer,

		data: ChineseDistricts,

		init: function(){
			var $select = this.$element.find("select"),
				length = $select.length,
				data = {};

			//获取三个province、city、district三个select的jquery对象	
			$.each(["province", "city", "district"], $.proxy(function(i,type){
				this["$" + type] = $select.filter("[data-" + type + "]");
			},this));	

			this.addListeners();
			this.reset();
		},
		addListeners: function(){
			var NAMESPACE = "."+this.target,
				EVENT_CHANGE = "change" + NAMESPACE;
			if(this.$province){
				this.$province.on(EVENT_CHANGE, $.proxy(function(){
					this.output("city");
					this.output("district");
				},this));
			}
			if(this.$city){
				this.$city.on(EVENT_CHANGE, $.proxy(function(){
					this.output("district");
				},this));
			}
		},
		output: function(type){
			var defaults = this.defaults,
				$select = this["$" + type],
				data = {},
				options = [];

			value = defaults[type];
			zipcode = (
				type === "province" ? 1 : 
				type === "city" ? this.$province && this.$province.find(":selected").data("zipcode") : 
				type === "district" ? this.$city && this.$city.find(":selected").data("zipcode") : zipcode
			);	

			data = $.isNumeric(zipcode) ? this.data[zipcode] : null;

			if($.isPlainObject(data)){
				$.each(data, function(zipcode, address){
					var selected = (address === value);

					options.push({
						zipcode: zipcode,
						address: address,
						selected: selected
					});
				});
			}

			console.log(this.template(options));
			$select.html(this.template(options));
		},
		template: function(options){
			var html = '';

      		$.each(options, function (i, option) {
        		html += (
          			'<option value="' +
          			(option.address && option.zipcode ? option.address : '') +
          			'"' +
          			' data-zipcode="' +
          			(option.zipcode || '') +
          			'"' +
          			(option.selected ? ' selected' : '') +
          			'>' +
          			(option.address || '') +
          			'</option>'
        		);
       		});
      		return html;
		},
		reset: function(deep){
			if(!deep){
				this.output("province");
				this.output("city");
				this.output("district");
			}else if(this.$province){
				//this.$province.find(":first").prop("selected",true).tr;
			}
		}
	}

	module.exports = PICKER;
});