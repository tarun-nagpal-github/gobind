<?php
/**
*
*	(p) package: lumise
*	(c) author:	King-Theme
*	(i) website: https://www.lumise.com
*
*/

class lumise_lib{

	protected $main;
 
	public function __construct($instance) {

		$this->main = $instance;

	}

	public function slugify($text) {

		$text = preg_replace('~[^\pL\d]+~u', '-', $text);
		if(function_exists('iconv')) $text = (@iconv('utf-8', 'us-ascii//TRANSLIT', $text)) ? : $text;
		$text = preg_replace('~[^-\w]+~', '', $text);
		$text = trim($text, '-');
		$text = preg_replace('~-+~', '-', $text);
		$text = strtolower($text);

		if (empty($text)) {
			return '';
		}

		return $text;

	}

	public function sql_esc($str) {
		
		global $lumise;
		
		if (function_exists('mysqli_real_escape_string'))
			return mysqli_real_escape_string($lumise->db->mysqli(), $str);
		else if (function_exists('mysql_real_escape_string'))
			return mysql_real_escape_string($str);
		else return $str;
		
	}

	public function dejson($text = '', $force_array = false) {

		if (!empty($text))
			$data = @json_decode(rawurldecode(base64_decode($text)), $force_array);

		return isset($data) ? $data : array();

	}

	public function enjson($text = '') {

		if (!empty($text))
			$data = base64_encode(rawurlencode(@json_encode($text)));

		return isset($data) ? $data : '';

	}

	public function esc($name = '', $default = '') {
		return isset($_POST[$name]) ? (is_array($_POST[$name])? $_POST[$name] : htmlspecialchars($_POST[$name])) : $default;
	}

	public function check_upload ($time = '') {

		return $this->main->check_upload($time);

	}

	protected function process_upload ($data, $design_id) {

		foreach ($data->stages as $s => $stage) {

			$type = $this->get_type($stage->screenshot);
			if (
				$this->save_image($stage->screenshot, $s.'_'.$design_id) === 1 &&
				$type !== ''
			) {
				$data->stages->{$s}->screenshot = '/thumbnails/'.$s.'_'.$design_id.$type;
			}

			if (isset($data->stages->{$s}->data)) {

				$obj = json_decode($data->stages->{$s}->data);

				if (isset($obj->objects)) {

					for ($i = 0; $i < count($obj->objects); $i++) {

						if (isset($obj->objects[$i]->id) && isset($obj->objects[$i]->src)) {

							$src = $obj->objects[$i]->src;
							$id = $obj->objects[$i]->id;
							$type = $this->get_type($src);

							/*
								Process all objects contain attribute .src
							*/
							if ($type !== '' && $this->save_image($src, $id) === 1) {
								$obj->objects[$i]->src = '/'.$this->get_path($id, '/').$type;
								$this->user_uploads($obj->objects[$i]->src, $design_id);
							}

							/*
								Process mask
							*/

							if (
								isset($obj->objects[$i]->fx) &&
								isset($obj->objects[$i]->fx->mask) &&
								isset($obj->objects[$i]->fx->mask->dataURL)
							) {

								unset($obj->objects[$i]->fx->mask->image);

								$id = explode(':', $id);
								$id = $id[0].':'.$this->create_sid(10);
								$type = $this->get_type($obj->objects[$i]->fx->mask->dataURL);
								$src = $obj->objects[$i]->fx->mask->dataURL;

								if ($type !== '' && $this->save_image($src, $id) === 1)
									$obj->objects[$i]->fx->mask->dataURL = '/'.$this->get_path($id, '/').$type;

							}

						}
					}

				}

				$data->stages->{$s}->data = json_encode($obj);

			}

		}

		return $data;

	}

	protected function save_image ($data, $id) {

		$type = $this->get_type($data);

		if ($type === '')
			return $this->main->lang('Could not save image because invalid type');;

		$path = $this->main->cfg->upload_path.$this->get_path($id, TS).$type;

		$data = explode(';base64,', $data);

		if ($path === -1)
			return -1;
		else if (!file_put_contents($path, base64_decode($data[1])))
			return $this->main->lang('Could not write data on the upload folder, please report to the administrator');
		else return 1;

	}

	protected function get_type($data) {

		if (strpos($data, 'data:image/jpeg;base64,') !== false)
			return '.jpg';
		else if (strpos($data, 'data:image/png;base64,') !== false)
			return '.png';
		else if (strpos($data, 'data:image/gif;base64,') !== false)
			return '.gif';
		else if (strpos($data, 'data:image/svg+xml;base64,') !== false)
			return '.svg';

		return '';

	}

	protected function get_path($id, $sd) {

		if (strpos($id, ':') === false) {
			return 'thumbnails'.$sd.$id;
		}else{
			$id = explode(':', $id);
			$id[0] = base_convert($id[0], 36, 10);
			date_default_timezone_set('UTC');
			$name = date('Y', $id[0]).DS.date('m', $id[0]).DS.$id[1];
			$check = $this->check_upload($id[0]);

			if ($check === 1)
				return 'user_uploads'.DS.$name;
			else return -1;
		}

	}

	protected function get_my_designs ($index = 0, $limit = 20) {

		$aid = str_replace("'", "", $this->main->connector->cookie('lumise-AID'));
		$db = $this->main->get_db();

		return $db->where("aid = '$aid'")->get('designs', $limit);

	}

	protected function user_uploads($src, $design_id){

	}

	protected function do_save_design ($id = 0, $data = '') {

		$aid = $this->main->connector->cookie('lumise-AID');

		if ($data !== '' && $id !== 0) {

			$db = $this->main->db;
			$data = json_decode(urldecode(base64_decode($data)));
			$stk = $this->esc('private_key');

			$check_upload = $this->check_upload($data->updated);
			if ($check_upload !== 1)
				return array('error' => $check_upload);

			global $lumise;

			$db = $lumise->get_db();

			$db->where ("id='$id' AND (aid='$aid' OR share_token='$stk')");

			$check = $db->getOne ('designs');

			$date = @date ("Y-m-d H:i:s"/*, strtotime($date_old)*/);

			if ($check && ($check['aid'] == $aid || $check['share_permission'] == 2)) {

				$check['data'] = json_decode($check['data']);

				if (is_object($check['data']->stages)) {
					foreach($check['data']->stages as $name => $stage) {
						if (!isset($data->stages->{$name}))
							$data->stages->{$name} = $stage;
					}
				}

				$db->where ('id', $id)->update ('designs', array(
					'data' => '',
					'updated' => $date
				));

			}else{

				$share_token = $this->create_sid();

				$id = $db->insert ('designs', array(
					'data' => '',
					'aid' => $aid,
					'created' => $date,
					'updated' => $date,
					'share_token' => $share_token
				));

			}

			$data = $this->process_upload($data, $id);

			$db->where ('id', $id)->update ('designs', array(
				'data' => json_encode($data)
			));

			$result = array(
				'success' => true,
				'id' => $id
			);

		}else {
			$result = array('error' => $this->main->lang('The data is empty'));
		}

		return $result;

	}

	protected function do_delete_design ($id = 0) {

		if ($this->is_own_design($id) === true) {

			$db->where ("id='$id' AND aid='{$this->aid}'");
			$db->delete('designs');

			return array(
				'success' => true,
				'id' => $id
			);
		}else{
			return array(
				'error' => $this->main->lang('You do not have permission to delete.')
			);
		}

	}

	protected function is_own_design ($id = 0) {

		$db = $this->main->get_db();
		$db->where ("id='$id' AND aid='{$this->aid}'");
		$check = $db->getOne ('designs');

		if ($check && isset($check['id']))
			return true;
		else return false;

	}

