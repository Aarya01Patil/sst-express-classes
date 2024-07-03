const express = require('express');
const app = express();
app.use(express.json());

let courses = [
    { id: 1, name: "Java" },
    { id: 2, name: "Python" },
    { id: 3, name: "C++" }
];

app.get('/courses', (req, res) => {
    res.json(courses);
});

app.post('/courses', (req, res) => {
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.json(course);
    console.log("Added new course");
});

app.put('/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send("Course not found");
    }
    course.name = "Spring";
    res.send(course);
    console.log("Updated course");
});

app.delete('/courses/:id', (req, res) => {  
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send("Course not found");
    }
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
    console.log("Deleted course");
});

app.listen(3000, () => {
    console.log("Server Started");
});
