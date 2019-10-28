<?php
	
@set_time_limit(0);
@ini_set('memory_limit','5000M');

/**
 *
 */
class lumise_cart extends lumise_lib
{
    protected $printing 	= array();
    protected $action 		= '';
    protected $attributes 	= '';
    protected $products 	= array();
    protected $data 		= array();

    function __construct($lumise){
      	
      	$path = $lumise->cfg->upload_path.'user_data'.DS;
      	$file = $path.$lumise->lib->esc('file');
      	
      	if (!is_file($file))
      		return $this->on_error('UPLOAD_FAIL');
      	
      	$data = @file_get_contents($file);
      	@unlink($file);
      	
      	if (empty($data) || strlen($data) != $lumise->lib->esc('datalen'))
      		return $this->on_error('UPLOAD_MISS');
      	
        $this->main 	= $lumise;
        $this->action 	= $this->main->lib->esc('action');
        $this->data 	= (array) $this->dejson($data);
        
        $this->load();
        
    }

    public function process(){

		global $lumise;
        
        $items_cart 	= array();
        $upload_fields 	= array();
        $price_rule 	= array();
        $resources 		= array();
        
        //if not POST method, just return
		if( $_SERVER['REQUEST_METHOD'] !='POST' ) return;
        
        //check none
		$nonce = isset( $_POST['nonce'] ) ? explode( ":", htmlspecialchars($_POST['nonce'])) : array('', '');

		if ( !lumise_secure::check_nonce($nonce[0], $nonce[1]) ){
			header('HTTP/1.0 403 Forbidden');
			exit;
		}
        
        //loop through all cart items
        foreach( $this->data as $cart_id => $item ){
            
            //store final attributes data
            $attributes_data    = array();
            //current product's attributes 
            $attributes         = $this->products[$item->product_id]['attributes'];
            //upload files which user select via upload attribute input
            $upload_files       = array();
            //total amount attributes price per product
            $attr_price         = 0;
            //template price per product if item has used template
            $template_price     = 0;
            //quantities of Size attributes
            $qtys               = array();
            //normal quantity - not use Size attribute
            $qty                = 0;
            
            if ($attributes === null)
            	$attributes = array();
            
            //loop through values of attribute
            foreach ( $item->options as $option ) {
                $op_price       = 0;
                $option_name    = $option->name;
                $val            = $option->value;
                $attribute      = array();
                $attribute      = array_filter(
                    $attributes,
                    function ($e) use ( $option_name ) {
                        global $lumise;
                        return rawurlencode( $e->name ) == $option_name;
                    }
                );
                
                //if product just have normal quantiy
                if( strtolower( $option_name ) == strtolower( 'quantity' ) ){
                    $qty += $val[ 0 ];
                    continue;
                }
                //other system attribute type
                if( count( $attribute ) > 0 ){
                    
                    foreach( $attribute as $attr ){
                        
                        switch ( $attr->type ) {
                            
                            case 'size':
                                $size_vals = array();
                                
                                foreach( $val as $size ){
                                    
                                    $tmp            = explode( '-', $size );
                                    $qty_tmp        = array_pop( $tmp );
                                    $name           = implode( '-', $tmp );
                                    $size_vals[]    = $name;
                                    $qtys[$name]    = array(
                                        'qty' => $qty_tmp
                                    );
                                    $qty += $qty_tmp;
                                }
                                
                                $val = $size_vals;
                                break;
                                
                            case 'pack':
                            
                                $qty += $val[ 0 ];
                                
                                break;
                                
                            case 'text':
                            
                                if( !empty( $val ) ) $attributes_data[$attr->title][] = $val;
                                
                                break;
                                
                            case 'upload':
                            
                                $upload_files[ $attr->title ] 	= $val;
                                $upload_data 					= $this->dejson( $val );
                                
                                if( !empty( $val ) ) $attributes_data[ $attr->title ][] = $upload_data->name;
                                    
                                break;
                            
                            default:
                                break;
                        }
                        
                        if( isset( $attr->options ) ){
                            
                            foreach( $attr->options as $op ){
                                
                                if( in_array( $op->title, $val ) ){
                                    $attributes_data[ $attr->title ][] = $op->title . ( ( $attr->type == 'size' )? ' ('. $qtys[$op->title]['qty'] . ')' : '' );

                                    if( floatval( $op->price ) > 0 ){
                                        
                                        $op_price = floatval( $op->price );
                                        
                                        if( $attr->type == 'size' && isset( $qtys[ $op->title ] ) )
                                            $qtys[ $op->title ]['price'] = $op_price;
                                            
                                        $attr_price += ( $attr->type != 'size' )? $op_price : 0;                                  
                                    }
                                        
                                }
                                    
                            }
                        }
                        
                        
                        
                    }
                }
            }
            
            //get screenshots & resource
            //loop through each stage to count resource again and getting screenshot for each stage
            $stages 		= (array) $item->design->stages;
            $screenshorts 	= array();
            $resource 		= array();
            
			foreach ( $stages as $s => $stage ) {
                
				$screenshorts[ $s ] = $stage->screenshot;
                $sdata              = json_decode( $stage->data );
                $objects            = (array) $sdata->objects;
                
                foreach( $objects as $obj ){
                    if( 
                        isset($obj->evented ) 
                        && $obj->evented
                    ){
                        
                        if(
                            ( isset( $obj->type ) && !in_array( $obj->type, ['i-text', 'image'] ) ) || 
                            ( isset( $obj->resource ) && $obj->resource == 'cliparts' )
                        ){
                            $id = explode( ':', $obj->id );
                            if( is_numeric( $id[ 1 ] ) )
                                $resource[] = array(
                                    'type'  => 'clipart',
                                    'id'    => $id[ 1 ]
                                );
                        }
                    }
                }
			}
            
            $resources = array_merge( $resources, $resource );
            
            //template price
            if( isset($item->template) ){
                foreach ( $item->template->stages as $stage => $temp_id ) {
                    if(
                        $temp_id > 0
                    ){
                        $template = $this->get_template( $temp_id );
                        $template_price += ( $template['price'] > 0 ) ? $template['price'] : 0;
                    }
                        
                }
            }
            
            $base_price = $lumise->apply_filter(
                'product_base_price',
                array(
                $this->products[ $item->product_id ][ 'price' ],
                ( $lumise->connector->platform == 'php' )? $item->product_id : $item->cms_id
            ));
            
            $items_cart[ $cart_id ] = array(
                'id'            => $item->product_id,
                'cart_id'       => $cart_id,
                'data'          => $item,
                'qty'           => $qty,
                'qtys'          => $qtys,
                'product_id'    => $item->product_id,
                'color'         => $item->color,
                'color_name'    => $item->color_name,
                'product_cms'   => ( $lumise->connector->platform == 'php' )? $item->product_id : $item->cms_id,
                'product_name'  => $item->product_name,
                'price' => array(
                    'total'     => 0,
                    'attr'      => $attr_price,
                    'resource'  => 0,
                    'template'  => $template_price,
                    'base'      => $base_price[ 0 ]
                ),
                'attributes'    => $attributes_data,
                'printing'      => $item->printing,
                'resource'      => $resource,
                'uploads'       => $upload_files,
                'design'        => $item->design,
                'file'          => '',
                'template'      => false,
                'screenshots'   => $screenshorts
            );
        }
        
        //get price of resource
        $ids = array();
        
        foreach( $resources as $res ) {
            $ids[] = $res[ 'id' ];
        }
        
        $resources = $this->resources( $ids );
        
        
        $cart_total = 0;
        
        foreach( $items_cart as $key => $item ) {
	        
            foreach( $item[ 'resource' ] as $res ){
                $item[ 'price' ][ 'resource' ] += floatval( $resources[ $res['id'] ][ 'price' ] );
                $items_cart[ $key ][ 'price' ]['resource'] = $item['price']['resource'];
            }
            
            // if( count( $items_cart[ $key ][ 'qtys' ]) > 0 ){
            // 
            //     $sum = $item[ 'price' ][ 'attr' ] + 
            //         $item[ 'price' ][ 'resource' ] + 
            //         $item[ 'price' ][ 'base' ] + 
            //         $item[ 'price' ][ 'template' ];
            // 
            //     foreach ( $items_cart[ $key ]['qtys'] as $op_key => $option ) {
            // 
            //         $items_cart[ $key ]['price']['total'] += (
            //             $sum + 
            //             ( isset( $option['price'] )? floatval( $option['price'] ) : 0 ) + 
            //             $this->printing_calc( $item['data'], $option['qty'] ) 
            //         ) * $option['qty'];
            // 
            //         $items_cart[ $key ]['qty'] += $option['qty'];
            //     }
            // 
            // }else{
            //     $items_cart[ $key ]['price']['total'] = (
            //         $item[ 'price' ]['attr'] + 
            //         $item[ 'price' ]['resource'] + 
            //         $item[ 'price' ]['base'] + 
            //         $item[ 'price' ]['template']  + 
            //         $this->printing_calc( $item['data'], $item['qty'] ) 
            //     ) * $item['qty'];
            // }
            
            
            $qty        = $item['qty'];
            $sub_total  = 0;
            $sum        = $item[ 'price' ][ 'attr' ] +  $item[ 'price' ][ 'resource' ] + $item[ 'price' ][ 'base' ] + $item[ 'price' ][ 'template' ];


            if( count( $items_cart[ $key ][ 'qtys' ]) > 0 ){
                
                foreach ( $items_cart[ $key ]['qtys'] as $op_key => $option ) {
                    $sub_total += ( $sum + ( isset( $option['price'] )? floatval( $option['price'] ) : 0 ) + $this->printing_calc( $item['data'], $qty ) ) * $option['qty'];
                }
                
                $items_cart[ $key ]['price']['total'] = $sub_total;
            }else{
                $items_cart[ $key ]['price']['total'] = (
                    $sum + 
                    $this->printing_calc( $item['data'], $qty ) 
                ) * $item['qty'];
            }
            
            $cart_total += $items_cart[ $key ]['price']['total'];
            
            unset( $items_cart[ $key ]['data'] );
            
            //store items to files
            $this->main->check_upload();
            
            $item_data  =  $items_cart[ $key ];
            $filename   = $this->save_cart_item_file( $item_data );
            
            if( $filename === false ){
                return $this->main->lang( 'Could not write data on the user data folder, please report to the administrator' );
            }else{
                $items_cart[ $key ]['file'] = $filename;
            }
            
            unset($items_cart[ $key ]['screenshots']);
            unset($items_cart[ $key ]['design']);
            unset($items_cart[ $key ]['uploads']);
            
        }
        
        $cart_data = array(
            'items'     => $items_cart,
            'currency'  => $this->main->cfg->settings[ 'currency' ],
            'total'     => 0
        );
        
        $this->main->connector->set_session( 'lumise_cart_removed', array() );
        $this->main->connector->set_session( 'lumise_cart', $cart_data );
        
        $_POST = array();
        
		if (method_exists( $this->main->connector, 'add_to_cart' )){
			return $this->main->connector->add_to_cart($items_cart);
		}

		return $this->main->lang( 'Could not save product to cart' );

    }