	protected function create_sid ($l = 20){
		return substr(str_shuffle(implode(array_merge(range('A','Z'), range('a','z'), range(0,9)))), 0, $l);
	}

	protected function children_categories ($id = 0, $list = array()) {

	    if ($id === 0)
	    	return $list;
	    else array_push($list, (int)$id);
		
		$query = sprintf(
			"SELECT `id` FROM `%s` WHERE `parent` = '%d'",
            $this->sql_esc($this->main->db->prefix."categories"),
            $id
        );
        
	    $childs = $this->main->db->rawQuery($query);

	    if (count($childs)>0){
			foreach($childs as $child){
				$list = $this->children_categories($child['id'], $list);
			}
			
			return $list;
		}
	    	
	    else return $list;

    }
    
	public function get_xitems($category = '', $q = '', $index = 0, $type = 'cliparts', $limit = 50){

		$select = array("item.*, '$type' as resource ");
		$extra = array();
		
		if ($q !== '') {
			array_push($extra, "(item.name LIKE '%$q%' OR item.tags LIKE '%$q%')");
		}
		
		$q = $this->sql_esc($q);
		$type = $this->sql_esc($type);
		
		//get all categories deactived
		$query = sprintf(
			"SELECT `id` FROM `%s` WHERE `type`='%s' AND `active`= 0",
			$this->sql_esc($this->main->db->prefix."categories"),
			$type
		);
		$cat_deactives = array();
		$cates = $this->main->db->rawQuery($query);
		foreach($cates as $cat){
			//find all child to deactive
			$cat_deactives = array_merge($cat_deactives, $this->children_categories($cat['id'], $cat_deactives));
		}
		
		$select = "item.*, '$type' as resource ";
		$group_by = "GROUP BY item.id";
		$order_by = "ORDER BY `item`.`order` DESC, `item`.`created` DESC";
		//if has category
		if(is_numeric($category) && $category > 0){
			
			$from = array("FROM {$this->main->db->prefix}{$type} item");
			$where = array("item.active = 1");
			
			array_push($from, "LEFT JOIN `{$this->main->db->prefix}categories_reference` cref ON item.`id` = cref.`item_id`");
			array_push($where, "cref.`category_id` IN (".implode(',', $this->children_categories($category)).")");
			array_push($where, "cref.`type`='{$type}'");
			
			$query = array(
				"SELECT SQL_CALC_FOUND_ROWS ". $select,
				implode(' ', $from),
				"WHERE ".implode(' AND ', $where),
				(count($extra)>0? ' AND '.implode(' AND ', $extra):''),
				$group_by,
				$order_by
			);
		}else if(
			in_array($category, array('', 0, '{featured}', '{free}'))
		){
			
			
			if ($category == '{featured}') {
				array_push($extra, "item.featured = 1");
			}else if ($category == '{free}') {
				array_push($extra, "item.price = 0");
			}
			
			if(count($cat_deactives)>0){
				
				$query1 = array(
					"SELECT ". $select,
					"FROM {$this->main->db->prefix}{$type} item",
					"LEFT JOIN `{$this->main->db->prefix}categories_reference` cref ON item.`id` = cref.`item_id`",
					"WHERE item.active = 1 AND cref.`type`='{$type}'",
					(count($extra)>0? ' AND '.implode(' AND ', $extra):''),
					"AND cref.`category_id` NOT IN (".implode(",", $cat_deactives).")",
					$group_by
				);
				
				$query2 = array(
					"SELECT ". $select,
					"FROM {$this->main->db->prefix}{$type} item",
					"WHERE item.active = 1 AND item.`id` NOT IN 
						(
							SELECT item_id FROM `{$this->main->db->prefix}categories_reference` as cref 
							WHERE cref.`type` = '{$type}'
						)",
					(count($extra)>0? ' AND '.implode(' AND ', $extra):''),
					$group_by
				);
				
				$query = array(
					"SELECT SQL_CALC_FOUND_ROWS item.* FROM (",
					implode(" ", $query1),
					"UNION ALL",
					implode(" ", $query2),
					") as item ",
					$order_by
				);
			}else{
				$query = array(
					"SELECT SQL_CALC_FOUND_ROWS ". $select,
					"FROM {$this->main->db->prefix}{$type} item",
					"WHERE item.active = 1 ",
					(count($extra)>0? ' AND '.implode(' AND ', $extra):''),
					$group_by,
					$order_by
				);
			}
 		}
//echo implode(" ", $query);
// die();
		if (isset($index) && $index."" != 'total')
			array_push($query, "LIMIT $index, $limit");
		else return count($this->main->db->rawQuery(implode(" ", $query)));

        $items = $this->main->db->rawQuery(implode(" ", $query));
        $total = $this->main->db->rawQuery("SELECT FOUND_ROWS() AS count");
        
        if (count($total) > 0 && isset($total[0]['count'])) {
			$total = $total[0]['count'];
		}else $total = 0;
		
        foreach ($items as $key => $val) {
	        $items[$key]['name'] = $this->main->lang($val['name']);
			$tags = $this->get_tags_item($val['id'], $type);
			if(count($tags)>0){
				$items[$key]['tags']= array();
				foreach ($tags as $tkey => $tval) {
					$items[$key]['tags'][] = $tval['name'];
				}
				$items[$key]['tags'] = implode(', ', $items[$key]['tags']);
			}
	        
        }
        
        return array($items, $total);

    }
	
	protected function get_tags_item($id, $type){
		$select = array("tags.name, tags.id");
		$from = array("FROM {$this->main->db->prefix}tags as tags");
		array_push($from, "LEFT JOIN `{$this->main->db->prefix}tags_reference` tagref ON tags.`id` = tagref.`tag_id`");
		$where = array("tagref.item_id = $id");
		
		$query = array(
			"SELECT ".implode(',', $select),
			implode(' ', $from),
			(count($where) > 0 ? "WHERE ".implode(' AND ', $where) : ''),
			"GROUP BY tags.id"
		);
		
		return $this->main->db->rawQuery(implode(" ", $query));
		
	}

    protected function get_shapes($index = 0){

		$query = array(
			"SELECT *, 'shape' as `resource`",
			"FROM `{$this->main->db->prefix}shapes`",
			"WHERE `{$this->main->db->prefix}shapes`.`active` = 1",
			"ORDER BY `{$this->main->db->prefix}shapes`.`order` ASC"
		);
		if (isset($index) && $index != 'total')
			array_push($query, "LIMIT $index, 50");
		else return count($this->main->db->rawQuery(implode(" ", $query)));

        return $this->main->db->rawQuery(implode(" ", $query));

    }

    protected function get_items($atts){

        extract($atts);

        $db = $this->main->get_db();

        $order_default = isset($atts['order_default']) ? $order_default : 'name';

        $orderby = isset($atts['orderby']) ? $orderby : $order_default;
        $order = isset($atts['order']) ? $order : 'asc';


        $data = array();

        if (isset($where)) {
            foreach ($where as $key => $val) {
                $operator = (isset($val['operator']) && !empty($val['operator'])) ? $val['operator'] : '=';
                $db->where($key, $val['value'], $operator);
            }
        }

        if (isset($filter) && is_array($filter) && isset($filter['keyword']) && !empty($filter['keyword'])) {

            $fields = explode(',', $filter['fields']);

            $condiFields = array();
            $condiKey = array();

            foreach ($fields as $field) {
                $condiFields[] = $fields . ' LIKE ? ';
                $condiKey[] = '%' . $filter['keyword'] . '%';
            }

            $db->where('(' . implode(' OR ', $condiFields) . ')', $condiKey);
        }


       	$db->orderBy($orderby, $order);

        $limit_cfg = null;

        if (isset($limitstart) && isset($limit))
            $limit_cfg = array($limitstart, $limit);

        $data['items'] = $db->withTotalCount()->get($atts['table'], $limit_cfg);
        $data['total_count'] = $db->totalCount;
        $data['total_page'] = isset($limit) ? ceil($db->totalCount / $limit) : 0;

        return $data;

    }

