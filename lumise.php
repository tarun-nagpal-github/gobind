<?php
/*
Plugin Name: Lumise - Product Designer Tool
Plugin URI: https://www.lumise.com/
Description: The professional solution for designing & printing online
Author: King-Theme
Version: 1.6.1
Author URI: http://king-theme.com/
*/

if(!defined('DS')) {
	define('DS', DIRECTORY_SEPARATOR );
}
if(!defined('LUMISE_WOO')) {
	define('LUMISE_WOO', '1.6.1' );
}
if ( ! defined( 'LUMISE_FILE' ) ) {
	define('LUMISE_FILE', __FILE__ );
	define('LUMISE_PLUGIN_BASENAME', plugin_basename(LUMISE_FILE));
}	

class lumise_woocommerce {
	    
    public $url;
    
    public $admin_url;
    
    public $path;
    
    public $app_path;
    
    public $upload_url;
    
    public $upload_path;
    
    public $assets_url;
	
    public $checkout_url;
    
    public $admin_assets_url;
    
    public $ajax_url;
    
    public $product_id;

    public $prefix;
	
	private $connector_file = 'woo_connector.php';


    public function __construct() {
        
        global $wpdb;
		
		if (!session_id()) session_start();
        
        $this->prefix = 'lumise_';
        $this->url = plugin_dir_url(__FILE__).'editor.php';
		
        $this->tool_url = site_url('/?lumise=design');
        $this->admin_url = admin_url('admin.php?page=lumise');
        
        $this->path = dirname(__FILE__).DS;
        
        $this->app_path = $this->path . 'core'.DS;
        
        $this->upload_path = WP_CONTENT_DIR.DS.'uploads'.DS.'lumise_data'.DS;
        
        $this->upload_url = content_url('uploads/lumise_data/');
        
        $this->assets_url = plugin_dir_url(__FILE__) . 'core/';
        
        $this->admin_assets_url = plugin_dir_url(__FILE__) . 'core/admin/assets/';
        
        $this->ajax_url =  site_url('/?lumise=ajax');
		
        $this->checkout_url =  site_url('/?lumise=cart');

        define('LUMISE_PATH', $this->path . 'core'.DS);
        
        define('LUMISE_ADMIN_PATH', $this->path . 'core'.DS.'admin'.DS);

        register_activation_hook(__FILE__, array($this, 'activation'), 10);
		
		add_action( 'woocommerce_single_product_summary', array($this, 'remove_actions') ,1);

        //process ajax lumise
		
        add_action( 'wp_loaded', array($this, 'init'), 10);
        add_action( 'admin_init', array($this, 'init'), 10);
        add_action( 'init', array($this, 'page_display'), 10);
		
		if (is_admin()){

	        // create tab custom field in add min product detail
	
	        add_filter('woocommerce_product_data_tabs', array($this, 'woo_add_tab_attr'));
	
	        add_filter('woocommerce_product_data_panels', array($this, 'woo_add_product_data_fields'));
	
	        add_action('woocommerce_process_product_meta', array($this, 'woo_process_product_meta_fields_save'));
			
			//admin hooks

	        add_action( 'admin_menu', array($this, 'menu_page') );
	         
	        add_action( 'admin_enqueue_scripts', array($this, 'add_admin_scripts'), 100, 1 );
			 
	        //add_action( 'woocommerce_before_order_itemmeta', array($this, 'woo_admin_before_order_itemmeta'), 999, 3 );
			 
			if (isset($_GET['page']) && $_GET['page'] == 'lumise'){
				add_action( 'wp_print_scripts', array($this, 'wpdocs_dequeue_script'), 100 );
			}
				
	        
			add_action( 'admin_head', array( &$this, 'hide_wp_update_notice'), 1 );
			add_action( 'in_plugin_update_message-' .LUMISE_PLUGIN_BASENAME, array( &$this, 'update_message' ) );
	        add_filter( 'plugin_action_links_' . LUMISE_PLUGIN_BASENAME, array( &$this, 'plugin_action_links' ) );
	        add_filter( 'plugin_row_meta', array($this, 'plugin_row_meta' ), 10, 2 );
	        
	        $this->update_core = $wpdb->get_results("SELECT `value` from `lumise_settings` WHERE `key`='last_check_update'", true); 

			$this->update_core = @json_decode($this->update_core[0]->value);
			
			$current = get_site_transient( 'update_plugins' );
			
			if (
				isset($this->update_core) && 
				$this->update_core->version > LUMISE_WOO && 
				(
					!isset($current->response[LUMISE_PLUGIN_BASENAME]) ||
					$this->update_core->version > $current->response[LUMISE_PLUGIN_BASENAME]->new_version
				)
			) {
				$current->response[LUMISE_PLUGIN_BASENAME] = (Object)array(
					'package' => 'private',
					'new_version' => $this->update_core->version,
					'slug' => 'lumise-hook-sfm'
				);
				set_site_transient('update_plugins', $current);
			}else if (
				isset($current) && 
				isset($current->response[LUMISE_PLUGIN_BASENAME]) &&
				LUMISE_WOO >= $current->response[LUMISE_PLUGIN_BASENAME]->new_version
			) {
				unset($current->response[LUMISE_PLUGIN_BASENAME]);
				set_site_transient('update_plugins', $current);
			}
			
			$role = get_role('administrator');
			
			$role->add_cap('lumise_access');
			$role->add_cap('lumise_can_upload');
			
			$role->add_cap('lumise_read_dashboard');
			$role->add_cap('lumise_read_settings');
			$role->add_cap('lumise_read_products');
			$role->add_cap('lumise_read_cliparts');
			$role->add_cap('lumise_read_templates');
			$role->add_cap('lumise_read_orders');
			$role->add_cap('lumise_read_shapes');
			$role->add_cap('lumise_read_printings');
			$role->add_cap('lumise_read_fonts');
			$role->add_cap('lumise_read_shares');
			$role->add_cap('lumise_read_languages');
			
			$role->add_cap('lumise_edit_settings');
			$role->add_cap('lumise_edit_products');
			$role->add_cap('lumise_edit_cliparts');
			$role->add_cap('lumise_edit_templates');
			$role->add_cap('lumise_edit_orders');
			$role->add_cap('lumise_edit_shapes');
			$role->add_cap('lumise_edit_printings');
			$role->add_cap('lumise_edit_fonts');
			$role->add_cap('lumise_edit_shares');
			$role->add_cap('lumise_edit_languages');
			$role->add_cap('lumise_edit_categories');
			$role->add_cap('lumise_edit_tags');
			
	         
		}
		
		//enqueue style for frontend
		add_action( 'wp_enqueue_scripts', array($this, 'frontend_scripts'), 999);
		
        // render data in page cart

        add_filter('woocommerce_get_item_data', array($this, 'woo_render_meta'), 999, 2);
        
		
		add_filter('woocommerce_cart_item_name', array($this, 'woo_cart_edit_design_btn'), 10, 2);
		add_filter('woocommerce_cart_item_thumbnail', array($this, 'woo_cart_design_thumbnails'), 10, 2);
		
		// add meta data attr cart to order
        add_action('woocommerce_add_order_item_meta', array($this, 'woo_add_order_item_meta'), 1, 3);
		
		//remove cart item
		add_action('woocommerce_cart_item_removed', array($this, 'woo_cart_item_removed'), 1, 2);
		
        

        // save data to table product order
        add_action('woocommerce_new_order', array($this, 'woo_order_finish'), 20, 3);

		add_filter('woocommerce_loop_add_to_cart_link', array($this, 'woo_customize_link_list'), 999, 2);
		
        add_action( 'woocommerce_product_thumbnails', array( $this, 'woo_add_template_thumbs' ), 30);
		
		// Add custom price for items
        add_action('woocommerce_before_calculate_totals', array($this, 'woo_calculate_price'), 10, 1);
		/*cart display*/
        add_action( 'woocommerce_cart_item_quantity', array( $this, 'woo_cart_item_quantity' ), 30, 3);
        add_action( 'woocommerce_checkout_cart_item_quantity', array( $this, 'woo_checkout_cart_item_quantity' ), 30, 3);
        add_action( 'woocommerce_order_item_quantity_html', array( $this, 'woo_order_item_quantity_html' ), 30, 3);
        add_action( 'woocommerce_order_item_meta_start', array( $this, 'woo_order_item_meta_start' ), 30, 3);
		
        add_filter( 'woocommerce_get_price_html', array( $this, 'woo_product_get_price_html' ), 999, 2);
		
		add_action( 'woocommerce_email_order_details', array( $this, 'customer_designs' ), 10, 1 );
		
		//hook delete order
		
        add_filter( 'before_delete_post', array( $this, 'woo_remove_order' ), 999, 2);
		
		add_filter( 'display_post_states', array( $this, 'add_display_post_states' ), 10, 2 );
				
		
    }

