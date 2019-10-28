<?php
/**
*
*	(p) package: lumise
*	(c) author:	King-Theme
*	(i) website: https://www.lumise.com
*
*/

require_once('lib.php');

/*=============================*/
class lumise_ajax extends lumise_lib {

	private $actions = array(
		'extend',
		'templates',
		'cliparts',
		'shapes',
		'new_language',
		'switch_status',
		'duplicate_item',
		'add_tags',
		'remove_tags',
		'lumise_set_price',
		'change_lang',
		'edit_language_text',
		'categories',
		'add_clipart',
		'list_products',
		'upload_share_design',
		'get_shares',
		'get_rss',
		'list_colors',
		'delete_link_share',
		'print_detail',
		'upload',
		'report_bug'
	);
	private $action;
	private $nonce;
	protected $aid;

	public function __construct() {

		global $lumise, $lumise_woocommerce;
		
		$this->action = isset($_POST['action']) ? htmlspecialchars($_POST['action']) : '';
		$this->nonce = isset($_POST['nonce']) ? explode(":", htmlspecialchars($_POST['nonce'])) : array('', '');
		
		if (isset($_FILES['file'])) {
			$this->action = isset($_REQUEST['action']) ? htmlspecialchars($_REQUEST['action']) : '';
			$this->nonce = isset($_REQUEST['nonce']) ? explode(":", htmlspecialchars($_REQUEST['nonce'])) : array('', '');
		}
		
		if ($lumise->cfg->settings['report_bugs'] == 1 || $lumise->cfg->settings['report_bugs'] == 2)
			array_push($this->actions, 'send_bug');
		
		// Call to actions
		
		if (
			empty($this->action) ||
			empty($this->nonce) ||
			!in_array($this->action, $this->actions) ||
			!method_exists($this, $this->action)
		) {
			return header('HTTP/1.0 403 Forbidden');
		}

		$this->main = $lumise;

		if ($this->action == 'extend')
			return $this->extend();
			
		$this->aid = str_replace("'", "", $lumise->connector->cookie('lumise-AID'));

		if (lumise_secure::check_nonce($this->nonce[0], $this->nonce[1])) {
			header('HTTP/1.0 200');
			call_user_func_array(array(&$this, $this->action), array());
		} else return header('HTTP/1.0 403 Forbidden');
		
	}

	public function extend() {

		$name = isset($_POST['name']) ? htmlspecialchars($_POST['name']) : '';
		$nonce = isset($_POST['nonce']) ? htmlspecialchars($_POST['nonce']) : '';

		if (empty($name) || empty($nonce) || !lumise_secure::nonce_exist($name, $nonce)) {
			echo '-1';
			exit;
		}else{
			echo lumise_secure::create_nonce($name);
			exit;
		}

	}

	public function templates() {
		
		$this->x_items('templates');

	}
	
	public function cliparts() {
		
		$this->x_items('cliparts');
		
	}
		
