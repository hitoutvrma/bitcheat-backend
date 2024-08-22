const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const path= require("path")
const cors = require("cors");
const FeedbackPost = require("./models/FeedbackPost");
const BlogPost = require("./models/BlogPost");

dotenv.config();

const app = express();
app.use(cors(
));
app.use(express.json());

// Connect to the main database
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to main database successfully");

    // Import the BlogPost model after connection
    const BlogPost = require('./models/BlogPost');
    
    // Connect to the feedback database
    return mongoose.createConnection(process.env.URI2, { useNewUrlParser: true, useUnifiedTopology: true });
  })
  .then(feedbackConnection => {
    console.log("Connected to feedback database successfully");

    // Import the FeedbackPost model using the feedback connection
    const FeedbackPost = feedbackConnection.model('FeedbackPost', require('./models/FeedbackPost').schema);
    
    // Start the server after all connections are established
    const port = process.env.PORT || 8000;
    app.listen(port, (err) => {
      if (err) console.log(err);
      console.log(`Server running successfully at port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Error", error);
  });


app.post('/api/blogs', async (req, res) => {
    try {
      const blogPost = new BlogPost(req.body);
      await blogPost.save();
      res.status(201).send(blogPost);
    } catch (err) {
      res.status(400).send(err);
    }
  });

  app.post('/api/feedback', async (req, res) => {
    try {
      const feedbackPost = new FeedbackPost(req.body);
      await feedbackPost.save();
      res.status(201).send(feedbackPost);
    } catch (err) {
      res.status(400).send(err);
    }
  });

// Get all blog posts
app.get('/api/blogs', async (req, res) => {
    try {
      const blogPosts = await BlogPost.find();
      res.status(200).send(blogPosts);
    } catch (err) {
      res.status(500).send(err);
    }
  });

// Update a blog post
app.put('/api/blogs/:id', async (req, res) => {
    try {
      const blogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!blogPost) {
        return res.status(404).send();
      }
      res.status(200).send(blogPost);
    } catch (err) {
      res.status(400).send(err);
    }
  });

  // app.get("/",(req,res)=>{
  //   app.use(express.static(path.resolve(__dirname,"frontend","build")));
  //   res.sendFile(path.resolve(__dirname,"frontend","build","index.html"))
  // })

// Delete a blog post
app.delete('/api/blogs/:id', async (req, res) => {
    try {
      const blogPost = await BlogPost.findByIdAndDelete(req.params.id);
      if (!blogPost) {
        return res.status(404).send();
      }
      res.status(200).send(blogPost);
    } catch (err) {
      res.status(500).send(err);
    }
  });