    public function activation() {
	    
        global $wpdb;
		
		$imported = get_option('lumise_imported', false);
		
		/* Now, we will import sliders demo */
		if ($imported != 'activated')
		{
			$templine = '';
			$sql_file = $this->path .'woo/sample'. DS . 'database.txt';
			
			$handle = fopen( $sql_file, 'r' );
			$lines = fread( $handle, filesize($sql_file) );

			$lines = explode("\n", $lines);
			
			foreach ($lines as $line)
			{
				if (substr($line, 0, 2) == '--' || $line == '')
				    continue;

				$templine .= $line;
				if (substr(trim($line), -1, 1) == ';')
				{
					ob_start();
						$sql = $templine;//str_replace( array('lumise_'), array($wpdb->prefix), $templine );
					    $wpdb->query( $sql, false );
						
					    $templine = '';
					ob_end_clean();
				}
			}
			fclose($handle);
			
			update_option('lumise_imported', 'activated');
		}
		
		//if uploads folder does not exists, create it
		$upload_path = WP_CONTENT_DIR.DS.'uploads'.DS;
		if(!is_dir($upload_path)){
			wp_mkdir_p($upload_path);
		}
		//create lumise_data folder if does not exists
		if(!is_dir($this->upload_path)){
			wp_mkdir_p($this->upload_path);
		}
		
		//create page after activatved
		if ( ! current_user_can( 'activate_plugins' ) ) return;
		
		if ( null === $wpdb->get_row( "SELECT post_name FROM {$wpdb->prefix}posts WHERE post_name = 'design-editor'", 'ARRAY_A' ) ) {

			$current_user = wp_get_current_user();
			// create post object
			$page = array(
				'post_title'  => __( 'Design Editor' ),
				'post_status' => 'publish',
				'post_author' => $current_user->ID,
				'post_type'   => 'page',
				'post_content'   => __('This is Lumise design page. Go to Lumise > Settings > Shop to change other page when you need.')
			);

			// insert the post into the database
			$page_id = wp_insert_post( $page );
			update_option('lumise_editor_page', $page_id);
		}
    }    
    
    public function render() {
	    
		show_admin_bar(false);
        //require bridge for frontend
        require_once($this->path . $this->connector_file);
        
        //require cutomize index
        require_once($this->path . 'core'.DS . 'index.php');
        
    }
	
	public function woo_remove_order($order_id){
		
		global $post_type, $lumise;

	    if($post_type !== 'shop_order') {
	        return;
	    }
		$this->load_core();
		$lumise->lib->delete_order_products($order_id);
	}
	
	function page_display(){
		
		if (is_admin())
			return;
		
		$editor = get_option('lumise_editor_page', 0);
		$url = (is_ssl() ? 'https://' : 'http://') . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
		$id = url_to_postid($url);
		
		if ($editor > 0){
				
			if (
				(
					isset($_GET['page_id']) &&
					!empty($_GET['page_id']) &&
					$editor == $_GET['page_id']
				) ||
				(
					isset($_GET['product']) &&
					!empty($_GET['product_cms'])
				) ||
				(
					isset($_GET['product']) &&
					!empty($_GET['order_print'])
				) ||
				$editor == $id
			){
				
				$url = esc_url(get_page_link($editor));
			
				$this->tool_url = (strpos($url, '?') === false) ? $url . '?' : $url;
				$this->render();
				
				exit;
				
			}
		}
	}
	
    public function init() {
	    
		global $post, $lumise;
		
		$editor_page = get_option('lumise_editor_page', 0);
		
		if($editor_page > 0){
			$url = esc_url(get_page_link($editor_page));
			$this->tool_url = (strpos($url, '?') === false)? $url . '?': $url;
		}
		
        if (isset($_GET['lumise']) && !empty($_GET['lumise'])){
			switch ($_GET['lumise']) {
				case 'design':
					show_admin_bar(false);
					remove_action( 'shutdown', 'wp_ob_end_flush_all', 1 );
					$this->render();
					break;
					
				case 'ajax':
				case 'cart':
					remove_action( 'shutdown', 'wp_ob_end_flush_all', 1 );
					$_GET['lumise-router'] = $_GET['lumise'];
					$this->load_core();
					break;	
				default:

					break;
			}
			exit;
		}
        
    }

