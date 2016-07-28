
/*
var person = {
  name: "Robby",
  age: 21
};

function updatePerson(obj) {
  obj.age = 24;
}

updatePerson(person);
console.log(person);
*/

//array example
var grades = [15, 20];

function addGrades(array) {
  array.push(40);
}

function addGradesAgain(array) {
  array = [15, 20, 40];
}


addGradesAgain(grades);
console.log(grades);

addGrades(grades);
console.log(grades);