	protected function scan_languages($path = ''){

		if (empty($path)) {
			$path = explode(DS, dirname(__FILE__));
			array_pop($path);
			$path = implode(DS, $path);
		}

		$result = array();
		$files = scandir($path);

		foreach ($files as $file) {
			if ($file != '.' && $file != '..' && $file != '.git' && $file != 'connectors') {
				if (is_dir($path.DS.$file)) {
					$result = array_merge($result, $this->scan_languages($path.DS.$file));
				} else if (strpos($file, '.php') == strlen($file)-4) {

					$content = file_get_contents($path.DS.$file);
					preg_match_all('/->lang\(\'+(.*?)\'\)/i', $content, $matches);

					if (isset($matches[1]) && count($matches[1]) > 0) {
						$result = array_merge($result, $matches[1]);
					}
				}
			}
		}

		return array_unique($result, SORT_STRING);

	}

	public function get_categories_parent($arr, $parent = 0, $lv = 0) {

		$result = array();

		foreach ($arr as $value) {

			if ($value['parent'] == $parent) {

				$value['lv'] = $lv;
				$result[] = $value;
				$result = array_merge($result, self::get_categories_parent($arr, $value['id'], $lv + 1));

			}

		}

		return $result;

	}
	
	public function get_category_parents($id, $result = array()) {
		
		global $lumise;
		$query = sprintf(
			"SELECT `id`, `name`, `parent` FROM `%s` WHERE `id`='%d' ORDER BY `name`",
            $this->sql_esc($lumise->db->prefix."categories"),
            $id
        );
		$cate = $lumise->db->rawQueryOne($query);
		
		if (isset($cate['id'])) {
			array_push($result, $cate);
			if ($cate['parent'] != 0) {
				$result = $this->get_category_parents($cate['parent'], $result);
			}
		}
		
		return $result;

	}

	public function get_categories($type = 'cliparts', $parent = null, $orderby = '`name`', $active = false) {

		global $lumise;
		
		$query = sprintf(
			"SELECT `id`, `name`, `parent`, `thumbnail_url` as `thumbnail` FROM `%s` WHERE `type`='%s' %s ORDER BY {$orderby}",
            $this->sql_esc($lumise->db->prefix."categories"),
            $this->sql_esc($type),
			($active? " AND `active` = 1 ": '') . 
            ($parent !== null ? " AND `parent`='".$this->sql_esc($parent)."'" : '')
        );
		
		$cates = $lumise->db->rawQuery($query);
		
		if ($parent === null)
			return $this->get_categories_parent($cates);
		else return $cates;
		
	}

	public function get_tags($type = 'cliparts') {

		global $lumise;
		$query = sprintf(
			"SELECT * FROM `%s` WHERE `type`='%s' ORDER BY `name`",
            $this->sql_esc($lumise->db->prefix."tags"),
            $this->sql_esc($type)
        );
		$tags = $lumise->db->rawQuery($query);
		return $tags;

	}

	public function upload_file ($data = '', $path = '') {

		global $lumise;

		if (empty($data) || empty($path))
			return array("error" =>  $lumise->lang('Invalid input data'));

		$path = $lumise->cfg->upload_path.$path;

		if (is_string($data)){
			if (@json_decode(stripslashes($data) === null))
				return $data;
			else $data = @json_decode(stripslashes($data));
		}
		
		if (
			!isset($data->type) || 
			!in_array(
				$data->type, 
				array(
					'application/zip', 
					'application/json', 
					'text/plain', 
					'.docx', 
					"image/jpeg", 
					"image/png", 
					"image/gif", 
					"image/svg+xml", 
					"application/font-woff",
					"woff", 
					"woff2", 
					"json",
					"lumi"
				)
			)
		) return array("error" => $lumise->lang('Invalid upload file types, only allows .jpg, .png, .gif and .svg'));

		if (!isset($data->size) || $data->size > 5242880)
			return array("error" => $lumise->lang('Max file size upload is 5MB'));

		$ext = strrchr($data->name, '.');
		$name = urlencode(substr($data->name, 0, strlen($data->name) - strlen($ext)));

		$i = 1;
		while (file_exists($path.$data->name)) {
			$data->name = $name.'-'.($i++).$ext;
		}

		$data->data = explode('base64,', $data->data);
		$data->data = base64_decode($data->data[1]);

		if (!file_put_contents($path.$data->name, $data->data))
			return array("error" => $lumise->lang('Could not upload file, error on function file_put_contents when trying to push '.$path.$data->name));

		$thumn_name = '';

		if (isset($data->thumbn)) {

			if ($ext == '.json' || $ext == '.lumi')
				$ext = '.png';
			else $ext = '.jpg';
			
			$thumn_name = $name.'-thumbn'.$ext;
			$i = 1;

			while (file_exists($path.$thumn_name)) {
				$thumn_name = $name.'-thumbn-'.($i++).$ext;
			}

			$data->thumbn = explode('base64,', $data->thumbn);
			$data->thumbn = base64_decode($data->thumbn[1]);

			if (!@file_put_contents($path.$thumn_name, $data->thumbn))
				return array("error" => $lumise->lang('Could not upload thumbn file'));

		}

		return array(
			"success" => true,
			"name" => $data->name,
			"thumbn" => $thumn_name
		);

	}

    //get all printing
    // @active all get published printing or not. Default is true
    public function get_prints($active = true){

        $db = $this->main->get_db();

        if($active){
            $db->where(' active = 1 ');
        }

        return $db->get('printings');

    }