	public function woo_admin_before_order_itemmeta($item_id, $item, $product){
		
		global $lumise;
		
		$item_data = $item->get_data();
		
		$lumise_data = array();
		
		if (count($item_data['meta_data']) > 0) {
			
			foreach ($item_data['meta_data'] as $meta_data) {
				if ($meta_data->key == 'lumise_data') {
					$lumise_data = $lumise->lib->get_cart_data( $meta_data->value );
					
					break;
				}
			}
			
			if ( count($lumise_data) > 0) {
				print_r($lumise_data);
				//store data
				$colors = explode(':', $lumise_data['color']);
				
				$html ='<dl class="lumise-variations">';
				$html .= '<dt class="lumise-variation">'. $lumise->lang('Color') .':</dt>';
				$html .= '<dd class="lumise-variation">'. $lumise_data['color'] . (($lumise_data['color_name'] != $lumise_data['color'])? ' - ' . $lumise_data['color_name'] : '') .'</dd>';
					
				foreach ($lumise_data['attributes'] as $name => $options) {
					$html .= '<dt class="lumise-variation">'.$name.':</dt>';
					foreach ($options as $option)
						$html .= '<dd class="lumise-variation">'.$option.'</dd>';
				}
				$html .='</dl><div class="lumise-order-design-thumbnails">';
				foreach ($lumise_data['screenshots'] as $stage => $screenshot) {
					$html .= '<img class="lumise-order-design-thumbnail" src="'.$screenshot.'" />';
				}
				$html .='</div>';
				echo $html;
			}
		}
	}
    
    public function menu_page() {
        
        global $wpdb;
        
        $title = 'Lumise';
        
        if (isset($this->update_core) && $this->update_core->version > LUMISE_WOO)
        	$title .= ' <span class="update-plugins"><span class="plugin-count">1</span></span>';
        
        $title .= '<style type="text/css">#toplevel_page_lumise img{height: 20px;box-sizing: content-box;margin-top: -3px;}</style>';
        
        add_menu_page( 
            	__( 'Lumise', 'lumise' ),
                $title,
                'lumise_access',
                'lumise',
                array($this, 'admin_page'),
                $this->assets_url . 'assets/images/icon.png',
            90
        );
        
    }
	
    public function admin_page() {
		
		if (!defined('LUMISE_ADMIN'))
			define('LUMISE_ADMIN', true);
			
        $this->load_core();
        require_once($this->path . 'core'.DS . 'admin' .DS .'index.php');
        
    }
	
	public function add_admin_scripts($hook) {
		
		global $post, $wpdb, $lumise;
		
		wp_enqueue_style('lumise-backend', plugin_dir_url(__FILE__).'woo/assets/css/backend.css');
		if ( $hook == 'post-new.php' || $hook == 'post.php' ) {
			if ( 'product' === $post->post_type ) {     
				$this->load_core();
				wp_enqueue_script('lumise-backend', plugin_dir_url(__FILE__).'woo/assets/js/backend.js');
				$id = get_the_ID();
				//data for js
				$lumise_data = array(
					'nonce_backend' => lumise_secure::create_nonce('LUMISE-SECURITY-BACKEND'),
					'ajax_url' => $this->ajax_url,
					'admin_url' => $this->admin_url,
					'assets_url' => $this->assets_url,
					'upload_url' => $this->upload_url,
					'current_product' => get_the_ID(),
					'_i42' => esc_html(__('No items found', 'lumise')),
		        	'_i62' => esc_html(__('Products', 'lumise')),
		        	'_i64' => esc_html(__('Select product', 'lumise')),
		        	'_i63' => esc_html(__('Search product', 'lumise')),
		        	'_i56' => esc_html(__('Categories', 'lumise')),
		        	'_i57' => esc_html(__('All categories', 'lumise')),
		        	'_i58' => esc_html(__('Select template', 'lumise')),
		        	'_i59' => esc_html(__('Create new', 'lumise')),
		        	'_i60' => esc_html(__('Stages', 'lumise')),
		        	'_i61' => esc_html(__('Edit Product Base', 'lumise')),
					'_i65' => esc_html(__('Start Over', 'lumise')),
		        	'_i66' => esc_html(__('Design templates', 'lumise')),
		        	'_i67' => esc_html(__('Search design templates', 'lumise')),
		        	'_i68' => esc_html(__('Load more', 'lumise')),
		        	'_i69' => esc_html(__('Clear design template', 'lumise')),
		        	'_i70' => esc_html(__('Clear', 'lumise')),
		        	'_i71' => esc_html(__('You need to choose a product base to enable Lumise Editor for this product.', 'lumise')),
		        	'_i72' => esc_html(__('Download', 'lumise')),
		        	'_i73' => esc_html(__('Download design template', 'lumise')),
		        	'_front' => $lumise->lang($lumise->cfg->settings['label_stage_1']),
		        	'_back' => $lumise->lang($lumise->cfg->settings['label_stage_2']),
		        	'_left' => $lumise->lang($lumise->cfg->settings['label_stage_3']),
		        	'_right' => $lumise->lang($lumise->cfg->settings['label_stage_4']),
				);
				
				$product = get_post_meta($id, 'lumise_product_base', true);
	        	if (!empty($product)) {
		        	$data = $wpdb->get_results("SELECT `name`,`color`,`stages` FROM `{$lumise->db->prefix}products` WHERE `id`={$product}");
		        	if (isset($data[0]) && isset($data[0]->stages)) {
			        	$lumise_data['current_data'] = array(
							'id' => $product,
							'name' => $data[0]->name,
							'color' => $data[0]->color,
							'stages' => $data[0]->stages,
						);
						$stage = $lumise->lib->dejson($data[0]->stages);
						if (isset($stage) && isset($stage->front) && isset($stage->front->label) && !empty($stage->front->label))
							$lumise_data['_front'] = rawurldecode($stage->front->label);
						if (isset($stage) && isset($stage->back) && isset($stage->back->label) && !empty($stage->back->label))
							$lumise_data['_back'] = rawurldecode($stage->back->label);
						if (isset($stage) && isset($stage->left) && isset($stage->left->label) && !empty($stage->left->label))
							$lumise_data['_left'] = rawurldecode($stage->left->label);
						if (isset($stage) && isset($stage->right) && isset($stage->right->label) && !empty($stage->right->label))
							$lumise_data['_right'] = rawurldecode($stage->right->label);
		        	}
	        	}
				
				$designs = get_post_meta($id, 'lumise_design_template', true);
				
	        	if (!empty($designs)) {
		        	
		        	$designs = json_decode(rawurldecode($designs));
		        	
		        	foreach($designs as $s => $d) {
			        	
			        	$data = $wpdb->get_results("SELECT `name`,`screenshot` FROM `{$lumise->db->prefix}templates` WHERE `id`=".$d->id);
			        	if (isset($data[0]))
				        	$designs->{$s}->screenshot = $data[0]->screenshot;
				        else unset($designs->{$s});
				        
		        	}
		        	
		        	$lumise_data['current_design'] = $designs;
		        	
	        	}
				
				wp_localize_script( 'lumise-backend', 'lumisejs', $lumise_data);
			}
		}
	}

