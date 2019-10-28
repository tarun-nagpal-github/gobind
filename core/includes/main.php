<?php
/**
*
*	(p) package: lumise
*	(c) author:	King-Theme
*	(i) website: https://www.lumise.com
*
*/

if (!defined('DS'))
	define('DS', DIRECTORY_SEPARATOR);

define('LUMISE', '1.6.1');

class lumise {

	protected $db;
	protected $views;
	protected $update;
	protected $lib;
	protected $cfg;
	protected $connector;
	protected $actions = array();
	protected $filters = array();
	protected $app = true;
	protected $router = '';

	public function __construct() {
		
		define('LUMISE_CORE_PATH', dirname(__FILE__));
		
		require_once( LUMISE_CORE_PATH . DS. 'config.php' );
		require_once( LUMISE_CORE_PATH . DS. 'lib.php' );
		require_once( LUMISE_CORE_PATH . DS. 'views.php' );
	}

	public function init(){

		$this->connector = new lumise_connector();
		$this->cfg = new lumise_cfg($this->connector);
		
		if (
			property_exists($this->cfg, 'database') &&
			$this->cfg->database !== null &&
			is_array($this->cfg->database)
		) {
			$parse_host = explode(':', $this->cfg->database['host']);
			$this->db = new MysqliDb (
				$parse_host[0],
				$this->cfg->database['user'],
				$this->cfg->database['pass'],
				$this->cfg->database['name'],
				isset($parse_host[1])? $parse_host[1] : '3306'
			);
			
			$this->db->prefix = isset($this->cfg->database['prefix']) ? $this->cfg->database['prefix'] : 'lumise_';

		}
		
		require_once(LUMISE_CORE_PATH.DS.'actions.php');
		require_once(LUMISE_CORE_PATH.DS.'update.php');
		
		$this->views = new lumise_views($this);
		$this->lib = new lumise_lib($this);
		$this->router = $this->esc('lumise-router');
		$this->update = new lumise_update();
		
		if(!empty($this->router) && $this->router == 'admin') 
			define('LUMISE_ADMIN', true);
		
		if (is_callable(array(&$this->connector, 'capabilities')))
			$this->add_filter('capabilities', array(&$this->connector, 'capabilities'));
		
		$this->cfg->init();
		
		$this->router();

	}

