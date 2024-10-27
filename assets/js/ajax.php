<?php
$un=$_POST['first_name'];
// $ph=$_POST['phone_number'];
$em=$_POST['email'];
$msg=$_POST['message'];

$to = "info@decor.com";
$subject = "My subject";
$txt = "Hello admin! query is send by the user and user details are : name : ".$un." phone : ".$ph." email : ".$em." message : ".$msg."";
$headers = "From: info@decor.com";

echo mail($to,$subject,$txt,$headers);


?>