    function woo_add_tab_attr( $product_data_tabs ) {
	    
        global $post;
		$product = wc_get_product( $post->ID );

		$product_data_tabs['lumise'] = array(
			'label' => __( 'Lumise', 'lumise' ),
			'target' => 'lumise_product_data'
		);
		
        return $product_data_tabs;
    }
	
	function woo_customize_link_list($html){
		
		global $product, $wpdb, $lumise;
		
		$config = get_option('lumise_config', array());
		
		if(isset($config['btn_list']) && !$config['btn_list']) return $html;
		
		$this->load_core();
		
		$product_id = $product->get_id();
		
		$sql_design = "
					SELECT pm.* FROM " . $wpdb->prefix . "posts as posts INNER JOIN " . $wpdb->prefix . "postmeta as pm  
				  ON ( pm.post_id = " . $product_id . " AND posts.ID = " . $product_id . ") 
				  WHERE  pm.meta_key = 'lumise_product_base' AND  pm.meta_value > 0
				  AND posts.post_type = 'product' AND  posts.post_status = 'publish'
			  ";

		$product_have_design = $wpdb->get_results( $sql_design, ARRAY_A);
		
		if(!count($product_have_design)) return $html;
		
		$sql_custom = "
				  SELECT * FROM " . $wpdb->prefix . "posts as posts  INNER JOIN " . $wpdb->prefix . "postmeta as pm 
				  ON ( pm.post_id = " . $product_id . " AND posts.ID = " . $product_id . ")
				  WHERE ( pm.meta_key = 'lumise_customize' AND  pm.meta_value = 'yes'
				  AND posts.post_type = 'product' AND  posts.post_status = 'publish')
			   ";

		$product_have_custom = $wpdb->get_results( $sql_custom, ARRAY_A);
		$is_product_base = $lumise->lib->get_product($product_have_design[0]['meta_value']);
		
		$sql_custom = "
                  SELECT * FROM " . $wpdb->prefix . "posts as posts  INNER JOIN " . $wpdb->prefix . "postmeta as pm 
                  ON ( pm.post_id = " . $product_id . " AND posts.ID = " . $product_id . ")
                  WHERE ( pm.meta_key = 'lumise_disable_add_cart' AND  pm.meta_value = 'yes'
                  AND posts.post_type = 'product' AND  posts.post_status = 'publish')
               ";
        $disable_add_cart = $wpdb->get_results( $sql_custom, ARRAY_A);
		
		if(
			count($product_have_design) > 0 &&
			count($product_have_custom) > 0 &&
			$is_product_base != null
		){
			$link_design = str_replace('?&', '?', $this->tool_url . '&product='.$product_have_design[0]['meta_value'].'&product_cms=' . $product_id );
			return $html = (count($disable_add_cart) > 0 ?'' : $html).'<a class="lumise-button lumise-list-button" href="' . esc_url($link_design ). '">' . (isset($config['btn_text'])? $config['btn_text'] : __('Customize', 'lumise')) .'</a>' ;
		}
		
		return $html;
	}
	
    // add element html to tab custom product
    function woo_add_product_data_fields() {
        
        global $wpdb;
        $product = get_post_meta( get_the_ID(), 'lumise_product_base', true );
        $design = get_post_meta( get_the_ID(), 'lumise_design_template', true );
        $customize = get_post_meta( get_the_ID(), 'lumise_customize', true );
        $addcart = get_post_meta( get_the_ID(), 'lumise_disable_add_cart', true );

        ?>
		
        <div id="lumise_product_data" class="panel woocommerce_options_panel">
	        <p class="form-field lumise_customize_field options_group hidden" id="lumise-enable-customize">
				<label for="lumise_customize">
					<strong><?php echo esc_html(__('Hide cart button', 'lumise')); ?>:</strong>
				</label>
				<span class="toggle">
					<input type="checkbox" name="lumise_disable_add_cart"  <?php
					if ($addcart == 'yes')echo 'checked';
				?> id="lumise_customize" value="yes" />
					<span class="toggle-label" data-on="Yes" data-off="No"></span>
					<span class="toggle-handle"></span>
				</span>
				<span style="float: left;margin-left: 10px;">
					<?php echo esc_html(__('Hide the Add To Cart button in product details page', 'lumise')); ?>
				</span>
			</p>
			<p class="form-field lumise_customize_field options_group hidden" id="lumise-enable-customize">
				<label for="lumise_customize">
					<strong><?php echo esc_html(__('Allow customize', 'lumise')); ?>:</strong>
				</label>
				<span class="toggle">
					<input type="checkbox" name="lumise_customize"  <?php
					if ($customize != 'no')echo 'checked';
				?> id="lumise_customize" value="yes" />
					<span class="toggle-label" data-on="Yes" data-off="No"></span>
					<span class="toggle-handle"></span>
				</span>
				<span style="float: left;margin-left: 10px;">
					<?php echo esc_html(__('Users can change or customize the design before checkout.', 'lumise')); ?>
				</span>
			</p>
	        <div id="lumise-product-base" class="options_group"></div>
	        <p>
		        <a href="#" class="button button-primary button-large" data-func="products">
			        <i class="dashicons dashicons-screenoptions"></i>
			        <?php echo esc_html(__('Select product base', 'lumise')); ?>
			    </a>
			    &nbsp;
			    <a href="#" title="<?php echo esc_html(__('Remove product base', 'lumise')); ?>" class="button button-link-delete button-large hidden" data-func="remove-base-product">
			        <i class="dashicons dashicons-trash"></i>
			        <?php echo esc_html(__('Remove product', 'lumise')); ?>
			    </a>
	        </p>
	        <input type="hidden" value="<?php echo $product; ?>" name="lumise_product_base" id="lumise_product_base" />
	        <input type="hidden" value="<?php echo $design; ?>" name="lumise_design_template" id="lumise_design_template" />
        </div>
		
        <?php
    }

	// save value element data tabs