	public function x_items($type = 'cliparts') {

		global $lumise;

		$category = htmlspecialchars(isset($_POST['category']) ? $_POST['category'] : 0);
		$index = htmlspecialchars(isset($_POST['index']) ? $_POST['index'] : 0);
		$q = htmlspecialchars(isset($_POST['q']) ? $_POST['q'] : '');
		$cate_name = '';
		
		$categories = $this->get_categories($type, $category, '`order` DESC, `name` ASC', true);
		$parents = $this->get_category_parents($category);
		
		$query = sprintf(
			"SELECT `parent`, `name` FROM `%s` WHERE `id`='%d'",
            $this->sql_esc($lumise->db->prefix."categories"),
           $category
        );
		
		$get_cate = $lumise->db->rawQueryOne($query);
		if ($category !== 0 && count($categories) === 0 && isset($get_cate['parent'])) {
			$categories = $this->get_categories($type, $get_cate['parent'],'`order` DESC, `name` ASC', true);
		}
		
		$end = false;
		foreach ($categories as $cta) {
			if ($cta['id'] == $category)
				$end = true;
		}
		
		if ($category == 0 || ($end === true && count($parents) === 1)) {
			/*if ($type == 'cliparts') {*/
			array_unshift($categories,array(
				"id" => "{free}",
				"name" => $lumise->lang('Free items'),
				"thumbnail" => $lumise->cfg->assets_url.'assets/images/free_thumbn.jpg'
			));
			array_unshift($categories, array(
				"id" => "{featured}",
				"name" => "&star; ".$lumise->lang('Featured'),
				"thumbnail" => $lumise->cfg->assets_url.'assets/images/featured_thumbn.jpg'
			));
		}
		
		if ($category == 0) {
			$parents = array(array(
				"id" => "",
				"name" => $lumise->lang('All categories')
			));
		}
		
		$cate_name = $get_cate['name'];
		
		if ($category == '{featured}') {
			$cate_name = "&star; ".$lumise->lang('Featured');
			$parents = array(array(
				"id" => "{featured}",
				"name" => $cate_name
			));
		}else if ($category == '{free}'){
			$cate_name = $lumise->lang('Free items');
			$parents = array(array(
				"id" => "{free}",
				"name" => $cate_name
			));
		}
		
		foreach ($parents as $key => $val) {
			$parents[$key]['name'] = $lumise->lang($val['name']);
		}
		
		foreach ($categories as $key => $val) {
			$categories[$key]['name'] = $lumise->lang($val['name']);
		}
		
		header('Content-Type: application/json');
		
		$xitems = $this->get_xitems($category, $q, $index, $type);
		
		$items = $xitems[0];
		$total = $xitems[1];
		
		echo json_encode(array(
			"category" => $category,
			"category_name" => $lumise->lang($cate_name),
			"category_parents" => array_reverse($parents),
			"categories" => $categories,
			"categories_full" => (isset($_POST['ajax']) && $_POST['ajax'] == 'backend') ? $this->get_categories('templates') : '',
			"items" => $items,
			"q" => $q,
			"total" => $total,
			"index" => $index,
			"page" => 1,
			"limit" => 50
		));

	}

	public function shapes() {

		$index = htmlspecialchars(isset($_POST['index']) ? $_POST['index'] : 0);
		header('Content-Type: application/json');
		$items = $this->get_shapes($index);
		foreach($items as $ind => $item){
			$items[$ind]['content'] = $this->stripallslashes($item['content']);
		}
		echo json_encode(array(
			"items" => $items,
			"total" => $this->get_shapes('total'),
			"index" => $index,
			"limit" => 20
		));

	}

	public function new_language() {

		$code = $_POST['code'];
		$langs = $this->main->langs();

		if (!isset($code) || !isset($langs[$code])) {
			echo -1;
			exit;
		}

		$scan = $this->scan_languages();

		foreach ($scan as $key => $val) {

			$exist = $this->main->db->rawQueryOne("SELECT `id` as `text` FROM `{$this->main->db->prefix}languages` WHERE `lang`= ? && `original_text`= ? ", array($code, $val));
			if (count($exist) === 0) {
				$this->main->db->insert("languages", array(
					"text" => $val,
					"original_text" => $val,
					"lang" => $code,
					"created" => date("Y-m-d").' '.date("H:i:s"),
					"updated" => date("Y-m-d").' '.date("H:i:s"),
				));
			}
		}
		
		$this->main->connector->set_session('language_lang', $code);

		echo '1';
		exit;

	}

	public function edit_language_text() {

		$id = $_POST['id'];
		$text = $_POST['text'];

		$this->main->db->where ("id='$id'")->update('languages', array(
			'text' => $text,
			'updated' => date("Y-m-d").' '.date("H:i:s")
		));

		header('Content-Type: application/json');
		echo json_encode(array(
			"id" => $id,
			"text" => stripslashes($text)
		));

	}

	public function change_lang() {

		$code = $_POST['code'];
		$this->main->set_lang($code);
		$this->main->do_action('change_language', $code);

		die('1');

	}

	public function list_products() {

		$data = $this->get_products(true);

		header('Content-Type: application/json');
		echo json_encode($data);

	}

	public function categories() {

		$post = $_POST['data'];

		if (isset($post) && !empty($post)) {

			$data = array(
				'name' => $post['name'],
				'parent' => $post['parent'],
				'type' => $post['type'],
				'updated' => date("Y-m-d").' '.date("H:i:s"),
				'created'=> date("Y-m-d").' '.date("H:i:s")
			);

			if (!empty($post['upload'])) {
				
				$path = 'thumbnails'.DS;
				$check = $this->main->check_upload();

				$process = $this->upload_file($post['upload'], $path);

				if (!isset($process['error']) && isset($process['thumbn']))
					$data['thumbnail'] = $process['thumbn'];

				@unlink($this->main->cfg->upload_path.$path.$process['name']);

			}

			$this->main->db->insert ('categories', $data);

		}
		
		$type = $this->esc('type');
		$cates = $this->get_categories($type);
		header('Content-Type: application/json');

		echo json_encode($this->get_categories());

	}

