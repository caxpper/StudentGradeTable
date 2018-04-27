
<?php
    
    $name = $_POST['name'];
    $course = $_POST['course'];
    $grade = $_POST['grade'];
    
    $query = "INSERT INTO students (name, course, grade) VALUES ('$name','$course',$grade)";
    
    $result = mysqli_query($conn,$query);
    
    $rows_insert = mysqli_affected_rows($conn);
    
    if($rows_insert > 0){
        $output['success']=true;
        $output['data'][] = 'num rows insert '.$rows_insert;
    }else{
        $output['error'][]='no data insert';
    }
    
    
    ?>