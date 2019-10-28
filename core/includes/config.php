<?php
/**
*
*	(p) package: Lumise
*	(c) author:	King-Theme
*	(i) website: https://lumise.com
*
*/

class lumise_cfg {

	public $root_path;
	public $upload_path;
	public $editor_url;
	public $checkout_url;
	public $upload_url;
	public $database;
	public $url;
	public $tool_url;
	public $color;
	public $logo = '4db6ac';
	public $site_uri;
	public $ajax_url;
	public $assets_url;
	public $security_name = 'form_key';
	public $security_code;
	public $admin_url;
	public $admin_assets_url;
	public $admin_ajax_url;
	public $load_jquery;
	public $js_lang;
	public $default_fonts;
	public $base_default;
	public $active_language;
	public $product;
	public $print_types;
	public $api_url;
	public $scheme;
	public $lang_storage = array();
    public $settings = array(
	
		'admin_email' => '',
		
		'title' => 'Lumise Design',
		'logo' => '',
		'favicon' => '',
		'logo_link' => 'https://lumise.com',
		'back_link' => '',
		'primary_color' => '',
		
		'enable_colors' => '1',
		'colors' => '#3fc7ba:#546e7a,#757575,#6d4c41,#f4511e,#fb8c00,#ffb300,#fdd835,#c0cA33,#a0ce4e,#7cb342,#43a047,#00897b,#00acc1,#3fc7ba,#039be5,#3949ab,#5e35b1,#8e24aa,#d81b60,#eeeeee,#3a3a3a',
		'rtl' => '',
		'user_print' => '',
		'user_download' => array('jpg', 'png', 'svg', 'pdf', 'lumi'),
		
		'currency' => '$',
		'currency_code' => 'USD',
		'thousand_separator' => ',',
		'decimal_separator' => '.',
		'number_decimals' => 2,
		'currency_position' => 0,
		'merchant_id' => '',
		'sanbox_mode' => 0,
		
		'google_fonts' => '{"Roboto":["greek%2Clatin%2Ccyrillic-ext%2Ccyrillic%2Cvietnamese%2Cgreek-ext%2Clatin-ext","100%2C100italic%2C300%2C300italic%2Cregular%2Citalic%2C500%2C500italic%2C700%2C700italic%2C900%2C900italic"],"Poppins":["devanagari%2Clatin%2Clatin-ext","300%2Cregular%2C500%2C600%2C700"],"Oxygen":["latin%2Clatin-ext","300%2Cregular%2C700"],"Anton":["latin%2Clatin-ext%2Cvietnamese","regular"],"Lobster":["latin%2Clatin-ext%2Ccyrillic%2Cvietnamese","regular"],"Abril%20Fatface":["latin%2Clatin-ext","regular"],"Pacifico":["latin%2Clatin-ext%2Cvietnamese","regular"],"Quicksand":["latin%2Clatin-ext%2Cvietnamese","300%2Cregular%2C500%2C700"],"Patua%20One":["latin","regular"],"Great%20Vibes":["latin%2Clatin-ext","regular"],"Monoton":["latin","regular"],"Berkshire%20Swash":["latin%2Clatin-ext","regular"]}',
		
	    'admin_lang' => 'en',
		'editor_lang' => 'en',
		'allow_select_lang' => 1,
		'activate_langs' => array(),


		'help_title' => '',
		'helps' => array(),
		'about' => '',

		'tab' => 'general',
		'share' => 0,
		'report_bugs' => 2,
		'email_design' => 1,
		'components' => array('shop', 'product', 'templates', 'cliparts', 'text', 'images', 'shapes', 'drawing', 'layers', 'back'),
		'disable_resources' => '',
		'min_upload' => '',
		'max_upload' => '',
		'min_dimensions' => '50x50',
		'max_dimensions' => '1500x1500',
		'custom_css' => '',
		'prefix_file' => 'lumise',
		'text_direction' => '',
		'stages' => '4',
		'label_stage_1' => 'Front',
		'label_stage_2' => 'Back',
		'label_stage_3' => 'Left',
		'label_stage_4' => 'Right',
		'last_update' => ''
	);
	protected $allows = array(
		'editor_url',
		'checkout_url',
		'upload_path',
		'upload_url',
		'database',
		'logo',
		'url',
		'site_uri',
		'print_types',
		'security_name',
		'security_code',
		'ajax_url',
		'assets_url',
		'load_jquery',
		'root_path',
        'admin_url',
		'admin_assets_url',
		'admin_ajax_url',
		'js_lang',
		'default_fonts',
		'base_default',
		'settings',
		'api_url',
		'scheme',
		'tool_url'
	);

