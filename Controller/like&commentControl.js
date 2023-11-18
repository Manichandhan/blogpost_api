const { likeModel, commentModel } = require("../Models/userLikes&comments");
const { postModel } = require("../Models/userBlogPosts");
const { CustomError } = require("../Utils/CustomError");

// to create a like for post
exports.likepost = async (req, res, next) => {
  try {
    const post = await postModel.findOne({ _id: req.params.id }).exec();

    if (!post) {
      throw `Couldn't find post with id ${req.params.id}`;
    }

    const likefound = await likeModel
      .findOne({
        postid: post._id,
        likedBy: req.body.username,
      })
      .exec();

    if (likefound) {
      throw `${req.body.username} already liked the post ${post._id}`;
    }

    const likedoc = new likeModel({
      postid: post._id,
      likedBy: req.body.username,
    });
    await likedoc.save();

    const liked = await postModel.findOneAndUpdate(
      { _id: likedoc.postid },
      { $inc: { likes: 1 } }
    );

    if (!liked) {
      throw `Error occurred while updating post ${likedoc.postid}`;
    }

    res.status(201).json({ liked: liked, message: "Successful like" });
  } catch (err) {
    console.error(err);
    next(new CustomError(400, err));
  }
};
// find all the likes for the post
exports.getAllLikes = async (req, res, next) => {
  const getlikes = await postModel.findOne(
    { _id: req.params.id },
    { likes: 1 }
  );
  if (!getlikes) {
    next(new CustomError(400, `no likes`));
  }
  const likedusers = await likeModel
    .find({ postid: req.params.id }, { likedBy: 1, _id: 0 })
    .exec();

  if (likedusers) {
    res.status(200).json({ likes: getlikes.likes, users: likedusers });
  }
};
// unlike a post
exports.unlikepost = async (req, res, next) => {
  const liked = await likeModel
    .findOneAndDelete({ postid: req.params.id, likedBy: req.body.username })
    .exec();
  if (!liked) {
    console.log(liked + " liked error");
    return next(
      new CustomError(400, `${req.body.username} did't have a like in post`)
    );
  }
  const dislike = await postModel.findOneAndUpdate(
    { _id: req.params.id },
    { $inc: { likes: -1 } },
    { new: true }
  );
  if (!dislike) {
    console.log(dislike + " disliked error");
    return next(new CustomError(400, `${dislike} not successfull `));
  } else {
    res.status(200).json({ dislike: dislike });
  }
};

//Create Comment
exports.comment=async (req, res, next) => {
  const findpost=await postModel.findOne({ _id: req.params.id });
   if(!findpost){
return next(new CustomError(400,`not found ${findpost}`))
   }
   const createCmt=await commentModel.create({postid:req.params.id,comment:req.body.comment,commentedBy:req.body.username})
   if(!createCmt){
     return next(new CustomError(400,`${createCmt} couldn't create comment`))
   }
   res.status(201).json({comment:createCmt})

 }

 exports.deleteComment=async(req, res,next) => {
  if(req.body.commentId){
  const result=await commentModel.findOneAndDelete({_id:req.body.commentId}).exec()
  if(!result){
   return res.status(404).send('couldn\'t find comment')
  }
return res.status(200).send(`${result} succeesfull`)
  }else if(req.body.comment && req.body.username){
    const result=await commentModel.findOneAndDelete({postid:req.params.id,comment:req.body.comment,commentedBy:req.body.username}).exec()
     if(result==null){
     return res.status(404).send('comments not found')
    }
    res.status(200).json({deleted:result})
  }

}
// get all comments
exports.getAllcomments=async (req, res, next) => {
  const allComts = await commentModel.find({ postid: req.params.id });
  if (allComts) {
    return res.status(200).json({ comments: allComts });
  } else if (allComts.length == 0) {
    return res.status(200).send("no comments on this postid${req.params.id}");
  } else {
    next(new CustomError(400, allComts));
  }
}