    public function printing_calc( $item, $qty ){

        $print_price = 0;
        
        if( 
            $item->printing > 0 
            && count($this->printings) > 0 
        ){
            
            $rules 			= $this->printings[$item->printing]['calculate']['values'];
            $states_data 	= $item->states_data;
            
            if( empty($rules) && !is_array($rules) ) return $print_price;
            
            foreach ($states_data as $s => $options){
                
                $stage = $s;
                
                $is_multi = $this->printings[$item->printing]['calculate']['multi'];
                
                if( !$this->printings[$item->printing]['calculate']['multi'] )
                    $stage = key($rules);
                    
                $rules_stages = $rules[$stage];
                
                $qtys = array_keys($rules_stages); 
                sort($qtys, SORT_NATURAL);

                if (count($qtys) == 0) continue;
                
                $index = -1;
                
                for ($i=0; $i < count($qtys); $i++){
                    if(
                        (
                            intval($qtys[$i] ) < $qty &&
                            strpos($qtys[$i], '>') === false
                        ) ||
                        (
                            strpos($qtys[$i], '>') !== false &&
                            (intval(str_replace('>', '', $qtys[$i])) + 1) <= $qty
                        )
                    )
                        $index = $i;
                }

                if (isset($qtys[$index + 1]))
                    $qty_key = $qtys[$index + 1];
                else
                    $qty_key = $qtys[$index];
                    
                $rule = $rules_stages[$qty_key];
                
                
                $total_res = 0;
                
                foreach( $options as $key => $val ){
                    $unit 	= $val;
                    $option = $key;
                    
                    if( 
                        $this->printings[ $item->printing ][ 'calculate' ][ 'type' ] == 'color' && 
                        $key == 'colors' && 
                        count( (array)$val ) > 0
                    ){
                        $unit 	= 1;
                        $option = count( (array)$val ) . '-color';
                        $option = ( !isset( $rule[ $option ] ) ) ? 'full-color' : $option;
                    }

                    if( isset( $rule[ $option ] ) )
                        $print_price += floatval( $rule[ $option ] * $unit );
                    
                    if( !is_array( $val ) ) $total_res += $unit;
                }
                
                if(
                    $this->printings[ $item->printing ]['calculate']['type'] == 'fixed' 
                    && $total_res > 0
                ){
                    $print_price += floatval( $rule['price'] );
                    if( !$is_multi ) return $print_price;
                }
                
                if(
                    $this->printings[ $item->printing ]['calculate']['type'] == 'size' 
                    && $total_res > 0
                ){
                    //get current size from current printing
                    $printings_cfg  = (array) $item->product_data->printings_cfg;
                    $product_size   = '';
                    
                    foreach ( $printings_cfg as $key => $value ) {
                        if( $key == $item->printing ) $product_size = $value;
                    }
                                            
                    $print_price += floatval( $rule[ $product_size ] );
                    
                    if( !$is_multi ) return $print_price;
                }
            }                    
        }
        
        return $print_price;
    }