	public function add_clipart() {

		$post = @json_decode(stripslashes($_POST['data']));

		if ($post == null) {

			header('Content-Type: application/json');
			echo json_encode(array(
				"error" => 'Data struction',
				"name" => $data['name']
			));

			exit;
		}

		$data = array(
			'name' => $post->name,
			'price' => (int)$post->price,
			'featured' => $post->featured,
			'active' => 1,
			'updated' => date("Y-m-d").' '.date("H:i:s"),
			'created'=> date("Y-m-d").' '.date("H:i:s")
		);

		$time = time();
		$path = 'cliparts'.DS.date('Y', $time).DS.date('m', $time).DS;

		$check = $this->main->check_upload($time);

		if ($check !== 1) {

			header('Content-Type: application/json');
			echo json_encode(array(
				"error" => $this->main->lang('The system does not have permission to write files in the upload folder: ').$lumise->upload_path,
				"name" => $data['name']
			));

			exit;

		}else{

			$process = $this->upload_file($post->upload, $path);

			if (isset($process['error'])) {

				header('Content-Type: application/json');
				echo json_encode(array(
					"error" => $process['error'],
					"name" => $data['name']
				));
				exit;

			}else{

				$data['upload'] = $path.$process['name'];

				if (isset($process['thumbn'])) {
					$data['thumbnail_url'] = $this->main->cfg->upload_url.str_replace(DS, '/', $path.$process['thumbn']);
				}

			}

		}

		$clipart_id = $this->main->db->insert ('cliparts', $data);

		if ($clipart_id) {

			if (isset($post->cates) && count($post->cates) > 0) {
				foreach($post->cates as $cate) {
					$this->main->db->insert ('categories_reference', array(
						"category_id" => $cate,
						"item_id" => $clipart_id,
						"type" => "cliparts"
					));
				}
			}

			if (isset($post->tags) && count($post->tags) > 0) {
				foreach($post->tags as $tag) {

					$check = $this->main->db->rawQuery ("SELECT `id` FROM `{$this->main->db->prefix}tags` WHERE `slug`='".$this->slugify($tag)."'");

					if (count($check) > 0) {
						$this->main->db->insert ('tags_reference', array(
							"tag_id" => $check[0]['id'],
							"item_id" => $clipart_id,
							"type" => "cliparts"
						));
					}else{

						$tag_id = $this->main->db->insert ('tags', array(
							"name" => trim($tag),
							"slug" => $this->slugify($tag),
							"type" => "cliparts",
							'updated' => date("Y-m-d").' '.date("H:i:s"),
							'created'=> date("Y-m-d").' '.date("H:i:s")
						));

						$this->main->db->insert ('tags_reference', array(
							"tag_id" => $tag_id,
							"item_id" => $clipart_id,
							"type" => "cliparts"
						));
					}
				}
			}

		}

		header('Content-Type: application/json');
		echo json_encode(array("success" => $clipart_id));
		exit;

	}

	public function switch_status() {

		$post = $_POST;
		$data = array();
		
		$cap = 'lumise_edit_'.$post['data']['type'].'-s';
		$cap = str_replace(array('s-s', '-s'), array('s', 's'), $cap);
		
		if (!$this->main->caps($cap)) {
			echo json_encode(array(
				"status" => 'error',
				"action" => $post['data']['action'],
				"value" => $this->main->lang('Sorry, you are not allowed to do this action')
			));
			exit;
		}
		
		if ($post['data']['status'] == 0)
			$post['data']['status'] = 1;
		else
			$post['data']['status'] = 0;

		if ($post['data']['action'] == 'switch_feature')
			$data['featured'] = $post['data']['status'];
		else
			$data['active'] = $post['data']['status'];

		$id = $this->edit_row( $post['data']['id'], $data, $post['data']['type'] );

		if (isset($id) && $id == true )
			$val['status'] = 'success';
		else
			$val['status'] = 'error';

		echo json_encode(array(
			"status" => $val['status'],
			"action" => $post['data']['action'],
			"value" => $post['data']['status']
		));

	}

