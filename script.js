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

/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
    addClickHandlersToElements();
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements(){
    $('.btn-success').click(handleAddClicked);
    $('.btn-default').click(handleCancelClick);
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked(){
    addStudent();
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
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent(){
    //take the values from the inputs in the page and create and student object with them
    var studentName = $('#studentName').val();
    var course = $('#course').val();
    var studentGrade = $('#studentGrade').val();
    var student = {
        name: studentName,
        course: course,
        grade: studentGrade
    }
    //add the student object to the global variable student array
    student_array.push(student);
    clearAddStudentFormInputs();
    updateStudentList(student_array)
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
        var td = $('<td>').text(studentObj[key]);
        tr.append(td);
    }
    var td = $('<td>');
    //add a button to delete that row
    var button = $('<button>',{
        class: 'btn btn-danger btn-xs',
        type: "button",
        text: 'Delete',
        click: function () {
            //remove the student from the array
            removeStudent(studentObj);
            //remove the html elment (tr) from the table
            $(this).parent().parent().remove();
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
function removeStudent(studentObj) {
    // look for the object in the array to get the index
    var index = student_array.indexOf(studentObj);
    //delete the object from the array of students
    student_array.splice(index, 1);
    //recalculate the average
    var average = calculateGradeAverage(student_array);
    renderGradeAverage(average);
}