	public function redirect( $url ) {
		if ( empty( $url ) )
			return;
		// clean the output buffer
		ob_clean();
        
		header( "location: " . $url );
        
		exit;
	}

    //load product attributes and printings
    public function load(){
        
		global $lumise;
        
        $ids        = array();
        $print_ids  = array();
        
        //get product ID
        foreach ( $this->data as $item ) {
            $ids[] = $item->product_id;
            
            if( $item->printing > 0 )
                $print_ids[] = $item->printing;
        }
        
        
        if( count( $ids ) > 0 ){
            
            $data       = $lumise->lib->get_products();
            $products   = $data['products'];
            
    		for ( $i = 0; $i < count( $products ); $i++ ) {
                $this->products[ $products[ $i ]['id'] ] = $products[ $i ];
    		}
            
        }
        
        if( count( $print_ids ) > 0 ){
	        
            $query = array(
    			"SELECT  p.*",
    			"FROM {$this->main->db->prefix}printings p",
    			"WHERE p.id IN (".implode(',', $print_ids).")"
    		);
            
            $printings = $this->main->db->rawQuery( implode( ' ', $query ) );
            
            foreach ( $printings as $key => $value ) {
                $value['calculate'] = $this->main->lib->dejson( $value['calculate'], true );
                $this->printings[ $value['id'] ] = $value;
            }
        }
    }
    