    public function get_products($filter_active_cat = false) {
		
		global $lumise;
		
		$categories = $this->get_categories('products', null, '`name`', $filter_active_cat);
		$cat_deactives = array();
		
		if ($filter_active_cat) {
			$query = sprintf(
				"SELECT `id` FROM `%s` WHERE `type`='products' AND `active`= 0",
	            $this->sql_esc($lumise->db->prefix."categories")
	        );
			
			$cates = $lumise->db->rawQuery($query);
			foreach($cates as $cat)
				$cat_deactives[] = $cat['id'];
		}
		
		$is_filter_active = ($filter_active_cat && count($cat_deactives) > 0) ? true : false;
			
	    $query = array(
			"SELECT p.*, GROUP_CONCAT('', cref.category_id) as cates",
			"FROM {$this->main->db->prefix}products p",
			"LEFT JOIN {$this->main->db->prefix}categories_reference cref ON cref.item_id = p.id",
			"WHERE cref.type='products' AND p.active = 1". ($is_filter_active? " AND cref.`category_id` NOT IN (".implode(",", $cat_deactives).")":"") ,
			"GROUP BY p.id"
		);
		
		$query = array("SELECT * FROM (",
			implode(' ', $query),
			"UNION ALL",
			"SELECT p.*, '' as cates FROM {$this->main->db->prefix}products p ".
			"WHERE p.active = 1 AND p.id NOT IN (SELECT item_id FROM {$this->main->db->prefix}categories_reference cref WHERE cref.type = 'products')",
			"GROUP BY p.id",
			") as p"
			
		);
		
		$products = $this->main->db->rawQuery(implode(' ', $query));
		
		for ($i = 0; $i < count($products); $i++) {
			
			//check categories
			if(
				!empty($products[$i]['cates']) && 
				$is_filter_active
			){
				$cates = explode(',',$products[$i]['cates']);
				$found = 0;
				foreach ($cates as $cat) {
					if(in_array($cat, $cat_deactives)) $found++;
				}
				if($found == count($cates)){
					unset($products[$i]);
					continue;
				} 
			}
			
			if ( 
				!empty($products[$i]['printings']) 
				&& $products[$i]['printings'] != '%7B%7D'
			) {
				
				$prints = $products[$i]['printings'];
				$printings_cfg = json_decode(str_replace(array('\\\''), array("'"), rawurldecode($prints)));
				
			    if (is_object($printings_cfg)) {
				    $prints = implode(',', array_keys( (Array)$printings_cfg ) );
					$product['printings_cfg'] = $printings_cfg;
			    }
			    
			    if( count($prints) > 0 ){
				    
					$printings = $this->main->db->rawQuery("SELECT * FROM {$this->main->db->prefix}printings WHERE id IN (".$prints.")");
					foreach ($printings as $key => $value) {
						$printings[$key]['calculate'] = $this->main->lib->dejson($value['calculate']);
					}
					$products[$i]['printings'] = $printings;
				}
				
			}else $products[$i]['printings'] = array();
			
			$products[$i]['product'] = ($lumise->connector->platform == 
			'php')? 0: $products[$i]['product'];
			$products[$i]['price'] = floatval($products[$i]['price']);
			$products[$i]['stages'] = stripslashes($products[$i]['stages']);
			$products[$i]['attributes'] = $this->main->lib->dejson($products[$i]['attributes']);
			
			foreach ($products[$i]['attributes'] as $attr) {
				$attr->name = $attr->title;
				$attr->title = $lumise->lang($attr->title);
				
				if (isset($attr->options)) {
					foreach ($attr->options as $opt) {
						$opt->label = $lumise->lang($opt->title);
					}
				}
			}
			
			$products[$i]['stages'] = $this->main->lib->dejson($products[$i]['stages']);
			
			foreach ($products[$i]['stages'] as $key => $val) {
				if (isset($val->label) && !empty($val->label)) {
					$products[$i]['stages']->{$key}->label = $this->main->lang(urldecode($val->label));
				}
			}
			
			$products[$i]['stages'] = $this->main->lib->enjson($products[$i]['stages']);
			
		}
		
		return array(
			'categories' => $categories,
			'products' => $lumise->apply_filter('products', $products)
		);
    }


	public function get_product($id = null) {
		
		global $lumise;
		
		if (isset($_GET['product']))
			$id = (int)$lumise->esc('product');
		
		if ($id === null)
	    	return null;

	    $product = $lumise->db->rawQuery("SELECT * FROM `{$lumise->db->prefix}products` WHERE id=".$id);

	    if (count($product) > 0) {

		    $product = $product[0];
			
			$product['price'] = floatval($product['price']);
			$product['product'] = ($lumise->connector->platform != 'php')? $product['product'] : 0; 

		    if (
				!empty($product['printings'])
				&& $product['printings'] != '%7B%7D'
			) {
			    
			    $prints = $product['printings'];
				$printings_cfg = json_decode(str_replace(array('\\\''), array("'"), rawurldecode($prints)));
			    if (is_object($printings_cfg)) {
				    $prints = implode(',', array_keys( (array)$printings_cfg ));
					$product['printings_cfg'] = $printings_cfg;
			    }
			    $product['printings'] = $lumise->db->rawQuery("SELECT * FROM `{$lumise->db->prefix}printings` WHERE id IN (".$prints.")");
		    }else $product['printings'] = array();

		    return $lumise->apply_filter('product', $product);

	    }else return null;

	}

	public function get_print_types(){

		global $lumise;

		return array(
			'multi' => array(
				'options' => array(
					'text' => $lumise->lang('Text'),
					'clipart' => $lumise->lang('Clipart'),
					'images' => $lumise->lang('Images'),
					'shape' => $lumise->lang('Shape'),
					'upload' => $lumise->lang('Upload')
				),
				'default' => array(
					5 => array(
						'text' => 1,
						'clipart' => 1,
						'images' => 1,
						'shape' => 1,
						'upload' => 1
					)
				),
				'label' => $lumise->lang('Calculate price with Text, Clipart, Images, Upload'),
				'desc' => $lumise->lang('Set the price based on quantity range for each text, clipart, images, upload')
			),
			'color' => array(
				'options' => array(
					'full-color' => $lumise->lang('Full Color'),
				),
				'default' => array(
					1 => array(
						'full-color' => 1
					),
				),
				'label' => $lumise->lang('Calculate price with one color'),
				'desc' => $lumise->lang('Allow setup price with one color of area design. Price of printing = Price of one color * colors number.')
			),
			'size' => array(
				'options' => array(
					'a0' => 'A0',
					'a1' => 'A1',
					'a2' => 'A2',
					'a3' => 'A3',
					'a4' => 'A4',
				),
				'default' => array(
					5 => array(
						'a0' => 1,
						'a1' => 1,
						'a2' => 1,
						'a3' => 1,
						'a4' => 1,
					),
				),
				'label' => $lumise->lang('Calculate price with size of area design'),
				'desc' => $lumise->lang('Allow setup price with paper size (A0, A1, A2, A3, A4, A5, A6). This size is size of area design.')
			),
			'fixed' => array(
				'options' => array(
					'price' => $lumise->lang('Price'),
				),
				'default' => array(
					5 => array(
						'price' => 1
					),
				),
				'label' => $lumise->lang('Price Fixed'),
				'desc' => $lumise->lang('Price is fixed on each view (front, back, left, right) of product design.')
			)
		);
	}
	
	
	function cart_item_from_template($data, $template){
		if(isset($data['product_id']) && $data['product_id'] > 0){
			$item = array(
				'id' => $data['product_id'],
				'cart_id' => isset($data['cart_id'])? $data['cart_id'] : time(),
				'qty' => isset($data['qty'])? $data['qty'] : 1,
				'qtys' => array(),
				'product_id' => $data['product_id'],
				'product_cms' => isset($data['product_cms'])? $data['product_cms'] : $data['product_id'],
				'product_name' => isset($data['product_name'])? $data['product_name'] : '',
				'price' => isset($data['price'])? $data['price'] : array(
		            'total' => 0,
		            'attr' => 0,
		            'printing' => 0,
		            'resource' => 0,
		            'base' => 0,
		        ),
				'attributes' => isset($data['attributes'])? $data['attributes'] : array(),
				'printing' => isset($data['printing'])? $data['printing'] : 0,
				'resource' => isset($data['resource'])? $data['resource'] : array(),
				'uploads' => isset($data['uploads'])? $data['uploads'] : array(),
				'design' => isset($data['design'])? $data['design'] : array(),
				'template' => isset($data['template'])? $data['template'] : '',
				'screenshots' => !empty($template)? array('front' => 'data:image/png;base64,'. base64_encode(file_get_contents($template))) : array()
			);
			return $item;
		}
		return false;
	}
	/*
	* Add more item to session cart
	*/
	public function add_item_cart($item){
		$cart_data = $this->main->connector->get_session('lumise_cart');
		if($cart_data == null)
			$cart_data['items'] = array();
			
		$cart_data['items'][$item['cart_id']] = $item;
		$this->main->connector->set_session('lumise_cart', $cart_data);
	}
	
