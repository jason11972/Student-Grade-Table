/**
 * Created by Jason Wilson on 5/9/2016.
 */
/**
 * Define all global variables here
 */

var spinner = $('<img>', {
    src: 'http://www.gifstache.com/images/ajax_loader.gif',
    style: 'width: 20px',
    id: 'spinner'
});
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [];
/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds = ['studentName', 'studentCourse', 'studentGrade'];
/**
 * addClicked - Event Handler when user clicks the add button
 */
function addClicked() {
    //when the Add button is clicked it takes the info from the variables and runs that info through the functions that follow//
    var name = $('#studentName').val();
    var course = $('#studentCourse').val();
    var grade = $('#studentGrade').val();
    addStudent(name, course, grade);
    updateData();
    calculateAverage();
    clearAddStudentForm()
}
/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked() {
    clearAddStudentForm();
}
/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent(name, course, grade) {
    //creates a var called student and stores the info from the input fields in the var and pushes into the array//
    var student = {
        name: name,
        course: course,
        grade: grade
    };
    student_array.push(student);
    addStudentToDom(student);
    //sending new student info to the database//
    $.ajax({
        //use same ajax call structure as below when requesting info from database, but change end of url to 'create'//
        method:'post',
        url: 'http://s-apis.learningfuze.com/sgt/create',
        dataType: 'json',
        //this is what i'm sending the DB.  sending the api key and the data i want to add to the DB//
        data: {
            api_key: 'BuFrdBm3xf',
            //sending the student info along with the api key//
            name: student.name, course: student.course, grade: student.grade},
            success: function (student) {
                if (result.success) {
                    alert("Your data has been sent");
                    student_array.push(student);
                }
            }
    })
}
    /**
     * clearAddStudentForm - clears out the form values based on inputIds variable
     */
    function clearAddStudentForm() {
        $('#studentName').val('');
        $('#studentCourse').val('');
        $('#studentGrade').val('');
        // i'm guessing that to clear the form, i need to clear the domains, resets value back to empty**/
    }
    /**
     * calculateAverage - loop through the global student array and calculate average grade and return that value
     * @returns {number}
     */
    //calculates the average grade by going through the array of students, parseInt the grade they have, then take that total of all grades and divide by the length of array...aka number of students//
    function calculateAverage() {
        var total = 0;
        for (var i = 0; i < student_array.length; i++) {
            total += parseInt(student_array[i].grade);
        }
        return Math.round(total / student_array.length);
    }
    /**
     * updateData - centralized function to update the average and call student list update
     */
    function updateData() {
        //if a student is added or subtracted the dom updates to show the new grade average and updates the student list//
        var avg = calculateAverage();
        $('.avgGrade').html(avg);
        updateStudentList();
    }
    /**
     * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
     */
    function updateStudentList() {
        for (var i = 0; i < student_array.length; i++) {
            student_array[i];
        }
    }
    /**
     * addStudentToDom - take in a student object, create html elements from the values and then append the elements
     * into the .student_list tbody
     * @param studentObj
     */
//this really screwed me up.  i thought per the instructions above the object being taken into the function needed to be named studentObj....so because of that it wasnt reading the info in the variables below, wasnt displaying the variables on the table, wasnt grabbing the grades for the calculateAverage function.//
    function addStudentToDom(student) {
        //all the vars below take in the text from the addStudent function and puts that info into a table.//
        var add_row = $('<tr>', {
            id: student.idnumber
        });
        var add_name = $('<td>').text(student.name);
        var add_course = $('<td>').text(student.course);
        var add_grade = $('<td>').text(student.grade);
        //the last column "Operations" is blank until you click the add button.  when that's clicked the new class is added to the html that contains the delete button//
        var add_operations = $('<button>').addClass('btn btn-danger btn-sm').html('delete').on('click', deleteClicked);
        //the row is then added and the info from all the variables(name, course, grade) are all added to the table along with the add_operations variable that creates the delete button//
        add_row.append(add_name, add_course, add_grade, add_operations);
        $('.student-list tbody').append(add_row);
    }
    /**
     * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
     */
    function deleteClicked() {
        console.log("$(this).attr('id'): ", $(this).parent().attr('id'));
        //the buttonRow var is to show what you clicked delete on,
        var buttonRow = $(this).parent().attr('id');
        //this next var is for deleting from the local dom only, not the ajax delete request.  we want to delete an entire row when the button is clicked.  "this" recognizes what you clicked on, in this case it's the delete button.  it then adds everything thats a parent of the button to var delete_row//
        var delete_row = $(this).parent();
        //it goes into the array and splices out the row you clicked on//
        student_array.splice(delete_row.index(), 1);
        //it then removes the row from the dom only//
        delete_row.remove();
        //then you need the updateData function to run again so that it recalculates the student data, grade average, etc//
        updateData();
        //THIS AJAX DELETE REQUEST DOES NOT WORK.  THE REQUEST COMES BACK SUCCESSFUL, BUT THE CONSOLE SAYS ""Unable to delete, you are not authorized to delete student"//
        $.ajax({
            //use same ajax call structure as below when requesting info from database, but change end of url to 'delete'//
            method: 'post',
            url: 'http://s-apis.learningfuze.com/sgt/delete',
            dataType: 'json',
            //this is what i'm sending the DB.  sending the api key and the data i want to delete from the DB//
            data: {
                api_key: 'BuFrdBm3xf',
                student_id: buttonRow
                },
                success: function (result) {
                    console.log('delete ajax result: ', result);
                }
        })
    }
//when get data button is clicked//
    function getDataClicked() {
        //ajax call to get DB from server//
        $.ajax({
            dataType: 'json',
            url: 'http://s-apis.learningfuze.com/sgt/get',
            method: 'POST',
            data: {api_key: 'BuFrdBm3xf'},
            success: function (result) {
                console.log(result);
                //check if success is true//
                if (result.success === true) {
                    $('#spinner').remove();
                    // if yes, iterate through result data//
                    for (var i = 0; i < result.data.length; i++) {
                        var student = {};
                        student.name = result.data[i].name;
                        student.course = result.data[i].course;
                        student.grade = result.data[i].grade;
                        student.idnumber = result.data[i].id;
                        addStudentToDom(student);
                        updateData(student);
                        student_array.push(student);
                    }
                    console.log("Student Array is ", student_array);
                    calculateAverage();
                }
                else {
                    alert("Call for data was NOT successful");
                }
            }
        });


        /**
         * Listen for the document to load and reset the data to the initial state
         */
    }
    $(document).ready(function () {
        //when document loads it calls the getDataClicked function so that upon loading the database of students gets loaded right away//
        getDataClicked();
        $('button#getdatabutton').click(function() {
            $('button#getdatabutton').append(spinner);
        });
    });

