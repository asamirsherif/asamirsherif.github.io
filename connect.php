<?php

require require 'firebase-php-master/src/firebaseLib.php';
$state = $_GET["state"];

$url = 'https://smat-flowmac.firebaseio.com/'; 
$token = 'cnML07dWO9ajaE8J0uLle2q5x13ntbVGoeCLQ9um'; 

$DEFAULT_PATH = '/control/-MEJLe-8j-v9FRarMaa6';

$_devicestatus= array(
'operationMode' => $state,
);

 

$firebase = new \Firebase\FirebaseLib($url, $token);
$firebase->update($DEFAULT_PATH, $_devicestatus);

print("Update Done");
?>