	public function remove_cart_item( $cart_id ){
		global $lumise;
		
		$cart_data = $lumise->connector->get_session('lumise_cart');
		$items = $lumise->connector->get_session('lumise_cart_removed');
		$removed_items = ($items == null)? array() : $items;
		$removed_items[] = $cart_id;
		
		//remove file data
		if( isset($cart_data[ 'items' ][ $cart_id ][ 'file' ]) ){
			$path = $this->main->cfg->upload_path . 'user_data'. DS . $cart_data[ 'items' ][ $cart_id ][ 'file' ];
			@unlink( $path );
		}
		
		unset($cart_data['items'][$cart_id]);
		
		$this->main->connector->set_session('lumise_cart', $cart_data);
		$this->main->connector->set_session('lumise_cart_removed', $removed_items);
	}

	function store_cart($order_id){
		
		global $lumise;
		
		$db = $lumise->get_db();
		$res = array(
			'error' => 0,
			'msg' => ''
		);

		$date = @date ("Y-m-d H:i:s");
		
		$design_path = $lumise->cfg->upload_path.'designs';
		$order_path = 'orders'.DS.$order_id;
		$created_folder = false;
		$msg = array();
		
		if (!is_dir($lumise->cfg->upload_path.'orders'))
			@mkdir($lumise->cfg->upload_path.'orders', 0755);
			
		if (!is_dir($design_path) && !mkdir($design_path, 0755)){
			return array(
				'error' => 1,
				'msg' => $lumise->lang('Could not create design folder, please report to the administrator').': '.$design_path
			);
		}
		
		if (
			!is_dir($lumise->cfg->upload_path.$order_path) &&
			!mkdir($lumise->cfg->upload_path.$order_path, 0755)
		){
			return array(
				'error' => 1,
				'msg' => $lumise->lang('Could not create orders folder, please report to the administrator').': '.$order_path
			);
		
			file_put_contents($lumise->cfg->upload_path.$order_path.DS.'index.html','');
		}
		
		//store data just used for checkout
		$last_checkout = array();
			
		//current lumise cart data
		$cart_data = $lumise->connector->get_session('lumise_cart');
		
		if(count($cart_data['items']) == 0) return;
		
		foreach($cart_data['items'] as $item){
			$screenshots = array();
			
			//get data from file
			$extra_data = $this->get_cart_item_file( $item['file'] );
			
			//save screenshots
			if(
				(!isset($item['template']) || false === $item['template']) &&
				isset($extra_data['screenshots']) &&
				count($extra_data['screenshots']) > 0
			){
				foreach ($extra_data['screenshots'] as $stage => $screenshot) {
					$scr_file_name = base_convert(time(), 10, 36).'_'.uniqid().'_'.$stage.'.png';
					$scr_name = $lumise->cfg->upload_path.$order_path . DS . $scr_file_name;
					
					if(
						!@file_put_contents(
							$scr_name,
							base64_decode(
								preg_replace('#^data:image/\w+;base64,#i', '', $screenshot)
							)
						)
					){
						return array(
							'error' => 1,
							'msg' => $lumise->lang('Could not save product screenshot, please report to the administrator').': '.$order_path
						);
					}
					$screenshots[] = $scr_file_name;
				}
			}
			
			//save upload file
			if( isset( $extra_data['uploads'] )){
				foreach($extra_data['uploads'] as $field => $file_data){
					$res = $this->upload_file($this->dejson($file_data), $order_path . DS );
					if(isset($res['error'])){
						return array(
							'error' => 1,
							'msg' => $res['error']
						);
					}
				}
			}
			
			
			//check if is not template => save design to file
			$design_product = $item['template'];
			
			if(false === $item['template']){
				
				$design_raw = json_encode($extra_data['design']);
				
				$design_file = base_convert(time(), 10, 36).'_'.uniqid().'.lumi';
				
				if (!file_put_contents($design_path.DS.$design_file, $design_raw)){
					return array(
						'error' => 1,
						'msg' => $this->main->lang('Could not save design file')
					);
				}
				
				$design_product = str_replace('.lumi','', $design_file);
			}
			
			$insert_data = array(
				'order_id' => $order_id,
				'product_base' => $item['product_id'],
				'product_id' => $item['product_cms'],
				'data' => $this->enjson(array(
					'attributes' 	=> $item['attributes'],
					'color' 		=> $item['color'],
					'color_name' 	=> $item['color_name']
				)),
				'screenshots' => json_encode($screenshots),
				'created' => $date,
				'updated' => $date,
				'product_price' => floatval($item['price']['total']),
				'product_name' => $item['product_name'],
				'currency' => $lumise->cfg->settings['currency'],
				'qty' => $item['qty'],
				'design' => $design_product,
				'custom' => (false === $item['template'])? 1 : 0,
			);

			$id = $db->insert('order_products', $insert_data);
			
			//unset some data to use in thankyou page
			//remove cart extra data from file
			if( isset($item[ 'file' ]) ){
				$path = $this->main->cfg->upload_path . 'user_data'. DS . $item[ 'file' ];
				@unlink( $path );
			}
			unset( $item[ 'attributes' ] );
			$last_checkout[ $item[ 'cart_id'] ] = $item;
		}
		
		$lumise->connector->set_session('lumise_cart', array('items' => array()));
		$lumise->connector->set_session('lumise_last_checkout', array('items' => $last_checkout ) );
		$lumise->connector->set_session('lumise_checkout', true);
		return (count($msg) > 0 )? $msg : true;
	}
	
	public function clear_cart(){
		
		global $lumise;
		
		$items = $lumise->connector->get_session( 'lumise_cart_removed' );
		$removed_items = ( $items== null )? array() : $items;
		$clear = (
				$lumise->connector->get_session( 'lumise_checkout' ) != null
				&& $lumise->connector->get_session( 'lumise_checkout' )
			)?
				1 : ( ( count( $removed_items ) > 0 )? json_encode( array_values( $removed_items ) ) : 0 );

		$lumise->connector->set_session( 'lumise_checkout', 0 );
			
		return $clear;
	}
	
	public function price( $price ) {
		global $lumise;
		$price = number_format(
			floatval($price),
			intval($lumise->cfg->settings['number_decimals']),
			$lumise->cfg->settings['decimal_separator'],
			$lumise->cfg->settings['thousand_separator']
		);
		return ($lumise->cfg->settings['currency_position'] === '0' ? $price . $lumise->cfg->settings['currency'] : $lumise->cfg->settings['currency'] . $price);
	}
	
	public function get_xitems_by_category($cate_id, $search_filter = '', $orderby = 'name', $order = 'asc', $limit = 10, $limitstart = 0, $type = 'products') {

		global $lumise;
        $data = array();
       	$db = $lumise->get_db();
		$db->join("categories_reference c", "p.id=c.item_id", "LEFT");
		$db->where("c.category_id", $cate_id);
		$db->where("c.type", $type);

		if($orderby != null &&  $order != null)
       		$db->orderBy($orderby, $order);

		$data['rows'] = $db->withTotalCount()->get("{$type} p", array($limitstart, $limit), "p.*");
		$data['total_count'] = $db->totalCount;
        $data['total_page'] = ($limit != null) ? ceil($db->totalCount / $limit) : 0;

        return $data;

	}
	
	public function get_by_category($cate_id, $orderby = 'name', $order = 'asc', $limit = 10, $limitstart = 0, $type = 'products', $default_filter = null) {

		global $lumise;
        $data = array();
       	$db = $lumise->get_db();
		$db->join("categories_reference c", "p.id=c.item_id", "LEFT");
		$db->where("c.category_id", $cate_id);
		$db->where("c.type", $type);
		
		if (is_array($default_filter) && count($default_filter) > 0) {

        	foreach ($default_filter as $key => $value) {
	        	if ($value != null)
        			$db->where($key, $value);
        		else $db->where($key);
        	}

        }

		if($orderby != null &&  $order != null)
       		$db->orderBy($orderby, $order);

		$data['rows'] = $db->withTotalCount()->get("products p", array($limitstart, $limit), "p.id, p.name, p.price, p.thumbnail_url");
		$data['total_count'] = $db->totalCount;
        $data['total_page'] = ($limit != null) ? ceil($db->totalCount / $limit) : 0;

        return $data;

	}