	public function duplicate_item() {

		global $lumise;
		$post = $_POST;
		$data = array();
		
		$cap = 'lumise_edit_'.$post['data']['table'].'-s';
		$cap = str_replace(array('s-s', '-s'), array('s', 's'), $cap);
		
		if (!$this->main->caps($cap)) {
			echo json_encode(array(
				"status" => 'error',
				"action" => $post['data']['duplicate'],
				"value" => $this->main->lang('Sorry, you are not allowed to do this action')
			));
			exit;
		}
		
		$data = $this->get_row_id($post['data']['id'], $post['data']['table']);
		
		if (isset($data['name']))
			$data['name'] = $data['name'].'(Copy)';
		
		if (isset($data['title']))
			$data['title'] = $data['title'].'(Copy)';

		if ($data['created'])
			$data['created'] = date("Y-m-d").' '.date("H:i:s");

		if ($data['updated'])
			$data['updated'] = '';

		if ($data['id'])
			unset($data['id']);

		$id = $this->add_row($data, $post['data']['table']);

		$data = array();

		$data = $this->get_row_id($id, $post['data']['table']);

		if (isset($data['name']))
			$data['url'] = $lumise->cfg->admin_url.'lumise-page=product&id='.$data['id'];

		if (isset($data['title'])){
			$data['name'] = $data['title'];
			$data['url'] = $lumise->cfg->admin_url.'lumise-page=printing&id='.$data['id'];
		}

		if (count($data) > 0)
			$val['status'] = 'success';
		else
			$val['status'] = 'error';

		echo json_encode(array(
			"status" => $val['status'],
			"data" => $data
		));

	}

	public function add_tags() {

		$post = $_POST;
		$arr = array('id', 'name', 'type');
		$tags = $this->get_rows_custom($arr, 'tags', $orderby = 'name', $order='asc');
		$flag = false;

		foreach ($tags as $key => $value) {
			
			if ($value['name'] == $post['data']['value'] && $value['type'] == $post['data']['type']){
				$id = $value['id'];
				$flag = true;
				break;
			}
		}

		if (!$flag) {
			
			$data = array();
			$data['name'] = $post['data']['value'];
			$data['type'] = $post['data']['type'];
			$data['created'] = date("Y-m-d").' '.date("H:i:s");

			$data_slug = array();
			$data['slug'] = $this->slugify($data['name']);
			$val = $this->get_rows_custom(array('slug', 'type'), 'tags');

			foreach ($val as $key => $value) {
				if ($value['type'] == $data['type']) {
					$data_slug[] = $value['slug'];
				}
			}
			if (in_array($data['slug'], $data_slug))
				$data['slug'] = $this->add_count($data['slug'], $data_slug);

			$id = $this->add_row( $data, 'tags' );

		}

		if (isset($id)){

			$val['status'] = 'success';
			$tags = $this->get_tag_item($post['data']['id'], $post['data']['type']);
			$flag = false;
			
			foreach ($tags as $key => $value) {
				if ($value['id'] == $id){
					$flag = true;
					break;
				}
			}

			if (!$flag) {
				$data = array();
				$data['tag_id'] = $id;
				$data['item_id'] = $post['data']['id'];
				$data['type'] = $post['data']['type'];
				$id = $this->add_row( $data, 'tags_reference' );
			}

			if (isset($id) && $id == true)
				$val['status'] = 'success';
			else
				$val['status'] = 'error';	

		} else {
			$val['status'] = 'error';
		}

		echo json_encode(array(
			"status" => $val['status'],
			"value" => $post['data']['value']
		));

	}

	public function remove_tags() {

		$post = $_POST;
		$tags = $this->get_tag_item($post['data']['id'], $post['data']['type']);
		
		foreach ($tags as $key => $value) {
			if ($value['name'] == $post['data']['value']) {
				$id = $value['id'];
				break;
			}
		}

		$arr = array('id', 'tag_id', 'item_id', 'type');
		$tags = $this->get_rows_custom($arr, 'tags_reference', $orderby = 'id', $order='asc');

		if (isset($id)){
			foreach ($tags as $key => $value) {
				if ($value['tag_id'] == $id && $value['item_id'] == $post['data']['id'] && $value['type'] == $post['data']['type'])
					$this->delete_row($value['id'], 'tags_reference');
			}
			$val['status'] = 'success';
		} else{
			$val['status'] = 'error';
		}

		echo json_encode(array(
			"status" => $val['status'],
			"value" => $post['data']['value']
		));

	}