    function woo_process_product_meta_fields_save( $post_id ){
	    
	    global $wpdb;
	    
	    $product_base = isset($_POST['lumise_product_base']) ? $_POST['lumise_product_base'] : '';
	    $design_template = isset($_POST['lumise_design_template']) ? $_POST['lumise_design_template'] : '';
	    $lumise_customize = isset($_POST['lumise_customize']) ? $_POST['lumise_customize'] : 'no';
	    $addcart = isset($_POST['lumise_disable_add_cart']) ? $_POST['lumise_disable_add_cart'] : 'no';

        update_post_meta($post_id, 'lumise_disable_add_cart', $addcart);
        update_post_meta($post_id, 'lumise_customize', $lumise_customize);
        update_post_meta($post_id, 'lumise_product_base', $product_base);
        update_post_meta($post_id, 'lumise_design_template', $design_template);
		
        
        if (!empty($product_base) && $lumise_customize == 'yes') {
	        $check = $wpdb->get_results("SELECT `product` FROM `lumise_products` WHERE `id` = $product_base", OBJECT);
	        if (isset($check[0])) {
				$wpdb->query("UPDATE `lumise_products` SET `product` = 0 WHERE `product` = $post_id");
		        $wpdb->query("UPDATE `lumise_products` SET `product` = $post_id WHERE `id` = $product_base");
	        }
        }
        
    }

	/** Frontend**/
	
	public function frontend_scripts(){
		wp_register_script('lumise-frontend', plugin_dir_url(__FILE__) . 'woo/assets/js/frontend.js', array('jquery'), LUMISE_WOO, true);
		
		wp_register_style('lumise-style', plugin_dir_url(__FILE__).'woo/assets/css/frontend.css', false, LUMISE_WOO);
		
		wp_enqueue_style('lumise-style');
		wp_enqueue_script('lumise-frontend');
	}

    //Render attributes from lumise
    public function woo_render_meta( $cart_data, $cart_item = null ){
		// get data in cart
		global $lumise;
		
        $custom_items = array();

        if( !empty( $cart_data ) )  $custom_items = $cart_data;	
		
		if(
			function_exists( 'is_cart' ) 
			&& is_cart() 
			&& isset( $cart_item[ 'lumise_data' ] )
		){
			$cart_item_data = $lumise->lib->get_cart_data( $cart_item['lumise_data'] );
			
			if( is_array($cart_item_data ) ){
				foreach ( $cart_item_data['attributes'] as $attr_name => $options ) {
					$attr_val = array();
					
					foreach ( $options as $option ) {
						$attr_val[] = $option;
					}
					
					$custom_items[] = array( "name" => $attr_name, "value" => implode( ', ', $attr_val ) );
				}
								
				$custom_items[] = array( 
					"name" => $lumise->lang('Color'), 
					"value" => '<font color="'.$cart_item_data['color'].'">'.$cart_item_data['color'].'</font>'.
						(
							($cart_item_data['color_name'] != $cart_item_data['color']) ? 
							' - ' . $cart_item_data['color_name'] : 
							''
						)
				);
			}
			
		}
        return $custom_items;
    }

	
	//design thumbnails in cart page
	public function woo_cart_design_thumbnails($product_image, $cart_item){
		global $lumise;
		
		$design_thumb = '';
		
		if(function_exists('is_cart') && is_cart() && isset($cart_item['lumise_data'])){
			
			$cart_item_data = $lumise->lib->get_cart_data( $cart_item['lumise_data'] );
			
			if(
				isset($cart_item_data['screenshots']) 
				&& is_array($cart_item_data['screenshots'])
			){
				$design_thumb = '<div class="lumise-cart-thumbnails">';
				foreach ($cart_item_data['screenshots'] as $screenshot) {
					$design_thumb .= '<img src="'.$screenshot.'" class="lumise-cart-thumbnail"/>';
				}
				$design_thumb .= '</div>';
			}
		}
		
		return $product_image.$design_thumb;
	}
	
    //Add custom price to product cms
    public function woo_calculate_price($cart_object) {
	    
		global $wpdb, $lumise;
		
        if( !WC()->session->__isset( "reload_checkout" )) {
            $woo_ver = WC()->version;
			
			$this->load_core();

            foreach ($cart_object->cart_contents as $key => $value) {
				
				if( isset($value['lumise_data']) ){
					
					$cart_item_data = $lumise->lib->get_cart_data( $value['lumise_data'] );
					
					$lumise_price = $cart_item_data['price']['total'];
					
					if ( version_compare( $woo_ver, '3.0', '<' ) ) {
			            $cart_object->cart_contents[$key]['data']->price = $lumise_price; // Before WC 3.0
			        } else {
						$cart_object->cart_contents[$key]['data']->price = $lumise_price; // Before WC 3.0
			            $cart_object->cart_contents[$key]['data']->set_price( $lumise_price ); // WC 3.0+
			        }
					
					$cart_object->cart_contents[$key]['quantity'] = 1;
				}else{
					$product_id = $value['product_id'];
					$product_base_id = $this->get_base_id($product_id);
                    
					if($product_base_id != null){
						$is_product_base = $lumise->lib->get_product($product_base_id);
						if($is_product_base != null){
							
							$cms_template = get_post_meta($product_id, 'lumise_design_template', true );
							$product = wc_get_product($product_id);
							$template_price = 0;
							$template_stages = array();
							
							if (isset($cms_template) && !empty($cms_template) && $cms_template != '%7B%7D') {
								
								$cms_template = json_decode(urldecode($cms_template), true);
								$templates = array();
								
								foreach($cms_template as $s => $stage){
									$template_stages[$s] = $stage['id'];
									
									if(!in_array($stage['id'], $templates)){
										$templates[] = $stage['id'];
										$template = $lumise->lib->get_template($stage['id']);
										$template_price += ($template['price'] > 0)? $template['price'] : 0;
									}
								}
								
								$price = $product->get_price();
								$total_price = 0;
								
								if ( version_compare( $woo_ver, '3.0', '<' ) ) {
						            $total_price = $cart_object->cart_contents[$key]['data']->price = $price + $template_price; // Before WC 3.0
						        } else {
						            $cart_object->cart_contents[$key]['data']->set_price( $price + $template_price ); // WC 3.0+
									$total_price = $price + $template_price;
						        }
								
								if(!isset($value['lumise_incart'])){
									//push item to lumise_cart
									$data = array(
										'product_id' => $product_base_id,
										'product_cms' => $product_id,
										'product_name' => $product->get_name(),
										'template' => $lumise->lib->enjson($template_stages),
										'price' => array(
								            'total' => $total_price,
								            'attr' => 0,
								            'printing' => 0,
								            'resource' => 0,
								            'base' => $total_price
								        ),
									);
									
									$item = $lumise->lib->cart_item_from_template($data, null);
									
									if(is_array($item)){
										$item['incart'] = true;
										$lumise->lib->add_item_cart($item);
										$cart_object->cart_contents[$key]['lumise_incart'] = true;
									}
									
									
								}
								
								
							}
						}
					}

					
                    
					
				}
                
            }
        }

    }
	
	// Add value custom field to order
    function woo_add_order_item_meta( $item_id, $values, $cart_item_key ) {

        if( isset( $values['lumise_data'] ) )
			wc_add_order_item_meta( $item_id, "lumise_data", $values['lumise_data'] );
    }

