<?php
if(empty($LOCALACCESS)){
    die('no direct access allowed');
}

$query = "SELECT * FROM students";

$result = mysqli_query($conn,$query);

if($result){
    if(mysqli_num_rows($result)>0){
        $output['success']=true;
        while($row = mysqli_fetch_assoc($result)){
            $output['data'][] = $row;
        }
    }else{
        $output['error'][]='no data available';
    }
}else{
    $output['error'][] = 'query failed';
   // example // $output ['error'][count($output['error'])]='query failed';
}

?>