    public function resources( $ids ){
        
        global $lumise;
        
        $resources = array();
        
        if( count( $ids ) > 0 ){
            $query = array(
    			"SELECT  c.id, c.name, c.price",
    			"FROM {$this->main->db->prefix}cliparts c",
    			"WHERE c.id IN (" . implode( ',', $ids ) .")"
    		);
            
            $cliparts = $this->main->db->rawQuery( implode( ' ', $query ) );
            
            foreach ( $cliparts as $clipart ){
                $resources[ $clipart['id'] ] = $clipart;
            }
        }
        
        
        return $resources;
    }
    
    public function on_error($msg) {
    ?><!DOCTYPE html>
		<html
			xmlns="http://www.w3.org/1999/xhtml"lang="en-US">
			<head>
				<meta http-equiv="Content-Type"content="text/html; charset=utf-8"/>
				<meta name="viewport"content="width=device-width">
					<meta name='robots'content='noindex,follow'/>
					<title>Checkout Error</title>
					<style type="text/css">html{background:#f1f1f1}body{background:#fff;color:#444;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;margin:2em auto;padding:1em 2em;max-width:700px;-webkit-box-shadow:0 1px 3px rgba(0,0,0,.13);box-shadow:0 1px 3px rgba(0,0,0,.13)}h1{border-bottom:1px solid#dadada;clear:both;color:#666;font-size:24px;margin:30px 0 0;padding:0 0 7px}#error-page{margin-top:50px}#error-page p{font-size:14px;line-height:1.5;margin:25px 0 20px}#error-page code{font-family:Consolas,Monaco,monospace}ul li{margin-bottom:10px;font-size:14px}a{color:#0073aa}a:active,a:hover{color:#00a0d2}a:focus{color:#124964;-webkit-box-shadow:0 0 0 1px#5b9dd9,0 0 2px 1px rgba(30,140,190,.8);box-shadow:0 0 0 1px#5b9dd9,0 0 2px 1px rgba(30,140,190,.8);outline:0}.button{background:#f7f7f7;border:1px solid#ccc;color:#555;display:inline-block;text-decoration:none;font-size:13px;line-height:26px;height:28px;margin:0;padding:0 10px 1px;cursor:pointer;-webkit-border-radius:3px;-webkit-appearance:none;border-radius:3px;white-space:nowrap;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;-webkit-box-shadow:0 1px 0#ccc;box-shadow:0 1px 0#ccc;vertical-align:top}.button.button-large{height:30px;line-height:28px;padding:0 12px 2px}.button:focus,.button:hover{background:#fafafa;border-color:#999;color:#23282d}.button:focus{border-color:#5b9dd9;-webkit-box-shadow:0 0 3px rgba(0,115,170,.8);box-shadow:0 0 3px rgba(0,115,170,.8);outline:0}.button:active{background:#eee;border-color:#999;-webkit-box-shadow:inset 0 2px 5px-3px rgba(0,0,0,.5);box-shadow:inset 0 2px 5px-3px rgba(0,0,0,.5);-webkit-transform:translateY(1px);-ms-transform:translateY(1px);transform:translateY(1px)}</style>
				</head>
				<body id="error-page">
					<p class="msg">Looks like an error has occurred, please notify the administrator. 
						<font color="red">
							<?php echo $msg; ?>
						</font>
					</p>
				</body>
			</html><?php   
	    exit;
    }

}

global $lumise;

$cart   = new lumise_cart( $lumise );
$result = $cart->process();

if( $result == true )
	echo $lumise->lang( 'Order Saved' );
else
	echo $lumise->lang( 'Error<br>' ) . $result;
