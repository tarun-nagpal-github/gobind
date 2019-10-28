(function($) {
	
	window.URL = window.URL || window.webkitURL;
	
	window.lumise_create_thumbn = function(ops) {
				
		var img = new Image();
    		img.onload = function(){
	    		
	    		var cv = window.creatThumbnCanvas ? 
	    				 window.creatThumbnCanvas : 
	    				 window.creatThumbnCanvas = document.createElement('canvas');
	    		
	    		cv.width = (ops.width ? ops.width : (ops.height*(this.naturalWidth/this.naturalHeight)));
	    		cv.height = (ops.height ? ops.height : (ops.width*(this.naturalHeight/this.naturalWidth)));
	    		
	    		var ctx = cv.getContext('2d'),
	    			w = this.naturalHeight*(cv.width/this.naturalWidth) >= cv.height ? 
	    				cv.width : this.naturalWidth*(cv.height/this.naturalHeight), 
	    			h = w == cv.width ? this.naturalHeight*(cv.width/this.naturalWidth) : cv.height, 
	    			l = w == cv.width ? 0 : -(w-cv.width)/2, 
	    			t = h == cv.height ? 0 : -(h-cv.height)/2;
	    			
	    		ctx.fillStyle = ops.background? ops.background : '#fff';
				ctx.fillRect(0, 0, cv.width, cv.height); 	
	    		ctx.drawImage(this, l, t, w, h);
	    		
	    		ops.callback(cv.toDataURL('image/jpeg', 100));
	    		
	    		delete ctx;
	    		delete cv;
	    		delete img;
	    		
    		}
    		
    	img.src = ops.source;
			
	};
	
	window.lumise_validate_file = function(file) {
		
		if (['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml'].indexOf(file.type) === -1)
			return false;
		if (file.size > 5242880)
			return false;
		
		return true;
		
	}
	
	var trigger = function(obj, id) {
		
		if (id) {
			if (obj.el.data('trigger-id') == id)
				return;
			else obj.el.data({'trigger-id': id});
		}
		
		var func;
		for( var ev in obj.events ){

			if( typeof obj.events[ev] == 'function' )
				func = obj.events[ev];
			else if( typeof obj[obj.events[ev]] == 'function' )
				func = obj[obj.events[ev]];
			else continue;
			
			ev = ev.split(',');
			
			ev.map(function(evs){
				
				evs = evs.split(':');

				if(evs[1] === undefined)evs[1] = 'click';
				
				if (evs[0] === '')
					obj.el.on( evs[1], obj, func );
				else obj.el.find( evs[0] ).on( evs[1], obj, func );
				
			});

		}
	},
		invert = function(color) {
			
			var r,g,b;
			
			if (color.indexOf('rgb') > -1) {
				
				color = color.split(',');
				r = parseInt(color[0].trim());
				g = parseInt(color[1].trim());
				b = parseInt(color[2].trim());
				
			} else {
				if (color.length < 6)
					color += color.replace('#', '');
				var cut = (color.charAt(0)=="#" ? color.substring(1,7) : color.substring(0,6));
				r = (parseInt(cut.substring(0,2),16)/255)*0.213;
				g = (parseInt(cut.substring(2,4),16)/255)*0.715;
				b = (parseInt(cut.substring(4,6),16)/255)*0.072;
			}
			
			return (r+g+b < 0.5) ? '#DDD' : '#333';
		},
		lightbox = function(ops) {

			if (ops == 'close')
				return $('#lumise-lightbox').remove();

			var tmpl = '<div id="lumise-lightbox" class="lumise-lightbox">\
							<div id="lumise-lightbox-body">\
								<div id="lumise-lightbox-content" style="min-width:%width%px">\
									%content%\
								</div>\
								%footer%\
								<a class="kalb-close" href="#close" title="Close">\
									<svg enable-background="new 0 0 32 32" height="32px" id="close" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M17.459,16.014l8.239-8.194c0.395-0.391,0.395-1.024,0-1.414c-0.394-0.391-1.034-0.391-1.428,0  l-8.232,8.187L7.73,6.284c-0.394-0.395-1.034-0.395-1.428,0c-0.394,0.396-0.394,1.037,0,1.432l8.302,8.303l-8.332,8.286  c-0.394,0.391-0.394,1.024,0,1.414c0.394,0.391,1.034,0.391,1.428,0l8.325-8.279l8.275,8.276c0.394,0.395,1.034,0.395,1.428,0  c0.394-0.396,0.394-1.037,0-1.432L17.459,16.014z" fill="#121313" id="Close"></path><g></g><g></g><g></g><g></g><g></g><g></g></svg>\
								</a>\
							</div>\
							<div class="kalb-overlay"></div>\
						</div>',
				cfg = $.extend({
					width: 1000,
					footer: '',
					content: '',
					onload: function(){},
					onclose: function(){}
				}, ops);

			if (cfg.footer !== '')
				cfg.footer = '<div id="lumise-lightbox-footer">'+cfg.footer+'</div>';

			tmpl = $(tmpl.replace(/\%width\%/g, cfg.width).
						replace(/\%content\%/g, cfg.content).
						replace(/\%footer\%/g, cfg.footer));

			$('.lumise-lightbox').remove();
			$('body').append(tmpl);

			cfg.onload(tmpl);
			tmpl.find('a.kalb-close,div.kalb-overlay').on('click', function(e){
				cfg.onclose(tmpl);
				$('.lumise-lightbox').remove();
			});

		},
		enjson = function(str) {
			return btoa(encodeURIComponent(JSON.stringify(str)));
		},
		dejson = function(str) {
			return JSON.parse(decodeURIComponent(atob(str)));
		};
	
	window.lumise = {

		i : function(s){
			return LumiseDesign.js_lang[s.toString()];
		},
				
		product: {		
			
			popup: $('#lumise-popup'),
			
			init: function(config) {
				
				if (config.bases !== undefined)
					lumise.product.bases = config.bases;
				
				trigger({
					
					el: $('#lumise-product-page'),
					
					events: {
						'.lumise-field-color-wrp input[data-el="select"]:input': 'change_color',
						'.lumise-field-color': 'change_color',
						'.lumise-popup-content .close-pop': 'close_popup',
						'button[data-select-base]': 'select_base',
						'button[data-revert-base]': 'revert_base',
						'button[data-delete-base]': 'delete_base',
						'.lumise-stage-editzone:mousedown': 'start_drag',
						'.editzone-ranges .design-scale input:input': 'design_scale',
						'.editzone-ranges .editzone-radius input:input': 'editradius',
						'.lumise-stage-editzone button': 'edit_funcs',
						'#lumise-product-form:submit': 'before_submit',
						'#lumise-popup': 'popup_click',
						
						'#lumise_template': 'template', 
						'#lumise_template_btn': 'select_template',
						
						'#lumise-stages-wrp ul.lumise_tab_nav a i': 'edit_stage_label'
						
					},
					
					change_color: function(e) {
						
						if (this.tagName === 'INPUT') {
							e.data.invert(this.value);
							return $('div.lumise-stage-body .lumise-stage-design-view').css({background: this.value});
						}
						
						var color = e.target.getAttribute('data-color');
						
						if (color) {
							e.data.invert(e.target.getAttribute('data-color'));
							$('div.lumise-stage-body .lumise-stage-design-view').css({background: e.target.getAttribute('data-color')});
						}
		
					},
					
					invert: function(color) {
						$('.lumise-stage-editzone').css({'border-color': invert(color), 'color': invert(color)});
					},
					
					select_base: function(e) {
						
						$('#lumise-popup').show().data({stage: this.getAttribute('data-select-base')});
						e.preventDefault();
						
					},

					close_popup: function(e) {
						
						$('#lumise-popup').hide();
						e.preventDefault();
						
					},
					
					revert_base: function(e) {
						
						var w = $(this).closest('.lumise-stage-body'),
							v = w.find('.lumise-stage-design-view'),
							s = this.getAttribute('data-revert-base'),
							r = $('input[name="old-product-upload-'+s+'"]').val();
							c = $('input[name="old-product-upload-'+s+'-source"]').val(),
							g = JSON.parse(
								decodeURIComponent(
									atob(
										$(this).closest('.lumise_form_content').find('textarea.stages-field').val().trim()
									)
								)
							);
						
						$('#lumise-popup').data({'stage': s});
						
						e.data.set_image(r, c);
						
						w.find('.lumise-stage-editzone').css({
							height: g[s].edit_zone.height+'px',
							width: g[s].edit_zone.width+'px',
							left: (((v.width()/2)-(g[s].edit_zone.width/2))+g[s].edit_zone.left)+'px',
							top: (((v.height()/2)-(g[s].edit_zone.height/2))+g[s].edit_zone.top)+'px'
						});
						
						this.style.display = 'none';
						
						e.preventDefault();
						return false;
					},
					
					delete_base: function(e) {
						
						if (!confirm(lumise.i(98)))
							return;
						var s = this.getAttribute('data-delete-base'),
							wrp = $('#lumise-product-design-'+s);
						
						wrp.find('img.lumise-stage-image').attr({'src': '', 'data-url': ''});
						wrp.find('div.lumise-stage-editzone').hide();
						wrp.removeClass('stage-enabled').addClass('stage-disabled');
						
						e.preventDefault();
								
					},
					
					edit_funcs: function(e) {
						
						var func = this.getAttribute('data-func');
						
						if (func == 'select-design') {
							e.data.select_template(e);
						} else if (func == 'clear-design') {
							
							var view = $('.lumise_field_stages .lumise_tab_content.active .lumise-stage-editzone');
							if (view.length > 0 && confirm(lumise.i(101)))
								view.find('.design-template-inner').remove();
							
							this.style.display = 'none';
							
							view.append(
								'<button data-func="select-design" class="design-template-btn">\
								<i class="fa fa-paint-brush"></i> \
								'+lumise.i(91)+'\
								</button>'
							);
							
							view.find('button').on('click', e.data.select_template);
							$('.lumise_field_stages .lumise_tab_content.active .editzone-ranges .design-scale').hide();
							
						};
						
						e.preventDefault();
						return false;
							
					},
					
					design_scale: function(e) {
						
						var img = $(this).closest('.lumise-stage-design-view').find('.design-template-inner img');
						if (img.length === 0)
							return;
							
						var im = img.get(0),
							w = im.naturalWidth,
							h = im.naturalHeight,
							cl = im.offsetLeft+(im.offsetWidth/2),
							ct = im.offsetTop+(im.offsetHeight/2);
							
						img.css({
							width:	((w*this.value)/100)+'px', 
							height:	((h*this.value)/100)+'px',
							left:	(cl-(((w*this.value)/100)/2))+'px',
							top:	(ct-(((h*this.value)/100)/2))+'px'
						});
					},
					
					editradius: function(e) {
						$(this).closest('.lumise-stage-design-view').find('.lumise-stage-editzone,.design-template-inner').css({
							borderRadius: this.value+'px'
						});	
					},
					
					start_drag: function(e) {
						
						if ($(e.target).closest('.design-template-inner').length > 0) {
						
							var $this = $(e.target).closest('.design-template-inner').find('img'),
								clientX = e.clientX,
								clientY = e.clientY,
								left = $this.get(0).offsetLeft,
								top = $this.get(0).offsetTop,
								width = $this.get(0).offsetWidth,
								height = $this.get(0).offsetHeight,
								limit = false,
								resize = false;
						
						}else{
						
							var func = e.target.getAttribute('data-func') || 
									   e.target.parentNode.getAttribute('data-func');
							
							var gui = $(e.target).hasClass('.editzone-gui') || 
									  $(e.target).closest('.editzone-gui').length > 0;
							
							if (func != 'move' && func != 'resize' && gui !== true)
								return false;
								
							var $this = $(this),
								clientX = e.clientX,
								clientY = e.clientY,
								left = this.offsetLeft,
								top = this.offsetTop,
								width = this.offsetWidth,
								height = this.offsetHeight,
								limit = true,
								etarget = $(e.target),
								resize = e.target.getAttribute('data-func') == 'resize' || 
										 e.target.parentNode.getAttribute('data-func') == 'resize';
							
						};
						
						$(document).on('mousemove', function(e){
							
							var pw = $this.parent().width();
								ph = $this.parent().height() - $this.parent().find('.editzone-ranges').height();
							
							
							if (resize) {
								
								var new_width = (width+(e.clientX-clientX)),
									new_height = (height+(e.clientY-clientY));
								
								if (new_width < 30)
									new_width = 30;
								
								if (new_height < 50)
									new_height = 50;
									
								if (new_width > pw-left)
									new_width = pw-left;
								
								if (new_height > ph-top)
									new_height = ph-top;
								
								new_width = Math.round(new_width);
								new_height = Math.round(new_height);
								
								$this.css({
									width: new_width+'px',
									height: new_height+'px'
								});
								
								etarget.attr({'data-info': new_width+' x '+new_height});
								
							}else{
								
								var new_left = (left+(e.clientX-clientX)),
									new_top = (top+(e.clientY-clientY));
								
								if (limit) {
										
									if (new_left < 0)
										new_left = 0;
									
									if (new_top < 0)
										new_top = 0;
										
									if (new_left > pw-width)
										new_left = pw-width;
									
									if (new_top > ph-height)
										new_top = ph-height;
										
								}else{
									
									if (new_left < -width*0.85)
										new_left = -width*0.85;
									
									if (new_top < -height*0.85)
										new_top = -height*0.85;
										
									if (new_left > pw-(width*0.15))
										new_left = pw-(width*0.15);
									
									if (new_top > ph-(height*0.15))
										new_top = ph-(height*0.15);
										
								};
								
								$this.css({
									left: new_left+'px',
									top: new_top+'px'
								});
								
							}
						});
						
						$(document).on('mouseup', function(){
							$(document).off('mousemove mouseup');
						});
						
					},
					
					before_submit: function(e) {
						
						var data = {};	
						
						var has_stage = false;
						$('#lumise-stages-wrp .lumise_tab_content img.lumise-stage-image').each(function(){
							if (this.getAttribute('data-url') !== '')
								has_stage = true;
						});
						
						if (has_stage === false) {
							alert(config.hs);
							return false;
						};
						
						var temp_op = false;
						if ($('#lumise-tab-design').css('display') != 'block') {
							temp_op = true;
							$('#lumise-tab-design').css('display', 'block');
						};
						
						$('#lumise-stages-wrp .lumise_tab_content').each(function(){
							if (this.style.display != 'block') {
								this.style.display = 'block';
								this.setAttribute('data-hidden', 'true');
							}
						});
						
						$.map($('#lumise-stages-wrp .lumise_tab_content'), function(tab) {
						   	
						   	tab.style.display = 'inline-block';
						   	
						    var url = $(tab).find('img.lumise-stage-image').data('url'),
								source = $(tab).find('img.lumise-stage-image').data('source'),
								overlay = $(tab).find('input[name="is_mask"]').get(0).checked;
								
						    if (url !== '') {
							   	
							   	if (url.indexOf('data:image/') === 0)
							   		url = '[blob-'+new Date().getTime().toString(36)+']';
							   	
							   	var ret = {},
							   		b = $(tab).find('.lumise-stage-design-view').get(0),
							   		c = $(tab).find('.lumise-stage-design-view .editzone-ranges').get(0),
							   		l = $(tab).find('.lumise-stage-editzone').get(0),
							   		templ = {},
							   		stg = tab.getAttribute('data-stage');
							   
							   	if (
							   		$(tab).find('.design-template-inner').length > 0 && 
							   		$(tab).find('.design-template-inner').data('id')
							   	) {
								   	var im = $(tab).find('.design-template-inner img').get(0);
								   	templ = {
										id: $(tab).find('.design-template-inner').data('id'),
										scale: $(tab).find('.design-scale input').val(),
										css: $(tab).find('.design-template-inner img').attr('style'),
										offset: {
											top: im.offsetTop,
											left: im.offsetLeft,
											width: im.offsetWidth,
											height: im.offsetHeight,
											natural_width: im.naturalWidth,
											natural_height: im.naturalHeight
										}
									};
							   	};
							   	
								data[stg] = {
									edit_zone: {
										height: l.offsetHeight,
										width: l.offsetWidth,
										left: l.offsetLeft-(b.offsetWidth/2)+(l.offsetWidth/2),
										top: l.offsetTop-((b.offsetHeight-c.offsetHeight)/2)+(l.offsetHeight/2),
										radius: $(tab).find('.editzone-radius input').val(),
									},
									url: url,
									source: source,
									overlay: overlay,
									product_width: b.offsetWidth,
									product_height: (b.offsetHeight-c.offsetHeight),
									template: templ,
									label: $('#lumise-stages-wrp .lumise_tab_nav a[href="#lumise-tab-'+stg+'"]').data('label')
								}	
						    }
							
							tab.style.display = '';
							
						});
						
						$('.lumise_tab_content[data-hidden="true"]').hide();
						
						$('textarea[name="stages"]').val(btoa(encodeURIComponent(JSON.stringify(data))));
						
						if (temp_op === true)
							$('#lumise-tab-design').css('display', 'none');
							
						$('.lumise_field_printing').each(function(){
							var vals = {};
							$(this).find('.lumise_checkbox').each(function(){
								if ($(this).find('input.action_check').prop('checked')) {
									var v = $(this).find('input.action_check').val();
									vals[v] = '';
									if (this.getAttribute('data-type') == 'size') {
										vals[v] = $(this).next('.lumise_radios').find('input[type="radio"]:checked').val();
									}
								}
							});
							$(this).find('input.field-value').val(encodeURIComponent(JSON.stringify(vals)));
						});
						
						return true;
						
					},
					
					set_image: function(url, source) {
						
						var stage = $('#lumise-popup').hide().data('stage'),
							wrp = $('#lumise-product-design-'+stage);
						
						if (url.indexOf("image/svg+xml") > -1 || url.split('.').pop() == 'svg')
							wrp.find('img.lumise-stage-image').attr({'data-svg': '1'});
						else wrp.find('img.lumise-stage-image').attr({'data-svg': ''});
						
						var _url = url;
						
						if (source == 'raws') {
							_url = lumise_assets_url+'raws/'+url;
							wrp.find('input[name="is_mask"]').get(0).checked = true;
						}else{
							wrp.find('input[name="is_mask"]').get(0).checked = false;
							if (url.indexOf('data:image/') === -1)
								_url = lumise_upload_url+url;
						}
						if (url.indexOf('data:image/') === 0)
							url = '[blob-'+new Date().getTime().toString(36)+']';
						
						wrp.find('img.lumise-stage-image').attr({
							'src': _url, 
							'data-url': url, 
							'data-source': source
						});
						
						wrp.find('div.lumise-stage-editzone').show().css({left: '', top: '', height: '', width: ''});
						wrp.addClass('stage-enabled').removeClass('stage-disabled');
						
						if (wrp.find('.lumise-stage-image').height() <= 280) {
							wrp.find('div.lumise-stage-editzone').css({
								top: '10px', 
								height: (wrp.find('.lumise-stage-image').height()-20)+'px'
							});
						};
						
						if (wrp.find('.lumise-stage-image').width() <= 175) {
							wrp.find('div.lumise-stage-editzone').css({
								left: '10px', 
								width: (wrp.find('.lumise-stage-image').width()-20)+'px'
							});
						};
						
						if (wrp.find('input[name="old-product-upload-'+stage+'"]').val() !== '')
							wrp.find('button[data-revert-base]').show();
						
						$('html,body').scrollTop($('#lumise-stages-wrp').offset().top+30);
							
					},
					
					popup_click: function(e) {
						
						var act = e.target.getAttribute('data-act');
						
						
						if (e.target.id == 'lumise-popup')
							act = 'close';
						
						if (!act)
							return;
							
						switch (act) {
							case 'close': 
								$(this).hide();
								return e.preventDefault();	 
							break;
							case 'base': 
								
								var url = e.target.getAttribute('data-src'),
									source = e.target.getAttribute('data-source');
									
								e.data.set_image(url, source);
								
							break;
							case 'upload': 
							
								var file_input = $('#lumise-product-upload-input'),
									fi = file_input.get(0);
								
								if (fi === undefined)
									return e.preventDefault();
									
								fi.type = '';
								fi.type = 'file';
								fi.click();
								
								if (!file_input.data('onprocess')) {
									
									file_input.data({onprocess: true}).on('change', function(){
										
										var f = this.files[0];
										
										if (["image/png", "image/jpeg", "image/svg+xml"].indexOf(f.type) === -1)
											return alert(config.tp+"\n\n"+config.ru+f.type);
										else if (f.size < 1024)
											return alert(config.sm+"\n\n"+config.ru+Math.round(f.size/1024)+'KB');
										else if (f.size > 5024000)
											return alert(config.lg+"\n\n"+config.ru+Math.round(f.size/1024)+'KB');
									
										var reader = new FileReader();
										
										reader.addEventListener("load", function(){
											
											var result = lumise.svguni(this.result);
							
											var data = {
												data: result,
												size: f.size,
												name: 'lumise-base-'+f.name.replace(/[^0-9a-zA-Z\.\-\_]/g, "").trim().replace(/\ /g, '+'),
												type: f.type ? f.type : f.name.split('.').pop()
											}, stage = $('#lumise-popup').data('stage');
											
											e.data.set_image(this.result, 'uploads');
									    	
									    	$('input[name="product-upload-'+stage+'"]').val(enjson(data));
									    	
									    	delete reader;
									    	delete f;
									    	delete data;
									    	
										}, false);
			
										reader.readAsDataURL(f);
									
									});
									
								}
										
								e.preventDefault();
								
							break;
						}
						
					},
					
					template: function(e) {
						
						if (e.target.tagName == 'I' && e.target.parentNode.getAttribute('href') == '#delete') {
							this.innerHTML = '';
							$('#lumise_template_inp').val('');
						}else{
							e.data.select_template(e);
						}	
						
						e.preventDefault();
						
					},
					
					select_template: function(e) {
						lumise.product.load_designs({});
						e.preventDefault();
					},
					
					edit_stage_label: function(e) {
						
						var text = prompt(
							LumiseDesign.js_lang['151'], 
							decodeURIComponent(this.parentNode.getAttribute('data-label'))
								.replace(/\&gt\;/, '>')
								.replace(/\&lt\;/, '<')
								.replace(/\&Prime\;/, '"')
								.replace(/\&prime\;/, "'")
						);
						if (text === null || text === '')
							return;
							
						text = text.replace(/\>/g, '&gt;')
								   .replace(/\</g, '&lt;')
								   .replace(/\"/g, '&Prime;')
								   .replace(/\'/g, '&prime;');
						
						if (text === '')
							return;
							
						$(this).parent().find('text').html(text);
						$(this).parent().attr({'data-label': encodeURIComponent(text)});
						
					}
					
				});
				
				var color = $('.lumise-field-color-wrp').first().find('input[data-el="select"]').val();
				
				if (color) {
					$('.lumise-stage-body .lumise-stage-design-view').css({background: color});
					$('.lumise-stage-editzone').css({'border-color': invert(color), 'color': invert(color)});
				}
					
			},
			
			render_designs : function(res) {
				
				var _this = this,
					cates = [
						'<ul data-view="categories">',
						'<h3>'+lumise.i(90)+'</h3>',
						'<li data-id="" '+(res.category === '' ? 'class="active"' : '')+' data-lv="0"> '+lumise.i(57)+'</li>'
					],
					prods = [
						'<h3 data-view="top">'+lumise.i(91)+'<input id="search-templates-inp" type="search" placeholder="'+lumise.i(92)+'" value="'+encodeURIComponent(res.q)+'" /></h3>',
						'<ul data-view="items">'
					];
				
				if (res.categories_full) {
					res.categories_full.map(function(c) {
						cates.push('<li data-id="'+c.id+'" '+(c.id == res.category ? 'class="active"' : '')+' data-lv="'+(c.lv ? c.lv : 0)+'">'+('&mdash;'.repeat(c.lv))+' '+c.name+'</li>');
					});
				}
	
				if (res.items && res.items.length > 0) {
					var current_design = $('#lumise_template').val();
					window.ops_designs = res.items;
					res.items.map(function(p) {
							
						prods.push(
							'<li data-id="'+p.id+'"'+((current_design == p.id)?' data-current="true"':'')+'>\
								<span data-view="thumbn" data-start="'+lumise.i(93)+'">\
									<img src="'+p.screenshot+'" />\
								</span>\
								<span data-view="name">'+p.name+'</span>\
							</li>'
						);
					});
					
					if (res.index+res.limit < res.total) {
						prods.push(
							'<li data-loadmore="'+(res.index+res.limit)+'">\
								<span>'+lumise.i(94)+'</span>\
							</li>'
						);
					}
					
				}
				else prods.push('<li data-view="noitem" data-category="'+res.category+'">'+lumise.i(42)+'</li>');
				
					
				if (res.index == 0) {
					
					cates.push('</ul>');
					prods.push('</ul>');
					
					$('#lumise-lightbox-content').html('<div id="lumise-list-items-wrp"></div>');
					$('#lumise-list-items-wrp').html(cates.join('')).append(prods.join(''));
					
				}else{
					
					$('#lumise-lightbox-content ul[data-view="items"] li[data-loadmore]').remove();
					prods[0] = '';
					prods[1] = '';
					$('#lumise-lightbox-content ul[data-view="items"]').append(prods.join(''));
				}
				
				trigger({
					
					el: $('#lumise-list-items-wrp'),
					
					events: {
						'ul[data-view="categories"] li': 'category',
						'ul[data-view="items"] li': 'design',
						'h3[data-view="top"] input:keyup': 'search',
						'li[data-loadmore]': 'load_more',
					},
					
					category: function(e) {
	
						lumise.product.load_designs({
							category: this.getAttribute('data-id'), 
							index: 0, 
							q: $('#search-templates-inp').val()
						});
						
						e.preventDefault();
						
					},
					
					design: function(e) {
						
						if (this.getAttribute('data-loadmore') !== null)
							return e.data.load_more(e);
						
						var id = this.getAttribute('data-id'),
							design = ops_designs.filter(function(p){return p.id == id;});
						
						$(this).closest('#lumise-lightbox').remove();
						$('body').css({overflow: ''});
						
						lumise.product.render_design(design[0]);
						
					},
					
					load_more: function(e) {
						
						this.innerHTML = '<i class="lumise-spinner x3"></i>';
						this.style.background = 'transparent';
						$(this).off('click');
						
						lumise.product.load_designs({
							category: this.getAttribute('data-category'),
							index: this.getAttribute('data-loadmore'),
							q: $('#search-templates-inp').val()
						});
							
					},
					
					search: function(e) {
						
						if (e.keyCode !== undefined && e.keyCode === 13)
							lumise.product.load_designs({q: this.value});
						
					}
					
				});
	
			},
			
			render_design : function(data) {
				
				var view = $('.lumise_field_stages .lumise_tab_content.active .lumise-stage-editzone');
				
				if (view.length === 0)
					return;
				
				var img = new Image();
				img.src = data.screenshot;
				
				view.find('.design-template-inner,.design-template-btn').remove();
				view.append('<div class="design-template-inner" style="border-radius:'+view.css('border-radius')+'" data-id="'+data.id+'"></div>');
				
				view.find('button[data-func="clear-design"]').css({display: ''});
				
				view.find('.design-template-inner').append(img);
				
				img.onload = function(){
					
					if (this.width > this.parentNode.offsetWidth) {
						this.width = this.parentNode.offsetWidth;
						this.height = this.parentNode.offsetWidth*(this.naturalHeight/this.naturalWidth);
					};
					
					this.style.left = ((this.parentNode.offsetWidth/2)-(this.width/2))+'px';
					this.style.top = ((this.parentNode.offsetHeight/2)-(this.height/2))+'px';
					
					var rang = $(this).closest('.lumise-stage-design-view').find('.editzone-ranges .design-scale');
					
					rang.show();
					
					rang.find('input').val((this.width/this.naturalWidth)*100).trigger('input');	
					
				};
				
			},
			
			load_designs : function(ops) {
				
				if (ops.index === undefined || ops.index === 0) {
					lightbox({
						content: '<center><i class="lumise-spinner x3"></i></center>'
					});
				};
				
				$.ajax({
					url: LumiseDesign.ajax,
					method: 'POST',
					data: {
						nonce: 'LUMISE_ADMIN:'+LumiseDesign.nonce,
						ajax: 'backend',
						action: 'templates',
						category: ops.category !== undefined ? ops.category : '',
						q: ops.q !== undefined ? ops.q : '',
						index: ops.index !== undefined ? ops.index : 0
					},
					statusCode: {
						403: function(){
							alert(LumiseDesign.js_lang.error_403);
						}
					},
					success: lumise.product.render_designs
				});
				
			}
			
		},
		
		printing: {
			
			init: function(cfg) {
				
				var _this = this,
					sides = ['front'];
					
				this.ops = cfg.ops;
				
				if (cfg.ops.sta > 1)
					sides.push('back');
				if (cfg.ops.sta > 2)
					sides.push('left');
				if (cfg.ops.sta > 3)
					sides.push('right');
					
				trigger({
					
					el: $('.lumise_field_print'),
					events: {
						'input[data-func="type"]:change': 'change_type',
						'input[data-func="multi"]:change': 'change_multi'
					},
					
					change_type: function(e) {
						
						var multi = e.data.el.find('input[data-func="multi"]').is(':checked'),
							content = $(this).closest('.lumise_radios').find('.lumise_radio_content');
							
						e.data.el.find('.lumise_radio_content').removeClass('lumise-open').attr({'data-multi': multi ? 'yes' : 'no'});
						content.addClass('lumise-open');
						
						if (content.html() === '')
							e.data.render_tabs(e, this);
						
					},
					
					change_multi: function(e) {
						
						e.data.el.find('.lumise_radio_content').attr({'data-multi': this.checked ? 'yes' : 'no'});
						
						if (!this.checked) {
							$(e.data.el).find('.lumise_radio_content.lumise-open').find('.lumise_tab_nav a').first().trigger('click');
						}
							
					},
					
					render_tabs: function(e, el) {
						
						var wrp = $(el).closest('.lumise_radios').find('.lumise_radio_content'),
							nav = $('<ul class="lumise_tab_nav"></ul>'),
							tabs = $('<div class="lumise_tabs"></div>');
						
						sides.map(function(s) {
							nav.append('<li><a href="#" data-side="'+s+'">'+_this.ops.langs['_'+s].toUpperCase()+'</a></li>');
							tabs.append(
								'<div class="lumise_tab_content" data-side="'+s+'">'+
								e.data.render_table(e, el.value, s)+
								'</div>'
							);
						});
						
						wrp.append(nav).append(tabs);
						
						trigger({
							
							el: wrp,
							
							events: {
								'.lumise_tab_nav li a': 'active_tab',
								':click': 'tbody_funcs',
								'input[data-func="show_detail"]:change': 'show_detail'
							},
							
							active_tab: function(e) {
								
								e.data.el.find('.lumise_tab_nav li.active').removeClass('active');
								$(e.target).closest('li').addClass('active');
								e.data.el.find('.lumise_tabs .lumise_tab_content').hide();
								
								e.data.el.find('.lumise_tabs .lumise_tab_content[data-side="'+this.getAttribute('data-side')+'"]').show().addClass('active');
								
								e.preventDefault();
							},
							
							tbody_funcs: function(e) {
								
								var func = e.target.getAttribute('data-func');
								
								if (!func)
									return;
								
								if (typeof e.data[func] == 'function')
									e.data[func](e);
								
							},
							
							delete_row: function(e) {
								if ($(e.target).closest('.lumise_tab_content').find('tbody tr').length > 1)
									$(e.target).closest('tr').remove();
								else alert(_this.ops.langs.nd);
							},
							
							add_row: function(e) {
								
								var tbody = $(e.target).closest('.lumise_tab_content').find('tbody');
									last = tbody.find('tr').last();
								
								tbody.append(last.clone());
								
								var qty = tbody.find('tr').last().find('input[data-name="qty"]');
								qty.val(parseInt(qty.val())+5);
								
								e.preventDefault();
							},
							
							add_column: function(e) {
								
								var type = e.target.getAttribute('data-type'),
									label = '', 
									tabs = $(e.target).closest('div.lumise_tabs').find('div.lumise_tab_content');
								
								if (type == 'color') {
									label = prompt(LumiseDesign.js_lang['152'], (tabs.eq(0).find('thead tr td').length-2));
									label = label.replace(/\D/g, '');
									if (tabs.eq(0).find('tbody tr input[data-name="color_'+label+'"]').length > 0)
										label = '';
									if (label !== '')
										label = label+'-color';
								} else { 
									label = prompt(LumiseDesign.js_lang['155'], '');
									label = encodeURIComponent(
										label.replace(/\"/g, '&quot;').
											  replace(/\'/g, '&apos;').
											  replace(/\%/g, '&#37;').
											  replace(/\'/g, '&apos;').
											  replace(/\>/g, '&gt;').
											  replace(/\</g, '&lt;')
										);
								};
								
								tabs.each(function() {
									
									var tabl = $(this);
									
									if (label !== null && label !== '') {
										
										tabl.find('thead tr td').last().before('<td>'+decodeURIComponent(label)+'</td>');
										tabl.find('tbody tr').each(function(){
											$(this).find('td').last().before(
												'<td><input data-name="'+label+'" value="1"></td>'
										    );
										});
										tabl.parent().scrollLeft(tabl.width());
									};
								});
								
								e.preventDefault();
								
							},
							
							reduce_column: function(e) {
								
								var type = e.target.getAttribute('data-type');
								
								$(e.target).closest('div.lumise_tabs').find('div.lumise_tab_content').each(function() {
									var tabl = $(this).find('table');
									if (tabl.find('thead tr td').length > (type == 'color' ? 3 : 2)) {
										tabl.find('thead tr td').last().prev().remove();
										tabl.find('tbody tr').each(function(){
											$(this).find('td').last().prev().remove();
										});
										tabl.parent().scrollLeft(tabl.width());
									};
								});
								
								e.preventDefault();
								
							},
							
							show_detail: function(e) {
								e.data.el.find('input[data-func="show_detail"]').prop({'checked': this.checked});
								cfg.ops.show_detail = this.checked ? '1' : '0';
							}
							
							
						});
						
						wrp.find('.lumise_tab_nav li a').first().trigger('click');
						
					},
					
					render_table: function(e, type, s) {
						
						var th = '<thead><tr><td>'+_this.ops.langs.qr+'</td>', ops;
						
						if (_this.ops.data[type].values !== undefined && _this.ops.data[type].values[s] !== undefined) {
							ops = _this.ops.data[type].values[s];
						} else {
							if (_this.ops.data[type].values !== undefined)
								ops = _this.ops.data[type].values[Object.keys(_this.ops.data[type].values)[0]];
							else ops = _this.ops.data[type].default;
							Object.keys(ops).map(function(o, i){
								if (i>0) delete ops[o];
							});
						};
							
						Object.keys(ops[Object.keys(ops)[0]]).map(function(o){
							th += '<td>'+decodeURIComponent(o)+'</td>';
						});
						
						var tb = e.data.render_rows(ops);
						
						th += '<td></td></tr></thead>';
						
						return '<div data-view="table"><table>'+th+tb+'</table></div>\
								<a href="#" data-func="add_row">'+_this.ops.langs.aqr+'</a>'+(
									(type == 'color' || type == 'size') ? 
									' <a href="#" data-func="add_column" data-type="'+type+'">'+LumiseDesign.js_lang['153']+'</a> \
									 <a href="#" data-func="reduce_column" data-type="'+type+'">'+LumiseDesign.js_lang['154']+'</a>' 
									 : '')+'<input type="checkbox" data-func="show_detail" id="showindt-'+type+'"'+(
										 cfg.ops.show_detail == '1' ? ' checked' : ''
									 )+' /> &nbsp; <label for="showindt-'+type+'">Show in details?</label>';
						
					},
					
					render_rows: function(values) {
						
						var tb = '<tbody>';
						
						Object.keys(values).map(function(v) {
							tb += '<tr><td><input data-name="qty" value="'+v+'" /></td>';
							Object.keys(values[v]).map(function(c){
								var val = '';
								if(typeof values[v][c] !== 'undefined')
									val = values[v][c];
										
								tb += '<td><input data-name="'+c+'" value="'+val+'" /></td>';
							});
							tb += '<td><i class="fa fa-times" data-func="delete_row"></i></td></tr>';
						});
						
						return tb+'</tbody>';
						
					}
					
					
				}, 'prt');
					
				$('.lumise_field_print input[data-func="type"]:checked').trigger('change');
				
				$('.lumise_form').on('submit', function() {
					
					$('.lumise_field_print').each(function(){
						
						var el = $(this),
							vals = function(el) {
								var result = {}, qty;
								el.find('tbody tr').each(function(){
									qty = $(this).find('input[data-name="qty"]').val();
									result[qty] = {};
									$(this).find('input:not([data-name="qty"])').each(function(){
										result[qty][this.getAttribute('data-name')] = this.value;
									});
								});
								return result;
							},
							data = {
								multi: el.find('input[data-func="multi"]').is(':checked'),
								type: el.find('input[data-func="type"]:checked').val(),
								show_detail: el.find('.lumise-open input[data-func="show_detail"]').
											eq(0).is(':checked') ? '1' : '0',
								values: {}
							};
							
						var active = el.find('.lumise_radio_content.lumise-open');
						
						if (data.multi) {
							active.find('.lumise_tab_content').each(function(){
								data.values[this.getAttribute('data-side')] = vals($(this));
							});
						}else{
							var ctn = active.find('.lumise_tab_content').first();
							data.values[ctn.data('side')] = vals(ctn);
						}
						
						el.find('input[data-func="data-saved"]').val(btoa(encodeURIComponent(JSON.stringify(data))));
						
					});
					
				});
				
			}
			
		},
		
		svguni: function(data) {
			
			if (data.indexOf('image/svg+xml') === -1)
				return data;
			
			data = data.split(',');
			data[1] = $('<div>'+atob(data[1].replace('viewbox=', 'viewBox='))+'</div>');
			
			data[1].find('[id]').each(function(){
				this.id = this.id.replace(/[\u{0080}-\u{FFFF}]/gu,"");
			});
			
			var svg = data[1].find('svg').get(0);
			
			if (!svg.getAttribute('width'))
				svg.setAttribute('width', '1000px');
			
			if (!svg.getAttribute('height')) {
				var vb = svg.getAttribute('viewBox').trim().split(' ');
				svg.setAttribute('height', (1000*(parseFloat(vb[3])/parseFloat(vb[2])))+'px');
			};
			
			data[1] = btoa(data[1].html());
			
			return data[0]+','+data[1];
			
		}
		
	}
	
	$(document).ready(function($) {
		
		var color_maps = {"#000000":"black","#000080":"navy","#00008b":"darkblue","#0000cd":"mediumblue","#0000ff":"blue","#006400":"darkgreen","#008000":"green","#008080":"teal","#008b8b":"darkcyan","#00bfff":"deepskyblue","#00ced1":"darkturquoise","#00fa9a":"mediumspringgreen","#00ff00":"lime","#00ff7f":"springgreen","#00ffff":"cyan","#191970":"midnightblue","#1e90ff":"dodgerblue","#20b2aa":"lightseagreen","#228b22":"forestgreen","#2e8b57":"seagreen","#2f4f4f":"darkslategrey","#32cd32":"limegreen","#3cb371":"mediumseagreen","#40e0d0":"turquoise","#4169e1":"royalblue","#4682b4":"steelblue","#483d8b":"darkslateblue","#48d1cc":"mediumturquoise","#4b0082":"indigo","#556b2f":"darkolivegreen","#5f9ea0":"cadetblue","#6495ed":"cornflowerblue","#663399":"rebeccapurple","#66cdaa":"mediumaquamarine","#696969":"dimgrey","#6a5acd":"slateblue","#6b8e23":"olivedrab","#708090":"slategrey","#778899":"lightslategrey","#7b68ee":"mediumslateblue","#7cfc00":"lawngreen","#7fff00":"chartreuse","#7fffd4":"aquamarine","#800000":"maroon","#800080":"purple","#808000":"olive","#808080":"grey","#87ceeb":"skyblue","#87cefa":"lightskyblue","#8a2be2":"blueviolet","#8b0000":"darkred","#8b008b":"darkmagenta","#8b4513":"saddlebrown","#8fbc8f":"darkseagreen","#90ee90":"lightgreen","#9370db":"mediumpurple","#9400d3":"darkviolet","#98fb98":"palegreen","#9932cc":"darkorchid","#9acd32":"yellowgreen","#a0522d":"sienna","#a52a2a":"brown","#a9a9a9":"darkgrey","#add8e6":"lightblue","#adff2f":"greenyellow","#afeeee":"paleturquoise","#b0c4de":"lightsteelblue","#b0e0e6":"powderblue","#b22222":"firebrick","#b8860b":"darkgoldenrod","#ba55d3":"mediumorchid","#bc8f8f":"rosybrown","#bdb76b":"darkkhaki","#c0c0c0":"silver","#c71585":"mediumvioletred","#cd5c5c":"indianred","#cd853f":"peru","#d2691e":"chocolate","#d2b48c":"tan","#d3d3d3":"lightgrey","#d8bfd8":"thistle","#da70d6":"orchid","#daa520":"goldenrod","#db7093":"palevioletred","#dc143c":"crimson","#dcdcdc":"gainsboro","#dda0dd":"plum","#deb887":"burlywood","#e0ffff":"lightcyan","#e6e6fa":"lavender","#e9967a":"darksalmon","#ee82ee":"violet","#eee8aa":"palegoldenrod","#f08080":"lightcoral","#f0e68c":"khaki","#f0f8ff":"aliceblue","#f0fff0":"honeydew","#f0ffff":"azure","#f4a460":"sandybrown","#f5deb3":"wheat","#f5f5dc":"beige","#f5f5f5":"whitesmoke","#f5fffa":"mintcream","#f8f8ff":"ghostwhite","#fa8072":"salmon","#faebd7":"antiquewhite","#faf0e6":"linen","#fafad2":"lightgoldenrodyellow","#fdf5e6":"oldlace","#ff0000":"red","#ff00ff":"magenta","#ff1493":"deeppink","#ff4500":"orangered","#ff6347":"tomato","#ff69b4":"hotpink","#ff7f50":"coral","#ff8c00":"darkorange","#ffa07a":"lightsalmon","#ffa500":"orange","#ffb6c1":"lightpink","#ffc0cb":"pink","#ffd700":"gold","#ffdab9":"peachpuff","#ffdead":"navajowhite","#ffe4b5":"moccasin","#ffe4c4":"bisque","#ffe4e1":"mistyrose","#ffebcd":"blanchedalmond","#ffefd5":"papayawhip","#fff0f5":"lavenderblush","#fff5ee":"seashell","#fff8dc":"cornsilk","#fffacd":"lemonchiffon","#fffaf0":"floralwhite","#fffafa":"snow","#ffff00":"yellow","#ffffe0":"lightyellow","#fffff0":"ivory","#ffffff":"white"},
		rgb2hex = function(rgb){
			if (rgb.indexOf('#') === 0)
				return rgb;
			rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
			return (rgb && rgb.length === 4) ? "#" +
			("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
			("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
			("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
		};

		var lumise_action = function(event) {
				
				event.preventDefault();
				
				var data = {
			        "type": $(this).data('type'),
			        "action": $(this).data('action'),
			        "id": $(this).data('id'),
			        "status": $(this).data('status'),
			    }, that = $(this);

			    that.html('<i class="fa fa-spinner fa-spin"></i>');

				$.ajax({
					url: LumiseDesign.ajax,
					method: 'POST',
					data: LumiseDesign.filter_ajax({
						action: 'switch_status',
						nonce: 'LUMISE_ADMIN:'+LumiseDesign.nonce,
						data: data
					}),
					dataType: 'json',
					statusCode: {
						403: function(){
							alert(LumiseDesign.js_lang.error_403);
						}
					},
					success: function(data){
						if (data.status == 'success') {
							if (data.action == 'switch_feature') {
								if (data.value == 1) {
									that.html("<i class='fa fa-star'></i>");
									that.data('status', 1);
								} else {
									that.html("<i class='none fa fa-star-o'></i>");
									that.data('status', 0);
								}
							}
							if (data.action == 'switch_active') {
								if (data.value == 1) {
									that.html('<em class="pub">'+lumise.i(85)+'</em>');
									that.data('status', 1);
								} else {
									that.html('<em class="un pub">'+lumise.i(86)+'</em>');
									that.data('status', 0);
								}
							}
						} else {
							alert(data.value);
						}
					}
				});
			},

			lumise_action_duplicate = function(event) {
				
				event.preventDefault();
				
				this.setAttribute('data-working', 'true');
				
				var data = {
				        "id": $(this).data('id'),
				        "table": $(this).data('table')
				    }, 
				    that = $(this),
				    toptr = that.closest('tr');
				
				that.attr({'data-working': 'true'});
				
				$.ajax({
					url: LumiseDesign.ajax,
					method: 'POST',
					data: LumiseDesign.filter_ajax({
						action: 'duplicate_item',
						nonce: 'LUMISE_ADMIN:'+LumiseDesign.nonce,
						data: data
					}),
					dataType: 'json',
					statusCode: {
						403: function(){
							alert(LumiseDesign.js_lang.error_403);
						}
					},
					success: function(data){
						
						that.attr({'data-working': 'false'});
						
						if (data !== null && data.status == 'success') {

							var elm = toptr.clone(),
								check_input = elm.find('.lumise_checkbox input'),
								check_label = elm.find('.lumise_checkbox label'),
								action = elm.find('.lumise_action'),
								name = elm.find('.name');

							name.attr('href', data.data.url);
							name.html(data.data.name);
							check_input.attr('value', data.data.id);
							check_input.attr('id', data.data.id);
							check_input.attr('id', data.data.id);
							check_label.attr('for', data.data.id);
							action.attr('data-id', data.data.id);
							toptr.after(elm);

							var values = elm.find("input[name='checked[]']:checked").map(function(){return $(this).val();}).get();
							elm.find('.id_action').val(values);

							trigger({
			
								el: elm,
								
								events: {
									'.lumise_action': lumise_action,
									'.lumise_action_duplicate': lumise_action_duplicate,
									'.action_check:change': function(e) {
										var values = $("input[name='checked[]']:checked").map(function(){return $(this).val();}).get();
										$('.id_action').val(values);
									}
								}
							});


						} else if (data !== null){
							alert(data.value);
						}
					}
				});
			};
		
		trigger({
			
			el: $('body'),
			
			events: {
				'#check_all': 'check_all',
				'.action_check': 'action_check',
				'.lumise_action': lumise_action,
				'.lumise_action_duplicate': lumise_action_duplicate,
				'.lumise_menu > li > a': 'left_menu',
				'.btn-toggle-sidebar': 'toggle_menu',
				'.btn-toggle-sidebar-mb': 'toggle_menu_mb',
				'.overlay_mb': 'overlay_mb',
				'.lumise_tab_nav a': 'tab_click',
				'[data-file-select]:change': 'select_file',
				'[data-file-delete]': 'delete_upload',
				
				'.lumise-field-color': 'change_color',
				'.lumise-field-color-wrp button[data-func="create-color"]': 'create_color',
				'.lumise-field-color-wrp button[data-func="clear-color"]': 'clear_color',
				
				'.lumise-field-attributes button[data-func="add"]': 'add_attribute',
				
				'[data-action="submit"]:change': 'do_submit',
				'#lumise-product-form:submit': 'check_submit',
				
				'.lumise-field-attributes>header>button[data-func="add"]': 'new_attribute',
				'.lumise-field-attributes .lumise-field-attributes-body .lumise-attribute>header': 'attribute_toggle',
				'.lumise-field-attributes .lumise-field-attributes-body .lumise-attribute>header>i[data-func="trash"]': 'attribute_delete',
				'.lumise-field-attributes .lumise-field-attributes-body div[data-view="col"] input[name="lumise-attr-title"]:input': 'change_attribute_title',
				'.lumise-field-attributes .lumise-field-attributes-body div[data-view="col"] input[name="lumise-attr-title"]:change': 'check_attribute_title',
				'.lumise-field-attributes .lumise-field-attributes-body div[data-view="col"] select[name="lumise-attr-type"]:change': 'change_attribute_type',
				'.lumise-field-attributes .lumise-field-attributes-body a[data-func="add_opt"]': 'attribute_add_opt',
				'.lumise-field-attributes .lumise-field-attributes-body .lumise-attribute-options i[data-func="trash"]': 'attribute_delete_opt',
				
				'.lumise-field-google_fonts': 'google_fonts',
				
				'.lumise-item-action' : 'items_action',
				'a[href="#report-bug"]': 'report_bug',
				'button.loaclik': function() {
					this.innerHTML = '<i style="font-size: 16px;" class="fa fa-circle-o-notch fa-spin fa-fw"></i> please wait..';
				}
			},
			
			items_action : function (e){
				
				e.preventDefault();
				
				var func = $(this).data('func'),
					item_id = $(this).data('item');
				
				switch (func) {
					case 'delete':
						var conf = confirm(lumise.i(121));
						if (conf == true) {
							$('<form>', {
				                "id": "lumise-item-delete",
				                "method": "POST",
				                "html": '<input type="hidden" name="id" value="' + item_id + '"/><input type="hidden" name="do" value="action"/><input type="hidden" name="action_submit" value="action"/><input type="hidden" name="action" value="delete"/><input type="hidden" name="nonce" value="LUMISE_ADMIN:' + LumiseDesign.nonce + '"/>',
				                "action": window.location.href
				            }).appendTo(document.body).submit();
						}
						break;
					default:
						
				}
			},
			
			check_all: function(){
				
				$('.action_check').prop('checked', this.checked);
				
				var values = $("input[name='checked[]']:checked").map(function(){
					return $(this).val();
				}).get();
				
				$('.id_action').val(values);
			},
			
			action_check: function() {
				var values = $("input[name='checked[]']:checked").map(function(){return $(this).val();}).get();
				$('.id_action').val(values);
			},

			
			
			left_menu: function(event) {
				
				var sub = $(this).next();
				if (sub.length == 0) {
					return;
				}
				event.preventDefault();
	
				var height=0,
					wrp = $(this).parent(),
					target = this,
					sub = wrp.find('.lumise_sub_menu');
				$('.lumise_icon_dropdown').removeClass('open');
				$(".lumise_sub_menu.open").css({'height': 0}).removeClass('open');
	
				if( $(this).data('height') === undefined) {
					$(sub).find('li').each(function (i){
						height += $(this).outerHeight();
					});	
					$(this).data('height', height);
				}
	
				if($(this).next().css('height') == '0px'){
	
					$(this).find('.lumise_icon_dropdown').addClass('open');
	
					$(sub).toggleClass(function (){
						if($(this).is('.open'))
							$(sub).css({'height': 0});
						else
							$(sub).css({'height': $(target).data('height')});
	
						return 'open';
					});
	
				}
				
			},
			
			toggle_menu: function() {
				$(this).parents(".lumise_sidebar").toggleClass('menu_icon');
				$(this).parents("body").toggleClass('page_sidebar_mini');
			},

			toggle_menu_mb: function() {
				$(this).parents(".lumise_mobile").toggleClass('open');
			},

			overlay_mb: function() {
				$(this).parent(".lumise_mobile").toggleClass('open');
			},
			
			tab_click: function(e) {
				
				var tid = $(this).attr('href'),
					nav = $(this).closest('.lumise_tab_nav'),
					wrp = $(this).closest('.lumise_tabs_wrapper');
			
				wrp.find('>.lumise_tabs>.lumise_tab_content').hide().removeClass('active');
				nav.find('>li').removeClass('active');
				$(this.parentNode).addClass('active');
				
				$(tid).css("display", "block").addClass('active');
				
				if (wrp.data('id') !== '') {
					
					var hist = localStorage.getItem('LUMISE-TABS');
					
					if (!hist)
						hist = {};
					else hist = JSON.parse(hist);
					
					hist[wrp.data('id')] = tid;
					
					localStorage.setItem('LUMISE-TABS', JSON.stringify(hist));
					
				}
				
				e.preventDefault();
				
			},
			
			select_file: function(e) {
				
				var type = this.getAttribute('data-file-select'),
					preview = this.getAttribute('data-file-preview'),
					_this = this,
					attr = function(s){
						return _this.getAttribute('data-'+s);
					}
				
				if (this.files && this.files[0]) {
					
					if (type != 'font' && type != 'design' && !lumise_validate_file(this.files[0]))
						return alert('Error: Invalid upload file');
					
			        var reader = new FileReader();
					reader.file = this.files[0];
			        reader.onload = function (e) {
				       
				       	var result = lumise.svguni(e.target.result);
				       	
						if (type == 'font') {
							lumise_font_preview(
								Math.random().toString(36).substr(2).replace(/\d/g,''), 
								'url('+result+')', 
								preview
							);
						}else if (type == 'design') {
							
							var deco = JSON.parse(decodeURIComponent(atob(result.split('base64,')[1]))),
								scre = deco.stages[Object.keys(deco.stages)[0]].screenshot;
							
							if (attr('file-preview')) {
								$(attr('file-preview')).attr('src', scre);
							}
						}else{
							
							if (attr('file-preview'))
								$(attr('file-preview')).attr('src', result);
						}
						
						if (attr('file-input')) {
							
							var data = {
								data: result,
								size: this.file.size,
								name: 'lumise-media-'+this.file.name.replace(/[^0-9a-zA-Z\.\-\_]/g, "").trim().replace(/\ /g, '+'),
								type: this.file.type ? this.file.type : this.file.name.split('.').pop()
							}
							
							if (attr('file-thumbn-width') || attr('file-thumbn-height')) {
							
								lumise_create_thumbn({
									source: result,
									width: attr('file-thumbn-width') || null,
									height: attr('file-thumbn-height') || null,
									callback: function(res) {
										data.thumbn = res;
										if (attr('file-preview'))
											$(attr('file-preview')).attr('src', res);
										$(attr('file-input')).val(JSON.stringify(data));
									}
								});
							
							} else {
								
								if (type == 'design')
									data.thumbn = scre;
								
								$(attr('file-input')).val(JSON.stringify(data));
							}
							
						}
							
			        };
			        
			        reader.readAsDataURL(this.files[0]);
			        
			    }
				
			},
			
			delete_upload: function(e) {
				
				var _this = this,
				attr = function(s){
					return _this.getAttribute('data-'+s);
				}
				
				if (attr('file-preview'))
					$(attr('file-preview')).attr('src', '').html('');
				if (attr('file-input'))
					$(attr('file-input')).val('');
				if (attr('file-thumbn')) {
					$(attr('file-thumbn')).val('');
				}
				
				e.preventDefault();
				return false;
				
			},
			
			change_color: function(e) {

				var color = e.target.getAttribute('data-color'),
					wrp = $(this).closest('.lumise-field-color-wrp');
				
				if (color) {
					
					if (color == 'delete'){
						$(e.target.parentNode).remove();
						e.data.return_colors(wrp);
						return;
					}
					
					wrp.find('li[data-color].choosed').removeClass('choosed');
					
					wrp.find('input[data-el="select"]').val(color);
					$(e.target).addClass('choosed');
					
					e.data.return_colors(wrp);
					
				}

			},
			
			create_color: function(e) {
				
				var _this = $(this),
					render = function(colors, active) {
					
						if (typeof active != 'object')
							active = [];
						
						if (colors.length > 0) {
						
							colors.map(function(l, i){
								l = decodeURIComponent(l).split('@');
								colors[i] = '<li style="border-left: 20px solid '+l[0]+'" data-color="'+l[0]+'"><span>'+(
											(l[1] !== undefined && l[1] !== '') ? 
											decodeURIComponent(l[1]).replace(/\"/g, '') : 
											(color_maps[l] !== undefined ? color_maps[l] : l)
										)+'</span> <input type="checkbox" '+((active.indexOf(l) > -1) ? 'checked ': '')+' />\
										<i class="fa fa-check"></i>\
									</li>';
							});
						} else {
							colors = ['<p class="empty">'+LumiseDesign.js_lang['144']+'</p>'];	
						};
						
						var lis = '';
						
						Object.keys(color_maps).map(function(c){
							lis += '<li data-color="'+c+'" style="color: '+c+'">'+color_maps[c]+'</li>';
						});
						
						$('#lumise-list-colors-body').html(
							'<div class="col">\
								<h3>'+LumiseDesign.js_lang['145']+'</h3>\
								<div class="create-color-grp">\
									<input type="text" name="label" placeholder="Color Label" />\
									<input type="text" name="hex" placeholder="Color HEX" />\
									<input type="color" /> \
									<span>Color <br>picker</span>\
									<p>\
										<button data-func="apply-now">'+
										LumiseDesign.js_lang.apply+
										' <i class="fa fa-check"></i></button>\
										<button data-func="add-list">'+
										LumiseDesign.js_lang['140']+
										' <i class="fa fa-arrow-right"></i></button>\
									</p>\
									<ul class="color-names">'+lis+'</ul>\
								</div>\
							</div>\
							<div class="col">\
								<h3>\
									'+LumiseDesign.js_lang['143']+'\
									<a href="#unselectall">'+LumiseDesign.js_lang['142']+'</a>\
									<a href="#selectall">'+LumiseDesign.js_lang['141']+'</a>\
									<a href="#delete">'+LumiseDesign.js_lang['146']+'</a>\
								</h3>\
								<ul class="colors-ul">'+colors.join('')+'</ul>\
							</div>'
						);
						
						
						trigger({
							
							el: $('#lumise-list-colors'),
							
							events: {
								':click': function(e) {
									if (e.target.id == 'lumise-list-colors')
										e.data.el.remove();
								},
								'.close-pop': 'close_pop',
								'.pop-save': 'pop_save',
								'.colors-ul li': 'select_color',
								'a[href="#selectall"]': 'select_all',
								'a[href="#unselectall"]': 'unselect_all',
								'a[href="#delete"]': 'delete_selection',
								'.create-color-grp input[type="color"]:input': 'color_picker',
								'.color-names li': 'color_name',
								'button[data-func="add-list"]': 'add_list',
								'button[data-func="apply-now"]': 'apply_now'
							},
							
							close_pop: function(e) {
								e.data.el.remove();
								e.preventDefault();
							},
							
							pop_save: function(e) {
								
								var active = [];
								
								e.data.el.find('ul.colors-ul li').each(function(){
									if ($(this).find('input[type="checkbox"]').prop('checked') === true)
										active.push(this.getAttribute('data-color')+'@'+encodeURIComponent($(this).find('span').text()));
								});
								
								if (active.length > 0) {
									apply(active);
								};
								
								e.preventDefault();
								$('#lumise-list-colors').remove();
								
							},
							
							select_color: function(e) {
								$(this).find('input[type="checkbox"]').click();
							},
							
							select_all: function(e) {
								e.data.el.find('.colors-ul input[type="checkbox"]').attr({'checked': true});
								e.preventDefault();
							},
							
							unselect_all: function(e) {
								e.data.el.find('.colors-ul input[type="checkbox"]').attr({'checked': false});
								e.preventDefault();
							},
							
							delete_selection: function(e) {
								
								if (confirm(LumiseDesign.js_lang.sure)) {
									
									var colors = [];
									
									e.data.el.find('ul.colors-ul li').each(function(){
										if ($(this).find('input[type="checkbox"]').prop('checked') === true) {
											$(this).remove();
										} else {
											colors.push(
												this.getAttribute('data-color')+'@'+
												encodeURIComponent($(this).find('span').text())
											);	
										}
									});
									
									$.ajax({
										url: LumiseDesign.ajax,
										method: 'POST',
										data: {
											nonce: 'LUMISE_ADMIN:'+LumiseDesign.nonce,
											ajax: 'backend',
											action: 'list_colors',
											save_action: colors.join(',')
										}
									});
								}
							},
							
							color_picker: function(e) {
								
								e.data.el.find('.create-color-grp input[name="hex"]').val(this.value);
								if (e.data.el.find('.create-color-grp input[name="label"]').val() === '') {
									e.data.el.find('.create-color-grp input[name="label"]').val(
										color_maps[this.value] !== undefined ? color_maps[this.value] : ''
									);
								}
								
							},
							
							color_name: function(e) {
								
								e.data.el.
									find('.create-color-grp input[type="color"]').
									val(this.getAttribute('data-color'));
									
								e.data.el.find('.create-color-grp input[name="label"]').val(color_maps[this.getAttribute('data-color')]);
								e.data.el.find('.create-color-grp input[name="hex"]').val(this.getAttribute('data-color'));
								
							},
							
							check_color: function(e) {
								
								var el = e.data.el.find('.create-color-grp input[name="hex"]'),
									label = e.data.el.find('.create-color-grp input[name="label"]').val(),
									cl = el.val().toLowerCase().trim();
								
								if (cl.indexOf('rgb') > -1) {
									cl = rgb2hex(cl);
									el.val(cl);
								};
								
								if (Object.values(color_maps).indexOf(cl) > -1) {
									cl = Object.keys(color_maps).filter(function(s){
										return color_maps[s].toLowerCase() == cl;
									})[0];
									el.val(cl);
								};
									
								if (cl === '' || cl.length != 7 || cl.indexOf('#') !== 0) {
									e.data.el.find('.create-color-grp input[name="hex"]').shake();
									return false;
								} else return cl+'@'+encodeURIComponent(label);
									
							},
							
							add_list: function(e) {
								
								e.preventDefault();
								
								var cl = e.data.check_color(e);
								
								if (cl === false)
									return;
									
								var colors = [], active = [];
								colors.push(encodeURIComponent(cl));
								
								e.data.el.find('.colors-ul li').each(function(){
									
									colors.push(encodeURIComponent(this.getAttribute('data-color')+'@'+encodeURIComponent($(this).find('span').text().trim())));
									
									if ($(this).find('input[type="checkbox"]').prop('checked') === true)
										active.push(this.getAttribute('data-color'));
								});
								
								$.ajax({
									url: LumiseDesign.ajax,
									method: 'POST',
									data: {
										nonce: 'LUMISE_ADMIN:'+LumiseDesign.nonce,
										ajax: 'backend',
										action: 'list_colors',
										save_action: colors.join(',')
									}
								});
								
								render(colors, active);
								
							},
							
							apply_now: function(e) {
								
								e.preventDefault();
								
								var cl = e.data.check_color(e);
								
								if (cl === false)
									return;
								
								apply([cl]);
									
							}
							
						});
							
					},
					apply = function(colors) {
					
						var val = _this.prev().val(),
							wrp = _this.closest('.lumise-field-color-wrp');
						
						colors.map(function(c) {
							
							c = c.split('@');
							
							if (wrp.find('li[data-color="'+c[0]+'"]').length === 0) {
								wrp.find('ul.lumise-field-color').append('<li data-color="'+c[0]+'" style="background:'+c[0]+'" data-label="'+(c[1] !== undefined ? c[1] : '')+'"><i class="fa fa-times" data-color="delete"></i></li>');
							};
							
							wrp.find('li[data-color="'+c+'"]').animate({'opacity': 0.1}, 350).delay(50).animate({'opacity': 1}, 350);
							
						});
						
						e.preventDefault();
						e.data.return_colors(wrp);
						$('#lumise-list-colors').remove();
						
					};
				
				$('body').append(
					'<div id="lumise-list-colors" class="lumise-popup" style="display:block">\
						<div class="lumise-popup-content">\
							<header>\
								<h3>'+LumiseDesign.js_lang['139']+'</h3>\
								<span class="pop-save" title="'+LumiseDesign.js_lang.save+'"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="-150 -150 750 750" height="32px" width="32px" xml:space="preserve"><path d="M506.231,75.508c-7.689-7.69-20.158-7.69-27.849,0l-319.21,319.211L33.617,269.163c-7.689-7.691-20.158-7.691-27.849,0    c-7.69,7.69-7.69,20.158,0,27.849l139.481,139.481c7.687,7.687,20.16,7.689,27.849,0l333.133-333.136    C513.921,95.666,513.921,83.198,506.231,75.508z"></path></svg></span>\
								<span class="close-pop" title="'+LumiseDesign.js_lang.close+'"><svg enable-background="new 0 0 32 32" height="32px" id="close" version="1.1" viewBox="-4 -4 40 40" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M17.459,16.014l8.239-8.194c0.395-0.391,0.395-1.024,0-1.414c-0.394-0.391-1.034-0.391-1.428,0  l-8.232,8.187L7.73,6.284c-0.394-0.395-1.034-0.395-1.428,0c-0.394,0.396-0.394,1.037,0,1.432l8.302,8.303l-8.332,8.286  c-0.394,0.391-0.394,1.024,0,1.414c0.394,0.391,1.034,0.391,1.428,0l8.325-8.279l8.275,8.276c0.394,0.395,1.034,0.395,1.428,0  c0.394-0.396,0.394-1.037,0-1.432L17.459,16.014z" fill="#121313" id="Close"></path></svg></span>\
							</header>\
							<div id="lumise-list-colors-body">\
								<img src="'+LumiseDesign.assets+'assets/images/loading.gif" height="36" style="margin-top: 200px;" />\
							</div>\
						</div>\
					</div>'
				);
				
				$.ajax({
					url: LumiseDesign.ajax,
					method: 'POST',
					data: {
						nonce: 'LUMISE_ADMIN:'+LumiseDesign.nonce,
						ajax: 'backend',
						action: 'list_colors'
					},
					statusCode: {
						403: function(){
							alert(LumiseDesign.js_lang.error_403);
						}
					},
					success: function(res) {
						
						render(res.split(','));
						
					}
				});
				
				e.preventDefault();
				return;
				
				
			},
			
			clear_color: function(e) {
				
				if (confirm(LumiseDesign.js_lang.sure)) {
					$(this).closest('.lumise-field-color-wrp').find('li[data-color]').remove();
				};
				
				e.preventDefault();
					
			},
			
			return_colors: function(wrp) {
				
				var color = wrp.find('input[data-el="select"]').val(),
					cur_color = wrp.find('li.choosed[data-color]'),
					val = [];
					
				if(cur_color.get(0)){
					color = cur_color.data('color');
				}
				
				wrp.find('li[data-color]').each(function(){
					
					val.push(this.getAttribute('data-color')+'@'+this.getAttribute('data-label'));
					var label = decodeURIComponent(this.getAttribute('data-label')).replace(/\"/g, '');
					
					if (label === '') {
						label = color_maps[this.getAttribute('data-color')] !== undefined ? 
								color_maps[this.getAttribute('data-color')] : 
								this.getAttribute('data-color');
					};
					
					this.setAttribute('title', label);
					
				});
				
				val = color+':'+val.join(',');
				
				wrp.find('input[data-el="hide"]').val(val);
					
			},
			
			add_attribute: function(e) {
				
				var wrp = $(this).closest('.lumise-field-attributes'),
					body = wrp.find('.lumise-field-attributes-body');
				
				
				e.preventDefault();
					
			},
			
			do_submit: function() {
				$(this).closest('form').submit();
			},
			
			field_attribute_refresh: function() {
				
				$('.lumise-field-attributes>header>button[data-func="add"]').off('click').on('click', this, this.new_attribute);
				$('.lumise-field-attributes .lumise-field-attributes-body .lumise-attribute>header').off('click').on('click', this, this.attribute_toggle);
				$('.lumise-field-attributes .lumise-field-attributes-body .lumise-attribute>header>i[data-func="trash"]').off('click').on('click', this, this.attribute_delete);
				$('.lumise-field-attributes .lumise-field-attributes-body div[data-view="col"] input[name="lumise-attr-title"]').off('input').on('input', this, this.change_attribute_title);
				$('.lumise-field-attributes .lumise-field-attributes-body div[data-view="col"] input[name="lumise-attr-title"]').off('change').on('change', this, this.check_attribute_title);
				$('.lumise-field-attributes .lumise-field-attributes-body div[data-view="col"] select[name="lumise-attr-type"]').off('change').on('change', this, this.change_attribute_type);
				$('.lumise-field-attributes .lumise-field-attributes-body a[data-func="add_opt"]').off('click').on('click', this, this.attribute_add_opt);
				$('.lumise-field-attributes .lumise-field-attributes-body .lumise-attribute-options i[data-func="trash"]').off('click').on('click', this, this.attribute_delete_opt);
				
				$(".lumise-attribute-options tbody").sortable({
					items: 'tr',
					handle: 'i[data-func="drag"]',
					helper: function(e, ui) {  
						ui.children().each(function() {  
							$(this).width($(this).width());
						});  
						return ui;  
					},
					start: function(e, ui){
						var wrp = $(ui.item[0]).closest('.lumise-field-attributes');
						wrp.css({'min-height': 0});
						wrp.css({'min-height': wrp.height()});
					}
				});
			},
			
			new_attribute: function(e) {
				
				var wrp = $(this).closest('.lumise-field-attributes');
				
				wrp.find('.lumise-field-attributes-body').append(wrp.find('.lumise-attribute-tmpl').html());
				e.data.field_attribute_refresh();
				
				wrp.find('.lumise-field-attributes-body .lumise-attribute').
					last().attr({'data-type': 'select'}).
					find('i[data-func="toggle"]').
					trigger('click');
				
				$(window).scrollTop(wrp.find('.lumise-field-attributes-body .lumise-attribute').last().offset().top);
				e.preventDefault();
				
			},
			
			attribute_toggle: function(e) {
				
				var wrp = $(this).closest('.lumise-field-attributes'),
					att = $(this).closest('.lumise-attribute'),
					bod = att.find('.lumise-attribute-body'),
					stt = bod.css('display');
				
				wrp.find('.lumise-attribute').removeAttr('data-expand');
				
				if (stt == 'none'){
					wrp.find('.lumise-field-attributes-body .lumise-attribute-body').hide();
					bod.show();
					att.attr('data-expand', 'true');
				}else{
					bod.hide();
					att.attr('data-expand', 'false');
				}
				
				wrp.css({'min-height': 0});
				wrp.css({'min-height': wrp.height()});
				
			},
			
			attribute_delete: function(e) {
				
				var wrp = $(this).closest('.lumise-field-attributes');
				$(this).closest('.lumise-attribute').remove();
				wrp.css({'min-height': 0});
				wrp.css({'min-height': wrp.height()});
			},
			
			change_attribute_title: function(e) {
				
				$(this).closest('.lumise-attribute').find('>header>span[data-func="title"]').html(this.value);
				$(this).closest('.lumise-attribute').find('header').removeClass('lumise-invalid');
				$(this).closest('.lumise-attribute-body').find('.lumise-invalid-attribute').remove();
			},
			
			check_attribute_title: function (e){
				
				var title_inputs = $('.lumise-field-attributes .lumise-field-attributes-body div[data-view="col"] input[name="lumise-attr-title"]'),
					titles = [],
					res = true;
					highlight = function (elm){
						res = false;
						var body = $(elm).closest('.lumise-attribute-body');
						body.find('.lumise-invalid-attribute').remove();
						body.prepend('<span class="lumise-invalid-attribute">'+lumise.i(126)+'</span>');
						$(elm).closest('.lumise-attribute').find('header').addClass('lumise-invalid');
					};
					
				title_inputs.each(function (ind){
					$(this).closest('.lumise-attribute').find('header').removeClass('lumise-invalid');
					$(this).closest('.lumise-attribute-body').find('.lumise-invalid-attribute').remove();
					var val = $(this).val().toLowerCase();
					if(titles.indexOf(val) == -1 )
						titles.push(val);
					else highlight($(this));
				});
				
				return res;
			},
			
			check_submit: function (e){
				
				$('#lumise-tab-attributes').find('span.lumise-msg-invalid').remove();
				
				if(!e.data.check_attribute_title()){
					var tab_attr = $('body a[href="#lumise-tab-attributes"]'),
						li = tab_attr.closest('li');
					
					if(!li.hasClass('active')){
						tab_attr.trigger('click');
					}
					$('#lumise-tab-attributes').prepend('<span class="lumise-msg-invalid">'+lumise.i(127)+'</span>');
					return false;
				} else return true;
			},
			
			change_attribute_type: function(e) {
				
				var att_body = $(this).closest('div.lumise-field-attributes-body');
				
				if (
					(
						this.value == 'size' ||
						this.value == 'pack'
					) 
					&& 
					(
						(
							att_body.find('div.lumise-attribute[data-type="size"]').length > 0 &&
							$(this).closest('div.lumise-attribute').get(0) !== att_body.find('div.lumise-attribute[data-type="size"]').get(0)
						) 
						||
						(
							att_body.find('div.lumise-attribute[data-type="pack"]').length > 0 &&
							$(this).closest('div.lumise-attribute').get(0) !== att_body.find('div.lumise-attribute[data-type="pack"]').get(0)
						)
					)
				){
					alert('Error: can not create more than 1 field type size or package');
					var curr = $(this).closest('div.lumise-attribute').data('type');
					$(this).val(curr);
					e.preventDefault();
					return false;
				};
				
				var wrp = $(this).closest('.lumise-field-attributes'),
					body = $(this).closest('.lumise-attribute-body'),
					ops = body.find('.lumise-attribute-options');
				
				$(this).closest('.lumise-attribute').attr({'data-type': this.value});
				
				if (['text', 'upload'].indexOf(this.value) > -1) {
					ops.html('');
				}else{
					ops.html(wrp.find('.lumise-attribute-tmpl .lumise-attribute-options').html());
					e.data.field_attribute_refresh();
				}
					
			},
			
			attribute_add_opt: function(e) {
				
				var wrp = $(this).closest('.lumise-field-attributes'),
					tabl = $(this).closest('table');
					
				tabl.find('tbody').append(wrp.find('.lumise-attribute-tmpl .lumise-attribute-options tbody tr').first().clone());
				e.data.field_attribute_refresh();
				e.preventDefault();
			},
			
			attribute_delete_opt: function(e) {
				
				var wrp = $(this).closest('.lumise-field-attributes');
				$(this).closest('tr').remove();
				wrp.css({'min-height': 0});
				wrp.css({'min-height': wrp.height()});
			},
			
			google_fonts: function(e) {
				
				var wrp = $(this),
					el = $(e.target);
					act = el.data('act') ? el.data('act') : el.closest('[data-act]').data('act');
				
				switch (act) {
					case 'delete' : 
					
						el.closest('li').remove();
						
						var data = {};
						wrp.find('li').each(function(){
							data[this.getAttribute('data-n')] = [this.getAttribute('data-f'), this.getAttribute('data-s')];
						});
						wrp.find('textarea[data-func="value"]').val(JSON.stringify(data));
						
					break;
					case 'add' :
					
						lightbox({
							content: '<iframe src="https://services.lumise.com/fonts/?mode=select"></iframe>'
						});
						
						$('#lumise-lightbox iframe').on('load', function() {
							this.contentWindow.postMessage({
								action: 'fonts',
								fonts: wrp.find('textarea[data-func="value"]').val()
							}, "*");
						});
						e.preventDefault();
					break;
				}
				
			},
			
			report_bug: function(e) {
				
				e.preventDefault();
				$(this).after('<i class="fa fa-spinner fa-spin fa-2x fa-fw margin-bottom"></i>');
				var wrp = this.parentNode;
				$(this).remove();
				
				$.ajax({
					url: LumiseDesign.ajax,
					method: 'POST',
					data: {
						nonce: 'LUMISE_ADMIN:'+LumiseDesign.nonce,
						ajax: 'backend',
						action: 'report_bug',
						id: this.getAttribute('data-id')
					},
					statusCode: {
						403: function(){
							alert(LumiseDesign.js_lang.error_403);
						}
					},
					success: function(res) {
						wrp.innerHTML = JSON.stringify(res);
					}
				});
				
				
			}
			
		});

		// Set Price(Cliparts)
		$(".lumise_set_price").on('change', function(event) {

			event.preventDefault();
			var data = {
				"type": $(this).data('type'),
				"id": $(this).data("id"),
		        "value": $(this).val()
		    }, that = $(this);

			$.ajax({
				url: LumiseDesign.ajax,
				method: 'POST',
				data: LumiseDesign.filter_ajax({
					action: 'lumise_set_price',
					nonce: 'LUMISE_ADMIN:'+LumiseDesign.nonce,
					data: data
				}),
				dataType: 'json',
				statusCode: {
					403: function(){
						alert(LumiseDesign.js_lang.error_403);
					}
				},
				success: function(data){
					if (data.status == 'success') {
						var obj = jQuery('<span class="set_success">'+lumise.i(79)+'</span>');
						that.parent().append(obj);
						that.val(data.value);
						setTimeout(function(){
						    obj.remove();
						}, 600);
					} else {
						var obj = jQuery('<span class="set_error">'+lumise.i(97)+'</span>');
						that.parent().append(obj);
						setTimeout(function(){
						    obj.remove();
						}, 600);
					}
				}
			});
			
		});

		// Select Currency
		$( function() {
		    $.widget( "custom.combobox", {
				_create: function() {
					this.wrapper = $( "<div>" )
					  .addClass( "lumise-combobox" )
					  .insertAfter( this.element );

					this.element.hide();
					this._createAutocomplete();
					this._createShowAllButton();
				},
		 
				_createAutocomplete: function() {
					var selected = this.element.children( ":selected" ),
						value = selected.val() ? selected.text() : "";

					this.input = $( "<input>" )
						.appendTo( this.wrapper )
						.val( value )
						.addClass( "lumise-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
						.autocomplete({
							delay: 0,
							minLength: 0,
							source: $.proxy( this, "_source" )
						})
						.tooltip({
							classes: {
							  "ui-tooltip": "ui-state-highlight"
							}
					});

					this._on( this.input, {
						autocompleteselect: function( event, ui ) {
							ui.item.option.selected = true;
							this._trigger( "select", event, {
								item: ui.item.option
							});
						},
						autocompletechange: "_removeIfInvalid"
					});
				},
		 
		      	_createShowAllButton: function() {
			        var input = this.input,
			          wasOpen = false;
			 
			        $( "<a>" )
						.attr( "tabIndex", -1 )
						.tooltip()
						.appendTo( this.wrapper )
						.removeClass( "ui-corner-all" )
						.addClass( "lumise-combobox-toggle ui-corner-right" )
						.on( "mousedown", function() {
							wasOpen = input.autocomplete( "widget" ).is( ":visible" );
						})
						.on( "click", function() {
							input.trigger( "focus" );

							// Close if already visible
							if ( wasOpen ) {
							 	return;
							}

							// Pass empty string as value to search for, displaying all results
							input.autocomplete( "search", "" );
						});
		      	},
		 
				_source: function( request, response ) {
					var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
					response( this.element.children( "option" ).map(function() {
						var text = $( this ).text();
						if ( this.value && ( !request.term || matcher.test(text) ) )
						return {
							label: text,
							value: text,
							option: this
						};
					}));
				},
		 
		      	_removeIfInvalid: function( event, ui ) {
		 
					// Selected an item, nothing to do
					if ( ui.item ) {
					  return;
					}

					// Search for a match (case-insensitive)
					var value = this.input.val(),
						valueLowerCase = value.toLowerCase(),
						valid = false;
					this.element.children( "option" ).each(function() {
						if ( $( this ).text().toLowerCase() === valueLowerCase ) {
							this.selected = valid = true;
							return false;
						}
					});

					// Found a match, nothing to do
					if ( valid ) {
						return;
					}

					// Remove invalid value
					this.input
						.val( "" )
						.tooltip( "open" );
					this.element.val( "" );
					this._delay(function() {
						this.input.tooltip( "close" ).attr( "title", "" );
					}, 2500 );
					this.input.autocomplete( "instance" ).term = "";
					},

					_destroy: function() {
						this.wrapper.remove();
						this.element.show();
					}

		   		});
		 
		    $( ".lumise_currency" ).combobox();
		});

		// Multi Select Tag
		$( function() {

			function split( val ) {
			  return val.split( /,\s*/ );
			}
			function extractLast( term ) {
			  return split( term ).pop();
			}

			$( "#tags" )
			// don't navigate away from the field on tab when selecting an item
			.on( "keydown", function( event ) {
				if ( event.keyCode === $.ui.keyCode.TAB &&
					$( this ).autocomplete( "instance" ).menu.active ) {
					event.preventDefault();
				}
			})
			.autocomplete({
				minLength: 0,
				source: function( request, response ) {
					// delegate back to autocomplete, but extract the last term
					if (window.lumise_tag_values !== undefined) {
						response( $.ui.autocomplete.filter(
							lumise_tag_values, 
							extractLast( request.term ) ) 
						);
					};
				},
				focus: function() {
					// prevent value inserted on focus
					return false;
				},
				select: function( event, ui ) {
					var terms = split( this.value );
					// remove the current input
					terms.pop();
					// add the selected item
					terms.push( ui.item.value );
					// add placeholder to get the comma-and-space at the end
					terms.push( "" );
					this.value = terms.join( ", " );
					return false;
				}
			});
		});

		// Box Tab
		if (typeof window.lumise_sampleTags !== 'undefined') {
			$('.tagsfield').tagit({
				availableTags: lumise_sampleTags,
				autocomplete: {delay: 0, minLength: 2},
				removeConfirmation: true,
				afterTagAdded: function(event, ui) {
					var data = {
				        "type": $(this).data('type'),
				        "id": $(this).data('id'),
				        'value': ui.tag.find('.tagit-label').html()
				    }, that = $(this);
				    if(!ui.duringInitialization)
						$.ajax({
							url: LumiseDesign.ajax,
							method: 'POST',
							data: LumiseDesign.filter_ajax({
								action: 'add_tags',
								nonce: 'LUMISE_ADMIN:'+LumiseDesign.nonce,
								data: data
							}),
							dataType: 'json',
							statusCode: {
								403: function(){
									alert(LumiseDesign.js_lang.error_403);
								}
							},
							success: function(data){
								if (data.status == 'success') {
									var obj = jQuery('<span class="set_success">'+lumise.i(79)+'</span>');
									that.parent().append(obj);
									setTimeout(function(){
									    obj.remove();
									}, 600);
								} else{
									var obj = jQuery('<span class="set_error">'+lumise.i(97)+'</span>');
									that.parent().append(obj);
									setTimeout(function(){
									    obj.remove();
									}, 600);
								}
							}
						});
				},
				beforeTagRemoved: function(event, ui) {
			        var data = {
				        "type": $(this).data('type'),
				        "id": $(this).data('id'),
				        'value': ui.tag.find('.tagit-label').html()
				    }, that = $(this);

					$.ajax({
						url: LumiseDesign.ajax,
						method: 'POST',
						data: LumiseDesign.filter_ajax({
							action: 'remove_tags',
							nonce: 'LUMISE_ADMIN:'+LumiseDesign.nonce,
							data: data
						}),
						dataType: 'json',
						statusCode: {
							403: function(){
								alert(LumiseDesign.js_lang.error_403);
							}
						},
						success: function(data){
							if (data.status == 'success') {
								var obj = jQuery('<span class="set_success">'+lumise.i(79)+'</span>');
								that.parent().append(obj);
								setTimeout(function(){
								    obj.remove();
								}, 600);
							} else{
								var obj = jQuery('<span class="set_error">'+lumise.i(97)+'</span>');
								that.parent().append(obj);
								setTimeout(function(){
								    obj.remove();
								}, 600);
							}
						}
					});
			    }
	        });
		}

		// Menu admin		
		$(".lumise_sub_menu.open").each( function(){
			var height = 0;
			$(this).find('li').each(function (i){
				height += $(this).outerHeight();
			});
			$(this).css({'height': height});
		});

		// Back To Top
		if ($(".lumise_backtotop").length > 0) {

			$(window).scroll(function () {
				var e = $(window).scrollTop();
				if (e > 250) {
					$(".lumise_backtotop").addClass('show')
				} else {
					$(".lumise_backtotop").removeClass('show')
				}
			});

			$(".lumise_backtotop").click(function () {
				$('body,html').animate({
					scrollTop: 0
				}, 500)
			})

		}
		
		// Active the first tab
		$('.lumise_tab_nav').each(function(){
			
			var wrp = $(this).closest('.lumise_tabs_wrapper'),
				hist = localStorage.getItem('LUMISE-TABS'),
				id = wrp.data('id');
					
			if (!hist)
				hist = {};
			else hist = JSON.parse(hist);
			
			if (id === '' || !hist[id] || $(this).find('a[href="'+hist[id]+'"]').length === 0)
				$(this).find('a').first().trigger('click');
			else $(this).find('a[href="'+hist[id]+'"]').first().trigger('click');
			
		});
		
		
		// Active the first tab attribute
		$('.lumise-field-attributes').each(function(){
			var attr = $(this);
			$(this).find('i[data-func="toggle"]').first().trigger('click');
			
			if ($(this).closest('form').data('event-field-attribute') !== true) {
				$(this).closest('form').data({'event-field-attribute': true}).on('submit', function(){
					var data = [];
					attr.find('.lumise-field-attributes-body .lumise-attribute').each(function(){
						if ($(this).find('div[data-view="col"] input[name="lumise-attr-price"]').val() !== '') {
							var options = [], op;
							$(this).find('.lumise-attribute-options tbody tr').each(function(){
								if (
									$(this).find('input[name="lumise-attr-price"]').val() !== '' ||
									$(this).find('input[name="lumise-attr-title"]').val() !== ''
								) {
									op = {
										title: $(this).find('input[name="lumise-attr-title"]').val(),
										price: $(this).find('input[name="lumise-attr-price"]').val(),
										min_quantity: $(this).find('input[name="lumise-attr-min-quantity"]').val(),
										max_quantity: $(this).find('input[name="lumise-attr-max-quantity"]').val()
									};
									if (op.price === '')
										op.price = 0;
									options.push(op);
								}
							});
							data.push({
								'title': $(this).find('div[data-view="col"] input[name="lumise-attr-title"]').val(),
								'type': $(this).find('div[data-view="col"] select[name="lumise-attr-type"]').val(),
								'required': $(this).find('div[data-view="col"] input[name="-attr-required"]').get(0).checked,
								'options': options
							});
						}
					});
					
					attr.find('textarea[data-func="value"]').val(btoa(encodeURIComponent(JSON.stringify(data))));
					
				});
			}
			
			attr.find(".lumise-field-attributes-body" ).sortable({
				items: '.lumise-attribute',
				handle: '>header',
				start: function(e, ui){
					var wrp = $(ui.item[0]).closest('.lumise-field-attributes');
					wrp.css({'min-height': 0});
					wrp.css({'min-height': wrp.height()});
				}
			});
			
			attr.find(".lumise-attribute-options tbody").sortable({
				items: 'tr',
				handle: 'i[data-func="drag"]',
				helper: function(e, ui) {  
					ui.children().each(function() {  
						$(this).width($(this).width());
					});  
					return ui;  
				},
				start: function(e, ui){
					var wrp = $(ui.item[0]).closest('.lumise-field-attributes');
					wrp.css({'min-height': 0});
					wrp.css({'min-height': wrp.height()});
				}
				
			});
		
		});
		
		$('.lumise_checkboxes').sortable({
			start: function(e, ui){
				var wrp = $(ui.item[0]).parent();
				wrp.css({'min-height': 0});
				wrp.css({'min-height': wrp.height()});
			}
		});
				
		if (document.lumiseconfig && lumise[document.lumiseconfig.main])
			lumise[document.lumiseconfig.main].init(document.lumiseconfig);
			
		if (document.getElementById('lumise-rss-display')) {
			$.ajax({
				url: LumiseDesign.ajax,
				method: 'POST',
				data: LumiseDesign.filter_ajax({
					action: 'get_rss',
					nonce: 'LUMISE_ADMIN:'+LumiseDesign.nonce
				}),
				statusCode: {
					403: function(){
						alert(LumiseDesign.js_lang.error_403);
					}
				},
				success: function(data){
					document.getElementById('lumise-rss-display').innerHTML = data;
				}
			});
		}	
		
	});
	
	window.lumise_font_preview = function(family, url, preview) {
		
		if (!document.fonts.check('1px '+family)) {
			new FontFace(family, url).load('1px '+family, 'a').then(function(font){
				
				document.fonts.add(font);
				$(preview).css({fontFamily: family, display: 'inline-block'}).html('Font Preview');
				
			});
		}else $(preview).css({fontFamily: family, display: 'inline-block'}).html('Font Preview');
		
	}
	
	window.addEventListener('message', function(e) {
				
		if (e.origin != 'https://services.lumise.com')
			return;

		if (e.data && e.data.action) {
			switch (e.data.action) {
				case 'fonts' : 
					$('.lumise-field-google_fonts textarea[data-func="value"]').val(JSON.stringify(e.data.fonts));
					var txt, list = '';
					Object.keys(e.data.fonts).map(function(f){
						txt = decodeURIComponent(f).replace(/\ /g, '+')+':'+e.data.fonts[f][1];
						list += '<li data-n="'+f+'" data-f="'+e.data.fonts[f][0]+'" data-s="'+e.data.fonts[f][1]+'">';
						list += '<link rel="stylesheet" href="//fonts.googleapis.com/css?family='+txt+'" />';
						list += '<font style="font-family: '+decodeURIComponent(f)+';">'+decodeURIComponent(f)+'</font>';
						list += '<delete data-act="delete">Delete</delete>';
						list += '</li>';
					});
					$('.lumise-field-google_fonts').find('ul').html(list);
				break;
			}
		}
	});
		
	$.fn.shake = function(){
		return this.focus().
			animate({marginLeft: -30}, 100).
			animate({marginLeft: 20}, 100).
			animate({marginLeft: -10}, 100).
			animate({marginLeft: 5}, 100).
			animate({marginLeft: 0}, 100);
	}
	
})(jQuery);