	public function lumise_set_price() {

		$post = $_POST;
		$data = array();

		if ($post['data']['value'] == '')
			$post['data']['value'] = 0;

		if ($post['data']['type'] == 'templates')
			$data['price'] = $post['data']['value'];
			
		if ($post['data']['type'] == 'cliparts')
			$data['price'] = $post['data']['value'];
		
		$data['updated'] = date("Y-m-d").' '.date("H:i:s");
		$id = $this->edit_row( $post['data']['id'], $data, $post['data']['type'] );

		if (isset($id))
			$val['status'] = 'success';
	    else
			$val['status'] = 'error';

		echo json_encode(array( 
			"status" => $val['status'],
			"value" => $post['data']['value']
		));

	}
	
	public function upload_share_design() {
		
		@ini_set('memory_limit','5000M');
		
		$hist = $this->main->connector->get_session('share-design');
		
		if ($hist === null)
			$hist = 0;
		
		if (!isset($_POST['aid']) || $_POST['aid'] != $this->main->connector->cookie('lumise-AID')) {
			echo json_encode(array( 
				"success" => 0,
				"message" => $this->main->lang('Error, user is not authenticated')
			));
			exit;
		}
		
		if ($hist >= 50) {
			echo json_encode(array( 
				"success" => 0,
				"message" => $this->main->lang('Error, has exceeded the allowable limit')
			));
			exit;
		}
		
		if ($this->main->connector->is_admin() || $this->main->cfg->settings['share'] == '1') {
			
			$this->main->connector->set_session('share-design', $hist+1);
			
			$id = base_convert(microtime(true), 10, 36);
			
			$check = $this->main->check_upload(time());
			
			if ($check !== 1) {
				echo json_encode(array( 
					"success" => 0,
					"message" => $this->main->lang('Error, could not write files on the server')
				));
				exit;
			}
			
			$path = $this->main->cfg->upload_path.'shares'.DS.date('Y').DS.date('m').DS;
			$screenshot = urldecode(base64_decode($_POST['screenshot']));
			$screenshot = explode(',', $screenshot);
			
			if (
				file_put_contents($path.$id.'.jpg', base64_decode($screenshot[1])) &&
				file_put_contents($path.$id.'.lumi', urldecode(base64_decode($_POST['data'])))
			) {
			
				$insert = $this->main->db->insert('shares', array(
					'name' => $this->main->lib->esc('label'),
					'aid' => $this->main->lib->esc('aid'),
					'share_id' => $id,
					'product' => intval($this->main->lib->esc('product')),
					'product_cms' => intval($this->main->lib->esc('product_cms')),
					'view' => 0,
					'active' => 1,
					'created' => date("Y-m-d").' '.date("H:i:s")
				));
				
				if ($insert) {
					$result = json_encode(array(
						"success" => 1,
						"id" => $id,
						"product" => $this->main->lib->esc('product'),
						"product_cms" => $this->main->lib->esc('product_cms'),
						"path" => date('Y/m'),
						"aid" => $this->main->lib->esc('aid'),
						"name" => $this->main->lib->esc('label'),
						"created" => time()
					));
				}else{
					$result = json_encode(array(
						"success" => 0,
						"message" => $this->main->lang('Error, could not create the link share')
					));
				}
			
			} else {
				$result = json_encode(array(
					"success" => 0,
					"message" => $this->main->lang('Error, could not upload design to create link')
				));
			}
			
		}else{
			$result = json_encode(array( 
				"success" => 0,
				"message" => $this->main->lang('Error, this feature has been disabled by admin')
			));
		}
		
		echo $result; exit;
		
	}
	
	public function get_shares() {
		
		$aid = $this->main->connector->cookie('lumise-AID');
		$index = $this->main->lib->esc('index');
		
		if (empty($index))
			$index = 0;
		
		if (empty($aid) || $aid == '*') {
			$result = json_encode(array( 
				"success" => 0,
				"result" => array()
			));
		}else{
			
			$data = $this->getShares($index);
			
			$result = json_encode(array( 
				"success" => 1,
				"result" => $data[0],
				"total" => $data[1],
				"per_page" => 20,
				"index" => $index+count($data[0])
			));
		}
		
		echo $result; 
		exit;
		
	}
	
