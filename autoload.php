<?php
	
if (!defined('SITE_URL'))
	define('SITE_URL', '');
if (!defined('DS'))
	define('DS', DIRECTORY_SEPARATOR);

if(file_exists('php_connector.php')) {
    require('php_connector.php');
}else{
    $uri = (dirname($_SERVER['SCRIPT_NAME']) == '/')? '/' : dirname($_SERVER['SCRIPT_NAME']).'/';
    $scheme = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? 'https' : 'http';
    @header("location: ".$scheme."://$_SERVER[HTTP_HOST]" . $uri. 'installer');
    die();
}

if (!defined('PAYPAL_RETURN'))
	define('PAYPAL_RETURN', 'success.php');
	
if (!defined('PAYPAL_CANCEL'))
	define('PAYPAL_CANCEL', 'cancel.php');
	
require('./inc/helper.php');
require('./inc/views.php');
require_once('./core/includes/main.php');