    // save data to table order_products
    function woo_order_finish( $order_id ) {

        global $wpdb, $lumise;
		
		$this->load_core();

        //$order = new WC_Order( $order_id );

        $table_name =  $this->prefix."order_products";
		
		//check if order is exist, exit this function
		$count_order = $wpdb->get_var( " SELECT COUNT( * ) FROM $table_name WHERE order_id = $order_id" );
		$cart_data = $lumise->connector->get_session('lumise_cart');
		//print_r($cart_data);
		//$lumise->connector->set_session('lumise_cart', array('items' => array()));
		if ($count_order > 0) return;
		$lumise->lib->store_cart( $order_id );
    }

    // Get product have product base
    public function woo_products_assigned(){

        global $wpdb;
        $list_product = array();
        $sql_id_product_design_base = "SELECT meta_value FROM " .  $wpdb->prefix . "postmeta WHERE " . $wpdb->prefix . "postmeta.meta_key = 'lumise_product_base'";

        $list_id_product = $wpdb->get_results( $sql_id_product_design_base, ARRAY_A );


        if( count($list_id_product) > 0 ){
            $list_id_meta_product = array();

            foreach ($list_id_product as $key_meta_product => $meta_product){
                foreach ($meta_product as $key_meta_product_key => $meta_product_value ){
                    if( $meta_product_value == '' || $meta_product_value == '0' || $meta_product_value == 0 ){
                        unset($list_id_product[$key_meta_product]);
                    }else{
                        array_push($list_id_meta_product, $meta_product_value);
                    }
                }
            }

            $list_item_id_product = array_unique($list_id_meta_product);

            $arr_product_ID = implode(',', $list_item_id_product);

            $sql = "
                  SELECT * FROM " . $wpdb->prefix . "posts  INNER JOIN " . $wpdb->prefix . "postmeta
                  ON ( " . $wpdb->prefix . "posts.ID = " . $wpdb->prefix . "postmeta.post_id )
                  WHERE ( " . $wpdb->prefix . "postmeta.meta_key = 'lumise_product_base' AND " . $wpdb->prefix . "postmeta.meta_value IN ($arr_product_ID ))              
                  AND " . $wpdb->prefix . "posts.post_type = 'product' AND (( " .$wpdb->prefix . "posts.post_status = 'publish'))
                  GROUP BY " . $wpdb->prefix . "posts.ID ORDER BY " . $wpdb->prefix . "posts.post_date DESC
              ";

            $list_product = $wpdb->get_results( $sql, ARRAY_A);

        }

        return $list_product;
    }
	
	//get products woo
    public function woo_products(){
        global $wpdb;

        $sql_product = "
                  SELECT " . $wpdb->prefix . "posts.ID, " . $wpdb->prefix . "posts.post_title , ". $wpdb->prefix . "postmeta.meta_value  FROM " . $wpdb->prefix . "posts  INNER JOIN " . $wpdb->prefix . "postmeta
                  ON ( " . $wpdb->prefix . "posts.ID = " . $wpdb->prefix . "postmeta.post_id ) WHERE " . $wpdb->prefix . "postmeta.meta_key = '_regular_price' "
        ;

        $list_product_woocomerce = $wpdb->get_results( $sql_product, ARRAY_A );

        return $list_product_woocomerce ;

    }

	//load core lumise
	public function load_core() {
		
		require_once($this->path . $this->connector_file);
        require_once($this->app_path.'includes'.DS.'main.php');
        
	}
    
    public function get_product() {
        
        global $product;
        
        
        if ($this->product_id != null && function_exists('wc_get_product')) {

            $product = $this->product = wc_get_product($this->product_id);
            
            if ($this->product != null) 
                return $this->product;
            
        }
        return null;
    }
	
	//edti design button in cart page
	public function woo_cart_edit_design_btn($product_name, $cart_item){
		global $lumise;
		
		if(
			function_exists('is_cart') 
			&& is_cart() 
			&& isset($cart_item['lumise_data'])
		){
			$is_query = explode('?', $this->tool_url);
			$cart_id = $cart_item['lumise_data'][ 'cart_id' ];
			$cart_item_data = $lumise->lib->get_cart_data( $cart_item['lumise_data'] );
			
			$url = $this->tool_url . ((isset($is_query[1]) && !empty($is_query[1]))? '&' : '').'product='.$cart_item_data['product_id'].'&product_cms='.$cart_item_data['product_cms'].'&cart='.$cart_id;
			return $product_name . '<div class="lumise-edit-design-wrp"><a class="lumise-edit-design button" href="'.$url.'">'.__('Edit Design', 'lumise').'</a></div>';
		}
			
		else
			return $product_name;
	}
	
	//change quantity column in cart page
	public function woo_cart_item_quantity($product_quantity, $cart_item_key = null, $cart_item = null){
		global $lumise;
		
		if( isset($cart_item['lumise_data']) ){
			
			$cart_item_data = $lumise->lib->get_cart_data( $cart_item['lumise_data'] );
			
			if( 
				isset($cart_item_data['qtys']) && 
				count($cart_item_data['qtys']) > 0
			){
				
				$product_quantity = array();

				foreach ($cart_item_data['qtys'] as $key => $val) {
					$product_quantity[] = $key .' - '.$val['qty'];
				}
				
				return implode('<br/>', $product_quantity);
				
			}else $product_quantity = $cart_item_data['qty'];
		}
		
		return $product_quantity;
	}
	
	//change quantity column in checkout page
	public function woo_checkout_cart_item_quantity( $str, $cart_item, $cart_item_key ){
		global $lumise;
		
		$cart_item_data = isset( $cart_item['lumise_data'] ) ? $lumise->lib->get_cart_data( $cart_item['lumise_data'] ) : array();
		
		return isset($cart_item['lumise_data']) ? ' <strong class="product-quantity">' . sprintf( '&times; %s', $cart_item_data['qty'] ) . '</strong>': $str;
		
	}
	
	//change quantity column in order page
	public function woo_order_item_quantity_html( $str, $item ){
		
		global $lumise;
		
		$custom_field = wc_get_order_item_meta( $item->get_id(), 'lumise_data', true );
		$this->load_core();
		
		$cart_item_data = $lumise->lib->get_cart_data( $custom_field );

		if( is_array( $cart_item_data ) 
			&& isset( $cart_item_data[ 'qty' ] ) 
		){
			return ' <strong class="product-quantity">' . sprintf( '&times; %s', $cart_item_data['qty'] ) . '</strong>';
		}
		
		return $str;
		
	}
	
	public function woo_order_item_meta_start( $item_id, $item, $order)
	{
		unset( $item['lumise_data'] );
	}
		
