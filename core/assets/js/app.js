 /*
 *
 * Lumise Designer v1.6
 *
 * https://lumise.com
 * Copyright 2017-2018 : Lumise product designer tool
 * All rights reserved by Lumise Inc
 *
 * This source code is licensed under non-distrbutable rights of Lumise
 * https://lumise.com/terms-conditions/
 *
 */

(function($) {
	
	// Use strict for the private workspace

	window.lumise = {

		e : {
			tools : $('#lumise-top-tools'),
			layers : $('#lumise-layers'),
			main: $('#LumiseDesign')
		},
		
		i : function(s){
			return lumise.data.js_lang[s.toString()];
		},
		
		filters : {},

		ops : {
			downon: null,
			drag_start: null,
			first: {},
			categories: {},
			before_unload: null,
			excmobile: false,
			first_completed: false,
			export_list: [
				'id',
				'src',
				'origin_src',
				'evented',
				'visible',
				'text',
				'fontFamily',
				'fontSize',
				'fontStyle',
				'textDecoration',
				'fontWeight',
				'font',
				'angle',
				'bridge',
				'name',
				'charSpacing',
				'lineHeight',
				'fill',
				'price',
				'resource',
				'fx',
				'opacity',
				'fxOrigin',
				'colors',
				'originX',
				'originY'
			],
			color_maps : {"#000000":"black","#000080":"navy","#00008b":"darkblue","#0000cd":"mediumblue","#0000ff":"blue","#006400":"darkgreen","#008000":"green","#008080":"teal","#008b8b":"darkcyan","#00bfff":"deepskyblue","#00ced1":"darkturquoise","#00fa9a":"mediumspringgreen","#00ff00":"lime","#00ff7f":"springgreen","#00ffff":"cyan","#191970":"midnightblue","#1e90ff":"dodgerblue","#20b2aa":"lightseagreen","#228b22":"forestgreen","#2e8b57":"seagreen","#2f4f4f":"darkslategrey","#32cd32":"limegreen","#3cb371":"mediumseagreen","#40e0d0":"turquoise","#4169e1":"royalblue","#4682b4":"steelblue","#483d8b":"darkslateblue","#48d1cc":"mediumturquoise","#4b0082":"indigo","#556b2f":"darkolivegreen","#5f9ea0":"cadetblue","#6495ed":"cornflowerblue","#663399":"rebeccapurple","#66cdaa":"mediumaquamarine","#696969":"dimgrey","#6a5acd":"slateblue","#6b8e23":"olivedrab","#708090":"slategrey","#778899":"lightslategrey","#7b68ee":"mediumslateblue","#7cfc00":"lawngreen","#7fff00":"chartreuse","#7fffd4":"aquamarine","#800000":"maroon","#800080":"purple","#808000":"olive","#808080":"grey","#87ceeb":"skyblue","#87cefa":"lightskyblue","#8a2be2":"blueviolet","#8b0000":"darkred","#8b008b":"darkmagenta","#8b4513":"saddlebrown","#8fbc8f":"darkseagreen","#90ee90":"lightgreen","#9370db":"mediumpurple","#9400d3":"darkviolet","#98fb98":"palegreen","#9932cc":"darkorchid","#9acd32":"yellowgreen","#a0522d":"sienna","#a52a2a":"brown","#a9a9a9":"darkgrey","#add8e6":"lightblue","#adff2f":"greenyellow","#afeeee":"paleturquoise","#b0c4de":"lightsteelblue","#b0e0e6":"powderblue","#b22222":"firebrick","#b8860b":"darkgoldenrod","#ba55d3":"mediumorchid","#bc8f8f":"rosybrown","#bdb76b":"darkkhaki","#c0c0c0":"silver","#c71585":"mediumvioletred","#cd5c5c":"indianred","#cd853f":"peru","#d2691e":"chocolate","#d2b48c":"tan","#d3d3d3":"lightgrey","#d8bfd8":"thistle","#da70d6":"orchid","#daa520":"goldenrod","#db7093":"palevioletred","#dc143c":"crimson","#dcdcdc":"gainsboro","#dda0dd":"plum","#deb887":"burlywood","#e0ffff":"lightcyan","#e6e6fa":"lavender","#e9967a":"darksalmon","#ee82ee":"violet","#eee8aa":"palegoldenrod","#f08080":"lightcoral","#f0e68c":"khaki","#f0f8ff":"aliceblue","#f0fff0":"honeydew","#f0ffff":"azure","#f4a460":"sandybrown","#f5deb3":"wheat","#f5f5dc":"beige","#f5f5f5":"whitesmoke","#f5fffa":"mintcream","#f8f8ff":"ghostwhite","#fa8072":"salmon","#faebd7":"antiquewhite","#faf0e6":"linen","#fafad2":"lightgoldenrodyellow","#fdf5e6":"oldlace","#ff0000":"red","#ff00ff":"magenta","#ff1493":"deeppink","#ff4500":"orangered","#ff6347":"tomato","#ff69b4":"hotpink","#ff7f50":"coral","#ff8c00":"darkorange","#ffa07a":"lightsalmon","#ffa500":"orange","#ffb6c1":"lightpink","#ffc0cb":"pink","#ffd700":"gold","#ffdab9":"peachpuff","#ffdead":"navajowhite","#ffe4b5":"moccasin","#ffe4c4":"bisque","#ffe4e1":"mistyrose","#ffebcd":"blanchedalmond","#ffefd5":"papayawhip","#fff0f5":"lavenderblush","#fff5ee":"seashell","#fff8dc":"cornsilk","#fffacd":"lemonchiffon","#fffaf0":"floralwhite","#fffafa":"snow","#ffff00":"yellow","#ffffe0":"lightyellow","#fffff0":"ivory","#ffffff":"white"}
		},

		trigger : function( obj ) {

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
						obj.el.off(evs[1]).on( evs[1], obj, func );
					else obj.el.find( evs[0] ).off(evs[1]).on( evs[1], obj, func );

				});

			}
		},

		filter : function(name, obj) {

			if (this.filters[name] !== undefined) {
				this.filters[name].map(function(filter){
					if (typeof filter == 'function')
						obj = filter(obj);
				});
			}

			return obj;

		},

		extends : {

			controls : {

				calcCoords: function(absolute) {

			      var theta = this.angle * (Math.PI / 180),
			          vpt = this.getViewportTransform(),
			          dim = absolute ? this._getTransformedDimensions() : this._calculateCurrentDimensions(),
			          currentWidth = dim.x, currentHeight = dim.y,
			          sinTh = Math.sin(theta),
			          cosTh = Math.cos(theta),
			          _angle = currentWidth > 0 ? Math.atan(currentHeight / currentWidth) : 0,
			          _hypotenuse = (currentWidth / Math.cos(_angle)) / 2,
			          offsetX = Math.cos(_angle + theta) * _hypotenuse,
			          offsetY = Math.sin(_angle + theta) * _hypotenuse,
			          center = this.getCenterPoint(),
			          // offset added for rotate and scale actions
			          coords = absolute ? center : fabric.util.transformPoint(center, vpt),
			          tl  = new fabric.Point(coords.x - offsetX, coords.y - offsetY),
			          tr  = new fabric.Point(tl.x + (currentWidth * cosTh), tl.y + (currentWidth * sinTh)),
			          bl  = new fabric.Point(tl.x - (currentHeight * sinTh), tl.y + (currentHeight * cosTh)),
			          br  = new fabric.Point(coords.x + offsetX, coords.y + offsetY);

			      if (!absolute) {
			        var ml  = new fabric.Point((tl.x + bl.x) / 2, (tl.y + bl.y) / 2),
			            mt  = new fabric.Point((tr.x + tl.x) / 2, (tr.y + tl.y) / 2),
			            mr  = new fabric.Point((br.x + tr.x) / 2, (br.y + tr.y) / 2),
			            mb  = new fabric.Point((br.x + bl.x) / 2, (br.y + bl.y) / 2),
			            mtr = new fabric.Point(tl.x + (currentWidth * cosTh), tl.y + (currentWidth * sinTh));
			            //mtr = new fabric.Point(mt.x + sinTh * this.rotatingPointOffset, mt.y - cosTh * this.rotatingPointOffset);
			      }

			      var coords = {
			        // corners
			        tl: tl, tr: tr, br: br, bl: bl,
			      };

			      if (!absolute) {
			        // middle
			        coords.ml = ml;
			        coords.mt = mt;
			        coords.mr = mr;
			        coords.mb = mb;
			        // rotating point
			        coords.mtr = mtr;
			      }

			      return coords;

			    },

				drawControls: function(ctx) {

					if (!this.hasControls) {
						return this;
					}

					var wh = this._calculateCurrentDimensions(),
						width = wh.x,
						height = wh.y,
						scaleOffset = this.cornerSize,
						left = -(width + scaleOffset) / 2,
						top = -(height + scaleOffset) / 2,
						methodName = this.transparentCorners ? 'stroke' : 'fill';

					ctx.save();

					// middle-top-rotate
					if (this.hasRotatingPoint) {

				        var isobj = lumise.stage().canvas.getActiveObject(),
				       		isgroup = lumise.stage().canvas.getActiveGroup(),
				        	invert = lumise.get.color('invert');
						
				        ctx.fillStyle = invert == '#333' ? '#777' : '#ccc';
				        
						if (isobj || isgroup)
							ctx.fillRect(left, top+height,this.cornerSize,this.cornerSize);

						ctx.fillRect(left+width, top,this.cornerSize,this.cornerSize);
						ctx.fillRect(left+width, top+height,this.cornerSize,this.cornerSize);

						ctx.beginPath();
					    ctx.arc(left+(width/2)+(this.cornerSize/2), top+(this.cornerSize/2), 3, 0, 2 * Math.PI, false);
					    ctx.fill();
					    ctx.closePath();
					    ctx.beginPath();
					    ctx.arc(left+(width/2)+(this.cornerSize/2), top+height+(this.cornerSize/2), 3, 0, 2 * Math.PI, false);
					    ctx.fill();
						ctx.closePath();
					    ctx.beginPath();
					    ctx.arc(left+(this.cornerSize/2)-.5, top+(height/2)+(this.cornerSize/2), 3, 0, 2 * Math.PI, false);
					    ctx.fill();
					    ctx.closePath();
					    ctx.beginPath();
					    ctx.arc(left+width+(this.cornerSize/2)+.5, top+(height/2)+(this.cornerSize/2), 3, 0, 2 * Math.PI, false);
					    ctx.fill();
						ctx.closePath();

						ctx.fillStyle = '#f75555';
						ctx.fillRect(left, top,this.cornerSize,this.cornerSize);
						
						var pos = {
							'rot': [left+width+this.cornerSize*0.1, top+this.cornerSize*0.1], 
							'rez': [left+width+this.cornerSize*0.1, top+height+this.cornerSize*0.1], 
							'del': [left+this.cornerSize*0.1, top+this.cornerSize*0.1]
						}, c = this.cornerSize*0.8;
						
						pos.dou = [left+this.cornerSize*0.1, top+height+this.cornerSize*0.1];
						/*
						if (isobj)
							pos.dou = [left+this.cornerSize*0.1, top+height+this.cornerSize*0.1];
						else pos.gro = [left+this.cornerSize*0.1, top+height+this.cornerSize*0.1];*/
						
						Object.keys(pos).map(function(p){
							ctx.drawImage(
								lumise.objects.icons[(invert == '#333' || p == 'del' ? '' : 'w')+p], 
								pos[p][0], 
								pos[p][1], 
								c, c
							);
						});

						/*return;

				        ctx.font="20px Arial";
				        ctx.fillStyle = invert == '#333' ? 'rgba(255, 255, 255, 0.75)' :  'rgba(30, 30, 30, 0.75)';
						ctx.textAlign = "center";

						if (isobj)
							ctx.fillText('⧉', left+(this.cornerSize/2), top+height+18, this.cornerSize, this.cornerSize);
						else if (isgroup)
							ctx.fillText('⨁', left+(this.cornerSize/2), top+height+17, this.cornerSize, this.cornerSize);

						ctx.font="18px Arial";
						ctx.fillText('↺', left+width+(this.cornerSize/2), top+18, this.cornerSize, this.cornerSize);
						ctx.fillText('⤡', left + width+(this.cornerSize/2), top + height + 18, this.cornerSize, this.cornerSize);
						ctx.font="20px Arial";
						ctx.fillStyle = '#eee';
						ctx.fillText('×', left+(this.cornerSize/2), top+18, this.cornerSize, this.cornerSize);*/

					}

					ctx.restore();

					return this;

				},

				drawBorders: function(ctx) {

					if (!this.hasBorders) {
						return this;
					}

					var wh = this._calculateCurrentDimensions(),
						strokeWidth = 1 / this.borderScaleFactor,
						width = wh.x + strokeWidth,
						height = wh.y + strokeWidth;

					ctx.save();
					ctx.strokeStyle = lumise.get.color('invert') == '#333' ? 'rgba(30, 30, 30, 0.35)' : 'rgba(230, 230, 230, 0.6)';

					this._setLineDash(ctx, [1, 1], null);

					ctx.strokeRect(
						-width / 2,
						-height / 2,
						width,
						height
					);

					if (
						this.hasRotatingPoint &&
						this.isControlVisible('mtr') &&
						!this.get('lockRotation') &&
						this.hasControls
					) {

						var rotateHeight = -height / 2;

						ctx.beginPath();
						ctx.moveTo(0, rotateHeight);
						ctx.lineTo(0, rotateHeight - this.rotatingPointOffset);
						ctx.closePath();
						ctx.stroke();
					}

					ctx.restore();

					return this;

				},

				targetCorner: function(pointer) {

					if (!this.hasControls || !this.active) {
				        return false;
				      }

				      var ex = pointer.x,
				          ey = pointer.y,
				          xPoints,
				          lines;
				      this.__corner = 0;
				      for (var i in this.oCoords) {

				        if (!this.isControlVisible(i)) {
				          continue;
				        }

				        if (i === 'mtr' && !this.hasRotatingPoint) {
				          continue;
				        }

				        if (this.get('lockUniScaling') &&
				           (i === 'mt' || i === 'mr' /*|| i === 'mb'*/ || i === 'ml')) {
				          continue;
				        }

				        lines = this._getImageLines(this.oCoords[i].corner);

						//FPD: target corner not working when canvas has zoom greater than 1
				        var zoom = this.canvas.getZoom() ? this.canvas.getZoom() : 1;

				        xPoints = this._findCrossPoints({ x: ex*zoom, y: ey*zoom }, lines);
				        if (xPoints !== 0 && xPoints % 2 === 1) {
				          this.__corner = i;
				          return i;
				        }
				      }
				      return false;
				},

			},

			canvas : {

				_getRotatedCornerCursor: function(corner, target, e) {

					var cu = 'move';

					switch (corner) {
						case 'tr': cu = 'crosshair'; break;
						case 'tl': cu = 'pointer'; break;
						case 'br': cu = 'nwse-resize'; break;
						case 'bl': cu = 'pointer'; break;
						case 'mt': cu = 'n-resize'; break;
						case 'mr': cu = 'e-resize'; break;
						case 'mb': cu = 's-resize'; break;
						case 'ml': cu = 'w-resize'; break;
					}

					return cu;

			      var n = Math.round((target.getAngle() % 360) / 45);

			      if (n < 0) {
			        n += 8; // full circle ahead
			      }
			      n += cursorOffset[corner];
			      if (e[this.altActionKey] && cursorOffset[corner] % 2 === 0) {
			        //if we are holding shift and we are on a mx corner...
			        n += 2;
			      }
			      // normalize n to be from 0 to 7
			      n %= 8;

				  if (corner == 'tl')
				  	return 'pointer';

			      return this.cursorMap[n];

			    },

			    _setupCurrentTransform: function (e, target) {

					if (!target) {
						return;
					}

					var pointer = this.getPointer(e),
						corner = target._findTargetCorner(this.getPointer(e, true)),
						action = this._getActionFromCorner(target, corner, e),
						origin = this._getOriginFromCorner(target, corner);

					if (lumise.func.ctrl_btns({e: e, target: target}) === true)
						return;

					if (action == 'drag') {
						lumise.ops.downon = target;
						lumise.ops.moved = false;
					}

					this._currentTransform = {
						target: target,
						action: action,
						corner: corner,
						scaleX: target.scaleX,
						scaleY: target.scaleY,
						skewX: target.skewX,
						skewY: target.skewY,
						offsetX: pointer.x - target.left,
						offsetY: pointer.y - target.top,
						originX: origin.x,
						originY: origin.y,
						ex: pointer.x,
						ey: pointer.y,
						lastX: pointer.x,
						lastY: pointer.y,
						left: target.left,
						top: target.top,
						theta: fabric.util.degreesToRadians(target.angle),
						width: target.width * target.scaleX,
						mouseXSign: 1,
						mouseYSign: 1,
						shiftKey: e.shiftKey,
						altKey: e[this.centeredKey]
					};

					this._currentTransform.original = {
						left: target.left,
						top: target.top,
						scaleX: target.scaleX,
						scaleY: target.scaleY,
						skewX: target.skewX,
						skewY: target.skewY,
						originX: origin.x,
						originY: origin.y
					};

					this._resetCurrentTransform();

				},

			}

		},

		objects : {

			events : {

				'selection:cleared' : function(opts) {
					lumise.e.layers.find('li.active').removeClass('active');
					lumise.actions.do('selection:cleared', opts);
					lumise.stack.save();
				},

				'object:selected' : function(opts) {
					lumise.stage().selected_object = opts.target;
					opts.target.setControlVisible('tr', false);
					
					lumise.actions.do('object:selected', opts);
				},

				'object:added' : function(opts) {
					lumise.actions.do('object:added', opts);
				},
				
				'object:modified' : function(opts) {
					lumise.actions.do('object:modified', opts);
				},

				'object:rotating': function(opts){

					[0, 45, 90, 135, 180, 225, 270, 315, 360].map(function(a){
						if (Math.abs(opts.target.angle-a) < 5)
							opts.target.angle = a;
					});

					lumise.get.el('rotate').val(opts.target.angle).attr({'data-value': Math.round(opts.target.angle)+'º'});
				},

				'mouse:down': function(opts) {

					if (lumise.stage().canvas.isDrawingMode && opts.e.shiftKey === false)
						return;
					
					lumise.func.navigation('clear');
					lumise.ops.mousedown = true;

					if (opts.e && opts.e.shiftKey)
						lumise.stage().canvas.set('selection', false);

					if(opts.target !== null)
						lumise.ops.corner = opts.target.__corner;
					else lumise.ops.corner = '';

				},

				'path:created' : function(path){

			        var stage = lumise.stage();
					stage.limit_zone.visible = true;

					lumise.get.el('top-tools').attr({'data-view': 'drawing'});

					lumise.stack.save();

				},

				'mouse:up': function(opts) {

			        var stage = lumise.stage();

			        if (stage.canvas.isDrawingMode)
				    	return;

			        stage.lineX.css({display: 'none'});
					stage.lineY.css({display: 'none'});

					lumise.ops.mousedown = false;
					stage.canvas.set('selection', true);

			        /*lumise.func.reversePortView();*/

					if (lumise.ops.moved !== false) {

						if (lumise.ops.downon !== null) {

							stage.lineX.hide();
							stage.lineY.hide();

						}

					}

					var active = stage.canvas.getActiveObject();
					lumise.e.tools.attr({'data-view': active ? active.type : 'standard'});

					lumise.ops.downon = null;
					lumise.ops.moved = false;

					lumise.stack.save();

				},

				'mouse:move': function(opts) {

					var zoom = lumise.stage().canvas.getZoom(),
						view = lumise.stage().canvas.viewportTransform;

					if (
						opts && opts.e && opts.e.shiftKey &&
						(lumise.ops.mousedown === true || lumise.stage().canvas.isDrawingMode) &&
						zoom > 1 &&
						lumise.ops.corner != 'br'
					) {
						// Move viewing mode
				        var units = 10;
				        var delta = new fabric.Point(opts.e.movementX, opts.e.movementY);

						lumise.stage().canvas.relativePan(delta);
				        return;
				    }

					if (lumise.ops.downon === null)
						return;

					if (lumise.ops.moved !== true)
						lumise.ops.moved = true;

					if (!lumise.get.el('auto-alignment').prop('checked'))
						return;

					var el = {
							top: lumise.ops.downon.top-(lumise.ops.downon.height*lumise.ops.downon.scaleY*0.5),
							left: lumise.ops.downon.left-(lumise.ops.downon.width*lumise.ops.downon.scaleX*0.5),
							height: lumise.ops.downon.height*lumise.ops.downon.scaleY,
							width: lumise.ops.downon.width*lumise.ops.downon.scaleX,
						},
						limit = lumise.stage().limit_zone,
						yct = limit.left+(limit.width/2),
						xct = limit.top+(limit.height/2),
						xt = '',
						yl = '',
						xp = '',
						yp = '';

					if (Math.abs(lumise.ops.downon.left-yct) <= 3) {
						yv = 'block';
						yl = yct;
						yp = 'center';
					}else if(Math.abs(el.left-yct) <= 3){
						yv = 'block';
						yl = yct;
						yp = 'left';
					}else if(Math.abs(el.left+el.width-yct) <= 3){
						yv = 'block';
						yl = yct;
						yp = 'right';
					}else yv = 'none';

					if (Math.abs(lumise.ops.downon.top-xct) <= 3) {
						xv = 'block';
						xt = xct;
						xp = 'center';
					}else if(Math.abs(el.top-xct) <= 3){
						xv = 'block';
						xt = xct;
						xp = 'top';
					}else if(Math.abs(el.top+el.height-xct) <= 3){
						xv = 'block';
						xt = xct;
						xp = 'bottom';
					}else xv = 'none';

					if (yv === 'none' || xv === 'none') {
						lumise.stage().canvas.getObjects().map(function(obj){
							if (obj.visible !== false && obj.evented !== false && obj !== lumise.ops.downon){

								ob = {
									top: obj.top-(obj.height*obj.scaleY*0.5),
									left: obj.left-(obj.width*obj.scaleX*0.5),
									height: obj.height*obj.scaleY,
									width: obj.width*obj.scaleX,
								};

								if (yv === 'none'){
									if (Math.abs(el.left- ob.left) <= 2){
										yl = ob.left;
										yv = 'block';
										yp = 'left';
									}else if (
										Math.abs(
											(el.left + el.width) - (ob.left + ob.width)
										) <= 2
									){
										yl = ob.left + ob.width;
										yv = 'block';
										yp = 'right';
									}else if (
										Math.abs(el.left - (ob.left+ob.width)) <= 2
									){
										yl = ob.left+ob.width;
										yv = 'block';
										yp = 'left';
									}else if (
										Math.abs((el.left + el.width) - ob.left) <= 2
									){
										yl = ob.left;
										yv = 'block';
										yp = 'right';
									}else if (Math.abs((el.left+(el.width/2)) - (ob.left+(ob.width/2))) <= 2){
										yl = ob.left+(ob.width/2);
										yv = 'block';
										yp = 'ycenter';
									}
								}
								if (xv === 'none'){
									if (
										Math.abs(el.top - ob.top) <= 2
									){
										xt = ob.top;
										xv= 'block';
										xp = 'top';
									}else if (
										Math.abs(
											(el.top + el.height) - (ob.top + ob.height)
										) <= 2
									){
										xt = ob.top + ob.height;
										xv = 'block';
										xp = 'bottom';
									}else if (
										Math.abs(el.top - (ob.top+ob.height)) <= 2
									){
										xt = ob.top+ob.height;
										xv = 'block';
										xp = 'top';
									}else if (
										Math.abs((el.top + el.height) - ob.top) <= 2
									){
										xt = ob.top;
										xv = 'block';
										xp = 'bottom';
									}else if (Math.abs((el.top+(el.height/2)) - (ob.top+(ob.height/2))) <= 2){
										xt = ob.top+(ob.height/2);
										xv = 'block';
										xp = 'ycenter';
									}
								}
							}
						});
					}

					lumise.stage().lineX.css({'top': ((xt*zoom)+view[5])+'px', 'display': xv});
					lumise.stage().lineY.css({'left': ((yl*zoom)+view[4])+'px', 'display': yv});

					var gri = false;
					if (yv == 'block') {

						switch (yp) {
							case 'center' :
								lumise.ops.downon.set('left', lumise.stage().limit_zone.left+(lumise.stage().limit_zone.width/2));
							break;
							case 'left' :
								lumise.ops.downon.set('left', yl+(el.width/2));
							break;
							case 'right' :
								lumise.ops.downon.set('left', yl-(el.width/2));
							break;
							case 'ycenter' :
								lumise.ops.downon.set('left', yl);
							break;
						}
						gri = true;
					}

					if (xv == 'block') {

						switch (xp) {
							case 'center' :
								lumise.ops.downon.set('top', lumise.stage().limit_zone.top+(lumise.stage().limit_zone.height/2));
							break;
							case 'top' :
								lumise.ops.downon.set('top', xt+(el.height/2));
							break;
							case 'bottom' :
								lumise.ops.downon.set('top', xt-(el.height/2));
							break;
							case 'xcenter' :
								lumise.ops.downon.set('top', xt);
							break;
						}
						gri = true;
					}

					if (gri === true)
						lumise.stage().canvas.renderAll();

				},
				
				'after:render': function(e){
					lumise.actions.do('after:render');
				}

			},

			do : {

				deactiveAll : function() {
					lumise.stage().canvas.deactivateAll();
					lumise.stage().canvas.renderAll();
					lumise.e.tools.attr({'data-view': 'standard'});
					$('#lumise-layers li.active').removeClass('active');
				}

			},
			
			roundRect : function (ctx, x, y, width, height, radius, fill, stroke) {
				
				if (typeof stroke == 'undefined') {
					stroke = true;
				};
				
				if (typeof radius === 'undefined') {
					radius = 5;
				};
				
				if (typeof radius === 'number') {
					radius = {tl: radius, tr: radius, br: radius, bl: radius};
				} else {
					var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
					for (var side in defaultRadius) {
						radius[side] = radius[side] || defaultRadius[side];
					}
				};
				
				
				ctx.beginPath();
				ctx.moveTo(x + radius.tl, y);
				ctx.lineTo(x + width - radius.tr, y);
				ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
				ctx.lineTo(x + width, y + height - radius.br);
				ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
				ctx.lineTo(x + radius.bl, y + height);
				ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
				ctx.lineTo(x, y + radius.tl);
				ctx.quadraticCurveTo(x, y, x + radius.tl, y);
				ctx.closePath();
				if (fill) {
					ctx.fill();
				};
				
				if (stroke) {
					ctx.strokeStyle="red";
					ctx.stroke();
				};
				
			},
			
			clipto : function (ctx, obj) {

				if (!obj || !obj.canvas)
					return;
				
				if (lumise.stage().canvas.getActiveGroup()) {
					obj = lumise.stage().canvas.getActiveGroup();
			    }

				var centerPoint = obj.getCenterPoint(),
					clipRect = lumise.stage().limit_zone,
					scaleXTo = (1 / obj.scaleX),
					scaleYTo = (1 / obj.scaleY),
					skewXTo = -obj.skewX/52,
					skewYTo = -obj.skewY/52;

				if (obj.flipX)
					scaleXTo = -scaleXTo;
				if (obj.flipY)
					scaleYTo = -scaleYTo;
				
				
			    ctx.save();
			    ctx.translate(0, 0);
			    ctx.transform(1, skewYTo, 0, 1, 0, 0);
			    ctx.transform(1, 0, skewXTo, 1, 0, 0);
			    ctx.scale(scaleXTo, scaleYTo);
			    ctx.rotate((obj.angle * -1) * (Math.PI / 180));

				var x = (clipRect.left) - centerPoint.x + clipRect.strokeWidth,
			        y = (clipRect.top) - centerPoint.y + clipRect.strokeWidth,
			        w = clipRect.width - clipRect.strokeWidth,
			        h = clipRect.height - clipRect.strokeWidth;

			    ctx.beginPath();
			    ctx.roundRect(x, y, w, h, clipRect.radius ? clipRect.radius : 0);
			    
			    ctx.fillStyle = 'transparent';
			    ctx.fill();
			    ctx.closePath();
			    ctx.restore();

			},

			sides : {},

			text : function(ops){

				if (ops.fontFamily && ops.fontFamily.indexOf('"') === -1)
					ops.fontFamily = '"'+ops.fontFamily+'"';
				
				if (lumise.data.text_direction == '1') {	
					ops.originX = lumise.data.rtl == '1' ? 'right' : 'left';
					ops.originY = 'top';
				};
				
				var limit = lumise.stage().limit_zone,
				    _ops = $.extend({
				        left: limit.left + (limit.width/2),
				        top: limit.top + (limit.height/2),
				        angle: 0,
				        textAlign: 'center',
				        fill: lumise.get.color('invert'),
						name: ops.text ? ops.text : 'Sample Text'
				    }, ops),
					object = new fabric.IText(ops.text ? ops.text : 'Sample Text', _ops);
			    
			    object.set({
					clipTo: function(ctx) {
						try{
							return lumise.objects.clipto(ctx, object);
						}catch(ex){}
			        }
				});

				return object;

			},

			qrcode : function(text, color, callback) {

				var canvas = lumise.tools.qrcode({
					text: text,
					foreground: color,
				});

				fabric.Image.fromURL(canvas.toDataURL(), function(image) {

					var stage = lumise.stage();

					image.set({
						left: stage.limit_zone.left + (stage.limit_zone.width/2),
						top: stage.limit_zone.top + (stage.limit_zone.height/2),
						width: stage.limit_zone.width*0.7,
						height: image.height * ((stage.limit_zone.width*0.7)/image.width),
						fill: color,
						backgroundColor: lumise.func.invert(color),
						name: text,
						text: text,
						type: 'qrcode',
						clipTo: function(ctx) {
				            return lumise.objects.clipto(ctx, image);
				        }
					});

					lumise.design.layers.create({type: 'image', image: image});

					callback(image);

				});

			},

			lumise : {

				'i-text' : function(ops, callback) {
					if (lumise.ops.window_width < 1025)
						ops.editable = false;
						
					callback(lumise.objects.text(ops));
				},

				'curvedText' : function(ops, callback) {

					var limit = lumise.stage().limit_zone;

					ops = $.extend({

				        left: limit.left + (limit.width/2),
				        top: limit.top + (limit.height/2),
				        angle: 0,
				        textAlign: 'center',
				        fill: lumise.get.color('invert'),
				        textAlign: 'center',
						radius: 50,
						spacing: 5

				    }, ops);

					var object = new fabric.CurvedText(ops.text ? ops.text : 'Sample Text', ops);

				    object.set({
						clipTo: function(ctx) {
				            try{
								return lumise.objects.clipto(ctx, object);
							}catch(ex){}
				        }
					});

				    callback(object);

				},

				'image' : function(ops, callback) {
					
					if (ops.src.indexOf('.svg') == ops.src.length-4)
						return this.svg(ops, callback);

					fabric.util.loadImage(ops.src, function(img) {
						
					    if(img == null) {
					        lumise.func.notice(lumise.i(33)+ops.src, 'error', 5000);
					        callback(null);
					    }else {
						    
						    if (
						    	img.src.indexOf('data:image/svg+xml') !== 0 && 
						    	lumise.data.min_dimensions !== '' && 
						    	typeof lumise.data.min_dimensions == 'object'
						    ) {
							    if (
							    	parseFloat(lumise.data.min_dimensions[0]) > img.width ||
							    	parseFloat(lumise.data.min_dimensions[1]) > img.height
							    ) {
								    lumise.func.notice(lumise.i(160)+' '+lumise.data.min_dimensions.join('x'), 'notice', 3500);
									return callback(null);
							    }	
						    };
						    
						    if (
						    	img.src.indexOf('data:image/svg+xml') !== 0 && 
						    	lumise.data.max_dimensions !== '' && 
						    	typeof lumise.data.max_dimensions == 'object'
						    ) {
							    
							    if (
							    	parseFloat(lumise.data.max_dimensions[0]) < img.width ||
									parseFloat(lumise.data.max_dimensions[1]) < img.height
							    ) {
								    
								    var cv = document.createElement('canvas');
								    
								    if (parseFloat(lumise.data.max_dimensions[0]) < img.width) {
									    
									    cv.width = parseFloat(lumise.data.max_dimensions[0]);
									    cv.height = cv.width*(img.height/img.width);
									    
									    if (cv.height > lumise.data.max_dimensions[1]) {
										    cv.width = lumise.data.max_dimensions[1]*(cv.width/cv.height);
										    cv.height = lumise.data.max_dimensions[1];
									    };
									    
								    } else if (parseFloat(lumise.data.max_dimensions[1]) < img.height) {
									    
									    cv.height = parseFloat(lumise.data.max_dimensions[1]);
									    cv.width = cv.height*(img.width/img.height);
									    
									    if (cv.width > lumise.data.max_dimensions[0]) {
										    cv.height = lumise.data.max_dimensions[0]*(cv.height/cv.width);
										    cv.width = lumise.data.max_dimensions[0];
									    };
								    
								    };
								    
								    cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
								    
								    ops.src = cv.toDataURL(
								    	'image/'+(
								    		(
								    			ops.src.indexOf('.png') === ops.src.length-4 || 
												ops.src.indexOf('data:image/png') === 0
											) ? 'png' : 'jpeg'
								    	)
								    );
								    
								    delete cv;
								    delete image;
								    return lumise.objects.lumise.image(ops, callback);
							    }
						    };
						    
							if (ops.src.indexOf('http') === 0) {
								
								var cv = document.createElement('canvas');
								
								cv.height = img.naturalHeight;
								cv.width = img.naturalWidth;
								cv.getContext('2d').drawImage(img, 0, 0);
								ops.src = cv.toDataURL('image/'+(ops.src.indexOf('.png') === ops.src.length-4 ? 'png' : 'jpeg'));
								img.onload = function() {
									lumise.stage().canvas.renderAll();
								};
								img.src = ops.src;
								delete cv;
							};
							
							if (ops.src.length > 1000000)
								lumise.func.notice(lumise.i(53), '', 5000);
							
					        var image = new fabric.Image(img);
					        var stage = lumise.stage();
					        
							if (ops.width == undefined) {
								ops.width = stage.limit_zone.width*0.85;
								ops.height = ops.width*(image.height/image.width);
							};
							
							if (ops.height == undefined) {
								ops.height = stage.limit_zone.height*0.85;
								ops.width = ops.height*(image.width/image.height);
							};
							
							if (ops.evented === undefined) {
								if (ops.width > stage.limit_zone.width*0.85) {
									ops.height = (stage.limit_zone.width*0.85)*(ops.height/ops.width);
									ops.width = stage.limit_zone.width*0.85;
								}
								if (ops.height > stage.limit_zone.height*0.85) {
									ops.width = (stage.limit_zone.height*0.85)*(ops.width/ops.height);
									ops.height = stage.limit_zone.height*0.85;
								}	
							};
							
							image.set($.extend({
								left: stage.limit_zone.left + (stage.limit_zone.width/2),
								top: stage.limit_zone.top + (stage.limit_zone.height/2),
								width: ops.width,
								height: ops.height
							}, ops));
							
							if ((ops.filters && ops.filters.length > 0)) {

								ops.filters.map(function(fil, ind){
									if (fil.color){
										ops.filters[ind] = new fabric.Image.filters.Tint({
									        color: fil.color,
									    });
								    }
								});

								image.set('filters', ops.filters);

								image.applyFilters(stage.canvas.renderAll.bind(stage.canvas));

							};

							image.set('clipTo', function(ctx) {
					            return lumise.objects.clipto(ctx, image);
					        });

					        callback(image);

					    }
					}, { crossOrigin: 'anonymous' });

				},

				'text-fx' : function(ops, callback) {
					
					var newobj = lumise.objects.text(ops);

					ops.width = newobj.width;
					ops.height = newobj.height;

					delete ops['type'];
					delete ops['clipTo'];

					if (ops['bridge'] === undefined) {
						ops['bridge'] ={
							curve: -2.5,
							offsetY: 0.5,
							bottom: 2.5,
							trident: false,
							oblique: false,
						}
					}

					var ls = ['angle', 'skewX', 'skewY', 'opacity'], ol = {};

					ls.map(function(l){
						ol[l] = ops[l];
						delete ops[l];
					});

					var textImage = new fabric.Text(ops.text.trim(), ops);
					var cacheTextImage = new Image();

					cacheTextImage.src = textImage.toDataURL();

					var rs = ['width', 'height', 'scaleX', 'scaleY', 'fontSize', 'stroke', 'strokeWidth'];

					rs.map(function(r){
						ops[r] = ops[r]*2;
					});
					
					textImage = new fabric.Text(ops.text.trim(), ops);
					var cacheTextImageLarge = new Image();
					cacheTextImageLarge.src = textImage.toDataURL();

					rs.map(function(r){
						ops[r] = ops[r]/2;
					});
					
					ls.map(function(l){
						ops[l] = ol[l];
					});

					fabric.Image.fromURL(textImage.toDataURL(), function(image) {

						ops['type'] = 'text-fx';
				        ops['cacheTextImage'] = cacheTextImage;
				        ops['cacheTextImageLarge'] = cacheTextImageLarge;
				        ops.height = ops.height*2.5;
						ops['clipTo'] = function(ctx) {
				            return lumise.objects.clipto(ctx, image);
				        };

						var cdata = lumise.func.bridgeText(image._element, ops['bridge']);
						
						delete ops.stroke;
						delete ops.strokeWidth;
						
						image.set(ops);

						if ((ops.filters && ops.filters.length > 0)) {

							var stage = lumise.stage();

							ops.filters.map(function(fil, ind){
								if (fil.color){
									ops.filters[ind] = new fabric.Image.filters.Tint({
								        color: fil.color,
								    });
							    }
							});

							image.set('filters', ops.filters);

							image.applyFilters(stage.canvas.renderAll.bind(stage.canvas));

						};


						var _w = ops.width,
							_h = ops.height;
						
						image.setSrc(cdata, function(){
							image.set({height: _h, width: _w});
							return callback(image);
						});
						
					});

				},

				'qrcode' : function(ops, callback) {

					this.image(ops, callback);

				},

				'svg' : function(ops, callback) {
					
					if (ops.src === undefined)
						return callback(null);
					
					var donow = function(ops) {
						
						if (ops.src && ops.src.indexOf('data:image/svg+xml;base64,') === 0) {
							
							var wrp = $('<div>'+atob(ops.src.split('base64,')[1])+'</div>'),
								svg = wrp.find('svg').get(0),
								vb = svg.getAttribute('viewBox') ? 
									 svg.getAttribute('viewBox').split(' ') : 
									 svg.getAttribute('viewbox').split(' ');
							
							if (!svg.getAttribute('width') || !svg.getAttribute('height')) {
								svg.setAttribute('width', vb[2]);
								svg.setAttribute('height', vb[3]);
							};
							
							if (ops.height === undefined)
								ops.height = ops.width*(vb[3]/vb[2]);
							
							ops.src = 'data:image/svg+xml;base64,'+btoa(wrp.html());
							
							delete wrp;
							delete svg;
							delete vb;
							
						};
						
						return lumise.objects.lumise.image(ops, callback);
						
						/*
						*	Apply a solution to fix SVG for FireFox
						*	Try to add width & height attributes in <svg>
						*/
						
						fabric.loadSVGFromURL(ops.src, function(objects, options) {
							
							delete ops.type;
							delete ops.width;
							delete ops.height;
							
					        var shape = fabric.util.groupSVGElements(objects, options),
					        	editzone = lumise.stage().edit_zone;
							
					        if (ops.height === undefined) {
								ops.width = shape.width;
								ops.height = shape.height;
								if (ops.scaleX == 1 && ops.width > editzone.width) {
									ops.scaleX = (editzone.width*0.8)/ops.width;
									ops.scaleY = (editzone.width*0.8)/ops.width;
								};
							};
							
							shape.set(ops);
							
				       		shape.set('clipTo', function(ctx) {
					            return lumise.objects.clipto(ctx, shape);
					        });
					        
					        callback(shape);
							
					    });
							
					};
						
					if (/*ops.paths === undefined && */ops.src.indexOf('http') === 0) {
						$.ajax({
							url: ops.src,
							method: 'GET',
							dataType: 'text',
							statusCode: {
								403: function(){
									lumise.func.notice(lumise.i(33)+'(403) '+ops.src, 'error', 3500);
									callback(null);
								},
								404: function() {
									lumise.func.notice(lumise.i(33)+'(404) '+ops.src, 'error', 3500);
									callback(null);
								}
							},
							success: function(res) {
								ops.src = 'data:image/svg+xml;base64,'+btoa(res);
								ops.fill = '';
								donow(ops);
							}
						});

					}else{
						
						donow(ops);
					}

				},
				
				'path' : function(ops, callback) {

					var limit = lumise.stage().limit_zone,
						path = new fabric.Path(ops.path, $.extend({
					        left: limit.left + (limit.width/2),
					        top: limit.top + (limit.height/2),
					    }, ops));

					path.set('clipTo', function(ctx) {
				        return lumise.objects.clipto(ctx, path);
				    });

				    path.set('fill', null);

					callback(path);

				},
				
				'path-group' : function(ops, callback) {
					return this.svg(ops, callback);
				}
			},
			
			icons : {
				
				init: function (){
				
					var maps = {
						'del': btoa('<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ccc"><path d="m405 137l-30-30-119 119-119-119-30 30 119 119-119 119 30 30 119-119 119 119 30-30-119-119z"></path></svg>'), 
						'rot': btoa('<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ccc"><path d="m295 66c-96 0-175 66-187 160l-81-16l80 118l118-79l-75-15c10-60 73-126 146-126c81 0 146 69 146 150c0 80-80 146-144 146l0 42c107 0 187-86 187-190c0-104-86-190-190-190z"></path></svg>'), 
						'rez': btoa('<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ccc"><path d="M96,96v128l50.078-50l9.014,9l183.286,183L288.3,416h128.2V288l-50.078,50l-128.2-128l-64.1-64L224.2,96H96z"/></svg>'), 
						'dou': btoa('<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ccc"><path d="m160 352l160 0l0-128l96 0l0 256l-256 0z m-160-320l0 320l128 0l0 160l320 0l0-320l-128 0l0-160z"></path></svg>'), 
						'gro': btoa('<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ccc"><path d="m388 140l-31-31-140 139 31 31z m93-31l-233 231-92-91-30 31 122 123 264-263z m-481 171l123 123 31-31-122-123z"></path></svg>'),
						'wrot': btoa('<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#777"><path d="m295 66c-96 0-175 66-187 160l-81-16l80 118l118-79l-75-15c10-60 73-126 146-126c81 0 146 69 146 150c0 80-80 146-144 146l0 42c107 0 187-86 187-190c0-104-86-190-190-190z"></path></svg>'), 
						'wrez': btoa('<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#777"><path d="M96,96v128l50.078-50l9.014,9l183.286,183L288.3,416h128.2V288l-50.078,50l-128.2-128l-64.1-64L224.2,96H96z"/></svg>'), 
						'wdou': btoa('<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#777"><path d="m160 352l160 0l0-128l96 0l0 256l-256 0z m-160-320l0 320l128 0l0 160l320 0l0-320l-128 0l0-160z"></path></svg>'), 
						'wgro': btoa('<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#777"><path d="m388 140l-31-31-140 139 31 31z m93-31l-233 231-92-91-30 31 122 123 264-263z m-481 171l123 123 31-31-122-123z"></path></svg>')
					};
					
					Object.keys(maps).map(function(i) {
						lumise.objects.icons[i] = new Image();
						lumise.objects.icons[i].src = 'data:image/svg+xml;base64,'+maps[i];
					});
				}
			}

		},

		design : {

			events : function(){

				var onInput = function(e){

					var c = lumise.stage().canvas,
						a = c.getActiveObject(),
						callback = this.getAttribute('data-callback'),
						action = this.getAttribute('data-action'),
						ratio = parseFloat(this.getAttribute('data-ratio')) || 1,
						val = showInput(e, this);

					if (callback) {

						if (e.data.callback[callback])
							e.data.callback[callback](this, e, ratio);

					}else if (action && a && !e.isTrigger){
						a.set(action, val*ratio);
						c.renderAll();
					}

				},
					showInput = function(e, el) {

						if (!el)
							el = this;
	
						var val = el.value,
							unit = el.getAttribute('data-unit') || '',
							ratio = parseFloat(el.getAttribute('data-ratio')) || 1;
	
						if (el.getAttribute('data-range')) {
							el.getAttribute('data-range').split(',').map(function(m){
								if (Math.abs(val-parseFloat(m)) < 5)
									val = m;
							});
						}
	
						el.setAttribute('data-value', val+unit);
						
						if (el.parentNode.getAttribute('data-range') == 'helper')
							el.parentNode.setAttribute('data-value', val+unit);
						
						return val;
	
					};

				lumise.trigger({

					el: $('#LumiseDesign'),

					events: {

						'input[type="range"][data-view="lumise"]:input': showInput,
						'input[type="range"][data-action]:input, input[type="range"][data-callback]:input': onInput,
						'input[type="range"][data-callback="textFX"]:change': 'textFX',
						'#lumise-stroke-fix-colors li': 'strokeColor',

						'div#lumise-left>div.lumise-left-nav-wrp>ul.lumise-left-nav li[data-tab]': 'leftNav',
						'div#lumise-left #lumise-side-close': 'close_side',
						'svg#lumise-nav-file': 'resp_file',
						'#lumise-stage-nav': 'stages',
						'#lumise-cliparts': 'cliparts',
						'#lumise-uploads header button': 'upload_nav',
						'#lumise-left .lumise-x-thumbn:mouseover,#lumise-left .lumise-x-thumbn:mouseout': 'x_thumbn_preview',
						'#lumise-left button[data-func="show-categories"]': 'x_thumbn_categories',
						'#lumise-cliparts-list:scroll': 'cliparts_more',
						'#lumise-templates-list:scroll': 'templates_more',
						'#lumise-uploads div[data-tab="internal"]:scroll': 'images_more',
						'#lumise-shapes:scroll': 'shapes_more',

						'#lumise-saved-designs:scroll': 'designs_more',

						'#lumise-templates-search-inp:click,#lumise-templates-search-inp:keydown,#lumise-templates-search-categories:change': 'templates_search',
						'#lumise-cliparts-search-inp:click,#lumise-cliparts-search-inp:keydown,#lumise-cliparts-search-categories:change': 'cliparts_search',

						'div#lumise-top-tools>ul.lumise-top-nav>li[data-tool], div#lumise-navigations ul li[data-tool]': 'topTools',
						'div#lumise-product ul#lumise-product-color input.color:change, div#lumise-product ul#lumise-product-color': 'productColor',

						'input#lumise-zoom[type="range"]:input': 'doZoom',
						'#lumise-zoom-thumbn>span:mousedown': 'moveZoom',
						'#lumise-zoom-thumbn:mousewheel': 'wheelZoom',
						'ul[data-mode="text"] .text-format': 'textFormat',

						'.lumise-edit-text:input': 'editText',
						'#lumise-text-mask-guide': function(){
							lumise.tools.lightbox({content: '<img src="'+lumise.data.assets+'/assets/images/text-mask-guide.jpg" />'});
						},

						'#lumise-flip-x:change': 'flip',
						'#lumise-flip-y:change': 'flip',
						'#lumise-reset-transform': 'resetTransform',

						'input#lumise-curved:change': 'enableCurved',
						'input#lumise-fill:input,input#lumise-fill:change': 'fillColor',
						'span.lumise-save-color': 'saveColor',
						'input#lumise-stroke:input, input#lumise-stroke:change': 'fillStroke',
						
						'input#lumise-svg-fill:input,input#lumise-svg-fill:change': 'svgFillColor',
						'#lumise-svg-colors [data-func]': 'svgFuncs',
						
						'li[data-tool="arrange"] button[data-arrange]' : 'doArrange',
						'.lumise-more-fonts': 'load_fonts',
						'#lumise-fonts' : 'select_font',

						'#lumise-upload-form input[type="file"]:change': function(){
							lumise.func.process_files(this.files);
						},

						'#lumise-design-undo': lumise.stack.back,
						'#lumise-design-redo': lumise.stack.forward,
						'#lumise-save-btn': lumise.tools.save,

						'#lumise-discard-drawing': 'exit_drawing',
						'#lumise-text-effect img[data-effect]': 'text_effect',
						'#lumise-text-fx-trident:change': 'textFX',
						'input[data-image-fx][type="range"]:change': 'imageFX',

						'#lumise-drawing-color:change': function(e){
							e.data.callback.drawing(e);
						},
						'#lumise-auto-alignment:change': 'auto_alignment',

						'button[data-func="update-text-fx"]': lumise.func.update_text_fx,
						'#lumise-bug button.submit': 'bug_submit',
						
						'#lumise-image-fx-mode:change': 'selectImageFX',
						'#lumise-image-fx-fx>li[data-fx]': 'imageColorFX',

						'#lumise-replacement-image button': 'replace_image',

						'#lumise-saved-designs': 'saved_designs',
						'#lumise-designs-search input:input': 'saved_designs_search',
						'#lumise-languages li': 'change_lang',
						'button#lumise-change-product, button#lumise-select-product': 'change_product',

						'#lumise-file-nav li[data-func]': 'fileNav',
						'#lumise-print-nav input[name="print-unit"]:change': 'doPrint',
						'#lumise-print-nav select[name="select-size"]:change': 'doPrint',
						'#lumise-print-nav button': 'doPrint',
						'.lumise-tabs-nav': 'nav',
						'#lumise-shares-wrp': 'doShare',
						
						'#lumise-cart-items': 'my_cart',
						'#lumise-update-cart-confirm': 'cart_confirm',
						'a[data-view="cart-details"]': lumise.render.cart_details

					},

					callback : {

						layers: lumise.design.layers.build,

						textFX: function(el, e, ratio){
							e.data.textFX(el, e, ratio);
						},
											
						crop: function(el, e){

							var s = lumise.get.stage(),
								i = s.active.fxOrigin ? s.active.fxOrigin.src :
									(s.active._element ? s.active._element.src : s.active._cacheCanvas.toDataURL());

							lumise.tools.lightbox({
								width: Math.round(s.active.width),
								content: '<div class="lumise_crop_dragArea">\
											<img src="'+i+'" style="max-height: 520px;" />\
											<div class="lumise_crop_selArea">\
												<div class="lumise_crop_marqueeHoriz lumise_crop_marqueeNorth"><span></span></div>\
												<div class="lumise_crop_marqueeVert lumise_crop_marqueeEast"><span></span></div>\
												<div class="lumise_crop_marqueeHoriz lumise_crop_marqueeSouth"><span></span></div>\
												<div class="lumise_crop_marqueeVert lumise_crop_marqueeWest"><span></span></div>\
												<div class="lumise_crop_handle lumise_crop_handleN" data-target="n"></div>\
												<div class="lumise_crop_handle lumise_crop_handleNE" data-target="ne"></div>\
												<div class="lumise_crop_handle lumise_crop_handleE" data-target="e"></div>\
												<div class="lumise_crop_handle lumise_crop_handleSE" data-target="se"></div>\
												<div class="lumise_crop_handle lumise_crop_handleS" data-target="s"></div>\
												<div class="lumise_crop_handle lumise_crop_handleSW" data-target="sw"></div>\
												<div class="lumise_crop_handle lumise_crop_handleW" data-target="w"></div>\
												<div class="lumise_crop_handle lumise_crop_handleNW" data-target="nw"></div>\
												<div class="lumise_crop_clickArea" style="background-image: url('+i+');" data-target="visible" title="Enter to apply">\
												</div>\
												<div class="lumise_crop_info">0 x 0</div>\
											</div>\
											<div class="lumise_crop_clickArea_scan" data-target="darken"></div>\
										</div>\
										<ul class="lumise-crop-btns">\
											<li data-func="center">\
												<i class="lumisex-resize-arrow-down"></i>\
												<span>'+lumise.i('01')+'</span>\
											</li>\
											<li data-func="horizontal">\
												<i class="lumisex-move-horizontal"></i>\
												<span>'+lumise.i('02')+'</span>\
											</li>\
											<li data-func="vertical">\
												<i class="lumisex-move-vertical"></i>\
												<span>'+lumise.i('03')+'</span>\
											</li>\
											<li data-func="square">\
												<i class="lumisex-android-checkbox-outline-blank"></i>\
												<span>'+lumise.i('04')+'</span>\
											</li>\
											<li data-func="save">\
												'+lumise.i('save')+'\
											</li>\
											<li data-func="cancel">\
												'+lumise.i('cancel')+'\
											</li>\
										</ul>'
							});

							var crop = $('#lumise-lightbox-content div.lumise_crop_dragArea');
							
							crop.on('mousedown touchstart', function(e){
									
								if (e.type == 'touchstart') {
									e.clientX = e.originalEvent.pageX;
									e.clientY = e.originalEvent.pageY;
								}
								
								var wrp = $(this),
									img = wrp.find('>img').get(0),
									el = wrp.find('.lumise_crop_selArea'),
									i = wrp.find('.lumise_crop_info'),
									c = wrp.find('.lumise_crop_clickArea');

								var ratio = img.width/img.naturalWidth,
									target = e.target.getAttribute('data-target'),
									square = $('#lumise-lightbox-content li[data-func="square"]').hasClass('active');

								var _el = el.get(0),
									_o = {
										t: _el.offsetTop,
										l: _el.offsetLeft,
										h: _el.offsetHeight,
										w: _el.offsetWidth,
										ph: wrp.get(0).offsetHeight,
										pw: wrp.get(0).offsetWidth,
										pl: wrp.get(0).offsetLeft,
										pt: wrp.get(0).offsetTop,
										clientX: e.clientX,
										clientY: e.clientY
									};

								var dark_zone = function() {

									var o = {
										t: _el.offsetTop,
										l: _el.offsetLeft,
										h: _el.offsetHeight,
										w: _el.offsetWidth
									};
									
									c.css({
										backgroundPosition: ((-o.l)+'px '+(-o.t)+'px')
									});
									
									i.html(Math.round(o.w/ratio)+' x '+Math.round(o.h/ratio));

								};

								if (target == 'darken') {

									_o.l = e.clientX-$('#lumise-lightbox-body').get(0).offsetLeft + (_o.pw/2);
									_o.t = e.clientY-$('#lumise-lightbox-body').get(0).offsetTop + (_o.ph/2) + 23;

									el.css({
										left: _o.l+'px',
										top: _o.t+'px',
										width: '0px',
										height: '0px',
									});
								}

								dark_zone();

								$(this).on('mousemove touchmove', function(e){
									
									if (!target)
										return true;
									
									if (e.type == 'touchmove') {
										e.clientX = e.originalEvent.pageX;
										e.clientY = e.originalEvent.pageY;
									}
									
									var _l = _o.l + (e.clientX - _o.clientX),
										_t = _o.t + (e.clientY - _o.clientY),
										_w = _o.w + (e.clientX - _o.clientX),
										_h = _o.h + (e.clientY - _o.clientY);
									console.log(target);	
									if (target == 'visible') {

											if (_l < 0){
												_l = 0;
												_o.clientX = e.clientX;
												_o.l = _l;
											}
											if (_t < 0){
												_t = 0;
												_o.clientY = e.clientY;
												_o.t = _t;
											}
											if (_l + _o.w > _o.pw){
												_l = _o.pw - _o.w;
												_o.clientX = e.clientX;
												_o.l = _l;
											}
											if (_t + _o.h > _o.ph){
												_t = _o.ph - _o.h;
												_o.clientY = e.clientY;
												_o.t = _t;
											}

											el.css({left: _l+'px', top: _t+'px'});
											
											dark_zone();

									}else if (target == 'darken'){

										_w = _w - _o.w;
										_h = _h - _o.h;

										if (_w < 0) {
											_w = -_w;
											el.css({left: _l+'px'});
										}

										if (_h < 0) {
											_h = -_h;
											el.css({top: _t+'px'});
										}

										if (square)
											_h = _w;

										el.css({width: _w+'px', height: _h+'px'});
										dark_zone();

									}else {

										if (['nw', 'ne', 'n'].indexOf(target) > -1) {
											el.css({top: _t+'px'});
											_h = _o.h - (e.clientY - _o.clientY);
										}

										if (['nw', 'sw', 'w'].indexOf(target) > -1) {
											el.css({left: _l+'px'});
											_w = _o.w - (e.clientX - _o.clientX);
										}

										if (['w', 'e', 'nw', 'ne', 'se', 'sw'].indexOf(target) > -1) {
											el.css({width: _w+'px'});
											if (square)
												el.css({height: _w+'px'});
										}

										if (['n', 's', 'nw', 'ne', 'se', 'sw'].indexOf(target) > -1) {
											el.css({height: _h+'px'});
											if (square)
												el.css({width: _h+'px'});
										}

										dark_zone();

									}
									
									e.preventDefault();
									
								});
								
								$(this).on('mouseup touchend', function(e){
									$(this).off('mousemove touchmove');
									delete target;
								});

							});

							crop.find('img').on('load', function(){

								var s = lumise.get.stage(), p;

								if (!s.active.fx || !s.active.fx.crop)
									p = {
										width: Math.round(this.offsetWidth*0.8)+'px',
										height: Math.round(this.offsetHeight*0.8)+'px',
										left: Math.round(this.offsetWidth*0.1)+'px',
										top: Math.round(this.offsetHeight*0.1)+'px',
									};
								else p = {
									width: (this.offsetWidth*s.active.fx.crop.width)+'px',
									height: (this.offsetHeight*s.active.fx.crop.height)+'px',
									left: (this.offsetWidth*s.active.fx.crop.left)+'px',
									top: (this.offsetHeight*s.active.fx.crop.top)+'px',
								};

								$('#lumise-lightbox-content div.lumise_crop_selArea').css(p);
								$('#lumise-lightbox-content div.lumise_crop_dragArea').trigger('mousedown touchstart').off('mousemove');
								$('#lumise-lightbox-content div.lumise_crop_clickArea').css({
									backgroundSize: this.offsetWidth+'px '+this.offsetHeight+'px',
									backgroundPosition: '-'+p.left+' -'+p.top,
									opacity: 1
								});

							});

							$('#lumise-lightbox-content .lumise-crop-btns li[data-func]').on('click', function(e){

								var func = this.getAttribute('data-func'),
									el = crop.find('.lumise_crop_selArea');

								switch (func) {
									case 'square' :

										if ($(this).hasClass('active'))
											return $(this).removeClass('active');
										else $(this).addClass('active');

										if (crop.width() > el.height())
											el.css({width: el.height()+'px'});
										else if (crop.height() > el.width())
											el.css({height: el.width()+'px'});

									break;
									case 'center' :
										el.css({top: ((crop.height()/2)-(el.height()/2))+'px', left: ((crop.width()/2)-(el.width()/2))+'px'});
									break;
									case 'horizontal' :
										el.css({left: ((crop.width()/2)-(el.width()/2))+'px'});
									break;
									case 'vertical' :
										el.css({top: ((crop.height()/2)-(el.height()/2))+'px'});
									break;
									case 'save':
										var s = lumise.get.stage();

										if (s.active) {

											var _e = el.get(0), _c = crop.get(0);

											lumise.func.update_image_fx('crop', {
												top: _e.offsetTop/_c.offsetHeight,
												left: _e.offsetLeft/_c.offsetWidth,
												height: _e.offsetHeight/_c.offsetHeight,
												width: _e.offsetWidth/_c.offsetWidth,
											});
										}
										return $('#lumise-lightbox').remove();
									break;
									case 'cancel':
										return $('#lumise-lightbox').remove();
									break;
								}

								$('#lumise-lightbox-content div.lumise_crop_dragArea').
									trigger('mousedown').
									off('mousemove').
									off('touchmove');

							});

							if (!lumise.actions['globalMouseUp']) {
								lumise.actions.add('globalMouseUp', function(e){
									$('#lumise-lightbox-content div.lumise_crop_dragArea').
										off('mousemove').
										off('touchmove');
								});
							}

						},

						select_mask: function(el, e) {
							
							var $this = $(el);

							var s = lumise.get.stage(),
								objs = s.canvas.getObjects(),
								wrp = $this.find('li[data-view="list"]');

							wrp.html('');

							if (!s.active)
								return;
							
							objs.map(function(o) {
								if (o.evented !== false && o.active !== true){
									var args = lumise.design.layers.item(o);
									wrp.append('<span data-id="'+o.id+'">'+args.thumbn.replace('%color%', '').replace('%bgcolor%', '')+' '+args.name+'</span>');
								}
							});

							if (wrp.html() === '') {
								wrp.html('<p><center>'+lumise.i('07')+'</center></p>');
								$this.find('li.bttm').hide();
							} else {
								if (s.active && s.active.fx && s.active.fx.mask)
									$this.find('li.bttm').show();
								else $this.find('li.bttm').hide();

								wrp.find('>span').on('click', function(){

									var id = this.getAttribute('data-id'),
										tar = objs.filter(function(o){ return o.id == id; })[0];

									if (
										tar.left - (tar.width/2) > s.active.left + (s.active.width/2) ||
										tar.left + (tar.width/2) < s.active.left - (s.active.width/2) ||
										tar.top - (tar.height/2) > s.active.top + (s.active.height/2) ||
										tar.top + (tar.height/2) < s.active.top - (s.active.height/2)
									){
										return alert(lumise.i('08'));
									}

									lumise.stack.save();
									lumise.ops.importing = true;
									tar.setCoords();

									var arect = s.active.getBoundingRect(),
										brect = tar.getBoundingRect();

									var group = [];
									delete tar.clipTo;
									tar.set({
										scaleX: tar.scaleX*5,
										scaleY: tar.scaleY*5,
									});
									group.push(tar);
									var new_group = new fabric.Group(group, {});

									var mask = {
										left: (brect.left-arect.left)/arect.width,
										top: (brect.top-arect.top)/arect.height,
										width: brect.width/arect.width,
										height: brect.height/arect.height,
										dataURL: new_group.toDataURL()
									};

									$this.find('li.bttm').show();
									$(this).remove();
									s.canvas.remove(tar);

									lumise.func.update_image_fx('mask', mask, function(){
										lumise.ops.importing = false;
										lumise.stack.save();
									});

								});

							}
						},

						qrcode: function(){

							lumise.objects.qrcode(lumise.i('09'), lumise.get.color('invert'), function(obj){
								lumise.get.el('top-tools').
									find('li[data-tool="qrcode-text"]').
									addClass('active').
									find('textarea').focus();
							});
							return;

							lumise.tools.lightbox({
								width: 500,
								content: '<div id="lumise-create-qrcode" class="lumise-lightbox-form">\
											<h3 class="title">'+lumise.i('10')+'</h3>\
											<p>\
												<label>'+lumise.i('11')+':</label>\
												<input name="text" type="text" placeholder="'+lumise.i('11')+'" /></p>\
											<p>\
												<label>'+lumise.i('12')+':</label>\
												<input name="color" type="search" placeholder="'+lumise.i('13')+'" value="'+lumise.get.color('invert')+'" />\
											</p>\
											<p class="right"><button class="primary">'+lumise.i('10')+'</button></p>\
										</div>'
							});

							new jscolor.color(lumise.func.q('#lumise-create-qrcode input[name="color"]'), {});
							$('#lumise-create-qrcode button').on('click', function(e){

								var text = lumise.func.q('#lumise-create-qrcode input[name="text"]').value,
									color = lumise.func.q('#lumise-create-qrcode input[name="color"]').value;

								if (text === '')
									return $('#lumise-create-qrcode input[name="text"]').shake();
								if (color === '')
									return $('#lumise-create-qrcode input[name="color"]').shake();

								lumise.objects.qrcode(text, color);
								lumise.get.el('left .lumise-left-nav li[data-tab="layers"]').trigger('click');

							});
							lumise.func.q('#lumise-create-qrcode input[name="text"]').focus();

						},

						drawing: function(el, e) {

							var canvas = lumise.stage().canvas;

							if (!canvas.isDrawingMode)
								return;

							canvas.freeDrawingBrush.width = parseFloat(lumise.get.el('drawing-width').val());
							canvas.freeDrawingBrush.color = lumise.get.el('drawing-color').val() ?
															lumise.get.el('drawing-color').val() :
															lumise.get.color('invert');

						},

						imageFXReset: function() {

							var s = lumise.get.stage();
							if (!s.active || !s.active.fxOrigin)
								return lumise.tools.discard();

							lumise.stack.save();

							delete s.active.fx;

							s.active._element.src = s.active.fxOrigin.src;
							s.active._originalElement.src = s.active.fxOrigin.src;

							s.canvas.renderAll();
							lumise.tools.discard();


						},

						designs: function(){
							
							lumise.get.el('saved-designs').removeAttr('data-view');
							return lumise.render.refresh_my_designs();

							lumise.get.el('saved-designs').html('<i class="lumise-spinner x2 margin-2"></i>');
							lumise.post({
								action: 'my_designs',
								index: 0
							});

						},
						
						proceed: function(el, e) {
							lumise.get.el('update-cart-confirm').hide();
						},
						
						svg : function(el, e) {
							
							if (e.target.tagName == 'INPUT' && e.target.getAttribute('data-color')) {
								
								var se = lumise.get.el('svg-fill').get(0),
									cl = e.target.getAttribute('data-color');
									
								se.setAttribute('data-active-color', e.target.getAttribute('data-color'));
								/*if (se.color && typeof se.color.fromString == 'function')
									se.color.fromString(cl);*/
								se.value = cl;
								se.style.background = cl;
								se.style.color = lumise.tools.svg.invertColor(cl);
								
								lumise.get.el('svg-colors').addClass('active');
								
								return;
								
							}else if (e.target.getAttribute('data-func') == 'editor'){
								lumise.tools.svg.edit();
							};
							
							lumise.get.el('svg-colors').removeClass('active');
							
						}
					},

					load : {

						cliparts: function() {

							lumise.post({
								action: 'cliparts',
								category: ''
							});

						},
						
						templates: function() {

							lumise.post({
								action: 'templates',
								category: ''
							});

						},

						images: function(){

							$('#lumise-uploads div[data-tab="internal"]').trigger('scroll');

						},

						shapes: function(){

							$('#lumise-shapes').trigger('scroll');

						}

					},

					leftNav: function(e) {

						var tab = this.getAttribute('data-tab'),
							stage = lumise.stage();
							
						if (stage === undefined && e.isTrigger === undefined)	
							return;
							
						lumise.tools.discard();

						if (tab == 'drawing') {
							stage.canvas.isDrawingMode = true;
							stage.limit_zone.visible = true;
							lumise.get.el('top-tools').attr({'data-view': 'drawing'});
						} else if (tab == 'uploads') {
							if (lumise.get.el('external-images').hasClass('active')) {
								$('#lumise-external-images iframe').each(function(){
									this.contentWindow.postMessage({
										action : 'refresh'
									}, "*");
								});
							}
						} else if (stage && stage.canvas) {
							stage.canvas.isDrawingMode = false;
							stage.limit_zone.visible = false;
							lumise.get.el('top-tools').attr({'data-view': 'standard'});
							stage.canvas.renderAll();
						};

						if (this.getAttribute('data-load')) {
							if (typeof e.data.load[this.getAttribute('data-load')] == 'function')
								e.data.load[this.getAttribute('data-load')](e);
							this.removeAttribute('data-load');
						};

						$('#lumise-left .lumise-tab-body-wrp.active,#lumise-left ul.lumise-left-nav li[data-tab].active').removeClass('active');
						$('#lumise-left [data-view="preactive"]').removeAttr('data-view');
						$(this).addClass('active').prev('li[data-tab]').attr({'data-view': 'preactive'});

						$('#lumise-'+this.getAttribute('data-tab')).addClass('active');
						$('#lumise-side-close').addClass('active');
						
						if (
							this.getAttribute('data-callback') &&
							typeof e.data.callback[this.getAttribute('data-callback')] == 'function'
						)
							e.data.callback[this.getAttribute('data-callback')](e);

					},

					close_side: function(e) {
						$(this).removeClass('active');
						$('#lumise-left ul.lumise-left-nav li.active, .lumise-tab-body-wrp.active').removeClass('active');
					},
					
					resp_file: function() {
						if (!$(this).prev().hasClass('active')){
							$(this).prev().addClass('active');
							$(this).find('#__m').hide();
							$(this).find('#__x').show();
						}else{
							$(this).prev().removeClass('active');
							$(this).find('#__m').show();
							$(this).find('#__x').hide();
						}
					},
					
					stages: function(e) {

						var stage = e.target.getAttribute('data-stage');

						if (!stage)
							return;

						if (!lumise.data.stages[stage])
							return alert(lumise.i(17));

						$(this).find('li[data-stage].active').removeClass('active');
						$(e.target).addClass('active');

						lumise.active_stage(stage);
						lumise.design.layers.build();

						lumise.get.el('zoom').val(lumise.stage().canvas.getZoom()*100).trigger('input');
						lumise.e.tools.attr({'data-view': 'standard'});

					},

					cliparts: function(e) {

						var el = e.target.getAttribute('data-act') ? $(e.target) : $(e.target).closest('[data-act]'),
							act = null;

						if (el.get(0))
							act = el.data('act');

						if (!act) return;

						switch (act) {

							case 'category' :

								var tm = lumise.get.el('cliparts-list');

								lumise.get.el('cliparts').find('.lumise-cliparts-category.selected').removeClass('selected');
								el.addClass('selected');
								lumise.get.el('cliparts').addClass('selected');

								lumise.get.el('cliparts-list')
									.data({'category': el.data('category')})
									.html('<header>\
												<span data-act="back" title="'+lumise.i(43)+'">\
													<i class="lumisex-android-arrow-back"></i>\
												</span>\
												<span class="lumise-category-title">'+lumise.i(44)+'</span>\
											</header><i class="lumise-spinner white x3 mt2"></i>');

								lumise.post({
									action: 'cliparts',
									category: el.data('category'),
									q: lumise.ops.cliparts_q,
									index: 0
								});
								lumise.ops.cliparts_index = 0;
							break;

							case 'back' :
								lumise.get.el('cliparts').find('.lumise-cliparts-category.selected').removeClass('selected');
								lumise.get.el('cliparts').removeClass('selected');
								lumise.get.el('cliparts-list').data({'category': ''});
							break;
						}

					},
					
					do_search: function(type) {
						
						lumise.ops[type+'_index'] = 0;
						lumise.ops[type+'_loading'] = false;

						lumise.get.el(type+'-list').find('ul').html('');
						lumise.get.el(type+'-list').trigger('scroll');
					
					},
					
					templates_search: function(e) {
						
						if (e.type == 'click') {
							setTimeout(function(el){
								if (lumise.ops.templates_q != el.value && el.value === '') {
									lumise.ops.templates_q = el.value;
									e.data.do_search('templates');
								}
							}, 100, this);
						}
						
						if (this.tagName == 'INPUT' && e.keyCode !== 13)
							return;

						if (this.tagName == 'INPUT')
							lumise.ops.templates_q = this.value;

						e.data.do_search('templates');

					},
					
					cliparts_search: function(e) {
						
						if (e.type == 'click') {
							setTimeout(function(el){
								if (lumise.ops.cliparts_q != el.value && el.value === '') {
									lumise.ops.cliparts_q = el.value;
									e.data.do_search('cliparts');
								}
							}, 100, this);
						}
						
						if (this.tagName == 'INPUT' && e.keyCode !== 13)
							return;

						if (this.tagName == 'INPUT')
							lumise.ops.cliparts_q = this.value;
						
						e.data.do_search('cliparts');

					},
					
					upload_nav : function(e) {
						
						var wrp = $(this).closest('#lumise-uploads'),
							nav = this.getAttribute('data-nav'),
							tab = wrp.find('div[data-tab="'+nav+'"]');
						
						if (nav == 'external') {
							if (tab.find('iframe').length === 0)
								tab.html('<iframe src="https://services.lumise.com/images/"></iframe>');
							else if($(this).hasClass('active')) {
								tab.scrollTop(0);
								tab.find('iframe').get(0).contentWindow.postMessage({
									action : 'scrollTop'
								}, "*");
							}
						}
						
						wrp.find('header button.active, div[data-tab].active').removeClass('active');
						
						$(this).addClass('active');
						tab.addClass('active');
						
						e.preventDefault();
							
					},
					
					x_thumbn_preview : function(e) {

						if (
							e.target.tagName == 'I' &&
							e.target.getAttribute('data-info') &&
							e.target.parentNode.getAttribute('data-ops')
						) {
							if (
								e.type == 'mouseover' &&
								lumise.ops.drag_start === null
							) {

								if (lumise.ops.xtc_timer !== undefined)
									clearTimeout(lumise.ops.xtc_timer);
								try{
									var ops = JSON.parse(e.target.parentNode.getAttribute('data-ops'))[0];
								}catch(ex) {
									console.warn(ex.message);
									return;
								}

								var price = ((ops.type == 'image' || ops.type == 'template') ? (ops.price > 0) ? lumise.func.price(ops.price) : lumise.i(100) : ''),
									tags = (
										ops.type == 'upload' ? lumise.i(84): ops.cates != 'null' && ops.cates != '' ? ops.cates : (
											ops.tags != '' && ops.tags != 'null' ? ops.tags : ''
										)
									),
									do_view = function() {

										lumise.get.el('x-thumbn-preview').show().find('>div').html('<img src="'+ops.url+'" />');
										lumise.get.el('x-thumbn-preview').find('>header').html(
											(ops.name ? ops.name : ops.url.split('/').pop().substr(0, 50))
											+'<span>'+price+'</span>'
										);
										if (tags !== '')
											lumise.get.el('x-thumbn-preview').find('>footer').show().html(lumise.i(105) +' '+tags);
										else
											lumise.get.el('x-thumbn-preview').find('>footer').hide().html('');
									},
									template_view = function() {
										
										var s = lumise.stage(), 
											c = lumise.get.color();
										
										lumise.get.el('x-thumbn-preview').show().find('>div').html(
											'<div class="lumise-template-preview">\
												<img style="background:'+c+'" src="'+s.image+'" />\
												<div class="lumise-tp-limit"></div>\
											</div>'
										);
										
										lumise.get.el('x-thumbn-preview').find('img').on('load', function(){
											
											var el = $(this).parent().find('.lumise-tp-limit'),
												ratio = s.product_width ? this.offsetWidth/s.product_width : 1,
												w = Math.round(s.edit_zone.width*ratio),
												h = Math.round(s.edit_zone.height*ratio),
												t = (s.edit_zone.top*ratio),
												l = (s.edit_zone.left*ratio);
											
											el.css({
												marginLeft: l+'px',
												marginTop: t+'px',
												height: (h%2 != 0 ? h+1 : h)+'px',
												width: (w%2 != 0 ? w+1 : w)+'px',
												borderColor: lumise.func.invert(c)
											}).html('<img src="'+ops.screenshot+'" />');
											
										});
										
										lumise.get.el('x-thumbn-preview').find('>header').html(
											(ops.name ? ops.name : ops.url.split('/').pop().substr(0, 50))
											+'<span>'+price+'</span>'
										);
										if (tags !== '')
											lumise.get.el('x-thumbn-preview').find('>footer').show().html(lumise.i(105) +' '+tags);
										else
											lumise.get.el('x-thumbn-preview').find('>footer').hide().html('');
									};
								
								if (ops.type == 'template') {
									return template_view();
								}
									
								if (ops.url === undefined) {
									ops.url = lumise.cliparts.storage[ops.id] || lumise.cliparts.uploads[ops.id];
								}
								
								if (ops.url !== undefined && ops.url.indexOf('dumb-') === 0) {
									lumise.indexed.get(ops.url.split('dumb-')[1], 'dumb', function(res){
										if (res !== null) {
											lumise.cliparts.uploads[ops.id] = res[0];
											ops.url = res[0];
											do_view();
											delete res;
										}
									});
									ops.url = '';
								}
								
								do_view();

							}else{

								lumise.ops.xtc_timer = setTimeout(function(){
									lumise.get.el('x-thumbn-preview').hide();
								}, 350);

							}
						}

					},
					
					x_thumbn_categories : function(e) {
						
						var wrp = lumise.get.el('x-thumbn-preview'),
							type = this.getAttribute('data-type');
						
						if (lumise.ops.xtc_timer !== undefined)
							clearTimeout(lumise.ops.xtc_timer);
						
						if (wrp.css('display') == 'block' && wrp.find('div.lumise-categories-wrp').length !== 0)
							return wrp.hide();
						
						wrp.show().find('>div').html('');
						wrp.find('>header').html('<strong>'+lumise.i(56)+'<i class="lumisex-android-close close"></i></strong>');
						wrp.find('>footer').html('').hide();
						
						lumise.render.categories(type);
							
					},
					
					templates_more: function(e) {

						if (lumise.ops.templates_loading === true)
							return;

						if (this.scrollTop + this.offsetHeight >= this.scrollHeight/* - 100*/) {
							lumise.post({
								action: 'templates',
								category: lumise.ops.templates_category,
								q: lumise.ops.templates_q,
								index: lumise.ops.templates_index
							});
							lumise.get.el('templates-list').append('<i class="lumise-spinner white x3 mt1 mb1"></i>');
							lumise.ops.templates_loading = true;
						}


					},
					
					cliparts_more: function(e) {

						if (lumise.ops.cliparts_loading === true)
							return;

						if (this.scrollTop + this.offsetHeight >= this.scrollHeight/* - 100*/) {
							lumise.post({
								action: 'cliparts',
								category: lumise.ops.cliparts_category,
								q: lumise.ops.cliparts_q,
								index: lumise.ops.cliparts_index
							});
							lumise.get.el('cliparts-list').append('<i class="lumise-spinner white x3 mt1 mb1"></i>');
							lumise.ops.cliparts_loading = true;
						}


					},

					images_more : function(e) {

						if (lumise.ops.images_loading === true)
							return;

						if (this.scrollTop + this.offsetHeight >= this.scrollHeight - 100) {
							
							lumise.ops.images_loading = true;
							lumise.indexed.list(function(data){
								lumise.cliparts.import(data.id, {
									url: 'dumb-'+data.id,
									thumbn: data.thumbn,
									name: data.name,
									save: false
								});
								lumise.ops.uploads_cursor = data.id;
								delete data;
							}, 'uploads', function(st){
								lumise.ops.images_loading = false;
								if (st == 'done') {
									$('#lumise-uploads').off('scroll');
								}
							});
						}
					},

					shapes_more: function(e) {

						if (lumise.ops.shapes_loading === true)
							return;

						if (this.scrollTop + this.offsetHeight >= this.scrollHeight - 100) {
							lumise.post({
								action: 'shapes',
								index: lumise.ops.shapes_index
							});
							lumise.get.el('shapes').append('<i class="lumise-spinner white x3 mt3 mb1"></i>');
							lumise.ops.shapes_loading = true;
						}
					},

					designs_more : function(e) {

						if (lumise.ops.designs_loading === true)
							return;

						if (this.scrollTop + this.offsetHeight >= this.scrollHeight - 100) {
							lumise.ops.designs_loading = true;
							lumise.indexed.list(function(data){
								lumise.render.my_designs(data);
								lumise.ops.designs_cursor = data.id;
								delete data;
							}, 'designs', function(st){
								lumise.ops.designs_loading = false;
								if (st == 'done') {
									$('#lumise-my-designs').off('scroll');
								}
							});
						}
					},

					dragPop : function(e) {

						if (e.target.tagName != 'H3')
							return;

						var el = this;

						el.dragging = true;

						if (el.dragSetup === undefined) {

							$(document).on('mousemove', function(e){

								if (!el.dragging || lumise.e.tools.hasClass('minisize'))
									return;

								var scroll = lumise.get.scroll();

								lumise.e.tools.css({
									top: (e.clientY - el.rect.clientY + el.rect.top)+'px',
									left: (e.clientX - el.rect.clientX + el.rect.left)+'px',
								});


							}).on('mouseup', function(e){
								el.dragging = false;
							});

							el.dragSetup = true;

						}

						var rect = document.querySelector('#lumise-workspace').getBoundingClientRect(),
							scroll = {
									top: (lumise.body.scrollTop?lumise.body.scrollTop:lumise.html.scrollTop),
									left: (lumise.body.scrollLeft?lumise.body.scrollLeft:lumise.html.scrollLeft)
								};

						el.rect = {
							left: lumise.e.tools.offset().left-rect.left-scroll.left,
							top: lumise.e.tools.offset().top-rect.top-scroll.top,
							clientX: e.clientX,
							clientY: e.clientY
						};

					},

					topTools : function(e) {
						
						var act = this.getAttribute('data-tool'),
							cb = this.getAttribute('data-callback');
							
						if (this.getAttribute('data-load')) {
							if (typeof e.data.load[this.getAttribute('data-load')] == 'function')
								e.data.load[this.getAttribute('data-load')](e);
							this.removeAttribute('data-load');
						}
						
						if (act == 'callback' && cb && typeof e.data.callback[cb] == 'function') {
							return e.data.callback[cb](this, e);
						};
						
						if (
							(!act || $(e.target).closest('[data-view="sub"]').length > 0) &&
							e.target.className.toString().indexOf('close') === -1
						) {
							if (act && e.data[act] && typeof e.data[act] == 'function')
								e.data[act](e);
							return;
						}

						lumise.func.navigation(this, e);
						
						if (cb && typeof e.data.callback[cb] == 'function')
							e.data.callback[cb](this, e);

					},
					
					replace_image : function(e) {
						
						var active = lumise.stage().canvas.getActiveObject();
						
						if (!active)
							return;
							
						if (lumise.ops.replace_img_inp === undefined) {
							lumise.ops.replace_img_inp = document.createElement('input');
							lumise.ops.replace_img_inp.type = 'file';
							lumise.ops.replace_img_inp.accept = '.jpg,.png,.jpeg';
							lumise.ops.replace_img_inp.onchange = function(){
								
								var reader = new FileReader(),
									file = this.files[0];
									
								reader.addEventListener("load", function (e) { 
									
									active._element.onload = function() {
										
										var dime = lumise.get.el('replacement-image').find('input[type="radio"]:checked').val();
										
										if (dime == '1') {
											active.set('height', active.width/(this.naturalWidth/this.naturalHeight));	
										}else if (dime == '2') {
											active.set('width', active.height*(this.naturalWidth/this.naturalHeight));	
										};
										
										lumise.get.el('replacement-image').find('[data-view="title"] h3 span').html(
											this.naturalWidth+'x'+this.naturalHeight
										);
										
										if (active.fx !== undefined)
											lumise.func.update_image_fx();
										else lumise.stage().canvas.renderAll();
										
									};
									
									active.set('src', e.target.result);
									active.set('origin_src', e.target.result);
									active._element.src = e.target.result;
									active._originalElement.src = e.target.result;
									
									if (active.fxOrigin)
										active.fxOrigin.src = e.target.result;
										
							    	delete reader;
		
								}, false);
		
								reader.readAsDataURL(file);
								
							};
						};
						
						lumise.ops.replace_img_inp.type = 'text';
						lumise.ops.replace_img_inp.value = '';
						lumise.ops.replace_img_inp.type = 'file';
						lumise.ops.replace_img_inp.click();
						
						e.preventDefault();	
					},
					
					productColor : function(e) {

						var color = this.tagName == 'INPUT' ? this.value : e.target.getAttribute('data-color');

						if (color){

							var invert = lumise.func.invert(color);
							lumise.stage().limit_zone.set('stroke', invert);

							lumise.stage().productColor.set('fill', color);
							lumise.stage().canvas.renderAll();

							$(e.target).closest('ul#lumise-product-color').find('.choosed').removeClass('choosed');
							$(e.target).addClass('choosed');

							lumise.data.color = color;
							
							Object.keys(lumise.data.stages).map(function(s){
								if (s != lumise.current_stage && lumise.data.stages[s].canvas !== undefined) {
									lumise.data.stages[s].productColor.set('fill', color);
									lumise.data.stages[s].canvas.renderAll();
								}
									
							});
							
							if (!e.isTrigger) {
								lumise.tools.save();
							}
						}

					},

					position : function(e) {

						var pos = e.target.getAttribute('data-position') || 
								  e.target.parentNode.getAttribute('data-position') ||
								  e.target.parentNode.parentNode.getAttribute('data-position'),
							limit = lumise.stage().limit_zone,
							active = lumise.stage().canvas.getActiveObject() || lumise.stage().canvas.getActiveGroup();

						if (!active || !pos)
							return;

						var left = active.left,
							top = active.top;

						switch (pos) {

							case 'tl' :
								left = limit.left + (active.getWidth()/2);
								top = limit.top + (active.getHeight()/2);
							break;
							case 'tc' :
								left = limit.left+(limit.width/2);
								top = limit.top+(active.getHeight()/2);
							break;
							case 'tr' :
								left = limit.left+limit.width-(active.getWidth()/2);
								top = limit.top + (active.getHeight()/2);
							break;


							case 'ml' :
								left = limit.left + (active.getWidth()/2);
								top = limit.top+(limit.height/2);
							break;
							case 'mc' :
								left = limit.left+(limit.width/2);
								top = limit.top+(limit.height/2);
							break;
							case 'mr' :
								left = limit.left+limit.width-(active.getWidth()/2);
								top = limit.top+(limit.height/2);
							break;


							case 'bl' :
								left = limit.left + (active.getWidth()/2);
								top = limit.top+limit.height-(active.getHeight()/2);
							break;
							case 'bc' :
								left = limit.left+(limit.width/2);
								top = limit.top+limit.height-(active.getHeight()/2);
							break;
							case 'br' :
								left = limit.left+limit.width-(active.getWidth()/2);
								top = limit.top+limit.height-(active.getHeight()/2);
							break;

							case 'cv' :
								top = limit.top+(limit.height/2);
							break;

							case 'ch' :
								left = limit.left+(limit.width/2);
							break;

						}

						active.set({top: top, left: left});
						active.setCoords();
						lumise.stage().canvas.renderAll();

					},

					doZoom : function(){

						if (!lumise.stage())
							return;

						var val = this.value, c = lumise.stage().canvas;
						[100, 125, 150, 175, 200].map(function(m){
							if (Math.abs(val-m) < 5)
								val = m;
						});

						this.setAttribute('data-value', val+'%');
						this.parentNode.setAttribute('data-value', val+'%');

						var wrp = lumise.get.el('stage-'+lumise.current_stage);

						if (!wrp.data('w'))
							wrp.data({'w': wrp.width(), 'h': wrp.height()});

						var w = wrp.data('w')*(val/100),
							h = wrp.data('h')*(val/100);

						c.zoomToPoint(new fabric.Point(c.width/2, c.height/2), val/100);

						lumise.func.reversePortView(false);

					},

					moveZoom : function(e) {

						var wrp = this.parentNode;

						var onstopmove = function(e){
							document.removeEventListener('mouseup', onstopmove, false);
							wrp.removeEventListener('mousemove', lumise.func.onZoomThumnMove, false);
						};
						lumise.ops.preventClick = true;
						wrp.addEventListener('mousemove', lumise.func.onZoomThumnMove, false);
						document.addEventListener('mouseup', onstopmove, false);


					},

					wheelZoom : function(e) {

						var zoom = parseFloat(lumise.get.el('zoom').val());

						zoom +=  e.originalEvent.wheelDelta*0.15;

						if (zoom < 100)
							zoom = 100;
						else if (zoom > 250)
							zoom = 250;

						lumise.get.el('zoom').val(zoom).trigger('input');

						e.preventDefault();

					},

					fillColor : function(e){

						var c = lumise.stage().canvas,
							a = c.getActiveObject();

						/*if (a.type == 'text-fx' && e.isTrigger !== undefined)
							return;*/

						if (a && a.fill !== this.value) {

							if (a.type == 'image' || a.type == 'qrcode' || a.type == 'text-fx') {

								lumise.get.el('fill').closest('li[data-tool="fill"]').css({'border-bottom': '3px solid '+this.value});
							    a.set('fill', this.value);

							    if (a._element && a._element.src.indexOf('data:image/svg+xml;base64') > -1){

									var svg = lumise.func.fill_svg(a._element.src, this.value);

									a._element.src = svg;
									a._element.onload = function(){
										c.renderAll();
									};
									a.set({'colors': [this.value], origin_src: svg, src: svg});
									return;

							   	}else{

									if (this.value !== '') {

										var tint = new fabric.Image.filters.Tint({
									        color: this.value,
									    });

										if (!a.filters)
											a.filters = [];

										if (a.filters.length == 0)
										    a.filters.push(tint);
									    else{
										    var fil = a.filters.filter(function(f){return (f.color !== undefined);});
										    if (fil.length > 0)
										    	fil[0].color = this.value;
										    else a.filters.push(tint);
									    }

									    if (a.type == 'qrcode')
									  		a.backgroundColor = lumise.func.invert(this.value);

								    }else{
									    var fils = [];
									    a.filters.map(function(f){
										    if (f.color === undefined)
										    	fils.push(f);
									    });
									    a.filters = fils;
								    };
								    
									if (typeof a.applyFilters == 'function')
							   			a.applyFilters(c.renderAll.bind(c));

							   	}

							} else if (a.type != 'path-group' && a.type != 'svg') {
								a.set('fill', this.value);
							};

							if (a.type != 'text-fx')
								c.renderAll();
							else lumise.func.update_text_fx();

							lumise.design.layers.build();

						}

					},

					fillStroke : function(e){

						var c = lumise.stage().canvas,
							a = c.getActiveObject();

						if (a && a.strokeWidth >0/*!e.isTrigger*/) {
							a.set('stroke', this.value);
							c.renderAll();
						}

					},
					
					svgFillColor : function(e) {
						
						var canvas = lumise.stage().canvas,
							active = canvas.getActiveObject(),
							c = this.value,
							o = this.getAttribute('data-active-color');
						
						if (active === undefined || active === null)
							return;
						
						if (active.j_object === undefined) {
							$('#lumise-color-picker-header i').click();
							return;
						};
							
						lumise.tools.svg.replace(active.j_object, c, o);
						var src = 'data:image/svg+xml;base64,'+btoa(active.j_object.html());
						
						lumise.get.el('svg-colors').find('span[data-color="'+o+'"] input').css({'background-color': c});
						
						active.set('fill', '');
						active.set('src', src);
						active.set('origin_src', src);
						active._element.src = src;
						active._originalElement.src = src;
						active._element.onload = function(){
							canvas.renderAll();	
						}
							
					},
					
					saveColor : function(e){

						var color = lumise.get.el(this.getAttribute('data-target')).val();
						var colors = '#F4511E|#546E7A|#00ACC1|#3949AB|#5E35B1|#e53935|#FDD835|#7CB342|#6D4C41|#8E24AA';

						color = color.toString().toUpperCase();

						if (localStorage.getItem('lumise_color_presets'))
							colors = localStorage.getItem('lumise_color_presets');

						colors = colors.split('|');

						if (color === '' || colors.indexOf(color) > -1)
							return;

						colors.unshift(color);
						while(colors.length > 10)
							colors.pop();

						localStorage.setItem('lumise_color_presets', colors.join('|'));

						lumise.render.colorPresets();

					},

					enableCurved : function(e){

						if (e.isTrigger)
							return;

						var canvas = lumise.stage().canvas,
							active = canvas.getActiveObject(),
							props, text, newobj = null;

						if (!active)
							return;

						if (this.checked && active.type == 'i-text') {

							props = active.toObject(lumise.ops.export_list);
							delete props['type'];

							props['clipTo'] = function(ctx) {
				            	return lumise.objects.clipto(ctx, newobj);
							};

							[
								['textAlign', 'center'],
								['radius', 50],
								['spacing', 5],
								['angle', 0],
								['effect', 'bridge']
							].map(function(p){
								if (props[p[0]] === undefined)
									props[p[0]] = p[1];
							});

							newobj = new fabric.CurvedText(active.getText().trim(), props);

						}else if (!this.checked && active.type == 'curvedText'){

							props = active.toObject(lumise.ops.export_list);
							props['text'] = active.getText().trim();
							delete props['type'];

							props['clipTo'] = function(ctx) {
					            return lumise.objects.clipto(ctx, newobj);
					        };

							newobj = lumise.objects.text(props);

						}

						if (newobj !== null) {
							var index = canvas.getObjects().indexOf(active);
							canvas.remove(active);
							lumise.stage().stack.data.pop();
							canvas.add(newobj);
							newobj.moveTo(index);
							canvas.setActiveObject(newobj).renderAll();
							lumise.design.layers.build();
						}else{
							alert(lumise.i(18));
						}

					},

					text_effect: function(e) {

						if (e.isTrigger)
							return;

						var canvas = lumise.stage().canvas,
							active = canvas.getActiveObject(),
							effect = this.getAttribute('data-effect'),
							props = active.toObject(lumise.ops.export_list), text, newobj = null,
							_this = this;

						if (!active)
							return;

						$('div#LumiseDesign').attr({'data-processing': 'true', 'data-msg': 'Processing..'});


						$(this.parentNode).find('[data-selected]').attr({'data-selected': ''});
						$(this).attr({'data-selected': 'true'});

						if (effect == 'curved') {

							delete props['type'];

							props['clipTo'] = function(ctx) {
				            	return lumise.objects.clipto(ctx, newobj);
							};

							[
								['textAlign', 'center'],
								['radius', 50],
								['spacing', 5],
								['angle', 0],
								['effect', 'bridge']
							].map(function(p){
								if (props[p[0]] === undefined)
									props[p[0]] = p[1];
							});

							newobj = new fabric.CurvedText(active.text.trim(), props);

							lumise.func.switch_type (newobj);
							newobj.set('radius', 50);
							canvas.renderAll();

						}else{

							props['text'] = active.text.trim();
							delete props['type'];

							props['clipTo'] = function(ctx) {
					            return lumise.objects.clipto(ctx, newobj);
					        };

							if (effect == 'normal')
								return lumise.func.switch_type(lumise.objects.text(props));

							if (props['bridge'] === undefined) {
								props['bridge'] ={
									curve: -2.5,
									offsetY: 0.5,
									bottom: 2.5,
									trident: false,
									oblique: false,
								}
							}

							props.bridge.oblique = (effect == 'oblique');

							if (effect == 'oblique')
								lumise.get.el('text-fx-trident').closest('li[data-func="text-fx"]').hide();
							else lumise.get.el('text-fx-trident').closest('li[data-func="text-fx"]').css({'display': ''});

							if (active.type == 'text-fx') {

								active.set({
									bridge: props.bridge
								});
								
								var dataSrc = lumise.func.bridgeText(active.cacheTextImageLarge, active.bridge);
								
								active._element.onload = function(){
									canvas.renderAll();
									$('div#LumiseDesign').attr({'data-processing': '', 'data-msg': ''});
									lumise.get.el('text-effect').find('img[data-effect]').attr({'data-selected': null});
									lumise.get.el('text-effect').find('img[data-effect="'+effect+'"]').attr({'data-selected': 'true'});
								};
	
								active._element.src = dataSrc;
								active._originalElement.src = dataSrc;
						
							}else{
								lumise.objects.lumise['text-fx'](props, lumise.func.switch_type);
							}

						}


					},

					editText : function(e){

						var c = lumise.stage().canvas,
							a = c.getActiveObject(),
							t = this,
							done = function(){
								c.renderAll();
								lumise.get.el('workspace').find('.lumise-edit-text').val(t.value);
							};

						if (a) {

							if (!e.isTrigger) {


								switch (a.type) {
									case 'curvedText' :
										a.setText(this.value);
									break;
									case 'i-text' :
										a.setText(this.value);
									break;
									case 'qrcode':
										var qrcode = lumise.tools.qrcode({
											text: this.value,
											foreground: a.fill
										});

										a._element.onload = done;

										a._element.src = qrcode.toDataURL();

										a.set({
											'text': this.value,
											'name': a.name ? a.name : this.value,
											'fill': a.fill
										});

										return delete qrcode;

									break;
									case 'text-fx':
										a.set('text', this.value);
									break;
								}

								done();

							}

						}

					},

					textFormat : function(e){

						var c = lumise.stage().canvas, 
							a = c.getActiveObject(),
							fm = this.getAttribute('data-format'),
							_this = this;
						
						if (a && !e.isTrigger) {

							if (_this.getAttribute('data-align')) {

								$(_this.parentNode).find('[data-align].selected').removeClass('selected');
								$(_this).addClass('selected');
								a.set('textAlign', _this.getAttribute('data-align'));
								lumise.get.el('text-align').attr({'class': 'lumisex-align-'+(_this.getAttribute('data-align') ? _this.getAttribute('data-align') : 'center')});

							}else if (fm) {
								
								if (fm == 'upper') {
									if (a.get('text').toString() != a.get('text').toString().toUpperCase())
										a.setText(a.get('text').toString().toUpperCase());
									else a.setText(a.get('text').toString().toLowerCase());
								}else{
									[['bold', 'fontWeight'], ['italic', 'fontStyle'], ['underline', 'textDecoration']].map(
									function(f){
										if (fm == f[0]) {
											if ($(_this).hasClass('selected')) {
												$(_this).removeClass('selected');
												a.set(f[1], '');
											}else{
												$(_this).addClass('selected');
												a.set(f[1], f[0]);
											}
										}
									});
								}

							}

							if (a.type != 'text-fx'){
								document.fonts.load(a.fontStyle+' '+a.fontWeight+' 1px '+a.fontFamily, 'a').then(function(){
									fabric.util.clearFabricFontCache(a.fontFamily);
									c.renderAll();
								});
							}else lumise.func.update_text_fx();

						}
					},

					textFX : function(el, e, ratio) {

						if (e !== undefined && e.isTrigger !== undefined)
							return;

						var s = lumise.get.stage();
						if (!s.active)
							return;

						if (!s.active.bridge)
							s.active.bridge = {};

						var ev = 'input';

						if (el.target) {
							el = this;
							ratio =  parseFloat(this.getAttribute('data-ratio')) || 1;
							ev = 'change';
						}

						var fx = el.getAttribute('data-fx');

						if (fx == 'trident')
							s.active.bridge[fx] = el.checked;
						else s.active.bridge[fx] = parseFloat(el.value)*ratio;

						var dataSrc;

						if (ev == 'change')
							dataSrc = lumise.func.bridgeText(s.active.cacheTextImageLarge, s.active.bridge);
						else dataSrc = lumise.func.bridgeText(s.active.cacheTextImage, s.active.bridge);

						s.active._element.onload = function(){
							s.active.set('fill', s.active.fill);
							s.canvas.renderAll();
						};

						s.active._element.src = dataSrc;
						s.active._originalElement.src = dataSrc;

					},
					
					strokeColor : function(e) {
						
						var act = lumise.stage().canvas.getActiveObject(),
							color = this.getAttribute('data-color'),
							stk = lumise.get.el('stroke').get(0),
							strwidth = lumise.get.el('stroke-width').val();
							
						if (stk.color && typeof stk.color.fromString == 'function')
							stk.color.fromString(color);
							
						act.set('stroke', this.getAttribute('data-color'));
						lumise.stage().canvas.renderAll();
						//act.set('stroke-width', strwidth/10);
						
					},
					
					imageFX: function(e) {

						this.setAttribute('data-value', this.value);
						lumise.func.update_image_fx(this.getAttribute('data-image-fx'), this.value);

					},

					doArrange : function(e) {

						var canvas = lumise.stage().canvas,
							active = canvas.getActiveObject();

						if (!active)
							return;

						var objects = canvas.getObjects(),
							index = objects.indexOf(active);

						if (this.getAttribute('data-arrange') == 'forward')
						{
							if (objects[index+1] !== undefined)
							{

					     	   	active.moveTo(index+1);
					     	   	canvas.renderAll();

								return lumise.design.layers.build();

							}
							else
								return $(this).addClass('disabled');
						}
						else
							if (this.getAttribute('data-arrange') == 'back')
						{
							if (
								objects[index-1] !== undefined &&
								objects[index-1].evented !== false
							) {

					     	   	active.moveTo(index-1);
						 	   	canvas.renderAll();

								return lumise.design.layers.build();

							}
							else
								return $(this).addClass('disabled');
						}

					},

					load_fonts : function() {

						lumise.tools.lightbox({
							width: 1020,
							content: '<iframe src="https://services.lumise.com/fonts/"></iframe>\
									  <span data-view="loading"><i class="lumise-spinner x3"></i></span>'
						});
						
						$('#lumise-lightbox iframe').on('load', function() {
							this.contentWindow.postMessage({
								action: 'fonts',
								fonts: localStorage.getItem('LUMISE_FONTS')
							}, "*");
							$('#lumise-lightbox span[data-view="loading"]').remove();
						});

					},

					select_font : function(e) {

						var family = e.target.getAttribute('data-family');

						if (family) {

							lumise.get.el('fonts').find('font.selected').removeClass('selected');
							
							$(e.target).addClass('selected').
								closest('li[data-tool="font"]').
								find('button.dropdown').html('<font style="font-family:\''+family+'\'">'+family+'</font>');

							var canvas = lumise.stage().canvas,
								active = canvas.getActiveObject();

							if (active.fontFamily == family)
								return;

							active.set('fontFamily', '"'+family+'"');

							if (e.target.getAttribute('data-source')) {
								active.set('font', e.target.getAttribute('data-source'));
								lumise.func.font_blob(active);
							}else{
								fonts = JSON.parse(localStorage.getItem('LUMISE_FONTS'));
								if (fonts[encodeURIComponent(family)])
									active.set({font: fonts[encodeURIComponent(family)]});
							}
							
							if (active.type != 'text-fx')
								canvas.renderAll();
							else lumise.func.update_text_fx();
						}

					},

					flip : function(e) {

						var canvas = lumise.stage().canvas,
							active = canvas.getActiveObject();

						if (this.id == 'lumise-flip-x')
							active.set('flipX', this.checked);
						else active.set('flipY', this.checked);

						canvas.renderAll();

					},

					resetTransform: function() {

						var canvas = lumise.stage().canvas,
							active = canvas.getActiveObject();

						active.set({
							scaleY: active.scaleX,
							skewX: 0,
							skewY: 0,
							angle: 0,
							flipX: false,
							flipY: false
						});

						canvas.renderAll();
						lumise.tools.set(active);

					},

					selectImageFX: function(e) {

						lumise.func.update_image_fx(this.getAttribute('data-fx'), this.value);

					},

					imageColorFX: function(e) {

						var s = lumise.get.stage();

						if (this.getAttribute('data-fx') == 'bnw') {
							$('#lumise-image-fx-saturation').val(25.5).trigger('input');
							lumise.func.update_image_fx('saturation', 25.5);
						}else if (s.active.fx && s.active.fx.saturation == 25.5) {
							s.active.fx.saturation = 100;
							$('#lumise-image-fx-saturation').val(100).trigger('input');
						}else if (this.getAttribute('data-fx') === '') {
							s.active.fx.saturation = 100;
							s.active.fx.brightness = 0;
							s.active.fx.contrast = 0;
							lumise.get.el('image-fx-brightness').val(0).attr({'data-value': 0});
							lumise.get.el('image-fx-contrast').val(0).attr({'data-value': 0});
							lumise.get.el('image-fx-saturation').val(100).attr({'data-value': 100});
						}


						$(this.parentNode).find('[data-selected="true"]').removeAttr('data-selected');
						$(this).attr({'data-selected': 'true'});
						lumise.func.update_image_fx('fx', this.getAttribute('data-fx'));

					},
					
					bug_submit: function(e) {
						
						var wrp = lumise.get.el('bug'),
							content = wrp.find('textarea[data-id="report-content"]').val();
						
						if (content.length < 30)
							return wrp.find('textarea[data-id="report-content"]').shake();
						
						content = btoa(encodeURIComponent(content.substr(0, 1500)));
						
						wrp.attr({'data-view': 'sending'});
						lumise.post({
							action: 'send_bug',
							content: content
						}, function(res) {
							try {
								res = JSON.parse(res);
							}catch(ex) {
								res = {};	
							};
							if (res.success != 1) {
								wrp.removeAttr('data-view');
								lumise.func.notice(res.message, 'error', 3500);
								return;
							};
							wrp.attr({'data-view': 'success'});
							setTimeout(function(){
								wrp.removeAttr('data-view');
								wrp.find('textarea[data-id="report-content"]').val('');
							}, 10000);
						});
						
					},
					
					auto_alignment: function(){
						localStorage.setItem('LUMISE-AUTO-ALIGNMENT', this.checked);
					},

					exit_drawing : function(){
						lumise.get.el('left .lumise-left-nav li[data-tab="layers"]').trigger('click');
					},

					saved_designs : function(e) {

						var act = e.target.getAttribute('data-func');

						if (!act)
							return;
							
						var id = $(e.target).closest('li[data-id]').data('id');
						
						if (!id && act != 'new')
							return;

						switch (act) {

							case 'edit' :

								if (this.getAttribute('data-view') === 'saveas') {
									lumise.tools.save('designs', id);
									lumise.tools.discard();
									lumise.func.notice(lumise.i(109), 'success');
									$('#lumise-navigations li.active').removeClass('active');
									return;	
								};
								
								lumise.tools.save();

								lumise.indexed.get(id, 'dumb', function(res){
									if (res !== null) {
										lumise.tools.imports(res);
									};
									delete res;
								});
								lumise.data.editing = id;
								
								
								return;
								

								lumise.post({
									action: 'edit_design',
									id: id
								});

							break;

							case 'clone' :
							
								lumise.indexed.get(id, 'designs', function(res){

									if (res !== null) {

										res.id = new Date().getTime().toString(36);
										res.name += ' copy';
										lumise.indexed.get(id, 'dumb', function(res_dumb){
											if (res_dumb !== null) {
												res_dumb.id = res.id;
												res_dumb.name = res.name;
												lumise.indexed.save([res, res_dumb], 'designs');
												delete res;
												delete res_dumb;
											}
											lumise.render.refresh_my_designs();
										});
									}
								});

							break;

							case 'download' :

								lumise.indexed.get(id, 'dumb', function(res){
									if (res !== null) {
										if (Object.keys(res.stages).length > 1 || res.stages.lumise === undefined) {
											res.stages = {
												lumise: res.stages[Object.keys(res.stages)[0]]
											}
										};
										lumise.func.download(
											'data:application/octet-stream;charset=utf-16le;base64,'+btoa(JSON.stringify(res)),
											res.name.replace(/\ /g, '-')+'.lumi'
										);
										delete res;
									}
								});

							break;

							case 'name' :
								var name = $(e.target).text();
								e.target.onblur = function(){
									if (name != $(this).text()) {
										name = $(this).text();
										setTimeout(function(){
											lumise.indexed.get(id, 'designs', function(res){
												if (res !== null) {
													res.name = name;
													lumise.indexed.get(id, 'dumb', function(res_dumb){
														if (res_dumb !== null) {
															res_dumb.name = name;
															lumise.indexed.save([res, res_dumb], 'designs');
															delete res;
															delete res_dumb;
														}
													});
												}
											});
										}, 300);
									}
								};

							break;

							case 'delete' :

								if (!confirm(lumise.i('sure')))
									return;

								lumise.indexed.delete(id, 'designs');

								$(e.target).closest('li[data-id]').find('img').each(function(){
									if (this.src.indexOf('blob:') === 0)
										URL.revokeObjectURL(this.src);
								});
								setTimeout(function(el){
									el.remove();
								}, 100, $(e.target).closest('li[data-id]').hide());

								if (lumise.data.editing == id) {
									lumise.data.editing = new Date().getTime().toString(36);
								}

							break;
						}

					},
					
					saved_designs_search : function(e) {
						var val = this.value.trim().toLowerCase();
						lumise.get.el('saved-designs').find('li').each(function(){
							if (val === '' || $(this).find('span[data-view="name"]').text().trim().toLowerCase().indexOf(val) > -1)
								this.style.display = '';
							else this.style.display = 'none';
						});
					},
					
					change_lang : function(e) {
						lumise.post({
							action: 'change_lang',
							code: this.getAttribute('data-id')
						});
						$(this).closest('li[data-tool="languages"]').removeClass('active').html('<i class="lumise-spinner white"></i>');
					},

					change_product : function(e) {
						
						var btn_txt = lumise.func.url_var('product') ? lumise.i(80) : lumise.i(87);
						
						lumise.render.products_list(btn_txt);
						
					},

					fileNav : function(e) {

						var func = this.getAttribute('data-func');

						switch (func) {
							
							case 'new' : lumise.design.my_designs['new'](); break;

							case 'import' :

								var inp = lumise.get.el('import-json').get(0);
								
								inp.type = '';
								inp.type = 'file';
								inp.click();

								if (lumise.get.el('import-json').data('addEvent') !== true) {

									lumise.get.el('import-json').data({'addEvent': true}).on('change', function(){
										
										lumise.design.my_designs['import'](this.files[0]); 
										
									});
								}
								
							break;
							case 'clear' :
								lumise.tools.clearAll();
								lumise.func.notice(lumise.i(29), 'success');
							break;
							case 'saveas' :
								lumise.get.el('file-nav').find('[data-func][data-type="json"]').trigger('click');
							break;
							case 'save' :
								
								lumise.get.el('navigations').find('li[data-tool="designs"]').trigger('click');
								lumise.get.el('saved-designs').attr({
									'data-view': 'saveas',
									'data-notice': lumise.i(108)
								}).prepend(
									'<li data-view="add" data-func="edit" data-id="'+(new Date().getTime().toString(36))+'">\
										<b data-func="edit">+</b>\
										<span data-func="edit">'+lumise.i(107)+'</span>\
									</li>'
								);
								
								return;
								var name = prompt(lumise.i(30), lumise.data.name);
								if (name === null)
									return;

								lumise.data.name = name;
								lumise.data.editing = new Date().getTime().toString(36);
								lumise.data.design = 0;

								lumise.tools.save();

							break;
							case 'download' :

								var type = this.getAttribute('data-type'),
									stage =  lumise.stage(),
									canvas = stage.canvas,
									wcf = "menubar=0,status=0,titlebar=0,toolbar=0,location=0,directories=0",
									ex = {
									    format: 'png',
									    multiplier: 2/**(2/window.devicePixelRatio)*/,
									    width: stage.product.width,
									    height: stage.product.height,
									    top: stage.product.top-(stage.product.height/2),
									    left: stage.product.left-(stage.product.width/2)
									},
									name = lumise.data.prefix_file+'_'+lumise.func.slugify(
										$('#lumise-product header name t').text()
									)+'_'+lumise.current_stage;

								lumise.get.el('zoom').val(100).trigger('input');

								switch (type) {

									case 'svg':
										
										var svg_obj = $('<div>'+canvas.toSVG()+'</div>'),
											objs = canvas.getObjects(),
											fml = [],
											toUni = function(txt) {
												var result = "";
											    for(var i = 0; i < txt.length; i++){
											        result += '&#x' + ('000' + txt[i].charCodeAt(0).toString(16)).substr(-4)+';';
											    };
											    return result;
											};
											
										svg_obj.find('tspan').each(function(){
											this.innerHTML = '<!--lmstart-->'+toUni(this.innerHTML)+'<!--lmend-->';
										});
										
										svg_obj.find('text').each(function(){
											
											var id = this.parentNode.getAttribute('id'),
												obj = objs.filter(function(o){
													return o.id == id;
												});
											
											if (obj.length > 0 && obj[0].charSpacing > 0)
												this.setAttribute('letter-spacing', (obj[0].charSpacing*0.001)+'em');
											
										});
											
										if (svg_obj.find('defs').length === 0)
											svg_obj.find('svg').append('<defs></defs>');
											
										objs.map(function(o){
											if (
												o && o.evented && 
												o.fontFamily !== undefined && o.fontFamily !== '' &&
												typeof o.font == 'object' && o.font.length === 2
											) {
												fml.push(o.fontFamily.replace(/\"/g, ''));	
											};
											
											if (
												o.fontFamily !== undefined && 
												o.fontFamily !== '' &&
												typeof o.font == 'string' && 
												o.font.indexOf('data:text/plain;base64') === 0
											) {
												var ff = o.font.replace(
													'data:text/plain;base64,', 
													'data:font/truetype;charset=utf-8;base64,'
												);
					
												svg_obj.find('defs').append(
													"<style type=\"text/css\">@font-face {font-family: '"+
													o.fontFamily.replace(/\"/g, '')+
													"';src: url("+ff+") format('woff2');}</style>"
												);
											};
											
										});
										
										svg_obj.find('defs').append(
											"<style type=\"text/css\">@import url('http://fonts.googleapis.com/css?family="+
												fml.join('|')+
											"');</style>"
										);
										
										svg_obj.find('desc').html(
											'Created with Lumise Product Designer Tool (https://www.lumise.com)'
										);
										
										svg_obj.find('image').each(function() {
											
											var src = this.getAttribute('xlink:href');
											
											if (src.indexOf('http') === 0) {
												
												var id = this.getAttribute('id'),
													canvas = document.createElement('canvas'), 
													ctx = canvas.getContext('2d'),
													obj = lumise.stage().canvas.getObjects().filter(function(o){
														return o.id == id;
													});
													
												if (obj.length === 0)
													return;
												
												var el = obj[0]._element;
													
												canvas.width = el.width;
												canvas.height = el.height;
												ctx.drawImage(el, 0, 0, el.width, el.height);
												this.setAttribute(
													'xlink:href', 
													canvas.toDataURL('image/'+(src.indexOf('.png') ? 'png' : 'jpeg'))
												);
											}
										});
										
										lumise.stage().canvas.getObjects().filter(function(o){
											return o.type == 'svg';
										}).map(function(o, i){
											
											var el = svg_obj.find('image[id="'+o.id+'"]'),
												sv = $('<div>'+atob(o.src.split(',')[1])+'</div>'),
												s_v = sv.find('svg').get(0),
												vb = s_v.getAttribute('viewBox').toString().split(' '),
												x = parseFloat(vb[0]),
												y = parseFloat(vb[1]),
												w = parseFloat(s_v.getAttribute('width').toString().replace(/[^0-9.\-]/g, '')),
												h = parseFloat(s_v.getAttribute('height').toString().replace(/[^0-9.\-]/g, '')),
												r = o.width/parseFloat(vb[2]);
											
											var g = '<g transform="translate('+(-o.width/2)+' '+(-o.height/2)+') scale('+r+')">';	
											
											$.each(s_v.attributes, function(){
												if (this.name.indexOf('xmlns:') === 0 && !svg_obj.find('svg').attr(this.name))
													svg_obj.find('svg').attr(this.name, this.value);
											});
											
											$(s_v).find('[stroke-width]').each(function(){
												this.setAttribute('stroke-width', parseFloat(this.getAttribute('stroke-width')*r));
											});
											
											g += s_v.innerHTML+'</g>';
											
											el.after(g);
											el.remove();
											
											return;
											
											var canvas = document.createElement('canvas'), 
											ctx = canvas.getContext('2d');
											canvas.width = o._element.width*5;
											canvas.height = o._element.height*5;
											ctx.drawImage(o._element, 0, 0, o._element.width*5, o._element.height*5);
											
											svg_obj.find('image[id="'+o.id+'"]').get(0).setAttribute(
												'xlink:href', 
												canvas.toDataURL('image/png')
											);
											
										});
										
										var svg_data = svg_obj.html();
										
										svg_data = svg_data.split('<!--lmstart-->');
										
										svg_data.map(function(s, i) {
											if (i>0 && s.indexOf('<!--lmend-->') > -1) {
												s = s.split('<!--lmend-->');
												s[0] = toUni(s[0]);
												svg_data[i] = s.join('');
											};
										});
										
										svg_data = svg_data.join('').replace(/gradienttransform/g, 'gradientTransform').
													replace(/gradientunits/g, 'gradientUnits').
													replace(/lineargradient/g, 'linearGradient').
													replace(/radialgradient/g, 'radialGradient').
													replace(/\>\<\/stop\>/g, '/>');
													
										lumise.func.download(
											'data:image/svg+xml;base64,'+
											btoa(svg_data),
											name+'.svg'
										);
										
										delete svg_obj;
										
									break;
									case 'png':

										lumise.func.download(
											canvas.toDataURL(ex), 
											name+'.png'
										);

									break;
									case 'jpg':

										ex.format = 'jpeg';
										lumise.func.download(
											canvas.toDataURL(ex), 
											name+'.jpg'
										);

									break;
									case 'pdf':

										if (window.jsPDF === undefined) {
											var script = document.createElement('script');
											$('head').append(script);
											script.onload = function(){
												lumise.get.
													el('navigations').
													find('li[data-tool="file"] li[data-func="download"][data-type="pdf"]').
													trigger('click');
												$('div#LumiseDesign').attr({'data-processing': '', 'data-msg': ''});
											};
											script.src = lumise.data.assets+'assets/js/jspdf.min.js';
											$('div#LumiseDesign').attr({'data-processing': 'true', 'data-msg': 'Loading..'});
											lumise.func.navigation('clear');
											return;
										};
										
										var pdf = new jsPDF('', 'mm', [210, 210*1.4151]);
									
										ex.format = 'jpeg';
										pdf.addImage(
											canvas.toDataURL(ex), 
											'JPEG', 0, 0, 210, 210*(stage.product.height/stage.product.width)
										);
										
										pdf.save(name+".pdf");

									break;
									case 'json':

										var data = {
											stages : {},
											type : lumise.data.type,
											updated: new Date().getTime()/1000,
											name : lumise.data.name
										}, sts = [];
										
										//ONLY EXPORT THE CURENT STAGE FOR TEMPLATE PURPOSE (.active)
										
										lumise.get.el('stage-nav').find('li[data-stage].active').each(function(){

											var s = this.getAttribute('data-stage'),
												stage = lumise.data.stages[s];

											if (stage.canvas) {
												data.stages['lumise'] = {
													data : lumise.tools.export(stage),
													screenshot: lumise.tools.toImage({stage: stage}),
													edit_zone: stage.edit_zone,
													image: stage.image,
													overlay: stage.overlay,
													updated: data.updated
												};
												sts.push(s);
											}else if (stage.data) {
												data.stages['lumise'] = {
													data : stage.data,
													screenshot: '',
													edit_zone: '',
													image: '',
													overlay: stage.overlay,
													updated: stage.data.updated
												};
												sts.push(s);
											}

										});

										lumise.func.download(
											'data:application/octet-stream;charset=utf-16le;base64,'+lumise.func.enjson(data),
											name+'.lumi'
										);

									break;
								}
								
							break;
						}

						lumise.func.navigation('clear');

					},

					doPrint : function(e) {
						
						if (this.name == 'print-unit') {
							
							localStorage.setItem('LUMISE_PRINT_UNIT', this.getAttribute('data-unit'));
							
						} else if (this.tagName == 'SELECT') {
							
							var unit = $('#lumise-print-nav input[name="print-unit"]:checked').data('unit'),
								val = this.value;
							
							if (unit == 'inch') {
								val = val.split('x');
								val[0] = (parseFloat(val[0].trim())/2.54).toFixed(2);
								val[1] = (parseFloat(val[1].trim())/2.54).toFixed(2);
								val = val.join(' x ');
							}
								
							lumise.get.el('print-nav').find('input[name="size"]').val(val);
							
						}else if (this.tagName == 'BUTTON') {
							
							lumise.get.el('zoom').val('100').trigger('input');
							
							var size = lumise.get.el('print-nav').find('input[name="size"]').val().split('x'),
								unit = $('#lumise-print-nav input[name="print-unit"]:checked').data('unit'),
								o = lumise.get.el('print-nav').find('select[name="orientation"]').val(),
								w = parseFloat(size[0].trim()),
								h = parseFloat(size[1] ? size[1].trim() : 0);
							
							if (unit == 'inch') {
								w *= 2.54;
								h *= 2.54;
							};
							
							if (size[0] === '' || size.length < 2 || w < 2.6 || w > 84.1 || h < 3.7 || h > 118.9) {
								lumise.get.el('print-nav').find('input[name="size"]').focus();
								return alert(lumise.i(35));
							};

							w *= 118.1;
							h *= 118.1;

							var s = lumise.stage(),
								bg = s.canvas.backgroundColor,
								multiplier = (h/s.limit_zone.height) < 33 ? h/s.limit_zone.height : 33,
								func = this.getAttribute('data-func'),
								go = function(data) {
								
									if (func == 'download') {
										lumise.func.download(data, lumise.data.prefix_file+'_print_'+lumise.current_stage+'.png');
										return;
									};
		
									if (data.length < 10)
										return alert(lumise.i(36));
		
									var print_window = window.open();
									print_window.document.write(
										'<img style="width:100%" src="'+data+'" onload="window.print();window.close();" />'
									);
									
								};

							if (o != 'landscape') {
								go(
									lumise.tools.toImage({
										stage: s,
										left: s.limit_zone.left,
										width: s.limit_zone.width,
										multiplier: multiplier,
										is_bg: lumise.get.el('print-base').prop('checked') === true ? 'full' : false
									})
								);
							}else{
								
								multiplier = (w/s.limit_zone.width) < 33 ? h/s.limit_zone.width : 33;
								
								var data = lumise.tools.toImage({
									stage: s,
									width: s.limit_zone.width,
									left: s.limit_zone.left,
									multiplier: multiplier*(s.limit_zone.width/s.limit_zone.height),
									is_bg: lumise.get.el('print-base').prop('checked') === true ? 'full' : false
								}),
								canvas = document.createElement('canvas'),
								ctx = canvas.getContext("2d"),
								img = new Image();
								
								canvas.width = w;
								canvas.height = h;
								
								img.onload = function() {
									
									ctx.translate(canvas.width / 2, canvas.height / 2);
									ctx.rotate(Math.PI / 2);
									
									var ih = this.height,
										iw = this.width;
									
									if (iw > w) {
										ih = ih * (w/iw);
										iw = w;
									}
									
									if (ih > h) {
										iw = iw * (h/ih);
										ih = h;
									}
									
								    ctx.drawImage(this, -iw / 2, -ih / 2, iw, ih);
								
									ctx.rotate(-Math.PI / 2);
									ctx.translate(-canvas.width / 2, -canvas.height / 2);
									
									go(canvas.toDataURL());
									
								};
								
								img.src = data;
								
							};

						}
					},
					
					nav : function(e) {
						
						if (e.target.getAttribute('data-func') == 'nav') {
							
							var el = $(e.target),
								nav = el.data('nav'),
								wrp = el.closest('.lumise-tabs-nav').find('li[data-view="'+nav+'"]');
							
							el.closest('.lumise-tabs-nav').attr({'data-nav': nav}).find('[data-active="true"]').removeAttr('data-active');
							el.attr({'data-active': 'true'});
							wrp.attr({'data-active': 'true'});
							
							e.preventDefault();
						}
					},
					
					doShare : function(e) {
						
						var func = e.target.getAttribute('data-func');
						
						if (!func)
							return;
							
						var share_history = localStorage.getItem('LUMISE_SHARE_HISTORY'),
							el = $(e.target);
								
						if (!share_history) {
							share_history = [];
						} else {
							try {
								share_history = JSON.parse(share_history);
							}catch(ex){
								share_history = [];
							}
						};
						
						if (share_history.length > 3)
							share_history.splice(3);
						
						var load_history = function(index) {
										
							var wrp = lumise.get.el('shares-wrp').find('li[data-view="history"]');
							wrp.attr({'data-process': 'true'});
							
							lumise.post({
								action: 'get_shares',
								index: index,
								stream: lumise.func.url_var('stream', '')
							}, function(res){
								
								wrp.removeAttr('data-process');
								
								var res = JSON.parse(res);
									
								if (res.result.length > 0) {
									
									var html = '', share_url = '';
									res.result.map(function(s){
										
										share_url = lumise.data.tool_url;
										
										if (share_url.indexOf('?') > -1)
											share_url += '&';
										else share_url += '?';
										
										share_url += 'product='+s.product;
										share_url += '&product_cms='+s.product_cms;
										share_url += '&share='+s.share_id;
										
										share_url = share_url.replace('?&', '?');
										
										html += '<span data-item>\
											<a href="'+share_url+'" target="_blank">\
												<img src="'+lumise.data.upload_url+'shares/'+lumise.func.date('Y/t', s.created)+'/'+s.share_id+'.jpg'+'" height="150" />\
											</a>\
											<name>'+s.name+'</name>\
											<span data-view="func">\
												<i class="lumise-icon-menu"></i>\
												<span data-view="fsub" data-id="'+s.share_id+'" data-aid="'+s.aid+'" data-link="'+ encodeURIComponent(share_url)+'">\
													<date data-func="date">'+lumise.func.date('h:m D d M, Y', s.created)+'</date>\
													<button data-func="copy-link">\
														<i class="lumise-icon-doc"></i> '+lumise.i(130)+'\
													</button>\
													<button data-func="open">\
														<i class="lumise-icon-link"></i> '+lumise.i(131)+'\
													</button>\
													<button data-func="delete">\
														<i class="lumise-icon-trash"></i> '+lumise.i(132)+'\
													</button>\
												</span>\
											</span>\
										</span>';
									});
									
									wrp.html(html);
									
								} else {
									wrp.html('<p class="notice mt2 mb2">'+lumise.i(129)+'</p>');
								};
								
								if (res.per_page < res.total) {
									
									var nav = '<ul data-view="pagenation">';
									
									if (res.index > res.per_page) {
										nav += '<li data-func="pagination" data-p="0"><i data-func="pagination" data-p="0" class="lumisex-ios-arrow-back"></i><i data-func="pagination" data-p="0" class="lumisex-ios-arrow-back"></i></li>';
									};
									
									for (var i=1; i<=Math.ceil(res.total/res.per_page); i++) {
										nav += '<li data-func="pagination" data-p="'+((i-1)*res.per_page)+'"'+(res.index == i*res.per_page ? ' data-active="true"' : '')+'>'+i+'</li>';
									};
									
									if (res.index < res.total) {
										nav += '<li data-func="pagination" data-p="'+((Math.ceil(res.total/res.per_page)-1)*res.per_page)+'"><i data-func="pagination" data-p="'+((Math.ceil(res.total/res.per_page)-1)*res.per_page)+'" class="lumisex-ios-arrow-forward"></i><i data-func="pagination" data-p="'+((Math.ceil(res.total/res.per_page)-1)*res.per_page)+'" class="lumisex-ios-arrow-forward"></i></li>';
									};
									nav += '</ul>';
									
									wrp.append(nav);
									
								} else if (res.index > res.per_page && res.result.length > 0){
									wrp.append('<p class="center">'+lumise.i(134)+'</p>');
								}
								
							});
						};
						
						if (el.data('nav') == 'history')
							load_history(0);
						
						switch (func) {
							
							case 'nav' : 
								return e.data.nav(e);
							break;
							
							case 'pagination' : 
								load_history(el.data('p'));
							break;
							
							case 'copy-link' : 
								lumise.func.copy(decodeURIComponent(el.closest('[data-view="fsub"]').data('link')));
								lumise.func.notice(lumise.i(135), 'success');
							break;
							
							case 'open' : 
								window.open(decodeURIComponent(el.closest('[data-view="fsub"]').data('link')));
							break;
							
							case 'delete' : 
								lumise.func.confirm({
									title: lumise.i(133),
									primary: {
										text: 'Delete',
										callback: function(e) {
											el.closest('span[data-item]').css({opacity: 0.25});
											lumise.post({
												action: 'delete_link_share',
												aid: el.closest('[data-view="fsub"]').data('aid'),
												id: el.closest('[data-view="fsub"]').data('id')
											}, function(res){
												res = JSON.parse(res);
												if (res.success == 0) {
													el.closest('span[data-item]').css({opacity: 1});
													lumise.func.notice(res.message, 'error');
												} else el.closest('span[data-item]').remove();
											});
									
										}
									},
									second: {
										text: 'Cancel'
									}
								});
							break;
							
							case 'create-link' :
								
								var restrict = false;
								
								if (
									share_history.length == 3 && 
									new Date().getTime() - (parseInt(share_history[0]*1000)) < 5*60*1000 
								) {
									restrict = true;
								};
								
								if (restrict === true) {
									
									lumise.func.confirm({
										title: lumise.i(128),
										primary: {},
										second: {
											text: 'Ok'
										},
										type: 'notice'
									});
									
									return;
								};
								
								if ($('#lumise-share-link-title').val() === '') {
									$('#lumise-share-link-title').shake();
									e.preventDefault();
									return;
								};
								
								var has_design = 0;
								Object.keys(lumise.data.stages).map(function(s){
									if (
										typeof lumise.data.stages[s] !== 'undefined' && 
										typeof lumise.data.stages[s].canvas !== 'undefined'
									){
										var canvas = lumise.data.stages[s].canvas,
											objs = canvas.getObjects();
											
										objs.map(function (obj){
											if(obj.evented == true) has_design++;
										});
									}
								});
								
								if (has_design === 0){
									lumise.func.notice(lumise.i(96), 'error');
									return false;
								};
								
								var wrp = $(e.target).closest('#lumise-shares-wrp'),
									share = {
										data: lumise.func.export('share'),
										product: lumise.func.url_var('product', ''),
										product_cms: lumise.func.url_var('product_cms', ''),
										label: $('#lumise-share-link-title').val(),
										aid: lumise.func.get_cookie('lumise-AID'),
										action: 'upload_share_design'
									};
									
								share.screenshot = btoa(encodeURIComponent(
										share.data.stages[Object.keys(share.data.stages)[0]].screenshot
									)
								);
								
								Object.keys(share.data.stages).map(function(s){
									share.data.stages[s].screenshot = '';
								});
								
								share.data = btoa(encodeURIComponent(JSON.stringify(share.data)));
								
								lumise.post(share, function(res) {
									
									res = JSON.parse(res);
									
									wrp.removeAttr('data-process').find('.lumise-notice').remove();
									
									if (res.success === 0) {
										wrp.find('li[data-view="link"]').prepend('<p class="notice error mb1" data-phase="1">'+res.message+'</p>');
									} else { 
										
										wrp.attr({'data-phase': '2'});
										
										var share_url = lumise.data.tool_url;
										
										if (share_url.indexOf('?') > -1)
											share_url += '&';
										else share_url += '?';
										
										share_url += 'product='+res.product;
										if (res.product_cms !== null && res.product_cms !== '')
											share_url += '&product_cms='+res.product_cms;
										share_url += '&share='+res.id;
										
										share_url = share_url.replace('?&', '?');
										
										wrp.find('p[data-view="link-share"]').html(share_url);
										
										wrp.find('button[data-network]').off('click').on('click', function(e){
											var nw = this.getAttribute('data-network'),
												link = '';
											if (nw == 'facebook') {
												link = 'https://www.facebook.com/dialog/share?href='+encodeURIComponent(share_url)+'&display=popup&app_id=1430309103691863';
											} else if (nw == 'twitter') {
												link = 'https://twitter.com/intent/tweet?url='+encodeURIComponent(share_url)+'&text='+encodeURIComponent(share.label)+'&via=Lumise&related=Lumise,LumiseCom,LumiseProductDesigner'
											} else if (nw == 'pinterest') {
												link = 'https://www.pinterest.com/pin/create/button/?url='+encodeURIComponent(share_url)+'&description='+encodeURIComponent(share.label)+'&is_video=false&media='+encodeURIComponent(lumise.data.upload_url+'shares/'+res.path+'/'+res.id+'.jpg')
											}
											
											if (link !== '')
												window.open(link);
											
											e.preventDefault();
										});
										
										
										
										share_history.push(res.created);
										
										localStorage.setItem('LUMISE_SHARE_HISTORY', JSON.stringify(share_history));
										
									}
									
								});
								
								wrp.attr({'data-process': 'Creating...'});

							break;
							
							case 'do-again' : 
								lumise.get.el('shares-wrp').removeAttr('data-phase');
							break;
							
							case 'copy' : 
								
								var el = e.target;
								
								lumise.func.copy(el.innerHTML.trim());
								
								el.setAttribute("data-copied", "true");
								setTimeout(function(){
									el.removeAttribute("data-copied");
								}, 1500);
							        
							break;
						}
					},

					my_cart : function(e) {

						var func = e.target.getAttribute('data-func'),
							current = lumise.func.url_var('cart', ''),
							id = e.target.getAttribute('data-id');

						if (!func || func === '')
							return;

						switch (func) {
							case 'remove':
								if (confirm(lumise.i('sure'))) {
									if (current == id)
										lumise.func.set_url('cart', null);
									var items = JSON.parse(localStorage.getItem('LUMISE-CART-DATA'));
									delete items[id];
									localStorage.setItem('LUMISE-CART-DATA', JSON.stringify(items));
									setTimeout(lumise.render.cart_change, 150);
								}
							break;
							case 'edit':
								lumise.cart.edit_item(id, e);
							break;
							case 'checkout':
								lumise.cart.do_checkout();
							break;
						}

						e.preventDefault();

					},
					
					cart_confirm : function(e) {
						
						var func = e.target.getAttribute('data-func');
						
						if (!func)return;
						
						switch (func) {
							case 'details' : lumise.render.cart_details(e); break;
							case 'new' : 
								lumise.func.set_url('cart', null);
								lumise.get.el('draft-status').html('');
								lumise.render.products_list(); 
							break;
							case 'checkout' : lumise.cart.do_checkout(e); break;
						}
						e.preventDefault();
					}

				});
				
				$('#lumise-left #lumise-text *[draggable="true"]').each(function(){
					lumise.design.event_add_text(this);
				});

				$('#lumise-auto-alignment').prop({checked: localStorage.getItem('LUMISE-AUTO-ALIGNMENT') == 'true' ? true : false});

				$(document).on('click', function(e){

					if (e.isTrigger !== undefined)
						return;
					
					var el = $(e.target);
					
					if (e.target.tagName != 'INPUT' && el.closest('div.lumise_color_picker').length === 0)
						$('#lumise-color-picker-header i').click();
						
					if (el.hasClass('close') || el.closest('div#lumise-x-thumbn-preview,[data-prevent-click="true"]').length === 0) {
						lumise.get.el('x-thumbn-preview').hide();
					}else if (
						!lumise.ops.preventClick &&
						!el.hasClass('upper-canvas') &&
						!el.hasClass('close') &&
						lumise.ops.preventClick !== true &&
						el.closest(
							'div.lumise-stage.canvas-wrapper,'+
							'[data-view="sub"],'+
							'div.lumise_color_picker,'+
							'div.lumise-lightbox,'+
							'ul.lumise-top-nav,'+
							'[data-prevent-click="true"],'+
							'#lumise-navigations'
						).length === 0
					){
						if (lumise.e.main.find('li[data-tool].active').length > 0)
							lumise.func.navigation('clear');
						else lumise.tools.discard();
						
					};
					
					delete lumise.ops.preventClick;
					
					$('iframe').each(function(){
						this.contentWindow.postMessage({
							action : 'parentClick'
						}, "*");
					});

				})		   
				.on('keydown', function(e) {

					if (['TEXTAREA', 'INPUT'].indexOf(e.target.tagName) > -1 || e.target.getAttribute('contenteditable'))
						return true;

					if ([37, 38, 39, 40].indexOf(e.keyCode) > -1)
						return lumise.actions.do('key-move', e);

					if (e.keyCode === 13)
						return lumise.actions.do('key-enter', e);

					if (e.metaKey === true || e.ctrlKey === true) {

						if (e.keyCode === 90) {
							if (e.shiftKey === false)
								return lumise.actions.do('ctrl-z');
							else return lumise.actions.do('ctrl-shift-z');
						}else if (e.keyCode === 83) {
							if (e.shiftKey === true)
								return lumise.actions.do('ctrl-shift-s', e);
							else return lumise.actions.do('ctrl-s', e);
						}else if (e.keyCode === 80)
							return lumise.actions.do('ctrl-p', e);
						else if (e.keyCode === 79)
							return lumise.actions.do('ctrl-o', e);
						else if (e.keyCode === 69)
							return lumise.actions.do('ctrl-e', e);

					};

					if (e.keyCode === 27)
						return lumise.actions.do('key-esc');

					switch (e.keyCode) {
						case 8: return lumise.actions.do('key-delete', e); break;
						case 46: return lumise.actions.do('key-delete', e); break;
						case 13: return lumise.actions.do('key-enter', e); break;
						case 27: return lumise.actions.do('key-esc', e); break;
						case 37:
						case 38:
						case 39:
						case 40: return lumise.actions.do('key-move', e); break;

					};

					if (e.metaKey === true || e.ctrlKey === true) {

						switch (e.keyCode) {
							case 48: return lumise.actions.do('ctrl-0', e); break;
							case 65: return lumise.actions.do('ctrl-a', e); break;
							case 68: return lumise.actions.do('ctrl-d', e); break;
							case 69: return lumise.actions.do('ctrl-e', e); break;
							case 79: return lumise.actions.do('ctrl-o', e); break;
							case 80: return lumise.actions.do('ctrl-p', e); break;
							case 83:
								if (e.shiftKey === true)
									return lumise.actions.do('ctrl-shift-s', e);
								else return lumise.actions.do('ctrl-s', e);
							break;
							case 90:
								if (e.shiftKey === false)
									return lumise.actions.do('ctrl-z');
								else return lumise.actions.do('ctrl-shift-z');
							break;
							case 187: return lumise.actions.do('ctrl+', e); break;
							case 189: return lumise.actions.do('ctrl-', e); break;
						}

					}

				})
				.on('mouseup', function(e){
					lumise.actions.do('globalMouseUp', e);
				});

				$('#lumise-upload-form').on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
					e.preventDefault();
					e.stopPropagation();
				})
				.on('dragover dragenter', function() {
					$(this).addClass('is-dragover');
				})
				.on('dragleave dragend drop', function() {
					$(this).removeClass('is-dragover');
				})
				.on('drop', function(e) {
					lumise.func.process_files(e.originalEvent.dataTransfer.files);
				})
				.on('click', function(){
					$(this).find('input[type="file"]').get(0).click();
				});
				
				$('#lumise-print-nav input[data-unit="'+localStorage.getItem('LUMISE_PRINT_UNIT')+'"]').prop({checked: true});
				$('#lumise-print-nav select[name="select-size"]').change();
				
				lumise.cliparts.add_events();
				
				if ($('#lumise-left ul.lumise-left-nav>li.active[data-load]').length > 0)
					$('#lumise-left ul.lumise-left-nav>li.active[data-load]').trigger('click');
				else $('#lumise-left ul.lumise-left-nav>li[data-tab]').eq(1).trigger('click');
				
			},

			event_add_text : function(el) {

				[['dragstart', function(e){

					lumise.ops.drag_start = this;

					var offs = $(this).offset();

					lumise.ops.drag_start.distance = {
						x : (e.pageX - offs.left) - (this.offsetWidth/2),
						y : (e.pageY - offs.top) - (this.offsetHeight/2),
						w : this.offsetWidth,
						h : this.offsetHeight
					};

				}],
				['dragend', function(e){

					lumise.ops.drag_start = null;

				}],
				['click', function(e){

					if (this.getAttribute('data-act'))
						lumise.func.preset_import(JSON.parse(this.getAttribute('data-ops')), this, {});
					
					if (window.is_first_text === undefined) {
						window.is_first_text = true;
						$('#lumise-text-tools li[data-tool="spacing"]').trigger('click');
					}

				}]].map(function(ev){
					el.addEventListener(ev[0], ev[1], false);
				});

			},

			layers : {

				current: null,

				create : function(opt){

					switch (opt.type) {

						case 'text':

							var text = lumise.objects.text(opt.ops);

							lumise.stage().canvas.add(text).setActiveObject(text).renderAll();
							lumise.tools.set(text);
							lumise.design.layers.build();

						break;

						case 'image':

							lumise.stage().canvas.add(opt.image).setActiveObject(opt.image).renderAll();

							lumise.tools.set(opt.image);

							lumise.design.layers.build();

						break;

					}

					lumise.stack.save();

				},

				arrange : function() {

					var canvas = lumise.stage().canvas,
						active = canvas.getActiveObject();

					if (!active)
						return;

					var objects = canvas.getObjects(),
						index = objects.indexOf(active),
						btn = $('#lumise-top-tools li[data-tool="arrange"] button[data-arrange]');

					if (
						objects[index-1] !== undefined &&
						objects[index-1].evented !== false
					)
						btn.filter('[data-arrange="back"]').removeClass('disabled');
					else
						btn.filter('[data-arrange="back"]').addClass('disabled');

					if (
						objects[index+1] !== undefined &&
						objects[index+1].evented !== false
					)
						btn.filter('[data-arrange="forward"]').removeClass('disabled');
					else
						btn.filter('[data-arrange="forward"]').addClass('disabled');

				},

				sort : function(el){

					var L = lumise.design.layers, events = {

				        dragstart : function( e ){
					    	L.eldrag = this;
					    	this.setAttribute('data-holder', 'true');
					    	this.parentNode.setAttribute('data-holder', 'true');
					    },
				        dragover : function(e){

					        L.elover = this;

					        if (this == L.eldrag){
						        e.preventDefault();
								return false;
					        }

					        var rect = this.getBoundingClientRect();

					        if (rect.bottom - e.clientY < (rect.height/2) && $(this).next().get(0) !== L.eldrag)
					        	$(this).after(L.eldrag);
					        else if (rect.bottom - e.clientY > (rect.height/2) && $(this).prev().get(0) !== L.eldrag)
					        	$(this).before(L.eldrag);

					        e.preventDefault();
					        return false;
				        },

				        dragleave : function( e ){
					        e.preventDefault();
					        return false;
				        },
				        dragend : function( e ){

					        L.eldrag.removeAttribute('data-holder');
					        L.eldrag.parentNode.removeAttribute('data-holder');

					        var items = lumise.e.layers.find('li[data-id]'),
					        	total = lumise.stage().canvas.getObjects().length-1;

					        items.each(function(i){
								$(this).data('canvas').moveTo(total-i);
					        });

					        L.build();

					        e.preventDefault();
					        return false;
				        }

			        };

			        for (var ev in events)
			        	el.addEventListener(ev, events[ev], false);

				},

				item : function(o) {

					if (!o.id) {
						var date = new Date();
						o.set('id', parseInt(date.getTime()/1000).toString(36)+':'+(Math.random().toString(36).substr(2)));
					}

					var thumbn = o.get('thumbn');

					o.fill = (o.fill == 'rgb(0,0,0)' ? '#000' : o.fill);

					var args = {
						name: '',
						thumbn: thumbn,
						color: o.fill ? lumise.func.invert(o.fill) : '#eee',
						bgcolor: o.fill ? o.fill : '#333',
						class: o.active ? 'active' : '',
						visible: (o.visible !== undefined && o.visible === false) ? 'data-active="true" ' : '',
						selectable: (o.selectable !== undefined && o.selectable === false) ? 'data-active="true" ' : '',
						id: o.id
					};

					var name = o.name ? o.name : (o.text ? o.text : 'New layer');
					args.name = name.substr(0, 20).replace(/\n/g, ' ').replace(/[^a-z0-9A-Z ]/g, '');

					if (o.type == 'path')
						args.name = 'Drawing';

					return args;

				},

				build : function() {

					if (!lumise.get.el('left').find('li[data-tab="layers"]').hasClass('active'))
						return this.arrange();

					var tmpl = "<li draggable=\"true\" class=\"%class%\" data-id=\"%id%\">\
							%thumbn%\
							<span class=\"layer-name\" contenteditable=\"true\" title=\"%name%\">%name%</span> \
							<span class=\"layer-func\">\
								<i class=\"lumise-icon-eye\" %visible%title=\""+lumise.i('14')+"\" data-act=\"visible\"></i>\
								<i class=\"lumise-icon-lock-open\" %selectable%title=\""+lumise.i('15')+"\" data-act=\"selectable\"></i>\
								<i class=\"lumise-icon-close\" title=\""+lumise.i('16')+"\" data-act=\"delete\"></i>\
							</span>\
						</li>",
						layers = lumise.get.el('layers>ul').html(''), index = 0, is_empty = true;

					lumise.stage().canvas.getObjects().map(function(o) {

						if (o.evented === false)
							return index++;

						is_empty = false;

						var args = lumise.design.layers.item(o), tmp = tmpl;

						Object.keys(args).map(function(n){
							tmp = tmp.replace(new RegExp('%'+n+'%', 'g'), args[n]);
						});

						var layer = $(tmp);

						layers.prepend(layer.data({canvas: o}).on('click', function(e){

							e.preventDefault();
							lumise.ops.preventClick = true;

							var act = e.target.getAttribute('data-act'),
								evt = lumise.design.layers.event,
								stage = lumise.stage(),
								target = $(this).data('canvas');

							if (act && evt[act])
								return evt[act](this, e.target);
							
							if (target.selectable !== false) {
								if ($(this).hasClass('active'))
									return;
								$(this.parentNode).find('li.active').removeClass('active');
								stage.limit_zone.set('visible', true);
								stage.canvas.setActiveObject(target);
							}

						}));

						layer.find('span.layer-name').on('keyup', function(e){

							$(this.parentNode).data('canvas').name = this.innerText;

							if (e.keyCode === 13) {
								e.preventDefault();
								lumise.design.layers.build();
								return false;
							}

						});

						lumise.design.layers.sort(layer.get(0));

					});

					if (is_empty)
						lumise.get.el('layers>ul')
								  .html('<h3 class="mt2" style="border:none;text-align:center">'+lumise.i('06')+'</h3>');
					else
						lumise.design.layers.arrange();

				},

				event : {

					visible: function(el, tar) {
						tar.setAttribute('data-active', (tar.getAttribute('data-active') != 'true'));
						$(el).data('canvas').set('visible', (tar.getAttribute('data-active') != 'true'));
						lumise.objects.do.deactiveAll();
					},

					selectable: function(el, tar) {
						tar.setAttribute('data-active', (tar.getAttribute('data-active') != 'true'));
						$(el).data('canvas').set('selectable', (tar.getAttribute('data-active') != 'true'));
						lumise.objects.do.deactiveAll();
					},

					delete: function(el, tar) {

						canvas = lumise.stage().canvas;
						canvas.discardActiveGroup();
						canvas.discardActiveObject();

						lumise.stack.save();

						canvas.remove($(el).data('canvas'));

						lumise.stack.save();

						lumise.design.layers.build();

					}
				}

			},
			
			my_designs : {
				
				'import' : function(file) {
					
					if (
						typeof file != 'object' || 
						(
							file.type.indexOf('application/json') !== 0 && 
							file.name.substr(file.name.length-5) != '.json' &&
							file.name.substr(file.name.length-5) != '.lumi'
						)
					)return alert(lumise.i(32));

					if (lumise.cliparts.uploads[file.lastModified] === undefined) {

						var reader = new FileReader();
						reader.addEventListener("load", function () { 
							
							try{
								var data = JSON.parse(decodeURIComponent(this.result));
							}catch(ex){
								return lumise.func.notice(ex.message, 'error', 3500);
							}

							if (data.stages === undefined)
								return lumise.func.notice(lumise.i(32), 'error', 3500);
							
							lumise.tools.imports(data);

					    	delete reader;

						}, false);

						reader.readAsText(file);

					}
				}
				
			}

		},
		
		templates : {
			
			storage : [],
			
			add_events : function() {

				var events = [['click', function(e){
					
					var t = this, 
						ops = JSON.parse(this.getAttribute('data-ops'));
						
					if (lumise.templates.storage[ops[0].id]) {
						lumise.templates.load({
							upload: lumise.templates.storage[ops[0].id],
							id: ops[0].id,
							price: ops[0].price
						});
						if (lumise.stage().template !== undefined)
							lumise.stage().template.loaded = true;
					}
	
				}]];
	
				lumise.get.el('left').find('ul.lumise-list-items li.lumise-template:not([data-event="true"])').each(function(){
	
					if (this.getAttribute('data-event'))
						return;
	
					this.setAttribute('data-event', true);
					
					var _this = this;
					events.map(function(ev){
						_this.addEventListener(ev[0], ev[1], false);
					});
				});
			},
			
			load : function(tmp) {
				
				if (tmp.upload !== undefined) {
					
					if (tmp.upload.toString().trim().indexOf('http') !== 0)
						tmp.upload = lumise.data.upload_url+tmp.upload;
						
					$('div#LumiseDesign').attr({'data-processing': 'true', 'data-msg': lumise.i('loading')+'..'});
					$.ajax({
						url: tmp.upload,
						method: 'GET',
						statusCode: {
							403: lumise.response.statusCode[403],
							404: function(){
								lumise.func.notice(lumise.i(83), 'error', 3500);
								$('div#LumiseDesign').attr({'data-processing': '', 'data-msg': ''});
							},
							200: function(res) {
								lumise.templates.response(res, tmp);
							}
						}
					});
				};
					
			},
			
			response : function(res, tmp) {
				
				try {
					if (typeof res === ' string' || res.stages === undefined)
						res = JSON.parse(decodeURIComponent(typeof res === 'string' ? res : res.responseText));
				}catch(ex) {
					return console.warn(ex);
				};
				
				if (typeof res !== 'object' || res.stages === undefined || res.stages.length === 0)
					return false;
				
				if (res.stages.lumise === undefined)
					res.stages.lumise = res.stages[Object.keys(res.stages)[0]];
					
				/*clear resources price*/
				let data = JSON.parse(res.stages.lumise.data),
					found = false,
					stages = Object.keys(lumise.data.stages);
				
				for( var item in data.objects){
					if(
						data.objects[item] !== null &&
						typeof data.objects[item]['type'] !== 'undefined'
					){
						data.objects[item]['price'] = 0;
					}
				};
				
				res.stages.lumise.data = JSON.stringify(data);

				for(var i in stages){
					if(lumise.current_stage !== stages[i] && 
						lumise.cart.template[stages[i]] === tmp.id
					){
						found = true;
					}
				}
				
				lumise.cart.template[lumise.current_stage] = tmp.id;
				lumise.cart.price.template[lumise.current_stage] = (!found && !isNaN(tmp.price)) ? parseFloat(tmp.price) : 0;
					
				lumise.tools.imports(res, function(stage) {
					
					if (stage.template !== undefined && stage.template.loaded !== true) {
						
						var ez = lumise.stage().limit_zone,
							scale = (stage.template.scale/(100/(stage.data.devicePixelRatio ? stage.data.devicePixelRatio : 1)))*
									(ez.width/stage.edit_zone.width),
							canvas = lumise.stage().canvas,
							objs = canvas.getObjects().filter(function(o) {
								if (o.evented === true) {
									o.set('active', true);
									return true;
								} else return false;
							});
							
						if (objs.length === 0) {
							//e.preventDefault();
							return false;
						};
						
						var group = new fabric.Group(objs, {
							scaleX: scale,
							scaleY: scale,
							originX: 'center',
							originY: 'center'
						});
						
						var rt = (ez.width/stage.edit_zone.width),
							left = (((stage.edit_zone.width - stage.template.offset.width)/2) - stage.template.offset.left),
							top = (((stage.edit_zone.height - stage.template.offset.height)/2) - stage.template.offset.top);
									
						group.set({
							left: group.left-(left*rt),
							top: group.top-(top*rt)
						});
						
						canvas._activeObject = null;
						
						canvas.setActiveGroup(group.setCoords()).renderAll();
						
						lumise.tools.discard();
						
						stage.template.loaded = true;
					};
					
					if (lumise.ops.first_completed !== true) {
						lumise.actions.do('first-completed');
						lumise.ops.first_completed = true;
					};
					
				});
				
			}
		},
		
		cliparts : {

			storage : [],

			uploads : [],

			add : function(el, ops) {

				if (!el.getAttribute('data-ops'))
					return;

				lumise.ops.preventClick = true;

				$('div#LumiseDesign').attr({'data-processing': 'true', 'data-msg': lumise.i('loading')+'..'});

				var ops = $.extend(JSON.parse(el.getAttribute('data-ops')), (ops ? ops : {})),
					sto = ops.type == 'image' ? lumise.cliparts.storage[ops.id] : (lumise.cliparts.uploads[ops.id] || {}),
					stage = lumise.stage();

				if (ops.type == 'shape')
					sto.url = 'data:image/svg+xml;base64,'+btoa(el.innerHTML.trim());

				sto.width = sto.width ? sto.width : stage.limit_zone.width*0.8;

				if (ops.text && !ops.name)
					ops.name = ops.text.substr(0, 30);

				if (sto.url){
					if (sto.url.indexOf('data:image/svg+xml;base64,') > -1 || sto.url.split('.').pop().trim() == 'svg') {
						ops.type = 'svg';
					}else ops.type = 'image';
				}

				ops = $.extend({
					left: stage.limit_zone.left + (stage.limit_zone.width/2),
					top: stage.limit_zone.top + (stage.limit_zone.height/2),
					width: sto.width,
					name: sto.name ? sto.name : (
						sto.url && sto.url.indexOf('data:image') === -1 ?
						sto.url.split('/').pop() :
						ops.type == 'svg' ? 'New SVG' : 'New Image'
					)
				}, ops);

				if (ops.type == 'i-text') {
					ops.fill = lumise.get.color('invert');
					lumise.design.layers.create({type: 'text', ops: ops});
					$('div#LumiseDesign').attr({'data-processing': '', 'data-msg': ''});
					return;
				}else if (ops.type == 'text-fx') {
					ops.fill = lumise.get.color('invert');
				}

				fabric.Image.fromURL(sto.url, function(image) {

					$('div#LumiseDesign').attr({'data-processing': '', 'data-msg': ''});

					if (ops.height === undefined)
						ops.height = image.height * (sto.width/image.width),

					ops.clipTo = function(ctx) {
			            return lumise.objects.clipto(ctx, image);
			        };

					image.set(ops);

					lumise.design.layers.create({
						type: 'image',
						src: sto.url,
						image: image
					});

					lumise.get.el('x-thumbn-preview').hide();

					stage.canvas.setActiveObject(image);

				});

			},

			add_events : function() {

				var events = [['dragstart', function(e){

					lumise.ops.drag_start = this;

					var offs = $(this).offset();

					lumise.ops.drag_start.distance = {
						x : (e.pageX - offs.left) - (this.offsetWidth/2),
						y : (e.pageY - offs.top) - (this.offsetHeight/2),
						w : this.offsetWidth,
						h : this.offsetHeight
					};

					lumise.get.el('x-thumbn-preview').hide();

				}],
				['dragend', function(e){

					lumise.ops.drag_start = null;

				}],
				['click', function(e){

					var del = e.target.getAttribute('data-delete');
					if (del) {
						if (confirm(lumise.i('sure'))) {
							$(this).remove();
							URL.revokeObjectURL($(e.target).parent().find('img').attr('src'));
							delete lumise.cliparts.uploads[del];
							return lumise.indexed.delete(del, 'uploads');
						}
					}

					var t = this, ops = JSON.parse(this.getAttribute('data-ops'));

					if (ops.type == 'shape')
						ops[0].url = 'data:image/svg+xml;base64,'+btoa(t.innerHTML.trim());
					else if (ops[0].url === undefined)
						ops[0].url = lumise.cliparts.storage[ops[0].id] || lumise.cliparts.uploads[ops[0].id];

					if (ops[0].url && ops[0].url.indexOf('dumb-') === 0) {
						lumise.indexed.get(ops[0].url.split('dumb-')[1], 'dumb', function(res){
							if (res !== null) {
								lumise.cliparts.uploads[ops[0].id] = res[0];
								ops[0].url = res[0];
								lumise.func.preset_import(ops, t, {});
								delete res;
							}
						});
					}else lumise.func.preset_import(ops, t, {});

				}]];

				lumise.get.el('left').find('ul.lumise-list-items li.lumise-clipart:not([draggable="true"])').each(function(){

					if (this.getAttribute('draggable'))
						return;

					this.setAttribute('draggable', true);
					var _this = this;
					events.map(function(ev){
						_this.addEventListener(ev[0], ev[1], false);
					});
				});
			},

			external : function(url, callback) {

				var image = new Image();

				image.crossOrigin = "Anonymous";
				image.onload = function () {

					var canvas = document.createElement('canvas');

				    canvas.width = this.naturalWidth;
				    canvas.height = this.naturalHeight;
				    canvas.getContext('2d').drawImage(this, 0, 0);
				    this.callback(canvas);//.toDataURL('image/jpeg')

				    delete this;
				    delete canvas;
				};

				image.callback = callback;
				image.src = url;

			},

			import : function(id, ops, dir) {
				
		    	var do_import = function() {

					lumise.cliparts.uploads[id] = ops.url;

				    if (ops.thumbn && typeof ops.thumbn == 'string' && ops.thumbn.indexOf('data:image') === 0)
				    	ops.thumbn = lumise.func.url2blob(ops.thumbn);

			    	if (ops.save !== false) {
			    		try{
				    		lumise.indexed.save([{
					    		thumbn: ops.thumbn,
					    		name: ops.name,
					    		id: id
					    	}, [ops.url]], 'uploads');
				    	}catch(ex){console.log(ex);}
			    	}

			    	var html = '<li style="background-image: url('+URL.createObjectURL(ops.thumbn ? ops.thumbn : ops.url)+')" \
			    				data-ops=\'[{"type": "upload", "name": "'+ops.name+'", "id": "'+id+'"}]\' class="lumise-clipart">\
								<i data-info="'+id+'"></i>\
								<i class="lumise-icon-close" data-delete="'+id+'" title="'+lumise.i(47)+'"></i>\
							</li>';

			    	if (dir == 'prepend')
			    		lumise.get.el('upload-list').find('ul.lumise-list-items').prepend(html);
			    	else lumise.get.el('upload-list').find('ul.lumise-list-items').append(html);

			    	lumise.cliparts.add_events();

		    	};

	    		if (ops.thumbn === undefined) {

		    		lumise.func.createThumbn({
			    		source: ops.url,
			    		width: 300,
			    		height: 240,
			    		callback: function(canvas) {
				    		ops.thumbn = lumise.func.url2blob(canvas.toDataURL('image/jpeg', 0.3));
				    		do_import();
			    		}
		    		});

		    		return;
	    		};

		    	do_import();


		    }

		},

		actions : {

			stack : {},

			add : function(name, callback) {

				if (this.stack[name] === undefined)
					this.stack[name] = [];

				this.stack[name].push(callback);

			},

			do : function(name, opts) {

				if (this.stack[name] !== undefined) {
					var res;
					this.stack[name].map(function(evt){
						if (typeof evt == 'function') {
							try { 
								res = evt(opts);
							}catch(ex){
								console.warn(ex.message+' - do action '+name);
								lumise.func.notice(ex.message+' - do action '+name, 'error');
							}
						}
					});
					return res;
				}

			}

		},

		tools : {

			set : function(obj) {

				if (!obj)
					obj = lumise.stage().canvas.getActiveObject();

				if (!obj)
					return;
					
				var el = lumise.get.el;

				el('transparent').val(obj.opacity !== undefined && obj.opacity !== null ? parseFloat(obj.opacity)*100 : 100).trigger('input');
				el('rotate').val(obj.angle !== undefined ? obj.angle : 0).trigger('input');

				el('curved-radius').val(obj.radius !== undefined ? obj.radius : 50).trigger('input');
				el('curved-spacing').val(obj.spacing !== undefined ? obj.spacing : 50).trigger('input');
				el('workspace').find('.lumise-edit-text').val(obj.text ? obj.text.trim() : '');
				
				el('font-size').val(obj.fontSize ? obj.fontSize : 14).trigger('input');
				el('letter-spacing').val(obj.charSpacing !== undefined ? obj.charSpacing : 0).trigger('input');
				el('line-height').val(obj.lineHeight !== undefined ? obj.lineHeight*10 : 10).trigger('input');

				if (obj.type == 'path'){
					el('stroke-width').attr({'data-ratio': '1'}).val(obj.strokeWidth !== undefined ? obj.strokeWidth : 0).trigger('input');
				}else{
					el('stroke-width').attr({'data-ratio': '0.1'}).val(obj.strokeWidth !== undefined ? obj.strokeWidth*10 : 0).trigger('input');
				}

				el('skew-x').val(obj.skewX !== undefined ? obj.skewX : 0).trigger('input');
				el('skew-y').val(obj.skewY !== undefined ? obj.skewY : 0).trigger('input');

				if (
					obj.type != 'path' &&
					(
						obj.type != 'image' ||
						(obj.type == 'image' && obj.fill != 'rgb(0,0,0)' && obj.fill !== '#000' && obj.fill !== '')
					) &&
					(
						obj.type != 'svg' ||
						(obj.type == 'svg' && obj.fill != 'rgb(0,0,0)' && obj.fill !== '#000' && obj.fill !== '')
					)
				) {

					var fill = obj.fill ? obj.fill : lumise.get.color('invert');

					if (el('fill').get(0).color && typeof el('fill').get(0).color.fromString == 'function')
						el('fill').get(0).color.fromString(fill);
					el('fill').closest('li[data-tool="fill"]').css({'border-bottom': '3px solid '+(fill)});

				}else{
					el('fill').val('').attr({style: ''});
					el('fill').closest('li[data-tool="fill"]').css({'border-bottom': ''});
				}

				var stroke = obj.stroke ? obj.stroke : '';
				if (el('stroke').get(0).color && typeof el('stroke').get(0).color.fromString == 'function')
					el('stroke').val(stroke).css({background: ''}).get(0).color.fromString(stroke);
				el('text-tools .text-format').removeClass('selected');
				el('text-tools .text-format.lumisex-align-'+obj.textAlign).addClass('selected');
				el('text-align').attr({'class': 'lumisex-align-'+(obj.textAlign ? obj.textAlign : 'center')});

				el('curved').get(0).checked = (obj.type === 'curvedText');
				el('flip-x').get(0).checked = obj.flipX;
				el('flip-y').get(0).checked = obj.flipY;

				el('qrcode-text').val(obj.text ? obj.text.trim() : '');

				var format = el('text-tools .text-format');

				[['bold', 'fontWeight'], ['italic', 'fontStyle'], ['underline', 'textDecoration']].map(function(f){
					if (obj[f[1]] == f[0])
						format.filter('[data-format="'+f[0]+'"]').addClass('selected');
				});

				if (obj.fontFamily){
					
					var fml = obj.fontFamily.replace(/\"/g, '');
					if (el('fonts').find('font[data-family="'+fml+'"]').length > 0) {
						el('fonts').find('.selected').removeClass('selected');
						el('fonts').find('font[data-family="'+fml+'"]').addClass('selected');
					}
					el('text-tools').find('button.dropdown').html('<font style="font-family:\''+fml+'\'">'+fml+'</font>');
				}
				
				el('text-effect').find('img[data-effect]').attr({'data-selected': null});

				if (obj.type == 'text-fx') {

					if (obj.bridge === undefined)
						obj.bridge = {};

					el('text-fx-offsety').val(obj.bridge.offsetY !== undefined ? obj.bridge.offsetY*100 : 50).trigger('input');
					el('text-fx-bottom').val(obj.bridge.bottom !== undefined ? obj.bridge.bottom*10 : 25).trigger('input');
					el('text-fx-curve').val(obj.bridge.curve !== undefined ? obj.bridge.curve*10 : -25).trigger('input');
					el('text-fx-trident').prop({checked: obj.bridge.trident});

					if (obj.bridge.oblique === true)
						el('text-effect').find('img[data-effect="oblique"]').attr({'data-selected': 'true'});
					else el('text-effect').find('img[data-effect="bridge"]').attr({'data-selected': 'true'});

				}else if (obj.type == 'curvedText') {
					el('text-effect').find('img[data-effect="curved"]').attr({'data-selected': 'true'});
				}else if (obj.type == 'text-fx') {
					el('text-effect').find('img[data-effect="normal"]').attr({'data-selected': 'true'});
				}else if (obj.type == 'image') {
					
					el('image-fx-brightness').val(obj.fx && obj.fx.brightness ? obj.fx.brightness : 0).trigger('input');
					el('image-fx-saturation').val(obj.fx && obj.fx.saturation ? obj.fx.saturation : 100).trigger('input');
					el('image-fx-contrast').val(obj.fx && obj.fx.contrast ? obj.fx.contrast : 0).trigger('input');
					el('image-fx-deep').val(obj.fx && obj.fx.deep ? obj.fx.deep : 0).trigger('input');
					el('image-fx-mode').val(obj.fx && obj.fx.mode ? obj.fx.mode : 'light');
					el('image-fx-fx').find('[data-selected]').removeAttr('data-selected');
					el('image-fx-fx').find('li[data-fx="'+(obj.fx && obj.fx.fx ? obj.fx.fx : '')+'"]').attr({'data-selected': 'true'});
					el('replacement-image').find('li[data-view="title"] h3 span').html(
						obj._originalElement.width+'x'+obj._originalElement.height
					);
				}else if (obj.type == 'svg' && obj.src !== undefined && obj.src.indexOf('data:image/svg+xml;base64,') === 0) { 
					
					lumise.func.set_svg_colors(obj);
					
				};

				lumise.design.layers.arrange();

				if (obj.type == 'image' && obj._element && obj._element.src.indexOf('data:image/svg+xml;base64,') > -1)
					obj.set('type', 'svg');

				lumise.e.tools.attr({'data-view': obj.type});

			},

			export : function(stage) {
				
				if (!stage || !stage.canvas)
					return null;

				var data = stage.canvas.toJSON(lumise.ops.export_list);
				
				data.objects.map(function(obj, ind){

					if (obj.evented === false)
						return delete data.objects[ind];
					else delete data.objects[ind].clipTo;

					Object.keys(obj).map(function(k){
						if (obj[k] === undefined || obj[k] === null)
							delete obj[k];
					});

					if (obj.fontFamily !== undefined && obj.font === undefined) {
						fonts = JSON.parse(localStorage.getItem('LUMISE_FONTS'));
						if (fonts[encodeURIComponent(obj.fontFamily)])
							obj.font = fonts[encodeURIComponent(obj.fontFamily)];
					};
					
					 if (
					 	obj.fontFamily !== undefined && 
					 	typeof obj.font == 'string' && 
					 	obj.font.indexOf('.woff') > -1 && 
					 	obj.font.indexOf('http') === -1
					 )obj.font = lumise.data.upload_url+obj.font;
					
					if (obj.fontFamily && obj.fontFamily.indexOf('"') > -1)
						obj.fontFamily = obj.fontFamily.replace(/\"/g, '');
					
					if (obj.origin_src) {
						obj.src = obj.origin_src;
						delete obj.origin_src;
					};

					if (obj.type == 'text-fx' || obj.type == 'i-text' || obj.type == 'curvedText')
						delete obj.src;
						
					if (obj.type == 'path-group') {
						obj.type = 'svg';
						delete obj.paths;
					};

				});
				
				data.devicePixelRatio = window.devicePixelRatio;
				data.product_color = lumise.get.color();
				data.limit_zone = {};
				
				['width', 'height', 'top', 'left'].map(function(f){
					data.limit_zone[f] = stage.limit_zone ? stage.limit_zone[f] : 0;
				});

				return JSON.stringify(data);

			},

			toImage : function(ops) {

				var s = ops.stage;

				if (!s)return null;
				
				ops = $.extend({
					is_bg: false,
					format: ops.is_bg !== true ? 'png' : 'jpeg',
					multiplier: 1/*2/window.devicePixelRatio*/,
					top: s.limit_zone.top,
				    left: s.limit_zone.left,//-(((s.limit_zone.height*(w/h))-s.limit_zone.width)/2),
				    width: s.limit_zone.width,//s.limit_zone.height*(w/h),
				    height: s.limit_zone.height
				}, ops);
				
				if (ops.is_bg == 'full') {
					ops.left = s.product.left-(s.product.width/2);
					ops.top = s.product.top-(s.product.height/2);	
					ops.width = s.product.width;	
					ops.height = s.product.height;
				};
				
				if (ops.is_bg === false) {

					var bg = s.canvas.backgroundColor;
					s.canvas.backgroundColor = 'transparent';

					if (s.productColor)
						s.productColor.visible = false;
					if (s.product)
						s.product.visible = false;
					if (s.canvas.overlayImage)
						s.canvas.overlayImage.visible = false;

				};
				
				var lm = s.limit_zone.visible;
				s.limit_zone.visible = false; 
				
				var data = s.canvas.toDataURL(ops);

				if (ops.is_bg === false) {

					s.canvas.backgroundColor = bg;

					if (s.productColor)
						s.productColor.visible = true;
					if (s.product)
						s.product.visible = true;
					if (s.canvas.overlayImage)
						s.canvas.overlayImage.visible = true;

				};
				
				s.limit_zone.visible = lm;
				s.canvas.renderAll();
					
				return data;

			},

			qrcode : function(options) {

				if( typeof options === 'string' ){
					options	= { text: options };
				}

				options	= $.extend( {}, {
					render		: "canvas",
					width		: 500,
					height		: 500,
					typeNumber	: -1,
					correctLevel	: QRErrorCorrectLevel.H,
		            background      : "rgba(255,255,255,0)",
		            foreground      : lumise.get.color('invert')
				}, options);


				var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
				qrcode.addData(options.text);
				qrcode.make();


				var canvas	= document.createElement('canvas');
				canvas.width	= options.width+50;
				canvas.height	= options.height+50;
				var ctx		= canvas.getContext('2d');


				var tileW	= options.width  / qrcode.getModuleCount();
				var tileH	= options.height / qrcode.getModuleCount();


				for( var row = 0; row < qrcode.getModuleCount(); row++ ){
					for( var col = 0; col < qrcode.getModuleCount(); col++ ){
						ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
						var w = (Math.ceil((col+1)*tileW) - Math.floor(col*tileW));
						var h = (Math.ceil((row+1)*tileW) - Math.floor(row*tileW));
						ctx.fillRect(Math.round(col*tileW)+25,Math.round(row*tileH)+25, w, h);
					}
				}

				return canvas;

			},

			clear : function(){

				this.discard();

				var canvas = lumise.stage().canvas,
					objs = canvas.getObjects();

				while (objs.filter(function(obj){return obj.evented}).length > 0){
					objs.map(function(obj) {
						if (obj.evented === true)
							canvas.remove(obj);
					});
				}

			},

			clearAll : function(){

				var canvas, objs;

				Object.keys(lumise.data.stages).map(function(s){

					canvas = lumise.data.stages[s].canvas;

					if (canvas === undefined)
						return;

					objs = canvas.getObjects();

					while (objs.filter(function(obj){return obj.evented}).length > 0) {
						objs.map(function(obj) {
							if (obj.evented === true)
								canvas.remove(obj);
						});
					}

				});

			},

			import : function (data, callback) {
				
				if (!data || !data.objects)
					return lumise.ops.importing = false;
				
				var stage = lumise.stage(),
					canvas = stage.canvas,
					do_import = function(i) {
						
						if (i === -1) {
							/*Scann and load all fonts before importing*/
							var gfonts = [], custom = [], families = [], cfo, uco;
							/* Life hack, display font for the first time*/
							if ($('#lumise-fonts-preload').length === 0) {
								$('body').append('<div id="fonts-preload" style="position: fixed"></div>');
							}
							data.objects.map(function(o) {								
								
								if (
									o !== null && 
									o.fontFamily !== undefined && 
									o.fontFamily !== '' && 
									o.fontFamily.toLowerCase() != 'arial'
								) {
									
									cfo = decodeURIComponent(o.fontFamily.replace(/\"/g, ''));
									
									if (families.indexOf(cfo) === -1 && cfo.toLowerCase() != 'arial') {
										
										families.push(cfo);	
										$('#fonts-preload').append('<font style="font-family:\''+cfo+'\'">abcdefghijkl<b>mnopqrx</b><u>tywxz098</u><i>7654321</i></font>');	
										if (
											o.font !== undefined && 
											o.font.indexOf('fonts.gstatic.com') === -1 && 
											(o.font.indexOf('.woff') > -1 || o.font.indexOf('data:') === 0)
										) {
											
											custom.push(cfo);
											
											uco = o.font;
											if (o.font.indexOf('.woff') > -1 && o.font.indexOf('http') === -1)
												uco = lumise.data.upload_url+o.font;
											
											$('head').append('<style type="text/css">@font-face {font-family:"'+cfo+'";src: url("'+uco+'") format("woff");}</style>');
											
										}else{
	
		 									if (
		 										o.font === undefined || 
		 										o.font.indexOf('fonts.gstatic.com') > -1
		 									)o.font = ["latin","regular"];
		 									
		 									gfonts.push(cfo.replace(/ /g, '+')+':'+o.font[1]);
	 									
	 									}
 									}
								}
								
							});
							
							if (gfonts.length > 0 || custom.length > 0) {
								
								var fload = {
									inactive: function() {
										this.active();
									},
								    active: function () {
									    
									    $('div#LumiseDesign').attr({'data-processing': 'true', 'data-msg': lumise.i('importing')});
									    
									    var loo = 0,
											loop_check = function() {
										    var pass = true;
										    loo++;
										    families.map(function(f){
											    if (!document.fonts.check('12px "'+f+'"'))
											    	pass = false;
										    });
										    if (pass === false && loo < 20)
										    	setTimeout(loop_check, 350);
										    else setTimeout(do_import, 100, 0);
									    };
									    
									    loop_check();
									    
								    },
								    text: 'abcdefghijklmnopqrxtywxz0987654321'
								};
								
								if (gfonts.length > 0)
									fload.google = { families: gfonts };
								
								if (custom.length > 0)
									fload.custom = { families: custom };
								
								return WebFont.load(fload);
								
							}else i = 0;
							
						};
						
						if (data.objects[i] !== undefined) {
							
							$('div#LumiseDesign').attr({'data-processing': 'true', 'data-msg': lumise.i('importing')});
							lumise.ops.importing = true;

							if (data.objects[i] !== null) {

								delete data.objects[i].clipTo;
								delete data.objects[i].active;

								data.objects[i] = $.extend({
									stroke: '',
									strokeWidth: 0,
									scaleX: 1,
									scaleY: 1,
									angle: 0,
									skewX: 0,
									skewY: 0,
									left: stage.limit_zone.left + (stage.limit_zone.width/2),
									top: stage.limit_zone.top + (stage.limit_zone.height/2)
								}, data.objects[i]);
								
								if (lumise.objects.lumise[data.objects[i].type]) {

									data.objects[i].top += yCenter;
									data.objects[i].left += xCenter;
 									if (
 										data.objects[i].src !== undefined &&
 										data.objects[i].src.indexOf('http') !== 0 &&
 										data.objects[i].src.indexOf('blob:') !== 0 &&
 										data.objects[i].src.indexOf('data:image/') !== 0
 									)data.objects[i].src = lumise.data.upload_url+data.objects[i].src;

 									var do_add = function() {

	 									lumise.objects.lumise[data.objects[i].type](
											data.objects[i],
											function (obj) {

												if (obj === null) {
													err = true;
													return do_import(i+1);
												};
												
												canvas.add(obj);

												if (obj.type == 'curvedText')
													obj.set('radius', obj.radius);
												
												if (obj.type =='image' && obj.fx !== undefined) {

											        obj.fxOrigin = obj._originalElement.cloneNode(true);

													setTimeout (function() {

												        lumise.func.image_fx(obj.fxOrigin, obj.fx, function(cdata, colors){

															obj._element.src = cdata;
															obj._originalElement.src = cdata;

															obj.colors = colors;

															obj._element.onload = function() {
																$('div#LumiseDesign').attr({'data-processing': '', 'data-msg': ''});
																do_import(i+1);
															}

														});

													}, 1);

										        }else do_import(i+1);

											}
										);
 									};

 									do_add();

								}else do_import(i+1);

							}else do_import(i+1);

						}else{

							canvas.renderAll();
							lumise.design.layers.build();

							lumise.ops.importing = false;

							$('div#LumiseDesign').attr({'data-processing': '', 'data-msg': ''});
							if (typeof callback == 'function'){
								if (typeof data['template'] !== 'undefined'){
									lumise.cart.template = data.template.stages;
									lumise.cart.price.template =  data.template.price;
								};
								
								callback(err);
							};
							
							if (canvas.getObjects().length === objs_count)
								setTimeout(lumise.tools.discard, 50);
						}
					},
					err = false;
				
				if (stage.limit_zone === undefined)
					return;
				
				if (lumise.data.color !== undefined) {
					
					lumise.get.el('product-color').find('li[data-color].choosed').removeClass('choosed');
					
					if (lumise.get.el('product-color').find('li[data-color="'+lumise.data.color+'"]').length > 0) {
						lumise.get.el('product-color').find('li[data-color="'+lumise.data.color+'"]').addClass('choosed');
					} else {
						
						lumise.get.el('product-color').find('input.color').val(lumise.data.color);
						
						if (
							lumise.get.el('product-color').get(0).color && 
							typeof lumise.get.el('product-color').get(0).color.fromString == 'function'
						)
							lumise.get.el('product-color').get(0).color.fromString(lumise.data.color);
					}
					stage.productColor.set('fill', lumise.data.color);
					delete lumise.data.color;
				};
					
				xCenter = data.limit_zone !== undefined ? data.limit_zone.left+(data.limit_zone.width/2) : 0,
				yCenter = data.limit_zone !== undefined ? data.limit_zone.top+(data.limit_zone.height/2) : 0;
				
				//limit_zone
				xCenter = xCenter !== 0 ? (stage.limit_zone.left+(stage.limit_zone.width/2)) - xCenter : 0;
				yCenter = yCenter !== 0 ? (stage.limit_zone.top+(stage.limit_zone.height/2)) - yCenter : 0;
				
				$('div#LumiseDesign').attr({'data-processing': 'true', 'data-msg': lumise.i(88)});
				var objs_count = canvas.getObjects().length;
				setTimeout(do_import, 1, -1);
				
			},

			imports : function(data, callback) {
				
				if (!data || !data.stages) {
					return lumise.func.notice(lumise.i(25), 'error');
				};
				
				if (Object.keys(data.stages).length === 1 && Object.keys(data.stages)[0] == 'lumise') {
					
					this.clear();
					
					var cur = lumise.current_stage;
					
					if (lumise.data.stages[cur] && data.stages['lumise'].data) {
						
						if (typeof data.stages['lumise'].data == 'string')
							lumise.data.stages[cur].data = JSON.parse(data.stages['lumise'].data);
						else lumise.data.stages[cur].data = data.stages['lumise'].data;
						
						lumise.data.stages[cur].screenshot = data.stages['lumise'].screenshot;
						lumise.data.stages[cur].updated = data.stages['lumise'].updated;
				    }
				    
				} 
				else {
					
					this.clearAll();
					
					Object.keys(lumise.data.stages).map(function(s){
	
						delete lumise.data.stages[s].data;
						delete lumise.data.stages[s].screenshot;
						delete lumise.data.stages[s].updated;
	
						lumise.data.stages[s].stack = {
							data : [],
						    state : true,
						    index : 0
					    };
	
					});
	
					Object.keys(data.stages).map(function(s){
						if (lumise.data.stages[s] && data.stages[s].data) {
							if (typeof data.stages[s].data == 'string')
								lumise.data.stages[s].data = JSON.parse(data.stages[s].data);
							else lumise.data.stages[s].data =  data.stages[s].data;
							lumise.data.stages[s].screenshot = data.stages[s].screenshot;
							lumise.data.stages[s].updated = data.stages[s].updated;
					    }
					});
				
				};

				this.import(lumise.data.stages[lumise.current_stage].data, function(){
					
					lumise.stack.save();
					lumise.func.update_state();
					
					if (typeof callback == 'function') {
						callback(lumise.data.stages[lumise.current_stage]);
					};
					
					delete lumise.data.color;
					delete lumise.data.stages[lumise.current_stage].data;
					
				});
				
				/*lumise.func.notice(lumise.i(26), 'success');*/
				lumise.func.navigation('clear');

			},

			discard : function() {

				if (!lumise.stage())
					return;

				var canvas = lumise.stage().canvas;

				canvas.discardActiveObject();
				canvas.discardActiveGroup();
				canvas.renderAll();

			},

			save : function(e, id){
			
				if (lumise.ops.importing === true)
					return;

				if (lumise.get.el('main').find('.lumise-stage').length === 0)
					return;
						
				lumise.func.export(e == 'designs' ? 'designs' : true, id/*save to db*/);

				lumise.get.el('status').hide();
				lumise.ops.before_unload = null;

				lumise.actions.do('save');

				if (e && typeof e.preventDefault == 'function')
					e.preventDefault();

			},

			load_font : function(family, font, callback) {
				
				var is_returned = false;
				
				if (!document.fonts)
					return;
				
				var ff = (family.indexOf('"') === -1 ? '"'+family+'"': family);

				if (navigator.userAgent.indexOf("Firefox") === -1 && document.fonts.check('1px '+ff)) {

					document.fonts.load('1px '+ff, 'a').then(function(){
						document.fonts.load('italic bold 1px '+ff, 'a').then(function(){
							callback(family);
						});
					});
					return;
				};
				
				if (typeof font == 'string') {
					
					if (font.trim().indexOf('http') === -1 && font.trim().indexOf('data:') !== 0)
						font = lumise.data.upload_url+font;
					else if (font.trim().indexOf('data:text/plain;') > -1)
						font = font.trim().replace('data:text/plain;', 'data:font/truetype;charset=utf-8;');

					if (font.trim().indexOf('url(') !== 0)
						font = 'url('+font+')';
					
					$('head').append('<style type="text/css">@font-face {font-family:'+ff+';src: '+font+' format("woff2");}</style>');
					WebFont.load({
						custom: {families: [ff]},
						active: function () {
						    callback(family);
					    }
					});
					return;
				};

				var txt = decodeURIComponent(family).replace(/ /g, '+').replace(/\"/g, '')+':'+font[1]+':'+font[0];
				
				WebFont.load({
				    google: { families: [txt] },
				    active: function () {
					    callback(family);
				    }
				});
			},

			lightbox : function(ops) {

				if (ops == 'close')
					return $('#lumise-lightbox').remove();

				var tmpl = '<div id="lumise-lightbox" class="lumise-lightbox">\
								<div id="lumise-lightbox-body">\
									<div id="lumise-lightbox-content" style="min-width:%width%px">\
										%content%\
									</div>\
									%footer%\
									<a class="kalb-close" href="#close" title="Close">\
										<i class="lumisex-android-close"></i>\
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
			
			svg : {
				
				rgb2hex : function(rgb){
					if (rgb === null || rgb === undefined || rgb === '' || rgb.indexOf('#') === 0)
						return rgb;
					rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
					return (rgb && rgb.length === 4) ? "#" +
					("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
					("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
					("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
				},
				
				invertColor : function(hexTripletColor) {
			        var color = hexTripletColor;
			        color = color.substring(1); // remove #
			        color = parseInt(color, 16); // convert to integer
			        color = 0xFFFFFF ^ color; // invert three bytes
			        color = color.toString(16); // convert to hex
			        color = ("000000" + color).slice(-6); // pad with leading zeros
			        color = "#" + color; // prepend #
			        return color;
			    },
				
				getColors : function(svg) {
					
					var fills = [], strokes = [], stops = [];
		
					svg.find('[fill]').map(function () {
						if (this.getAttribute('fill').indexOf('rgb') > -1)
							this.setAttribute('fill', rgb2hex(this.getAttribute('fill')));
						this.setAttribute('data-fill-attr-color', this.getAttribute('fill'));
						fills.push(this.getAttribute('fill'));
					});
					
					svg.find('[stroke]').each(function () {
						this.setAttribute('data-stroke-attr-color', this.getAttribute('stroke'));
						strokes.push(this.getAttribute('stroke'));
					});
					
					svg.find('[stop-color]').map(function () {
						this.setAttribute('data-stop-attr-color', this.getAttribute('stop-color'));
						stops.push(this.getAttribute('stop-color'));
					});
					
					svg.find('[style]').each(function () {
						
						if (this.style.fill && this.style.fill !== '') {
							fills.push(this.style.fill);
							this.setAttribute('data-fill-style-color', this.style.fill);
						};
						
						if (this.style.stroke && this.style.stroke !== '') {
							strokes.push(this.style.stroke);
							this.setAttribute('data-stroke-style-color', this.style.stroke);
						};
						
						if (this.style.stopColor && this.style.stopColor !== '') {
							stops.push(this.style.stopColor);
							this.setAttribute('data-stop-style-color', this.style.stopColor);
						};
						
					});
					
					var colors = {};
					
					for (var i=0; i<fills.length; i++) {
						if (fills[i].indexOf('url') === -1 && fills[i] != 'none') {
							if (colors[fills[i]] === undefined)
								colors[fills[i]] = 1;
							else colors[fills[i]]++;
						}
					}
					
					for (var i=0; i<strokes.length; i++) {
						if (strokes[i].indexOf('url') === -1 && strokes[i] != 'none') {
							if (colors[strokes[i]] === undefined)
								colors[strokes[i]] = 1;
							else colors[strokes[i]]++;
						}
					}
					
					for (var i=0; i<stops.length; i++) {
						if (stops[i].indexOf('url') === -1 && stops[i] != 'none') {
							if (colors[stops[i]] === undefined)
								colors[stops[i]] = 1;
							else colors[stops[i]]++;
						}
					}
					
					return Object.keys(colors).sort(function(a, b) {
				        return (colors[a] < colors[b]) ? 1 : ((colors[a] > colors[b]) ? -1 : 0);
				    });
					
				},
				
				renderColors : function(el) {
		
					var _this = this,
						colors = this.getColors($('#lumise-svg-edit>svg')),
						inps = $('#lumise-svg-tool div[data-view="current-colors"]');
					
					inps.html('');
					
					colors.map(function(color){
						inps.append('<span><input type="color" data-color="'+color+'" value="'+_this.rgb2hex(color)+'" style="background-color:'+color+';color: '+color+'" /></span>');
					});
					
					inps.find('input[type="color"]').on('input', function(e) {
						
						var color = this.getAttribute('data-color'),
							new_color = this.value,
							svg = $('#lumise-svg-edit svg');
						
						svg.find('[fill][data-fill-attr-color="'+color+'"]').attr({fill: new_color});
						svg.find('[fill][data-stroke-attr-color="'+color+'"]').attr({stroke: new_color});
						svg.find('[fill][data-stop-attr-color="'+color+'"]').attr({'stop-color': new_color});
						
						svg.find('[data-fill-style-color="'+color+'"]').css({fill: new_color});
						svg.find('[data-stroke-style-color="'+color+'"]').css({stroke: new_color});
						svg.find('[data-stop-style-color="'+color+'"]').css({stopColor: new_color});
						
					});
					
					if (el !== undefined)
						this.render_fills(el);
				
				},
				
				render_fills : function(e_l) {
					
					var _this = this,
						fill = e_l.getAttribute('fill') ? e_l.getAttribute('fill') : 
							   e_l.style.fill.replace(/\ /g, '').replace(/\"/g, ''),
						stroke = e_l.getAttribute('stroke') ? e_l.getAttribute('stroke') : 
							   e_l.style.stroke.replace(/\ /g, '').replace(/\"/g, ''),
						stroke_width = e_l.getAttribute('stroke-width') ? e_l.getAttribute('stroke-width') : 
							   e_l.style.strokeWidth.replace(/\ /g, '').replace(/\"/g, ''),
						inps = $('#lumise-svg-fills-custom'),
						inpz = $('#lumise-svg-strokes-custom'),
						el = $(e_l);
						
					inps.html('');
					
					if (fill.indexOf('url') > -1) {
						
						var linear = $(fill.replace('url(', '').replace(')', ''));
						
						linear.find('stop').each(function(i) {
							inps.append('<span><input type="color" value="'+_this.rgb2hex(this.style.stopColor)+'" data-i="'+i+'" /><small data-i="'+i+'" title="Delete">x</small></span>');
						});
						inps.find('input').on('input', function(e) {
							linear.find('stop').eq(this.getAttribute('data-i')).css({stopColor: this.value});
							_this.renderColors();
						});
						inps.find('small[data-i]').on('click', function(e) {
							linear.find('stop').eq(this.getAttribute('data-i')).remove();
							$(this).parent().remove();
							_this.renderColors(e_l);
						});
					}else if (fill !== ''){
						inps.append('<span><input type="color" value="'+(fill.indexOf('rgb') > -1 ? _this.rgb2hex(fill) : fill)+'" /><small data-i="0" title="Delete">x</small></span>');
						inps.find('input').on('input', function(e) {
							el.css({'fill': this.value});
							el.removeAttr('fill');
							_this.renderColors();
						});
						inps.find('small[data-i]').on('click', function(e) {
							el.css({'fill': ''});
							el.removeAttr('fill');
							$(this).parent().remove();
							_this.renderColors(e_l);
						});
					}else{
						var a = $('<a href="#">Add fill color</a>');
						inps.html('').append(a);
						a.on('click', function(e){
							el.css({'fill': '#4ca722'});
							_this.renderColors(e_l);
							e.preventDefault();
						});
					};
					
					if (stroke !== ''){
						inpz.html('<input type="color" value="'+(stroke.indexOf('rgb') > -1 ? _this.rgb2hex(stroke) : stroke)+'" /><input placeholder="Stroke width" type="range" min="0" max="50" value="'+parseFloat(stroke_width)+'" /><p><a href="#">Remove stroke</a></p>');
						inpz.find('input').on('input', function(e) {
							
							if (this.type === 'color')
								el.css({'stroke': this.value});
							else el.css({'stroke-width': this.value});
							_this.renderColors();
						});
						inpz.find('a').on('click', function(e){
							el.css({'stroke': '', 'stroke-width': ''});
							_this.renderColors(e_l);
							e.preventDefault();
						});
					}else{
						var a = $('<a href="#">Add stroke</a>');
						inpz.html('').append(a);
						a.on('click', function(e){
							el.css({'stroke': '#4ca722', 'stroke-width': '1px'});
							_this.renderColors(e_l);
							e.preventDefault();
						});
					}
					
				},
				
				replace : function(svg, new_color, color) {
					
					if (svg === undefined) {
						$('#lumise-color-picker-header i').click();
						return;	
					};
					
					svg.find('[fill][data-fill-attr-color="'+color+'"]').attr({fill: new_color});
					svg.find('[fill][data-stroke-attr-color="'+color+'"]').attr({stroke: new_color});
					svg.find('[fill][data-stop-attr-color="'+color+'"]').attr({'stop-color': new_color});
					
					svg.find('[data-fill-style-color="'+color+'"]').css({fill: new_color});
					svg.find('[data-stroke-style-color="'+color+'"]').css({stroke: new_color});
					svg.find('[data-stop-style-color="'+color+'"]').css({stopColor: new_color});
					
				},
				
				edit : function() {
					
					var _this = this,
						canvas = lumise.stage().canvas,
						active = canvas.getActiveObject(),
						svg = atob(active.src.split('base64,')[1]);
						
					$('#LumiseDesign').append(
						'<div id="lumise-svg-workspace">\
							<div id="lumise-svg-edit">'+
								svg.substr(svg.indexOf('<svg'))+'\
							</div>\
							<div data-view="zoom">\
								<i class="lumisex-android-search"></i> zoom <input type="range" min="100" max="300" value="100" />\
							</div>\
							<div id="lumise-svg-tool">\
								<ul data-view="nav">\
									<li data-func="save" title="'+lumise.i('save')+'"><i class="lumisex-android-done"></i></li>\
									<li data-func="reset" title="'+lumise.i('reset')+'"><i class="lumisex-android-refresh"></i></li>\
									<li data-func="cancel" title="'+lumise.i('cancel')+'"><i class="lumisex-android-close"></i></li>\
								</ul>\
								<h3>All colors</h3>\
								<div data-view="current-colors"></div>\
							</div>\
						</div>'
					);
					
					var svg = $('#lumise-svg-edit>svg');
					
					if (svg.attr('width')) {
						svg.attr('data-width', svg.attr('width'));
						svg.removeAttr('width');
					};
					
					if (svg.attr('height')) {
						svg.attr('data-height', svg.attr('height'));
						svg.removeAttr('height');
					};
					
					var w = svg.width(),
						h = svg.height();
						
					svg.on('click', function(e) {
				
						var allw = ['a', 'audio', 'canvas', 'circle', 'ellipse', 'foreignObject', 'g', 'iframe', 'image', 'line', 'mesh', 'path', 'polygon', 'polyline', 'rect', 'svg', 'switch', 'symbol', 'text', 'textPath', 'tspan', 'unknown', 'use', 'video'];
		
						if (allw.indexOf(e.target.tagName.toLowerCase()) > -1) {
							
							if ($('#lumise-svg-tool div[data-view="customize"]').length === 0) {
								$('#lumise-svg-tool>ul[data-view="nav"]').
									after(
										'<h3>Selection</h3>\
										<div data-view="customize">\
											<label>Fill:</label>\
											<div class="lumst" id="lumise-svg-fills">\
												<div id="lumise-svg-fills-custom"></div>\
											</div>\
										</div>\
										<div data-view="customize">\
											<label>Stroke:</label>\
											<div class="lumst" id="lumise-svg-strokes">\
												<div id="lumise-svg-strokes-custom"></div>\
											</div>\
										</div>'
									);
							}
							
							_this.render_fills(e.target);
							
						}
					});
					
					$('#lumise-svg-workspace input[type="range"]').on('input', function(){
						svg.css({
							'width': (w*(this.value/100))+'px', 
							'max-width': (w*(this.value/100))+'px', 
							'height': (h*(this.value/100))+'px',
							'max-height': (h*(this.value/100))+'px'
						});
					});
					
					$('#lumise-svg-tool ul li').on('click', function(e) {
						switch (this.getAttribute('data-func')) {
							case 'save' : 
							
								svg.removeAttr('style');
								svg.attr({width: svg.data('width'), height: svg.data('height')});
								svg.removeAttr('data-width');
								svg.removeAttr('data-height');
								
								var canvas = lumise.stage().canvas,
									active = canvas.getActiveObject(),
									colors = _this.getColors(svg),
									svg_html = svg.parent().html(),
									src = 'data:image/svg+xml;base64,'+btoa(svg_html);
								
								$('#lumise-svg-workspace').remove();
									
								if (active === undefined || active === null)
									return;
									
								active.set('fill', '');
								active.set('src', src);
								active.set('origin_src', src);
								delete active.j_object;
								active.colors = colors;
								active._element.src = src;
								active._originalElement.src = src;
								active._element.onload = function(){
									canvas.renderAll();	
									lumise.func.set_svg_colors(active);
								};
								
							break;
							case 'reset' : 
								$('#lumise-svg-workspace').remove();
								lumise.tools.svg.edit();
							break;
							case 'cancel' : 
								$('#lumise-svg-workspace').remove();
							break;
						}
					});
					
					this.renderColors();
					
				}
				
			}

		},

		stack : {

		    save : function() {

				if (lumise.ops.importing === true)
					return;

			    var stack = lumise.stage().stack,
			    	canvas = lumise.stage().canvas,
			    	apply = false;

				canvas.getObjects().map(function(obj){
					if (obj.evented === true && typeof obj.clipTo != 'function') {
						obj.set('clipTo', function(ctx){
							return lumise.objects.clipto(ctx, obj);
						});
						apply = true;
					}
				});

				if (apply) {
					canvas.renderAll();
					lumise.design.layers.build();
				}

				if (stack.data.length > 50)
					stack.data = stack.data.splice(stack.data.length-50);

				var current = lumise.tools.export(lumise.stage());
				
				current = JSON.parse(current);
				//store template info
				current['template'] = {
					stages : lumise.cart.template,
					price : lumise.cart.price.template
				};
				current = JSON.stringify(current);
				
				if (current != stack.data[stack.index]) {

					stack.data.splice(stack.index+1);

					stack.data.push(current);
					stack.index = stack.data.length - 1;

					lumise.get.el('design-redo').addClass("disabled");
					if (stack.data.length > 1)
						lumise.get.el('design-undo').removeClass("disabled");

				}else return;

                lumise.actions.do('stack:save:complete');

				if (stack.data.length > 1) {
					lumise.tools.save();
				}else{
					lumise.ops.before_unload = null;
				}
		    },

		    back : function(e) {

			    var stack = lumise.stage().stack,
			    	canvas = lumise.stage().canvas;

				if (stack.index > 0) {
					stack.state = false;
					var current = JSON.parse(stack.data[stack.index - 1]);
					lumise.tools.clear();
					lumise.tools.import(current, function (){
						lumise.func.update_state();
					});
					
					stack.index--;
					lumise.get.el('design-redo').removeClass("disabled");
				}

				if (stack.index === 0){
					lumise.get.el('design-undo').addClass("disabled");
				}

				if (e)e.preventDefault();

		    },

		    forward : function(e) {

			    var stack = lumise.stage().stack,
			    	canvas = lumise.stage().canvas;

				if (stack.data[stack.index + 1]) {
					stack.state = false;
					var current = JSON.parse(stack.data[stack.index + 1]);
					lumise.tools.clear();
					lumise.tools.import(current, function (){
						lumise.func.update_state();
					});
					stack.index++;
					lumise.get.el('design-undo').removeClass("disabled");
				}

				if (!stack.data[stack.index + 1]) {
					lumise.get.el('design-redo').addClass("disabled");
				}

				if (e)e.preventDefault();

		    }

		},

		get : {

			els : {},

			color : function(s){

				var color = lumise.get.el('product-color').find('li[data-color].choosed').data('color');

				if (!color)
					color = lumise.get.el('product-color').find('input.color').val();

				if (!color || color === '') {
					color = lumise.get.el('product-color').find('li[data-color]').
							first().addClass('choosed').data('color');
				}

				if (!color)
					color = '#546E7A';

				return (s != 'invert' ? color : lumise.func.invert(color));

			},
			
			color_name : function(s){

				var elm = lumise.get.el('product-color').find('li[data-color].choosed');
				return ( !elm.get(0) )? '': elm.attr('title');
				
			},

			scroll : function() {
				return {
					top: (lumise.body.scrollTop?lumise.body.scrollTop:lumise.html.scrollTop),
					left: (lumise.body.scrollLeft?lumise.body.scrollLeft:lumise.html.scrollLeft)
				}
			},

			active : function() {
				return lumise.stage().canvas.getActiveObject() || lumise.stage().canvas.getActiveGroup();
			},

			stage : function() {
				return {
					stage: lumise.stage(),
					canvas: lumise.stage().canvas,
					active: lumise.stage().canvas.getActiveObject(),
					limit: lumise.stage().limit_zone
				}
			},

			el : function(s) {

				if (!lumise.get.els[s])
					lumise.get.els[s] = $('#lumise-'+s);

				return lumise.get.els[s];

			},

		},

		func : {

			invert : function(color) {

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

			reversePortView : function(eff){
				
				var stage = lumise.stage(),
					canvas = stage.canvas,
					view = canvas.viewportTransform,
					m = lumise.get.el('stage-'+lumise.current_stage).get(0),
					ratio = lumise.get.el('zoom').val()/100,
					wr = ((m.offsetWidth*ratio)/100),
					hr = ((m.offsetHeight*ratio)/100),
					p = {
						w: (stage.product.width*ratio),
						h: (stage.product.height*ratio),
						l: (stage.product.left-(stage.product.width/2))*ratio,
						t: (stage.product.top-(stage.product.height/2))*ratio,
					},
					w = {
						w: m.offsetWidth,
						h: m.offsetHeight
					},
					_rw = p.w/w.w > 1 ? p.w/w.w : 1,
					_rh = p.h/w.h > 1 ? p.h/w.h : 1;
					
		        if (ratio > 1){
			        lumise.get.el('zoom-thumbn').css({opacity:1}).find('span').css({
						width: '100px',
						height: (w.h/p.h < 1 ? (w.h/p.h)*100 : 100 )+'px',
						left: '0px',
						top: -(view[5]/hr)+'px'
					});
				}else lumise.get.el('zoom-thumbn').css({opacity:0});

		        var anicfg = {
			        x: view[4] > 0 ? 0 : ((view[4] > -p.l && p.w > w.w) ? -p.l : (
			        	view[4] < -(canvas.width*view[0] - canvas.width) ?
			        	-(canvas.width*view[0] - canvas.width) :
			        	view[4])
			        ),
			        y: view[5] > 0 ? 0 : ((view[5] > -p.t && p.h > w.h) ? -p.t : (
			        	view[5] < -(canvas.height*view[0] - canvas.height) ?
			        	-(canvas.height*view[0] - canvas.height) :
			        	view[5])
			        )
			    };

			    anicfg.x = -((canvas.width*view[0])-canvas.width)/2;

			    if (anicfg.x == view[4] && anicfg.y == view[5])
			    	return true;

		        if (eff !== false) {
			        $({
				        x: view[4],
				        y: view[5]
				    }).stop().animate(anicfg, {
					    step: function(val, obj) {
						    view[obj.prop == 'x' ? 4 : 5] = val;
						    canvas.set('viewportTransform', view);
						    canvas.renderAll();
							lumise.get.el('zoom-thumbn').find('span').css({top: -(val/hr)+'px'});
					    },
					    duration: 200
					});
				}else{
					view[4] = anicfg.x;
					view[5] = anicfg.y;
					canvas.set('viewportTransform', view);
					canvas.renderAll();
					lumise.get.el('zoom-thumbn').find('span').css({top: -(anicfg.y/hr)+'px'});
				}

				return false;

			},

			onZoomThumnMove : function(e) {

		        var ratio = lumise.get.el('zoom').val()/100,
					m = lumise.get.el('main').get(0),
		        	delta = new fabric.Point(-e.movementX*((m.offsetWidth*ratio)/100), -e.movementY*((m.offsetHeight*ratio)/100));

				lumise.stage().canvas.relativePan(delta);
				lumise.func.reversePortView(false);

			},

			notice : function(content, type, delay) {

				var i = 'bulb';
				switch (type) {
					case 'success': i = 'done'; break;
					case 'error': i = 'close'; break;
				};

				var el = lumise.get.el('notices');
				clearTimeout(lumise.ops.notice_timer);

				if (el.data('working')) {
					el.stop()
					.append('<span data-type="'+type+'"><i class="lumisex-android-'+i+'"></i> '+content+'</span>')
					.animate({opacity: 1, top: 55}, 250);
				}else{
					el.data({'working': true}).stop()
					.html('<span data-type="'+type+'"><i class="lumisex-android-'+i+'"></i> '+content+'</span>')
					.css({opacity: 0, top: 0, display: 'block'})
					.animate({opacity: 1, top: 55}, 250);
				}

				lumise.ops.notice_timer = setTimeout(function(){
					el.animate({top: 0, opacity: 0}, 250, function(){
						this.style.display = 'none';
						el.data({'working': false});
					});
				},(delay ? delay : 1500), el);

			},

			bridgeText : function(image, ops) {

				if (!ops)
					ops = {
						curve: -2.5,
						offsetY: 0.4,
						bottom: 2.5,
						trident: false,
						oblique: false
					};
				
			    var s = lumise.get.stage(),
			    	w = image.width,
			    	h = image.height*2.5,

				    curve = ops.curve !== undefined ? (ops.curve/2)*image.height : -0.3*image.height,
				    top = ops.offsetY !== undefined ? ops.offsetY*image.height : 0.5*image.height,
				    bottom = ops.bottom !== undefined ? ops.bottom*image.height : 0.2*image.height,
				    trident = ops.trident !== undefined ? ops.trident: false,
				    d, i = w, y = 0, angle = (ops.oblique === true ? 45 : 180) / w;

				if (ops.oblique === true)
					trident = false;

				if (lumise.ops.brid === undefined) {
					lumise.ops.brid = document.createElement('canvas');
					lumise.ops.bctx = lumise.ops.brid.getContext('2d');
				}

				lumise.ops.brid.width = w;
				lumise.ops.brid.height = h;

			    lumise.ops.bctx.clearRect(0, 0, w, h);

			    if (trident) {
			    	y = bottom;
			    	d = (curve) / (h*0.25);
			    	if ((d*w*0.5) > bottom) {
					    d = bottom/(w*0.5);
				    }
			    }else if (ops.oblique){
				    if (curve > bottom+(h*0.25))
			   		 	curve = bottom+(h*0.25);
			    }else{
				    if (curve > bottom)
			   		 	curve = bottom;
			    }

			    while (i-- > 0) {

			        if (trident) {

			            if (i >(w * 0.5))
			            	 y -= d;
						else y += d;

			        } else {
			            y = bottom - curve * Math.sin(i * angle * Math.PI / 180);
			        }

			        lumise.ops.bctx.drawImage(
			        	image,
			        	i, 0, 1, h,
			            i, h * 0.5 - top / h * y, 1, y
			        );
			    }

				return lumise.ops.brid.toDataURL();

			},

			update_text_fx : function() {
				
				var s = lumise.get.stage();

				if (!s.active)
					return;

				$('div#LumiseDesign').attr({'data-processing': 'true', 'data-msg': 'Processing..'});

				var props = s.active.toObject(lumise.ops.export_list);
				delete props['type'];
				var newobj = lumise.objects.text(props);
				props.width = newobj.width;
				props.height = newobj.height;

				lumise.objects.lumise['text-fx'](props, lumise.func.switch_type);

			},

			image_fx : function(img, fx, callback){

				if (
					fx.mask &&
					fx.mask.dataURL &&
					(fx.mask.image === undefined || fx.mask.image.src === undefined)
				) {
					
					fx.mask.image = new Image();
					fx.mask.image.onload = function(){
						lumise.func.image_fx(img, fx, callback);
					};

					if (
						fx.mask.dataURL.indexOf('http') !== 0 &&
						fx.mask.dataURL.indexOf('data:image/') !== 0
					)fx.mask.dataURL = lumise.data.upload_url+fx.mask.dataURL;

					return fx.mask.image.src = fx.mask.dataURL;
				}

				var cfg = $.extend({
					fx: '',
					brightness: 0,
					saturation: 100,
					contrast: 0,
					deep: 0,
					mode: 'light',
					mask: null
				}, fx);

				if (cfg.brightness !== 0)
					cfg.brightness /= 2;

				if (!lumise.ops.imageFXcanvas) {
					lumise.ops.imageFXcanvas = document.createElement('canvas');
					lumise.ops.fxctx = lumise.ops.imageFXcanvas.getContext("2d");
				};

				var cv = lumise.ops.imageFXcanvas,
					ctx = lumise.ops.fxctx,
					w = img.width,
					h = img.height;

				cv.width = w;
				cv.height = h;

				ctx.clearRect(0, 0, w, h);

				if (cfg.mask !== null && cfg.mask.image) {
					ctx.drawImage(cfg.mask.image, cfg.mask.left*w, cfg.mask.top*h, cfg.mask.width*w, cfg.mask.height*h);
					ctx.globalCompositeOperation = 'source-in';
				};
				
				ctx.drawImage(img, 0, 0, w, h);

				if (fx.crop) {
					ctx.clearRect(0, 0, w, h*fx.crop.top);
					ctx.clearRect(0, 0, w*fx.crop.left, h);
					ctx.clearRect((w*fx.crop.left)+(w*fx.crop.width), 0, w, h);
					ctx.clearRect(0, (h*fx.crop.top)+(h*fx.crop.height), w, h);
				};

				var imageData = ctx.getImageData(0, 0, w, h);
				var data = imageData.data;

				if (cfg.fx !== '' && lumise_fx_map[cfg.fx])
					cfg.fx = lumise_fx_map[cfg.fx]();

				var R, G, B, CT, brightness;

				var rfx, gfx, bfx;

				var vgrid = 0;

				for (var i = 0; i < data.length; i += 4) {

					if (typeof cfg.fx == 'object') {

						data[i] = cfg.fx.r[ data[i] ];
						data[i+1] = cfg.fx.g[ data[i+1] ];
						data[i+2] = cfg.fx.b[ data[i+2] ];

					};

					brightness = (0.4 * (data[i] + cfg.brightness)) + (0.4 * (data[i+1] + cfg.brightness)) + (0.2 * (data[i+2] + cfg.brightness));

					brightness *= ( 1 - cfg.saturation/100 );

					R = brightness + data[i]*( cfg.saturation/100 ) + cfg.brightness;
					G = brightness + data[i+1]*( cfg.saturation/100 ) + cfg.brightness;
					B = brightness + data[i+2]*( cfg.saturation/100 ) + cfg.brightness;

					if( cfg.contrast != 0 ) {

						CT = 1 + (cfg.contrast*0.01);
						R /= 255;
						G /= 255;
						B /= 255;

						R = (((R - 0.5) * CT) + 0.5) * 255;
						G = (((G - 0.5) * CT) + 0.5) * 255;
						B = (((B - 0.5) * CT) + 0.5) * 255;

						R = R > 255 ? 255 : R;
						R = R < 0 ? 0 : R;

						G = G > 255 ? 255 : G;
						G = G < 0 ? 0 : G;

						B = B > 255 ? 255 : B;
						B = B < 0 ? 0 : B;

					};

					data[i] = R;
					data[i+1] = G;
					data[i+2] = B;

					if (cfg.deep > 0) {

						if (cfg.mode != 'dark') {
							if (255-R < cfg.deep && 255-G < cfg.deep && 255-B < cfg.deep) {
								data[i+3] = ((((255-R)/cfg.deep) + ((255-G)/cfg.deep) + ((255-B)/cfg.deep))/3);
								data[i+3] = (data[i+3]>0 ? data[i+3]*100 : 0);
							}
						}else{
							if (R < cfg.deep && G < cfg.deep && B < cfg.deep) {
								data[i+3] = (((R/cfg.deep) + (G/cfg.deep) + (B/cfg.deep))/3);
								data[i+3] = (data[i+3]>0 ? data[i+3]*100 : 0);
							}
						}
					}

				};

				ctx.putImageData( imageData, 0 , 0 );
				return callback(cv.toDataURL(), lumise.func.count_colors(cv, true));

			},

			update_image_fx : function(fx, val, callback) {

				var s = lumise.get.stage();

				if (!s.active)
					return;

				$('div#LumiseDesign').attr({'data-processing': 'true', 'data-msg': 'Processing..'});
				
				clearTimeout(lumise.ops.update_image_fx_timer);
				
				lumise.ops.update_image_fx_timer = setTimeout(function(){
					
					if (!s.active.fxOrigin || !s.active.fxOrigin.tagName) {
						s.active.fxOrigin = s.active._originalElement.cloneNode(true);
					}
					if (s.active.fx === undefined)
						s.active.fx = {};
					
					if (fx !== undefined)
						s.active.fx[fx] = val;
					
					lumise.func.image_fx(s.active.fxOrigin, s.active.fx, function(cdata, colors){

						s.active._element.src = cdata;
						s.active._originalElement.src = cdata;
						s.active.colors = colors;

						s.active._element.onload = function() {
							s.canvas.renderAll();
							$('div#LumiseDesign').attr({'data-processing': '', 'data-msg': ''});
							if (typeof callback == 'function')
								callback();
						}

					});

				}, 1);

			},

			fill_svg : function(data, color) {
				
				if (data.toString().indexOf('data:image/svg+xml;base64,') === -1)
					return data;

				var svg = atob(data.split(',')[1]),
					span = $('<span>'+svg.substr(svg.indexOf('<svg'))+'</span>');
				
				if (color && color !== '')
					span.find('svg,path').attr({'fill': color});
					
				svg = 'data:image/svg+xml;base64,'+btoa(span.html());
				delete span;

				return svg;

			},
			
			set_svg_colors : function(obj) {
				
				if (obj.j_object === undefined) {
					var svg_source = obj.src.split('base64,')[1];
					svg_source = atob(svg_source);
					svg_source = svg_source.substr(svg_source.indexOf('<svg'));
					obj.j_object = $('<div>'+svg_source+'</div>');
				};
				
				var max = (lumise.get.el('svg-colors').parent().width()-180)/33,
					colors = lumise.tools.svg.getColors(obj.j_object),
					total = colors.length;
				
				if (max < 6)
					max = 6;
				else if (max > 15)
					max = 15;
				
				if (total === 0) {
					obj.j_object.find('svg>*').css({fill: '#000000'});
					colors = lumise.tools.svg.getColors(obj.j_object);
				};
				
				obj.colors = colors.slice();
				colors.splice(max);
				
				lumise.get.el('svg-colors').find('>span').remove();
				
				colors.map(function(c){
					lumise.get.el('svg-colors').append(
						'<span data-view="noicon" data-color="'+c+'"><input type="text" data-color="'+c+'" readonly value="" style="background:'+c+'" /></span>'
					);
				});
				
				if (total > colors.length) {
					lumise.get.el('svg-colors').append('<span data-view="more">+'+(total-colors.length)+'</span>');
				};
				
				lumise.get.el('svg-colors').append('<span data-view="btn" data-tip="true"><i class="lumisex-wand" data-func="editor"></i><span>'+lumise.i(138)+'</span></span>');
					
			},
			
			switch_type : function(newobj) {

				var s = lumise.get.stage();

				if (newobj !== null) {
					lumise.ops.importing = true;
					var index = s.canvas.getObjects().indexOf(s.active);
					s.canvas.remove(s.active);
					s.canvas.add(newobj);
					newobj.moveTo(index);
					s.canvas.setActiveObject(newobj).renderAll();
					lumise.get.el('top-tools').attr({'data-view': newobj.type});
					lumise.design.layers.build();
					lumise.ops.importing = false;
				}else{
					alert(lumise.i(19));
				}

				$('div#LumiseDesign').attr({'data-processing': '', 'data-msg': ''});

			},

			download : function(data, name) {
				
				lumise.func.dataURL2Blob(data, function(blob) {
					if ("webkitAppearance" in document.body.style === false) {
						lumise.func.notice('After saving the download file, change the file type to .'+name.split('.')[1].toUpperCase(), 'notice', 5000);
						return window.open(URL.createObjectURL(blob));
					};
					var a = document.createElement('a');
					a.download = name;
					a.href = URL.createObjectURL(blob);
					a.click();
					URL.revokeObjectURL(a.href);
					delete a;
				});
				
			},

			dataURL2Blob : function(dataURL, callback) {

				callback(this.url2blob(dataURL));

			},

			process_files: function(files) {

				var tmpl = '', file, reader  = {};
				
				for (f in files) {
					
					if (typeof files[f] != 'object')
						return;
					
					if (files[f].type.indexOf('image/') !== 0)
						return lumise.func.notice(lumise.i('148'), 'error', 5000);
						
					file = files[f];

					reader[f] = new FileReader();
					reader[f].f = f;
					reader[f].file = file;
					reader[f].addEventListener("load", function () {
						
						if (
							!isNaN(lumise.data.min_upload) && 
							lumise.data.min_upload > 0 &&
							reader[this.f].file.size/1024 < lumise.data.min_upload
						) {
							lumise.func.notice(lumise.i('147')+' '+(reader[this.f].file.size/1024).toFixed(2)+'KB (Minimum '+lumise.data.min_upload+'KB)', 'error', 8000);
							delete reader[this.f];
							return;
						};
						
						if (
							!isNaN(lumise.data.max_upload) && 
							lumise.data.max_upload > 0 &&
							reader[this.f].file.size/1024 > lumise.data.max_upload
						) {
							lumise.func.notice(lumise.i('147')+' '+(reader[this.f].file.size/1024).toFixed(2)+'KB (Maximum '+lumise.data.max_upload+'KB)', 'error', 8000);
							delete reader[this.f];
							return;
						};
						
						
						var id = parseInt(reader[this.f].file.lastModified/1000).toString(36);

						id = parseInt((new Date().getTime()/1000)).toString(36)+':'+id;
						
						var url_data = this.result,
							img_opt = {
								url: url_data,
								type: reader[this.f].file.type,
								size: reader[this.f].file.size,
								name: reader[this.f].file.name.replace(/[^0-9a-zA-Z\.\-\_]/g, "").trim().replace(/\ /g, '+')
							};
						
						if (url_data.indexOf('data:image/svg+xml;base64,') === 0) {
							
							var wrp = $('<div>'+atob(url_data.split('base64,')[1]).replace('viewbox=', 'viewBox=')+'</div>'),
								svg = wrp.find('svg').get(0),
								vb = svg.getAttribute('viewBox').trim().split(' ');
							
							if (!svg.getAttribute('width'))
								svg.setAttribute('width', '1000px');
							
							if (!svg.getAttribute('height'))
								svg.setAttribute('height', (1000*(parseFloat(vb[3])/parseFloat(vb[2])))+'px');
								
							wrp.find('[id]').each(function(){
								this.id = this.id.replace(/[\u{0080}-\u{FFFF}]/gu,"");
							});
							
							img_opt.url = 'data:image/svg+xml;base64,'+btoa(wrp.html());
							
							new lumise.cliparts.import(id, img_opt, 'prepend');
							
						} else new lumise.cliparts.import(id, img_opt, 'prepend');
				    	
				    	delete reader[this.f];

					}, false);

					reader[f].readAsDataURL(file);

				};

			},

			preset_import : function(data, el, pos) {
				
				var stage = lumise.stage();

				$('div#LumiseDesign').attr({'data-processing': 'true', 'data-msg': 'Loading..'});

				pos = $.extend({
					width: stage.limit_zone.width*0.8,
					left: stage.limit_zone.left + (stage.limit_zone.width/2),
					top: stage.limit_zone.top + (stage.limit_zone.height/2)
				}, pos);

				data.map(function(d, i) {

					if (d.type == 'upload')
						d.type = 'image';
					
					if (d.id) {
						if (lumise.cliparts.uploads[d.id])
							d.url = lumise.cliparts.uploads[d.id];
						else if (lumise.cliparts.storage[d.id])
							d.url = lumise.cliparts.storage[d.id];
					}
					
					if (d.type == 'shape')
						d.url = 'data:image/svg+xml;base64,'+btoa(el.innerHTML.trim());

					if (d.text && !d.name)
						d.name = d.text.substr(0, 30);

					if (d.url){
						if (d.url.indexOf('data:image/svg+xml;base64,') > -1 || d.url.split('.').pop().trim() == 'svg') {
							d.type = 'svg';
						}else d.type = 'image';
						d.src = d.url;
						delete d.url;
					}
					
					if (d.font !== undefined && decodeURIComponent(d.font) != d.font)
						d.font = JSON.parse(decodeURIComponent(d.font));
					
					Object.keys(pos).map(function(i){
						if (['left', 'top'].indexOf(i) > -1 && d[i] !== undefined)
							d[i] += pos[i];
						else if (d[i] === undefined)
							d[i] = pos[i];
					});

					if (!d.name)
						(d.name = d.url && d.url.indexOf('data:image') === -1) ?
							d.url.split('/').pop() :
							(d.type == 'svg' ? 'New SVG' : 'New Image');

					if (d.type == 'i-text') {
						d.fill = lumise.get.color('invert');
					}else if (d.type == 'text-fx') {
						d.fill = lumise.get.color('invert');
					}

					delete d.save;
					data[i] = d;

				});

				lumise.tools.import ({objects: data}, function(){
					lumise.get.el('x-thumbn-preview').hide();
					setTimeout(function(){
						stage.canvas.setActiveObject(stage.canvas._objects[stage.canvas._objects.length-1]);
						lumise.tools.save();
					}, 10);
				});

			},

			update_edit_zone : function(img, stage) {

				var ratio = stage.product.height/img.naturalHeight;

				if (ratio !== 1) {
					stage.limit_zone.set({
						height: stage.edit_zone.height*ratio,
						width: stage.edit_zone.width*ratio,
						left: (stage.edit_zone.left*ratio)+(stage.canvas.width/2),
						top: (stage.edit_zone.top*ratio)+(stage.canvas.height/2)
					});
				}

				if (img.naturalWidth > 600) {
					stage.product.set({
						width: 600,
						height: img.naturalHeight*(600/img.naturalWidth)
					});
				}else{
					stage.product.set({
						width: img.naturalWidth,
						height: img.naturalHeight*(600/img.naturalWidth)
					});
				}
				stage.canvas.renderAll();
			},

			ctrl_btns : function(opts) {
				
				if (!opts.e)
					return false;

				var target = opts.target,
					canvas = lumise.stage().canvas,
					active = canvas.getActiveObject(),
					group = canvas.getActiveGroup(),
					corner = target._findTargetCorner(canvas.getPointer(opts.e, true));

				if (canvas.isDrawingMode === true)
					return;

				if (corner == 'tl') {

					lumise.stack.save();
					lumise.tools.discard();
						
					if (target._objects && target._objects.length > 0)
						target._objects.map(function(obj){
							canvas.remove(obj);
						});
					else canvas.remove(target);

					lumise.stack.save();

					lumise.design.layers.build();

					return true;

				}else if (corner == 'bl') {
					
					var canvas = lumise.stage().canvas,
						active = canvas.getActiveObject(),
						group = canvas.getActiveGroup(),
						do_clone = function(ids) {
							
							//lumise.tools.discard();
					
							//canvas.discardActiveGroup();
							//canvas.discardActiveObject();
							
							var clones = [];
							canvas.getObjects().map(function(obj){
								
								if (!obj.id || ids.indexOf(obj.id) === -1)
									return;
								
								var clone = obj.toJSON();
								delete clone.toClip;
								lumise.ops.export_list.map(function(l){
									clone[l] = obj[l];
								});
								
								clone.left = ((group ? group.left : 1)+obj.left)*1.1;
								clone.top = ((group ? group.top : 1)+obj.top)*1.1;
								clone.thumbn = obj.thumbn;
	
								clone.id = parseInt(new Date().getTime()/1000).toString(36)+':'+Math.random().toString(36).substr(2);
								
								clones.push(clone);
								
							});
							
							lumise.tools.import ({objects: clones}, function(){});
							
						};
						
					if (active) {
						
						do_clone([active.id]);

					}else if(group){
						
						var ids = [];
						group._objects.map(function(o){
							if (o.id && ids.indexOf(o.id) === -1)
								ids.push(o.id);
						});
						do_clone(ids);
						
						return true;
						// && confirm(lumise.i('05'))
						var clones = [];
							
						group._objects.map(function(obj){
							delete obj.clipTo;
							clones.push(obj.clone() ? obj.clone() : obj);
						});
						
						var new_group = new fabric.Group(clones, {
							left: group.left,
							top: group.top,
							scaleX: group.scaleX*5,
							scaleY: group.scaleY*5,
						});

						var ops = {
								left: group.left,
								top: group.top,
								height: group.height,
								width: group.width,
								scaleX: group.scaleX,
								scaleY: group.scaleY,
								angle: group.angle,
								name: 'Group objects',
								text: 'Group objects',
								src: new_group.toDataURL()
							};

						new_group.set('scaleX', new_group.scaleX/5);
						new_group.set('scaleY', new_group.scaleY/5);

						lumise.objects.lumise.image(ops, function(obj){

							var index = canvas.getObjects().indexOf(group._objects[0]);

							lumise.stage().canvas.discardActiveGroup();

							group._objects.map(function(c){
								canvas.remove(c);
							});

							canvas.add(obj);
							obj.moveTo(index);

							lumise.stack.save();
							lumise.design.layers.build();

						});

					}

					return true;

				}

			},

			navigation : function(el, e) {
				
				$('[data-navigation="active"]').attr({'data-navigation': ''});
				
				if (el === 'clear' || $(el).hasClass('active')){
					if(
						el !== 'clear' &&
						typeof e !== 'undefined' &&
						el.getAttribute('data-tool') === 'cart' &&
						e.target.getAttribute('data-func') === 'remove'
					){
						$(el).closest('[data-navigation]').attr({'data-navigation': 'active'});
						return;
					}
					
					lumise.e.main.find('li[data-tool].active').removeClass('active');
				}else{
					
					if(el.getAttribute('data-tool') === 'languages' && !lumise.data.switch_lang) return;
					
					lumise.e.main.find('li[data-tool].active').removeClass('active');
					$(el).addClass('active');
					$(el).closest('[data-navigation]').attr({'data-navigation': 'active'});
				}
			},

			set_cookie : function(cname, cvalue, exdays) {

			    var d = new Date();
			    if (!exdays)
			    	exdays = 365;

			    d.setTime(d.getTime() + (exdays*24*60*60*1000));
			    var expires = "expires="+ d.toUTCString();
			    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

			},

			get_cookie : function(cname) {

			    var name = cname + "=";
			    var decodedCookie = decodeURIComponent(document.cookie);
			    var ca = decodedCookie.split(';');
			    for(var i = 0; i <ca.length; i++) {
			        var c = ca[i];
			        while (c.charAt(0) == ' ') {
			            c = c.substring(1);
			        }
			        if (c.indexOf(name) == 0) {
			            return c.substring(name.length, c.length);
			        }
			    }

			    return "";

			},

			getTextWidth : function(op, callback) {
				
				if (!document.fonts) {
					return;	
				}
				
				document.fonts.load(op.size+'px "'+op.family+'"', op.text).then(function(){

				    var canvas = lumise.ops.getTextWidthCanvas || (lumise.ops.getTextWidthCanvas = document.createElement("canvas"));
				    var context = canvas.getContext("2d");
				    context.font = op.size+'px '+op.family;
				    var metrics = context.measureText(op.text);

				    callback (metrics);

				});

			},

			url2blob : function(dataURL) {

				if(typeof dataURL !== 'string'){
			        throw new Error('Invalid argument: dataURI must be a string');
				}

			    dataURL = dataURL.split(',');

				var binStr = atob(dataURL[1]),
					len = binStr.length,
					arr = new Uint8Array(len);

				for (var i = 0; i < len; i++) {
					arr[i] = binStr.charCodeAt(i);
				}

				return new Blob([arr], {
					type: dataURL[0].substring(dataURL[0].indexOf('image/'), dataURL[0].indexOf(';')-1)
				});
			},

			createThumbn : function(ops) {

				var img = new Image();
		    		img.onload = function(){

			    		var cv = lumise.ops.creatThumbnCanvas ?
			    				 lumise.ops.creatThumbnCanvas :
			    				 lumise.ops.creatThumbnCanvas = document.createElement('canvas');

			    		cv.width = ops.width;
			    		cv.height = ops.height;
			    		var ctx = cv.getContext('2d'),
			    			w = this.naturalHeight*(cv.width/this.naturalWidth) >= cv.height ?
			    				cv.width : this.naturalWidth*(cv.height/this.naturalHeight),
			    			h = w == cv.width ? this.naturalHeight*(cv.width/this.naturalWidth) : cv.height,
			    			l = w == cv.width ? 0 : -(w-cv.width)/2,
			    			t = h == cv.height ? 0 : -(h-cv.height)/2;

			    		ctx.fillStyle = ops.background? ops.background : '#eee';
						ctx.fillRect(0, 0, cv.width, cv.height);
			    		ctx.drawImage(this, l, t, w, h);

			    		ops.callback(cv);

		    		};
		    		
		    	img.src = ops.source;

			},

			get_blob : function(url, callback) {

				var xhr = new XMLHttpRequest();

				xhr.open("GET", url, true);
				xhr.responseType = "blob";
				xhr.overrideMimeType("text/plain;charset=utf-8");
				xhr.onload = function(){
					var a = new FileReader();
				    a.onload = callback;
				    a.readAsDataURL(this.response);
				};
				xhr.onreadystatechange = function (e) {  
				    if (xhr.readyState === 4 && xhr.status !== 200)
				        callback(1);
				};
				
				xhr.send(null);

			},

			count_colors : function(url, callback) {

				if (!lumise.ops.count_colors_canvas)
					lumise.ops.count_colors_canvas = document.createElement('canvas');

				var toHex = function(c) {
					    var hex = c.toString(16);
					    return hex.length == 1 ? "0" + hex : hex;
					},
					nearest = function(x, a) {
						return Math.floor(x / (255 / a)) * (255 / a);
					},
					process = function(img, w, h) {

						lumise.ops.count_colors_canvas.width = w;
						lumise.ops.count_colors_canvas.height = h;

						var stats = [],
							ctx = lumise.ops.count_colors_canvas.getContext("2d");

						ctx.drawImage(img, 0, 0, w, h);

						// get bitmap
						var idata = ctx.getImageData(0, 0, w, h),
							data = idata.data;

						for (var i = 0; i < data.length; i += 4) {

						    data[i]     = nearest(data[i],     8);
						    data[i + 1] = nearest(data[i + 1], 8);
						    data[i + 2] = nearest(data[i  +2], 4);

							c = '#'+toHex(data[i])+toHex(data[i+1])+toHex(data[i+2]);
							if (stats.indexOf(c) === -1)
								stats.push(c);

						}

						return stats;

					};

				if (callback === true)
					return process(url, url.width/10, url.height/10);

				var img = new Image();

				img.cb = callback;
				img.onload = function(){

					var w = this.naturalWidth/5,
					    h = this.naturalHeight/5,
					    stats = [],
					    nearest = function(x, a) {
						    return Math.floor(x / (255 / a)) * (255 / a);
						};

					if (typeof this.cb == 'function')
						this.cb(process(this, w, h));

					delete this;

				};

				img.src = url;

			},

			update_state : function() {

				var states = {}, objs = [], html = [], colors = [], c;
				Object.keys(lumise.data.stages).map(function(s){

					var scolors = [], image = 0, text = 0, clipart = 0, shape = 0, upload=0;
					
					objs = [];
					
					if (lumise.data.stages[s].canvas)
						objs = lumise.data.stages[s].canvas.getObjects();
					else if (lumise.data.stages[s].data && lumise.data.stages[s].data.objects)
						objs = lumise.data.stages[s].data.objects;

					if (objs.length > 0) {
						objs.map(function(o){
							if (o && o.evented) {

								if (o.colors && o.colors.length > 0) {
									o.colors.map(function(c){
										
										c = lumise.tools.svg.rgb2hex(c);
										
										if (colors.indexOf(c) === -1) {
											colors.push(c);
											html.push('<li data-source="obj" style="background:'+c+'"></li>');
										}
										if (scolors.indexOf(c) === -1)
											scolors.push(c);
									});
								}
								//stage colors
								if (o.stroke !== '' && o.type != 'svg') {
									
									c = lumise.tools.svg.rgb2hex(o.stroke);
									
									if(colors.indexOf(o.stroke) === -1){
										colors.push(o.stroke);
										html.push('<li data-source="stroke" style="background:'+c+'"></li>');
									}
									if(scolors.indexOf(c) === -1)
										scolors.push(c);
									
								};
								
								if (o.fill !== '' && o.type != 'svg') {
									
									c = lumise.tools.svg.rgb2hex(o.fill);
									
									if(colors.indexOf(c) === -1){
										colors.push(c);
										html.push('<li data-source="fill" style="background:'+c+'"></li>');
									}
									if(scolors.indexOf(c) === -1)
										scolors.push(c);
								};

								if (typeof o.resource !== 'undefined') {
									switch (o.resource) {
										case 'cliparts':
											clipart++;
											break;
										case 'shape':
											shape++;
											break;
										default:
											
									}
								} else {
									switch (o.type) {
										case 'image':
										case 'image-fx':
										case 'qrcode':
											image++;
											break;
										
										case 'path':
											shape++;
											break;
										case 'i-text':
										case 'text-fx':
										case 'curvedText':
											text++;
											break;
										default:
											
									}
								}

							}
						});
					}

					states[s] = {
						colors: scolors,
						images: image,
						shape: shape,
						clipart: clipart,
						text: text
					}

				});
				
				
				if (html.length > 6) 
					html.push('<li> &nbsp; '+(colors.length-6)+'<li>');
				
				$('#lumise-count-colors').html('<ul>'+html.join('')+'</ul>');

				lumise.actions.do('updated', states);

				return states;

			},

			export : function(save, id) {
				
				// Editing design before add to cart
				var data = {
						stages : {},
						type : lumise.data.type,
						color: lumise.get.color(),
						updated: new Date().getTime()/1000,
						name : ($('#lumise-product header name t').text()+'-'+$('#lumise-stage-nav li.active').attr('data-stage')).replace(/\n/g, '').trim(),
						id: id !== undefined ? id : lumise.data.editing
					},
					thumbn = {
						screenshots: [],
						color: lumise.get.color(),
						name: data.name,
						updated: data.updated,
						id: id !== undefined ? id : lumise.data.editing
					};

				lumise.get.el('stage-nav').find('li[data-stage]').each(function(){

					var s = this.getAttribute('data-stage'),
						stage = lumise.data.stages[s];

					if (!stage)
						return;

					if (stage.canvas) {
						
						var view_port = stage.canvas.viewportTransform;
						
						stage.canvas.set('viewportTransform', [1, 0, 0, 1, 0, 0]);
						
						data.stages[s] = {
							data : lumise.tools.export(stage),
							screenshot: lumise.tools.toImage({
								stage: stage,
								is_bg: (save == 'cart' || save == 'share') ? 'full' : false, 
								multiplier: 1/window.devicePixelRatio
							}),
							edit_zone: stage.edit_zone,
							image: stage.image,
							overlay: stage.overlay,
							updated: data.updated,
							product_width: stage.product_width,
							product_height: stage.product_height,
							devicePixelRatio: window.devicePixelRatio
						};
						
						stage.canvas.set('viewportTransform', view_port);
						stage.canvas.renderAll();
						
						if ($(this).hasClass('active'))
							thumbn.screenshots.push(data.stages[s].screenshot);
							
					}else if (stage.data) {
						
						data.stages[s] = {
							data : JSON.stringify(stage.data),
							screenshot: stage.screenshot,
							edit_zone: stage.edit_zone,
							image: stage.image,
							overlay: stage.overlay,
							updated: data.updated
						};
						
						if ($(this).hasClass('active'))
							thumbn.screenshots.push(stage.screenshot);
					}

				});
				
				if (
					lumise.ops.first_completed === true && 
					lumise.func.url_var('order_print', '') === '' &&
					(save === true || save == 'designs' || save == 'share')
				) {
					
					//store template info before save
					data['template'] = {
						'stages' : lumise.cart.template,
						'price' : lumise.cart.price.template
					};
					
					// Mark cart changed
					var cart_id = lumise.func.url_var('cart', '');
					
					if (save == 'designs') {
						
						data.stages = {
							'lumise': data.stages[$('#lumise-stage-nav li.active').attr('data-stage')]
						};
						
						try {
							lumise.indexed.save([thumbn, data], 'designs', function(){
								lumise.actions.do('save-mydesign', data);
							});
						}catch (ex){console.log(ex);}
						
					} else if (cart_id !== '') {
						
						lumise.actions.do('cart-changed', data);
						
						/*
							// Auto save design of cart item editting
							data.id = cart_id;
							lumise.indexed.save([data], 'cart');
						*/
						
					}else if (save == 'share'){
						
						return data;
			    	
			    	} else {
						
						data.id = lumise.data.product;
						
						try {
							lumise.indexed.save([data], 'drafts', function(){
								lumise.actions.do('draft-autosaved', data);
								lumise.func.set_url('draft', 'yes');
							});
						}catch (ex){
							console.log(ex);
						}
			    	
			    	};
			    	
			    	delete lumise.ops.designs_loading;
		    		delete lumise.ops.designs_cursor;
		    		
		    		if (typeof save == 'function') {
			    		save(data, thumbn);
		    		};
		    		
		    		delete data;
		    		delete thumbn;
			    	
			    	lumise.get.el('navigations').find('li[data-tool="designs"]').attr({'data-load': 'designs'});
			    	
				};

				return data;

			},

			set_url : function(name, val) {

				var url = window.location.href;

				url = url.split('#')[0].split('?');

				if (url[1]) {

					var ur = {};

					url[1].split('&').map(function(s){
						s = s.split('=');
						ur[s[0]] = s[1];
					});

					url[1] = [];

					if (val === null)
						delete ur[name];
					else ur[name] = val;

					Object.keys(ur).map(function(s){
						url[1].push(s+'='+ur[s]);
					});

					url = url[0]+'?'+url[1].join('&');

				}else if(val !== null) url = url[0]+'?'+name+'='+val;


				window.history.pushState({},"", url);

			},

			url_var : function(name, def) {

				var url = window.location.href.split('#')[0].split('?'),
					result = def;

				if (!url[1])
					return def;

				url[1].split('&').map(function(pam){
					pam = pam.split('=');
					if (pam[0] == name)
						result = pam[1];
				});

				return result;

			},

			date : function(f, t){
				
				if (t === undefined || t === '')
					return '';
				
				if (typeof t == 'string' && (t.indexOf('-') > -1 || t.indexOf(':') > -1))
					t = new Date(t);
				else if (t.toString().split('.')[0].length === 10)
					t = new Date(parseFloat(t)*1000);
				else t = new Date(parseFloat(t));

				var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
					days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
					map = {
						't': (t.getMonth() < 10 ? '0' : '')+(t.getMonth()+1),
						'h': t.getHours(),
						'm': t.getMinutes(),
						'd': t.getDate(),
						'D': days[t.getDay()],
						'M': months[t.getMonth()],
						'y': t.getYear(),
						'Y': t.getFullYear(),
					};
					str = '';


				f.split('').map(function(s){
					str += map[s] ? map[s] : s;
				});

				return str;

			},

			design_layer : function(id) {
				
				lumise.indexed.get(id, 'cart', function(res){
					
					var stage = res.stages[Object.keys(res.stages)[0]],
						ratio = 180/stage.product_height;
						img = '<img data-view="layer" style="height: 180px;width: '+(stage.product_width*ratio)+'px;" src="'+stage.screenshot+'" />';
						
					$('div[data-design-layer="'+id+'"]').html(img);
					
				});
			},
			
			font_blob : function(obj) {
				
				if (typeof obj.font == 'string' && obj.font.trim().indexOf('data:') === -1) {

					if (obj.font.indexOf('http') === -1)
						obj.font = lumise.data.upload_url+obj.font;
					
					lumise.func.get_blob(obj.font, function() {
						obj.set('font', this.result);
						lumise.tools.save();
					});

				}
			
			},
			
			enjson : function(str) {
				return btoa(encodeURIComponent(JSON.stringify(str)));
			},
			
			dejson : function(str) {
				return JSON.parse(decodeURIComponent(atob(str)));
			},
			
			slugify : function(text) {
				
			  var a = 'àáạäâãấầẫậạăắằẵặèéëêếềễẹệìíĩïîịòóöôốồỗộọùúüûũụùúũđñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;',
			  	  b = 'aaaaaaaaaaaaaaaaeeeeeeeeeiiiiiiooooooooouuuuuuuuudncsyoarsnpwgnmuxzh------',
			  	  p = new RegExp(a.split('').join('|'), 'g');
			
			  return text.toString().toLowerCase()
					.replace(/\s+/g, '-')
					.replace(p, function(c) {return b.charAt(a.indexOf(c));}) 
					.replace(/&/g, '-and-')
					.replace(/[^\w\-]+/g, '')
					.replace(/\-\-+/g, '-')
					.replace(/^-+/, '')
					.replace(/-+$/, '');

			},
			
			pimage : function(stages) {
				
				for(var s in stages) {
					if (!stages[s].image) {
						stages[s].image = (
							stages[s].source == 'raws' ? 
							lumise.data.assets+'raws/' : 
							lumise.data.upload_url
						)+stages[s].url;
					}
				}
				
				return stages;
				
			},
			
			price : function(p) {
				let price = this.number_format(
					parseFloat(p*1),
					parseInt(lumise.data.number_decimals),
					lumise.data.decimal_separator,
					lumise.data.thousand_separator,
				);
				return (lumise.data.currency_position === '0' ? price+lumise.data.currency : lumise.data.currency+price);
			},
			
			number_format: function (number, decimals, dec_point, thousands_sep) {
			    // Strip all characters but numerical ones.
			    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
			    var n = !isFinite(+number) ? 0 : +number,
			        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
			        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
			        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
			        s = '',
			        toFixedFix = function (n, prec) {
			            var k = Math.pow(10, prec);
			            return '' + Math.round(n * k) / k;
			        };
			    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
			    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
			    if (s[0].length > 3) {
			        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
			    }
			    if ((s[1] || '').length < prec) {
			        s[1] = s[1] || '';
			        s[1] += new Array(prec - s[1].length + 1).join('0');
			    }
			    return s.join(dec);
			},
			
			distance : function(p1, p2) {
				
				var lat1 = p1.x,
					lon1 = p1.y,
					lat2 = p2.x,
					lon2 = p2.y;
				
				var deg2rad = function(deg) {
					return deg * (Math.PI/180);
				},
				dLat = deg2rad(lat2-lat1),
				dLon = deg2rad(lon2-lon1),
				a = Math.sin(dLat/2) * Math.sin(dLat/2) +
						Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
						Math.sin(dLon/2) * Math.sin(dLon/2); 
				
				return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			
			},
			
			confirm : function(opt) {
				
				var html = '<div id="lumise-confirm"'+(opt.type !== undefined ? ' data-type="'+opt.type+'"' :'')+'>\
						<conf>\
							<p>'+opt.title+'</p>'+(opt.primary.text !== undefined ? 
							'<button class="lumise-btn" data-btn="primary">'+
								opt.primary.text+(opt.primary.icon ? ' <i class="'+opt.primary.icon+'"></i>' : '')+
							'</button>' : '')+(opt.second.text !== undefined ? 
							'<button class="lumise-btn white" data-btn="second">'+
								opt.second.text+(opt.second.icon ? ' <i class="'+opt.second.icon+'"></i>' : '')+
							'</button>' : '')+'\
							<i class="lumisex-android-close" data-btn="close"></i>\
						</conf>\
					</div>';
					
				$('#lumise-confirm').remove();
				$('#LumiseDesign').append(html);
				
				lumise.trigger({
					el: $('#lumise-confirm'),
					events: {
						'[data-btn="primary"]': function(e) {
							if (typeof opt.primary.callback == 'function')
								opt.primary.callback(e);
							$('#lumise-confirm').remove();
							e.preventDefault();
						},
						'[data-btn="second"]': function(e) {
							if (typeof opt.second.callback == 'function')
								opt.second.callback(e);
							$('#lumise-confirm').remove();
							e.preventDefault();
						},
						'[data-btn="close"]': function(e) {
							$('#lumise-confirm').remove();
							e.preventDefault();
						}
					}
				});
			},
			
			copy : function(text) {
				
				var input = document.createElement('input');
			    input.setAttribute('value', text.replace(/\&amp\;/g, '&'));
			    document.body.appendChild(input);
			    input.select();
			    document.execCommand('copy');
			    document.body.removeChild(input);
					
			},
			
			q : function(s, m) {
				return (m ? document.querySelectorAll(s) :  document.querySelector(s));
			}

		},

		render : {

			colorPresets : function() {

				var colors = lumise.data.colors,
					el = $('.lumise-color-presets'),
					lb;
				
				if (colors !== undefined && colors.indexOf(':') > -1)
					colors = colors.split(':')[1].replace(/\|/g, ',');
				
				if (lumise.data.enable_colors != '0' && localStorage.getItem('lumise_color_presets')) {
					colors = localStorage.getItem('lumise_color_presets').replace(/\|/g, ',');
				};

				el.html('');

				colors.split(',').map(function(c){
					
					c = c.split('@'); lb = c[0];
						
					if (c[1] !== undefined && c[1] !== '')
						lb = decodeURIComponent(c[1]).replace(/\"/g, '');
					else if (lumise.ops.color_maps[c[0]] !== undefined)
						lb = lumise.ops.color_maps[c[0]];
						
					el.append('<li data-color="'+c[0]+'" title="'+lb+'" style="background:'+c[0]+'"></li>');
					
				});
				
				el.find('li').on('click', function(){
					var el = lumise.get.el($(this).closest('ul.lumise-color-presets').data('target'));
					el.val(this.getAttribute('data-color'));
					if (el.get(0).color && typeof el.get(0).color.fromString == 'function')
						el.get(0).color.fromString(this.getAttribute('data-color'));

				});
			},

			refresh_my_designs : function(){

				var wrp = lumise.get.el('saved-designs'),
					items = wrp.find('>li'), 
					k = lumise.get.el('designs-search').find('input').val(),
					timer = null;

				if (items.length == 0)
					return lumise.get.el('saved-designs').trigger('scroll');
				
				var cursor = items.last().data('id');

				items.remove();

				delete lumise.ops.designs_cursor;
				delete lumise.ops.myDesignThumbns;

				lumise.indexed.list(function(data){
					lumise.ops.designs_cursor = data.id;
					lumise.render.my_designs(data);
					if (k !== '') {
						if (timer === null)
							return lumise.get.el('designs-search').find('input').trigger('input');
						clearTimeout(timer);
						timer = setTimeout(function(){
							lumise.get.el('designs-search').find('input').trigger('input');
						}, 500);
					}
				}, 'designs', items.last().data('id'));

			},

			my_designs : function(design){

				var el = lumise.get.el('saved-designs'),
					editing = lumise.data.editing,
					lis = '';
				
				el.find('.empty').remove();
				
				lis += '<li data-id="'+design.id+'">\
							<div data-func="edit" data-view="stages" data-title="'+lumise.i(48)+'" data-otitle="'+lumise.i(106)+'">';

				design.screenshots.map(function(s, i){

						if (!lumise.ops.myDesignThumbns)
							lumise.ops.myDesignThumbns = {};

						if (!lumise.ops.myDesignThumbns[design.id])
							lumise.ops.myDesignThumbns[design.id] = {};

						if (!lumise.ops.myDesignThumbns[design.id][i])
							lumise.ops.myDesignThumbns[design.id][i] = URL.createObjectURL(lumise.func.url2blob(s));

						lis += '<span data-func="edit">\
							  <img data-func="edit" src="'+lumise.ops.myDesignThumbns[design.id][i]+'" height="150" />\
							</span>';

				});

				lis += '</div>\
						<span data-view="func">\
							<i class="lumise-icon-menu"></i>\
							<span data-view="fsub">\
								<date data-func="date">'+lumise.func.date('h:m D d M, Y', design.updated)+'</date>\
								<button data-func="clone"><i class="lumise-icon-docs"></i> '+lumise.i(49)+'</button>\
								<button data-func="download"><i class="lumise-icon-cloud-download"></i> '+lumise.i(50)+'</button>\
								<button data-func="delete"><i class="lumise-icon-trash"></i> '+lumise.i(51)+'</button>\
							</span>\
						</span>\
						<span data-view="name" data-id="'+design.id+'" data-func="name" title="'+lumise.i(52)+'" data-enter="blur" contenteditable>'+
							(design.name ? design.name : 'Untitled')+
						'</span>\
					</li>';

				el.append(lis);

			},

			shapes : function(data) {

				if (lumise.get.el('shapes').find('ul.lumise-list-items').length === 0) {
					lumise.get.el('shapes').html(
						'<p class="gray">'+lumise.i(158)+'</p>\
						<div class="lumise-tab-body">\
							<ul class="lumise-list-items"></ul>\
						</div>');
				}

				if (data.length > 0) {
					var ul = lumise.get.el('shapes').find('ul.lumise-list-items');
					data.map(function(sh) {
						ul.append(
							'<li class="lumise-clipart" \
							data-ops="[{\
								&quot;type&quot;: &quot;shape&quot;,\
								&quot;resource&quot;: &quot;shape&quot;,\
								&quot;width&quot;: 60,\
								 &quot;height&quot;: 60 ,\
								 &quot;name&quot;: &quot;'+sh.name+'&quot;\
							}]">'+sh.content+'</li>'
						);
					});

					lumise.cliparts.add_events();

				}else html += '<h3>No item found</h3>';

			},

			fonts : function(fonts){

				var uri = '//fonts.googleapis.com/css?family=',
					txt = '',
					id = '',
					active = '',
					list = '';

				if (fonts) {
					localStorage.setItem('LUMISE_FONTS', JSON.stringify(fonts));
				}else{
					if (!localStorage.getItem('LUMISE_FONTS')) {
						localStorage.setItem('LUMISE_FONTS', typeof lumise.data.default_fonts == 'string' ? lumise.data.default_fonts : JSON.stringify(lumise.data.default_fonts));
					}
					fonts = JSON.parse(localStorage.getItem('LUMISE_FONTS'));
				}
				
				lumise.get.el('text-ext').html('');
				
				try {
					active = lumise.stage().canvas.getActiveObject().fontFamily;
				}catch(ex){active = '';};

				window.lumise_render_text = function(family, font) {

					if ($('#lumise-text-ext li[data-family="'+family+'"]').length > 0)
						return;
					
					var el = $('<span data-family="'+family+'" draggable="true" data-act="add" '+
							'data-ops=\'[{"type":"i-text", "fontSize": "30", "fontFamily": "'+family+'", '+
							(font !== undefined ? '"font": "'+font.replace('\\', '/')+'",': '')+
							'"textAlign": "center", "text": "'+family+'"}]\'>\
							<svg width="10" height="40" xmlns="http://www.w3.org/2000/svg" \
								xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none">\
								<g>\
									<text fill="#FFFFFF" stroke="none" stroke-width="0" stroke-linecap="round" \
										stroke-linejoin="round" x="0" y="30" text-anchor="middle" \
											font-size="30px" font-family="'+family+'">\
										<tspan x="50%" dy="0">'+family+'</tspan>\
									</text>\
								</g>\
							</svg>\
						</span>');

					$('#lumise-text-ext').append(el);

					lumise.design.event_add_text(el.get(0));

					lumise.func.getTextWidth({family: family, size: 30, text: family}, function(m){
						el.find('svg').attr({width: (m.width+18)});
					});

				};

				lumise_render_text('Arial');

				if (lumise.data.fonts && lumise.data.fonts.length > 0) {
					lumise.data.fonts.map(function(font){

						id = font.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');

						list += '<font'+(active == id ? ' class="selected"' : '')+
								' data-family="'+id+'" \
								style="font-family: \''+id+'\'" \
								data-source="'+font.upload+'">'+font.name+
							'</font>';

						lumise.tools.load_font(
							id,
							'url('+lumise.data.upload_url+font.upload.replace(/\\/g, '/')+')',
							function(family){
								lumise_render_text(family, font.upload);
							}
						);

					});
				}

				Object.keys(fonts).map(function(family){

					txt = decodeURIComponent(family).replace(/ /g, '+')+':'+
						  decodeURIComponent(fonts[family][1]);

					list += '<link onload="lumise_render_text(\''+decodeURIComponent(family)+'\', \''+ encodeURIComponent(JSON.stringify(fonts[family]))+'\')" rel="stylesheet" href="'+(uri+txt)+'" \
							type="text/css" media="all" />\
							<font'+(active == decodeURIComponent(family) ? ' class="selected"' : '')+
								' data-family="'+decodeURIComponent(family)+'" \
								style="font-family: \''+decodeURIComponent(family)+'\'">'+
									decodeURIComponent(family)+
							'</font>';

				});

				lumise.get.el('fonts').html(list);

			},

			product : function(data) {
				
				// update stages
				
				var stages = data.stages,
					stage_nav = [], stage_label;

				if (typeof stages == 'object') {
					Object.keys(stages).map(function(s){
						if (stages[s].overlay !== false)
							stages[s].overlay = true;
						stages[s].color = color;
						delete stages[s].canvas;
						stage_label = (stages[s].label !== undefined && stages[s].label !== '') ? stages[s].label : lumise.i('_'+s);
						stage_nav.push('<li data-stage="'+s+'">'+stage_label+'</li>');
						
						if (!stages[s].image) {
							stages[s].image = (
								stages[s].source == 'raws' ? 
								lumise.data.assets+'raws/' : 
								lumise.data.upload_url
							)+stages[s].url;
						}
						
					});
				}
				
				lumise.ops.product_data = $.extend(true, {}, data);
				
				var color = data.color ? data.color.split(':') : [],
					colors = color[1] ? color[1].split(',') : [],
					update_color = function (color){
						if (color !== undefined && color !== '' && ['standard', 'custom'].indexOf(data.change_color) > -1) {
							lumise.get.el('product-color').find('.choosed').removeClass('choosed');
							var selected = lumise.get.el('product-color').
										find('li[data-color="'+color+'"]');
							if(selected.get(0)){
								selected.trigger('click');
							}
							else
								lumise.get.el('product-color').
									find('li[data-view="picker"]').
									find('input').val(color).trigger('change');
						}
					};

				color = color[0];
				
				var p = lumise.get.el('product');

				p.find('nav.lumise-add-cart-action').show();
				p.find('header').show().find('>name').html('<t>'+(data.name ? data.name : '')+'</t> - '+lumise.func.price(data.price));
				p.find('header>sku').html(data.sku ? 'SKU: '+data.sku : '');
				
				lumise.get.el('cart-options').show();

				if (color !== undefined && color !== '' && ['standard', 'custom'].indexOf(data.change_color) > -1) {

					p.find('h3[data-view="color"]').show();
					lumise.get.el('product-color').show().find('li[data-color]').remove();
					
					var lb = '';
					
					colors.reverse().map(function(c) {
						
						c = c.split('@'); lb = c[0];
						
						if (c[1] !== undefined && c[1] !== '')
							lb = decodeURIComponent(c[1]).replace(/\"/g, '');
						else if (lumise.ops.color_maps[c[0]] !== undefined)
							lb = lumise.ops.color_maps[c[0]];
						
						lumise.get.el('product-color')
							.prepend('<li data-color="'+c[0]+'" title="'+lb+'" style="background:'+c[0]+'"'+(
								c[0]==color ? ' class="choosed"' : ''
							)+'></li>');
					});

					if (data.change_color == 'standard')
						lumise.get.el('product-color').find('li[data-view="picker"]').hide();
					else lumise.get.el('product-color').
								find('li[data-view="picker"]').show().
								find('input').val(color).trigger('input');

				} else {
					
					if(color !== undefined && color !== '')
						lumise.get.el('product-color').
							find('li[data-view="picker"]').hide().
							find('input').val(color).trigger('input');
					else
						lumise.get.el('product-color').find('li[data-view="picker"]').hide();
						
					lumise.get.el('product-color').hide();
					p.find('h3[data-view="color"]').hide();
				}

				if (data.description !== undefined && data.description !== '') {

					if (data.description.length > 250) {
						p.find('desc').data({desc: data.description});
						data.description = data.description.substr(0, 250);
					}

					p.find('span').show().html(data.description);
					p.find('desc').find('a[href="#more"]').on('click', function(e) {
						$(this).toggleClass('open');
						if ($(this).hasClass('open')) {
							$(this).html(lumise.i(137));
							$(this).closest('desc').find('span').html($(this).closest('desc').data('desc'));	
						} else{
							$(this).html(lumise.i(69));
							$(this).closest('desc').find('span').html($(this).closest('desc').data('desc').substr(0, 250));
						}
						e.preventDefault();
					});
				} else p.find('desc').hide();
				
				lumise.data.stages = stages;
				lumise.data.printings = data.printings;
				lumise.data.product = data.id;
				
				lumise.func.set_url('product', data.id);
				if(
					data.product > 0
				)
				lumise.func.set_url('product_cms', data.product);
				
				lumise.get.el('main').find('.lumise-stage,#lumise-no-product').remove();
				lumise.get.el('navigations').find('ul[data-block] li.active').removeClass('active');
				lumise.get.el('stage-nav').find('>ul').html(stage_nav.join('')).css({
					display: stage_nav.length > 1 ? 'inline-block' : 'none'
				});
				
				lumise.render.cart_change();
				
				lumise.active_stage(Object.keys(stages)[0], function(){
					
					if (lumise.data.share !== undefined) {
						
						$('div#LumiseDesign').attr({'data-processing': 'true', 'data-msg': 'Loading share data'});
						
						$.get(lumise.data.upload_url+'shares/'+lumise.data.share+'.lumi', function(res) {
			                try {
								res = JSON.parse(res);
							}catch(ex){
								res = {};
							};
							if (res.stages !== undefined) {
								
								lumise.tools.imports(res, function(){
									if (lumise.ops.first_completed !== true) {
										lumise.actions.do('first-completed');
										lumise.ops.first_completed = true;
									};
									$('#lumise-draft-status').html(
										'<span style="color:#7cb342">\
											<i class="lumisex-android-checkmark-circle"></i> '+
											lumise.i(136)+
										'</span>'
									);
								});
								
								if (lumise.get.el('product-color').find('li[data-color="'+res.color+'"]').length > 0)
									lumise.get.el('product-color').find('li[data-color="'+res.color+'"]').trigger('click');
								else {
									lumise.get.el('product-color').find('.choosed').removeClass('choosed');
									lumise.get.el('product-color').find('input.color').get(0).color.fromString(res.color);
								};
								
								delete res;
									
							};
							
			            }).done(function() {}).fail(function(data, textStatus, xhr) {
			                lumise.func.notice('SHARE LINK ERROR: '+data.status, 'error', 5000);
			            }).always(function() {
				            $('div#LumiseDesign').attr({'data-processing': '', 'data-msg': ''});
			            });
						delete lumise.data.share;
						
					} else
					if (lumise.func.url_var('cart', '') !== '') {
						
						$('div#LumiseDesign').attr({'data-processing': 'true', 'data-msg': 'Processing..'});
						
						lumise.indexed.get(lumise.func.url_var('cart'), 'cart', function(res){
							
							if (res === undefined)
								return;
							
							if(res['template'] !== undefined){
								lumise.cart.template = res.template.stages;
								lumise.cart.price.template = res.template.price;
							}
							
							if(typeof res['color'] !== 'undefined'){
								update_color(res['color']);
							}
							
							lumise.tools.imports(res, function(){
								if (lumise.ops.first_completed !== true) {
									lumise.actions.do('first-completed');
									lumise.ops.first_completed = true;
								};
							});
							
						});
						
						for (var s in lumise.data.stages) {
							if (lumise.data.stages[s].template !== undefined)
								lumise.data.stages[s].template.noload = true;
						};
						lumise.func.set_url('draft', null);
						return;
						
					} else 
					if (lumise.func.url_var('draft', '') == 'yes') {
						
						var stage = lumise.stage();
						
						for (var s in lumise.data.stages) {
							if (lumise.data.stages[s].template !== undefined)
								lumise.data.stages[s].template.noload = true;
						};
						
						// Load template from draft
						lumise.indexed.get(lumise.data.product, 'drafts', function(res){
							
							if (res !== null && res !== undefined){
								
								if(typeof res['template'] !== 'undefined'){
									lumise.cart.template = res.template.stages;
									lumise.cart.price.template = res.template.price;
								};
								
								lumise.tools.imports(res, function(){
									if (lumise.ops.first_completed !== true) {
										lumise.actions.do('first-completed');
										lumise.ops.first_completed = true;
									};
								});
								
								if (lumise.get.el('product-color').find('li[data-color="'+res.color+'"]').length > 0)
									lumise.get.el('product-color').find('li[data-color="'+res.color+'"]').trigger('click');
								else {
									lumise.get.el('product-color').find('.choosed').removeClass('choosed');
									lumise.get.el('product-color').find('input.color').get(0).color.fromString(res.color);
								};
								
								lumise.actions.do('draft-autosaved');
								
								delete res;
								
							} else {
								
								for (var s in lumise.data.stages) {
									if (lumise.data.stages[s].template !== undefined)
										delete lumise.data.stages[s].template.noload;
								};
								
								if(
									stage.template !== undefined && 
									stage.template.upload !== undefined
								)
									lumise.templates.load(stage.template);
							}
						});
						
					}else{
						lumise.get.el('draft-status').html('');
					}
					
				});
				
				lumise.actions.do('product', data);

			},

			cart_change : function() {

				var current_id = lumise.func.url_var('cart', ''),
					btn = lumise.get.el('cart-action'),
					data = localStorage.getItem('LUMISE-CART-DATA'),
					wrp = lumise.get.el('cart-items'),
					ul = wrp.find('ul[data-view="items"]'),
					total = 0, item, keys, color;
				//clear cart after checkout
				if(typeof lumise.data.clear_cart === 'object'){
					//remove cart items
					var items = JSON.parse(localStorage.getItem('LUMISE-CART-DATA'));
					
					lumise.data.clear_cart.map(function(id){
						delete items[id];
					});
					localStorage.setItem('LUMISE-CART-DATA', JSON.stringify(items));
				}else if(lumise.data.clear_cart){
					localStorage.setItem('LUMISE-CART-DATA', '{}');
					lumise.data.clear_cart = 0;
					data = '{}';
				} 
				
				var ci = ' <img src="'+lumise.data.assets+'assets/images/cart.svg" height="20" />';
				
				if (current_id === '') {
					btn.attr({'data-action': 'add-cart'}).html(btn.data('add')+ci);
				}else{
					btn.attr({'data-action': 'update-cart'}).html(btn.data('update')+ci);
				}

				// render list item of mycart here
				ul.html('');
				
				try {
					data = JSON.parse(data);
					keys = Object.keys(data);
				}catch(ex) {
					data = {};
					keys = [];
				}

				if (Object.keys(data).length > 0) {
					Object.keys(data).map(function(id) {
						item = JSON.parse(decodeURIComponent(atob(data[id])));
						color = item.color ? item.color : '#fff';
						item.product_data.stages = lumise.func.pimage(item.product_data.stages);
						ul.append(
						'<li>\
							<span data-view="thumbn">\
								<img style="background:'+color+'" src="'+
									item.product_data.stages[Object.keys(item.product_data.stages)[0]].image
								+'" />\
							</span>\
							<span data-view="info">\
								<name>'+item.product_data.name+'</name>\
								<price class="lumise-color">'+lumise.func.price(item.price_total)+'</price> \
								<a href="#remove" title="'+lumise.i('remove')+'">\
									<i class="lumisex-android-close" data-func="remove" data-id="'+id+'"></i>\
								</a>\
								'+(id != current_id ?
									'<a href="#edit" data-func="edit" data-id="'+id+'">'+
									'<i class="lumisex-edit"></i> '+lumise.i('edit')+'</a>' :
									'<small>'+lumise.i(72)+'</small> '
								)+'\
							</span>\
						</li>');
						total += parseFloat(item.price_total);
					});
					ul.append('<li><strong>'+lumise.i(74)+': '+lumise.func.price(total.toFixed(2))+'</strong></li>');
					ul.attr({'data-empty': 'false'});
				}else {
					ul.attr({'data-empty': 'true'}).html('<p><i class="lumisex-tshirt-outline"></i> '+lumise.i(71)+'</p>');
				}

				lumise.get.el('addToCart').find('small').remove();
				lumise.get.el('addToCart').append(' <small>'+keys.length+'</small>');
				
				lumise.actions.do('cart-change');
				
			},

			cart_details : function(e) {

				var data = JSON.parse(localStorage.getItem('LUMISE-CART-DATA') || '{}'),
					ind = 1, item, attr, total = 0, current = lumise.func.url_var('cart'),
					table = ['<table class="lumise-table sty2"><thead>',
								'<tr>',
								'<th> &nbsp; # &nbsp; </th>',
								'<th>'+lumise.i(76)+'</th>',
								'<th data-align="left"><div style="width: 240px;">'+lumise.i(77)+'</div></th>',
								'<th data-align="center">'+lumise.i(104)+'</th>',
								'<th data-align="center">'+lumise.i(79)+'</th>',
								'<th data-align="center"><div style="width: 120px;">'+lumise.i(78)+'</div></th>',
								'</tr>',
							'</thead>',
							'<tbody>'],
					ext_qty = function (val){
						if(val.indexOf('-') > -1){
							val = val.split('-');
							var qty = val[val.length-1];
							val = val.slice(0, -1);
							return val.join('-') + ' ('+qty+')';
						}
						
						return val;
						
					};
				if (Object.keys(data).length > 0) {
					Object.keys(data).map(function(i) {
						
						item = JSON.parse(decodeURIComponent(atob(data[i])));
						attr = '';
						
						if (item.options && item.options.length > 0) {
							item.options.map(function(atr) {
								attr += '<strong>'+decodeURIComponent(atr.name)+':</strong> '+
										(typeof atr.value == 'object' ? atr.value.map(i => ext_qty(i)).join(', ') : ext_qty(atr.value))+
										'<br />';
							});
						}
						
						table = table.concat([
							'<tr>',
							'<td>'+(ind++)+'</td>',
							'<td class="product-thumb">',
							'<div data-design-layer="'+i+'"></div>',
							'</td>',
							'<td>'+attr+'</td>',
							'<td data-align="center">'+lumise.func.price(item.price_total)+'</td>',
							'<td data-align="center">'+lumise.func.date('h:m D d M, Y', item.updated)+'</td>',
							'<td data-align="center">',
							(current != i ? '<a href="#edit" data-id="'+i+'">'+lumise.i('edit')+'</a>' : lumise.i(72)),
							'&nbsp; | &nbsp;<a href="#remove" data-id="'+i+'">'+lumise.i('remove')+'</a>',
							'</td>'
						]);
						
						setTimeout(lumise.func.design_layer, 100, i);
						
						total += parseFloat(item.price_total);
						
					});
				
					table = table.concat(['</tbody>',
						'<tfoot>',
						'<tr>',
						'<td colspan="3" class="lumise-total">'+lumise.i(74)+': '+lumise.func.price(total.toFixed(2)),
						'</td>',
						'<td colspan="3" data-align="right">',
						'<button class="lumise-btn-primary">'+lumise.i(75)+' <i class="lumisex-android-arrow-forward"></i></button>',
						'</td>',
						'</tr>',
						'</tfoot>',
						'</table>']);
				
				}else{
					table = table.concat(['<tr>', '<td colspan="6"><h3>'+lumise.i(42)+'</h3></td>','</tr>','</table>']);
				};
				
				lumise.tools.lightbox({
					content: '<div id="lumise-cart-details" class="lumise_content lumise_wrapper_table">\
								<h3 class="title">'+lumise.i(73)+'</h3>\
								<div>'+table.join('')+'</div>\
							</div>'
				});
				
				lumise.trigger({
					
					el: $('#lumise-cart-details'),
					
					events: {
						'a[href="#edit"]': 'edit_item',
						'a[href="#remove"]': 'remove_item',
						'tfoot button.lumise-btn-primary': lumise.cart.do_checkout
					},
					
					edit_item: function(e) {
						lumise.cart.edit_item(this.getAttribute('data-id'), e);
					},
					
					remove_item: function(e) {
						if (confirm(lumise.i('sure'))) {
							
							var id = this.getAttribute('data-id'),
								total_elm = $('#lumise-cart-details').find('tfoot tr:first td'),
								total = 0;
							
							if (lumise.func.url_var('cart', null) == id)
								lumise.func.set_url('cart', null);
							
							var items = JSON.parse(localStorage.getItem('LUMISE-CART-DATA'));
							delete items[id];
							
							localStorage.setItem('LUMISE-CART-DATA', JSON.stringify(items));
							lumise.render.cart_change();
							
							$(this).closest('tr').remove();
							
							//calc total 
							Object.keys(items).map(function(i) {
								var item = JSON.parse(decodeURIComponent(atob(data[i])));
								total += parseFloat(item.price_total);
							});
							
							$(total_elm[0]).html(
								lumise.i(74)+': '+lumise.func.price(total.toFixed(2))
							);
							if(total == 0)
								$(total_elm[1]).html('');
							
						}
					}
					
				});
				
				e.preventDefault();
				
			},
			
			categories : function (type, res) {
				
				var btn = $('button[data-func="show-categories"][data-type="'+type+'"]');
				
				if (res) {
					lumise.ops.categories[type] = res;
					if (res.category !== 0 && res.category !== '' && res.category_name !== '')
						btn.find('span').html(res.category_name);
					else btn.find('span').html(lumise.i(57));
				}else res = lumise.ops.categories[type];
				
				var items = res.categories,
					curr = res.category,
					wrp = lumise.get.el('x-thumbn-preview'),
					html = '<div class="lumise-categories-wrp" data-type="'+type+'">';
				
				if (items === undefined || items.length === 0)
					wrp.find('>div').html('<div class="lumise-categories-wrp" data-type="'+type+'"><br><br>'+lumise.i(42)+'</div>');
				else {
					
					if (res.category_parents.length > 0) {
						
						if (res.category_parents.length === 1 && res.category_parents[0].id === '') {
							html += '<nav><span>'+res.category_parents[0].name+'</span></nav>';
						}else{
						
							html += '<nav><a href="#category-all" data-act="item" data-id="">'+lumise.i(57)+'</a>';
							
							res.category_parents.map(function(cp){
								if (cp.id != res.category)
									html += '<i class="lumisex-ios-arrow-forward"></i><a href="#category-'+cp.id+'" data-act="item" data-id="'+cp.id+'">'+cp.name+'</a>';
								else html += '<i class="lumisex-ios-arrow-forward"></i><span>'+cp.name+'</span>';
							});
							html += '</nav>';
							
						}
					}
					
					html += '<ul class="smooth">';
					items.map(function(item) {
						var thumbn = item.thumbnail;
						if (thumbn === null || thumbn === undefined || thumbn === '')
							thumbn = lumise.data.assets+'assets/images/default_category.jpg';
						else if(thumbn.indexOf('http') !== 0) 
							thumbn = lumise.data.upload_url+'thumbnails/'+thumbn;
						html += '<li data-act="item" data-id="'+item.id+'"'+(curr == item.id ? ' class="active"' : '')+'>\
									<span style="background-image:url('+thumbn+');"></span>\
									<p>'+item.name+'</p>\
								 </li>';
					});
					html += '</ul></div>';
					
					var scrt = wrp.find('.lumise-categories-wrp ul').scrollTop();
					wrp.find('>div').html(html);
					wrp.find('.lumise-categories-wrp ul').scrollTop(scrt);
					lumise.trigger({
						
						el: wrp,
						
						events: {
							'div.lumise-categories-wrp': 'click'
						},
						click: function(e) {
							
							var el = e.target.getAttribute('data-act') ? $(e.target) : $(e.target).closest('[data-act]'),
								type = this.getAttribute('data-type'),
								act = el.data('act');
								
							if (!act)return;
							
							switch (act) {
								case 'item':
									
									$('.lumise-categories-wrp').attr({'data-process': 'true'});
									
									lumise.ops[type+'_category'] = el.data('id');

									lumise.ops[type+'_index'] = 0;
									lumise.ops[type+'_loading'] = false;
			
									lumise.get.el(type+'-list').find('ul').html('');
									lumise.get.el(type+'-list').trigger('scroll');
									
								break;
							}
							
							e.preventDefault();
							
						}
					});
					
				}
			},
			
			products_list : function (btn_txt) {
				
				if (!btn_txt)
					btn_txt = lumise.i(87);
				
				lumise.tools.lightbox({
					content: '<div id="lumise-change-products-wrp" data-btn="'+btn_txt+'" >\
								<center><i class="lumise-spinner x3"></i></center>\
							  </div>'
				});

				if (lumise.ops.products !== undefined)
					return lumise.response.list_products(lumise.ops.products);

				lumise.post({
					action: 'list_products'
				});
				
			}

		},

		indexed : {

			req: null,
			db: null,
			stores: {
				'uploads': null, 
				'designs': null, 
				'dumb': null, 
				'cart': null, 
				'drafts': null, 
				'categories': null
			},

			init: function() {

				var t = this;

				t.req = indexedDB.open("lumise", 8);
				t.req.onsuccess = function (e) {

			        if ( e.target.result.setVersion) {
			            if ( e.target.result.version != t.ver) {
			                var setVersion =  e.target.result.setVersion(t.ver);
			                setVersion.onsuccess = function () {
				                t.store(e.target.result);
			                    t.ready(e.target.result);
			                };
			            }
			            else t.ready(e.target.result);
			        }
			        else t.ready(e.target.result);
			    };

			    t.req.onupgradeneeded = function (e) {
				    t.store(e.target.result);
			    };

			},

			ready : function(db) {
				this.db = db;
				lumise.actions.do('db-ready');
			},

			save : function(ob, storeName, callback) {
				
				if (this.db == null)
					return callback(null);

				var trans = this.db.transaction(ob.length === 2 ? [storeName, 'dumb'] : [storeName], "readwrite");
		        var store = trans.objectStore(storeName);
				
				if (ob.id === null || ob.id === undefined)
					ob.id = parseInt(new Date().getTime()/1000).toString(36)+':'+Math.random().toString(36).substr(2);
				
		        var	obj = $.extend({
			        	created: new Date().getTime()
			        }, (ob[0] !== undefined ? ob[0] : ob));
				
				var process = store.put(obj, obj.id);

				if (typeof callback == 'function')
					process.onsuccess = callback;

				if (ob[1] !== undefined) {

					var	obj_dumb = $.extend({
			        	id: obj.id,
			        	created: obj.created
			        }, ob[1]);

			        trans.objectStore('dumb').put(obj_dumb, obj.id);

				}


			},

			get : function(id, storeName, callback){

				if (this.db == null)
					return callback(null);

				var trans = this.db.transaction([storeName], "readwrite");
			    var store = trans.objectStore(storeName);
				try{
					var process = store.get(id);
				}catch(ex){}
				trans.oncomplete = function(event){
					callback(process !== undefined ? process.result : null);
					delete process;
					delete trans;
					delete store;
					delete go;
				};
				trans.onerror = function(){
					callback(null);
				};

			},

			list : function(callback, storeName, onComplete){

				var t = this;
				if (t.db == null)
					return onComplete(null);

		        var trans = t.db.transaction([storeName], "readwrite");
			    var store = trans.objectStore(storeName);
			    var i = 0;

			    trans.oncomplete = onComplete;

			    var range = lumise.ops[storeName+'_cursor'] ?
			    			IDBKeyRange.upperBound(lumise.ops[storeName+'_cursor'], true) : null,
			    	cursorRequest = store.openCursor(range ,'prev');

			    cursorRequest.onerror = function(error) {
			        console.log(error);
			    };

			    cursorRequest.onsuccess = function(evt) {

				    if (i++ > 11 && typeof onComplete == 'function')
				    	return onComplete();

			        var cursor = evt.target.result;
			        if (cursor) {
				        callback(cursor.value);
				        if (onComplete != cursor.id)
			            	cursor.continue();
			        }else{
				    	delete cursor;
				    	delete cursorRequest;
				    	delete range;
				    	delete trans;
				    	delete go;
				        return (typeof onComplete == 'function' ? onComplete('done') : null);
				    }
			    };

			},

			store : function(db) {
				Object.keys(this.stores).map(function(s){
					try {
	                	db.createObjectStore(s);
					}catch(ex){};
                });
			},

			delete : function(id, store) {

				var tranc = this.db.transaction([store, 'dumb'], "readwrite");
				tranc.objectStore(store).delete(id);
				tranc.objectStore('dumb').delete(id);

			}

		},

		post : function(ops, callback){

			if (!ops.action)
				return lumise.func.notice('lumise.post() missing param action', 'error');

			$.ajax({
				url: lumise.data.ajax,
				method: 'POST',
				data: lumise.filter('ajax', $.extend({
					nonce: 'LUMISE-SECURITY:'+lumise.data.nonce,
					ajax: 'frontend'
				}, ops)),
				statusCode: lumise.response.statusCode,
				success: function(res) {
					if (typeof callback == 'function')
						return callback(res);
					else if (typeof lumise.response[ops.action] == 'function')
						lumise.response[ops.action](res);
				}
			});

		},

		response : {

			templates : function(res) {

				var html = '';

				if (res.items && res.items.length > 0) {
					res.items.map(function(item) {
						lumise.templates.storage[item.id] = lumise.data.upload_url+item.upload;
						html += '<li style="background-image: url('+item.screenshot+')" \
								data-ops=\'[{\
									"type": "template", \
									"name": "'+item.name+'", \
									"id": "'+item.id+'", \
									"tags": "'+(item.tags?item.tags:'')+'", \
									"cates": "'+(item.cates?item.cates:'')+'", \
									"screenshot": "'+item.screenshot+'", \
									"price": "'+item.price+'"\
								}]\' class="lumise-template">\
								<i data-tag="'+item.id+'">'+(item.price?lumise.func.price(item.price) : lumise.i(100))+'</i><i data-info="'+item.id+'"></i>\
								</li>';
					});
					var total = res.total ? res.total : 0;
					lumise.ops.templates_q = res.q;
					lumise.ops.templates_category = res.category;
					lumise.ops.templates_index = parseInt(res.index)+res.items.length;
					if (lumise.ops.templates_index<total)
						lumise.ops.templates_loading = false;

				}else html += '<span class="noitems">'+lumise.i(42)+'</span>';

				lumise.get.el('templates-list').find('i.lumise-spinner').remove();
				lumise.get.el('templates-list').find('ul.lumise-list-items').append(html);
				
				lumise.render.categories('templates', res);
				lumise.templates.add_events();

			},
			
			cliparts : function(res) {

				var html = '';
				
				if (res.items && res.items.length > 0) {
					
					res.items.map(function(item) {
						lumise.cliparts.storage[item.id] = lumise.data.upload_url+item.upload;
						html += '<li style="background-image: url('+item.thumbnail_url+')" \data-ops=\'[{\
									"type": "image", \
									"name": "'+item.name+'", \
									"id": "'+item.id+'", \
									"tags": "'+(item.tags?item.tags:'')+'", \
									"cates": "'+(item.cates?item.cates:'')+'", \
									"resource": "cliparts", \
									"price": "'+item.price+'" \
								}]\' class="lumise-clipart">\
								<i data-tag="'+item.id+'">'+(item.price>0?lumise.func.price(item.price) : lumise.i(100))+'</i><i data-info="'+item.id+'"></i>\
								</li>';
					});
					var total = res.total ? res.total : 0;
					lumise.ops.cliparts_q = res.q;
					lumise.ops.cliparts_category = res.category;
					lumise.ops.cliparts_index = parseInt(res.index)+res.items.length;
					if (lumise.ops.cliparts_index<total)
						lumise.ops.cliparts_loading = false;

				}else html += '<span class="noitems">'+lumise.i(42)+'</span>';

				lumise.get.el('cliparts-list').find('i.lumise-spinner').remove();
				lumise.get.el('cliparts-list').find('ul.lumise-list-items').append(html);
				
				lumise.render.categories('cliparts', res);
				lumise.cliparts.add_events();

			},

			save_design : function(res) {

				$('div#LumiseDesign').attr({'data-processing': '', 'data-msg': ''});

				if (res.success) {

					lumise.func.notice(lumise.i(21), 'success');

					lumise.data.design = res.id;
					lumise.get.el('navigations').find('li[data-tool="designs"]').attr({'data-load': 'designs'});
					/*
					if ( window.location.href.indexOf('design='+res.id+'&') === -1)
						window.history.pushState({},"", lumise.data.url+'?design='+res.id+'&product='+res.pid);
					*/
				}else if(res.error) {
					lumise.func.notice(res.error, 'error');
				}

			},

			my_designs : function(res) {

				if(res.error)
					return lumise.func.notice(res.error, 'error');
				
				lumise.render.my_designs(res);

			},

			edit_design : function(res) {

				if(res.error)
					return lumise.func.notice(res.error, 'error');

				try{
					var data = JSON.parse(res.data);
				}catch(ex) {
					return lumise.func.notice(ex.message, 'error');
				};
				
				lumise.tools.imports(data);
				lumise.get.el('share-link').val(lumise.data.url+'?design='+res.id+'&product='+res.pid+'&private_key='+res.share_token)
					   .closest('li[data-view="link"]').removeAttr('data-msg');

				lumise.get.el('navigations')
					   .find('li[data-tool="share"] p[data-view="radio"] input[name="lumise-share-permission"]')
					   .get(res.share_permission).checked = true;

				lumise.data.design = res.id;
				lumise.data.private_key = res.share_token;
				lumise.get.el('navigations').find('li[data-tool="designs"]').attr({'data-load': 'designs'});

				if ( window.location.href.indexOf('design='+res.id+'&') === -1)
					window.history.pushState({},"", lumise.data.url+'?design='+res.id+'&product='+res.pid);

			},

			delete_design : function(res) {

				if(res.error) {
					return lumise.func.notice(res.error, 'error');
				}

				$('ul#lumise-saved-designs li[data-id="'+res.id+'"]').remove();
				lumise.func.notice(lumise.i(22), 'success');

			},

			design_permission : function(res) {

				if(res.error)
					lumise.get.el('navigations')
					   .find('li[data-tool="share"] li[data-view="link"]').attr({'data-msg': res.error});

				lumise.get.el('navigations')
					   .find('li[data-tool="share"] button[data-func="copy-link"]')
					   .removeClass('disabled').next('i').remove();

			},

			shapes : function(res) {

				if(res.error) {
					return lumise.func.notice(res.error, 'error');
				}

				$('#lumise-shapes i.lumise-spinner').remove();

				if (res.items && res.items.length > 0) {
					
					lumise.ops.shapes_index = parseInt(res.index)+res.items.length;
					lumise.ops.shapes_loading = false;
					lumise.render.shapes(res.items);
					var shapewrp = $('#lumise-shapes .lumise-tab-body').get(0);
					
					if (shapewrp.scrollHeight == shapewrp.clientHeight) {
						$(shapewrp).trigger('scroll');
					}
					
				}else $('#lumise-shapes ul').append('<span class="noitems">'+lumise.i(42)+'</span>');

			},

			change_lang : function() {
				location.reload();
			},

			list_products : function(res) {
				
				var wrp = $('#lumise-change-products-wrp'),
					btn_text = wrp.data('btn');
				
				if (lumise.ops.products === undefined)
					lumise.ops.products = res;

				var cates = ['<ul data-view="categories">',
								'<h3>'+lumise.i(56)+'</h3>',
								'<li data-id="all" class="active" data-lv="0"> '+lumise.i(57)+'</li>'],
					prods = ['<h3 data-view="top"><input type="search" placeholder="'+lumise.i(63)+'" /></h3>','<ul data-view="products" class="smooth">'];

				if (res.categories) {
					res.categories.map(function(c) {
						cates.push('<li data-id="'+c.id+'" data-lv="'+c.lv+'">'+'&mdash;'.repeat(c.lv)+' '+c.name+'</li>');
					});
				}

				if (res.products) {

					res.products.map(function(p) {

						if (typeof p.stages == 'string')
							p.stages = JSON.parse(decodeURIComponent(atob(p.stages)));
						
						p.stages = lumise.func.pimage(p.stages);
						
						var cates = '';
						
						if (p.cates) {

							cates = p.cates.split(',');
							cates.map(function(c, i){
								cates[i] = 'cate-'+c;
							});

							cates = ' class="'+cates.join(' ')+'"';
						}

						prods.push(
							'<li data-id="'+p.id+'"'+cates+(
									(lumise.data.product == p.id) ? ' data-current="true"':''
								)+' data-name="'+p.name.toLowerCase().trim().replace(/[^a-z0-9 ]/gmi, "")+'"'+((p.id !== p.product)? ' data-cms="'+p.product+'"': '')+'>\
								<span data-view="thumbn" data-start="'+btn_text+'">\
									<img style="background:'+p.color.split(':')[0]+'" src="'+
									p.stages[Object.keys(p.stages)[0]].image+'" />\
								</span>\
								<span data-view="name">'+p.name+'</span>\
								<span data-view="price">'+lumise.func.price(p.price)+'</span>\
							</li>'
						)
					});

				}else prods.push('<li data-view="noitem">'+lumise.i(42)+'</li>');

				wrp.html(cates.join('')).append(prods.join(''));

				lumise.trigger({
					el: $('#lumise-change-products-wrp'),
					events: {
						'ul[data-view="categories"] li': 'category',
						'ul[data-view="products"] li': 'product',
						'h3[data-view="top"] input:input': 'search'
					},
					category: function() {

						var wrp = $(this).closest('#lumise-change-products-wrp'),
							id = this.getAttribute('data-id');

						wrp.find('ul[data-view="categories"] li.active').removeClass('active');
						$(this).addClass('active');

						if (id == 'all') {
							wrp.find('ul[data-view="products"] li').show();
						}else{
							wrp.find('ul[data-view="products"] li').hide();
							wrp.find('ul[data-view="products"] li.cate-'+id).show();
						}
					},

					product: function() {
						
						if (this.getAttribute('data-current') == 'true')
							return;
						
						var id = this.getAttribute('data-id'),
							product = lumise.ops.products.products.filter(function(p){return p.id == id;});

						if (product.length > 0) {
							if (typeof wrp.data('callback') == 'function') {
								wrp.data('callback')(product[0]);
							} else {
								
								if (lumise.func.url_var('cart', '') !== '') {
									lumise.func.confirm({
										title: lumise.i(119),
										primary: {
											text: lumise.i(124),
											callback: function(e) {
												lumise.func.set_url('cart', null);
												$('lumise-draft-status').html('');
												lumise.func.set_url('design_print', null);
												lumise.func.set_url('order_print', null);
												lumise.func.set_url('draft', 'yes');
												lumise.render.product(product[0]);
											}
										},
										second: {
											text: lumise.i(125),
											callback: function(e) {
												lumise.func.set_url('design_print', null);
												lumise.func.set_url('order_print', null);
												lumise.func.set_url('draft', 'yes');
												lumise.render.product(product[0]);
											}
										}
									});
								}else{
									lumise.func.set_url('design_print', null);
									lumise.func.set_url('order_print', null);
									lumise.func.set_url('share', null);
									lumise.func.set_url('draft', 'yes');
									lumise.render.product(product[0]);
								}
							}
						}
						
						$(this).closest('#lumise-lightbox').remove();

					},

					search: function(e) {
						e.data.el.find('ul[data-view="categories"] li.active').removeClass('active');
						e.data.el.find('ul[data-view="categories"] li[data-id="all"]').addClass('active');
						var s = this.value.toLowerCase();
						e.data.el.find('ul[data-view="products"] li[data-id]').each(function(){
							if (s === '')
								this.style.display = 'list-item';
							else {
								if (this.getAttribute('data-name').indexOf(s) > -1)
									this.style.display = 'list-item';
								else this.style.display = 'none';
							}
						});
					}

				});

			},
			
			categories : function(res) {
				if (res.length > 0) {
					var type = res[0].type;
					lumise.ops.categories[type] = res;
					lumise.render.categories(type);
				}
			},
			
			statusCode: {

				403: function() {

					$.post(
						lumise.data.ajax,
						lumise.filter('ajax', {
							action: 'extend',
							name: 'general',
							nonce: lumise.data.nonce,
						}), function(res){

							$('div#LumiseDesign').attr({'data-processing': '', 'data-msg': ''});

							if (res == '-1')
								return lumise.func.notice(lumise.i(23), 'error', 3000);

							lumise.data.nonce = res;
							return lumise.func.notice(lumise.i(24), 'notice', 3000);

						});

				}

			}

		},

		mobile : function() {
			
			if (lumise.ops.excmobile)
				return;
			
			var ww = $(window).width(),
				wh = $(window).height();
			
			lumise.ops.window_width = ww;
				
			if (ww<1025) {
				
				$(window).on('scroll', function(e){
					e.stopPropagation();
					e.preventDefault();
					return false;
				});
				
				$('#lumise-main')
					.on('mousedown touchstart', function(e) {
					
					this.t = this.offsetTop;
					this.l = this.offsetLeft;
					this.x = e.originalEvent.pageX ? e.originalEvent.pageX : e.originalEvent.touches[0].pageX;
					this.y = e.originalEvent.pageY ? e.originalEvent.pageY : e.originalEvent.touches[0].pageY;
					this._do = ($('#lumise-top-tools').attr('data-view') == 'standard');
					this._gest = this.gest;
					
					if (e.originalEvent.touches && e.originalEvent.touches.length === 2) {
						
						this.gest = true;
						
						if (!this.sc)
							this.sc = 1;
							
						this.a = e.originalEvent.touches[0].pageX - e.originalEvent.touches[1].pageX;
						this.b = e.originalEvent.touches[0].pageY - e.originalEvent.touches[1].pageY;
						
						this.scale_start = Math.sqrt((this.a*this.a) + (this.b*this.b));
						
					}else this.gest = false;
					
					this.start_move = true;
					
				})
					.on('mousemove touchmove', function(e) {
					
					if ((e.originalEvent.touches && e.originalEvent.touches.length === 1) || this.start_move !== true)
						return true;
					
					if (this.gest === true) {
						
						this.a = e.originalEvent.touches[0].pageX - e.originalEvent.touches[1].pageX;
						this.b = e.originalEvent.touches[0].pageY - e.originalEvent.touches[1].pageY;
						
						this.scale_move = Math.sqrt((this.a*this.a) + (this.b*this.b));
						
						this.scale = this.scale_move/this.scale_start;
						
						var sc = this.sc*this.scale;
						
						if (sc > 2) {
							sc = 2;
						}else if (sc < 0.5){
							sc = 0.5;
						};
						
						this.style.transform = 'scale('+sc+')';
						
					};
					
					if (this._do !== true) {
						e.preventDefault();
						return true;
					};
					
					this.style.top = (
						this.t+(
							(
								e.originalEvent.pageY ? 
								e.originalEvent.pageY : 
								e.originalEvent.touches[0].pageY
							)-this.y
						)
					)+'px';
					
					this.style.left = (
						this.l+(
							(
								e.originalEvent.pageX ? 
								e.originalEvent.pageX : 
								e.originalEvent.touches[0].pageX
							)-this.x
						)
					)+'px';
					
				})
					.on('mouseup touchend', function(e) {
					
					this.sc = parseFloat(this.style.transform.toString().replace('scale(', '').replace(')', ''));
						
					if (this.sc > 2) {
						this.sc = 2;
					}else if (this.sc < 0.5){
						this.sc = 0.5;
					};
					
					this.start_move = false;
					this.gest = false;
					
				});
				
			};
			
			if (ww<450) {
				
				$('li[data-tab="design"]').trigger('click');
				
				$('div#lumise-left .lumise-left-nav,#lumise-top-tools')
				.on('mousedown touchstart', function(e){
					this.sub = $(e.target).closest('[data-view="sub"]');
					if (this.sub.length > 0)
						return true;
					this.l = this.offsetLeft;
					this.x = e.originalEvent.pageX ? e.originalEvent.pageX : e.originalEvent.touches[0].pageX;
					this.w = $(window).width();
					e.preventDefault();
				})
				.on('mousemove touchmove', function(e){
					if (this.sub.length > 0)
						return true;
					var l = (this.l+((e.originalEvent.pageX ? e.originalEvent.pageX : e.originalEvent.touches[0].pageX)-this.x));
					if (l > 0)
						l = l*0.1;
					else if (this.offsetWidth + l < this.w)
						l = (this.w - this.offsetWidth)+((l-(this.w - this.offsetWidth))*0.1);
					this.style.left = Math.round(l)+'px';
					e.preventDefault();
				})
				.on('mouseup touchend', function(e){
					if (this.sub.length > 0)
						return true;
					if (this.offsetLeft == this.l)
						e.target.click();
					else if (this.offsetLeft > 0)
						$(this).animate({left: 0}, 150);
					else if (this.offsetWidth + this.offsetLeft < this.w)
						$(this).animate({left: -(this.offsetWidth-this.w)}, 150);
					e.preventDefault();
				});
				
				lumise.actions.add('object:added', function(){
					$('li[data-tab="design"]').trigger('click');
					$('div#lumise-left .lumise-left-nav').css({left: '0px'});
				});
				lumise.actions.add('selection:cleared', function(){
					$('#lumise-top-tools').css({left: ''});
				});
				lumise.actions.add('object:selected', function(){
					$('#lumise-top-tools').css({left: ''});
				});
				lumise.actions.add('after:render', function(){
					/*$('#lumise-top-tools [data-tool].active').removeClass('active');*/
				});
				
				$('#lumise-templates-list,#lumise-cliparts-list').css({'max-height': (wh-224)+'px'});
				$('div#lumise-left .lumise-tab-body-wrp').css({height: (wh-110)+'px'});
				$('#lumise-cart-wrp').css({'max-height': (wh - 200)+'px'});
				$('div#lumise-left>div.lumise-left-nav-wrp,div#lumise-stage-nav').css({top: wh+'px'});
				$('#lumise-left #lumise-uploads div[data-tab]').css({height: (wh-169)+'px'});
				
			}else if (ww<1025) {
				
				$('#lumise-main').on('touchstart', function(){
					$('#lumise-side-close').trigger('click');
				});
				lumise.actions.add('object:added', function(){
					$('#lumise-side-close').trigger('click');
				});
				$('#lumise-templates-list,#lumise-cliparts-list').css({'max-height': (wh-170)+'px'});
				$('div#lumise-left .lumise-tab-body-wrp').css({height: (wh-54)+'px'});
				$('div#lumise-stage-nav').css({top: (wh-30)+'px'});
				$('#lumise-left #lumise-uploads div[data-tab]').css({height: (wh-115)+'px'});
			};
			
			lumise.ops.excmobile = true;
				
		},

		stage : function(){
			return lumise.data.stages[lumise.current_stage];
		},

		active_stage : function(name, callback) {

			if (typeof callback != 'function')
				callback = function(){};

			this.current_stage = name;

			if (!this.current_stage || !this.data.stages[this.current_stage])
				return alert(lumise.i(20));

			lumise.get.el('stage-nav').find('li.active').removeClass('active');
			lumise.get.el('stage-nav').find('li[data-stage="'+name+'"]').addClass('active');

			lumise.get.el('print-stage').html(name);

			var stage = this.data.stages[this.current_stage];
			stage.name = name;
			
			$('#lumise-main div.lumise-stage').hide();
			
			lumise.actions.do('activated_stage');
			
			if (stage.canvas) {
				// the stage has been rendered
				if (stage.productColor != lumise.get.color()) {
					stage.productColor.set('fill', lumise.get.color());
				}

				lumise.tools.discard();

				$('#lumise-stage-'+name).show();

				if (stage.data) {
					lumise.tools.import(stage.data, function(){
						lumise.stack.save();
					});
					delete stage.data;
				}
				
				return callback();

			} 
			else 
			{
				
				var main = lumise.get.el('main'),
					mw = main.width()-20,
					mh = $(window).height()-120;
				
				if (mh < 570)
					mh = 570;
				
				main.append(
					'<div id="lumise-stage-'+name+'" class="lumise-stage canvas-wrapper" style="height: '+mh+'px;">\
						<canvas id="lumise-stage-'+name+'-canvas" width="'+mw+'" height="'+mh+'"></canvas>\
						<div class="lumise-snap-line-x"></div>\
						<div class="lumise-snap-line-y"></div>\
					</div>'
				);

				stage.canvas = new fabric.Canvas('lumise-stage-'+name+'-canvas', {
					preserveObjectStacking: true,
					controlsAboveOverlay: true
				});

				stage.product = {};
				stage.stack = {
					data : [],
				    state : true,
				    index : 0
			    };

				var wrp = lumise.func.q('#lumise-stage-'+name);

				stage.lineX = $('#lumise-stage-'+name+' .lumise-snap-line-x');
				stage.lineY = $('#lumise-stage-'+name+' .lumise-snap-line-y');
				
				[
					['dragover', function(e){

					e.preventDefault();

					if (!lumise.ops.drag_start || !lumise.ops.drag_start.getAttribute('data-ops'))
						return;

					var cur = stage.limit_zone.visible,
						zoom = lumise.stage().canvas.getZoom(),
						disc = lumise.ops.drag_start.distance,
						view = lumise.stage().canvas.viewportTransform,
						limit = {
							l : (stage.limit_zone.left*zoom)+view[4],
							t :  (stage.limit_zone.top*zoom)+view[5],
							w : stage.limit_zone.width*zoom,
							h : stage.limit_zone.height*zoom
						};

					if (
						(e.layerX - disc.x + (disc.w/2) > limit.l) &&
						(e.layerX - disc.x - (disc.w/2) < limit.l+limit.w) &&
						(e.layerY - disc.y + (disc.h/2) > limit.t) &&
						(e.layerY - disc.y - (disc.h/2) < limit.t+limit.h)
					) {
						stage.limit_zone.set('visible', true);
					}else{
						stage.limit_zone.set('visible', false);
					}

					if (cur != stage.limit_zone.visible)
						stage.canvas.renderAll();

				}],
					['dragleave', function(e){

					e.preventDefault();

					if (stage.limit_zone.visible === true) {
						stage.limit_zone.set('visible', false);
						stage.canvas.renderAll();
					}

				}],
					['drop', function(e){

					e.preventDefault();

					if (!lumise.ops.drag_start || !lumise.ops.drag_start.getAttribute('data-ops') || stage.limit_zone.visible !== true)
						return;

					var rect = this.getBoundingClientRect(),
						ops = JSON.parse(lumise.ops.drag_start.getAttribute('data-ops'));

					var disc = lumise.ops.drag_start.distance,
						zoom = lumise.stage().canvas.getZoom(),
						view = lumise.stage().canvas.viewportTransform;

					if (ops.type == 'shape')
						ops[0].url = 'data:image/svg+xml;base64,'+btoa(lumise.ops.drag_start.innerHTML.trim());
					else if (ops[0].url === undefined)
						ops[0].url = lumise.cliparts.storage[ops[0].id] || lumise.cliparts.uploads[ops[0].id];

					if (ops[0].url && ops[0].url.indexOf('dumb-') === 0) {
						lumise.indexed.get(ops[0].url.split('dumb-')[1], 'dumb', function(res){
							if (res !== null) {
								lumise.cliparts.uploads[ops[0].id] = res[0];
								ops[0].url = res[0];
								lumise.func.preset_import(ops, lumise.ops.drag_start, {
									left: (((e.clientX - rect.left)/zoom) - disc.x)-(view[4]/zoom),
									top: (((e.clientY - rect.top)/zoom) - disc.y)-(view[5]/zoom)
								});
								delete res;
							}
						});
					}else{
						lumise.func.preset_import(ops, lumise.ops.drag_start, {
							left: (((e.clientX - rect.left)/zoom) - disc.x)-(view[4]/zoom),
							top: (((e.clientY - rect.top)/zoom) - disc.y)-(view[5]/zoom)
						});
					}

				}],
					['mousewheel', function(e){

					var zoom = parseFloat(lumise.get.el('zoom').val());

					if (e.shiftKey) {

						zoom +=  e.wheelDelta*0.15;

						if (zoom < 100)
							zoom = 100;
						else if (zoom > 250)
							zoom = 250;

						lumise.get.el('zoom').val(zoom).trigger('input');

					}else if (zoom > 100){

						var rel = {
								x: (e.wheelDeltaX !== undefined ? e.wheelDeltaX*0.25 : e.wheelDelta*0.25),
								y: (e.wheelDeltaY !== undefined ? e.wheelDeltaY*0.25 : e.wheelDelta*0.25)
							},
							canvas = lumise.stage().canvas,
							view = canvas.viewportTransform;

			       		if (
			       			(view[4] > 0 && rel.x > 0) ||
			       			(view[4] < -((canvas.width*view[0]) - canvas.width) && rel.x < 0)
			       		)rel.x = 0;

			       		if (
			       			(view[5] > 0 && rel.y > 0) ||
			       			(view[5] < -((canvas.height*view[0]) - canvas.height) && rel.y < 0)
			       		)rel.y = 0;

						canvas.relativePan(rel);

						if (lumise.func.reversePortView(false) || rel.x !== 0) {
							e.preventDefault();
							e.stopPropagation();
							return false;
						}{return true;}

					}else if (lumise.stage().canvas.isDrawingMode === true) {
						var range = lumise.get.el('drawing-width'),
							val = parseFloat(range.val())+(e.wheelDelta*0.1);
						range.val(val).trigger('input');
						e.preventDefault();
					}


				}],
				].map(function(ev){
					wrp.addEventListener(ev[0], ev[1], false);
				});
				
			}

			stage.canvas.backgroundColor = '#ebeced';
			
			stage.canvas.on(lumise.objects.events);

			$('div#LumiseDesign').attr({'data-processing': 'true', 'data-msg': 'Loading..'});
			
			fabric.util.loadImage(stage.image, function(img) {

			    if(img == null) {
				    $('div#LumiseDesign').attr({'data-processing': '', 'data-msg': ''});
			        lumise.func.notice(lumise.i(33)+stage.image, 'error', 5000);
			    }
			    else 
			    {
	
			        var product = new fabric.Image(img);
		
					stage.product = product;
	
					$('div#LumiseDesign').attr({'data-processing': '', 'data-msg': ''});
	
					if (product.width > mw) {
						product.height = product.height*(mw/product.width);
						product.width = mw;
					};
					
					if (product.height > mh) {
						product.width = product.width*(mh/product.height);
						product.height = mh;
					};
	
					var ph = stage.canvas.height*0.9,
						pw = (product.width*(stage.canvas.height/product.height))*0.9;
	
					if (product.height < stage.canvas.height) {
						ph = product.height;
						pw = product.width;
					};
					
					product.set({
						left: stage.canvas.width/2,
						top: stage.canvas.height/2,
						width: pw,
						height: ph,
						selectable: false,
						evented: false,
					});
	
					var color = lumise.get.color();
	
					stage.productColor = new fabric.Rect({
						width: pw,
						height: ph,
						left: stage.canvas.width/2,
						top: stage.canvas.height/2,
						fill: color,
						selectable: false,
						evented: false,
						stroke: '#FFF'
					});
					
					var ez_ratio = stage.product_width ? pw/stage.product_width : 1,
						editing = {
							width: stage.edit_zone.width*ez_ratio,
							height:  stage.edit_zone.height*ez_ratio,
							top: (stage.edit_zone.top*ez_ratio)+((stage.canvas.height/2)-(ph/2)),
							left: stage.edit_zone.left*ez_ratio
						};
					
					var radius = (stage.edit_zone.radius !== undefined && stage.edit_zone.radius !== '') ? 
								 stage.edit_zone.radius : 0;
						
					stage.limit_zone = new fabric.Rect({
						fill: 'transparent',
						left: ((stage.canvas.width/2)+editing.left) - (editing.width/2),
						top: (((ph/2)+editing.top) - (editing.height/2)),
						height: editing.height,
						width: editing.width,
						originX: 'left',
						originY: 'top',
						stroke: lumise.func.invert(color),
						strokeDashArray: [5, 5],
						selectable: false,
						evented: false,
						visible: false,
						radius: radius,
						rx: radius,
						ry: radius,
					});
					
					if (stage.overlay) {
	
						stage.canvas.setOverlayImage(product);
						stage.canvas.add(stage.productColor, stage.limit_zone);
	
					}else stage.canvas.add(stage.productColor, product, stage.limit_zone);
	
					stage.canvas.renderAll();
					
					if (typeof callback === 'function')
						callback(stage);
					
					if (stage.data) {
						lumise.tools.import(stage.data, function(){
							lumise.stack.save();
						});
						delete stage.data;
					}else if(
						stage.template !== undefined && 
						stage.template.upload !== undefined &&
						stage.template.noload !== true
					) {
						lumise.templates.load(stage.template); 
					} else {
						lumise.stack.save();
						if (lumise.ops.first_completed !== true) {
							lumise.actions.do('first-completed');
							lumise.ops.first_completed = true;
						};
					}
				}
			
			});
		},

		cart : {

			data : {},
			price : {
				template : {},
				base : 0,
				attr : 0
			},
			template : {},
			qty : 0,
			price_rule :{},
			attr_tmpl : null,
			timer : null,
			qtys: [],
            attributes: [
	            {
	            	"title": "Size",
	            	"type": "size",
	            	"required": false,
	            	"options": [{
			            	"title":"X",
			            	"price":"100"
		            	},{
			            	"title":"S",
			            	"price":"200"
			            },{
				            "title":"XL",
				            "price":"300"
				        }
				    ]
				},
	        	{
	            	"title": "Drop Down",
	            	"type": "select",
	            	"required": false,
	            	"options": [{
			            	"title":"Option 1",
			            	"price":"12"
			            },{
				            "title":"Option 2",
				            "price":"10"
				        }
			        ]
			    },
	        	{
	            	"title": "Text input",
	            	"type": "text",
	            	"required": false,
	            	"options": []
	            },
	        	{
	            	"title": "File",
	            	"type": "upload",
	            	"required": false,
	            	"options": []
	            },
	        	{
	            	"title": "Multi",
	            	"type": "checkbox",
	            	"required": false,
	            	"options": [{
		            	"title": "Option #1",
		            	"price": "1"
		            },{
			            "title": "Option #2",
			            "price": "2"
			        },{
				        "title": "Option #3",
				        "price": "3"
				    }]
				},
	        	{
	            	"title": "Radio",
	            	"type": "radio",
	            	"required": false,
	            	"options": [{
		            	"title": "Radio value #1",
		            	"price": "1"
		            },{
			            "title": "Radio value #2",
			            "price": "2"
			        }]
			    },
	        	{
	            	"title": "Package",
	            	"type": "pack",
	            	"required": true,
	            	"options": [{
		            	"title": "Package 1",
		            	"price": "10"
		            }]
			    }
        	],
			
			sum : function (){
				
				var price = Object.values(lumise.cart.price).filter(
					price => typeof price !== 'object' && parseFloat(price) > 0
				);
				
				if (price.length > 0)
					price = price.reduce((a, b) => parseFloat(a) + parseFloat(b));
				else price = 0;
				
				price += (
					Object.keys(lumise.cart.price.template).length > 0 &&
					Object.values(lumise.cart.price.template).filter(price => parseFloat(price)).length > 0 ? 
					Object.values(lumise.cart.price.template).
					   filter(price => parseFloat(price) >= 0).
					   reduce((a, b) => parseFloat(a) + parseFloat(b)) : 
					0
				);
					
				return  price;
			},
			
			get_price : function (f){
				
				var price 		= 0, 
					sum 		= lumise.cart.sum(),
					qty 		= 0;
					
				
				// if(lumise.cart.qtys.length > 0){
				// 	for(var i in lumise.cart.qtys){
				// 		price += (
				// 			sum + 
				// 			lumise.cart.qtys[i].price + 
				// 			lumise.cart.printing.calc(lumise.cart.qtys[i].qty)
				// 		) * lumise.cart.qtys[i].qty;
				// 		qty += lumise.cart.qtys[i].qty;
				// 	}
				// }else{
				// 	price = (sum + lumise.cart.printing.calc(lumise.cart.qty)) * lumise.cart.qty;
				// 	qty = lumise.cart.qty;
				// }
				
				if( lumise.cart.qtys.length > 0 ){
					var total 		= 0,
						subtotal	=0;
						
					for( var i in lumise.cart.qtys ){
						price += ( sum + lumise.cart.qtys[i].price + lumise.cart.printing.calc( lumise.cart.qty ) ) * lumise.cart.qtys[i].qty;
					}
					
				}else price = ( sum + lumise.cart.printing.calc( lumise.cart.qty ) ) * lumise.cart.qty;
				
				return f === true ? [price, lumise.cart.qty] : price;
				
			},

			init : function () {

				if(lumise.onload == undefined)
					lumise.cart.render();

				/*
					add actions
				*/
				lumise.actions.add('product', lumise.cart.render);
				/*
					update printing price when objects changed
				*/
				lumise.actions.add('updated', function (data){
					
					clearTimeout(lumise.cart.timer);
					
					lumise.cart.timer = setTimeout(function (){
							lumise.cart.calc(data);
					}, 300);
					
				});
				
				lumise.actions.add('checkout', lumise.cart.checkout);

				$('#lumise-cart-action').on('click', function(e){
					
					lumise.cart.add_cart('button add cart click');
					
					e.preventDefault();
				});
				
				lumise.render.cart_change();

			},
			
			add_cart : function(e) {
				
				var values = [],
					invalids = [],
					invalid_fields = [];
					
				Object.keys(lumise.cart.data.options).map(function (i){
					values.push(lumise.cart.data.options[i].name);
				});
				
				var design = lumise.func.export('cart'),
					id = lumise.func.url_var('cart', new Date().getTime().toString(36).toUpperCase()),
					cart_data = localStorage.getItem('LUMISE-CART-DATA') || '{}',
					has_design = 0, data,
					price = lumise.cart.get_price();

				design.id = id;
				
				/*
				*	Check design empty
				*/
				
				Object.keys(lumise.data.stages).map(function(s){
					if(typeof lumise.data.stages[s] !== 'undefined' && typeof lumise.data.stages[s].canvas !== 'undefined'){
						var canvas = lumise.data.stages[s].canvas,
							objs = canvas.getObjects();
							
						objs.map(function (obj){
							if(obj.evented == true) has_design++;
						});
					}
				});
				
				if (has_design === 0){
					lumise.func.notice(lumise.i(96), 'error');
					return false;
				};
				
				if(
					lumise.data.printings.length > 0 && 
					lumise.cart.printing.current === null
				){
					invalid_fields.push(
						$('.lumise-prints').find('.lumise-cart-field-printing-tmpl')[0]
					);
					$('.lumise-prints').find('.lumise-cart-field-printing-tmpl .lumise-required-msg').html(lumise.i(99));
				};
				
				if (lumise.cart.qty == 0){
					invalid_fields.push(
						$('.lumise-cart-attributes').find('.lumise-cart-field-size-tmpl,.lumise-cart-field-pack-tmpl')[0]
					);
					$('.lumise-cart-attributes').find('.lumise-cart-field-size-tmpl .lumise-required-msg, .lumise-cart-field-pack-tmpl .lumise-required-msg').html(lumise.i(103));
				};
				
				if (lumise.ops.product_data.min_qty !== '' && parseInt(lumise.ops.product_data.min_qty) > lumise.cart.qty) {
					invalid_fields.push(
						$('.lumise-cart-attributes').find('.lumise-cart-field-size-tmpl')[0]
					);
					$('.lumise-cart-attributes').find('.lumise-cart-field-size-tmpl .lumise-required-msg').html(lumise.i(149)+' : '+lumise.ops.product_data.min_qty);
				}
				
				if (
					lumise.ops.product_data.max_qty !== '' && 
					lumise.ops.product_data.max_qty != '0' && 
					parseInt(lumise.ops.product_data.max_qty) < lumise.cart.qty
				) {
					invalid_fields.push(
						$('.lumise-cart-attributes').find('.lumise-cart-field-size-tmpl')[0]
					);
					$('.lumise-cart-attributes').find('.lumise-cart-field-size-tmpl .lumise-required-msg').html(lumise.i(150)+' : '+lumise.ops.product_data.max_qty);
				}
				
				/*
				*	check valid attributes
				*/
				
				$('.lumise-cart-attributes').find('.lumise-cart-param').each(function (ind){
					var field = $(this),
						wrp_field = 
						name = field.attr('name'),
						found = false;
					
					if( field.prop( 'required' )){
						if(
							values.indexOf(name) === -1 &&
							invalids.indexOf(name) === -1
						){
							invalids.push(name);
							invalid_fields.push(field.closest('.lumise-cart-field')[0]);
							field.closest('.lumise-cart-field').find('.lumise-required-msg').html(lumise.i(102));
						}
            		}
				});
				
				if(invalid_fields.length > 0){
					var wrp_options = $('#lumise-cart-wrp'),
						pos = invalid_fields[0].offsetTop;
						
					wrp_options.animate({scrollTop: pos - 40}, 400);
					return false;
				};
				
				cart_data = JSON.parse(cart_data);
				
				data = {
				    'product_data' : $.extend(true, {}, lumise.ops.product_data),
				    'price_total' : price.toFixed(2),
				    'updated' : new Date().getTime(),
				    'id' : id,
				    'template' : {
				        'stages' : lumise.cart.template,
				        'price' : lumise.cart.price.template
				    },
				    'color' : lumise.get.color(),
				    'color_name' : lumise.get.color_name(),
				    'states_data' : lumise.cart.printing.states_data
				};
				
				design['template'] = {
					'stages' : lumise.cart.template,
					'price' : lumise.cart.price.template
				};
				
				lumise.cart.data = $.extend(true, data, lumise.cart.data);
				
				cart_data[id] = lumise.func.enjson(lumise.cart.data);
				
				localStorage.setItem('LUMISE-CART-DATA', JSON.stringify(cart_data));
				
				lumise.func.set_url('cart', id);
				lumise.func.set_url('draft', null);
				lumise.indexed.save([design], 'cart');
				
				delete design;
				delete cart_data;
				
				lumise.render.cart_change();
				
				lumise.get.el('update-cart-confirm').show();
				
				lumise.actions.do('add-cart', id); 
				
				if (typeof e.preventDefault == 'function')
					e.preventDefault();
				
				return true;
				
			},
			
			calc : function (states_data) {
				
				if(states_data == undefined)
					states_data = lumise.cart.printing.states_data;
				else
					lumise.cart.printing.states_data = states_data;
				
				lumise.cart.data = {
					options : [],
					printing : lumise.cart.printing.current,
					states_data : lumise.cart.printing.states_data
				};
				
				var price = 0,
					attributes = {},
					attribute = [],
					qty = 0,
					cart_options = lumise.cart.data.options,
					values = $('.lumise-cart-attributes').find('.lumise-cart-param').serializeArray(),
					keys = [];

				lumise.cart.qtys = [];

				values.map(function (param){

					var key = param.name,
						val = param.value,
						field_name = '',
						pr = op_pr = tval = 0,
						val_attr = null,
						attr;

					if (param.name.indexOf('|') > -1){
						if(val == 0)
							return;
							
						var p = param.name.split('|');

						tval = parseInt(val);
						key = p[0];
						val = p[1];
					};

					if (lumise.cart.price_rule[key] == undefined) 
						return;

					attr = lumise.cart.price_rule[key];
					
					keys.push(key);
					
					field_name = encodeURIComponent(attr.name);

					if (typeof attributes[field_name] == 'undefined')
						attributes[field_name] = {
							type : attr.type,
							value : [],
							name : attr.name 
						};
						
					if (attr.options !== undefined && attr.options.length > 0){
						
						op_pr = 0;
						
						for (var i in attr.options){
							pr = parseFloat(attr.options[i].price);
							if(pr == NaN) return;
							//if(tval > 0) pr = tval*pr;
							if(attr.options[i].value == val && pr > 0){
								op_pr = pr;
							}
						};

						if ( attr.type == 'size' ){
							
							if( typeof attr['quantity'] === 'undefined' ) {
								lumise.cart.qtys.push({
									price : op_pr,
									qty : parseInt(param.value)
								});
							}
							qty += parseInt(param.value);
							val += (val !== '' ? '-' : '') + parseInt(param.value);
						};
						
						if ( attr.type == 'pack' ){
							qty += param.value;
						};
						
						param.name = key + '|';

						if (val !== '')
							param.name += lumise.cart.slug(val, true);
						
						price += (attr.type !== 'size' && attr.type !== 'pack') ? op_pr : 0;
						
						attributes[field_name].value.push(lumise.cart.slug(val, true));
					}
					else
					{
						
						if(val !== ''){
							attributes[field_name].value = lumise.cart.slug(val, true);
						} else delete attributes[field_name];
					}

				});

				for (var field in attributes){
					
					var chk = cart_options.filter(function(op){
						return op.name == attributes[field].name;
					});
					
					if (chk.length > 0) {
						chk[0].value = attributes[field].value;
					}else{
						cart_options.push(attributes[field]);
					}
					
				}
				
				Object.keys(lumise.ops.product_data.attributes).map(function(key){
					if(keys.indexOf(key) === -1) delete lumise.ops.product_data.attributes[key]['value'];
				});
				
				Object.keys(lumise.data.stages).map(function(s){
					if(typeof lumise.data.stages[s] !== 'undefined' && typeof lumise.data.stages[s].canvas !== 'undefined'){
						var canvas = lumise.data.stages[s].canvas,
							res_count = 0;

						objs = canvas.getObjects();
						
						objs.map(function (obj){
							if(obj.evented == true){
								res_count++ ;
								if(typeof obj.price !== 'undefined' && obj.price > 0)
									price += parseFloat(obj.price);
							}
						});
						
						if(res_count === 0){
							lumise.cart.template[s] = 0;
							lumise.cart.price.template[s] = 0;
						}
					}
				});
				
				lumise.cart.price.attr = price;
				lumise.cart.qty = qty;

				lumise.cart.display();
				
			},
			
			checkout: function(data) {
				
				var items = [];

	            Object.keys(data).map(function(key) {
	                data[key].product_id = data[key].product_data.id;
	                if(data[key].product_data.product !== '' ){
	                    data[key].cms_id = data[key].product_data.product;
	                    
	                }else
	                    data[key].cms_id = 0;
	                data[key].product_name = data[key].product_data.name;
	            });
	            
	            data = lumise.func.enjson(data);//.match(/.{1,1000000}/g);
	            
	            $('div#LumiseDesign').attr({
					'data-processing': 'true', 
					'data-msg': '0% complete'
				});
				
				var boundary = "---------------------------7da24f2e50046";
				var body = '--' + boundary + '\r\n'
				         + 'Content-Disposition: form-data; name="file";'
				         + 'filename="temp.txt"\r\n'
				         + 'Content-type: plain/text\r\n\r\n'
				         + data + '\r\n'+ '--'+ boundary + '--';
				         
				$.ajax({
				    contentType: "multipart/form-data; boundary="+boundary,
				    data: body,
				    type: "POST",
				    url: lumise.data.ajax+'&action=upload&ajax=frontend&nonce=LUMISE-SECURITY:'+lumise.data.nonce,
				    xhr: function() {
					    var xhr = new window.XMLHttpRequest();
					    xhr.upload.addEventListener("progress", function(evt){
					      if (evt.lengthComputable) {
					        var percentComplete = evt.loaded / evt.total;
					        if (percentComplete < 1)
					       		$('div#LumiseDesign').attr({'data-msg': parseInt(percentComplete*100)+'% upload complete'});
					       	else $('div#LumiseDesign').attr({'data-msg': lumise.i(159)});
					      }
					    }, false);
					    return xhr;
					},
				    success: function (res, status) {
					    
					    $('div#LumiseDesign').attr({'data-msg': 'Redirecting..'});

              console.log(res);
              debugger;
					    res = JSON.parse(res);
					    
					    if (res.success !== undefined) {
						    $('<form>', {
				                "id": "lumise-checkout",
				                "method": "POST",
				                "html": '<input type="hidden" name="file" value="'+res.success+'"/>\
				                		 <input type="hidden" name="datalen" value="'+data.length+'"/>\
				                		 <input type="hidden" name="action" value="process"/>\
				                		 <input type="hidden" name="nonce" value="LUMISE-SECURITY:'+lumise.data.nonce+'"/>',
				                "action": lumise.data.checkout_url
				            }).appendTo(document.body).submit();
					    } else {
						    alert('Error: could not checkout this time');
					    }
				    },
				    error: function() {
					    alert('Error: could not checkout this time');
				    }
				});
	            
	        },
			
			/*
			* @param data - Product object
			*/

			render : function (data) {
				
				var has_size = false, 
					attr = {};
					
				this.attr_tmpls = $('.lumise-cart-fields-tpml');
				lumise.cart.price_rule = {};
				
				$('#lumise-cart-wrp .lumise-cart-attributes').html('');
				
				if (typeof data !== 'undefined') {
					
					lumise.cart.price.base = parseFloat(data.price);
					this.attributes = data.attributes;
					
					var cart = JSON.parse(localStorage.getItem('LUMISE-CART-DATA')),
					cur = lumise.func.url_var('cart', '');
					
					if (cur !== '' && cart[cur] !== undefined) {
						var ch = lumise.func.dejson(cart[cur]);
						if (ch.product_data.id != data.id) {
							ch.product_data = data;
							cart[cur] = lumise.func.enjson(ch);
							localStorage.setItem('LUMISE-CART-DATA', JSON.stringify(cart));
						}
					}
					
				}else return;
				
				this.attributes.map(function (attr){
					
					if (attr.value === undefined)
						attr.value 	= '';
						
					attr.name = lumise.cart.slug(attr.name);

					if (attr.type == 'size' || attr.type == 'pack')
						has_size = true;
						
					$('.lumise-cart-attributes').append(lumise.cart.fields.render(attr));
					
					lumise.cart.price_rule[attr.name] = attr;
					
				});
				
				if (!has_size){
					attr = {
						title: lumise.i(66),
						label: lumise.i(66),
						type: 'size',
						name: lumise.cart.slug('Quantity'),
						required: true,
						quantity: true,
						options: [
							{
								title: '',
								value: 1,
								price: 0
							}
						]
					};
					lumise.cart.price_rule[attr.name] = attr;
					$('.lumise-cart-attributes').append(lumise.cart.fields.render(attr));
				}

				lumise.trigger({
					el: $('.lumise-cart-attributes'),
					events : {
						'.lumise-cart-param:change' : 'calc_cart'
					},
					calc_cart : function (e){
						
						$(e.target).closest('.lumise-cart-field').find('.lumise-required-msg').html('');
						
						lumise.cart.calc();
						lumise.render.cart_change();
						lumise.actions.do('cart-changed', true);
					}
				});
				
				lumise.cart.printing.render();
				lumise.cart.calc();
				
				lumise.trigger({
					el : $('.lumise-add-cart-btn'),
					events : {
						':click' : 'submit_cart'
					},
					submit_cart : function (e){
						var form = $('#lumise-cart-form');

						form.find('input[name=data]').val(JSON.stringify(lumise.cart.data));
						form.find('input[name=product]').val(lumise.data.product);
						form.submit();
					}
				});

				lumise.trigger({

					el : $('#lumise-cart-wrp'),

					events : {
						'.lumise-cart-field-upload-tmpl' : 'field_file',
						'input[data-view="browse"]:change' : 'select_file'
					},
					
					field_file : function(e) {
						var act = e.target.getAttribute('data-act');
						if (!act)return;
						switch (act) {
							case 'remove' : 
								e.data.remove_file(e.target);
							break;
						} 	
					},
					
					select_file : function(e) {

						var wrp = $(this).closest('.lumise_form_content'),
							input = wrp.find('.lumise-cart-param');
							display = wrp.find('span[data-view="info"]');

						if (this.files && this.files[0]) {
							if (!lumise.cart.validate_file(this.files[0]))
								return alert('Error: Invalid upload file');

							var reader = new FileReader();
							reader.file = this.files[0];
							reader.onload = function (e) {

								if (input.get(0)) {
									var data = {
										data: e.target.result,
										size: this.file.size,
										name: this.file.name,
										type: this.file.type ? this.file.type : this.file.name.split('.').pop()
									};
									wrp.find('span[data-view="info"]').remove;
									wrp.prepend(
										'<span data-view="info">'+
											this.file.name+
											'<i class="lumisex-android-close" data-act="remove"></i>\
										</span>'
									);
									input.val(lumise.func.enjson(data));
									input.trigger('change');
									
									delete reader.file;
									delete reader;
									
								}

							};

							reader.readAsDataURL(this.files[0]);
							
						}
					},
					
					remove_file : function(el) {
						
						var wrp = $(el).closest('.lumise_form_content');
						wrp.find('.lumise-cart-param').val('').trigger('change');
						wrp.find('span[data-view="info"]').remove();
						
					}
					
				});

			},

			validate_file : function(file) {
				if (['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'application/zip', 'text/plain', '.docx'].indexOf(file.type) === -1)
					return false;
				if (file.size > 5242880)
					return false;
				return true;
			},

			slug : function (str, decode){
				if(decode == undefined)
					return encodeURIComponent(str);
				else
					return decodeURIComponent(str);
			},

			fields : {

				select : function(data){

					data.type = 'select';
					var field = this.template(data);

					if(data.multiple !== undefined && data.multiple)
						field.inp.attr('multiple','multiple');

					if(data.options == undefined || data.options.length == 0)
						data.options = [{value:'', title:' - Default - '}];
					
					if (!data.value)
						data.value = [];
					else if (typeof data.value == 'string')
						data.value = data.value.split(',');
					
					data.options.map(function (option){

						var price = !option.price? '': option.price;

						if(option.price == NaN)
							option.price = price = 0;

						if(parseFloat(option.price) > 0){
							option.price = parseFloat(price);
							price = ' + ' + lumise.func.price(parseFloat(price));
						}

						option.value = lumise.cart.slug(option.title);

						field.inp.append(
							'<option'+(data.value.indexOf(option.title) > -1 ? ' selected' : '')+
								' value="' + 
								option.value + '">' + option.title + price + 
							'</option>'
						);
						
					});

					return field.el;
				},

				text : function(data) {

					var field = this.template(data);
					field.inp.val(lumise.cart.slug(data.value, true));

					return field.el;
				},

				radio : function(data) {
					
					var field = this.template(data),
						wop = field.el.find('.lumise_radios'),
						fel = field.el.find('.lumise-radio');
					
					if (!data.value)
						data.value = [];
					else if (typeof data.value == 'string')
						data.value = data.value.split(',');
					
					for(var i in data.options){

						var option = data.options[i],
							new_op 	= fel.clone(),
							label 	= new_op.find('.lumise-cart-option-label'),
							inp 	= new_op.find('input'),
							price = option.price;

						if(option.price == NaN)
							option.price = price = 0;

						if(option.price > 0){
							option.price = parseFloat(price);
							price = ' + ' + lumise.func.price(parseFloat(price));
						}

						option.value		= lumise.cart.slug(option.title);
						label[0].firstChild.nodeValue = option.title + price;

						label.attr('for', data.name + '-' + option.value);
						inp.attr('name', data.name).attr('id', data.name + '-' + option.value).val(option.value);
						
						if (data.value.indexOf(option.title) > -1)
							inp.attr({'checked': true});
						
						wop.append(new_op);

					}

					$(fel).remove();
					return field.el;
				},

				checkbox : function(data) {
					
					var field = this.template(data),
						wop = field.el.find('.lumise_checkboxes'),
						fel = field.el.find('.lumise_checkbox');
					
					if (!data.value)
						data.value = [];
					else if (typeof data.value == 'string')
						data.value = data.value.split(',');
					
					for(var i in data.options){

						var option = data.options[i],
							new_op 	= fel.clone(),
							label 	= new_op.find('.lumise-cart-option-label'),
							inp 	= new_op.find('input'),
							price = option.price;

						if(option.price == NaN)
							option.price = price = 0;

						if(option.price > 0){
							option.price = parseFloat(price);
							price = ' + ' + lumise.func.price(parseFloat(price));
						}

						option.value = lumise.cart.slug(option.title);
						label[0].firstChild.nodeValue = option.title + price;

						label.attr('for', data.name + '-' + option.value);
						inp.attr('name', data.name).attr('id', data.name + '-' + option.value);
						inp.attr('value', option.value);
						
						if (data.value.indexOf(option.title) > -1)
							inp.attr({'checked': true});
						
						wop.append(new_op);

					}

					$(fel).remove();
					return field.el;
				},

				size : function(data) {
					
					var field = this.template(data),
						wop = field.el.find('.lumise_form_content'),
						fel = field.el.find('.lumise-cart-field-quantity');
					
					if (!data.value)
						data.value = [];
					else if (typeof data.value == 'string')
						data.value = data.value.split(',');
					
					//render options
					data.options.map(function (option, ind){
						
						var new_op = fel.clone(),
							size_name = lumise.cart.slug(option.title),
							min = '',
							max = '';

						option.value = lumise.cart.slug(option.title);
						
						new_op.find('.lumise-cart-field-label').html(
							option.title + 
							((parseFloat(option.price) > 0)? ' + ' + lumise.func.price(parseFloat(option.price).toFixed(2)) : '')
						);
						
						new_op.find('input').attr({'name': data.name + '|' + size_name}).val((ind == 0)? 1 : 0);
						
						if (option.min_quantity !== undefined && option.min_quantity !== '' && !isNaN(parseInt(option.min_quantity))) {
							new_op.find('input').attr('min', option.min_quantity);
							min = parseInt(option.min_quantity);
						};
						
						if (option.max_quantity !== undefined && option.max_quantity !== '' && !isNaN(parseInt(option.max_quantity))) {
							new_op.find('input').attr('max', option.max_quantity);
							max = parseInt(option.max_quantity);
						};
						
						data.value.map(function(val) {
							
							if(val.indexOf('-') > -1){
								val = val.split('-');
								var qty = val[val.length-1],
									name = val.slice(0, -1);
								if (name.join('-') === size_name) new_op.find('input').val(qty);
							}else new_op.find('input').val(val);
							
						});
						
						wop.append(new_op);
						
						new_op.find('input').on('input', function(){
							
							var v = parseInt(this.value);
							
							if (isNaN(v))
								v = 1;
								
							if (min !== '' && min > v)
								v = parseInt(min);
						
							if (max !== '' && max < v)
								v = max;
								
							this.value = v;
							
						}).trigger('input');
						
						new_op.find('em[data-action]').on('click', function (){
							
							var action = $(this).data('action'),
								wrp = $(this).closest('.lumise-cart-field-quantity'),
								inp = wrp.find('.lumise-cart-field-value input'),
								val = parseInt(inp.val());

							switch (action) {
								case 'minus':
									val--;
									break;

								default:
									val++;
							}
							
							if (val < 0)
								val = 0;
								
							if (inp.attr('min') !== undefined && parseInt(inp.attr('min')) > val)
								val = parseInt(inp.attr('min'));
							
							if (inp.attr('max') !== undefined && parseInt(inp.attr('max')) < val)
								val = parseInt(inp.attr('max'));
								
							inp.val(val);
							inp.trigger('change');
							
						});

					});

					$(fel).remove();
					return field.el;
				},

				upload : function (data){

					var field = this.template(data);
					
					if (data.value && data.value !== '') {
						field.inp.val(data.value);
						var inf = lumise.func.dejson(data.value);
						field.inp.parent().prepend(
							'<span data-view="info">'+
								inf.name+
								'<i class="lumisex-android-close" data-act="remove"></i>\
							</span>'
						);
					}

					return field.el;
				},
				
				pack : function (data){
					
					var field = this.template(data),
						radios = '<div class="lumise_radios">';
					
					data.options.map(function(op){
						radios += '<div class="lumise-radio">\
                			<input type="radio" '+(
	                			data.value.indexOf(op.price) > -1 ? 'checked' : ''
                			)+' class="lumise-cart-param" name="'+data.name+'" value="'+op.price+'" id="'+data.name+'-'+op.price+'">\
			                <label class="lumise-cart-option-label" for="'+data.name+'-'+op.price+'">\
			                	<strong>'+op.price+'</strong>'+(op.title.trim() !== '' ? ' ('+op.title+')' : '')+
			                	' <em class="check"></em>\
			                </label>\
							<em class="lumise-cart-option-desc"></em>\
			            </div>';	
					});
					field.el.find('.lumise_form_content').append(radios);
					return field.el;
				},

				template : function (data){

					var field_tpml = lumise.cart.attr_tmpls.find('.lumise-cart-field-' + data.type + '-tmpl').clone(),
						label = field_tpml.find('.lumise-cart-field-label'),
						inp = field_tpml.find('.lumise-cart-param');

					label.html((data.label ? data.label : data.title)+': '+(data.required ? '<em class="required">*</em>' : '') + ' <em class="lumise-required-msg"></em>');

					inp.attr('name', data.name);
					
					if(!data.required) inp.removeAttr("required");
					
					return {el: field_tpml, inp:inp, label : label};
				},

				render : function(data) {

					return lumise.cart.fields[data.type](data);

				}

			},

			display : function () {
				
				var price = lumise.cart.get_price(true);
				
				$('.lumise-product-price').html(
					lumise.func.price(price[0].toFixed(2))
				);
				$('#lumise-product-attributes .lumise-product-price').append(
					'<avg>\
						<strong>'+
						lumise.i(156)+
						':</strong> '+
						(lumise.func.price((price[0]/price[1]).toFixed(1)))+'/'+lumise.i(157)+
					'</avg>'
				);
			},

	        printing : {

				price : 0,

				states_data : {},

				current : null,

				render : function (val){
					
					lumise.cart.printing.price = 0;
					lumise.cart.printing.current = null;
					
					//remove all attributes
					$('#lumise-cart-wrp .lumise-prints').html('');
					if (!lumise.data.printings || lumise.data.printings.length === 0)
						return;

					var data = {
							title: lumise.i(64),
							name : 'printing',
							type : 'printing'
						},
						field = lumise.cart.fields.template(data),
						wop = field.el.find('.lumise_radios'),
						fel = field.el.find('.lumise-radio'),
						first_inp = null;

					lumise.data.printings.map(function (print, index){
						
						var new_op 	= fel.clone();
						
						print.thumbnail =  print.thumbnail || lumise.data.assets + 'assets/images/print-default.jpg';
						
						new_op.find('.lumise-cart-option-label').attr('for', 'lumise-printing-' + print.id)
						.html(
							'<div class="lumise-cart-option-thumb"><img src="'+print.thumbnail+'" alt=""/></div>' + 
							'<div class="lumise-desc"><span>' + print.title + '</span>' +
							' <a href="#" class="lumise-color lumise-print-detail" data-id="'+print.id+'">'+ lumise.i(68) +'</a></div>'
						);

						new_op.find('input').attr('name', 'printing')
						.attr({'id': 'lumise-printing-' + print.id, 'data-id': print.id})
						.val(print.id);
						
						lumise.trigger({
							el : new_op,
							events : {
								'a.lumise-print-detail' : 'price_table',
								'input:change' : 'select_printing',
							},
							price_table : function (e){
								
								e.preventDefault();
								
								var table_content = qkey = '', qkeys = [], qkeyind,
									print_id = this.getAttribute('data-id'),
									print = lumise.data.printings.filter(function (print){
										if(print.id == print_id)
											return print;
									})[0],
									tab_nav = '<ul class="lumise_tab_nav ' + ((print.calculate.multi) ? '': 'hidden') +'">';
								
								lumise.tools.lightbox({
									content: '<div class="lumise_content lumise_wrapper_table">\
												<h3 class="title">'+lumise.i(67)+' : ' + print.title +'</h3>\
												<div id="lumise-print-detail">\
													<i class="lumise-spinner x3 margin-2"></i>\
												</div>\
											</div>'
								});
								
								lumise.post({
									action: 'print_detail',
									id: print_id
								}, function(res) {
									
									res = JSON.parse(res);
									
									$('#lumise-print-detail').html('<div>'+res.description+'</div><br>');
									
									if (res.calculate !== undefined) {
										
										for (var i in print.calculate.values){
		
											if (print.calculate.multi) {
												tab_nav += '<li class=><a href="#" data-side="'+i+'">'+(
													lumise.ops.product_data.stages[i].label !== undefined &&
													lumise.ops.product_data.stages[i].label !== '' ?
													lumise.ops.product_data.stages[i].label :
													lumise.i('_'+i)
												)+'</a></li>';
												table_content += '<div class="lumise_tab_content" data-lumise-tab="'+i+'">'
											};
		
											table_content += '<table>\
													<thead>\
														<tr>\
															<th>'+lumise.i(66)+'</th>';
																		
											for (var r in 
												print.calculate.values.front[Object.keys(print.calculate.values.front)[0]]) {
													table_content += '<th>'+decodeURIComponent(r)+'</th>';
											};
											
											table_content += '</tr></thead><tbody>';
											
											qkeys = Object.keys(print.calculate.values[i]);
											
											for (var r in print.calculate.values[i]){
												qkeyind = qkeys.indexOf(r);
												
												qkey = (typeof qkeys[qkeyind-1] !== 'undefined') ? 
													((r.indexOf('>') > -1)? r : 
													(parseInt(qkeys[qkeyind-1]) + 1) + ' - ' + r) : 
													'0' + ' - ' +r;
												
												table_content += '<tr><td>'+qkey+'</td>';
		
												for (var td in print.calculate.values[i][r]) {
													table_content += '<td>' +
																	 ((print.calculate.values[i][r][td]*1>0) ? 
																	 lumise.func.price(print.calculate.values[i][r][td]) :
																	 lumise.i(100))+ '</td>';
												};	
												table_content += '</tr>';
											};
		
											table_content += '\
												</tbody>\
												</table>';
		
											if (print.calculate.multi)
												table_content += '</div>';
		
										};
										
										tab_nav += '</ul>';
										
										var elm = $('#lumise-print-detail');
										
										elm.append(tab_nav+table_content);
		
										lumise.trigger({
											el : elm,
											events : {
												'.lumise_tab_nav a:click' : 'active_tab'
											},
											active_tab : function (e){
												
												e.preventDefault();
												
												elm.find('li').removeClass('active');
												elm.find('[data-lumise-tab]').removeClass('active');
												$(this).closest('li').addClass('active');
												elm.find('[data-lumise-tab=' +$(this).
													addClass('active').data('side')+ ']').
													addClass('active');
											}
										});
										
										elm.find('.lumise_tab_nav a:first').trigger('click');
										
									}
									
								});
								
							},
							select_printing : function (e){
								lumise.cart.printing.current = parseInt($(this).val());
								lumise.cart.calc();
							}
						});

						wop.append(new_op);

						if(print.active === true)  {
							lumise.cart.printing.current = print.id;
						}
					});
					
					$(fel).remove();
					$('.lumise-prints').append(field.el);
					
					if(lumise.cart.printing.current > 0){
						$('#lumise-printing-'+lumise.cart.printing.current).trigger('click');
					}
						

				},

	            calc : function (qty) {

	                if(
						lumise.data.printings.length == 0 ||
						lumise.cart.printing.current == null
					){
						return 0;
					}

	                var print = null,
						rules = {},
						stage = '',
	                    qtys = [],
	                    rule = [],
	                    price = 0,
						colors = [],
						states_data = lumise.cart.printing.states_data,
						print_type = '',
						index = -1,
						total_res = 0;

					lumise.data.printings.map(function (p){
						if(lumise.cart.printing.current == p.id){
							print = p;
							print_type = p.calculate.type;
							rules = print.calculate.values;
						}
					});
					
					if(typeof rules === 'undefined') return;

                    for(var s in states_data){

						stage = s;

						if(!print.calculate.multi){
							stage = Object.keys(rules)[0];
						}
							

                        qtys = Object.keys(rules[stage]);

						if(qtys.length == 0) continue;

						qtys.sort(function(a, b){return parseInt(a)-parseInt(b)});

						for(var i=0; i < qtys.length; i++){
							if(
								(
									!isNaN(qtys[i]) && 
									parseInt(qtys[i]) < qty
								) ||
								
								(
									isNaN(qtys[i]) &&
									qtys[i].indexOf('>') > -1 &&
									(parseInt(qtys[i].replace('>')) + 1) <= qty
								)
							){
								index = i;
							}
						}
							
							
						if(qtys[index+1] !== undefined )
							rule = rules[stage][qtys[index+1]];
						else
							rule = rules[stage][qtys[index]];


						total_res = 0;
						
						for(var key in states_data[s]){
							
							var unit = states_data[s][key],
								option = key;
								
							if( 
								print_type == 'color' &&
								key == 'colors' && 
								states_data[s][key].length > 0
							){
								unit = 1;
								option = states_data[s][key].length + '-color';
								option = (rule[option] == undefined) ? 'full-color' : option;
								price += parseFloat(rule[option]);
							}
							
                            if(
								print_type !== 'color' &&
								typeof rule[option] !== 'undefined'
							){
                                price += rule[option] * unit;
							}
							
							if(typeof states_data[s][key] !== 'array' && parseInt(states_data[s][key]) > 0)
								total_res++;
                        }
						
						if(
							print_type == 'size' 
							&& total_res > 0
							&& typeof lumise.ops.product_data['printings_cfg'] !== 'undefined'
						){
							let product_size = lumise.ops.product_data.printings_cfg[lumise.cart.printing.current];
							price += (
								typeof product_size !== 'undefined' &&
								typeof rule[product_size] !== 'undefined'
							)? parseFloat(rule[product_size]) : 0;
							if(!print.calculate.multi) return price;
							
						}
						
						if(print_type == 'fixed' && total_res > 0){
							if(typeof rule['price'] !== 'undefined'){
								price += parseFloat(rule.price);
								if(!print.calculate.multi) return price;
							}
						}
                        
                    }
					return price;
	            }
	        },
	        
	        edit_item : function (id, e) {
		    	
		    	var data = JSON.parse(localStorage.getItem('LUMISE-CART-DATA')), 
		    		cart;
				
				if (data && data[id] !== undefined) {
					cart = lumise.func.dejson(data[id]);
					lumise.get.el('draft-status').html('<span><i class="lumisex-android-alert"></i> '+lumise.i(115)+'</span>');
					lumise.actions.do('cart_edit', lumise.filter('cart_edit', cart));
					delete data;
				};
				
				if (e && typeof e.preventDefault == 'function')
					e.preventDefault();
		    	 
	        },
	        
	        do_checkout : function(e) {
		        
		        try {
		        	
		        	var data = JSON.parse(localStorage.getItem('LUMISE-CART-DATA')),
		        		count = 0, 
		        		get_design = function(res){
			        		count ++;
			        		data[res.id].design = res;
			        		
			        		if (count === Object.keys(data).length) {
				        		lumise.actions.do('checkout', lumise.filter('checkout', data));
			        		}else $('div#LumiseDesign').attr({'data-processing': '', 'data-msg': ''});
			        		
			        	};
		        	
		        	$('div#LumiseDesign').attr({'data-processing': 'true', 'data-msg': lumise.i(44)});
		        		
					Object.keys(data).map(function(key) {
						data[key] = lumise.func.dejson(data[key]);
						lumise.indexed.get(key, 'cart', get_design);
					});
					
		        
		        }catch(ex){console.warn(ex)}
		        
	        }
	        
		},

		load : function() {

			if (typeof LumiseDesign != 'function')
				return;
			
			if (!LumiseDesign(this))
				return;
			
			this.html = document.querySelector('html');
			this.body = document.querySelector('body');

			if (!this.func.get_cookie('lumise-AID'))
				this.func.set_cookie('lumise-AID', Math.random().toString(36).substr(2));

			/* 
			*	Start to load when everything is ready 	
			*/
			
			fabric.Object.prototype.set({
			    cornerSize:  this.mode == 'basic' ? 14 : 22,
			    borderColor: 'rgba(205,205,205,0.5)',
			    centeredRotation: true,
			    centeredScaling: true,
			    rotatingPointOffset: this.mode == 'basic' ? 50 : 0,
			});

			for(var n in this.extends.controls) {
				fabric.Object.prototype[n] = this.extends.controls[n];
			};
			
			for(var n in this.extends.canvas) {
				fabric.Canvas.prototype[n] = this.extends.canvas[n];
			};

			this.actions.add('object:selected', function(opts){

				var selected = [],
					s = lumise.stage();

				if (lumise.func.ctrl_btns(opts) === true)
					return;
				
				if (s.canvas.getActiveObject()) {

					selected.push (s.canvas.getActiveObject());
					lumise.tools.set();

				}else{
					selected = s.canvas.getActiveGroup()._objects;
					lumise.e.tools.attr({'data-view': 'default'});
				}

				lumise.e.layers.find('li[data-id].active').removeClass('active');
				
				if (selected.length === 0)
					return;
				
				s.limit_zone.set('visible', true);
				
				selected.map(function(obj){
					
					if (obj.selectable !== false)
						lumise.e.layers.find('li[data-id="'+obj.id+'"]').addClass('active');

				});
				

			});

			this.actions.add('object:added', function(opts){

				var date = new Date(), obj = opts.target, click = false;

				if (obj.id === undefined)
					obj.set('id', parseInt(date.getTime()/1000).toString(36)+':'+(Math.random().toString(36).substr(2)));
				else if (obj.id.indexOf(':') === -1)
					obj.set('id', parseInt(date.getTime()/1000).toString(36)+':'+obj.id);

				if (obj.origin_src === undefined && obj._element && obj._element)
					obj.set('origin_src', obj._element.src);

				if (obj.type == 'i-text')
					obj.set('padding', 5);
				
				if (obj.evented === false)
					return;
					
				switch (obj.type) {
					case 'i-text':
						obj.set('thumbn', '<i class="lumisex-character layer-type" style="color:%color%;background:%bgcolor%"></i>');
					break;
					case 'curvedText':
						obj.set('thumbn', '<i class="lumisex-vector layer-type" style="color:%color%;background:%bgcolor%"></i>');
					break;
					case 'image':
						
						lumise.func.createThumbn({
				    		source: obj.src,
				    		width: 50,
				    		height: 50,
				    		callback: function(canvas) {
								obj.set('thumbn', '<img class="layer-type" style="background:%color%" src="'+(canvas.toDataURL('image/jpeg'))+'" />');
								if (obj.colors === undefined)
									obj.set('colors', lumise.func.count_colors(canvas, true));
				    		}
			    		});
							
					break;
					case 'qrcode':
						obj.set('thumbn', '<i class="lumisex-qrcode-1 layer-type" style="color:%color%;background:%bgcolor%"></i>');
					break;
					case 'path':
						obj.set('thumbn', '<i class="lumise-icon-graph layer-type" style="color:%color%;background:%bgcolor%"></i>');
					break;
					case 'svg':
						lumise.func.createThumbn({
				    		source: obj.src,
				    		width: 24,
				    		height: 24,
				    		callback: function(canvas) {
								obj.set('thumbn', '<img class="layer-type" style="background:%color%" src="'+(canvas.toDataURL('image/jpeg', .5))+'" />');
				    		}
			    		});
					break;
					default:
						obj.set('thumbn', '<i class="lumise-icon-picture layer-type" style="color:%color%;background:%bgcolor%"></i>');
					break;
				};
				
				lumise.func.font_blob(obj);
				
			});
		
			this.actions.add('selection:cleared', function(){
				lumise.e.tools.attr({'data-view': 'standard'});
				lumise.stage().limit_zone.set('visible', false);
			});

			this.actions.add('key-move', function(e) {

				var canvas = lumise.stage().canvas,
					active = canvas.getActiveObject() || canvas.getActiveGroup();

				if (active) {

					e.preventDefault();

					switch (e.keyCode) {

						case 37 : // left
							active.set('left', active.left - (e.shiftKey ? 10 : 1));
						break;
						case 38 : // up
							active.set('top', active.top - (e.shiftKey ? 10 : 1));
						break;
						case 39 : // right
							active.set('left', active.left + (e.shiftKey ? 10 : 1));
						break;
						case 40 : // down
							active.set('top', active.top + (e.shiftKey ? 10 : 1));
						break;

					}

					canvas.renderAll();
				}
			});

			this.actions.add('key-enter', function(e) {
				return lumise.stage().canvas.deactivateAllWithDispatch().renderAll();
			});

			this.actions.add('key-esc', function(e) {
				if (lumise.stage().canvas.isDrawingMode === true) {
					lumise.get.el('discard-drawing').trigger('click');
				}
			});

			this.actions.add('ctrl-z', lumise.stack.back);

			this.actions.add('ctrl-shift-z', lumise.stack.forward);

            this.actions.add('ctrl-a', function(e) {

				var canvas = lumise.stage().canvas;
				var objs = canvas.getObjects().filter(function(o) {
					if (o.evented === true) {
						o.set('active', true);
						return true;
					} else return false;
				});

				if (objs.length === 0) {
					e.preventDefault();
					return false;
				}

				var group = new fabric.Group(objs, {
				  originX: 'center',
				  originY: 'center'
				});

				canvas._activeObject = null;

				canvas.setActiveGroup(group.setCoords()).renderAll();

				e.preventDefault();
				return false;

			});

			this.actions.add('ctrl-d', function(e) {

				var canvas = lumise.stage().canvas,
					active = canvas.getActiveObject();

				if (active) {
					active.clone(function(c) {
					   	canvas.add(c.set({
						   left: c.left*1.1,
						   top: c.top+(c.left*1.1-c.left),
						   clipTo: function(ctx) {
					            return lumise.objects.clipto(ctx, c);
					        }
						}));
					});

					setTimeout(function(){lumise.stage().canvas.renderAll();}, 150);
					lumise.design.layers.build();

				}

				e.preventDefault();
				return false;

			});

			this.actions.add('ctrl+', function(e) {
				lumise.get.el('zoom').val(parseInt(lumise.get.el('zoom').val())+20).trigger('input');
				e.preventDefault();
				return false;
			});

			this.actions.add('ctrl-', function(e) {
				lumise.get.el('zoom').val(parseInt(lumise.get.el('zoom').val())-20).trigger('input');
				e.preventDefault();
				return false;
			});

			this.actions.add('ctrl-0', function(e) {
				lumise.get.el('zoom').val(100).trigger('input');
				e.preventDefault();
				return false;
			});

            this.actions.add('key-delete', function(e) {

	            var canvas = lumise.stage().canvas,
	            	objs = canvas.getActiveGroup() ? canvas.getActiveGroup()._objects : canvas.getObjects(),
	            	elms = [];

	            objs.map(function(o){
		            if (o.evented === true && o.active === true)
		            	elms.push(o);
	            });

	            lumise.stack.save();
	         	lumise.tools.discard();

	         	elms.map(function(el) {
		         	canvas.remove(el);
	         	});

	            canvas.renderAll();

	            lumise.stack.save();
				lumise.design.layers.build();

            });

			this.actions.add('save', lumise.func.update_state);
			
			this.actions.add('cart_edit', function(data) {
				
				var has_attr_size = false;
				
				$('[data-tool].active').removeClass('active');
				$('.lumise-lightbox').remove();

				lumise.func.set_url('cart', data.id);
				lumise.func.set_url('design_print', null);
				
				data.product_data.attributes.map(function(attr){
					data.options.map(function(op) {
						if (encodeURIComponent(attr.name) == op.name) {
							attr.value = op.value;
							
							if(attr.type === 'size')
								has_attr_size = true;
						}
					});
					
				});
				
				if(!has_attr_size){
					//add more quantity field
					data.options.map(function(op) {
						if (op.type === 'size') {
							
							data.product_data.attributes.push(
								{
									title : 'Quantity',
									label : lumise.i(66),
									type : 'size',
									name : lumise.cart.slug('Quantity'),
									required: true,
									options : [
										{
											title : '',
											value : op.value[0],
											price : 0
										}
									],
									value : op.value
								}
							);
						}
					});
				}
				
				data.product_data.printings.map(function(print){
					if (print.id == data.printing)
						print.active = true;
					else print.active = false;
				});
				
				lumise.func.set_url('design_print', null);
				lumise.func.set_url('order_print', null);
				lumise.func.set_url('draft', 'yes');
				lumise.render.product(data.product_data);
								
				lumise.func.set_url('product', data.product_data.id);
				lumise.data.product = data.product_data.id;
				
				lumise.render.cart_change();
				
			});
			
			this.actions.add('activated_stage', function(){
				
				var _html = '<ul>',
					stage_colors = [];
					
				if(typeof lumise.cart.printing.states_data[lumise.current_stage] !== 'undefined'){
					
					stage_colors = lumise.cart.printing.states_data[lumise.current_stage].colors;
					for (var i=0; i<6; i++) {
						if (stage_colors[i])
							_html += '<li style="background:'+stage_colors[i]+'"></li>';
					}
					
					if (stage_colors.length > 6)
						_html += '<li> &nbsp; '+(stage_colors.length-6)+'+</li>';
				}
				
				_html += '</ul>';
				
				$('#lumise-count-colors').html(_html);
			});
			
			this.actions.add('db-ready', function(){
				
				try {
					var cart_data = JSON.parse(localStorage.getItem('LUMISE-CART-DATA'));
				}catch(ex){
					var cart_data = null;
				};
				
				var has_cart = false;
				
				if (lumise.func.url_var('cart', '') !== '') {
					
					if (cart_data !== null && cart_data[lumise.func.url_var('cart')] !== undefined)
						has_cart = true;
					else lumise.func.notice(lumise.i(120), 'error', 3500);
				
				};
				
				if (has_cart === true) {
					
					lumise.cart.edit_item(lumise.func.url_var('cart'));
					
				}else if (lumise.data.onload) {
					
					$('div#LumiseDesign').attr({
						'data-processing': 'true', 
						'data-msg': lumise.i('importing')+'..'
					});
					
					lumise.func.set_url('cart', null);
					
					setTimeout(function(){
						
						if (lumise.data.share !== undefined) {
							Object.keys(lumise.data.onload.stages).map(function(s){
								delete lumise.data.onload.stages[s].template;
							});
						};
						
						lumise.render.product(lumise.data.onload);
						
						delete lumise.data.onload;
					}, 100);
					
				}else{
					
					$('div#LumiseDesign').attr({'data-processing': '', 'data-msg': ''});
					$('#lumise-no-product').show();
					lumise.func.set_url('cart', null);
					lumise.get.el('change-product').trigger('click');
				}
				
				if (lumise.data.share_invalid !== undefined) {
					lumise.func.confirm({
						title: lumise.data.share_invalid,
						primary: {},
						second: {
							text: 'Ok'
						},
						type: 'error'
					});
				}

			});
			
			this.actions.add('first-completed', function(){
				
				if (lumise.func.url_var('cart', '') != '') {
					
					lumise.get.el('draft-status').html('<span><i class="lumisex-android-alert"></i> '+lumise.i(115)+'</span>');
					
				} else if (lumise.func.url_var('order_print', '') !== '') {
					$('#lumise-draft-status').html(
						'<span>\
							<text>\
								<i class="lumisex-android-alert"></i> '+
								lumise.i(122)+' #'+lumise.func.url_var('order_print')+
							'</text>\
						</span>'
					);
					if (lumise.func.url_var('design_print', '') !== '') {
						$('div#LumiseDesign').attr({'data-processing': 'true', 'data-msg': 'Loading..'});
						$.ajax({
							url: lumise.data.upload_url+'designs/'+lumise.func.url_var('design_print', '')+'.lumi',
							method: 'GET',
							dataType: 'JSON',
							statusCode: {
								403: lumise.response.statusCode[403],
								404: function(){
									lumise.func.notice(lumise.i(123), 'error', 3500);
									$('div#LumiseDesign').attr({'data-processing': '', 'data-msg': ''});
								},
								200: function(res) {
									
									if (res.color !== undefined)
										lumise.data.color = res.color;
										
									lumise.tools.imports(res, function(){
										lumise.get.el('navigations').find('li[data-tool="print"]').trigger('click');
									});
								}
							}
						});
					}
				} else if (lumise.func.url_var('draft') != 'yes') {
					
					lumise.indexed.get(lumise.data.product, 'drafts', function(res){
						if (res !== null && res !== undefined && res.stages !== undefined){
							
							var scrs = '<ul>';
							Object.keys(res.stages).map(function(s){
								scrs += '<li><img src="'+res.stages[s].screenshot+'" /><name>'+s+'</name></li>';
							});
							scrs += '</ul>';
							
							var html = '<span>\
											<text>\
												<i class="lumisex-android-alert"></i> '+
												lumise.i(110)+': '+lumise.func.date('h:m d M, Y', res.updated)+
											'</text>\
											<a href="#load-draft" title="'+lumise.i(112)+'">\
												'+lumise.i(111)+' <i class="lumisex-export"></i>\
												'+scrs+'\
											</a>\
										</span>';
										
							$('#lumise-draft-status').html(html);
							$('#lumise-draft-status a[href="#load-draft"]').on('click', function(e){
								
								e.preventDefault();
								
								if(typeof res['template'] !== 'undefined'){
									lumise.cart.template = res.template.stages;
									lumise.cart.price.template = res.template.price;
								};
								
								lumise.func.set_url('draft', 'yes');
								
								if (res.color !== undefined)
									lumise.data.color = res.color;
									
								lumise.tools.imports(res);
								$('#lumise-draft-status').html(
									'<span style="color:#7cb342">\
										<i class="lumisex-android-checkmark-circle"></i> '+
										lumise.i(113)+
									'</span>'
								);
								
								delete res;
								
							});
							
						}
					});
				} else {
					lumise.actions.do('draft-autosaved');
				}
				
				lumise.func.set_url('share', null);
				
			});
			
			this.actions.add('draft-autosaved', function(){
				
				var txt = '<span>\
						<text>\
							<i class="lumisex-android-alert"></i> '+
							lumise.i(110)+': '+lumise.func.date('h:m d M, Y', new Date().getTime())+
						'</text>';
				
				txt += '<a href="'+window.location.href.replace('&draft=yes','').replace('?draft=yes&','?').replace('?draft=yes','')+'">\
							'+lumise.i(114)+' <i class="lumisex-arrows-ccw"></i>\
						</a>\
					</span>';
					
				$('#lumise-draft-status').html(txt);
				
			});
			
			this.actions.add('cart-changed', function(){
				
				if (lumise.func.url_var('cart', '') === '')
					return;
					
				var html = '<span>\
								<text>\
									<i class="lumisex-android-alert"></i> '+
									lumise.i(116)+': '+lumise.func.date('h:m d M, Y', new Date().getTime())+
								'</text>\
								<a href="#save-cart">\
									'+lumise.i(117)+' <i class="lumisex-android-arrow-forward"></i>\
								</a>\
							</span>';
							
				$('#lumise-draft-status').html(html);
				$('#lumise-draft-status a[href="#save-cart"]').on('click', function(e){
					lumise.cart.add_cart(e);
				});
				
			});
			
			this.actions.add('add-cart', function(){
				
				$('#lumise-draft-status').html(
					'<span>\
						<text style="color:#7cb342">'+lumise.i(118)+'!</text> \
						<a href="#checkout">'+
							lumise.i(75)+' <i class="lumisex-android-arrow-forward"></i>\
						</a>\
					</span>'
				);
				
				$('#lumise-draft-status a[href="#checkout"]').on('click', lumise.cart.do_checkout);
				
			});
			
			[
				['ctrl-o', 'import'],
				['ctrl-s', 'save'],
				['ctrl-e', 'clear'],
				['ctrl-shift-s', 'saveas'],
				['ctrl-p', 'print']
			].map(function(k){
				lumise.actions.add(k[0], function(e) {
					lumise.get.el('navigations').find('li[data-tool="file"] li[data-func="'+k[1]+'"]').trigger('click');
					e.preventDefault();
					e.stopPropagation();
					return false;
				});
			});

			fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
			fabric.Object.prototype.transparentCorners = false;
			
			window.LumiseDesign = null;
			window.indexedDB = window.indexedDB || 
							   window.webkitIndexedDB || 
							   window.mozIndexedDB || 
							   window.OIndexedDB || 
							   window.msIndexedDB; 
			window.URL = window.URL || window.webkitURL;
			window.lumise_add_filter = function(name, callback) {
				if (lumise.filters[name] === undefined)
					lumise.filters[name] = [];
				if (typeof callback == 'function')
					lumise.filters[name].push(callback);
			};
			
			CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
				if (w < 2 * r) r = w / 2;
				if (h < 2 * r) r = h / 2;
				this.beginPath();
				this.moveTo(x+r, y);
				this.arcTo(x+w, y,   x+w, y+h, r);
				this.arcTo(x+w, y+h, x,   y+h, r);
				this.arcTo(x,   y+h, x,   y,   r);
				this.arcTo(x,   y,   x+w, y,   r);
				this.closePath();
				return this;
			};
					
			window.addEventListener('message', function(e) {
				
				if (e.origin != 'https://services.lumise.com')
					return;
		
				if (e.data && e.data.action) {
					switch (e.data.action) {
						case 'close_lightbox' :
							$('#lumise-lightbox').remove();
						break;
						case 'import_image' :
							var id = parseInt(new Date().getTime()/1000).toString(36)+':'+Math.random().toString(36).substr(2);
							if (e.data.ops.name.indexOf('/') > -1)
								e.data.ops.name = e.data.ops.name.split('/').pop();
							lumise.cliparts.import(id, e.data.ops, 'prepend');
						break;
						case 'add_image' : 
							lumise.func.preset_import([{type: 'image', url: e.data.url}]);
						break;
						case 'preview_image': 
							lumise.get.el('x-thumbn-preview').show().find('>div').html('<img src="'+e.data.ops.url+'" />');
							lumise.get.el('x-thumbn-preview').find('>header').html(
								(e.data.ops.name ? e.data.ops.name : e.data.ops.url.split('/').pop().substr(0, 50))
							);
							if (e.data.ops.tags !== '')
								lumise.get.el('x-thumbn-preview').find('>footer').show().html(e.data.ops.tags);
						break;
						case 'close_preview_image': 
							lumise.get.el('x-thumbn-preview').hide();
						break;
						case 'fonts' :
							lumise.render.fonts(e.data.fonts);
						break;
						case 'update-svg' :
						
							var canvas = lumise.stage().canvas;
								active = canvas.getActiveObject();
							
							if (active !== null) {
								
								var src = 'data:image/svg+xml;base64,'+btoa(e.data.svg);
								
								active.set('origin_src', src);
								active.set('src', src);
								active._element.src = src;
								active._originalElement.src = src;
								active._element.onload = function(){
									canvas.renderAll();
								};
							};
							
							lumise.tools.lightbox('close');
							
						break;
					}
				}
		
			});
			
			$(window).bind('beforeunload', function(){
				if (lumise.ops.before_unload)
					return lumise.ops.before_unload;
			})
			.on('touchstart', function(e){
				
				if ($(e.target).hasClass('smooth'))
					this.smooth = e.target;
				else this.smooth = $(e.target).closest('.smooth').get(0);
				
			})
			.on('touchmove', function(e){
				
				if (e.target === document) {
					e.preventDefault();
					return false;
				}
				
			    if (['INPUT', 'SELECT'].indexOf(e.target.tagName) > -1 || this.smooth)
			    	return true;
			    
		        e.preventDefault();
		        return false;
		        
		    })
		    .on('load', function(){
				lumise.mobile();
			});
			
			this.design.events();
			this.objects.icons.init();
			
			fabric.util.addListener(fabric.window, 'load', function() {

				var canvas = this.__canvas || this.canvas,
				    canvases = this.__canvases || this.canvases;

				canvas && canvas.calcOffset && canvas.calcOffset();

				if (canvases && canvases.length) {
				  for (var i = 0, len = canvases.length; i < len; i++) {
				    canvases[i].calcOffset();
				  }
				}

			});
			
			////////////////////////////////////////////////

			this.render.colorPresets();
			this.render.fonts();
			this.indexed.init();
			this.cart.init();
			
			jscolor.detectDir = function(){ return lumise.data.assets+'/assets/images/'; };
			jscolor.init();
			delete jscolor.init;
			
			lumise.mobile();

		}

	};
	
	var _f = lumise.func, _r = lumise.render;
	
	lumise.load();
		
})(jQuery);
