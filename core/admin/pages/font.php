<?php

	$section = 'font';
	$fields = $lumise_admin->process_data(array(
		array(
			'type' => 'input',
			'name' => 'name',
			'label' => $lumise->lang('Name'),
			'required' => true
		),
		array(
			'type' => 'upload',
			'name' => 'upload',
			'required' => true,
			'path' => 'fonts'.DS,
			'file' => 'font',
			'label' => $lumise->lang('Upload Font'),
			'desc' => $lumise->lang('Upload your font file with format *.woff or *.woff2 only'). '<br>'.
					  $lumise->lang('You can convert your *.ttf or *.otf by converter online tool').
					  ' <a href="https://font-converter.net/en" target="_blank"><strong>Font-Converter.net</strong></a>'
		),
		array(
			'type' => 'toggle',
			'name' => 'active',
			'label' => $lumise->lang('Active'),
			'default' => 'yes',
			'value' => null
		),
	), 'fonts');

?>

<div class="lumise_wrapper" id="lumise-<?php echo $section; ?>-page">
	<div class="lumise_content">
		<?php
			$lumise->views->detail_header(array(
				'add' => $lumise->lang('Add New Font'),
				'edit' => $lumise->lang('Edit Font'),
				'page' => $section
			));
		?>
		<form action="<?php echo $lumise_router->getURI(); ?>lumise-page=<?php
			echo $section.(isset($_GET['callback']) ? '&callback='.$_GET['callback'] : '');
		?>" id="lumise-clipart-form" method="post" class="lumise_form" enctype="multipart/form-data">

			<?php $lumise->views->tabs_render($fields); ?>

			<div class="lumise_form_group lumise_form_submit">
				<input type="submit" value="<?php echo $lumise->lang('Save Font'); ?>"/>
				<input type="hidden" name="do" value="action" />
				<a class="lumise_cancel" href="<?php echo $lumise_router->getURI();?>lumise-page=<?php echo $section; ?>s">
					<?php echo $lumise->lang('Cancel'); ?>
				</a>
				<input type="hidden" name="lumise-section" value="<?php echo $section; ?>">
			</div>
		</form>
	</div>
</div>