	public function customer_designs( $order, $sent_to_admin = false, $plain_text = false ) {
		
		if ( ! is_a( $order, 'WC_Order' ) ) {
			return;
		}
		
		global $lumise;
		
		$this->load_core();
		
		if( isset($lumise->cfg->settings['email_design']) && $lumise->cfg->settings['email_design'] == 1 ) {
			
			$order_id 	= $order->get_id();
			
			$order_status = $order->get_status();
			
			if( $order_status == 'completed' ) {
				$items = $lumise->lib->get_order_products($order_id);
				
				if( $plain_text ) {
					echo $lumise->lang("Your Designs:")."\n";
				} else {
					?>
					<h2><?php echo $lumise->lang("Your Designs:");?></h2>
					<div style="margin-bottom: 40px;">
					<table class="td" cellspacing="0" cellpadding="6" style="width: 100%; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;" border="1">
						<thead>
							<tr>
								<th class="td" scope="col"><?php _e( 'Product', 'woocommerce' ); ?></th>
								<th class="td" scope="col"><?php _e( 'View Design', 'woocommerce' ); ?></th>
							</tr>
						</thead>
						<tbody>
					<?php
				}
				
				foreach ($items as $order_item) {
					$is_query = explode('?', $lumise->cfg->tool_url);
						
					$url = $lumise->cfg->tool_url.(isset($is_query[1])? '&':'?');
					$url .= 'product='.$order_item['product_base'];
					$url .= (($order_item['custom'] == 1)? '&design_print='.str_replace('.lumi', '', $order_item['design']) : '');
					$url .= '&order_print='.$order_id . '&product_cms='.$order_item['product_id'];
								
					$url = str_replace('?&', '?', $url);
					
					if( $plain_text ) {
						echo $order_item['product_name']."\n" . $url."\n\n";
					} else {
						?>
						<tr>
							<td style="color:#636363; border:1px solid #e5e5e5; padding:12px;"><?php echo $order_item['product_name'];?></td>
							<td style="color:#636363; border:1px solid #e5e5e5; padding:12px;"><a href="<?php echo $url;?>" target="_blank" class="lumise-view-design"><?php echo $lumise->lang('View Design');?></a></td>
						</tr>
						<?php
					}
					
				}
				
				if( $plain_text ) {
					"\n\n=======================================\n\n";
				} else {
					?>
						</tbody>
					</table>
				</div>
					<?php
				}
			}
		}
		
	}
	
	public function woo_cart_item_removed($cart_key, $cart)
	{
		global $lumise;
		
		foreach ($cart->removed_cart_contents as $key => $cart_item) {
			if( isset($cart_item['lumise_data']) ){
				
				$lumise->lib->remove_cart_item($cart_item['lumise_data']['cart_id']);
			}
		}
	}
	
	//add template thumbnail to product image
	public function woo_add_template_thumbs(){
		
		global $product,  $wpdb, $lumise;
		
		$this->load_core();
		
        $product_id = $product->get_id();

        $product_have_design = $this->has_template($product_id);
		
		if( is_array($product_have_design)){
			$template = $lumise->lib->get_template($product_have_design['meta_value']);
			if(is_array($template)){
				
				$attributes = array(
					'title'                   => $template['name'],
					'data-caption'            => $template['name'],
					'data-src'                => $template['screenshot'],
					'data-large_image'        => $template['screenshot']
				);
				$html  = '<div data-thumb="' . $template['screenshot'] . '" class="woocommerce-product-gallery__image"><a href="' . esc_url( $template['screenshot'] ) . '">';
				$html .= '<img src="'.$template['screenshot'].'" '.implode(' ', $attributes).'/>';
				$html .= '</a></div>';
				echo $html;
			}
			
        }
	}
	
	//check product as design?
	public function has_template($product_id){
		global $wpdb, $lumise;
		
		$cms_product = $wpdb->get_results("SELECT * FROM `{$wpdb->prefix}posts` WHERE `id`=".$product_id);
		$cms_template = get_post_meta($product_id, 'lumise_design_template', true );
		if (!isset($cms_product[0]))
			return false;
		
		if (isset($cms_template) && !empty($cms_template) && $cms_template != '%7B%7D') {
			return true;
		}
		return false;
	}
	
	public function get_base_id($product_id){
		global $wpdb;
		
		$sql_design = "
					SELECT pm.* FROM " . $wpdb->prefix . "posts as posts INNER JOIN " . $wpdb->prefix . "postmeta as pm  
				  ON ( pm.post_id = " . $product_id . " AND posts.ID = " . $product_id . ") 
				  WHERE  pm.meta_key = 'lumise_product_base' AND  pm.meta_value > 0
				  AND posts.post_type = 'product' AND  posts.post_status = 'publish'
			  ";
		
		$product_have_design = $wpdb->get_results( $sql_design, ARRAY_A);
		
		if(count($product_have_design)>0)
			return $product_have_design[0]['meta_value'];
		return null;
	}
	
	public function woo_product_get_price_html($price, $product){
		
		global $wpdb, $lumise;
		
		$this->load_core();
		
		$cms_template = get_post_meta($product->get_id(), 'lumise_design_template', true );
		
		$template_price = 0;
		
		if (
			isset($cms_template) 
			&& !empty($cms_template) 
			&& $cms_template != '%7B%7D'
		) {
			$cms_template = json_decode(urldecode($cms_template), true);
			$templates = array();
			foreach($cms_template as $stage){
				if(!in_array($stage['id'], $templates)){
					$templates[] = $stage['id'];
					$template = $lumise->lib->get_template($stage['id']);
					$template_price += ($template['price'] > 0)? $template['price'] : 0;
				}
			}
			return wc_price( $product->get_price() + $template_price);
		}
		
		return $price;
		
	}
	 
	public function hide_wp_update_notice() {
	   remove_action( 'admin_notices', 'update_nag', 3 );
	} 
	         
	public function wpdocs_dequeue_script() {
		
	    global $wp_scripts;
	    $wp_scripts->queue = array('hoverIntent', 'common', 'admin-bar', 'heartbeat', 'wp-auth-check');
	    
	}

	public function add_display_post_states($post_states, $post){
		global $wpdb;
		$editor_page = get_option('lumise_editor_page', 0);

		if ( $editor_page == $post->ID ) {
			$post_states['lumise_design_page'] = __( 'Design Editor Page', 'lumise' );
		}
		if($post->post_type == 'product'){
			$product_id = $post->ID;
			$sql_design = "
						SELECT pm.*, pm.meta_value as base_id  FROM " . $wpdb->prefix . "posts as posts INNER JOIN " . $wpdb->prefix . "postmeta as pm  
	                  ON ( pm.post_id = " . $product_id . " AND posts.ID = " . $product_id . ") 
	                  WHERE  pm.meta_key = 'lumise_product_base' AND  pm.meta_value > 0
	                  AND posts.post_type = 'product' AND  posts.post_status = 'publish'
	              ";
	        $product_have_design = $wpdb->get_results( $sql_design, ARRAY_A);
			if(!count($product_have_design)) return $post_states;
			$post_states['lumise_assigned_base'] = __( 'Assigned Product Base', 'lumise' ).' #'.$product_have_design[0]['base_id'];
		}
		return $post_states;
	}
	