	public function __construct($conn) {
		
		global $lumise;
		
		if (
			(function_exists('session_status') && session_status() == PHP_SESSION_NONE) ||
			(function_exists('session_id') && session_id() == '')
		) {
			@session_start();
		}

		define('lumise', '1.1' );

		if(!defined('DS'))
			define('DS', DIRECTORY_SEPARATOR );
		if(!defined('LUMISE_FILE'))
			define('LUMISE_FILE', __FILE__);
		if(!defined('LUMISE_PATH'))
			define('LUMISE_PATH', str_replace(DS.'includes','',dirname(__FILE__)));
		define('LUMISE_SLUG', basename(dirname(__FILE__)));
		
		$this->settings = $lumise->apply_filter('init_settings', $this->settings);
		
		$this->set($conn->config);
		$this->settings['logo'] = $this->assets_url.'assets/images/logo.png';
		
		require_once(LUMISE_PATH.DS.'includes'.DS.'secure.php');
		require_once(LUMISE_PATH.DS.'includes'.DS.'database.php');

	}

	public function set($args) {

		if (is_array($args)) {
			foreach($args as $name => $val) {
				if (in_array($name, $this->allows)) {
					$this->{$name} = $val;
				}
			}
		}

	}

	public function get($name = '') {

		if (in_array($name, $this->allows)) {
			return $this->{$name};
		}

		return null;

	}

	public function __get( $name ) {
        if ( isset( $this->{$name} ) ) {
            return $this->{$name};
        } else {
            return null;
        }
    }

    public function __set( $name, $value ) {
        if ( isset( $this->$name ) ) {
            throw new Exception( "Tried to set nonexistent '$name' property of MyClass class" );
            return false;
        } else {
            throw new Exception( "Tried to set read-only '$name' property of MyClass class" );
            return false;
        }
    }

    public function set_lang($lumise) {

	    if (
			defined('LUMISE_ADMIN') && 
			LUMISE_ADMIN === true
		) {

			if (
				isset($this->settings['admin_lang']) &&
				!empty($this->settings['admin_lang'])
			)
				$this->active_language = $this->settings['admin_lang'];
			else
				$this->active_language = 'en';

		}else{
			$this->active_language = $lumise->connector->get_session('lumise-active-lang');
			
			if (
				!isset($this->active_language) ||
				empty($this->active_language) || 
				!$this->settings['allow_select_lang']
			) {

				if (
					isset($this->settings['editor_lang']) &&
					!empty($this->settings['editor_lang'])
				)
					$this->active_language = $this->settings['editor_lang'];
				else
					$this->active_language = 'en';
					
					$lumise->connector->set_session('lumise-active-lang', $this->active_language);

			}
		} 


		if (
			isset($this->active_language) &&
			!empty($this->active_language) &&
			$this->active_language != 'en'
		) {

			$get_query = "SELECT `original_text`, `text` FROM `{$lumise->db->prefix}languages` WHERE `lang`='".$this->active_language."'";
			$get_langs = $lumise->db->rawQuery($get_query);

			if (count($get_langs) > 0) {
				foreach ($get_langs as $lang) {
					$this->lang_storage[strtolower($lang['original_text'])] = $lang['text'];
				}
			}
		}

    }

    public function set_settings($lumise) {
	    foreach ($this->settings as $key => $val) {
		    $this->settings[$key] = $lumise->get_option($key, $val);
	    }
    }

