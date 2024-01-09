const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/modelingRelationships")
  .then(() => {
    console.log("connected to DB");
  })
  .catch((e) => {
    throw new Error(e);
  });

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    author: authorSchema,
  })
);

async function createCourse(name, author) {
  const course = new Course({
    name,
    author,
  });
  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId) {
  // const course = await Course.findOne({ _id: courseId });
  // subDocuments can only be saved in the context of their parent
  // course.author.name = "Mosh Hamadani";
  // const result = await course.save();
  // console.log(result)
  // --------------------
  const course = await Course.updateOne(
    { _id: courseId },
    { $set: { "author.name": "John" } }
  );
  console.log(course);
}

async function removeAuthor(courseId) {
  // removing just one part of the subDocument
  // const course = await Course.updateOne(
  // { _id: courseId },
  // { $unset: {"author.name": ""} }
  // );
  // removing the subDocument as a whole
  const course = await Course.updateOne(
    { _id: courseId },
    { $unset: { author: "" } }
  );
  console.log(course);
}

// createCourse("NodeJs Course", new Author({name:"Mostafa", bio:"My Bio", website:"My website"}));
// updateAuthor("659d1f6a18c368a41abe7990");
// listCourses();
removeAuthor("659d1f6a18c368a41abe7990");
