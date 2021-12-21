<?php 
  /*$mydir = 'labeled_images'; 
  
  $myfiles = array_diff(scandir($mydir), array('.', '..')); 
  
  print_r($myfiles);*/
    
    
$arr="[";
foreach (new DirectoryIterator(__DIR__) as $file) {
  if ($file->isFile()) {
      $arr.="'".$file->getFilename()."'".", ";
  }
}
$arr.="]";
print_r($arr);
?> 
