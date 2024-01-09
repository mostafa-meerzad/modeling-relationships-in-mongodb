# Modeling Relationships in MongoDB

In real world applications the data that we're dealing with is not always self-contained entities.

## References Documents (Normalization)

In Mongoose, a popular Object Data Modeling (ODM) library for MongoDB and Node.js, you can establish relationships between documents using referencing. There are two main types of referencing in Mongoose: **population** and **manual referencing**.

## 1. Population (Using `populate()` method):

Population involves storing references to documents from another collection and using the `populate()` method to replace these references with the actual documents when querying.

### Example:

Suppose you have two Mongoose schemas, `Author` and `Book`, where each `Book` document references an `Author`:

```javascript
const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: String,
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

const bookSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
});

const Author = mongoose.model("Author", authorSchema);
const Book = mongoose.model("Book", bookSchema);
```

In this example:

- The `books` array in the `Author` schema stores `Book` document IDs.
- The `author` field in the `Book` schema stores the ID of the corresponding `Author` document.

Now, you can use the `populate()` method to retrieve the actual documents when querying:

```javascript
// Populate books for an author
Author.findOne({ name: "John Doe" })
  .populate("books")
  .exec((err, author) => {
    console.log(author);
  });

// Populate author for a book
Book.findOne({ title: "The Book Title" })
  .populate("author")
  .exec((err, book) => {
    console.log(book);
  });
```

## 2. Manual Referencing:

Manual referencing involves embedding document references directly in the documents.

### Example:

```javascript
const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: String,
});

const bookSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
});

const Author = mongoose.model("Author", authorSchema);
const Book = mongoose.model("Book", bookSchema);
```

In this example:

- The `author` field in the `Book` schema stores the ID of the corresponding `Author` document.

You can still use the `populate()` method in the same way as in the previous example to retrieve the full `Author` document when querying for a `Book`.

Choose between population and manual referencing based on your application's requirements and performance considerations. Populating is useful when you need to retrieve related documents frequently, while manual referencing may be more efficient when querying is less frequent.

## The "ref" Property

In Mongoose, the `ref` property is used to establish a reference between two schemas. It is particularly relevant when you're working with population, allowing you to specify the target model to which the `ObjectId` in a particular field refers.

Here's a more detailed explanation of the `ref` property:

### 1. Usage with Population:

In the context of population, the `ref` property is used to tell Mongoose which model the `ObjectId` in a particular field references. This is important when you use the `populate()` method to replace these `ObjectId` references with actual documents.

For example:

```javascript
const authorSchema = new mongoose.Schema({
  name: String,
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

const bookSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
});
```

In the `authorSchema`, the `ref: 'Book'` indicates that the `books` array contains references to documents from the `'Book'` model. Similarly, in the `bookSchema`, `ref: 'Author'` indicates that the `author` field contains references to documents from the `'Author'` model.

### 2. Cross-Referencing Models:

You can cross-reference models, allowing documents in one collection to reference documents in another. This is common in scenarios where you have relationships between different entities in your application.

For example:

```javascript
const userSchema = new mongoose.Schema({
  username: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
```

Here, the `posts` array in the `User` model references documents in the `'Post'` model, and the `author` field in the `Post` model references documents in the `'User'` model.

### 3. Population Syntax:

When using `populate()`, you specify the field to be populated. In the examples above, you can use `populate('books')` or `populate('author')` to populate the `books` array in the `Author` model or the `author` field in the `Book` model, respectively.

```javascript
Author.findOne({ name: "John Doe" })
  .populate("books")
  .exec((err, author) => {
    console.log(author);
  });

Book.findOne({ title: "The Book Title" })
  .populate("author")
  .exec((err, book) => {
    console.log(book);
  });
```

In summary, the `ref` property is essential for establishing relationships between models in Mongoose. It ensures that Mongoose knows which model to use when populating fields with `ObjectId` references, creating a clear association between different collections in your MongoDB database.

### Note:

In Mongoose, the `exec()` function is used to execute a query. It is often used at the end of a Mongoose query chain to initiate the execution of the query. The `exec()` function takes a callback function as an argument, and this callback will be invoked once the query has been executed.

Here's a breakdown of the code you provided:

```javascript
Book.findOne({ title: "The Book Title" })
  .populate("author")
  .exec((err, book) => {
    console.log(book);
  });
```

- `Book.findOne({ title: 'The Book Title' })`: This part creates a query to find a single document in the 'Book' collection with the specified title.

- `.populate('author')`: This part tells Mongoose to replace the `author` field, which contains an `ObjectId` reference, with the actual document from the 'Author' collection when executing the query. This is possible because of the previous use of the `ref` property when defining the schema.

- `.exec((err, book) => { console.log(book); })`: This part calls the `exec()` function to execute the query. The callback function `(err, book) => { console.log(book); }` is provided as an argument to `exec()`. This callback will be invoked once the query is complete. It receives two parameters: `err` (an error object, if an error occurred during the query) and `book` (the result of the query, which is the populated 'Book' document in this case).

### When to use `exec()`:

1. **Handling Results:** If you need to handle the results of a query, you use `exec()` with a callback to process the data returned from the database.

2. **Error Handling:** The `err` parameter in the callback allows you to handle any errors that might occur during the execution of the query. If there's an error, `err` will contain information about it.

3. **Asynchronous Execution:** Mongoose queries are typically asynchronous, and `exec()` is a way to explicitly manage the asynchrony by providing a callback function.

```javascript
Book.findOne({ title: "The Book Title" }).exec((err, book) => {
  if (err) {
    console.error(err);
    // Handle the error
  } else {
    console.log(book);
    // Process the result
  }
});
```

In summary, `exec()` is used to execute Mongoose queries and provides a way to handle both the results and potential errors in a callback function. It's especially useful when dealing with asynchronous operations in Node.js.

## Using Embedded Documents (DeNormalization)

In Mongoose, embedding documents involves nesting one schema within another, allowing you to store documents within documents. This is an alternative to referencing documents, which involves storing references to documents in other collections. Embedding is often used when there is a one-to-many or one-to-few relationship between entities, and the data in the embedded documents is tightly related to the parent document.

Let's go through an example to illustrate how you can embed documents in Mongoose:

```javascript
const mongoose = require("mongoose");

// Define a schema for the embedded documents (Comment)
const commentSchema = new mongoose.Schema({
  text: String,
  user: String,
});

// Define a schema for the parent document (Post) that embeds the Comment schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  comments: [commentSchema], // Embedding Comment documents
});

// Create models based on the schemas
const Post = mongoose.model("Post", postSchema);

// Create a new post with embedded comments
const newPost = new Post({
  title: "My First Post",
  content: "This is the content of my post.",
  comments: [
    { text: "Great post!", user: "User1" },
    { text: "I enjoyed reading this.", user: "User2" },
  ],
});

// Save the post to the database
newPost.save((err, savedPost) => {
  if (err) {
    console.error(err);
  } else {
    console.log(savedPost);
  }
});
```

In this example:

1. The `commentSchema` defines the structure of the embedded documents (comments) with fields such as `text` and `user`.
2. The `postSchema` includes an array field `comments`, which is of type `commentSchema`. This is where the Comment documents will be embedded within the Post document.
3. When creating a new Post, you can include an array of Comment objects directly in the `comments` field.
4. The `save()` method is used to save the new post to the database.

When querying for a post, you will get both the post data and the embedded comments:

```javascript
// Query for a post and its embedded comments
Post.findOne({ title: "My First Post" }, (err, post) => {
  if (err) {
    console.error(err);
  } else {
    console.log(post);
  }
});
```

In summary, embedding documents in Mongoose involves defining a schema for the embedded documents and then including that schema as a field in the parent document's schema. This approach is suitable when the data in the embedded documents is closely related to the parent document and doesn't need to be referenced independently.
