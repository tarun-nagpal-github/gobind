<?php
	
	if (isset($_POST['upload'])) {
		print_r($_POST['upload']);
		exit;
	}
	global $lumise;
	
	$arg = array(

		'tabs' => array(

			'details:' . $lumise->lang('Details') => array(
				array(
					'type' => 'input',
					'name' => 'name',
					'label' => $lumise->lang('Name'),
					'required' => true,
					'default' => 'Untitled'
				),
				(
					$lumise->connector->platform == 'php'? 
					array(
						'type' => 'input',
						'name' => 'price',
						'label' => $lumise->lang('Price'),
						'default' => '0',
						'desc' => $lumise->lang('Enter the base price for this product.')
					) : null
				),
				(
					$lumise->connector->platform == 'php' ?
					array(	
						'type' => 'upload',
						'name' => 'thumbnail',
						'thumbn' => 'thumbnail_url',
						'path' => 'thumbnails'.DS,
						'label' => $lumise->lang('Product thumbnail'),
						'desc' => $lumise->lang('Supported files svg, png, jpg, jpeg. Max size 5MB')
					)
					:
					array(
						'type' => 'input',
						'name' => 'product',
						'label' => $lumise->lang('CMS Product'),
						'default' => '0',
						'desc' => $lumise->lang('Enter the CMS\'s product ID to checkout after designing, it can be set automatically when you create CMS Product'),
						'readonly' => true
					)
				)
				,
				array(
					'type' => 'text',
					'name' => 'description',
					'label' => $lumise->lang('Description')
				),
				array(
					'type' => 'categories',
					'cate_type' => 'products',
					'name' => 'categories',
					'label' => $lumise->lang('Categories'),
					'id' => isset($_GET['id'])? $_GET['id'] : 0
				),
				array(
					'type' => 'printing',
					'name' => 'printings',
					'label' => $lumise->lang('Printing Techniques'),
					'desc' => $lumise->lang('Select Printing Techniques with price calculations for this product').'<br>'.$lumise->lang('Drag to arrange items, the first one will be set as default').'. <br><a href="'.$lumise_router->getURI().'lumise-page=printings" target=_blank>'.$lumise->lang('You can manage all Printings here').'.</a>'
				),
				array(
					'type' => 'dropbox',
					'name' => 'orientation',
					'label' => $lumise->lang('Print Orientation'),
					'desc' => $lumise->lang('The orientation of the paper base on Size Print you selected above').'</a>',
					'options' => array(
						'0' => $lumise->lang('Portrait'),
						'1' => $lumise->lang('Landscape')
					)
				),
				array(
					'type' => 'input',
					'name' => 'min_qty',
					'type_input' => 'number',
					'label' => $lumise->lang('Min quantity'),
					'default' => 0,
					'desc' => $lumise->lang('Min total quantity add to cart (0 is not set)')
				),
				array(
					'type' => 'input',
					'name' => 'max_qty',
					'type_input' => 'number',
					'label' => $lumise->lang('Max quantiy'),
					'default' => 0,
					'desc' => $lumise->lang('Max total quantity add to cart (0 is not set)')
				),
				array(
					'type' => 'toggle',
					'name' => 'active',
					'label' => $lumise->lang('Active'),
					'default' => 'yes',
					'value' => null,
					'desc' => $lumise->lang('Deactivate does not affect the selected products. It will only not show in the switching products.')
				),
				array(
					'type' => 'input',
					'name' => 'order',
					'type_input' => 'number',
					'label' => $lumise->lang('Order'),
					'default' => 0,
					'desc' => $lumise->lang('Ordering of item with other.')
				),
			),

			'design:' . $lumise->lang('Design') => array(
				array(
					'type' => 'radios',
					'name' => 'change_color',
					'label' => $lumise->lang('Allows change color'),
					'default' => 'custom',
					'desc' => $lumise->lang('Allows users can change to other color in editor tool'),
					'options' => array(
						'none' => $lumise->lang('No display product colors'),
						'standard' => $lumise->lang('Only choose from your set colors'),
						'custom' => $lumise->lang('Choose from your set colors and color picker')
					)
				),
				array(
					'type' => 'color',
					'name' => 'color',
					'label' => $lumise->lang('Set product colors'),
					'default' => '#3fc7ba:#546e7a,#757575,#6d4c41,#f4511e,#fb8c00,#ffb300,#fdd835,#c0cA33,#a0ce4e,#7cb342,#43a047,#00897b,#00acc1,#3fc7ba,#039be5,#3949ab,#5e35b1,#8e24aa,#d81b60,#eeeeee,#3a3a3a',
				),
				array(
					'type' => 'stages',
					'name' => 'stages',
					'label' => $lumise->lang('Config stages')
				)
			),

			'attributes:' . $lumise->lang('Attributes') => array(
				array(
					'type' => 'attributes',
					'name' => 'attributes'
				),
			)
		)
	);
	
	$arg = $lumise->apply_filter('product_tabs', $arg);
	
	$fields = $lumise_admin->process_data($arg, 'products');

?>

<div class="lumise_wrapper" id="lumise-product-page">
	<div class="lumise_content">
		<?php

			$lumise->views->detail_header(array(
				'add' => $lumise->lang('Add New Product'),
				'edit' => $lumise->lang('Edit Product'),
				'page' => 'product'
			));

		?>
		<form action="<?php
			echo $lumise_router->getURI();
		?>lumise-page=product<?php
			if (isset($_GET['callback']))
				echo '&callback='.$_GET['callback'];
		?>" id="lumise-product-form" method="POST" class="lumise_form" enctype="multipart/form-data">

			<?php $lumise->views->tabs_render($fields, 'products'); ?>

			<div class="lumise_form_group" style="margin-top: 20px">
				<input type="submit" value="<?php echo $lumise->lang('Save Product'); ?>"/>
				<input type="hidden" name="do" value="action" />
				<input type="hidden" name="lumise-section" value="product">
			</div>
		</form>
	</div>
</div>

<script type="text/javascript">
	document.lumiseconfig = {
		main: 'product',
		ce: '<?php echo $lumise->lang('The color has exist, please select another'); ?>',
		hs: '<?php echo $lumise->lang('No stages configured, please select image with Edit Area for a minimum of one stage in tab Product Design'); ?>',
		sm: '<?php echo $lumise->lang('The size of image is too small (50KB - 5000KB)'); ?>',
		lg: '<?php echo $lumise->lang('The size of image is too large (50KB - 5000KB)'); ?>',
		tp: '<?php echo $lumise->lang('Only accept image type *.jpg, *.png or *.svg'); ?>',
		ru: '<?php echo $lumise->lang('Your upload is '); ?>',
		bases: <?php echo json_encode($lumise->cfg->base_default); ?>
	};
</script>
