const { postModel } = require("../Models/userBlogPosts");

const { CustomError } = require("../Utils/CustomError");

exports.getAllPosts = async (req, res) => {
  const posts = await postModel.find();
  if (posts.length !== 0) {
    res.status(200).json({ posts: posts });
  } else {
    throw new CustomError(404, "No Posts were Found");
  }
};

exports.CreatePost = async (req, res) => {
  console.log(req.body.username);
  if (req.body.username && req.files) {
    const postdoc = new postModel({
      username: req.body.username,
      description:req.body.description || undefined,
      photos: req.files.map((file) => {
        return file.path;
      }),
    });
    postdoc
      .save()
      .then((data) => {
        res.status(201).send(data);
      })
      .catch((err) => {
        req.files.map((file) => {
          fs.unlink(file.path, (err) => {
            if (err) {
              console.error(err, "something went wrong");
            }
          });
        });

        return res.status(400).send(err.message);
      });
  }
};

exports.DeletePost = async (req, res) => {
  console.log(req.params.id);
  const deleted = await postModel.findOneAndDelete({ _id: req.params.id });
  console.log(deleted);
  if (deleted) {
    res.status(204).send("deleted successfully");
  } else {
    throw new CustomError(
      400,
      "could not find and delete " + req.params.id + " " + req.body.username
    );
  }
};

exports.getOnePost = async (req, res) => {
  const found = await postModel.findOne({ _id: req.params.id });
  if (found) {
    res.status(200).json({ found: found });
  } else {
    throw new CustomError(404, "could not find " + req.params.id + "post_id");
  }
};
