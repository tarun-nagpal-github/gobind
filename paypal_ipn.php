<?php 
require('autoload.php');
global $lumise, $lumise_helper;

$order = $lumise->connector->get_session('lumise_justcheckout');
$order_id = $order['id'];
$user = $order['user'];

header("Pragma: no-cache");
header("Cache-Control: no-cache");
header("Expires: 0");

// following files need to be included
require_once("./lib/PaytmKit/lib/config_paytm.php");
require_once("./lib/PaytmKit/lib/encdec_paytm.php");

$paytmChecksum = "";
$paramList = array();
$isValidChecksum = "FALSE";

$paramList = $_POST;
$paytmChecksum = isset($_POST["CHECKSUMHASH"]) ? $_POST["CHECKSUMHASH"] : ""; //Sent by Paytm pg

//Verify all parameters received from Paytm pg to your application. Like MID received from paytm pg is same as your application�s MID, TXN_AMOUNT and ORDER_ID are same as what was sent by you to Paytm PG for initiating transaction etc.
$isValidChecksum = verifychecksum_e($paramList, PAYTM_MERCHANT_KEY, $paytmChecksum); //will return TRUE or FALSE string.

// print "<pre>";
// print_r($_POST);
// print "</pre>";
// die("Response From PAYTM");


if($isValidChecksum == "TRUE") {
	echo "<b>Checksum matched and following are the transaction details:</b>" . "<br/>";
	if ($_POST["STATUS"] == "TXN_SUCCESS") {
    echo "<b>Transaction status is success</b>" . "<br/>";
    
 
    $db = $lumise->get_db();
    //Payment data
    $item_number = $_POST['ORDERID'];
    $txn_id = $_POST['TXNID'];
    $payment_gross = $_POST['TXNAMOUNT'];
    $currency_code = $_POST['CURRENCY'];
    $payment_status = $_POST['STATUS'];

    //update order status
    
  
 

  if(isset($_POST['TXNID'])){
    //update order data
    
	$db->where ('id', $order_id)->update ('orders', array(
        'txn_id' => $_POST['TXNID'],
        'status' => 'processing'
    )); 
    $order['status'] = 'processing';
    $lumise->connector->set_session('lumise_justcheckout', $order);
    
}
  
  $lumise_helper->redirect($lumise->cfg->url. 'success.php?order_id='. $order['id']);

  
		//Process your transaction here as success transaction.
		//Verify amount & order id received from Payment gateway with your application's order id and amount.
	}
	else {
    echo "<b>Transaction status is failure</b>" . "<br/>";
    $lumise_helper->redirect($lumise->cfg->url. 'cancel.php?order_id='. $data['order_id']);
	}
 
	

}
else {
	echo "<b>Checksum mismatched.</b>";
	//Process transaction as suspicious.
}
 
