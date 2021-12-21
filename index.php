<?php 
  $mydir = 'labeled_images'; 
  
  $myfiles = array_diff(scandir($mydir), array()); 
  
  print_r($myfiles); 
?>