	public function get_rows($tb_name, $filter = array(), $orderby = 'name', $order = 'asc', $limit = 10, $limitstart = 0, $default_filter = null, $type = null) {

        global $lumise;
        $db = $lumise->get_db();

        $data = array();

        if (is_array($filter) && isset($filter['keyword']) && !empty($filter['keyword'])) {

            $fields = explode(',', $filter['fields']);
            $arr_keyword = array();

            for ($i = 0; $i < count($fields); $i++) {
				$arr_keyword[] = $filter['keyword'];
            }

            $fields = '('.implode(' LIKE ? or ', $fields).' LIKE ?)';
            $db->where($fields, $arr_keyword);

        }

        if (is_array($default_filter) && count($default_filter) > 0) {

        	foreach ($default_filter as $key => $value) {
	        	if ($value != null)
        			$db->where($key, $value);
        		else $db->where($key);
        	}

        }

        if ($type != null) {
        	$db->where('type', $type);
        }

        if($orderby != null &&  $order != null){
			$db->orderBy($orderby, $order);
		}
       		

        $limit_cfg = array($limitstart, $limit);
        if($limitstart == null &&  $limit == null)
        	$limit_cfg = null;

        $data['rows'] = $db->withTotalCount()->get($tb_name, $limit_cfg);
        $data['total_count'] = $db->totalCount;
        $data['total_page'] = ($limit != null) ? ceil($db->totalCount / $limit) : 0;

        return $data;
    }

	public function get_rows_custom($arr, $tb_name, $orderby = 'name', $order='asc') {

		global $lumise;
		$db = $lumise->get_db();
		$db->orderBy($orderby, $order);
		$slug = $db->get ($tb_name, null, $arr);

		return $slug;

	}


	public function get_row_id($id, $tb_name) {

		global $lumise;
		$db = $lumise->get_db();
		$db->where ('id', $id);
		$arts = $db->getOne ($tb_name);

		return $arts;
	}

	public function get_rows_limit($tb_name, $limit ) {

		global $lumise;
		$db = $lumise->get_db();
		$arts = $db->get($tb_name, $limit);

		return $arts;

	}

	public function get_rows_total($tb_name, $col = null, $val = null) {

		global $lumise;
		$db = $lumise->get_db();

		if (!empty($col)) {
			$db->where ($val, $col);
		}

		$db->get($tb_name);
		$total = $db->count;

		return $total;

	}

	public function add_row( $data, $tb_name ) {

		global $lumise;
		$db = $lumise->get_db();
		$id = $db->insert($tb_name, $data);

        return $id;

	}

	public function edit_row( $id, $data, $tb_name ) {

		global $lumise;
		$db = $lumise->get_db();
		$db->where ('id', $id);
		$db->update ($tb_name, $data);
		return $id;

	}

	public function delete_row($id, $tb_name) {

		global $lumise;
		$db = $lumise->get_db();
		$db->where('id', $id);
		$id = $db->delete($tb_name);

		return $id;

	}

	public function add_count($val, $arr, $count = 1) {

		$val_temp = $val;
		while (in_array($val_temp, $arr)) {
			$val_temp = $val.'-'.$count;
			$count++;
		}

		return $val_temp;

	}

	public function get_tag_item($item_id, $type){

		global $lumise;
		$db = $lumise->get_db();
		$db->join("tags_reference tf", "t.id=tf.tag_id", "LEFT");
		$db->where("tf.item_id", $item_id);
		$db->where("tf.type", $type);
		$result = $db->get ("tags t", null, "t.id, t.name");

		return $result;

	}
	
	public function get_template($id = 0){
		
		global $lumise;
		
		$db = $lumise->get_db();
		$db->where ('id', (int)$id);
		
		return $db->getOne ('templates');
		
	}
		
	public function get_order($id = 0){
		
		global $lumise;
		
		$db = $lumise->get_db();
		$db->where ('id', (int)$id);
		
		return $db->getOne ('orders');
		
	}
	
	public function get_order_products($order_id = 0){
		
		global $lumise;
		
		$db = $lumise->get_db();
		$db->where ('order_id', (int)$order_id);
		
		return $db->get('order_products');
		
	}
	
	/** counting all resource **/
	public function stats(){
		global $lumise;
		$db = $lumise->get_db();
		
		$data = array();
		
		foreach(array('cliparts', 'designs', 'fonts', 'tags', 'shapes', 'templates') as $tb_name){
			$db->withTotalCount()->get($tb_name);
	        $data[$tb_name] = $db->totalCount;
		}
		
		return $data;
	}
	
	public function recent_resources()
	{
		$resources = array();
		
		foreach(array('cliparts' => 9, 'templates' => 6) as $tb_name => $limit){
			$data = $this->get_rows($tb_name, array(), 'updated', 'desc', $limit);
			$resources[$tb_name] = $data['rows'];
			if(in_array($tb_name, array('cliparts', 'templates') )){
				foreach($resources[$tb_name] as $key => $item){
					
					$resources[$tb_name][$key]['categories'] = array();
					$cats = $this->get_category_item($item['id'], $tb_name);
					
					if(isset($item['screenshot']))
						$resources[$tb_name][$key]['thumbnail_url'] = $item['screenshot'];
					
					foreach ($cats as $cat) {
						array_push($resources[$tb_name][$key]['categories'], $cat['name']);
					}
				}
			}
		}
		
		return $resources;
	}
	
	protected function get_category_item($id, $type){
		
		$query = array(
			"SELECT cat.* ",
			"FROM `{$this->main->db->prefix}categories` cat",
			"INNER JOIN `{$this->main->db->prefix}categories_reference` cref ON cat.`id` = cref.`category_id` AND cref.`type` = '{$type}'",
			"WHERE cref.`item_id` = {$id}",
			"ORDER BY `cat`.`name` ASC"
		);
		
        $items = $this->main->db->rawQuery(implode(" ", $query));
		
		return $items;
	}
		
	public function get_share($id){
		
		$share = $this->main->db->rawQuery("SELECT * FROM `{$this->main->db->prefix}shares` WHERE `share_id` = '{$id}'");
		
		if ($share && count($share) > 0)
			return $share[0];
		else return null;
	}
	
	protected function getShares($index = 0) {
		
		$stream = $this->main->lib->esc('stream');
		$aid = $this->main->connector->cookie('lumise-AID');
		
		$query = "SELECT SQL_CALC_FOUND_ROWS * FROM `{$this->main->db->prefix}shares` ";
		
		if ($stream != 'all')
			$query .= "WHERE `aid`='{$aid}' ";
			
		$query .= "ORDER BY `created` DESC LIMIT {$index}, 20";

        $items = $this->main->db->rawQuery($query);
        $total = $this->main->db->rawQuery("SELECT FOUND_ROWS() AS count");
        
        if (count($total) > 0 && isset($total[0]['count'])) {
			$total = $total[0]['count'];
		}else $total = 0;
		
		return array($items, $total);
		
	}
	