	public function plugin_action_links( $links ) {
		$action_links = array(
			'settings' => '<a href="' . admin_url( 'admin.php?page=lumise' ) . '" aria-label="' . esc_attr__( 'Go to Lumise settings', 'woocommerce' ) . '">' . esc_html__( 'Settings', 'lumise' ) . '</a>',
		);

		return array_merge( $action_links, $links );
	}
	
	public function plugin_row_meta($links, $file) {
		
		if (LUMISE_PLUGIN_BASENAME == $file) {
			
			$row_meta = array(
				'docs' => '<a href="' . esc_url( 'https://docs.lumise.com/?utm_source=client-site&utm_medium=plugin-meta&utm_campaign=links&utm_term=meta&utm_content=woocommerce' ) . '" target=_blank aria-label="' . esc_attr__( 'View Lumise docs', 'lumise' ) . '">' . esc_html__( 'Documentation', 'lumise' ) . '</a>',
				'blog' => '<a href="' . esc_url( 'https://blog.lumise.com/?utm_source=client-site&utm_medium=plugin-meta&utm_campaign=links&utm_term=meta&utm_content=woocommerce' ) . '" target=_blank aria-label="' . esc_attr__( 'View Lumise docs', 'lumise' ) . '">' . esc_html__( 'Lumise Blog', 'lumise' ) . '</a>',
				'support' => '<a href="' . esc_url( 'https://help.lumise.com/?utm_source=client-site&utm_medium=plugin-meta&utm_campaign=links&utm_term=meta&utm_content=woocommerce' ) . '" target=_blank aria-label="' . esc_attr__( 'Visit premium customer support', 'lumise' ) . '">' . esc_html__( 'Premium support', 'lumise' ) . '</a>'
			);

			return array_merge( $links, $row_meta );
		}

		return (array) $links;
	}
	
	public function update_message($response){
		
		?><script>document.querySelectorAll("#lumise-hook-sfm-update .update-message.notice p")[0].innerHTML = '<?php echo esc_html__('There is a new version of Lumise - Product Designer Tool'); ?>. <a href="https://www.lumise.com/changelogs/woocommerce/?utm_source=client-site&utm_medium=text&utm_campaign=update-page&utm_term=links&utm_content=woocommerce" target=_blank" target=_blank>View version <?php echo $response['new_version']; ?> details</a> or <a href="<?php echo admin_url( 'admin.php?page=lumise&lumise-page=updates' ); ?>">update now</a>.';</script><?php
	}
	
	public function remove_actions(){
		
		global $product, $wpdb, $lumise;
		
		$config = get_option('lumise_config', array());		
		if(
			(isset($config['btn_page']) && !$config['btn_page']) ||
			!method_exists($product, 'get_id')
		) return;
		
		$product_id = $product->get_id();
		$this->load_core();
		
        $sql_custom = "
                  SELECT * FROM " . $wpdb->prefix . "posts as posts  INNER JOIN " . $wpdb->prefix . "postmeta as pm 
                  ON ( pm.post_id = " . $product_id . " AND posts.ID = " . $product_id . ")
                  WHERE ( pm.meta_key = 'lumise_customize' AND  pm.meta_value = 'yes'
                  AND posts.post_type = 'product' AND  posts.post_status = 'publish')
               ";
        $product_have_custom = $wpdb->get_results( $sql_custom, ARRAY_A);
		
		$sql_custom = "
                  SELECT * FROM " . $wpdb->prefix . "posts as posts  INNER JOIN " . $wpdb->prefix . "postmeta as pm 
                  ON ( pm.post_id = " . $product_id . " AND posts.ID = " . $product_id . ")
                  WHERE ( pm.meta_key = 'lumise_disable_add_cart' AND  pm.meta_value = 'yes'
                  AND posts.post_type = 'product' AND  posts.post_status = 'publish')
               ";
        $disable_add_cart = $wpdb->get_results( $sql_custom, ARRAY_A);
		
		if('' === $product->get_price()) $disable_add_cart = 1;
		
		if( count($product_have_custom) > 0 ){
			if(count($disable_add_cart) > 0){
				remove_action( 'woocommerce_simple_add_to_cart', 'woocommerce_simple_add_to_cart', 30 );
				add_action( 'woocommerce_simple_add_to_cart', array($this, 'customize_button'), 30 );
			}else{
				add_action( 'woocommerce_after_add_to_cart_button', array($this, 'customize_button'), 30 );
			}
			
		}
        
	}
	
	public function customize_button(){
		
		global $product, $wpdb, $lumise;
		
		$config = get_option('lumise_config', array());		
		
		if(
			(isset($config['btn_page']) && !$config['btn_page']) ||
			!method_exists($product, 'get_id')
		) return;
		
		$product_id 	= $product->get_id();
		
		$sql_design = "
			SELECT pm.* FROM " . $wpdb->prefix . "posts as posts INNER JOIN " . $wpdb->prefix . "postmeta as pm  
			ON ( pm.post_id = " . $product_id . " AND posts.ID = " . $product_id . ") 
			WHERE  pm.meta_key = 'lumise_product_base' AND  pm.meta_value > 0
			AND posts.post_type = 'product' AND  posts.post_status = 'publish'
		";
        $product_have_design = $wpdb->get_results( $sql_design, ARRAY_A);
		
		if (!count($product_have_design)) return;
		
		$text 			= isset($config['btn_text'])? $config['btn_text'] : __('Customize', 'lumise');
		$link_design	= str_replace('?&', '?', $this->tool_url . '&product='.$product_have_design[0]['meta_value'].'&product_cms=' . $product_id);
		$product_base 	= $lumise->db->rawQuery("SELECT * FROM `{$lumise->db->prefix}products` WHERE id=" . $product_have_design[0]['meta_value']);
		
		if(count($product_base) > 0){
			do_action( 'lumise_before_customize_button' );
			$class_lumise = apply_filters('lumise_button_customize', 'lumise-button button alt');
			echo '<a name="customize" class="'.$class_lumise.'" href="'.esc_url($link_design ).'">'.$text.'</a>';
			do_action( 'lumise_after_customize_button' );
		}
	}

}

global $lumise_woo;

$lumise_woo = new lumise_woocommerce();
