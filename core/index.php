<?php
	
	global $lumise;
	
	require_once('includes/main.php');

	if($lumise->is_app()) :
	
?><!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title><?php echo $lumise->lang($lumise->cfg->settings['title']); ?></title>
		<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no" name="viewport" />
		<link rel="stylesheet" href="<?php echo $lumise->cfg->assets_url; ?>assets/css/app.css?version=<?php echo LUMISE; ?>">
		<link rel="stylesheet" media="only screen and (max-width: 1024px)" href="<?php echo $lumise->cfg->assets_url; ?>assets/css/responsive.css?version=<?php echo LUMISE; ?>">
		<link rel="stylesheet" href="<?php echo $lumise->cfg->assets_url; ?>assets/css/colors.css?primary=<?php 
			echo $lumise->cfg->color; 
		?>&version=<?php echo $lumise->cfg->settings['last_update']; ?>">
		<?php if(isset($lumise->cfg->settings['custom_css']) && $lumise->cfg->settings['custom_css'] !=''):?>
		<link rel="stylesheet" href="<?php echo $lumise->cfg->assets_url; ?>assets/css/custom.css?version=<?php echo $lumise->cfg->settings['last_update']; ?>">
		<?php endif;?>
		<?php $lumise->do_action('editor-header'); ?> 
	</head>
<body>
	<div class="wrapper">
		<div id="LumiseDesign" data-site="https://lumise.com" data-processing="true" data-msg="<?php echo $lumise->lang('Initializing'); ?>..">
			<div id="lumise-navigations" data-navigation="">
				<?php $lumise->display('nav'); ?>
			</div>
			<div id="lumise-workspace">

				<?php $lumise->display('left'); ?>
				<div id="lumise-top-tools" data-navigation="" data-view="standard">
					<?php $lumise->display('tool'); ?>
				</div>

				<div id="lumise-main">
					<div id="lumise-no-product">
						<?php
							if (!isset($_GET['product'])) {
								echo '<p>'.$lumise->lang('Please select a product to start designing').'</p>';
							}else if (isset($_GET['product']) && $lumise->cfg->product === null) {
								echo '<p>'.$lumise->lang('Sorry, the product you selected is not available!').'</p>';
							}
						?>
						<button class="lumise-btn" id="lumise-select-product">
							<i class="lumisex-android-apps"></i> <?php echo $lumise->lang('Select product'); ?>
						</button>
					</div>
				</div>
				<div id="lumise-count-colors" title="<?php echo $lumise->lang('Count colors'); ?>"></div>
				<div id="lumise-zoom-wrp">
					<span><?php echo $lumise->lang('Zoom'); ?></span>
					<inp data-range="helper" data-value="100%">
						<input type="range" id="lumise-zoom" data-value="100%" min="100" max="250" value="100" />
					</inp>
				</div>
				<div id="lumise-zoom-thumbn">
					<span></span>
				</div>
				<div id="lumise-stage-nav">
					<ul></ul>
				</div>
				<div id="lumise-notices"></div>
			</div>
		</div>
	</div>
	<script>
		function LumiseDesign (lumise) {
			lumise.data = {
				stages : {},
				currency : "<?php echo $lumise->cfg->settings['currency']; ?>",
				switch_lang : <?php echo $lumise->cfg->settings['allow_select_lang']; ?>,
				thousand_separator : "<?php echo isset($lumise->cfg->settings['thousand_separator'])? $lumise->cfg->settings['thousand_separator'] : ','; ?>",
				decimal_separator : "<?php echo isset($lumise->cfg->settings['decimal_separator'])? $lumise->cfg->settings['decimal_separator'] : '.'; ?>",
				number_decimals : "<?php echo isset($lumise->cfg->settings['number_decimals'])? $lumise->cfg->settings['number_decimals'] : 2; ?>",
				currency_position : "<?php echo $lumise->cfg->settings['currency_position']; ?>",
				min_upload: <?php echo isset($lumise->cfg->settings['min_upload'])? (int)$lumise->cfg->settings['min_upload'] : 0; ?>,
				max_upload: <?php echo isset($lumise->cfg->settings['max_upload'])? (int)$lumise->cfg->settings['max_upload'] : 0; ?>,
				min_dimensions: <?php echo isset($lumise->cfg->settings['min_dimensions']) ? json_encode(explode('x', $lumise->cfg->settings['min_dimensions'])) : ''; ?>,
				max_dimensions: <?php echo isset($lumise->cfg->settings['max_dimensions']) ? json_encode(explode('x', $lumise->cfg->settings['max_dimensions'])) : ''; ?>,
                printings : [],
				url : "<?php echo $lumise->cfg->url; ?>",
				tool_url : "<?php echo $lumise->cfg->tool_url; ?>",
				upload_url : "<?php echo $lumise->cfg->upload_url; ?>",
				checkout_url : "<?php echo $lumise->cfg->checkout_url; ?>",
				ajax : "<?php echo $lumise->cfg->ajax_url; ?>",
				assets : "<?php echo $lumise->cfg->assets_url; ?>",
				jquery : "<?php echo $lumise->cfg->load_jquery; ?>",
				nonce : "<?php echo lumise_secure::create_nonce('LUMISE-SECURITY') ?>",
				editing: localStorage.getItem('LUMISE-EDITING'),
				design : "<?php echo $lumise->esc('design_print'); ?>",
				product : "<?php echo $lumise->esc('product'); ?>",
				default_fonts: <?php echo stripslashes($lumise->cfg->default_fonts); ?>,
				fonts: <?php echo json_encode($lumise->get_fonts()); ?>,
				js_lang : <?php echo json_encode($lumise->cfg->js_lang); ?>,
				clear_cart : <?php echo $lumise->lib->clear_cart(); ?>,
				rtl : '<?php echo $lumise->cfg->settings['rtl']; ?>',
				prefix_file : '<?php echo urlencode($lumise->cfg->settings['prefix_file']); ?>',
				text_direction : '<?php echo $lumise->cfg->settings['text_direction']; ?>',
				print_types : <?php 
					echo json_encode($lumise->lib->get_print_types());
					echo $lumise->lib->product_cfg();
				?>
			};
			
			var real_uri = window.location.href.split('?'),
				reg_uri = lumise.data.tool_url.split('?');
			
			if (real_uri[0] != reg_uri[0]) {
				if (real_uri[1] !== undefined)
					window.location = reg_uri[0]+'?'+real_uri[1];
				else window.location = reg_uri[0];
				return false;
			} else return true;
			
		};
	</script>
	<?php if ($lumise->cfg->load_jquery){ ?>
	<script src="<?php echo $lumise->cfg->assets_url; ?>assets/js/jquery.min.js?version=<?php echo LUMISE; ?>"></script>
	<?php } ?>
	<script src="<?php echo $lumise->cfg->assets_url; ?>assets/js/vendors.js?version=<?php echo LUMISE; ?>"></script>
	<script src="<?php echo $lumise->cfg->assets_url; ?>assets/js/app.js?version=<?php echo LUMISE; ?>"></script>
</body>
</html>
<?php endif;