	public function product_cfg() {
		
		global $lumise;
		
		$product = $lumise->cfg->product;
		
		if ($product !== null) {
			
			$product['stages'] = $lumise->lib->dejson($product['stages']);
			
			foreach ($product['stages'] as $key => $val) {
				if (isset($val->label) && !empty($val->label)) {
					$product['stages']->{$key}->label = $lumise->lang(urldecode($val->label));
				}
			}
			
			$product['attributes'] = $lumise->lib->dejson($product['attributes']);
			foreach ($product['attributes'] as $attr) {
				$attr->name = $attr->title;
				$attr->title = $lumise->lang($attr->title);
				
				if (isset($attr->options)) {
					foreach ($attr->options as $opt) {
						$opt->label = $lumise->lang($opt->title);
					}
				}
			}
			if (is_array($product['printings'])) {
				foreach ($product['printings'] as $key => $value) {
					$product['printings'][$key]['calculate'] = $lumise->lib->dejson($value['calculate']);
				}
			}
			foreach ($product['stages'] as $name => $data) {
				if (isset($data->template) && isset($data->template->id)) {
					$template = $lumise->lib->get_template($data->template->id);
					if (isset($template['upload'])) {
						$data->template->upload = $template['upload'];
						$data->template->price = isset($template['price']) ? $template['price'] : 0;
					}
				}
			}
			echo ',';
			echo "\n";
			echo '				has_template :'.(isset($data->template) ? 1: 0);
			echo ',';
			echo "\n";
			echo '				onload :'.json_encode($product);
		
		}
		
		echo ',';
		echo "\n";
		echo '				enable_colors : "'.$lumise->cfg->settings['enable_colors'].'"';
		echo ',';
		echo "\n";
		echo '				colors : "'.$lumise->cfg->settings['colors'].'"';
		
		if (isset($_GET['share'])) {
			
			$share = $lumise->lib->get_share($_GET['share']);
			
			if ($share === null || $share['product'] != $_GET['product']) {
				echo ',';
				echo "\n";
				echo '				share_invalid : "'.$lumise->lang('Oops, The link share is invalid or has been removed by admin').'"';
			} else {
				
				$history = $this->main->connector->get_session('lumise_shares_access');
				
				if (!isset($history))
					$history = array();
					
				if (!in_array($_GET['share'], $history)) {
					array_push($history, $_GET['share']);
					$this->main->db->where('id', $share['id']);
					$this->main->db->update('shares', array('view' => $share['view']+1));
					$this->main->connector->set_session('lumise_shares_access', $history);
				}
				
				echo ',';
				echo "\n";
				echo '				share : "'.date('Y', strtotime($share['created'])).'/'.date('m', strtotime($share['created'])).'/'.$share['share_id'].'"';
					
			}
		}

	}
	
	public function lumise_conn($url = '', $arg = array()) {
		
		$options = array("http" => array(
				        "header" => "Referer: ".$_SERVER['HTTP_HOST']."\r\n".
				        			"Platform: ".$this->main->connector->platform."\r\n".
				        			"Scheme: ".$this->main->cfg->scheme."\r\n".
				        			"Cookie: PHPSESSID=".str_replace('=', '', base64_encode($_SERVER['HTTP_HOST']))."\r\n",
				        "ignore_errors" => true,
				    ));
		
		if (count($arg) > 0) {
			$options['http']['header'] .= implode("\r\n", $arg);
		}
				    
		$context = @stream_context_create($options);
		
		if ($url === null)
			return $context;
		
		@libxml_set_streams_context($context);
					
		return @simplexml_load_file($url);
		
	}
	
	public function check_sys_update() {
		
		$check = array('<b><font color="#555">Can not update because the system errors below:</font></b><hr>');
		$ml = ini_get('memory_limit');
		
		$ml = (int)str_replace('M', '', $ml);
		
		if (!ini_get('allow_url_fopen'))
			array_push($check, 'The function fopen() has been disabled on your server');
		
		if ($ml < 10)
			array_push($check, 'Your server memory limit must be configured to greater than 20M');
		
		if (!class_exists('ZipArchive'))
			array_push($check, 'The class ZipArchive has been disabled on your server');
		
		if (count($check) === 1) {
			return true;
		} else {
			return $check;
		}
		
	}
	
	function delete_dir($from) {
		
	    if (!file_exists($from)) {
		    return false;
	    }
	    
	    $dir = @opendir($from);
	    
	    while (false !== ($file = @readdir($dir))) {
	        if ($file != '.' && $file != '..') {
		        if (is_dir($from.DS.$file))
		            $this->delete_dir($from.DS.$file);
		        else if (is_file($from.DS.$file))
		        	@unlink($from.DS.$file);
	        }
	    }
	    
	    @rmdir($from);
	    @closedir($dir);
	    
	    return true;
	    
	}
	
	public function delete_files($target) {
		
	    if(is_dir($target)){
		    
	        $files = glob( $target . '*', GLOB_MARK );
	        
	        foreach( $files as $file )
	        {
	            $this->delete_files( $file );  
	        }
	      
	        @rmdir( $target );
	        
	    } elseif(is_file($target)) {
	        @unlink( $target );  
	    }
	}
	
	public function delete_order_products($order_id) {
		
		if(empty($order_id)) return;
		
		global $lumise;
		
		$products = $this->get_order_products($order_id);
		foreach($products as $product){
			if(isset($product['custom']) && $product['custom']){
				$design_path = realpath($lumise->cfg->upload_path).DS . 'designs'. DS . $product['design'].'.lumi';
				$this->delete_files($design_path);
			}	
		}
		
		$db = $lumise->get_db();
		$db->where('order_id', $order_id);
		$db->delete('order_products');
		
		//delete order folder
		$path = realpath($lumise->cfg->upload_path).DS . 'orders'. DS . $order_id;
		$this->delete_files($path);
	}
	
	public function report_bug_lumise($id = 0) {
		
		global $lumise;
		$db = $lumise->get_db();

		$db->where ('id', $id);

		$bug = $db->getOne ('bugs');
		
		if ($bug) {
			$arg = array(
				'reporting-channel=backend',
				'content='.base64_encode(urlencode($bug['content'])),
				'domain='.urlencode($lumise->cfg->url),
				'created='.$bug['created'],
				'updated='.$bug['updated']
			);
			
			$url = (strpos($lumise->cfg->url, 'https') === 0 ? 'https' : 'http').'://bugs.lumise.com';
			$arg = implode('&', $arg);
			
			$ch = curl_init( $url );
			curl_setopt( $ch, CURLOPT_POST, 1);
			curl_setopt( $ch, CURLOPT_POSTFIELDS, $arg);
			curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
			curl_setopt( $ch, CURLOPT_HEADER, 0);
			curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
			
			$response = curl_exec( $ch );
			
			if ($response != 0) {
				$db->where ('id', $id);
				$db->update ('bugs', array(
					'lumise' => 1,
					'status' => 'pending',
					'updated' => date("Y-m-d").' '.date("H:i:s")
				));
				return 1;
			}else return 0;
		}else return 0;
		
	}
	
