<?php
if(empty($LOCALACCESS)){
    die('no direct access allowed');
}

$student_id = $_POST['student_id'];
$query = "DELETE FROM students WHERE id = $student_id";

$result = mysqli_query($conn,$query);

$rows_insert = mysqli_affected_rows($conn);

if($rows_insert > 0){
    $output['success']=true;
    $output['data'][] = 'num rows insert '.$rows_insert;
}else{
    $output['error'][]='no data insert';
}

?>