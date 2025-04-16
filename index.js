const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

app.set('view engine', 'handlebars');

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}));

//This is the folder which contains static files like .css
app.use(express.static('public'));

//Implemnent Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Home route
app.get('/', (req, res) => {
    res.render('index');
});

//Hardcoded Data set for the student management system
const students = [
    {
      id: 1,
      fullName: "Ayesha Perera",
      studentID: "S001",
      email: "ayesha.perera@example.com",
      program: "Computer Application",
      year: 2,
      isInternational: false
    },
    {
      id: 2,
      fullName: "Luca Rossi",
      studentID: "S002",
      email: "luca.rossi@example.com",
      program: "Information Technology",
      year: 1,
      isInternational: true
    },
    {
      id: 3,
      fullName: "Mei Lin",
      studentID: "S003",
      email: "mei.lin@example.com",
      program: "Data Science",
      year: 3,
      isInternational: false
    },
    {
      id: 4,
      fullName: "Carlos James",
      studentID: "S004",
      email: "carlos.james@example.com",
      program: "Computer Application",
      year: 2,
      isInternational: true
    },
    {
      id: 5,
      fullName: "Emily Johnson",
      studentID: "S005",
      email: "emily.johnson@example.com",
      program: "Business Administration",
      year: 4,
      isInternational: false
    },
    {
      id: 6,
      fullName: "Ali Khan",
      studentID: "S006",
      email: "ali.khan@example.com",
      program: "Cybersecurity",
      year: 1,
      isInternational: true
    }
  ];
  
// Render the ViewStudent page and list all students in viewStudents page (HTML page) 
app.get('/viewStudents', (req, res) => {
    res.render('viewStudents', {
      title: 'Registered Student List',
      students
    });
  });

//--API endPoints starting here
// Return all registered students in JSON format (Postman)
app.get('/api/students', (req, res) => {
    res.json(students);
});

//Return specific student in Json Format(Postman)
app.get('/api/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const student = students.find(s => s.id === studentId);

    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ error: "Student not found" });
    }
});

//Add a new student to the array using Json payload(Postman)
app.post('/api/students', (req, res) => {
    // Extract data from the Json request body
    const { 
        fullName, 
        studentID, 
        email, 
        program, 
        year, 
        isInternational 
    } = req.body;

    // Create a new student object in the existing students array
    const newStudent = {
        id: students.length + 1,
        fullName,
        studentID,
        email,
        program,
        year,
        isInternational
    };
    // Add the new student to the students array
    students.push(newStudent);
    // Respond with the Success message if the creation is success!!
    res.status(201).json("Student added successfully!!!");

});

//Update existing student data using API call (Postman)
app.put('/api/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id, 10);
    const updatedData = req.body;

    const studentIndex = students.findIndex(s => s.id === studentId);

    if (studentIndex === -1) {
        return res.status(404).json({
            success: false,
            message: `Student with ID ${studentId} not found.`
        });
    }

    const student = students[studentIndex];

    // This will Update only the fields provided
    student.fullName = updatedData.fullName || student.fullName;
    student.studentID = updatedData.studentID || student.studentID;
    student.email = updatedData.email || student.email;
    student.program = updatedData.program || student.program;
    student.year = updatedData.year || student.year;
    student.dob = updatedData.dob || student.dob;
    student.isInternational = updatedData.isInternational === 'true' || student.isInternational;

    res.json({
        success: true,
        message: 'Student updated successfully.',
        student
    });
});

//Delete an existing student record(Postman)
app.delete('/api/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const index = students.findIndex(s => s.id === studentId);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `Student with ID ${studentId} not found.`
        });
    }

    const deletedStudent = students.splice(index, 1);

    res.json({
        success: true,
        message: 'Student deleted successfully.',
        student: deletedStudent[0]
    });
});
//-- API end points are ended here.

//Run the server in port 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});