    public function init() {

	    global $lumise;

		$this->product = $lumise->lib->get_product();

		$this->set_settings($lumise);
		$this->set_lang($lumise);
		
		
		$color = explode(':', isset($this->settings['primary_color']) ? $this->settings['primary_color'] : '#4db6ac');
		$this->color = str_replace('#', '', $color[0]);
		
	    if (is_string($lumise->cfg->settings['activate_langs'])) {
		    $lumise->cfg->settings['activate_langs'] = explode(',', $lumise->cfg->settings['activate_langs']);
	    }
		
		if (!empty($lumise->cfg->settings['logo']) && strpos($lumise->cfg->settings['logo'], 'http') === false)
			$lumise->cfg->settings['logo'] = $lumise->cfg->upload_url.$lumise->cfg->settings['logo'];
		
		$lumise->cfg->scheme = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? 'https' : 'http';
		$lumise->cfg->api_url = $lumise->cfg->scheme.'://services.lumise.com/';
		
		$this->base_default = array(
			"bag_back.png", 
			"bag_front.png", 
			"basic_tshirt_back.png", 
			"basic_tshirt_front.png", 
			"basic_women_tshirt_back.png", 
			"basic_women_tshirt_front.png", 
			"cup_back.png", 
			"cup_front.png", 
			"shoe.png", 
			"hat.png", 
			"pillow.png", 
			"hoodie_back.png", 
			"hoodie_front.png", 
			"hoodies_sweatshirt_back.png", 
			"hoodies_sweatshirt_front.png", 
			"kids_babies_back.png", 
			"kids_babies_front.png", 
			"long_sleeve_back.png",
			"long_sleeve_front.png", 
			"phone_case.png", 
			"premium_back.png", 
			"premium_front.png", 
			"stickers.png", 
			"tank_tops_back.png", 
			"tank_tops_front.png", 
			"v_neck_tshirt_back.png", 
			"v_neck_tshirt_front.png", 
			"women_tank_tops_back.png",
			"women_tank_tops_front.png", 
			"women_tshirt_back.png", 
			"women_tshirt_front.png"
		);
		
	    $this->js_lang = array(
		    'sure'=> $lumise->lang('Are you sure?'),
			'save'=> $lumise->lang('Save'),
			'edit'=> $lumise->lang('Edit'),
			'remove'=> $lumise->lang('Remove'),
			'cancel'=> $lumise->lang('Cancel'),
			'reset'=> $lumise->lang('Reset'),
			'stage'=> $lumise->lang('Stage'),
			'front'=> $lumise->lang('Front'),
			'back'=> $lumise->lang('Back'),
			'left'=> $lumise->lang('Left'),
			'right'=> $lumise->lang('Right'),
			'loading'=> $lumise->lang('Loading'),
			'importing'=> $lumise->lang('Importing'),
			'apply'=> $lumise->lang('Apply Now'),
			'error_403'=> $lumise->lang('Your session is expired, Please reload your browser'),
			'01'=> $lumise->lang('Center center'),
			'02'=> $lumise->lang('Horizontal center'),
			'03'=> $lumise->lang('Vertical center'),
			'04'=> $lumise->lang('Square'),
			'05'=> $lumise->lang('Are you sure that you want to make selected objects to one object?'),
			'06'=> $lumise->lang('No layer'),
			'07'=> $lumise->lang('Add new layer to use it as a mask'),
			'08'=> $lumise->lang('Error, the active object should be covered by the mask layer'),
			'09'=> $lumise->lang('Your QRCode text'),
			'10'=> $lumise->lang('Create QR Code'),
			'11'=> $lumise->lang('Enter your text or a link'),
			'12'=> $lumise->lang('Select color for QR Code'),
			'13'=> $lumise->lang('Choose color'),
			'14'=> $lumise->lang('Visibility'),
			'15'=> $lumise->lang('Lock layer'),
			'16'=> $lumise->lang('Delete layer'),
			'17'=> $lumise->lang('Error when select stage, missing configuration'),
			'18'=> $lumise->lang('Invalid type of current active object'),
			'19'=> $lumise->lang('Invalid type of current active object'),
			'20'=> $lumise->lang('Error: missing configuration.'),
			'21'=> $lumise->lang('Your design has been saved successful.'),
			'22'=> $lumise->lang('The design has been removed'),
			'23'=> $lumise->lang('Error : Your session is invalid. Please reload the page to continue.'),
			'24'=> $lumise->lang('We just updated your expired session. Please redo your action'),
			'25'=> $lumise->lang('Data structure error'),
			'26'=> $lumise->lang('The design has been loaded successfully'),
			'27'=> $lumise->lang('You have not created any designs yet'),
			'28'=> $lumise->lang('New design has been created'),
			'29'=> $lumise->lang('The design has been successfully cleaned!'),
			'30'=> $lumise->lang('Enter the new design title'),
			'31'=> $lumise->lang('The export data under JSON has been storaged in your clipboard.'),
			'32'=> $lumise->lang('Only accept the file with type JSON that exported by our system.'),
			'33'=> $lumise->lang('Error loading image '),
			'34'=> $lumise->lang('Double-click on the text to type'),
			'35'=> $lumise->lang('Invalid size, please enter Width in 2.6-84.1 and Height in 3.7-118.9'),
			'36'=> $lumise->lang('Error, File too large. Please try to set smaller size'),
			'37'=> $lumise->lang('Your design is not saved. Are you sure you want to leave this page?'),
			'38'=> $lumise->lang('Your design is not saved. Are you sure you want to load new design?'),
			'39'=> $lumise->lang('The link has been copied to your clipboard'),
			'40'=> $lumise->lang('Please save your design first to create link'),
			'41'=> $lumise->lang('You have not granted permission to view or edit this design'),
			'42'=> $lumise->lang('No items found'),
			'43'=> $lumise->lang('Back to categories'),
			'44'=> $lumise->lang('Please wait..'),
			'45'=> $lumise->lang('Prev'),
			'46'=> $lumise->lang('Next'),
			'47'=> $lumise->lang('Delete this image'),
			'48'=> $lumise->lang('Click to load this design'),
			'49'=> $lumise->lang('Make a copy'),
			'50'=> $lumise->lang('Export design'),
			'51'=> $lumise->lang('Delete design'),
			'52'=> $lumise->lang('Click to edit design title'),
			'53'=> $lumise->lang('Warning: Images too large may slow down the tool'),
			'54'=> $lumise->lang('Design Title'),
			'55'=> $lumise->lang('Error while loading font'),
			'56'=> $lumise->lang('Categories'),
			'57'=> $lumise->lang('All categories'),
			'58'=> $lumise->lang('Design options'),
			'59'=> $lumise->lang('Keep current design'),
			'60'=> $lumise->lang('Select design from templates'),
			'61'=> $lumise->lang('Design from blank'),
			'62'=> $lumise->lang('Start design now!'),
			'63'=> $lumise->lang('Search product'),
			'64'=> $lumise->lang('Print Technologies'),
			'65'=> $lumise->lang('Side'),
			'66'=> $lumise->lang('Quantity'),
			'67'=> $lumise->lang('Prices Table'),
			'68'=> $lumise->lang('Details'),
			'69'=> $lumise->lang('More'),
			'70'=> $lumise->lang('Successfull, view the full cart and checkout in the menu "My Cart"'),
			'71'=> $lumise->lang('Your cart is empty'),
			'72'=> $lumise->lang('Editing'),
			'73'=> $lumise->lang('Your cart details'),
			'74'=> $lumise->lang('Total'),
			'75'=> $lumise->lang('Checkout'),
			'76'=> $lumise->lang('Products'),
			'77'=> $lumise->lang('Options'),
			'78'=> $lumise->lang('Actions'),
			'79'=> $lumise->lang('Updated'),
			'80'=> $lumise->lang('Change product'),
			'81'=> $lumise->lang('Colors'),
			'82'=> $lumise->lang('Unsave'),
			'83'=> $lumise->lang('File not found'),
			'84'=> $lumise->lang('Your uploaded image'),
			'85'=> $lumise->lang('Active'),
			'86'=> $lumise->lang('Deactive'),
			'87'=> $lumise->lang('Select product'),
			'88'=> $lumise->lang('Loading fonts'),
			'89'=> $lumise->lang('No category'),
			'90'=> $lumise->lang('Categories'),
			'91'=> $lumise->lang('Design templates'),
			'92'=> $lumise->lang('Search design templates'),
			'93'=> $lumise->lang('Select design'),
			'94'=> $lumise->lang('Load more'),
			'95'=> $lumise->lang('Remove template'),
			'96'=> $lumise->lang('Error! Your design is empty, please add the objects'),
			'97'=> $lumise->lang('Can not updated'),
			'98'=> $lumise->lang('Are you sure that you want to remove this stage?'),
			'99'=> $lumise->lang('Please select one of print method.'),
			'100'=> $lumise->lang('Free'),
			'101'=> $lumise->lang('Are you sure that you want to clear design?'),
			'102'=> $lumise->lang('This field is required.'),
			'103'=> $lumise->lang('Enter at least the minimum 1 quantity.'),
			'104'=> $lumise->lang('Price'),
			'105'=> $lumise->lang('Tags:'),
			'106'=> $lumise->lang('Overwrite this design'),
			'107'=> $lumise->lang('New Design'),
			'108'=> $lumise->lang('Select an item bellow to save your design'),
			'109'=> $lumise->lang('Your design has been saved successful!'),
			'110'=> $lumise->lang('Draft was saved'),
			'111'=> $lumise->lang('Load draft'),
			'112'=> $lumise->lang('Load the draft designs which was saved before'),
			'113'=> $lumise->lang('Successful! Your next changes will be updated to draft automatically'),
			'114'=> $lumise->lang('Reset to default design'),
			'115'=> $lumise->lang('You are editting an item from your shopping cart'),
			'116'=> $lumise->lang('Your cart item was changed'),
			'117'=> $lumise->lang('Save now'),
			'118'=> $lumise->lang('Your cart item has been updated successful'),
			'119'=> $lumise->lang('A cart item is being edited. Do you want to change product for starting new design?'),
			'120'=> $lumise->lang('Error: Cart item not found'),
			'121'=> $lumise->lang('Are you sure to delete this item?'),
			'122'=> $lumise->lang('You are viewing the design of the order'),
			'123'=> $lumise->lang('Error, could not load the design file of this order'),
			'124'=> $lumise->lang('Yes, Start New'),
			'125'=> $lumise->lang('No, Update Current'),
			'126'=> $lumise->lang('Attribute name exists, please enter new name.'),
			'127'=> $lumise->lang('Warning: Please fix issues on attributes marked as red before submit.'),
			'128'=> $lumise->lang('Owhh, Please slow down. You seem to be sharing too much, waiting a few more minutes to continue'),
			'129'=> $lumise->lang('Oops, no item found'),
			'130'=> $lumise->lang('Copy link'),
			'131'=> $lumise->lang('Open link'),
			'132'=> $lumise->lang('Delete link'),
			'133'=> $lumise->lang('Are you sure that you want to delete this link?'),
			'134'=> $lumise->lang('There is no more item'),
			'135'=> $lumise->lang('The link has been copied successfully'),
			'136'=> $lumise->lang('The share link has been loaded successfully'),
			'137'=> $lumise->lang('Less'),
			'138'=> $lumise->lang('Advanced SVG Editor'),
			'139'=> $lumise->lang('Colors Manage'),
			'140'=> $lumise->lang('Add to list'),
			'141'=> $lumise->lang('Select all'),
			'142'=> $lumise->lang('Unselect all'),
			'143'=> $lumise->lang('List of your colors'),
			'144'=> $lumise->lang('No item found, please add new color to your list'),
			'145'=> $lumise->lang('Add new color'),
			'146'=> $lumise->lang('Delete selection'),
			'147'=> $lumise->lang('The size of images you upload is invalid, your upload size is'),
			'148'=> $lumise->lang('Your file upload is not allowed, please upload image files only'),
			'149'=> $lumise->lang('Your total quantity is smaller the min quantity'),
			'150'=> $lumise->lang('Your total quantity is larger the max quantity'),
			'151'=> $lumise->lang('Enter the new label'),
			'152'=> $lumise->lang('Enter number of color'),
			'153'=> $lumise->lang('Add more column'),
			'154'=> $lumise->lang('Reduce  column'),
			'155'=> $lumise->lang('Enter the label'),
			'156'=> $lumise->lang('Average'),
			'157'=> $lumise->lang('item'),
			'158'=> $lumise->lang('Click or drag to add shape'),
			'159'=> $lumise->lang('Upload completed, please wait for a moment'),
			'160'=> $lumise->lang('Failure to add: The minimum dimensions requirement'),
			'_front' => $lumise->lang($lumise->cfg->settings['label_stage_1']),
        	'_back' => $lumise->lang($lumise->cfg->settings['label_stage_2']),
        	'_left' => $lumise->lang($lumise->cfg->settings['label_stage_3']),
        	'_right' => $lumise->lang($lumise->cfg->settings['label_stage_4']),
	    );

	    $this->default_fonts = $lumise->cfg->settings['google_fonts'];

    }

}
