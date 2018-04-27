/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.  
 */
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */
var student_array = [];
const apiKey = 'kw7Uq4dfnz';

/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
    addClickHandlersToElements();
    loadDataFromServer();
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements(){
    $('#addButton').click(handleAddClicked);
    $('#cancelButton').click(handleCancelClick);
    $('#loadButton').click(handleLoadDataFromServerClick);
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked(){   
    var spinner = $('<span>',{
        class:'glyphicon glyphicon-refresh glyphicon-refresh-animate'
    });
    $(this).prepend(spinner); 
     //check the conditions of the inputs
    var errorStr = '';
    if($('#studentName').val().length<2){
        errorStr += "'name' must be at least two characters long. ";
    }
    if($('#course').val().length<2){
         errorStr += "'course' must be at least two characters long. ";
    }    
    if(isNaN(parseFloat($('#studentGrade').val()))){
        errorStr += "'grade' must be a number. ";
    }
    if(errorStr ===''){
        var student = addStudent($('#studentName').val(),$('#course').val(),$('#studentGrade').val()); 
        sendNewStudentToServer(student);
    }else{
        showErrorModal(errorStr);
        $('.glyphicon-refresh-animate').remove(); 
    }
          
    
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
    clearAddStudentFormInputs();
}

/**
 * handleLoadDataFromServerClick - Event Handler when user clicks the load data button, should make a call to the server
 * and load the student data
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: loadDataFromServer
 */
function handleLoadDataFromServerClick(){
    var spinner = $('<span>',{
        class:'glyphicon glyphicon-refresh glyphicon-refresh-animate'
    });
    $(this).prepend(spinner); 
    loadDataFromServer();
}

/**
 * loadDataFromServer - Get data for the students using ajax to call the server
 */
function loadDataFromServer(){
    
    $.ajax({
        url: 'http://s-apis.learningfuze.com/sgt/get',
        method: 'POST',
        dataType: 'JSON',       
        data: {api_key:apiKey},
        success: function(data) {
            if(data.success){
                renderStudentsFromServer(data);
            }else{
                if(data.errors === undefined){
                    showErrorModal(data.error);                   
                }else{
                    showErrorModal(data.errors);                    
                }
            }
            $('.glyphicon-refresh-animate').remove();
        },
        error: function(err) {
            showErrorModal('We have some issues with the server. Please try again later.'); 
            $('.glyphicon-refresh-animate').remove();
        }
    });

}

/**
 * sendNewStudentToServer - call a server through ajax to save a student
 * 
 * @param {*} student Object with the data for th student
 */
function sendNewStudentToServer(student){

    var dataToUpload = {
        api_key:apiKey,
        name:student.name,
        course:student.course,
        grade:student.grade
    }
    $.ajax({
        url: 'http://s-apis.learningfuze.com/sgt/create',
        method: 'POST',
        dataType: 'JSON',       
        data: dataToUpload,
        success: function(data) {
            //If everything went well we add the id to the student and add the student to the array
            if(data.success){
                //We add the id value to the student
                student.id=data.new_id;
                //add the student object to the global variable student array
                student_array.push(student);                 
                updateStudentList(student_array);
                clearAddStudentFormInputs();
            }else{
                //If there is an error from interacting with the DB we show in the modal
                if(data.errors === undefined){
                    showErrorModal(data.error);                   
                }else{
                    showErrorModal(data.errors);
                }               
            }
            $('.glyphicon-refresh-animate').remove();            
        },
        //If there is an error with the call to the server we show in the modal
        error: function(err) {
            showErrorModal('We have some issues with the server. Please try again later.'); 
            $('.glyphicon-refresh-animate').remove();
        }
    });
}

/**
 * renderStudentsFromServer - We get the data from the server and add the student to the array and create
 * the DOM elements
 * 
 * @param {*} data - Data from the server with the info for students
 * @return undefined
 */
function renderStudentsFromServer(data){
    var arrayOfStudents = data.data;
    var student;
    for(var i=0; i < arrayOfStudents.length; i++){
        student = addStudent(arrayOfStudents[i].name,arrayOfStudents[i].course,arrayOfStudents[i].grade,arrayOfStudents[i].id);
        student_array.push(student); 
    }    
    clearAddStudentFormInputs();
    updateStudentList(student_array);
}

/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent(studentName,course,studentGrade,id){
   
    //take the values from the inputs in the page and create and student object with them   
    var student = {
        id:id,
        name: studentName,
        course: course,
        grade: studentGrade
    }
    
    return student;
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentObj){

    var tr = $('<tr>');
    //create a td element for every key in student object
    for(var key in studentObj){
        if(key !== 'id'){
            var td = $('<td>').text(studentObj[key]);
            tr.append(td);
        }
    }
    var td = $('<td>');
    //add a button to delete that row
    var button = $('<button>',{
        class: 'btn btn-danger btn-xs',
        type: "button",
        text: 'Delete',
        click: function () {
            var spinner = $('<span>',{
                class:'glyphicon glyphicon-refresh glyphicon-refresh-animate'
            });
            $(this).prepend(spinner); 
            //remove the student from the array
            removeStudent(studentObj,tr);
           
        }
    });
    td.append(button);
    tr.append(td);
    $('.student-list > tbody').append(tr);
}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(students){
    //empty the tbody to don't have repeated elements
    $('.student-list > tbody').empty();
    //create the html elements in the table for every student
    for(var i = 0; i < students.length; i++){
        var studentObject = students[i];
        renderStudentOnDom(studentObject);
    }
    //calculate the grade average
    var average = calculateGradeAverage(students);
    renderGradeAverage(average);
  
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(array_students){

    var average = 0;
    //go through the array of students and add the grade
    for(var i = 0; i < array_students.length; i++){
        var studentObject = array_students[i];
        average += parseFloat(studentObject.grade);
    }

    if(array_students.length === 0){
        average = 0;
    }else {
        //calculate the average
        average /= array_students.length;
    }
    return parseFloat(average.toFixed(2).toString());
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(average){
    $('.avgGrade').text(average)
}

/**
 * delete the student from the student array and recalculate the grades average
 *
 * @param studentObj The student you want to delete
 */
function removeStudent(student,trElement) {
    
    var dataToUpload = {
        api_key:apiKey,
        student_id:student.id
    }
    $.ajax({
        url: 'http://s-apis.learningfuze.com/sgt/delete',
        method: 'POST',
        dataType: 'JSON',       
        data: dataToUpload,
        success: function(data) {
            //If everything went well we add the id to the student and add the student to the array
            if(data.success){
                // look for the object in the array to get the index
                var index = student_array.indexOf(student);
                //delete the object from the array of students
                student_array.splice(index, 1);
                //recalculate the average
                var average = calculateGradeAverage(student_array);
                renderGradeAverage(average);
                 //remove the html elment (tr) from the table
                 trElement.remove();
            }else{
                if(data.errors === undefined){
                    showErrorModal(data.error);                   
                }else{
                    showErrorModal(data.errors);
                }
            }
            $('.glyphicon-refresh-animate').remove();
        },
        error: function(err) {
            showErrorModal('We have some issues with the server. Please try again later.');           
            $('.glyphicon-refresh-animate').remove();
        }
    });
    
}

function showErrorModal(error){
    $('#error').text(error);
    $('#errorsModal').modal('show');
    console.error('error:' + error);
}

