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
			+'<div class="mod-dropdown-menu ui-fl-l ui-mr-medium"><a href="javascript:void(0);" class="button mod-dropdown-menu__switch"><label class="mod-dropdown-menu__label" type="province"></label><i class="mod-dropdown-menu__arrow" type="province"></i></a><ul class="mod-dropdown-menu__list" ul-province="1"><li class="mod-dropdown-menu__item"><a href="javascript:void(0);">选项1</a></li></ul></div><div class="mod-dropdown-menu  ui-fl-l ui-mr-medium"><a href="javascript:void(0);" class="button mod-dropdown-menu__switch"><label class="mod-dropdown-menu__label" type="city"></label><i class="mod-dropdown-menu__arrow" type="city"></i></a><ul class="mod-dropdown-menu__list" ul-city="1"><li class="mod-dropdown-menu__item"><a href="javascript:void(0);">选项1</a></li></ul></div><div class="mod-dropdown-menu ui-fl-l ui-mr-medium"><a href="javascript:void(0);" class="button mod-dropdown-menu__switch"><label class="mod-dropdown-menu__label" type="district"></label><i class="mod-dropdown-menu__arrow" type="district"></i></a><ul class="mod-dropdown-menu__list" ul-district="1"><li class="mod-dropdown-menu__item"><a href="javascript:void(0);">选项1</a></li></ul></div>'
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
		},
		bindEvent: function(){

		}
	};

	var Distpikcer = function(target){
		this.target = target;
		this.$element = $(target).find("[data-toggle='distpicker']");
		this.placeholders = $.extend({}, this.defaults);
		this.defaults = {
			autoSelect: true,
			province: "--选择省--",
			city: "--选择市--",
			district: "--选择区--",
			placeholder: true	//占位符，即省市区三个下拉列表选项的特殊选项，如“——选择省——”
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
				this["ul" + type] = $(this.target).find("[ul-" + type + "]");
				this["label" + type] = this["ul" + type].siblings().find("label");
			},this));	

			this.addListeners();
			this.reset();
			this.addCustomEvents();
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
		addCustomEvents: function(){
			$.each(["province", "city", "district"], $.proxy(function(i,type){

			},this));
			$(this.target).on("click",$.proxy(function(event){
				console.log(event.target.tagName)
				var srcEvent = event.target,
				 	tagName = event.target.tagName;
				if(tagName == "LABEL"){
					var type = $(srcEvent).attr("type");		
					this["ul" + type].toggle();
				}else if(tagName == "A"){
					var $srcEvent = $(srcEvent),
						type = $srcEvent.attr("type"),
						index = $srcEvent.attr("index");
					if(type){ //点击是列表中的元素，触发select的选择操作
						this["label" + type].html($srcEvent.html());
						this["$" + type][0].selectedIndex = index;
						this["$" + type].trigger("change");
						this["ul" + type].hide();
					}else{//点击的是label外层的A标签	
						$(srcEvent).siblings().toggle();
					}
					return false;
				}else if(tagName == "I"){
					var type = $(srcEvent).attr("type");		
					this["ul" + type].toggle();
				}

			},this));
		},
		output: function(type){
			var defaults = this.defaults,
				$select = this["$" + type],
				customUl = this["ul" + type],
				customlabel = this["label" + type],
				data = {},
				options = [],
				matched,
				placeholders = this.placeholders;

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

					if (selected) {
            			matched = true;
          			}

					options.push({
						zipcode: zipcode,
						address: address,
						selected: selected
					});
				});
			}

			if (!matched) {//如果没有默认选中的，且参数“autoSelect”为true（自动选择），那么这个下拉菜单默认选中第一个option
        		if (options.length && (defaults.autoSelect || defaults.autoselect)) {
          			options[0].selected = true;
        		}

        		// Save the unmatched value as a placeholder at the first output
        		if (!this.active && value) {
          			placeholders[type] = value;
        		}
      		}

			// Add placeholder option 设置占位符例如：“--省--”,将它们插入options数组最开头
      		if (defaults.placeholder) {
       			options.unshift({
          			zipcode: '',
          			address: placeholders[type],
          			selected: false
        		});
      		}

			//console.log(this.template(options));
			customUl.html(this.ultemplete(options,type));
			$select.html(this.template(options));
			customlabel.html($select.val());
		},
		template: function(options){
			var html = '';

      		$.each(options, function (i, option) {
        		html += (
          			'<option value="' +
          			(option.address ? option.address : '') +
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
		},
		ultemplete: function(options, type){
			var html = "";
			$.each(options, function(i, option){
				html += (
					'<li class="mod-dropdown-menu__item">'+
					'<a href="javascript:void(0);"'+
					' value="'+
					(option.address && option.zipcode ? option.address : '') +
					'"' +
					' data-zipcode="' + 
					(option.zipcode || '') +
					'"' +
					' type="' + 
					type + 
					'"' + 
					' index="' +
					i + 
					'"' +
					(option.selected ? ' selected' : '') +
					'>'+
					(option.address || '') + 
					'</a></li>'
				);
			});
			return html;
		}
	}

	module.exports = PICKER;
});