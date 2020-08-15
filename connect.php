<?php

require require 'firebase-php-master/src/firebaseLib.php';
$state = $_GET["state"];

$url = 'https://smat-flowmac.firebaseio.com/'; 
$token = 'cnML07dWO9ajaE8J0uLle2q5x13ntbVGoeCLQ9um'; 

$DEFAULT_PATH = '/smart-flowmac/control/';

$_devicestatus= array(
'operationMode' => $param1,
);

 

$firebase = new \Firebase\FirebaseLib($url, $token);
$firebase->update($DEFAULT_PATH, $_devicestatus);

print("Update Done");
?>