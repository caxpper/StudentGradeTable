<?php
    $conn =mysqli_connect("localhost", "root", "root", "sgt", 3306);

    if(empty($conn)){
        die('invalid database connection');
    }
?>