	public function __get( $name ) {
        if ( isset( $this->{$name} ) ) {
            return $this->{$name};
        } else {
            throw new Exception( "Call to nonexistent '$name' property of MyClass class" );
            return false;
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

	public function esc($name = '', $default = '') {
		return htmlspecialchars(isset($_GET[$name]) ? $_GET[$name] : $default);
	}

	static function globe(){
		global $lumise;
		return $lumise;
	}

	public function lang($s) {
		return isset($this->cfg->lang_storage[strtolower($s)]) ?
			   str_replace("'", "&#39;", stripslashes($this->cfg->lang_storage[strtolower($s)])) : $s;
	}

	public function get_cfg() {
		return $this->cfg;
	}
	
	public function router() {
		
		$routers = array(
			'cart' => '..'.DS.'cart.php',
			'ajax' => 'ajax.php',
			'admin' => '..'.DS.'admin'.DS.'index.php'
		);
		
		if (isset($routers[$this->router]) && is_file(dirname(__FILE__).DS.$routers[$this->router])) {
			require_once(dirname(__FILE__).DS.$routers[$this->router]);
			$this->app = false;
		}
		
	}
	
	public function is_app(){
		return $this->app;
	}
	
	public function get_fonts() {

		return $this->db->rawQuery("SELECT `name`, `upload` FROM `{$this->db->prefix}fonts` WHERE `active` = 1");

	}

	private function install() {

	}

	public function get_db() {
		return $this->db;
	}

	public function redirect($url, $use_header = false) {

		if (empty($url))
			return;
		if($this->connector->platform == 'php' || $use_header)
			@header("location: " . $url);
		else
			echo '<script type="text/javascript">window.location = "'.htmlspecialchars_decode($url).'";</script>';
		exit();

	}

	public function securityFrom() {

		echo '<input type="hidden" value="' . $this->cfg->security_code . '" name="' . $this->cfg->security_name . '"/>';
	}

	public function display($view = '') {

		if (is_callable(array(&$this->views, $view))) {
			call_user_func_array(array(&$this->views, $view), array());
		}

	}

	public function check_upload ($time = '') {

		if (empty($this->cfg->upload_path))
			return $this->lang('The upload folder is not defined, please report to the administrator');
		if (!is_dir($this->cfg->upload_path) && !mkdir($this->cfg->upload_path, 0755))
			return $this->lang('Could not create upload folder, please report to the administrator').': '.$this->cfg->upload_path;
		if (!is_writable($this->cfg->upload_path))
			return $this->lang('The upload folder write permission denied, please report to the administrator').': '.$this->cfg->upload_path;

		$args = array('settings', 'cliparts', 'templates', 'products', 'thumbnails', 'user_uploads', 'fonts', 'orders', 'designs', 'shares', 'printings', 'user_data');

		if ($time !== '') {

			$time = (float)$time;
			date_default_timezone_set('UTC');
			
			$y = DS.date('Y', $time);
			$ym = $y.DS.date('m', $time);
			
			foreach(array('user_uploads', 'cliparts', 'templates', 'shares') as $p) {
				array_push($args, $p.$y);
				array_push($args, $p.$ym);
			}

		}

		$index = '<html xmlns="http://www.w3.org/1999/xhtml"><head>\
					<meta http-equiv="refresh" content="0;URL=\'https://lumise.com/?client=folder-protect\'" />\
				  </head><body></body></html>';

		foreach ($args as $arg) {
			if (!is_dir($this->cfg->upload_path.$arg) && !mkdir($this->cfg->upload_path.$arg, 0755)) {
				return $this->lang('Could not create sub folder upload, please report to the administrator').': '.$this->cfg->upload_path.$arg;
			}else if(!file_exists($this->cfg->upload_path.$arg.DS.'index.html'))
				@file_put_contents($this->cfg->upload_path.$arg.DS.'index.html', $index);
		}

		return 1;

	}

	public function generate_id() {

		$id = rand(4354657, 2147483647);
		$id = base_convert($id, 10, 36);
		$id = preg_replace('/[0-9]+/', '', $id);

		return $id;

	}

	public function get_langs() {

		$langs = $this->db->rawQuery("SELECT `lang` as `code` FROM `{$this->db->prefix}languages` GROUP BY `lang`");
		$result = array();

		if (count($langs) > 0) {
			foreach ($langs as $lang) {
				array_push($result, $lang['code']);
			}
		}

		return $result;

	}

	public function langs () {

		return array(
			"af" => "Afrikaans",
			"sq" => "Albanian",
			"am" => "Amharic",
			"ar" => "Arabic",
			"hy" => "Armenian",
			"az" => "Azerbaijani",
			"eu" => "Basque",
			"be" => "Belarusian",
			"bn" => "Bengali",
			"bs" => "Bosnian",
			"bg" => "Bulgarian",
			"ca" => "Catalan",
			"ceb" => "Cebuano",
			"ny" => "Chichewa",
			"zh-CN" => "Chinese",
			"co" => "Corsican",
			"hr" => "Croatian",
			"cs" => "Czech",
			"da" => "Danish",
			"nl" => "Dutch",
			"en" => "English",
			"eo" => "Esperanto",
			"et" => "Estonian",
			"tl" => "Filipino",
			"fi" => "Finnish",
			"fr" => "French",
			"fy" => "Frisian",
			"gl" => "Galician",
			"ka" => "Georgian",
			"de" => "German",
			"el" => "Greek",
			"gu" => "Gujarati",
			"ht" => "Haitian Creole",
			"ha" => "Hausa",
			"haw" => "Hawaiian",
			"iw" => "Hebrew",
			"hi" => "Hindi",
			"hmn" => "Hmong",
			"hu" => "Hungarian",
			"is" => "Icelandic",
			"ig" => "Igbo",
			"id" => "Indonesian",
			"ga" => "Irish",
			"it" => "Italian",
			"ja" => "Japanese",
			"jw" => "Javanese",
			"kn" => "Kannada",
			"kk" => "Kazakh",
			"km" => "Khmer",
			"ko" => "Korean",
			"ku" => "Kurdish (Kurmanji)",
			"ky" => "Kyrgyz",
			"lo" => "Lao",
			"la" => "Latin",
			"lv" => "Latvian",
			"lt" => "Lithuanian",
			"lb" => "Luxembourgish",
			"mk" => "Macedonian",
			"mg" => "Malagasy",
			"ms" => "Malay",
			"ml" => "Malayalam",
			"mt" => "Maltese",
			"mi" => "Maori",
			"mr" => "Marathi",
			"mn" => "Mongolian",
			"my" => "Myanmar (Burmese)",
			"ne" => "Nepali",
			"no" => "Norwegian",
			"ps" => "Pashto",
			"fa" => "Persian",
			"pl" => "Polish",
			"pt" => "Portuguese",
			"pa" => "Punjabi",
			"ro" => "Romanian",
			"ru" => "Russian",
			"sm" => "Samoan",
			"gd" => "Scots Gaelic",
			"sr" => "Serbian",
			"st" => "Sesotho",
			"sn" => "Shona",
			"sd" => "Sindhi",
			"si" => "Sinhala",
			"sk" => "Slovak",
			"sl" => "Slovenian",
			"so" => "Somali",
			"es" => "Spanish",
			"su" => "Sundanese",
			"sw" => "Swahili",
			"sv" => "Swedish",
			"tg" => "Tajik",
			"ta" => "Tamil",
			"te" => "Telugu",
			"th" => "Thai",
			"tr" => "Turkish",
			"uk" => "Ukrainian",
			"ur" => "Urdu",
			"uz" => "Uzbek",
			"vi" => "Vietnamese",
			"cy" => "Welsh",
			"xh" => "Xhosa",
			"yi" => "Yiddish",
			"yo" => "Yoruba",
			"zu" => "Zulu"
		);
	}

	public function set_lang($code) {

		$langs = $this->langs();

		if (isset($langs[$code])) {
			$this->cfg->active_language = $code;
			$this->connector->set_session('lumise-active-lang', $code);
		}

	}

	public function get_option($key = '', $default = '') {

		if (empty($key))
			return $default;
		
		$query = sprintf(
			"SELECT `value` FROM `{$this->db->prefix}settings` WHERE `key`='%s'",
            $this->lib->sql_esc($key)
        );
			
		$result = $this->db->rawQuery($query);

		if (isset($result[0]))
			return $result[0]['value'];
		else return $default;

	}

	public function set_option($key = '', $val = '') {

		if (empty($key))
			return 0;

		if (is_array($val) || is_object($val))
			$val = json_encode($val);

		$query = sprintf(
			"SELECT `value` FROM `{$this->db->prefix}settings` WHERE `key`='%s'",
            $this->lib->sql_esc($key)
        );
			
		$result = $this->db->rawQuery($query);
		
		$time = date("Y-m-d").' '.date("H:i:s");

		if (count($result) > 0) {
			$query = sprintf(
				"UPDATE `{$this->db->prefix}settings` SET `value`='%s' WHERE `key`='%s'",
	            $this->lib->sql_esc($val),
	            $this->lib->sql_esc($key)
	        );
	       $this->db->rawQuery($query);
		}else{
			$query = sprintf(
				"INSERT INTO `{$this->db->prefix}settings` (`id`, `key`, `value`, `created`, `updated`) VALUES (NULL, '%s', '%s', '%s', '%s')",
	            $this->lib->sql_esc($key),
	            $this->lib->sql_esc($val),
	            $time,
	            $time
	        );
			$this->db->rawQuery($query);
		}
		
	}

	public function add_action($name = '', $callback = null) {

		if (empty($name) || !is_callable($callback))
			return;

		if (!isset($this->actions[$name]) || !is_array($this->actions[$name]))
			$this->actions[$name] = array();

		array_push($this->actions[$name], $callback);

	}

	public function do_action($name = '', $params = null) {

		if (empty($name) || !isset($this->actions[$name]))
			return;

		foreach ($this->actions[$name] as $action) {
			if (is_callable($action))
				call_user_func($action, $params);
		}

	}

	public function add_filter($name = '', $callback = null) {
		
		if (empty($name) || !is_callable($callback))
			return;
			
		if (!isset($this->filters[$name]) || !is_array($this->filters[$name]))
			$this->filters[$name] = array();

		array_push($this->filters[$name], $callback);

	}
	
	public function apply_filter($name = '', $params = null) {
		
		if (empty($name) || !isset($this->filters[$name]))
			return $params;

		foreach ($this->filters[$name] as $action) {
			if (is_callable($action))
				$params = call_user_func($action, $params);
		}

		return $params;

	}
	
	public function caps($name = '') {
		
		$_ft = $this->apply_filter('capabilities', $name);
		return ((int)$_ft != 0 || $_ft == $name);
		
	}

}

/*----------------------*/
global $lumise;
$lumise = new lumise();
$lumise->init();
/*----------------------*/
