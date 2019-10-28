<?php
/**
*
*	(p) package: lumise
*	(c) author:	King-Theme
*	(i) website: https://www.lumise.com
*
*/

class lumise_views extends lumise_lib {

	public function __construct($lumise) {
		$this->main = $lumise;
	}

	public function nav(){
		
		$cfg = $this->main->cfg;
		$logo = $cfg->settings['logo'];
		
		if (empty($logo))
			$logo = $cfg->assets_url.'assets/images/logo.v5.png';
			
		$components = $cfg->settings['components'];
		
		if (is_string($cfg->settings['components']))
			$components = explode(',', $cfg->settings['components']);
		
		if (
			isset($cfg->settings['back_link']) && 
			!empty($cfg->settings['back_link'])
		)
			$back_link = $cfg->settings['back_link'];
		else 
			$back_link = $cfg->settings['logo_link'];
			
	?>
	<a data-view="logo" href="<?php echo $cfg->settings['logo_link']; ?>">
		<img src="<?php echo $logo; ?>" />
	</a>
	<ul data-block="left" data-resp="file">
		<li data-view="sp"></li>
		<li data-tool="file" data-view="list">
			<span><?php echo $this->main->lang('File'); ?></span>
			<ul data-view="sub" id="lumise-file-nav">
				<li data-func="import">
					<span><?php echo $this->main->lang('Import file'); ?></span><small>(Ctrl+O)</small>
					<input type="file" id="lumise-import-json" />
				</li>
				<li data-func="clear">
					<span><?php echo $this->main->lang('Clear all'); ?></span><small>(Ctrl+E)</small>
				</li>
				<li data-view="sp"></li>
				<li data-func="save">
					<span><?php echo $this->main->lang('Save to My Designs'); ?></span><small>(Ctrl+S)</small>
				</li>
				<?php 
					
				if (!is_array($this->main->cfg->settings['user_download']))
					$allow_download = explode(',', $this->main->cfg->settings['user_download']);
				else $allow_download = $this->main->cfg->settings['user_download'];
				
				if ($this->main->connector->is_admin())
					$allow_download = array('jpg', 'png', 'svg', 'pdf', 'lumi');
				
				if (count($allow_download) === 1 && empty($allow_download[0]))
					$allow_download = array();
				
				if (!empty($allow_download) && count($allow_download) > 0) {
				?>
					<?php if (in_array('lumi', $allow_download)) { ?>
						<li data-func="saveas">
							<span><?php echo $this->main->lang('Save as file'); ?></span><small>(Ctrl+Shift+S)</small>
						</li>
					<?php } ?>
					<?php if (is_array($allow_download) && count($allow_download) > 0) { ?>	
						<li data-view="sp"></li>
						<li>
							<ul data-view="sub2">
								<?php
									foreach($allow_download as $k => $ad) {
										echo '<li data-func="download" data-type="'.($ad == 'lumi' ? 'json' : $ad).'">'.($ad == 'lumi' ? 'FILE ('.$this->main->lang('importable').' *.lumi)' : strtoupper($ad)).'</li>';
									}
								?>
							</ul>
							<span><?php echo $this->main->lang('Download design'); ?></span>
							<small data-view="sub2"><i class="lumisex-ios-arrow-forward"></i></small>
						</li>
					<?php } ?>
				<?php } ?>
			</ul>
		</li>
		<li data-tool="designs" data-callback="designs">
			<span><?php echo $this->main->lang('Designs'); ?></span>
			<ul data-view="sub">
				<header>
					<h3>
						<?php echo $this->main->lang('My design templates'); ?>
						<span id="lumise-designs-search">
							<input type="search" placeholder="<?php echo $this->main->lang('Search designs'); ?>" />
						</span>
					</h3>
					<i class="lumisex-android-close close" title="<?php echo $this->main->lang('Close'); ?>"></i>
				</header>
				<li>
					<ul id="lumise-designs-category">
						<li data-active="true">
							<text><i class="lumisex-ios-arrow-forward"></i> <?php echo $this->main->lang('All Categories'); ?></text>
						</li>
						<li>
							<text><i class="lumisex-ios-arrow-forward"></i> Category #1</text>
							<func>
								<i class="lumisex-edit" title="<?php echo $this->main->lang('Edit Category'); ?>"></i>
								<i class="lumisex-android-delete" title="<?php echo $this->main->lang('Delete Category'); ?>"></i>
							</func>
						</li>
						<li data-func="add"><i class="lumisex-android-add"></i> <?php echo $this->main->lang('New Category'); ?></li>
					</ul>
					<ul id="lumise-saved-designs">
						<p class="empty"><?php 
							echo $this->main->lang('You have not saved any designs yet!'); 
							echo '<br>';
							echo $this->main->lang('After designing, press Ctrl+S to save your designs in here.'); ?>
						</p>
					</ul>
				</li>
			</ul>
		</li>
		<?php if ($this->main->connector->is_admin() || $this->main->cfg->settings['user_print'] == '1') { ?>
		<li data-tool="print">
			<span><?php echo $this->main->lang('Print'); ?></span>
			<ul data-view="sub" id="lumise-print-nav" data-align="center">
				<header>
					<h3>
						<?php echo $this->main->lang('Print design'); ?>
					</h3>
					<i class="lumisex-android-close close" title="<?php echo $this->main->lang('Close'); ?>"></i>
				</header>
				<li>
					<label><?php echo $this->main->lang('Paper Size'); ?>:</label>
					<select name="select-size">
						<option value="42 x 59.4"<?php
							
							if (isset($this->main->cfg->product)) {
								$size = $this->main->cfg->product['size'];
								$mode = $this->main->cfg->product['orientation'];
							} else {
								$size = 'a4';
								$mode = 0;
							}
							
							echo ($size == 'a2' ? ' selected' : '');
							
						?>>A2</option>
						<option value="29.7 x 42"<?php echo ($size == 'a3' ? ' selected' : ''); ?>>A3</option>
						<option value="21 x 29.7"<?php echo ($size == 'a4' ? ' selected' : ''); ?>>A4</option>
						<!--option value="59.4x84.1">A1 (59.4 x 84.1cm)</option>
						<option value="84.1x118.9">A0 (84.1 x 118.9cm)</option-->
						<!--option value="screen">Screen Printing</option>
						<option selected="selected" value="DTG">DTG Printing</option>
						<option value="sublimation">Sublimation Printing</option>
						<option value="embroidery">Embroidery</option>
						<option value="GDH">Laser</option>
						<option value="OIJ">pojpo</option-->
						<option value="14.8 x 21"<?php echo ($size == 'a5' ? ' selected' : ''); ?>>A5</option>
						<option value="10.5 x 14.8"<?php echo ($size == 'a6' ? ' selected' : ''); ?>>A6</option>
						<option value="7.4 x 10.5"<?php echo ($size == 'a7' ? ' selected' : ''); ?>>A7</option>
						<option value="5.2 x 7.4"<?php echo ($size == 'a8' ? ' selected' : ''); ?>>A8</option>
						<option value="3.7 x 5.2"<?php echo ($size == 'a9' ? ' selected' : ''); ?>>A9</option>
						<option value="2.6 x 3.7"<?php echo ($size == 'a10' ? ' selected' : ''); ?>>A10</option>
					</select>
				</li>
				<li>
					<label><?php echo $this->main->lang('Custom size'); ?>:</label>
					<input type="text" name="size" value="21 x 29.7" />
				</li>
				<li>
					<input type="radio" name="print-unit" checked data-unit="cm" /><small>cm (300 PPI)</small>
					<input type="radio" name="print-unit" data-unit="inch" /><small> inch (300 PPI)</small>
				</li>
				<li>
					<label><?php echo $this->main->lang('Orientation'); ?>:</label>
					<select name="orientation">
						<option value="portrait"<?php echo ($mode === 0 ? ' selected' : ''); ?>><?php 
							echo $this->main->lang('Portrait');
						?></option>
						<option value="landscape"<?php echo ($mode === 1 ? ' selected' : ''); ?>><?php 
							echo $this->main->lang('Landscape'); 
						?></option>
					</select>
				</li>
				<li>
					<label><?php echo $this->main->lang('Include base'); ?>:</label>
					<div class="switch">
						<input id="lumise-print-base" type="checkbox" value="" class="toggle-button">
						<span class="toggle-label" data-on="YES" data-off="NO"></span>
						<span class="toggle-handle"></span>
					</div>
				</li>
				<li>
					<span id="lumise-print-stage"></span>
					<button class="lumise-btn" data-func="print">
						<i class="lumisex-printer"></i> <?php echo $this->main->lang('Print Now'); ?>
					</button>
					<button class="lumise-btn gray" data-func="download">
						<i class="lumisex-android-download"></i> <?php echo $this->main->lang('Download'); ?>
					</button>
				</li>
			</ul>
		</li>
		<?php } ?>
		<?php if ($this->main->connector->is_admin() || $this->main->cfg->settings['share'] == '1') { ?>
		<li data-tool="share">
			<span>
				<?php echo $this->main->lang('Share'); ?>
			</span>
			<ul data-view="sub" class="lumise-tabs-nav" data-align="center" id="lumise-shares-wrp" data-nav="link">
				<header>
					<h3>
						<span data-tna="link"><?php echo $this->main->lang('Share Your Design'); ?></span>
						<span data-tna="history">
							<a href="#" data-func="nav" data-nav="link">
								<i class="lumisex-android-arrow-back" data-func="nav" data-nav="link"></i> 
								<?php echo $this->main->lang('Back to share'); ?>
							</a>
						</span>
					</h3>
					<i class="lumisex-android-close close" title="Close"></i>
				</header>
				<li data-view="link" data-active="true">
					<p data-phase="1" class="mb1">
						<?php echo $this->main->lang('Create the link to share your current design for everyone'); ?>
					</p>
					<p data-view="link" class="mb1" data-phase="1">
						<input type="text" placeholder="<?php echo $this->main->lang('Enter the title of design'); ?>" id="lumise-share-link-title" />
					</p>
					<p data-phase="1">
						<button class="lumise-btn right" data-func="create-link">
							<?php echo $this->main->lang('Create link'); ?>
						</button>
						<button class="lumise-btn right white mr1"  data-nav="history" data-func="nav">
							<?php echo $this->main->lang('View history'); ?>
						</button>
					</p>
					<p class="notice success" data-phase="2">
						<?php echo $this->main->lang('Your link has been created successfully'); ?>
					</p>
					<p data-view="link-share" data-phase="2" data-func="copy" data-msg="<?php 
						echo $this->main->lang('The link was copied'); 
					?>" title="<?php 
						echo $this->main->lang('Click to copy the link'); 
					?>"></p>
					<p class="mt1 mb1 right" data-phase="2">
						<b><?php echo $this->main->lang('Share to'); ?>:</b>
						<button data-network="facebook">
							<i class="lumisex-social-facebook"></i> Facebook
						</button>
						<button data-network="pinterest">
							<i class="lumisex-social-pinterest"></i> Pinterest
						</button>
						<button data-network="twitter">
							<i class="lumisex-social-twitter"></i> Twitter
						</button>
					</p>
					<p class="mt1" data-phase="2">
						<button class="lumise-btn right gray" data-func="do-again">
							<?php echo $this->main->lang('Create another'); ?>
						</button>
						<button class="lumise-btn right white mr1"  data-nav="history" data-func="nav"><?php echo $this->main->lang('View history'); ?></button>
					</p>
				</li>
				<li data-view="history"></li>
			</ul>
		</li>
		<?php } ?>
		<li data-tool="help">
			<span>
				<?php echo $this->main->lang('Help'); ?>
			</span>
			<ul data-view="sub" class="lumise-tabs-nav">
				<li data-view="header">
					<h3 data-view="title"><?php echo $this->main->cfg->settings['help_title']; ?></h3>
					<i class="lumisex-android-close close" title="<?php echo $this->main->lang('Close'); ?>"></i>
					<nav>
						<?php

							$tabs = @json_decode($this->main->cfg->settings['helps']);

							$tab_body = '';
							if ($tabs === null || !is_array($tabs) || count($tabs) === 0) {
								$tabs = array();
							}
							
							$about = new stdClass();
							$about->title = $this->main->lang('About');
							$about->content = '<span data-sub="about">'.
												stripslashes($this->main->cfg->settings['about']).
												'<p data-view="powered" class="md">'.
													'Powered by '.
													'<a href="https://www.lumise.com/?'.
													'utm_source=clients&utm_medium=powered_by&'.
													'utm_campaign=live_sites&utm_term=powered_link&utm_content='.
													urlencode($_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI']).
													'" target="_blank">Lumise</a> '.
													'version '.LUMISE.
												'</p>'.
											  '</span>';
							
							array_push($tabs, $about);
							
							$tab_index = 1;
											
							foreach ($tabs as $tab) {

								if (
									isset($tab->title) &&
									isset($tab->content) &&
									!empty($tab->content)
								) {
									
									if (empty($tab->title))
										$tab->title = 'Untitled';
										
									echo '<span'.(empty($tab_body) ? ' data-active="true"' : '' ).
										 ' data-nav="tab-'.$tab_index.'" data-func="nav">'.
										 $this->main->lang($tab->title).'</span>';

									$tab_body .= '<li class="smooth" data-view="tab-'.$tab_index.
												 '" '.(empty($tab_body) ? ' data-active="true"' : '' ).'>'.
												 $this->main->lang(stripslashes($tab->content)).
												 '</li>';
									$tab_index++;
								}
							}
						?>
					</nav>
				</li>
				<?php echo $tab_body; ?>
			</ul>
		</li>
		<?php
		if (in_array('back', $components)){
			?>
		<li>
			<a href="<?php echo $back_link;?>" class="back_mobile">Shop</a>
		</li>
		<?php } ?>
		<li data-view="sp"></li>
	</ul>
	<svg id="lumise-nav-file" class="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve" fill="#eee"><g xmlns="http://www.w3.org/2000/svg" id="__m">
	<path d="M491.318,235.318H20.682C9.26,235.318,0,244.577,0,256s9.26,20.682,20.682,20.682h470.636    c11.423,0,20.682-9.259,20.682-20.682C512,244.578,502.741,235.318,491.318,235.318z"/><path d="M491.318,78.439H20.682C9.26,78.439,0,87.699,0,99.121c0,11.422,9.26,20.682,20.682,20.682h470.636    c11.423,0,20.682-9.26,20.682-20.682C512,87.699,502.741,78.439,491.318,78.439z"/><path d="M491.318,392.197H20.682C9.26,392.197,0,401.456,0,412.879s9.26,20.682,20.682,20.682h470.636    c11.423,0,20.682-9.259,20.682-20.682S502.741,392.197,491.318,392.197z"/>
</g><g xmlns="http://www.w3.org/2000/svg" style="display:none;transform:scale(.85) translateY(3px);" id="__x"><path xmlns="http://www.w3.org/2000/svg" d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249    C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306    C514.019,27.23,514.019,14.135,505.943,6.058z"/><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636    c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"/></g></svg>
	<ul data-block="left">
		<li id="lumise-design-undo" title="Ctrl+Z" class="disabled"><?php echo $this->main->lang('Undo'); ?></li>
		<li id="lumise-design-redo" title="Ctrl+Shift+Z" class="disabled"><?php echo $this->main->lang('Redo'); ?></li>
	</ul>

	<ul data-block="right">
		<!-- To add your code here, use the hook $lumise->add_action('before_language', function(){}) -->
		<?php
		
		$this->main->do_action('before_language');
			
		$active_lang = $this->main->cfg->active_language;
		
		$get_langs = $this->main->get_langs();
		
		/* Start language component */	
		if (count($get_langs) > 0 && $this->main->cfg->settings['allow_select_lang'] == '1') {

			$langs = $this->main->langs();
			array_unshift($get_langs, 'en');

		?>
		<li data-tool="languages" data-view="list">
			<span>
				<img src="<?php echo $this->main->cfg->assets_url; ?>assets/flags/<?php echo $active_lang; ?>.png" height="20" />
				<text><?php echo $this->main->lang('Languages'); ?></text>
			</span>
			<ul id="lumise-languages" data-view="sub" data-align="right">
				<?php foreach ($get_langs as $code) { ?>
					<?php if (
							(is_array($this->main->cfg->settings['activate_langs']) &&
							in_array($code, $this->main->cfg->settings['activate_langs'])) ||
							$code == 'en'
						) { ?>
					<li data-id="<?php echo $code; ?>">
						<span><img src="<?php echo $this->main->cfg->assets_url; ?>assets/flags/<?php echo $code; ?>.png" height="20" />
						<?php echo $langs[$code]; ?></span>
						<?php if ($code == $active_lang) {
							echo '<i class="lumisex-android-done"></i>';
						}?>
					</li>
					<?php } ?>
				<?php } ?>
			</ul>
		</li>
		<!-- Avalable hook: after_language -->
		<?php 
			
			$this->main->do_action('after_language');
			
			if (in_array('shop', $components))
				echo '<li data-view="sp"></li>';
		
		} 
		/* End language component */
		$this->main->do_action('before_cart');
		/* Start shop component */	
		if (in_array('shop', $components)) {
		
		?>
		<!-- Avalable hook: before_cart -->
		<li>
			<span class="lumise-price lumise-product-price">0.0</span>
		</li>
		<li data-tool="cart" id="lumise-cart-options">
			<button id="lumise-addToCart" title="<?php echo $this->main->lang('My cart'); ?>">
				<img src="<?php echo $this->main->cfg->assets_url; ?>assets/images/cart.svg" with="25" alt="" />
			</button>
			<div data-view="sub" data-align="right" id="lumise-cart-items">
				<header>
					<h3><?php echo $this->main->lang('My Cart'); ?></h3>
					<i class="lumisex-android-close close" title="close"></i>
				</header>
				<ul data-view="items"></ul>
				<footer>
					<a href="#details" data-func="details" data-view="cart-details">
						<?php echo $this->main->lang('Cart details'); ?> <i class="lumisex-android-open"></i>
					</a>
					<a href="#checkout" data-func="checkout" class="lumise-btn-primary">
						<?php echo $this->main->lang('Checkout'); ?>
						<i class="lumisex-android-arrow-forward"></i>
					</a>
				</footer>
			</div>
		</li>
		<li data-tool="proceed" data-callback="proceed">
			<span>
				<button id="lumise-continue-btn">
					<?php echo $this->main->lang('Proceed'); ?> 
					<i class="lumisex-android-arrow-forward"></i>
				</button>
			</span>
			<div data-view="sub" data-align="right" id="lumise-product-attributes">
				<header>
					<h3><?php echo $this->main->lang('Product options'); ?></h3>
					<i class="lumisex-android-close close" title="close"></i>
				</header>
				<div id="lumise-cart-wrp" data-view="attributes" class="smooth">
					<div class="lumise-cart-options">
						<div class="lumise-prints"></div>
						<div class="lumise-cart-attributes"></div>
					</div>
	
					<div class="lumise-cart-fields-tpml">
						<?php
							foreach(array(
								array(
									'type' => 'text',
									'content' => '<textarea name="name" class="lumise-cart-param" required></textarea>'
								),
								array(
									'type' => 'upload',
									'content' => '<input type="hidden" required data-file-input="true" name="name" value="" class="lumise-cart-param" />
									<input type="file" accept=".doc,.docx,.pdf,.zip,text/plain,application/zip,image/png,image/gif,image/jpeg,image/svg+xml" data-view="browse" data-label="'.$this->main->lang('Choose File').'" />'
								),
								array(
									'type' => 'select',
									'content' => '<select name="parent" class="lumise-cart-param" required></select>'
								),
								array(
									'type' => 'printing',
									'content' => '<div class="lumise_radios">
										<div class="lumise-radio">
				                			<input type="radio" class="lumise-cart-param" name="printing" value="1" id="" required>
							                <label class="lumise-cart-option-label" for=""></label>
							            </div>
									</div>'
								),
								array(
									'type' => 'radio',
									'content' => '<div class="lumise_radios">
										<div class="lumise-radio">
				                			<input type="radio" class="lumise-cart-param" name="printing" value="1" id="" required>
							                <label class="lumise-cart-option-label" for=""> <em class="check"></em>
							                </label>
											<em class="lumise-cart-option-desc"></em>
							            </div>
									</div>'
								),
								array(
									'type' => 'checkbox',
									'content' => '<div class="lumise_checkboxes">
										<div class="lumise_checkbox">
											<input type="checkbox" name="" class="lumise-cart-param action_check" value="1" id="" required>
											<label for="" class="lumise-cart-option-label">
												Checkbox <em class="check">
												<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="11px" height="12px" viewBox="0 0 12 13" enable-background="new 0 0 12 13" xml:space="preserve">
													<path fill="#4DB6AC" d="M0.211,6.663C0.119,6.571,0.074,6.435,0.074,6.343c0-0.091,0.045-0.229,0.137-0.32l0.64-0.64 c0.184-0.183,0.458-0.183,0.64,0L1.538,5.43l2.515,2.697c0.092,0.094,0.229,0.094,0.321,0l6.13-6.358l0.032-0.026l0.039-0.037 c0.186-0.183,0.432-0.12,0.613,0.063l0.64,0.642c0.183,0.184,0.183,0.457,0,0.64l0,0l-7.317,7.592 c-0.093,0.092-0.184,0.139-0.321,0.139s-0.228-0.047-0.319-0.139L0.302,6.8L0.211,6.663z"/>
													</svg></em>
											</label>
											<em></em>
										</div>
									</div>'
								),
								array(
									'type' => 'size',
									'content' => '<div class="lumise-cart-field-quantity">
											<em data-action="minus"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 491.858 491.858" style="enable-background:new 0 0 491.858 491.858;" xml:space="preserve" width="10px" height="10px"><g><g><path d="M465.167,211.613H240.21H26.69c-8.424,0-26.69,11.439-26.69,34.316s18.267,34.316,26.69,34.316h213.52h224.959    c8.421,0,26.689-11.439,26.689-34.316S473.59,211.613,465.167,211.613z" fill="#888"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></em>
											<em class="lumise-cart-field-value">
												<input type="number" min="0" step="1" class="lumise-cart-param" name="quantity" value="1"/>
											</em>
											<em data-action="plus"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http d://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 491.86 491.86" style="enable-background:new 0 0 491.86 491.86;" xml:space="preserve" width="10px" height="10px"><g><g><path d="M465.167,211.614H280.245V26.691c0-8.424-11.439-26.69-34.316-26.69s-34.316,18.267-34.316,26.69v184.924H26.69    C18.267,211.614,0,223.053,0,245.929s18.267,34.316,26.69,34.316h184.924v184.924c0,8.422,11.438,26.69,34.316,26.69    s34.316-18.268,34.316-26.69V280.245H465.17c8.422,0,26.69-11.438,26.69-34.316S473.59,211.614,465.167,211.614z" fill="#888"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></em>
											<em class="lumise-cart-field-label"></em>
										</div>'
								),
								array(
									'type' => 'pack',
									'content' => ''
								)
							) as $field) {
						?>
						<div class="lumise-cart-field-<?php echo $field['type']; ?>-tmpl lumise-cart-field">
							<div class="lumise_form_group">
								<span class="lumise-cart-field-label"> <em class="required">*</em></span>
								<div class="lumise_form_content">
									<?php echo $field['content']; ?>
								</div>
							</div>
						</div>
						<?php } ?>
					</div>
				</div>
				<strong class="lumise-product-price-wrp">
					<?php echo $this->main->lang('Total:'); ?> <span class="lumise-product-price"></span>
				</strong>
				<button id="lumise-cart-action" class="lumise-btn-primary" data-add="<?php echo $this->main->lang('Add to cart'); ?>" data-update="<?php echo $this->main->lang('Update cart item'); ?>" data-action="update-cart">
					<i class="lumisex-android-add"></i> <?php echo $this->main->lang('Add to cart'); ?>
				</button>
				<div id="lumise-update-cart-confirm">
					<div>
						<img src="<?php echo $this->main->cfg->assets_url; ?>assets/images/done.svg" alt="" />
						<em><?php echo $this->main->lang('Your cart has been updated'); ?>!</em>
						<ul>
							<li>
								<a href="#details" data-func="details">
									<?php echo $this->main->lang('View cart details'); ?>
								</a>
							</li>
							<li>
								<a href="#new" data-func="new">
									<?php echo $this->main->lang('Start new product'); ?>
								</a>
							</li>
						</ul>
						<button class="lumise-btn-primary" data-func="checkout">
							<?php echo $this->main->lang('Checkout Now'); ?>
							<i class="lumisex-android-arrow-forward" data-func="checkout"></i>
						</button>
					</div>
				</div>
			</div>
		</li>
		<?php
		if (in_array('back', $components)) {
		?>
		<li>
			<a href="<?php echo $back_link;?>" class="back_shop"><?php echo $this->main->lang('Back To Shop'); ?></a>
		</li>
		<?php } ?>
		<!-- Avalable hook: after_cart -->
	<?php 
		
		} 
		/* End shop component */ 
		$this->main->do_action('after_cart');
	?>
	</ul>
	<?php

	}

	public function tool(){

	?>

	<ul class="lumise-top-nav left" data-mode="default">
		<li id="lumise-draft-status"></li>
	</ul>

	<ul class="lumise-top-nav left" data-mode="svg">
		<li data-tool="svg" id="lumise-svg-colors" data-callback="svg">
			<ul data-pos="left" data-view="sub">
				<li data-view="title">
					<h3>
						<span><?php echo $this->main->lang('Fill options'); ?></span>
						<i class="lumisex-android-close close" title="close"></i>
					</h3>
					<p class="flex<?php echo $this->main->cfg->settings['enable_colors'] == '0' ? ' hidden' : ''; ?>">
						<input type="search" placeholder="click to choose color" id="lumise-svg-fill" class="color" />
						<?php if ($this->main->cfg->settings['enable_colors'] != '0') { ?>
						<span class="lumise-save-color" data-tip="true" data-target="svg-fill">
							<i class="lumisex-android-add"></i>
							<span><?php echo $this->main->lang('Save this color'); ?></span>
						</span>
						<?php } ?>
					</p>
					<ul id="lumise-color-presets" class="lumise-color-presets" data-target="svg-fill"></ul>
				</li>
			</ul>
		</li>
	</ul>

	<ul class="lumise-top-nav right" data-mode="default">
		<li data-tool="callback" data-callback="qrcode">
			<span data-view="noicon"><?php echo $this->main->lang('Create QRCode'); ?></span>
		</li>
		<li data-tool="snap">
			<span data-view="noicon"><?php echo $this->main->lang('Auto snap'); ?></span>
			<ul data-pos="right" data-view="sub">
				<li>
					<?php echo $this->main->lang('Auto snap mode'); ?>
					<div class="switch">
						<input id="lumise-auto-alignment" type="checkbox" value="" class="toggle-button">
						<span class="toggle-label" data-on="ON" data-off="OFF"></span>
						<span class="toggle-handle"></span>
					</div>
				</li>
			</ul>
		</li>
	</ul>

	<ul class="lumise-top-nav left" data-mode="image">
		<li data-tool="replace">
			<span data-tip="true">
				<i class="lumisex-android-create"></i>
				<span><?php echo $this->main->lang('Replacement image'); ?></span>
			</span>
			<ul data-view="sub" data-pos="center" id="lumise-replacement-image">
				<li data-view="title">
					<h3>
						<span>1200 x 344</span>
						<i class="lumisex-android-close close" title="close"></i>
					</h3>
				</li>
				<li data-view="replacement">
					<span>
						<input type="radio" name="replace-image" id="replace-image-keep" checked value="0" />
						<label for="replace-image-keep"><?php echo $this->main->lang('Keep dimensions'); ?></label> 
					</span>
					<span>
						<input type="radio" name="replace-image" id="replace-image-height" value="1" />
						<label for="replace-image-height"><?php echo $this->main->lang('Auto height'); ?></label> 
					</span>
					<span>
						<input type="radio" name="replace-image" id="replace-image-width" value="2" />
						<label for="replace-image-width"><?php echo $this->main->lang('Auto width'); ?></label>
					</span>
					<span>
						<button>
							<i class="lumisex-android-upload"></i> <?php echo $this->main->lang('Upload new image'); ?>
						</button>
					</span>
				</li>
			</ul>
		</li>
		<li data-tool="callback" data-callback="crop">
			<span data-tip="true">
				<i class="lumisex-crop"></i>
				<span><?php echo $this->main->lang('Crop'); ?></span>
			</span>
		</li>
		<li data-tool="masks" data-callback="select_mask">
			<span data-tip="true">
				<i class="lumisex-android-star-outline"></i>
				<span><?php echo $this->main->lang('Mask'); ?></span>
			</span>
			<ul data-view="sub" data-pos="center">
				<li data-view="title">
					<h3>
						<span><?php echo $this->main->lang('Select mask layer'); ?></span>
						<i class="lumisex-android-close close" title="close"></i>
					</h3>
				</li>
				<li data-view="list"></li>
				<li class="bttm">
					<button><i class="lumisex-android-close"></i> <?php echo $this->main->lang('Clear Mask'); ?></button>
				</li>
			</ul>
		</li>
		<li data-tool="filter">
			<span data-tip="true">
				<i class="lumisex-erlenmeyer-flask-bubbles"></i>
				<span><?php echo $this->main->lang('Remove background'); ?></span>
			</span>
			<ul data-view="sub">
				<li data-view="title">
					<h3>
						<span><?php echo $this->main->lang('Remove background'); ?></span>
						<i class="lumisex-android-close close" title="close"></i>
					</h3>
				</li>
				<li>
					<h3 class="nob">
						<span><?php echo $this->main->lang('Deep'); ?>: </span>
						<inp data-range="helper" data-value="0">
							<input class="nol" type="range" id="lumise-image-fx-deep" data-value="0" min="0" max="200" value="0" data-image-fx="deep" data-view="lumise" />
						</inp>
					</h3>
				</li>
				<li>
					<h3 class="nob">
						<span><?php echo $this->main->lang('Mode'); ?>: </span>
						<select id="lumise-image-fx-mode" data-fx="mode">
							<option value="light"><?php echo $this->main->lang('Light Background'); ?></option>
							<option value="dark"><?php echo $this->main->lang('Dark Background'); ?></option>
						</select>
					</h3>
				</li>
			</ul>
		</li>
		<li data-tool="advanced">
			<span data-tip="true">
				<i class="lumisex-wand"></i>
				<span><?php echo $this->main->lang('Filters'); ?></span>
			</span>
			<ul data-view="sub">
				<li data-view="title">
					<h3>
						<span><?php echo $this->main->lang('Filters'); ?></span>
						<i class="lumisex-android-close close" title="close"></i>
					</h3>
				</li>
				<li data-tool="filters">
					<h3 class="nob">
						<ul id="lumise-image-fx-fx"><li data-fx="" style="background-position: 0px 0px;"><span>Original</span></li><li data-fx="bnw" style="background-position: -92px 0px;"><span>B&amp;W</span></li><li data-fx="satya" style="background-position: -184px 0px;"><span>Satya</span></li><li data-fx="doris" style="background-position: -276px 0px;"><span>Doris</span></li><li data-fx="sanna" style="background-position: -368px 0px;"><span>Sanna</span></li><li data-fx="vintage" style="background-position: -460px 0px;"><span>Vintage</span></li><li data-fx="gordon" style="background-position: 0px -92px;"><span>Gordon</span></li><li data-fx="carl" style="background-position: -92px -92px;"><span>Carl</span></li><li data-fx="shaan" style="background-position: -184px -92px;"><span>Shaan</span></li><li data-fx="tonny" style="background-position: -276px -92px;"><span>Tonny</span></li><li data-fx="peter" style="background-position: -368px -92px;"><span>Peter</span></li><li data-fx="greg" style="background-position: -460px -92px;"><span>Greg</span></li><li data-fx="josh" style="background-position: 0px -184px;"><span>Josh</span></li><li data-fx="karen" style="background-position: -92px -184px;"><span>Karen</span></li><li data-fx="melissa" style="background-position: -184px -184px;"><span>Melissa</span></li><li data-fx="salomon" style="background-position: -276px -184px;"><span>Salomon</span></li><li data-fx="sophia" style="background-position: -368px -184px;"><span>Sophia</span></li><li data-fx="adrian" style="background-position: -460px -184px;"><span>Adrian</span></li><li data-fx="roxy" style="background-position: 0px -276px;"><span>Roxy</span></li><li data-fx="singe" style="background-position: -92px -276px;"><span>Singe</span></li><li data-fx="borg" style="background-position: -184px -276px;"><span>Borg</span></li><li data-fx="ventura" style="background-position: -276px -276px;"><span>Ventura</span></li><li data-fx="andy" style="background-position: -368px -276px;"><span>Andy</span></li><li data-fx="vivid" style="background-position: -460px -276px;"><span>Vivid</span></li><li data-fx="purple" style="background-position: 0px -368px;"><span>Purple</span></li><li data-fx="thresh" style="background-position: -92px -368px;"><span>Thresh</span></li><li data-fx="aqua" style="background-position: -184px -368px;"><span>Aqua</span></li><li data-fx="edgewood" style="background-position: -276px -368px;" data-selected="true"><span>Edge wood</span></li><li data-fx="aladin" style="background-position: -368px -368px;"><span>Aladin</span></li><li data-fx="amber" style="background-position: -460px -368px;"><span>Amber</span></li><li data-fx="anne" style="background-position: 0px -460px;"><span>Anne</span></li><li data-fx="doug" style="background-position: -92px -460px;"><span>Doug</span></li><li data-fx="earl" style="background-position: -184px -460px;"><span>Earl</span></li><li data-fx="kevin" style="background-position: -276px -460px;"><span>Kevin</span></li><li data-fx="polak" style="background-position: -368px -460px;"><span>Polak</span></li><li data-fx="stan" style="background-position: -460px -460px;"><span>Stan</span></li></ul>
					</h3>
				</li>
				<li>
					<h3 class="nob">
						<span><?php echo $this->main->lang('Brightness'); ?>: </span>
						<inp data-range="helper" data-value="0">
							<input type="range" id="lumise-image-fx-brightness" class="nol" data-value="0" min="-50" max="50" value="0" data-image-fx="brightness" data-view="lumise" data-range="0" data-between="true" />
						</inp>
					</h3>
				</li>
				<li>
					<h3 class="nob">
						<span><?php echo $this->main->lang('Saturation'); ?>: </span>
						<inp data-range="helper" data-value="100">
							<input type="range" id="lumise-image-fx-saturation" class="nol" data-value="100" min="0" max="100" value="100" data-image-fx="saturation" data-view="lumise" />
						</inp>
					</h3>
				</li>
				<li>
					<h3 class="nob">
						<span><?php echo $this->main->lang('Contrast'); ?>: </span>
						<inp data-range="helper" data-value="0">
							<input type="range" id="lumise-image-fx-contrast" class="nol" data-value="0" min="-50" max="50" value="0" data-image-fx="contrast" data-view="lumise" data-range="0" data-between="true" />
						</inp>
					</h3>
				</li>
			</ul>
		</li>
		<li data-tool="callback" data-callback="imageFXReset">
			<span data-view="noicon"><?php echo $this->main->lang('Clear Filters'); ?></span>
		</li>
	</ul>

	<ul class="lumise-top-nav left" data-mode="drawing">
		<li>
			<button id="lumise-discard-drawing" class="red mr1">
				<i class="lumisex-android-close"></i> <?php echo $this->main->lang('Discard drawing (ESC)'); ?>
			</button>
			<?php echo $this->main->lang('Click then drag the mouse to start drawing.'); ?>
			<b>Ctrl+Z</b> = undo, <b>Ctrl+Shift+Z</b> = redo
		</li>
	</ul>

	<ul class="lumise-top-nav left" data-mode="standard">
		<li data-tool="qrcode-text">
			<span data-tip="true">
				<i class="lumisex-qrcode-1"></i>
				<span><?php echo $this->main->lang('QRCode text'); ?></span>
				<input type="text" class="nol lumise-edit-text" id="lumise-qrcode-text" placeholder="<?php echo $this->main->lang('Enter your text'); ?>" />
			</span>
		</li>
	</ul>

	<ul class="lumise-top-nav right" data-mode="standard">
		<li data-tool="fill">
			<span data-tip="true">
				<i class="lumisex-paintbucket"></i>
				<span><?php echo $this->main->lang('Fill options'); ?></span>
			</span>
			<ul data-pos="center" data-view="sub">
				<li data-view="title">
					<h3>
						<span><?php echo $this->main->lang('Fill options'); ?></span>
						<i class="lumisex-android-close close" title="close"></i>
					</h3>
					<p class="flex<?php echo $this->main->cfg->settings['enable_colors'] == '0' ? ' hidden' : ''; ?>">
						<input type="search" placeholder="click to choose color" id="lumise-fill" class="color" />
						<?php if ($this->main->cfg->settings['enable_colors'] != '0') { ?>
						<span class="lumise-save-color" data-tip="true" data-target="fill">
							<i class="lumisex-android-add"></i>
							<span><?php echo $this->main->lang('Save this color'); ?></span>
						</span>
						<?php } ?>
					</p>
					<ul id="lumise-color-presets" class="lumise-color-presets" data-target="fill"></ul>
				</li>
				<li data-view="transparent">
					<h3 class="nob">
						<span><?php echo $this->main->lang('Transparent'); ?>: </span>
						<inp data-range="helper" data-value="100%">
							<input type="range" class="nol" id="lumise-transparent" data-value="100%" min="0" max="100" value="100" data-unit="%" data-ratio="0.01" data-action="opacity" />
						</inp>
					</h3>
				</li>
				<li data-view="stroke">
					<h3 class="nob">
						<span><?php echo $this->main->lang('Stroke width'); ?>: </span>
						<inp data-range="helper" data-value="0">
							<input type="range" class="nol" id="lumise-stroke-width" data-action="strokeWidth" data-unit="px" data-value="0" min="0" max="100" value="0" />
						</inp>
					</h3>
				</li>
				<li data-view="stroke">
					<h3 class="nob">
						<span><?php echo $this->main->lang('Stroke color'); ?>: </span>
						<input type="search" class="color<?php echo $this->main->cfg->settings['enable_colors'] == '0' ? ' hidden' : ''; ?>" placeholder="<?php echo $this->main->lang('Select a color'); ?>" id="lumise-stroke" />
					</h3>
					<?php if ($this->main->cfg->settings['enable_colors'] == '0') {
						$colors = explode(':', $this->main->cfg->settings['colors']);
						if (isset($colors[1])) {
							$colors = explode(',', $colors[1]);
							echo '<ul id="lumise-stroke-fix-colors">';
							foreach ($colors as $k => $v) {
								$v = explode('@', $v);
								echo '<li style="background: '.$v[0].'" title="'.(
									isset($v[1]) ? urldecode($v[1]) : $v[0]
								).'" data-color="'.$v[0].'"></li>';
							}
							echo '</ul>';
						}
					} ?>
				</li>
			</ul>
		</li>
		<li data-tool="arrange">
			<span data-tip="true">
				<i class="lumisex-send-to-back"></i>
				<span><?php echo $this->main->lang('Arrange layers'); ?></span>
			</span>
			<ul data-pos="center" data-view="sub">
				<li class="flex">
					<button data-arrange="back">
						<i class="lumisex-android-remove"></i>
						<?php echo $this->main->lang('Back'); ?>
					</button>
					<button data-arrange="forward" class="last">
						<i class="lumisex-android-add"></i>
						<?php echo $this->main->lang('Forward'); ?>
					</button>
				</li>
			</ul>
		</li>
		<li data-tool="position">
			<span data-tip="true">
				<i class="lumisex-android-apps"></i>
				<span><?php echo $this->main->lang('Position'); ?></span>
			</span>
			<ul data-pos="right" data-view="sub">
				<li data-view="title">
					<h3>
						<?php echo $this->main->lang('Layer position'); ?>
						<i class="lumisex-android-close close" title="close"></i>
					</h3>
				</li>

				<li data-position="cv" data-tip="true">
					<p><i class="lumisex-move-vertical"></i></p>
					<span><?php echo $this->main->lang('Center vertical'); ?></span>
				</li>

				<li data-position="tl" data-tip="true">
					<p><i class="lumisex-android-arrow-up _45deg"></i></p>
					<span><?php echo $this->main->lang('Top left'); ?></span>
				</li>
				<li data-position="tc" data-tip="true">
					<p><i class="lumisex-android-arrow-up"></i></p>
					<span><?php echo $this->main->lang('Top center'); ?></span>
				</li>
				<li data-position="tr" data-tip="true" class="mirX">
					<p><i class="lumisex-android-arrow-forward _135deg"></i></p>
					<span><?php echo $this->main->lang('Top right'); ?></span>
				</li>


				<li data-position="ch" data-tip="true" class="rota">
					<p><i class="lumisex-move-horizontal"></i></p>
					<span><?php echo $this->main->lang('Center Horizontal'); ?></span>
				</li>

				<li data-position="ml" data-tip="true">
					<p><i class="lumisex-android-arrow-back"></i></p>
					<span><?php echo $this->main->lang('Middle left'); ?></span>
				</li>
				<li data-position="mc" data-tip="true">
					<p><i class="lumisex-android-radio-button-off"></i></p>
					<span><?php echo $this->main->lang('Middle center'); ?></span>
				</li>
				<li data-position="mr" data-tip="true">
					<p><i class="lumisex-android-arrow-forward"></i></p>
					<span><?php echo $this->main->lang('Middle right'); ?></span>
				</li>

				<li data-position="" data-tip="true">
					<i class="lumise-icon-info"></i>
					<span>
						<?php echo $this->main->lang('Press &leftarrow; &uparrow; &rightarrow; &downarrow; to move 1 px, <br>Hit simultaneously SHIFT key to move 10px'); ?>
					</span>
				</li>
				<li data-position="bl" data-tip="true" class="mirX">
					<p><i class="lumisex-android-arrow-down _45deg"></i></p>
					<span><?php echo $this->main->lang('Bottom left'); ?></span>
				</li>
				<li data-position="bc" data-tip="true">
					<p><i class="lumisex-android-arrow-down"></i></p>
					<span><?php echo $this->main->lang('Bottom center'); ?></span>
				</li>
				<li data-position="br" data-tip="true">
					<p><i class="lumisex-android-arrow-down _45deg"></i></p>
					<span><?php echo $this->main->lang('Bottom right'); ?></span>
				</li>
			</ul>
		</li>
		<li data-tool="transform">
			<span data-tip="true">
				<i class="lumisex-android-options"></i>
				<span><?php echo $this->main->lang('Transforms'); ?></span>
			</span>
			<ul data-pos="right" data-view="sub">
				<li>
					<h3 class="nob">
						<span><?php echo $this->main->lang('Rotate'); ?>: </span>
						<inp data-range="helper" data-value="0º">
							<input type="range" id="lumise-rotate" data-value="0º" min="0" max="360" value="0" data-unit="º" data-range="0, 45, 90, 135, 180, 225, 270, 315" data-action="angle" />
						</inp>
					</h3>
				</li>
				<li>
					<h3 class="nob">
						<span><?php echo $this->main->lang('Skew X'); ?>: </span>
						<inp data-range="helper" data-value="0">
							<input class="nol" type="range" id="lumise-skew-x" data-value="0" min="-30" max="30" value="0" data-unit="" data-action="skewX" data-range="0" data-between="true" />
						</inp>
					</h3>
				</li>
				<li>
					<h3 class="nob">
						<span><?php echo $this->main->lang('Skew Y'); ?>: </span>
						<inp data-range="helper" data-value="0">
							<input class="nol" type="range" id="lumise-skew-y" data-value="0" min="-30" max="30" value="0" data-unit="" data-action="skewY" data-range="0" data-between="true" />
						</inp>
					</h3>
				</li>
				<li class="center">
					<?php echo $this->main->lang('Flip X'); ?>:
					<div class="switch mr2">
						<input id="lumise-flip-x" type="checkbox" value="" class="toggle-button">
						<span class="toggle-label" data-on="ON" data-off="OFF"></span>
						<span class="toggle-handle"></span>
					</div>

					<?php echo $this->main->lang('Flip Y'); ?>:
					<div class="switch">
						<input id="lumise-flip-y" type="checkbox" value="" class="toggle-button">
						<span class="toggle-label" data-on="ON" data-off="OFF"></span>
						<span class="toggle-handle"></span>
					</div>
					<p class="blockinl">
						<i class="lumisex-android-bulb"></i>
						<?php echo $this->main->lang('Free transform by press SHIFT+&#10529;'); ?>
						<br>
						<button id="lumise-reset-transform">
							<i class="lumisex-arrows-ccw"></i>
							<?php echo $this->main->lang('Reset all transforms'); ?>
						</button>
					</p>
				</li>
			</ul>
		</li>
	</ul>

	<ul class="lumise-top-nav left" data-mode="text" id="lumise-text-tools">
		<li data-tool="font">
			<span data-tip="true">
				<button class="dropdown">
					<font style="font-family:Arial">Arial</font>
				</button>
				<span><?php echo $this->main->lang('Font family'); ?></span>
			</span>
			<ul data-pos="center" data-func="fonts" data-view="sub">
				<li class="scroll smooth" id="lumise-fonts"></li>
				<li class="bttm">
					<button class="lumise-more-fonts"><i class="lumisex-android-open"></i> Get more fonts</button>
				</li>
			</ul>
		</li>
		<li data-tool="spacing">
			<span data-tip="true">
				<i class="lumisex-text f16"></i>
				<span><?php echo $this->main->lang('Edit text'); ?></span>
			</span>
			<ul data-pos="right" data-view="sub">
				<li data-view="title">
					<h3>
						<?php echo $this->main->lang('Edit text'); ?>
						<i class="lumisex-android-close close" title="Close"></i>
					</h3>
				</li>
				<li>
					<h3 class="nob">
						<textarea type="text" class="nol lumise-edit-text" placeholder="Enter your text"></textarea>
					</h3>
				</li>
				<li>
					<h3 class="nob">
						<span><?php echo $this->main->lang('Font size'); ?>: </span>
						<inp data-range="helper" data-value="16">
							<input type="range" class="nol" id="lumise-font-size" data-action="fontSize" data-unit="px" data-value="16" min="6" max="144" value="16" />
						</inp>
					</h3>
				</li>
				<li>
					<h3 class="nob">
						<span class="min100"><?php echo $this->main->lang('Letter spacing'); ?> </span>
						<inp data-range="helper" data-value="100%">
							<input type="range" class="nol" id="lumise-letter-spacing" data-value="100%" min="0" max="1000" value="100" data-unit="" data-action="charSpacing" />
						</inp>
					</h3>
				</li>
				<li>
					<h3 class="nob">
						<span class="min100"><?php echo $this->main->lang('Line height'); ?> </span>
						<inp data-range="helper" data-value="10">
							<input type="range" class="nol" id="lumise-line-height" data-value="10" min="1" max="50" value="10"  data-action="lineHeight" data-unit="px" data-ratio="0.1" />
						</inp>
					</h3>
				</li>
				<li><button data-func="update-text-fx"><?php echo $this->main->lang('UPDATE TEXT'); ?></button></li>
			</ul>
		</li>
		<li data-tool="text-effect">
			<span data-tip="true">
				<i class="lumisex-vector"></i>
				<span><?php echo $this->main->lang('Text Effects'); ?></span>
			</span>
			<ul data-pos="right" data-view="sub">
				<li data-view="title">
					<h3>
						<?php echo $this->main->lang('Text effects'); ?>
						<i class="lumisex-android-close close" title="Close"></i>
					</h3>
				</li>
				<li id="lumise-text-effect">
					<h3 class="nob mb1">
						<textarea type="text" class="nol ml0 lumise-edit-text" placeholder="<?php echo $this->main->lang('Enter your text'); ?>"></textarea>
						<button data-func="update-text-fx"><?php echo $this->main->lang('UPDATE TEXT'); ?></button>
					</h3>
					<span data-sef="images">
						<img data-effect="normal" src="<?php echo $this->main->cfg->assets_url; ?>assets/images/text-effect-normal.png" height="80" data-selected="true" />
						<img data-effect="curved" src="<?php echo $this->main->cfg->assets_url; ?>assets/images/text-effect-curved.png" height="80" />
						<img data-effect="bridge" src="<?php echo $this->main->cfg->assets_url; ?>assets/images/text-effect-bridge.png" height="80" />
						<img data-effect="oblique" src="<?php echo $this->main->cfg->assets_url; ?>assets/images/text-effect-oblique.png" height="80" />
					</span>
					<div class="switch" style="display: none;">
						<input id="lumise-curved" type="checkbox" value="" class="toggle-button">
						<span class="toggle-label" data-on="ON" data-off="OFF"></span>
						<span class="toggle-handle"></span>
					</div>
				</li>
				<li data-func="curved">
					<h3 class="nob">
						<span><?php echo $this->main->lang('Radius'); ?> </span>
						<inp data-range="helper" data-value="80">
							<input type="range" class="nol" id="lumise-curved-radius" data-action="radius" data-value="80" min="-300" max="300" value="80" />
						</inp>
					</h3>
				</li>
				<li data-func="curved">
					<h3 class="nob">
						<span><?php echo $this->main->lang('Spacing'); ?> </span>
						<inp data-range="helper" data-value="0">
							<input type="range" class="nol" id="lumise-curved-spacing" data-action="spacing" data-value="0" min="0" max="100" value="0" />
						</inp>
					</h3>
				</li>
				<li data-func="text-fx">
					<h3 class="nob">
						<span><?php echo $this->main->lang('Curve'); ?> </span>
						<inp data-range="helper" data-value="0">
							<input type="range" class="nol" id="lumise-text-fx-curve" data-callback="textFX" data-fx="curve" data-value="0" min="-100" max="100" data-ratio="0.1" value="0" />
						</inp>
					</h3>
				</li>
				<li data-func="text-fx">
					<h3 class="nob">
						<span><?php echo $this->main->lang('Height'); ?> </span>
						<inp data-range="helper" data-value="100">
							<input type="range" class="nol" id="lumise-text-fx-bottom" data-callback="textFX" data-fx="bottom" data-value="100" min="1" max="150" data-ratio="0.1" value="100" />
						</inp>
					</h3>
				</li>
				<li data-func="text-fx">
					<h3 class="nob">
						<span><?php echo $this->main->lang('Offset'); ?> </span>
						<inp data-range="helper" data-value="50">
							<input type="range" class="nol" id="lumise-text-fx-offsety" data-callback="textFX" data-fx="offsetY" data-value="50" min="1" max="100" data-ratio="0.01" value="50" />
						</inp>
					</h3>
				</li>
				<li data-func="text-fx">
					<h3 class="nob">
						<span><?php echo $this->main->lang('Trident'); ?> </span>
						<div class="switch">
							<input id="lumise-text-fx-trident" data-fx="trident" type="checkbox" value="" class="toggle-button">
							<span class="toggle-label" data-on="ON" data-off="OFF"></span>
							<span class="toggle-handle"></span>
						</div>
					</h3>
				</li>
			</ul>
		</li>
		<li class="sp"></li>
		<li data-tool="text-align">
			<span data-tip="true">
				<i class="lumisex-align-center" id="lumise-text-align"></i>
				<span><?php echo $this->main->lang('Text align'); ?></span>
			</span>
			<ul data-pos="center" data-view="sub">
				<li>
					<i class="lumisex-align-left text-format" data-align="left" title="<?php echo $this->main->lang('Text align left'); ?>"></i>
					<i class="lumisex-align-center text-format" data-align="center" title="<?php echo $this->main->lang('Text align center'); ?>"></i>
					<i class="lumisex-align-right text-format" data-align="right" title="<?php echo $this->main->lang('Text align right'); ?>"></i>
					<i class="lumisex-align-justify text-format" data-align="justify" title="<?php echo $this->main->lang('Text align justify'); ?>"></i>
				</li>
			</ul>
		</li>
		<li class="text-format" data-format="upper">
			<span data-tip="true">
				<i class="lumisex-letter"></i>
				<span><?php echo $this->main->lang('Uppercase / Lowercase'); ?></span>
			</span>
		</li>
		<li class="text-format" data-format="bold">
			<span data-tip="true">
				<i class="lumisex-bold"></i>
				<span><?php echo $this->main->lang('Font weight bold'); ?></span>
			</span>
		</li>
		<li class="text-format" data-format="italic">
			<span data-tip="true">
				<i class="lumisex-italic"></i>
				<span><?php echo $this->main->lang('Text style italic'); ?></span>
			</span>
		</li>
		<li class="text-format" data-format="underline">
			<span data-tip="true">
				<i class="lumisex-underline"></i>
				<span><?php echo $this->main->lang('Text underline'); ?></span>
			</span>
		</li>
	</ul>

	<?php

	}


	public function left() {
		
		$comps = $this->main->cfg->settings['components'];
		if (is_string($this->main->cfg->settings['components']))
			$comps = explode(',', $this->main->cfg->settings['components']);
	?>
	<div id="lumise-left">
		<div class="lumise-left-nav-wrp">
			<ul class="lumise-left-nav">
				<li data-tab="design">
					<i class="lumisex-android-color-palette"></i>
					<?php echo $this->main->lang('Design'); ?>
				</li>
				<?php for ($i = 0; $i < count($comps); $i++) { ?>
					<?php if ($comps[$i] == 'product') { ?>
					<li data-tab="product">
						<i class="lumisex-tshirt-outline"></i>
						<?php echo $this->main->lang('Product'); ?>
					</li>
					<?php } ?>
					<?php if ($comps[$i] == 'templates') { ?>
					<li data-tab="templates" data-load="templates">
						<i class="lumise-icon-star"></i>
						<?php echo $this->main->lang('Templates'); ?>
					</li>
					<?php } ?>
					<?php if ($comps[$i] == 'cliparts') { ?>
					<li data-tab="cliparts" data-load="cliparts">
						<i class="lumise-icon-heart"></i>
						<?php echo $this->main->lang('ClipArts'); ?>
					</li>
					<?php } ?>
					<?php if ($comps[$i] == 'text') { ?>
					<li data-tab="text" <?php echo ($i == 0 ? 'class="active"' : ''); ?>>
						<i class="lumisex-character"></i>
						<?php echo $this->main->lang('Text'); ?>
					</li>
					<?php } ?>
					<?php if ($comps[$i] == 'images') { ?>
					<li data-tab="uploads" data-load="images">
						<i class="lumise-icon-picture"></i>
						<?php echo $this->main->lang('Images'); ?>
					</li>
					<?php } ?>
					<?php if ($comps[$i] == 'shapes') { ?>
					<li data-tab="shapes" data-load="shapes">
						<i class="lumisex-diamond"></i>
						<?php echo $this->main->lang('Shapes'); ?>
					</li>
					<?php } ?>
					<?php if ($comps[$i] == 'drawing') { ?>
					<li data-tab="drawing" <?php echo ($i == 0 ? 'class="active"' : ''); ?>>
						<i class="lumise-icon-note"></i>
						<?php echo $this->main->lang('Drawing'); ?>
					</li>
					<?php } ?>
					<?php if ($comps[$i] == 'layers') { ?>
					<li data-tab="layers" data-callback="layers">
						<i class="lumise-icon-layers"></i>
						<?php echo $this->main->lang('Layers'); ?>
					</li>
					<?php } ?>
				<?php } ?>
				<?php if ($this->main->cfg->settings['report_bugs'] != 0) { ?>
				<li data-tab="bug" title="<?php echo $this->main->lang('Report bugs'); ?>">
					<i class="lumisex-bug"></i>
				</li>
				<?php } ?>
			</ul>
			<i class="lumisex-android-close active" id="lumise-side-close"></i>
		</div>
		<div id="lumise-product" class="lumise-tab-body-wrp<?php echo ($comps[0] == 'product' ? ' active' : ''); ?>">
			<header>
				<name></name>
				<price></price>
				<sku></sku>
				<button class="lumise-btn white" id="lumise-change-product">
					<?php echo $this->main->lang('Change product'); ?> 
					<i class="lumisex-arrow-swap"></i>
				</button>
				<desc><span></span>&nbsp;&nbsp;<a href="#more"><?php echo $this->main->lang('More'); ?></a></desc>
			</header>
			<h3 data-view="color" style="display:none"><?php echo $this->main->lang('Product color'); ?>:</h3>
			<ul id="lumise-product-color" style="display:none">
				<li data-view="picker">
					<input type="search" placeholder="<?php echo $this->main->lang('Click to select color'); ?>" class="color" />
				</li>
			</ul>
		</div>
		<div id="lumise-templates" class="lumise-tab-body-wrp lumise-x-thumbn<?php echo ($comps[0] == 'templates' ? ' active' : ''); ?>">
			<header>
				<span class="lumise-templates-search">
					<input type="search" id="lumise-templates-search-inp" placeholder="<?php echo $this->main->lang('Search templates'); ?>" />
					<i class="lumisex-android-search"></i>
				</span>
				<div class="lumise-template-categories" data-prevent-click="true">
					<button data-func="show-categories" data-type="templates">
						<span><?php echo $this->main->lang('All categories'); ?></span>
						<i class="lumisex-ios-arrow-forward"></i>
					</button>
				</div>
			</header>
			<div id="lumise-templates-list" class="smooth">
				<ul class="lumise-list-items">
					<i class="lumise-spinner white x3 mt2"></i>
				</ul>
			</div>
		</div>
		<div id="lumise-cliparts" class="lumise-tab-body-wrp lumise-x-thumbn<?php echo ($comps[0] == 'cliparts' ? ' active' : ''); ?>">
			<header>
				<span class="lumise-cliparts-search">
					<input type="search" id="lumise-cliparts-search-inp" placeholder="<?php echo $this->main->lang('Search cliparts'); ?>" />
					<i class="lumisex-android-search"></i>
				</span>
				<div class="lumise-clipart-categories" data-prevent-click="true">
					<button data-func="show-categories" data-type="cliparts">
						<span><?php echo $this->main->lang('All categories'); ?></span>
						<i class="lumisex-ios-arrow-forward"></i>
					</button>
				</div>
			</header>
			<div id="lumise-cliparts-list" class="smooth">
				<ul class="lumise-list-items">
					<i class="lumise-spinner white x3 mt2"></i>
				</ul>
			</div>
		</div>
		<div id="lumise-shapes" class="lumise-tab-body-wrp smooth<?php echo ($comps[0] == 'shapes' ? ' active' : ''); ?>"></div>
		<div id="lumise-text" class="lumise-tab-body-wrp smooth<?php echo ($comps[0] == 'text' ? ' active' : ''); ?>">
			<p class="gray"><?php echo $this->main->lang('Click or drag to add text'); ?></p>

			<span draggable="true" data-act="add" data-ops='[{"fontFamily":"Anton","text": "CurvedText", "fontSize": 30, "font":["","regular"],"bridge":{"bottom":2,"curve":-4.5,"oblique":false,"offsetY":0.5,"trident":false},"type":"curvedText"}]'>
				<img height="70" src="<?php echo $this->main->cfg->assets_url; ?>assets/images/text-sample-curved.png" />
			</span>
			<span draggable="true" data-act="add" data-ops='[{"fontFamily":"Anton","text": "10", "fontSize": 100, "font":["","regular"],"type":"i-text", "charSpacing": 40, "top": -50},{"fontFamily":"Poppins","text": "Messi", "fontSize": 30, "font":["","regular"],"type":"i-text", "charSpacing": 40, "top": 10}]' style="text-align: center;">
				<img height="70" src="<?php echo $this->main->cfg->assets_url; ?>assets/images/text-number.png" />
			</span>
			<span draggable="true" data-act="add" data-ops='[{"fontFamily":"Anton","text": "Oblique","fontSize":60,"font":["","regular"],"bridge":{"bottom":4.5,"curve":10,"oblique":true,"offsetY":0.5,"trident":false},"type":"text-fx"}]'>
				<img height="70" src="<?php echo $this->main->cfg->assets_url; ?>assets/images/text-sample-oblique.png" />
			</span>
			<span draggable="true" data-act="add" data-ops='[{"fontFamily":"Anton","text": "Bridge","fontSize":70,"font":["","regular"],"bridge":{"bottom":2,"curve":-4.5,"oblique":false,"offsetY":0.5,"trident":false},"type":"text-fx"}]'>
				<img height="70" src="<?php echo $this->main->cfg->assets_url; ?>assets/images/text-sample-bridge-1.png" />
			</span>
			<span draggable="true" data-act="add" data-ops='[{"fontFamily":"Anton","text": "Bridge","fontSize":70,"font":["","regular"],"bridge":{"bottom":2,"curve":-2.5,"oblique":false,"offsetY":0.1,"trident":false},"type":"text-fx"}]'>
				<img height="70" src="<?php echo $this->main->cfg->assets_url; ?>assets/images/text-sample-bridge-2.png" />
			</span>
			<span draggable="true" data-act="add" data-ops='[{"fontFamily":"Anton","text": "Bridge","fontSize":70,"font":["","regular"],"bridge":{"bottom":2,"curve":-3,"oblique":false,"offsetY":0.5,"trident":true},"type":"text-fx"}]'>
				<img height="70" src="<?php echo $this->main->cfg->assets_url; ?>assets/images/text-sample-bridge-3.png" />
			</span>
			<span draggable="true" data-act="add" data-ops='[{"fontFamily":"Anton","text": "Bridge","fontSize":70,"font":["","regular"],"bridge":{"bottom":5,"curve":5,"oblique":false,"offsetY":0.5,"trident":false},"type":"text-fx"}]'>
				<img height="70" src="<?php echo $this->main->cfg->assets_url; ?>assets/images/text-sample-bridge-4.png" />
			</span>
			<span draggable="true" data-act="add" data-ops='[{"fontFamily":"Anton","text": "Bridge","fontSize":70,"font":["","regular"],"bridge":{"bottom":2.5,"curve":2.5,"oblique":false,"offsetY":0.05,"trident":false},"type":"text-fx"}]'>
				<img height="70" src="<?php echo $this->main->cfg->assets_url; ?>assets/images/text-sample-bridge-5.png" />
			</span>
			<span draggable="true" data-act="add" data-ops='[{"fontFamily":"Anton","text": "Bridge","fontSize":70,"font":["","regular"],"bridge":{"bottom":3,"curve":2.5,"oblique":false,"offsetY":0.5,"trident":true},"type":"text-fx"}]'>
				<img height="70" src="<?php echo $this->main->cfg->assets_url; ?>assets/images/text-sample-bridge-6.png" />
			</span>
			<span id="lumise-text-mask-guide">
				<img height="70" src="<?php echo $this->main->cfg->assets_url; ?>assets/images/text-sample-mask.png" />
			</span>
			<div id="lumise-text-ext"></div>
			<button class="lumise-btn mb2 lumise-more-fonts"><?php echo $this->main->lang('Load more 1000+ fonts'); ?></button>
		</div>
		<div id="lumise-uploads" class="lumise-tab-body-wrp lumise-x-thumbn<?php echo ($comps[0] == 'images' ? ' active' : ''); ?>">
			<?php if ($this->main->connector->is_admin() || $this->main->cfg->settings['disable_resources'] != 1) { ?>
			<header class="images-from-socials lumise_form_group">
				<button class="active" data-nav="internal">
					<i class="lumise-icon-cloud-upload"></i>
					<?php echo $this->main->lang('Upload'); ?>
				</button>
				<button data-nav="external">
					<i class="lumise-icon-magnifier"></i>
					<?php echo $this->main->lang('Resources'); ?>
				</button>
			</header>
			<?php } ?>
			<div data-tab="internal" class="active">
				<div id="lumise-upload-form">
					<i class="lumise-icon-cloud-upload"></i>
					<span><?php echo $this->main->lang('Click or drop images here'); ?></span>
					<input type="file" multiple="true" />
				</div>
				<div id="lumise-upload-list">
					<ul class="lumise-list-items"></ul>
				</div>
			</div>
			<div data-tab="external" id="lumise-external-images"></div>
		</div>
		<div id="lumise-drawing" class="lumise-tab-body-wrp lumise-left-form<?php echo ($comps[0] == 'drawing' ? ' active' : ''); ?>">
			<h3><?php echo $this->main->lang('Free drawing mode'); ?></h3>
			<div>
				<label><?php echo $this->main->lang('Size'); ?></label>
				<inp data-range="helper" data-value="1">
					<input id="lumise-drawing-width" data-callback="drawing" value="1" min="1" max="100" data-value="1" type="range" />
				</inp>
			</div>
			<div<?php echo $this->main->cfg->settings['enable_colors'] == '0' ? ' class="hidden"' : ''; ?>>
				<input id="lumise-drawing-color" placeholder="<?php echo $this->main->lang('Click to choose color'); ?>" type="search" class="color" />
				<span class="lumise-save-color" data-tip="true" data-target="drawing-color">
					<i class="lumisex-android-add"></i>
					<span><?php echo $this->main->lang('Save this color'); ?></span>
				</span>
			</div>
			<div>
				<ul class="lumise-color-presets" data-target="drawing-color"></ul>
			</div>
			<div class="gray">
				<span>
					<i class="lumisex-android-bulb"></i>
					<?php echo $this->main->lang('Tips: Mouse wheel on the canvas to quick change the brush size'); ?>
				</span>
			</div>
		</div>
		<div id="lumise-layers" class="lumise-tab-body-wrp smooth<?php echo ($comps[0] == 'layers' ? ' active' : ''); ?>">
			<ul></ul>
		</div>
		<?php if ($this->main->cfg->settings['report_bugs'] != 0) { ?>
		<div id="lumise-bug" class="lumise-tab-body-wrp lumise-left-form">
			<bug>
				<h3><?php echo $this->main->lang('Bug Reporting'); ?></h3>
				<p><?php echo $this->main->lang('Please let us know if you find any bugs on this design tool or just your opinion to improve the tool.'); ?></p>
				<textarea placeholder="<?php echo $this->main->lang('Bug description (min 30 - max 1500 characters)'); ?>" maxlength="1500" data-id="report-content"></textarea>
				<button class="lumise-btn submit">
					<?php echo $this->main->lang('Send now'); ?> <i class="lumisex-android-send"></i>
				</button>
				<p data-view="tips">
					<?php echo $this->main->lang('Tips: If you want to send content with screenshots or videos, you can upload them to'); ?> 
					<a href="https://imgur.com" target=_blank>imgur.com</a> 
					<?php echo $this->main->lang('or any drive services and put links here.'); ?>
				</p>
				<center><i class="lumisex-bug"></i></center>
			</bug>
		</div>
		<?php } ?>
		<div id="lumise-x-thumbn-preview">
			<header></header>
			<div></div>
			<footer></footer>
		</div>
	</div>
	<?php
	}

    public function printings()
    {
        ?>
        <div class="lumise-prints lumise-cart-field">
            <div class="lumise-add-cart-heading">
                <?php echo $this->main->lang('Print Technologis'); ?>
            </div>
			<div class="lumise_radios lumise_form_content">
	            <?php
	            $rules = array();
	            $items = $this->get_prints();
	            $default = $i = 0;
	            if(count($items) >0){

	                foreach($items as $print):
	                    if($i == 0)
	                        $default = $print['id'];
	                    $rules[$print['id']] = array(
	                        'calc' => json_decode($print['calculate']),
	                        'type' => $print['type']
	                    );

	                ?>
	            <div class="lumise-radio">
	                <input type="radio" name="printing" value="<?php echo $print['id'];?>" id="lumise-print-<?php echo $print['id'];?>"/>
	                <label for="lumise-print-<?php echo $print['id'];?>">
	                <?php echo $print['title'];?>
	                <div class="check"></div>
	                </label>
	                <em class="lumise-printing-desc">
	                    <?php echo $print['description'];?>
	                </em>
	            </div>

	                <?php
	                $i++;
	                endforeach;

	            }
	            else {
					echo $this->main->lang('This product do not have printing options.');
	            }
	            ?>
			</div>
        </div>
    <?php

    }

	public function detail_header($args = array()) {

		global $lumise_router, $lumise_helper;

		echo '<div class="lumise_header">';

		if (!empty($_GET['id'])) {
			echo '<h2>'.$args['edit'].'</h2>'.
					'<a href="'.$lumise_router->getURI().'lumise-page='.$args['page'].(isset($args['type']) ? '&type='.$args['type'] : '').(isset($_GET['callback']) ? '&callback=edit-cms-product' : '').'" class="add_new">'.
					$args['add'].
					'</a>';
		} else {
			echo '<h2>'.$args['add'].'</h2>';
		}

		echo $lumise_helper->breadcrumb(isset($_GET['lumise-page']) ? $_GET['lumise-page'] : '');

		echo '</div>';

		$this->header_message();

	}

	public function header_message(){

		$lumise_msg = $this->main->connector->get_session('lumise_msg');

		if (isset($lumise_msg['status']) && $lumise_msg['status'] == 'error' && is_array($lumise_msg['errors'])) { ?>

			<div class="lumise_message err">

				<?php foreach ($lumise_msg['errors'] as $val) {
					echo '<em class="lumise_err"><i class="fa fa-times"></i>  ' . $val . '</em>';
					$lumise_msg = array('status' => '');
					$this->main->connector->set_session('lumise_msg', $lumise_msg);
				} ?>

			</div>

		<?php }

		if (isset($lumise_msg['status']) && $lumise_msg['status'] == 'success') {

		?>

			<div class="lumise_message">
				<?php
					echo '<em class="lumise_suc"><i class="fa fa-check"></i> '.(isset($lumise_msg['msg'])? $lumise_msg['msg'] : $this->main->lang('Your data has been successfully saved')).'</em>';
					$lumise_msg = array('status' => '');
					$this->main->connector->set_session('lumise_msg', $lumise_msg);
				?>
			</div>

		<?php

		}
	}

    public function tabs_render($args, $tabs_id = '') {
	    
		global $lumise;
	    
	    if (isset($args['tabs'])) {

		    echo '<div class="lumise_tabs_wrapper lumise_form_settings" data-id="'.$tabs_id.'">';
		    echo '<ul class="lumise_tab_nav">';
		    
		    foreach (array_keys($args['tabs']) as $label) {
				$str_att = explode(':', $label);
				$label = (count($str_att) > 1)? $str_att[1]: $label;
				echo '<li>';
				echo '<a href="#lumise-tab-'.((count($str_att) > 1)? $str_att[0]: $this->slugify($label)).'">'.$label.'</a>';
				echo '</li>';
			}
			echo '</ul>';
			echo '<div class="lumise_tabs">';

		    foreach ($args['tabs'] as $label => $fields) {
				$str_att = explode(':', $label);
				$label = (count($str_att) > 1)? $str_att[1]: $label;				
			    echo '<div class="lumise_tab_content" id="lumise-tab-'.((count($str_att) > 1)? $str_att[0]: $this->slugify($label)).'">';

			    $this->fields_render($fields);
			    echo '</div>';
		    }

		    echo '</div>';
		    echo '</div>';

	    }else $this->fields_render($args);

	    if (isset($_GET['id'])) {
	    	echo '<input name="id" value="'.$_GET['id'].'" type="hidden" />';
	    }
		echo '<input type="hidden" name="' . $lumise->cfg->security_name . '" value="'.$lumise->cfg->security_code.'">';
	    echo '<input name="save_data" value="true" type="hidden" />';

    }

    public function fields_render($fields) {
	    foreach ($fields as $field) {
	    	if (isset($field['type'])) {
	    		$this->field_render($field);
	    	}
	    }
    }

    public function field_render ($args = array()) {
	    
	   if ($args['type'] !== 'tabs' && isset($args['value']) && is_string($args['value']))
	    	$args['value'] = stripslashes($args['value']);
	    
	?>
		<?php if (isset($args['type_input']) && $args['type_input'] == 'hidden') {
			if (method_exists($this, 'field_'.$args['type']))
				$this->{'field_'.$args['type']}($args);
		} else { ?>
			<?php if (isset($args['label']) && !empty($args['label'])) { ?>
				<div class="lumise_form_group lumise_field_<?php echo $args['type']; ?>">
					<span><?php
						echo (isset($args['label']) ? $args['label']: '');
						echo (isset($args['required']) && $args['required'] === true ? '<em class="required">*</em>' : '');
					?></span>
					<div class="lumise_form_content">
						<?php
	
							if (method_exists($this, 'field_'.$args['type']))
								$this->{'field_'.$args['type']}($args);
							else echo 'Field not exist: '.$args['type'];
	
							if (isset($args['desc']) && !empty($args['desc']))
								echo '<em class="notice">'.$args['desc'].'</em>';
						?>
					</div>
				</div>
			<?php
			}else{ 
			
				if (method_exists($this, 'field_'.$args['type']))
					$this->{'field_'.$args['type']}($args);
				else echo 'Field not exist: '.$args['type'];
			}
		} ?>
	<?php
    }

    public function field_input ($args) {
	?><input <?php
		$value = ((isset($args['value']) && !empty($args['value'])) ? $args['value']: (isset($args['default']) ? $args['default']: ''));
		if(
			isset($args['numberic'])
		){
			switch ($args['numberic']) {
				case 'int':
					$value = intval($value);
					break;
				
				case 'float':
					$value = floatval($value);
					break;
			}
		}
		if (isset($args['readonly']) && $args['readonly'] === true)
			echo 'readonly="true"';
	?> type="<?php
				echo (isset($args['type_input']) ? $args['type_input']: 'text');
			?>" name="<?php
				echo (isset($args['name']) ? $args['name']: '');
			?>" placeholder="<?php
				echo (isset($args['placeholder']) ? $args['placeholder']: '');
			?>" value="<?php
				echo $value;
			?>" />
	<?php
    }
    
    public function field_admin_login ($args) {
	?>
		<div class="lumise_form_group lumise_field_input">
			<span><?php echo $this->main->lang('Admin email'); ?></span>
			<div class="lumise_form_content">
				<input type="text" name="admin_email" value="<?php echo $this->main->cfg->settings['admin_email']; ?>">
				<em class="notice"><?php echo $this->main->lang('Admin email to login and receive important emails'); ?></em>
			</div>
		</div>
		<div class="lumise_form_group lumise_field_input">
			<span><?php echo $this->main->lang('Admin password'); ?></span>
			<div class="lumise_form_content">
				<input type="password" placeholder="<?php echo $this->main->lang('Enter new password'); ?>" name="admin_password" value="" />
			</div>
		</div>
		<div class="lumise_form_group lumise_field_input">
			<span> &nbsp; </span>
			<div class="lumise_form_content">
				<input type="password" placeholder="<?php echo $this->main->lang('Re-Enter new password'); ?>" name="re_admin_password" value="" />
			</div>
		</div>
	<?php
    }

    public function field_text ($args) {
	?>
		<textarea name="<?php
			echo (isset($args['name']) ? $args['name']: '');
		?>"><?php
			echo (isset($args['value']) ? $args['value']: (isset($args['default']) ? $args['default']: ''));
		?></textarea>
	<?php
    }

    public function field_toggle ($args) {
	?>
		<div class="toggle">
			<input type="checkbox" name="<?php echo $args['name']; ?>" <?php
				if (
					$args['value'] === 1 || 
					$args['value'] == '1' || 
					(
						!isset($args['value']) || (isset($args['value']) && !is_numeric($args['value'])) && $args['default'] == 'yes')
					)
					echo 'checked="true"';
			?> value="1" />
			<span class="toggle-label" data-on="Yes" data-off="No"></span>
			<span class="toggle-handle"></span>
		</div>
	<?php
    }

    public function field_parent ($args) {

    	global $lumise_admin, $lumise_router;
    	if (isset($args['id'])){
			$data = $lumise_admin->get_row_id($args['id'], 'categories');
    	}
		$cates = $lumise_admin->get_categories($args['cate_type']);

   	?>
    	<select name="parent">
			<option value="0"><?php echo $this->main->lang('None'); ?></option>
			<?php

				if ($args['id']) {
					$arr_temp = array($data['id']);
					foreach ($cates as $value) {

						$select = '';
						if (isset($data) && $value['id'] != $data['id']) {

							if ($value['id'] == $data['parent'])
								$select = 'selected';

							if (in_array($value['parent'], $arr_temp)) {
								$arr_temp[] = $value['id'];
							} else {
								if ($value['id'] != $data['id']) {
									echo '<option value="'.$value['id'].'"'.$select.'>'.str_repeat('&mdash;', $value['lv']).' '.$value['name'].'</option>';
								}
							}

						}

					}

				} else {

					foreach ($cates as $value) {
						$select = '';
						echo '<option value="'.$value['id'].'"'.$select.'>'.str_repeat('-', $value['lv']).' '.$value['name'].'</option>';
					}

				}

			?>
		</select>
	<?php
    }

	public function field_categories ($args) {

		global $lumise_admin, $lumise_router;

		$cates = $lumise_admin->get_categories($args['cate_type']);

		if (count($cates) > 0) {

			$dt = $lumise_admin->get_category_item($args['id'], $args['cate_type']);
			$dt_id = array();

			foreach ($dt as $value) {
				$dt_id[] = $value['id'];
			}

			echo '<ul class="list-cate">';

			foreach ($cates as $value) {

				$pd = 20*$value['lv'].'px';
				$checked = '';

				if (isset($dt_id)) {
					if (in_array($value['id'], $dt_id)) {
						$checked = 'checked';
					}
				}
			?>
				<li style="padding-left: <?php echo $pd; ?>">
					<div class="lumise_checkbox sty2 <?php echo $checked; ?>">
							<input type="checkbox" name="<?php
								echo isset($args['name']) ? $args['name'].'[]' : '';
							?>" class="action_check" value="<?php
								echo $value['id'];
							?>" class="action" id="lumise-cate-<?php
								echo $value['id'];
							?>" <?php
								echo $checked;
							?> />
							<label for="lumise-cate-<?php echo $value['id']; ?>">
								<?php echo $value['name']; ?>
								<em class="check"></em>
							</label>
					</div>
				</li>
			<?php } ?>
			</ul>
			<input type="checkbox" name="<?php echo $args['name']; ?>[]" checked="true" style="display:none;" value="" />
			<a href="<?php echo $lumise_router->getURI(); ?>lumise-page=category&type=<?php echo $args['cate_type']; ?>" target=_blank class="lumise_add_cate">
				<?php echo $this->main->lang('Add Category'); ?>
			</a>
		<?php } else { ?>
			<p class="no-data"><?php echo $this->main->lang('You have not created any category yet'); ?>. </p>
			<a href="<?php echo $lumise_router->getURI();?>lumise-page=category&type=<?php echo $args['cate_type']; ?>" target=_blank  class="add-new">
				<?php echo $this->main->lang('Create new category'); ?>
			</a>
		<?php }
    }

    public function field_tags($args = array()) {

	    global $lumise_admin, $lumise_router;

	?>
		<div class="list-tag">
			<?php

				$dt_name = array();
				if (isset($args['id'])) {

					$dt = $lumise_admin->get_tag_item($args['id'], $args['tag_type']);

					foreach ($dt as $value) {
						$dt_name[] = $value['name'];
					}

				}

			?>
			<input id="tags" type="text" name="<?php
				echo isset($args['name']) ? $args['name'] : '';
			?>" value="<?php echo implode(', ', $dt_name); ?>" />
		</div>
		<script type="text/javascript"><?php

			$tags = $lumise_admin->get_rows_custom(array ("id", "name", "slug", "type"),'tags');

			// Autocomplete Tag
			function js_str($s) {
			    return '"' . addcslashes($s, "\0..\37\"\\") . '"';
			}

			function js_array($array) {
			    $temp = array_map('js_str', $array);
			    return '[' . implode(',', $temp) . ']';
			}

			if (isset($tags) && count($tags) > 0) {
				$values = array();
				foreach ($tags as $value) {

					if ($value['type'] == $args['tag_type'])
						$values[] = $value['name'];

				}
				echo 'var lumise_tag_values = ', js_array($values), ';';
			}
		?></script>
	<?php
    }

    public function field_radios($args = array()) {
	    if ($args['options']) {
		    echo '<div class="lumise_radios">';
		    foreach ($args['options'] as $option => $value) {
				if (empty($args['value']) && empty($option))
					unset($args['default']);
			}
		    foreach ($args['options'] as $option => $value) {
			?>
			<div class="radio">
				<input type="radio" name="<?php
					echo isset($args['name']) ? $args['name'] : ''
				?>" id="lumise-radios-<?php echo (isset($args['name']) ? $args['name'] : '').'-'.$option; ?>" <?php
					if ((empty($args['value']) && isset($args['default']) && $args['default'] == $option) || (isset($args['value']) && $args['value'] == $option))
						echo 'checked="true"';
				?> value="<?php echo $option; ?>">
				<label for="lumise-radios-<?php echo (isset($args['name']) ? $args['name'] : '').'-'.$option; ?>">
					<?php echo $value; ?> <em class="check"></em>
				</label>
			</div>
			<?php
			}
			echo '</div>';
		}else echo 'missing options';
    }


    public function field_checkboxes($args = array()) {

	    if (isset($args['value'])) {
	    	if (is_string($args['value']))
	    		$args['value'] = explode(',', $args['value']);
		}else
			$args['value'] = array();

	    if (isset($args['options'])) {
		    echo '<div class="lumise_checkboxes">';
		    $options = array_replace(array_flip($args['value']), $args['options']);
		    foreach ($options as $option => $value) {
			    if (isset($args['options'][$option])) {
			?>
				<div class="lumise_checkbox sty2 ">
					<input type="checkbox" name="<?php
						echo isset($args['name']) ? $args['name'].'[]' : ''
					?>" class="action_check" value="<?php echo $option; ?>" <?php
						if (in_array($option, $args['value']) || (!isset($args['value']) && $args['default'] == $option))
							echo 'checked="true"';
					?> id="lumise-checkboxes-<?php echo $option; ?>" />
						<label for="lumise-checkboxes-<?php echo $option; ?>">
							<?php echo $value; ?> <em class="check"></em>
						</label>
				</div>
			<?php }} ?>
				<input type="checkbox" name="<?php echo $args['name']; ?>[]" checked="true" style="display:none;" value="" />
			</div>
		<?php }else echo 'missing options';
    }


    public function field_dropbox($args = array()) {
	    if (isset($args['options'])) {
		    echo '<select name="'.(isset($args['name']) ? $args['name'] : '').'" class="'.(isset($args['class']) ? $args['class'] : '').'">';
		    foreach ($args['options'] as $option => $value) {
			    echo '<option'.(((!isset($args['value']) && $args['default'] == $option) || (isset($args['value']) && $args['value'] == $option)) ? ' selected="true"' : '').' value="'.$option.'">'.$value.'</option>';
			}
			echo '</select>';
		}else echo 'missing options';
    }

    public function field_printing($args = array()) {
		
		$prints = $this->main->views->get_prints();
		$inp_val = json_decode(rawurldecode($args['value']));
		
		if (count($prints) > 0) {
			
			foreach ($prints as $print) {
				$calc = $this->main->lib->dejson($print['calculate']);
		?>
			<div class="lumise_checkbox sty2 ui-sortable-handle" data-type="<?php echo $calc->type; ?>">
				<input type="checkbox" name="helper-<?php echo $args['name']; ?>[]" class="action_check" value="<?php echo $print['id']; ?>" <?php
					echo (is_object($inp_val) && isset($inp_val->{$print['id']})) ? ' checked' : '';
				?> id="lumise-checkboxes-<?php echo $args['name'] . '-'. $print['id']; ?>">
				<label for="lumise-checkboxes-<?php echo $args['name'] . '-'. $print['id']; ?>">
					<?php echo $print['title']; ?> <em class="check"></em>
				</label>
			</div>
			<?php
				if (is_object($calc) && isset($calc->type) && $calc->type == 'size') {
					echo '<div class="lumise_radios field_children display_inline">';
					foreach (current((Array)$calc->values->front) as $key => $val) {
						echo '<div class="radio">';
						echo '<input type="radio"'.(
							is_object($inp_val) && 
							isset($inp_val->{$print['id']}) && 
							$inp_val->{$print['id']} == $key ? ' checked' : ''
						).' name="print-sizes-'.$print['id'].'" id="print-size-'.$print['id'].$key.'" value="'.$key.'" />';
						echo ' <label for="print-size-'.$print['id'].$key.'">'.urldecode($key).' <em class="check"></em></label>';
						echo '</div>';
					}
					echo '</div>';
				}
			?>
		<?php
			}
				
		} else {
			echo '<p>'.$this->main->lang('You have not created any prints type yet').'</p><input type="hidden" name="'.$args['name'].'[]" />';
		}
		
		echo '<input type="hidden" class="field-value" name="'.$args['name'].'" value="'.rawurlencode($args['value']).'" />';

    }

	public function field_color($args) {
	?>
	<div class="lumise-field-color-wrp">
		<ul class="lumise-field-color<?php echo (isset($args['selection']) && $args['selection'] === false) ? ' unselection' : ''; ?>">
		<?php

			if (!isset($args['value']) || empty($args['value'])) {
				if (isset($args['default']))
					$args['value'] = $args['default'];
				else $args['value'] = '#3fc7ba:#546e7a,#757575,#6d4c41,#f4511e,#fb8c00,#ffb300,#fdd835,#c0cA33,#a0ce4e,#7cb342,#43a047,#00897b,#00acc1,#3fc7ba,#039be5,#3949ab,#5e35b1,#8e24aa,#d81b60,#eeeeee,#3a3a3a';
			}

			$colors = explode(':', $args['value']);
			$value = $colors[0];
			$colors = explode(',', isset($colors[1]) ? $colors[1] : '');

			foreach ($colors as $color) {
				
				$color = explode('@', $color);
				$label = isset($color[1]) ? $color[1] : '';
				
				echo '<li data-label="'.$label.'" data-color="'.strtolower($color[0]).
					'" title="'.(!empty($label) ? str_replace('"', '', urldecode($label)) : strtolower($color[0])).
					'" '.($color[0] == $value ? 'class="choosed"' : '').
					' style="background:'.$color[0].'">'.
					'<i class="fa fa-times" data-color="delete"></i>'.
					'</li>';
			}
		?>
		</ul>
		<input type="hidden" data-el="hide" value="<?php echo isset($args['value']) ? $args['value']: $args['default']; ?>" name="<?php
			echo isset($args['name']) ? $args['name'] : '';
		?>" />
		<button data-func="create-color">
			<i class="fa fa-plus"></i> <?php echo $this->main->lang('Add new color'); ?>
		</button>
		<button data-btn data-func="clear-color">
			<i class="fa fa-eraser"></i> <?php echo $this->main->lang('Clear all'); ?>
		</button>
	</div>
	<?php
	}

	public function field_upload($attr = array()){
	?>


		<?php
			if (isset($attr['file']) && $attr['file'] == 'font') {
		?>
			<h1 id="lumise-<?php echo $attr['name']; ?>-preview" contenteditable="true" style="display: none;"></h1>
			<div class="img-preview">
				<?php if (!empty($attr['value'])) { ?>
					<input type="hidden" name="old-<?php echo $attr['name']; ?>" value="<?php echo $attr['value'] ?>">
				<?php } ?>
				<input type="file" id="lumise-<?php echo $attr['name']; ?>-file-upload" accept=".woff,.woff2" data-file-select="font" data-file-preview="#lumise-<?php echo $attr['name']; ?>-preview" data-file-input="#lumise-<?php echo $attr['name']; ?>-input" />

				<input type="hidden" name="<?php
					echo $attr['name'];
				?>" id="lumise-<?php
					echo $attr['name'];
				?>-input" value="<?php
					echo !empty($attr['value']) ? $attr['value'] : '';
				?>" />

				<label for="lumise-<?php echo $attr['name']; ?>-file-upload">
					<?php echo $this->main->lang('Choose a file'); ?>
				</label>
				<button data-btn="true" data-file-delete="true"  data-file-preview="#lumise-<?php
					echo $attr['name'];
				?>-preview" data-file-input="#lumise-<?php
					echo $attr['name'];
				?>-input" data-file-thumbn="#lumise-<?php
					echo $attr['name'];
				?>-thumbn">
					<?php echo $this->main->lang('Remove file'); ?>
				</button>
			</div>
			<script type="text/javascript">

				<?php if (!empty($attr['value']) && !empty($attr['name'])) {
					echo 'lumise_font_preview("'.$attr['name'].'", "url('.(!empty($attr['value']) ? $this->main->cfg->upload_url.str_replace(TS, '/', $attr['value']) : '').')", "#lumise-'.$attr['name'].'-preview")';
				} ?>

			</script>
		<?php

			return;

			}
		?>
		
		
		<?php
			if (isset($attr['file']) && $attr['file'] == 'design') {
		?>
			<div class="img-preview">
				<?php if (!empty($attr['value'])) { ?>
					<img src="<?php
					echo isset($attr['thumbn_value']) ? $attr['thumbn_value'] : $this->main->cfg->upload_url.'/'.$attr['value'];
				?>" class="img-upload" id="lumise-<?php echo $attr['name']; ?>-preview" />
					<input type="hidden" name="old-<?php echo $attr['name']; ?>" value="<?php echo $attr['value'] ?>">
				<?php }else{ ?>
					<img src="<?php echo $this->main->cfg->assets_url; ?>admin/assets/images/img-none.png" class="img-upload" id="lumise-<?php echo $attr['name']; ?>-preview">
				<?php } ?>
				<input type="file" id="lumise-<?php echo $attr['name']; ?>-file-upload" accept=".json,.lumi" data-file-select="design" data-file-preview="#lumise-<?php echo $attr['name']; ?>-preview" data-file-input="#lumise-<?php echo $attr['name']; ?>-input" />

				<input type="hidden" name="<?php
					echo $attr['name'];
				?>" id="lumise-<?php
					echo $attr['name'];
				?>-input" data-file-preview="#lumise-<?php
					echo $attr['name'];
				?>-preview" value="<?php
					echo !empty($attr['value']) ? $attr['value'] : '';
				?>" />
				
				<?php if (isset($attr['thumbn']) && isset($attr['thumbn_value'])) { ?>

					<input type="hidden" name="old-<?php echo $attr['thumbn']; ?>" value="<?php
						echo isset($attr['thumbn_value']) ? $attr['thumbn_value'] : '';
					?>" />
	
				<?php } ?>
			
				<label for="lumise-<?php echo $attr['name']; ?>-file-upload">
					<?php echo $this->main->lang('Choose a file'); ?>
				</label>
				<button data-btn="true" data-file-delete="true"  data-file-preview="#lumise-<?php
					echo $attr['name'];
				?>-preview" data-file-input="#lumise-<?php
					echo $attr['name'];
				?>-input" data-file-thumbn="#lumise-<?php
					echo $attr['name'];
				?>-thumbn">
					<?php echo $this->main->lang('Remove file'); ?>
				</button>
			</div>
		<?php

			return;

			}
		?>

		<div class="img-preview">
			<?php if (isset($attr['value']) && !empty($attr['value'])) { ?>

				<img src="<?php
					echo isset($attr['thumbn_value']) ?
						$attr['thumbn_value'] : 
						(
							(strpos($attr['value'], '://') === false) ? 
							$this->main->cfg->upload_url.$attr['value'] : 
							$attr['value']
						);
					
				?>" class="img-upload" id="lumise-<?php echo $attr['name']; ?>-preview" />

				<input type="hidden" name="old-<?php echo $attr['name']; ?>" value="<?php
					echo !empty($attr['value']) ? $attr['value'] : '';
				?>" />

			<?php } else { ?>
				<img src="<?php echo $this->main->cfg->assets_url; ?>admin/assets/images/img-none.png" class="img-upload" id="lumise-<?php echo $attr['name']; ?>-preview">
			<?php } ?>

			<input type="file" accept="<?php
				echo isset($attr['accept']) ? $attr['accept'] : 'image/png,image/gif,image/jpeg,image/svg+xml';
			?>" class="lumise-file-upload" id="<?php
				echo $attr['name'];
			?>_file_upload" data-file-select="true" data-file-preview="#lumise-<?php
				echo $attr['name'];
			?>-preview" data-file-input="#lumise-<?php
				echo $attr['name'];
			?>-input" <?php
				if (!isset($attr['thumbn_width']) && !isset($attr['thumbn_height']))
					echo 'data-file-thumbn-width="320"';
				else if (isset($attr['thumbn_width']))
					echo 'data-file-thumbn-width="'.$attr['thumbn_width'].'"';
				else if (isset($attr['thumbn_height']))
					echo 'data-file-thumbn-height="'.$attr['thumbn_height'].'"';
			?> />


			<input type="hidden" name="<?php
				echo $attr['name'];
			?>" id="lumise-<?php
				echo $attr['name'];
			?>-input" value="<?php
				echo !empty($attr['value']) ? $attr['value'] : '';

			?>" />

			<?php if (isset($attr['thumbn']) && isset($attr['thumbn_value'])) { ?>

				<input type="hidden" name="old-<?php echo $attr['thumbn']; ?>" value="<?php
					echo isset($attr['thumbn_value']) ? $attr['thumbn_value'] : '';
				?>" />

			<?php } ?>

			<label for="<?php echo $attr['name']; ?>_file_upload">
				<?php echo isset($attr['button_text']) ? $attr['button_text'] : $this->main->lang('Choose a file'); ?>
			</label>
			<button data-btn="true" data-file-delete="true"  data-file-preview="#lumise-<?php
				echo $attr['name'];
			?>-preview" data-file-input="#lumise-<?php
				echo $attr['name'];
			?>-input" data-file-thumbn="#lumise-<?php
				echo $attr['name'];
			?>-thumbn">
				<?php echo $this->main->lang('Remove file'); ?>
			</button>
		</div>

	<?php
	}

	public function field_stages($args) {
		
		global $lumise;
		$cfg_stages = (int)$lumise->cfg->settings['stages'];
		$data = $this->dejson($args['value']);
	?>
	<div class="lumise_tabs_wrapper" id="lumise-stages-wrp" data-id="stages">
		<ul class="lumise_tab_nav">
			<li class="active">
				<?php 
					$label = $this->main->lang($lumise->cfg->settings['label_stage_1']);
					if (isset($data->front) && isset($data->front->label))
						$label = rawurldecode($data->front->label);
				?>
				<a href="#lumise-tab-front" data-label="<?php echo rawurlencode($label); ?>">
					<text><?php echo $label; ?></text>
					<i class="fa fa-pencil"></i>
				</a>
			</li>
			<?php 
			if ($cfg_stages > 1) {
				$label = $this->main->lang($lumise->cfg->settings['label_stage_2']);
				if (isset($data->back) && isset($data->back->label))
					$label = rawurldecode($data->back->label); 
			?>
			<li>
				<a href="#lumise-tab-back" data-label="<?php echo rawurlencode($label); ?>">
					<text><?php echo $label; ?></text>
					<i class="fa fa-pencil"></i>
				</a>
			</li>
			<?php } 
			 if ($cfg_stages > 2) {
				$label = $this->main->lang($lumise->cfg->settings['label_stage_3']);
				if (isset($data->left) && isset($data->left->label))
					$label = rawurldecode($data->left->label); 
			?>
			<li>
				<a href="#lumise-tab-left" data-label="<?php echo rawurlencode($label); ?>">
					<text><?php echo $label; ?></text>
					<i class="fa fa-pencil"></i>
				</a>
			</li>
			<?php } 
			 if ($cfg_stages > 3) {
				$label = $this->main->lang($lumise->cfg->settings['label_stage_4']);
				if (isset($data->right) && isset($data->right->label))
					$label = rawurldecode($data->right->label); 
			?>
			<li>
				<a href="#lumise-tab-right" data-label="<?php echo rawurlencode($label); ?>">
					<text><?php echo $label; ?></text>
					<i class="fa fa-pencil"></i>
				</a>
			</li>
			<?php } ?>
		</ul>

		<div class="lumise_tabs">
		<?php
			
			$source = '';
			$overlay = '';
			
			$stages = array("front");
			
			if ($cfg_stages > 1)
				array_push($stages, "back");
			if ($cfg_stages > 2)
				array_push($stages, "left");
			if ($cfg_stages > 3)
				array_push($stages, "right");
			
			foreach ($stages as $stage){

				if (isset($data->{$stage})) {

					$sdata = $data->{$stage};

					if (isset($sdata->url)) {
						$url = $sdata->url;
						$source = $sdata->source;
					}else if ($stage == 'front'){
						$url = 'products/basic_tshirt_front.png';
						$source = 'raws';
					}else $url = '';
					
					$overlay = $sdata->overlay;
					
					if (isset($sdata->edit_zone) && isset($sdata->url)) {
						$limit = ' style="height: '.$sdata->edit_zone->height.'px;';
						$limit .= 'width: '.$sdata->edit_zone->width.'px;';
						$limit .= 'left: '.($sdata->edit_zone->left+($sdata->product_width/2)-($sdata->edit_zone->width/2)).'px;';
						$limit .= 'top: '.($sdata->edit_zone->top+($sdata->product_height/2)-($sdata->edit_zone->height/2)).'px;';
						if (isset($sdata->edit_zone->radius) && !empty($sdata->edit_zone->radius))
							$limit .= 'border-radius: '.$sdata->edit_zone->radius.'px;';
						$limit .= '"';
					}else $limit = '';
					
					if (isset($sdata->template) && isset($sdata->template->id)) {
						
						$design = $lumise->lib->get_template($sdata->template->id);
						if (
							$this->main->connector->platform == 'php' &&
							(!is_array($design) || !isset($design['id']))
						)
							$design = null;
							
					}else $design = null;

				}else{
					$sdata = array();
					$design = null;
					$limit = '';
					if ($stage == 'front') {
						$url = 'products/basic_tshirt_front.png';
						$source = 'raws';
					}else $url = '';
				}
				
			?>
			<div class="lumise_tab_content<?php
				if ($stage == 'front')echo " active";
			?>" id="lumise-tab-<?php echo $stage; ?>" data-stage="<?php echo $stage; ?>">
				<div class="lumise-stage-settings lumise-product-design<?php
					echo (!empty($url) ? ' stage-enabled' : ' stage-disabled'); ?>" id="lumise-product-design-<?php echo $stage; ?>">
					<div class="lumise-stage-body">
						<div class="lumise_form_content">
							<div class="toggle">
								<input type="checkbox" name="is_mask" <?php
									if ($overlay == '1' || ($overlay == '' && $source == 'raws'))
										echo 'checked="true"';
								?> />
								<span class="toggle-label" data-on="Yes" data-off="No"></span>
								<span class="toggle-handle"></span>
							</div>
							<label>
								<?php echo $this->main->lang('Use as mask product'); ?>.
								<a href="https://docs.lumise.com/product-mask-image/" target=_blank class="tip">
									<?php echo $this->main->lang('What is this'); ?> 
									<i class="fa fa-question-circle"></i>
									<span>
										<?php echo $this->main->lang('Use as mask product image to be able to change the color, Click for more detail.'); ?>
									</span>
								</a>
							</label>
						</div>
						<div class="lumise-stage-design-view">
							<img src="<?php 
								if (!empty($url)) {
									echo ($source == 'raws' ? $this->main->cfg->assets_url.'raws/' : $this->main->cfg->upload_url).$url;
								}
							?>" data-url="<?php echo $url; ?>" data-source="<?php echo $source; ?>" class="lumise-stage-image" data-svg="<?php echo (strpos($url, '.svg') !== false); ?>" />
							<div class="lumise-stage-editzone"<?php echo $limit; ?>>
								<?php if ($this->main->connector->platform == 'php') { ?>
									<div class="editzone-funcs">
										<button data-func="select-design" data-label="<?php echo $this->main->lang('Select Design Template'); ?>">
											<i class="fa fa-plus"></i>
										</button>
										<button data-func="clear-design" <?php if (!isset($design) || $design === null)echo 'style="display:none;"'; ?> data-label="<?php echo $this->main->lang('Clear Design Template'); ?>">
											<i class="fa fa-eraser"></i>
										</button>
										<button data-func="move" data-label="<?php echo $this->main->lang('Drag to move the edit zone'); ?>">
											<i class="fa fa-arrows"></i>
										</button>
									</div>
								<?php
									} else {
										echo '<div class="editzone-gui">';
										echo '<strong>';
											echo $this->main->lang('Drag to move');
											echo '<small>'.$this->main->lang('Edit area').'</small>';
										echo '</strong>';
										echo '</div>';
									}
									
								?>
								<i class="fa fa-expand" data-func="resize" title="<?php 
									echo $this->main->lang('Resize the edit zone'); 
								?>"<?php
									if (isset($sdata->edit_zone)) {
										echo ' data-info="'.$sdata->edit_zone->width.' x '.$sdata->edit_zone->height.'"';
									}
								?>></i>
								<?php
									
									if ($this->main->connector->platform == 'php') {
										if (isset($design) && $design !== null) {
											echo '<div class="design-template-inner" '.(
												(isset($sdata->edit_zone->radius) && !empty($sdata->edit_zone->radius)) ? 
												'style="border-radius: '.$sdata->edit_zone->radius.'px"' : 
												'' 
											).' data-id="'.$design['id'].'">';
											echo '<img style="'.$sdata->template->css.'" src="'.$design['screenshot'].'">';
											echo '</div>';
										}else{
											echo '<button data-func="select-design" class="design-template-btn">';
											echo '<i class="fa fa-paint-brush"></i> ';
											echo $this->main->lang('Design Template');
											echo '</button>';
										}
									}
									
								?>
								
							</div>
							
							<div class="editzone-ranges">
								<?php if ($this->main->connector->platform == 'php') { ?>
								<div class="edr-row design-scale"<?php if(!isset($design) || $design === null)echo ' style="display: none;"';?>>
									<label><?php echo $this->main->lang('Design scale'); ?>:</label>
									<input type="range" min="10" max="200" value="<?php
										if (isset($sdata->template) && isset($sdata->template->scale))
											echo $sdata->template->scale; 
									?>" />
								</div>
								<?php } ?>
								<div class="edr-row editzone-radius">
									<label><?php echo $this->main->lang('Editzone radius'); ?>:</label>
									<input type="range" min="0" max="500" value="<?php
										if (isset($sdata->edit_zone->radius) && !empty($sdata->edit_zone->radius))
											echo $sdata->edit_zone->radius;
										else echo 0; 
									?>" />
								</div>
							</div>
								
						</div>
						<div class="lumise-stage-btn">
							<button data-btn data-select-base="<?php echo $stage; ?>">
								<i class="fa fa-th"></i>
								<?php echo $this->main->lang('Product image'); ?>
							</button>
							<button data-btn data-revert-base="<?php echo $stage; ?>">
								<i class="fa fa-refresh"></i>
								<?php echo $this->main->lang('Revert edited'); ?>
							</button>
							<button data-btn data-delete-base="<?php echo $stage; ?>">
								<i class="fa fa-times"></i>
								<?php echo $this->main->lang('Delete stage'); ?>
							</button>
							<input type="hidden" name="old-product-upload-<?php echo $stage; ?>" value="<?php echo $url; ?>" />
							<input type="hidden" name="old-product-upload-<?php echo $stage; ?>-source" value="<?php echo $source; ?>" />
							<input type="hidden" name="product-upload-<?php echo $stage; ?>" value="" />
						</div>
					</div>
				</div>
			</div>
			<?php } ?>
		</div>
	</div>
	<textarea style="display: none;" class="stages-field" name="<?php echo isset($args['name']) ? $args['name'] : ''; ?>"><?php
		echo isset($args['value']) ? $args['value'] : '';
	?></textarea>
	<div id="lumise-popup">
		<div class="lumise-popup-content">
			<header>
				<h3>
					<span><?php echo $this->main->lang('Select from default images, or upload your custom image'); ?></span>
					<?php
						if (!$lumise->caps('lumise_can_upload')) {
					?>
					<button class="lumise-btn-primary" style="background-color: #bfbfbf !important;cursor: no-drop;" data-act="upload">
						<i class="fa fa-cloud-upload"></i> 
						<?php echo $this->main->lang('Upload your image'); ?>
					</button>
					<small style="color:red"><?php echo $this->main->lang('Sorry, You are not allowed to upload files. Please ask the administrator for permission'); ?></small>
					<?php } else { ?>
					<button class="lumise-btn-primary" data-act="upload">
						<i class="fa fa-cloud-upload"></i> 
						<?php echo $this->main->lang('Upload your image'); ?>
					</button>
					<small><?php echo $this->main->lang('Accept file type: .jpg, .png, .svg (1KB -> 5MB)'); ?></small>
					<input type="file" class="hidden" id="lumise-product-upload-input" />
					<?php } ?>
				</h3>
				<span class="close-pop"><svg enable-background="new 0 0 32 32" height="32px" id="close" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M17.459,16.014l8.239-8.194c0.395-0.391,0.395-1.024,0-1.414c-0.394-0.391-1.034-0.391-1.428,0  l-8.232,8.187L7.73,6.284c-0.394-0.395-1.034-0.395-1.428,0c-0.394,0.396-0.394,1.037,0,1.432l8.302,8.303l-8.332,8.286  c-0.394,0.391-0.394,1.024,0,1.414c0.394,0.391,1.034,0.391,1.428,0l8.325-8.279l8.275,8.276c0.394,0.395,1.034,0.395,1.428,0  c0.394-0.396,0.394-1.037,0-1.432L17.459,16.014z" fill="#121313" id="Close"></path><g></g><g></g><g></g><g></g><g></g><g></g></svg></span>
			</header>
			<div id="lumise-base-images">
				<p class="lumise-notice"><?php 
					echo $this->main->lang('Notice: If you want the upload product image have the ability to change color on the editor.'); 
					echo ' <a href="https://docs.lumise.com/product-mask-image/" target="_blank">';
					echo $this->main->lang('Read more Mask Image');
					echo ' <i class="fa fa-arrow-circle-o-right"></i>';
					echo '</a>';
				?></p>
				<ul class="lumise-stagle-list-base">
					<?php
						foreach($this->main->cfg->base_default as $item) {
							echo '<li><img data-act="base" data-src="products/'.$item.'" data-source="raws" src="'.$this->main->cfg->assets_url.'raws/products/'.$item.'" />';
							echo '<span>'.str_replace(array('_', '.png'), array(' ', ''), $item).'</span>';
							echo '</li>';
						}
					?>
				</ul>
			</div>
		</div>
	</div>
	<script type="text/javascript">
		var lumise_upload_url = '<?php echo $this->main->cfg->upload_url; ?>',
			lumise_assets_url = '<?php echo $this->main->cfg->assets_url; ?>';
	</script>
	<?php
	}

	public function field_shape($args) {
	?><div id="lumise_shape_preview"></div><br />
		<textarea name="<?php echo isset($args['name']) ? $args['name'] : ''; ?>" id="lumise_shape_content"><?php echo !empty($args['value']) ? $args['value'] : '&lt;svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0,0,100,100"&gt;&lt;polygon points="50 0, 0 100, 100 100"&gt;&lt;/polygon&gt;&lt;/svg&gt;' ?></textarea>
		<script type="text/javascript">
			window.onload = function() {

				jQuery('#lumise_shape_content').on('input', function(e) {
					jQuery('#lumise_shape_preview').html(this.value);
				}).trigger('input');

			};
		</script>
	<?php
	}

	public function field_print($args) {
		
		global $lumise;
		
		$printing_types = $args['prints_type'];
		$prices = isset($args['value'])? $this->dejson($args['value']) : json_decode('{"type":"multi", "multi" : "true"}');

		$print_type = isset($prices->type)? $prices->type : 'multi';

		if (isset($printing_types[$print_type]) && isset($prices->values)) {
        	$printing_types[$print_type]['values'] = $prices->values;
        }
        
		?>
		<div data-view="multi">
			<div class="toggle">
				<input type="checkbox" data-func="multi" <?php echo ((isset($prices->multi) && $prices->multi) ? 'checked' : ''); ?> value="1">
				<span class="toggle-label" data-on="Yes" data-off="No"></span>
				<span class="toggle-handle"></span>
			</div>
			<em class="notice"><?php echo $this->main->lang('Allow setup price for each stage?'); ?></em>
		</div>
		<?php foreach ($printing_types as $type => $calcs) { ?>
		<div class="lumise_radios">
			<div class="radio">
				<input type="radio" data-func="type" name="lumise-printing-<?php echo $args['name']; ?>" id="lumise-radio-<?php echo $type; ?>" value="<?php echo $type; ?>" <?php if($type == $print_type) echo 'checked'; ?>>
				<label for="lumise-radio-<?php echo $type; ?>">
					<?php echo $calcs['label']; ?>
					<div class="check"></div>
				</label>
				<em class="notice">
					<?php echo $calcs['desc']; ?>
				</em>
			</div>
            <div class="lumise_radio_content" data-type="<?php echo $type; ?>"></div>
		</div>
		<?php } ?>
		<input type="hidden" name="<?php echo $args['name']; ?>" data-func="data-saved" value="<?php echo isset($args['value']) ? $args['value'] : ''; ?>" />
		<p data-view="multi"></p>
		<?php echo $this->main->lang('If you need to understand more about the printing cost calculator'); ?>. <a href="https://docs.lumise.com/printing-cost-calculator/?utm_source=clients&utm_medium=links&utm_campaign=client-site&utm_term=attributes&utm_content=<?php echo $this->main->connector->platform; ?>" target=_blank><?php echo $this->main->lang('Click for more details'); ?></a>
		<script>
			document.lumiseconfig = {
				main: 'printing',
				ops: {
					data: <?php echo json_encode( (object) $printing_types ); ?>,
			   		multi: <?php echo (isset($printing_types['multi_sides']) && $printing_types['multi_sides'] == 1)? 'true' : 'false'; ?>,
			   		show_detail: '<?php echo isset($prices->show_detail) ? $prices->show_detail : ''; ?>',
			   		current_type: '<?php echo ($type ? $type : 'multi'); ?>',
			   		langs: {
			    		aqr: '<?php echo $this->main->lang('Add Quantity Range'); ?>',
			    		qr: '<?php echo $this->main->lang('Qantity Range'); ?>',
			    		nd: '<?php echo $this->main->lang('You can not remove all items, must have at least one option for printing method.'); ?>',
			        	_front: '<?php echo $lumise->lang($lumise->cfg->settings['label_stage_1']); ?>',
			        	_back: '<?php echo $lumise->lang($lumise->cfg->settings['label_stage_2']); ?>',
			        	_left: '<?php echo $lumise->lang($lumise->cfg->settings['label_stage_3']); ?>',
			        	_right: '<?php echo $lumise->lang($lumise->cfg->settings['label_stage_4']); ?>',
					},
					sta: <?php echo isset($lumise->cfg->settings['stages']) && !empty($lumise->cfg->settings['stages']) ? $lumise->cfg->settings['stages'] : 4; ?>,
				}
			}
		</script>
		<?php
	}

	public function field_tabs($args) {

		if (!isset($args['tabs'])) {
			echo 'Missing option tabs';
			return;
		}
		
		if(is_array($args['value']) && !count($args['value']))
			$args['value'] = $args['default'];
			
		if (is_string($args['value']))
			$value = @json_decode($args['value']);
		else $value = $args['value'];

		if ($value === null)
			$value = array();

		$tabs = array();

		for ($i=0; $i<$args['tabs']; $i++) {
			$tabs['Tab '.($i+1)] = array(
				array(
					'type' => 'input',
					'name' => $args['name'].'['.$i.'][title]',
					'label' => $this->main->lang('Title'),
					'value' => isset($value[$i]) ? $value[$i]->title : ''
				),
				array(
					'type' => 'text',
					'name' => $args['name'].'['.$i.'][content]',
					'label' => $this->main->lang('Content'),
					'value' => isset($value[$i]) ? stripslashes($value[$i]->content) : ''
				),
			);
		}

		$this->tabs_render(array(
			'tabs' => $tabs
		));

	}

	public function field_google_fonts($args) {
	?>
	<div class="lumise-field-google_fonts">
		<ul>
			<?php
				$fonts = json_decode($args['value']);
				foreach ($fonts as $name => $font) {
					
					$txt = str_replace(' ', '+', urldecode($name)).':'.$font[1];
					echo '<li data-n='.$name.' data-f="'.$font[0].'" data-s="'.$font[1].'">';
					echo '<link rel="stylesheet" href="//fonts.googleapis.com/css?family='.$txt.'" />';
					echo '<font style="font-family: '.urldecode($name).';">'.urldecode($name).'</font>';
					echo '<delete data-act="delete">'.$this->main->lang('Delete').'</delete>';
					echo '</li>';
				} 
			?>
		</ul>
		<p>
			<button data-btn="primary" data-act="add">
				<i class="fa fa-plus"></i> <?php echo $this->main->lang('Add new font'); ?>
			</button>
		</p>
		<textarea data-func="value" style="display: none;" name="<?php echo isset($args['name']) ? $args['name'] : ''; ?>"><?php 
			echo isset($args['value']) ? $args['value'] : ''; 
		?></textarea>
	</div>
	<?php
	}
	
	public function field_attributes($args) {
	?>
	<div class="lumise_form_group lumise_field_input">
		<div class="lumise_form_content">
			<div class="lumise-field-attributes">
				<header>
					<button data-btn="primary" data-func="add">
						<i class="fa fa-plus"></i> <?php echo $this->main->lang('Add new attribute'); ?>
					</button>
					<p>
						<?php echo $this->main->lang('Notice: The price of attribute is an addition price (excluding base price of product) for 1 item'); ?>. <a href="https://docs.lumise.com/printing-cost-calculator/?utm_source=clients&utm_medium=links&utm_campaign=client-site&utm_term=attributes&utm_content=<?php echo $this->main->connector->platform; ?>" target=_blank><?php echo $this->main->lang('Click for more details'); ?></a>
					</p>
				</header>
				<div class="lumise-field-attributes-body"><?php

					$attrs = $this->dejson($args['value']);

					if ($attrs !== null && count($attrs) > 0) {
						foreach ($attrs as $attr) {
							$this->render_field_attribute($attr);
						}
					}else if (!isset($_GET['id'])){
						$this->render_field_attribute(
							(Object)array(
								'title' => $this->main->lang('Attribute title'),
								'type' => 'text'
							)
						);
					}
				?></div>
				<div class="lumise-attribute-tmpl">
					<?php $this->render_field_attribute(
						(Object)array(
							'title' => 'Attribute title',
							'type' => 'select',
							'options' => array(
								array('name' => '', 'price' => '', 'min_quantity' => '', 'max_quantity' => '')
							)
						)
					); ?>
				</div>
				<textarea data-func="value" style="display: none;" name="<?php echo isset($args['name']) ? $args['name'] : ''; ?>"><?php echo isset($args['value']) ? $args['value'] : ''; ?></textarea>
			</div>
		</div>
	</div>
	<?php
	}

	public function render_field_attribute($attr = array()){
	?>
		<div class="lumise-attribute" data-type="<?php echo (isset($attr->type) && !empty($attr->type)) ? $attr->type : 'select'; ?>">
			<header>
				<i data-func="toggle" class="fa fa-caret-down" title="<?php echo $this->main->lang('Expand/Collapse'); ?>"></i>
				<span data-func="title"><?php echo isset($attr->title) ? $attr->title : ''; ?></span>
				<i data-func="trash" class="fa fa-trash" title="<?php echo $this->main->lang('Delete attribute'); ?>"></i>
			</header>
			<div class="lumise-attribute-body" style="display:none;">
				<div data-view="col">
					<strong> <?php echo $this->main->lang('Attribute Title'); ?> <em>*</em>:</strong>
					<input type="text" name="lumise-attr-title" value="<?php echo isset($attr->title) ? $attr->title : ''; ?>" />
				</div>
				<div data-view="col">
					<strong> <?php echo $this->main->lang('Attribute Type'); ?> <em>*</em>:</strong>
					<select name="lumise-attr-type">
						<option <?php
							echo isset($attr->type) && $attr->type == 'text' ? 'selected' : '';
						?> value="text"><?php echo $this->main->lang('Textarea'); ?></option>
						<option <?php
							echo isset($attr->type) && $attr->type == 'size' ? 'selected' : '';
						?> value="size"><?php echo $this->main->lang('Product Size'); ?></option>
						<option <?php
							echo isset($attr->type) && $attr->type == 'upload' ? 'selected' : '';
						?> value="upload"><?php echo $this->main->lang('Upload file'); ?></option>
						<option <?php
							echo isset($attr->type) && $attr->type == 'select' ? 'selected' : '';
						?> value="select"><?php echo $this->main->lang('Drop Down'); ?></option>
						<option <?php
							echo isset($attr->type) && $attr->type == 'radio' ? 'selected' : '';
						?> value="radio"><?php echo $this->main->lang('Radio checkbox'); ?></option>
						<option <?php
							echo isset($attr->type) && $attr->type == 'checkbox' ? 'selected' : '';
						?> value="checkbox"><?php echo $this->main->lang('Multiple checkbox'); ?></option>
						<option <?php
							echo isset($attr->type) && $attr->type == 'pack' ? 'selected' : '';
						?> value="pack"><?php echo $this->main->lang('Package (fixed quantity in each)'); ?></option>
					</select>
				</div>
				<div data-view="col" class="last">
					<strong> <?php echo $this->main->lang('Required'); ?>?</strong>
					<div class="toggle">
						<input type="checkbox" name="-attr-required" <?php echo isset($attr->required) && $attr->required == 1 ? 'checked="true"' : ''; ?> value="1">
						<span class="toggle-label" data-on="Yes" data-off="No"></span>
						<span class="toggle-handle"></span>
					</div>
				</div>
				<div class="lumise-attribute-options">
					<?php if (isset($attr->type) && $attr->type != 'text' && $attr->type != 'upload') { ?>
					<table>
						<thead>
							<th></th>
							<th><?php echo $this->main->lang('Title'); ?></th>
							<th class="less price"><?php echo $this->main->lang('Price'); ?></th>
							<th class="less pack"><?php echo $this->main->lang('Quantity'); ?></th>
							<th class="less qty"><?php echo $this->main->lang('Min Quantity'); ?></th>
							<th class="less qty"><?php echo $this->main->lang('Max Quantity'); ?></th>
							<th></th>
						</thead>
						<tbody>
							<?php if (isset($attr->options))foreach ($attr->options as $option){ ?>
							<tr>
								<td>
									<i data-func="drag" class="fa fa-arrows-v" title="<?php 
										echo $this->main->lang('Drag to arrange'); 
									?>"></i>
								</td>
								<td>
									<input type="text" value="<?php 
										echo isset($option->title) ? $option->title : '';
									?>" name="lumise-attr-title" />
								</td>
								<td class="less">
									<input type="text" value="<?php 
										echo isset($option->price) ? $option->price : ''; 
									?>" name="lumise-attr-price" />
								</td>
								<td class="less qty">
									<input type="text" value="<?php 
										echo isset($option->min_quantity) ? $option->min_quantity : '';
									?>" name="lumise-attr-min-quantity" />
								</td>
								<td class="less qty">
									<input type="text" value="<?php 
										echo isset($option->max_quantity) ? $option->max_quantity : ''; 
									?>" name="lumise-attr-max-quantity" />
								</td>
								<td>
									<i data-func="trash" class="fa fa-trash" title="<?php 
										echo $this->main->lang('Delete option'); 
									?>"></i>
								</td>
							</tr>
							<?php } ?>
						</tbody>
						<tfoot>
							<tr>
								<td colspan="6">
									<a href="#" data-func="add_opt">
										<i class="fa fa-plus"></i>
										<?php echo $this->main->lang('Add More Row'); ?>
									</a>
								</td>
							</tr>
						</tfoot>
					</table>
					<?php } ?>
				</div>
			</div>
		</div>
		<?php
	}
	
	public function field_template($args) {
		
		if (isset($args['value']) && !empty($args['value'])) {
			
			$db = $this->main->get_db();
			$db->where ('id', $args['value']);
			$template = $db->getOne ('templates');
			
		}
		
	?><div id="lumise_template"><?php
		if (isset($template['screenshot'])) {
			echo '<img src="'.$template['screenshot'].'" style="max-width: 250px;" /><br><a class="button" href="#delete"><i class="fa fa-times"></i></a>';
		}
	?></div>
		<button data-btn="" id="lumise_template_btn" style="margin-left: 0px;">
			<i class="fa fa-th"></i>
			<?php echo $this->main->lang('Select template'); ?>
		</button>
		<br />
		<input type="hidden" name="<?php echo isset($args['name']) ? $args['name'] : ''; ?>" id="lumise_template_inp" value="<?php 
			echo !empty($args['value']) ? $args['value'] : '';
		?>" />
		<?php if (!empty($args['value'])) { ?>
			<input type="hidden" name="old-<?php echo $args['name']; ?>" value="<?php echo $args['value'] ?>">
			<input type="hidden" name="old-<?php echo $attr['thumbn']; ?>" value="<?php
				echo isset($attr['thumbn_value']) ? $attr['thumbn_value'] : '';
			?>" />
		<?php } ?>
	<?php
	}
	
	public function order_statuses($current = '', $submit = false){
		
		global $lumise;
		
		$statuses = $lumise->connector->statuses();
		
		$current
	?>
	<select id="lumise_order_statuses" class="lumise_order_statuses" name="order_status">
        <?php
            foreach ($statuses as $key => $value) {
            ?>
            <option value="<?php echo $key;?>"<?php echo ($current == $key)? ' selected="selected"' : '';?>><?php echo $value;?></option>
            <?php
            }
        ?>
    </select>
	<?php
	if($submit):
	?>
	<input class="lumise_submit" type="submit" name="submit" value="<?php echo $this->main->lang('Change'); ?>">
	<?php
	endif;
	}

}
