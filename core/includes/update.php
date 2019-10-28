<?php
/**
*
*	(p) package: lumise
*	(c) author:	King-Theme
*	(i) website: https://www.lumise.com
*
*/

if (!defined('LUMISE')) {
	header('HTTP/1.0 403 Forbidden');
	die();
}

class lumise_update extends lumise_lib {
	
	protected $current;
	
	public function __construct() {
		
		global $lumise;
		
		$this->main = $lumise;
		
		$current = $current = $this->main->get_option('current_version');
		
		if ($current != LUMISE) {
			$this->main->set_option('current_version', LUMISE);
			$this->run_updater();
		}
		
		$check = @json_decode($this->main->get_option('last_check_update'));
		
		if (!isset($data) || time()-$data->time > 60*60*24)
			$this->check();

	}
	
	public function check() {
		
		$check = @simplexml_load_file($this->main->cfg->api_url.'updates/lumise.xml?nonce='.time());
		
		if (!is_object($check) || !isset($check->{$this->main->connector->platform}))
			return null;
			
		$update = $check->{$this->main->connector->platform};
		
		$data = array(
			"time" => time(),
			"version" => (float)$update->version,
			"date" => (string)$update->date,
		);
		
		$this->main->set_option('last_check_update', json_encode($data));
		
		$data['status'] = 1;
		
		return $data;
		
	}
	
	protected function run_updater() {
		
		/*
		*	Call this when a new version is installed	
		*	$this->main = global $lumise
		*/
		/*
		* Version 1.6
		* add `active` to table categories
		*/
		if(version_compare(LUMISE, '1.4') >=0 ){
			$sql = "SHOW COLUMNS FROM `{$this->main->db->prefix}categories` LIKE 'active';";
			$columns = $this->main->db->rawQuery($sql);
			if(count($columns) == 0){
				$sql_active = "ALTER TABLE `{$this->main->db->prefix}categories` ADD `active` INT(1) NULL DEFAULT '1' AFTER `order`;";
				$this->main->db->rawQuery($sql_active);
			}
		}
		if(version_compare(LUMISE, '1.5') >=0 ){
			$sql = "SHOW COLUMNS FROM `{$this->main->db->prefix}products` LIKE 'max_qty';";
			$columns = $this->main->db->rawQuery($sql);
			if(count($columns) == 0){
				$sql_active = "ALTER TABLE `{$this->main->db->prefix}products` ADD `max_qty` INT(1) NULL DEFAULT '0' AFTER `size`;";
				$this->main->db->rawQuery($sql_active);
			}
			$sql = "SHOW COLUMNS FROM `{$this->main->db->prefix}products` LIKE 'min_qty';";
			$columns = $this->main->db->rawQuery($sql);
			if(count($columns) == 0){
				$sql_active = "ALTER TABLE `{$this->main->db->prefix}products` ADD `min_qty` INT(1) NULL DEFAULT '0' AFTER `size`;";
				$this->main->db->rawQuery($sql_active);
			}
			
			$sql_active = "ALTER TABLE `{$this->main->db->prefix}products` CHANGE `color` `color` TEXT;";
			$this->main->db->rawQuery($sql_active);
			$sql_active = "ALTER TABLE `{$this->main->db->prefix}products` CHANGE `printings` `printings` TEXT;";
			$this->main->db->rawQuery($sql_active);
		}
	}
	
}
	
	