	public function stripallslashes($string) { 
	    while(strchr($string,'\\')) { 
	        $string = stripslashes($string); 
	    }
		return stripslashes($string);
	}
	
	
	public function save_cart_item_file( $data ) {
		
		@ini_set('memory_limit','5000M');
		
		$filename = $data[ 'cart_id' ] . '_' . $this->gen_str();
		
		$path = $this->main->cfg->upload_path . 'user_data'. DS . $filename . '.tmp';

		$data[ 'screenshots' ] = base64_encode( json_encode( $data[ 'screenshots' ] ) );
		
		if ( !file_put_contents($path, json_encode( $data ) ) )
			return false;
		else return $filename;
	}
	
	
	public function get_cart_item_file( $filename ) {
		
		@ini_set('memory_limit','5000M');
		
		$path = $this->main->cfg->upload_path . 'user_data'. DS . $filename . '.tmp';
		
		if ( file_exists( $path ) ){
			$data = json_decode( file_get_contents( $path ), 1 );
			$data[ 'screenshots' ] = json_decode( base64_decode( $data[ 'screenshots' ] ), 1);
			return $data;
		}else return null;
		
	}
	
	
	public function get_cart_data( $lumise_data ) {
		
		global $lumise;
		
		if( !isset($lumise_data[ 'file' ])) return null;
		
		$file = $lumise_data[ 'file' ];
		$file_data = $this->get_cart_item_file( $file );
		
		return ($file_data== null)? $lumise_data : $file_data;

	}	

    protected function gen_str( $max = 10 ) {
        
        $sources = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $len_sourcses = strlen( $sources );
        $str = '';
        for ( $i = 0; $i < $max; $i++ ) {
            $str .= $sources[ rand( 0, $len_sourcses - 1 ) ];
        }
        
        return $str;
    }
    
    public function get_system_status() {
	    
	    $check = array(
		    'stream_context_create()' => true,
		    'libxml_set_streams_context()' => true,
		    'simplexml_load_file()' => true,
		    'ZipArchive()' => true,
		    'allow_url_fopen' => true,
		    'file_put_contents()' => true,
		    'file_get_contents()' => true,
		    'memory_limit' => 0,
		    'post_max_size' => 0
	    );
	    
		$ml = ini_get('memory_limit');
		$check['memory_limit'] = (int)str_replace('M', '', $ml);
		
		$pmz = ini_get('post_max_size');
		$check['post_max_size'] = (int)str_replace('M', '', $pmz);
		
		if (!ini_get('allow_url_fopen'))
			$check['allow_url_fopen'] = false;
		
		if (!function_exists('stream_context_create'))
			$check['stream_context_create()'] = false;
		
		if (!function_exists('libxml_set_streams_context'))
			$check['libxml_set_streams_context()'] = false;
		
		if (!function_exists('simplexml_load_file'))
			$check['simplexml_load_file()'] = false;
		
		if (!function_exists('file_put_contents'))
			$check['file_put_contents()'] = false;
		
		if (!function_exists('file_get_contents'))
			$check['file_get_contents()'] = false;
			
		if (!class_exists('ZipArchive'))
			$check['ZipArchive'] = false;
		
		return $check;
		
    }
    
    public function display_check_system() {
	    
	    $check = $this->get_system_status();
	    $amount = 0;
	    foreach ($check as $key => $val) {
			if ($key == 'memory_limit') {
				if ($val < 250)
					$amount++;
			}else if ($key == 'post_max_size') {
				if ($val < 100)
					$amount++;
			}else if (!$val)$amount++;
	    }
	    if ($amount > 0) {
	?>
		<div class="lumise-col lumise-col-12">
			<div class="lumise-update-notice top">
				<?php echo $this->main->lang('We found'); ?> <?php echo $amount; ?> <?php echo $this->main->lang('misconfiguration(s) on your server that may cause the system to operate incorrectly'); ?>. 
				&nbsp; 
				<a href="<?php echo $this->main->cfg->admin_url; ?>lumise-page=system">
					<?php echo $this->main->lang('System status'); ?> &#10230;
				</a>
			</div>
		</div>
	<?php 
		}
    }
	
}

class lumise_pagination {

	protected $_pagination = array(
		'current_page' => 1,
		'total_record' => 1,
		'total_page'   => 1,
		'limit'        => 10,
		'start'        => 0,
		'link_full'    => '',
		'link_first'   => ''
	);

	public function init( $pagination = array() ) {

		global $lumise;

		foreach ($pagination as $key => $value) {

			if (isset($this->_pagination[$key])) {
				$this->_pagination[$key] = $value;
			}

		}

		if ( $this->_pagination['limit'] < 0 ) {
			$this->_pagination['limit'] = 0;
		}

		if ( $this->_pagination['current_page'] < 1 ) {
			$this->_pagination['current_page'] = 1;
		}

		$this->_pagination['start'] = ( $this->_pagination['current_page'] - 1 ) * $this->_pagination['limit'];

		if($_SERVER['REQUEST_METHOD'] =='POST' && LUMISE_ADMIN) {
			$admin_url = explode('?', $lumise->cfg->admin_url);
			$this->redirect($admin_url[0].'?'.$_SERVER['QUERY_STRING']);
		}

	}

	public function redirect($url){
		echo '<script type="text/javascript">window.location = "'.$url.'";</script>';
		exit();
	}

	private function link($page) {

		if ($page <= 1){
            return $this->_pagination['link_first'];
        }

        return str_replace('{page}', $page, $this->_pagination['link_full']);

	}

	public function pagination_html() {

		global $lumise;
		$result = '';

		if ( $this->_pagination['total_record'] > $this->_pagination['limit'] ) {

			$result = '<p>'.$lumise->lang('Showing').' '.$this->_pagination['current_page'].' '.$lumise->lang('to').' '.$this->_pagination['limit'].' '.$lumise->lang('of').' '.$this->_pagination['total_record'].' '.$lumise->lang('entries').'</p>';
			$result .= '<ul>';

			if ( $this->_pagination['current_page'] > 1 ) {
				$result .= '<li><a href="' . $this->link('1') . '"><i class="fa fa-angle-double-left"></i></a></li>';
				$result .= '<li><a href="' . $this->link($this->_pagination['current_page'] - 1) . '"><i class="fa fa-angle-left"></i></a></li>';
			} else {
				$result .= '<li><span class="none"><i class="fa fa-angle-double-left"></i></span></li>';
				$result .= '<li><span class="none"><i class="fa fa-angle-left"></i></span></li>';
			}

			$max = 7;
			if($this->_pagination['current_page'] < $max)
				$sp = 1;
			elseif($this->_pagination['current_page'] >= ($this->_pagination['total_page'] - floor($max / 2)))
				$sp = $this->_pagination['total_page'] - $max + 1;
			elseif($this->_pagination['current_page'] >= $max)
				$sp = $this->_pagination['current_page'] - floor($max / 2);

			if ($this->_pagination['current_page'] >= $max)
				$result .= '<li><span class="none">...</span></li>';

			for ($i = $sp; $i <= ($sp + $max - 1); $i++) { 
				
				if($i > $this->_pagination['total_page'])
					break;

				if($this->_pagination['current_page'] == $i)
					$result .= '<li><span class="current">'.$i.'</span></li>';
				else
					$result .= '<li><a href="' . $this->link($i) . '">'.$i.'</a></li>';

			}

			if ($this->_pagination['current_page'] < ($this->_pagination['total_page'] - floor($max / 2)))
				$result .= '<li><span class="none">...</span></li>';

			if ( $this->_pagination['current_page'] < $this->_pagination['total_page'] ) {
				$result .= '<li><a href="' . $this->link($this->_pagination['current_page'] + 1) . '"><i class="fa fa-angle-right"></i></a></li>';
				$result .= '<li><a href="' . $this->link($this->_pagination['total_page']) . '"><i class="fa fa-angle-double-right"></i></a></li>';
			} else {
				$result .= '<li><span class="none"><i class="fa fa-angle-double-right"></i></span></li>';
				$result .= '<li><span class="none"><i class="fa fa-angle-right"></i></span></li>';
			}

		} else {
			$result = '<p>'.$lumise->lang('Showing').' '.$this->_pagination['total_record'].' '.$lumise->lang('entries').'</p>';
		}

		return $result;

	}

}
