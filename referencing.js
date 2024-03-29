const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/modelingRelationships")
  .then(() => {
    console.log("connected to DB");
  })
  .catch((e) => {
    throw new Error(e);
  });

const Author = mongoose.model(
  "Author",
  new mongoose.Schema({
    name: String,
    bio: String,
    website: String,
  })
);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
  })
);

async function createAuthor(name, bio, website) {
  const author = new Author({
    name,
    bio,
    website,
  });
  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name,
    author,
  });
  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find().populate("author", "name -_id").select("name author");
  console.log(courses);
}

// createAuthor("Mostafa", "My bio", "My website");
// createCourse("NodeJs Course", "659c39678d41bfcfe7d8413b");
// createCourse("NodeJs Course", "1");
listCourses();
