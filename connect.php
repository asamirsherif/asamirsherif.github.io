<?php

require require 'firebase-php-master/src/firebaseLib.php';
$state = $_GET["state"];

$url = 'https://Paste url firebase.firebaseio.com/'; 
$token = 'Paste Tokoken Firebase'; 

$DEFAULT_PATH = '/smart-flowmac/control/';

$_devicestatus= array(
'operationMode' => $param1,
);

 

$firebase = new \Firebase\FirebaseLib($url, $token);
$firebase->update($DEFAULT_PATH, $_devicestatus);

print("Update Done");
?>