<?php 
	
require('autoload.php');
global $lumise, $lumise_helper;

if(isset($_POST['action'])){
    
    $data = $lumise->connector->save_order();
      
    // print "<br> <pre>";
    // print_r($data);
    // print "</pre>";
   
    // // die("Line n0 13");

    // print "<br> ['order_data']<pre>";
    // print_r($data['order_data']);
    // print "</pre>";

    // die("Line no 22");

    if(isset($data['order_id'])){
		//add action before redirect for process payment.
		    $lumise_helper->process_payment($data['order_data']);
        $lumise_helper->redirect($lumise->cfg->url. 'success.php?order_id='. $data['order_id']);
    }
}
$lumise_helper->redirect($lumise->cfg->url. 'checkout.php');
