const express = require('express');
const app = express();
app.use(express.json());
app.use(middleware);
app.use(logger);
const fs = require('fs');

const coursesFilePath = 'courses.json';
const readCoursesFromFile = () => {
    try {
        const data = fs.readFileSync(coursesFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading courses file:', err);
        return [];
    }
};

const writeCoursesToFile = (courses) => {
    try {
        fs.writeFileSync(coursesFilePath, JSON.stringify(courses, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing courses file:', err);
    }
};

app.get('/courses', (req, res) => {
    const courses = readCoursesFromFile();
    res.json(courses);
});

app.post('/courses', (req, res) => {
    const courses = readCoursesFromFile();
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    writeCoursesToFile(courses);
    res.json(course);
    console.log("Added new course");
});

app.put('/courses/:id', (req, res) => {
    const courses = readCoursesFromFile();
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send("Course not found");
    }
    course.name = req.body.name;
    writeCoursesToFile(courses);
    res.send(course);
    console.log("Updated course");
});

app.delete('/courses/:id', (req, res) => {
    let courses = readCoursesFromFile();
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send("Course not found");
    }
    courses = courses.filter(c => c.id !== parseInt(req.params.id));
    writeCoursesToFile(courses);
    res.send(course);
    console.log("Deleted course");
});

function middleware(req, res, next) {
    console.log("Logging...");
    next();
}

function logger(req, res, next) {
    const method = req.method;
    const ip = req.ip;
    const hostname = req.hostname;
    const date = new Date().toISOString();

    console.log(`Method: ${method}, IP: ${ip}, Hostname: ${hostname}, Date: ${date}`);
    next();
};

app.listen(3000, () => {
    console.log("Server Started");
});