	public function get_rss() {
		
		$url = $this->main->cfg->api_url."news/php.rss.xml";

		$rss = @simplexml_load_file($url);

		if ($rss) {

			$count = count($rss->channel->item);
			$html = '';

			for ($i = 0; $i < $count; $i++) {

				$item = $rss->channel->item[$i];
				$title = $item->title;
				$link = $item->link;
				$cate = $item->cate;
				$time = $item->time;
				$thumb = $item->thumb;
				$description = $item->description;
				$html .= '<div class="lumise_wrap"><figure><img src="'.$thumb.'"></figure>';
				$html .= '<div class="lumise_right"><a href="'.$link.'" target="_blank">'.$title.'</a>';
				$html .= '<div class="lumise_meta"><span><i class="fa fa-folder-o" aria-hidden="true"></i>'.$cate.'</span><span><i class="fa fa-clock-o" aria-hidden="true"></i>'.$time.'</span></div>';
				$html .= '<p>'.$description.'</p></div></div>';

			}

			echo $html;
			
		} else {
			echo '<p>'.$this->main->lang('Could not load RSS feed').'</p>';
		}
			
		exit;
		
	}
		
	public function list_colors() {
		
		if (isset($_POST['save_action'])) {
			echo $this->main->set_option('colors_manage', $_POST['save_action']);
			exit;
		}
		
		$colors = $this->main->get_option('colors_manage');
		
		echo $colors;
		exit;
		
	}
		
	public function delete_link_share() {
		
		$aid = $this->main->connector->cookie('lumise-AID');
		$id = $this->main->lib->esc('id');
		$post_aid = $this->main->lib->esc('aid');
		
		if ($aid != $post_aid) {
			$result = array( 
				"success" => 0,
				"message" => $this->main->lang('Error Unauthorized 1: Could not delete the link')
			);
		}else{
			
			$data = $this->get_share($id);
			
			if ($data == null || $data['aid'] != $aid) {
				$result = array( 
					"success" => 0,
					"message" => $this->main->lang('Error Unauthorized 2: Could not delete the link')
				);
			}else{
				
				$path = $this->main->cfg->upload_path;
				$path .= 'shares'.DS.date('Y', strtotime($data['created'])).DS.date('m', strtotime($data['created'])).DS;
				
				@unlink($path.$data['share_id'].'.jpg');
				@unlink($path.$data['share_id'].'.lumi');
				
				$this->main->db->where('share_id', $id);
				$this->main->db->delete('shares');
				
				$result = array( 
					"success" => 1
				);
			}
		}
		
		echo json_encode($result); 
		exit;
		
	}
	
	public function print_detail() {
		
		$id = $this->esc('id');
		
		$db = $this->main->get_db();
		$db->where('id='.$id);

        $print = $db->get('printings');
        
        $print[0]['calculate'] = $this->main->lib->dejson($print[0]['calculate']);
        
        $return = array();
        $return['description'] = $print[0]['description'];
        
        if ($print[0]['calculate']->show_detail != '0')
        	$return['calculate'] = $print[0]['calculate'];
        
        echo json_encode($return);
        exit;
	}
	
	public function upload() {
		
		$check = $this->main->check_upload();
		
		if ($check !== 1) {
			echo '{"error": "'.$check.'"}';
			exit;
		}
		
		$p = $this->main->cfg->upload_path.'user_data'.DS;
		$f = base_convert(rand(10000000, 100000000), 10, 36).'.txt';
		$m = move_uploaded_file($_FILES["file"]["tmp_name"], $p.$f);
		
		if ($m)
			echo '{"success": "'.$f.'"}';
		else echo '{"error": "could not upload"}';
		
		exit;
		
	}
	
	public function send_bug() {
		
		$hist = $this->main->connector->get_session('bug-reporting');
		
		if ($hist === null)
			$hist = 0;
		
		if ($hist >= 10) {
			echo json_encode(array( 
				"success" => 0,
				"message" => $this->main->lang('Error, has exceeded the allowable limit')
			));
			exit;
		}
		
		$this->main->connector->set_session('bug-reporting', $hist+1);
		
		$id = $this->main->db->insert('bugs', array(
			'content' => substr(urldecode(base64_decode($_POST['content'])), 0, 1500),
			'status' => 'new',
			'lumise' => 0,
			'created' => date("Y-m-d").' '.date("H:i:s"),
			'updated' => date("Y-m-d").' '.date("H:i:s")
		));
		
		if ($this->main->cfg->settings['report_bugs'] == 2)
			$this->report_bug_lumise($id);
		
		echo json_encode(array(
			"success" => 1
		));
		
	}
	
	public function report_bug() {
		echo $this->report_bug_lumise($_POST['id']) ? 'Success' : 'Fail';
	}

}
/*----------------------*/
new lumise_ajax();
/*----------------------*/
