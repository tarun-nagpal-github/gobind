<?php
	$cliparts = $templates = array();
	$data = $lumise->lib->stats();
	$orders = $lumise->connector->orders(array(), 'updated', 'DESC', 5, 0);
	$section = 'Dashbroad';
	$recent_res = $lumise->lib->recent_resources();
	$lumise->lib->display_check_system();
?>
<div class="lumise_wrapper lusime_dashbroad" id="lumise-<?php echo $section; ?>-page">
	<div class="lumise_container">
		<div class="lumise-col lumise-col-3">
			<div class="lusime_box_stats">
				<i class="fa fa-heart-o" style="background: #1e88e5"></i>
				<div class="box_right">
					<span><?php echo $data['cliparts'];?></span>
					<p><?php echo $lumise->lang('Cliparts'); ?></p>
				</div>
			</div>
		</div>
		<div class="lumise-col lumise-col-3">
			<div class="lusime_box_stats">
				<i class="fa fa-server" style="background: #81C784"></i>
				<div class="box_right">
					<span><?php echo $data['templates'];?></span>
					<p><?php echo $lumise->lang('Design Templates'); ?></p>
				</div>
			</div>
		</div>
		<div class="lumise-col lumise-col-3">
			<div class="lusime_box_stats">
				<i class="fa fa-shopping-basket" style="background: #7460ee"></i>
				<div class="box_right">
					<span><?php echo $orders['total_count'];?></span>
					<p><?php echo $lumise->lang('Orders'); ?></p>
				</div>
			</div>
		</div>
		<div class="lumise-col lumise-col-3">
			<div class="lusime_box_stats">
				<i class="fa fa-square" style="background: #fc4b6c"></i>
				<div class="box_right">
					<span><?php echo $data['shapes'];?></span>
					<p><?php echo $lumise->lang('Shapes'); ?></p>
				</div>
			</div>
		</div>
	</div>
	<div class="lumise_container">
		<div class="lumise-col lumise-col-6">
			<div class="lusime_box_dashbroad">
				<h3><?php echo $lumise->lang('Recent Orders'); ?></h3>
				<div class="box_content">
					<table class="lumise_table">
						<thead>
							<tr>
								<th><?php echo $lumise->lang('Orders ID'); ?></th>
								<th><?php echo $lumise->lang('Total'); ?></th>
								<th><?php echo $lumise->lang('Status'); ?></th>
								<th><?php echo $lumise->lang('Date'); ?></th>
								<th><?php echo $lumise->lang('View'); ?></th>
							</tr>
						</thead>
						<tbody>
							<?php
							if(count($orders['rows']) > 0){
								foreach ($orders['rows'] as $item) {
								?>
								<tr>
									<td><a href="<?php echo $lumise_router->getURI();?>lumise-page=order_products&order_id=<?php echo $item['id'];?>">#<?php echo $item['id'];?></a></td>
									<td><?php echo $lumise->lib->price($item['total']);?></td>
									<td><em class="pen"><?php echo $lumise->apply_filter('order_status', $item['status']);?></em></td>
									<td><?php echo date("F j, Y", strtotime($item['updated']));?></td>
									<td><a href="<?php echo $lumise_router->getURI();?>lumise-page=order_products&order_id=<?php echo $item['id'];?>">View</a></td>
								</tr>
								<?php
								}
							}else{
								?>
								<tr>
									<td colspan="5"><?php echo $lumise->lang('Apologies, but no results were found.');?></td>
								</tr>
								<?php
							}
							?>
							
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="lumise-col lumise-col-6">
			<div class="lusime_box_dashbroad lumise_blog">
				<h3><?php echo $lumise->lang('News Blog'); ?></h3>
				<div class="box_content" id="lumise-rss-display">
					<p><i><?php echo $lumise->lang('Loading latest blog'); ?>..</i></p>
					<script type="text/javascript">
						
					</script>
				</div>
			</div>
		</div>
	</div>
	<div class="lumise_container">
		<div class="lumise-col lumise-col-6">
			<div class="lusime_box_dashbroad list_thumb">
				<h3><?php echo $lumise->lang('Newest cliparts'); ?></h3>
				<div class="box_content">
					<?php
					
					$count = count($recent_res['cliparts']);
					
					if($count > 0){
						
						echo '<ul>';
						
						for ($i = 0; $i < $count; $i++) {
							$item = $recent_res['cliparts'][$i];
						?>
						<li>
							<div class="thumb_preview">
								<img src="<?php echo $item['thumbnail_url'];?>" alt="<?php echo $item['name'];?>">
								<div class="thumb_overlay">
									<h4><?php echo $item['name'];?></h4>
									<p><?php echo $lumise->lang('Category'); ?>: <?php echo implode(', ', $item['categories']);?></p>
								</div>
							</div>
						</li>
						<?php
						}
						echo '</ul>';
					}else{
						?>
						<p><?php echo $lumise->lang('Apologies, but no results were found.');?></p>
						<?php
					}
					?>
				</div>
			</div>
		</div>
		<div class="lumise-col lumise-col-6">
			<div class="lusime_box_dashbroad list_thumb">
				<h3><?php echo $lumise->lang('Newest design template'); ?></h3>
				<div class="box_content">
					<ul>
					<?php
					$count = count($recent_res['templates']);
					
					if($count > 0){
						
						echo '<ul>';
						
						for ($i = 0; $i < $count; $i++) {
							$item = $recent_res['templates'][$i];
						?>
						<li>
							<div class="thumb_preview">
								<img src="<?php echo $item['thumbnail_url'];?>" alt="<?php echo $item['name'];?>">
								<div class="thumb_overlay">
									<h4><?php echo $item['name'];?></h4>
									<p><?php echo $lumise->lang('Category'); ?>: <?php echo implode(', ', $item['categories']);?></p>
								</div>
							</div>
						</li>
						<?php
						}
						echo '</ul>';
					}else{
						?>
						<p><?php echo $lumise->lang('Apologies, but no results were found.');?></p>
						<?php
					}
					?>
				</div>
			</div>
		</div>
	</div>
</div>
