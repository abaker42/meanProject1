const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({ //instantiate mongoose and pass request data
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/"+ req.file.filename,
    creator: req.userData.userId
  });
  //console.log(req.userData);//test if we are indeed getting user info in post route
  //return res.status(200).json({});//makes below code unreachable bc we dont want to save
  post.save().then( createdPost => { //in order for the postID to be added to the new post we must place our
    console.log(createdPost)        //response in the then block and assign the postId in the json{} data
    res.status(201).json({
      message: 'Post added to server',
      //postId: createdPost._id
      post: {
        ...createdPost,
        id: createdPost._id,//Override post ID
        //title: createdPost.title,
        //content: createdPost.content,
        //imagePath: createdPost.imagePath
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Unable to create post!"
    });
  });
}

exports.editPost = (req, res, next) => {
  //console.log(req.file);~~ prints to nodemon server
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/"+ req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  //console.log(post);
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
    .then(result =>{
    //console.log(result);//test edit result on serverside
    if (result.n > 0){
      res.status(200).json({message: 'Updated Successfully'});
    } else {
      res.status(401).json({message: 'User unauthorized'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Could not update post!"
    });
  });
}

exports.getAllPosts = (req, res, next) =>{
  //console.log(req.query);
  const pageSize = +req.query.pageSize; //the + converts sting value to int
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if(pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  //static method available by our mongoose model check out mongoose query docs for more advanced options
  postQuery
  .then(documents => {
    //console.log(documents) for testing
    fetchedPosts = documents;
    return Post.count();
  })
  .then(count => {
    res.status(200).json({
      message: 'Posts fetch success',
      posts: fetchedPosts,
      maxPosts: count
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Post retrieval failed!"
    });
  });
}

exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id)
    .then( post => {
      if (post){
        res.status(200).json(post)
      }else {
        res.status(404).json({message: 'Post not found!'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Post retrieval failed!"
    });
  });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
  .then(result =>{
    console.log(result);
    if (result.n > 0){
      res.status(200).json({message: 'Deleted Successfully'});
    } else {
      res.status(401).json({message: 'User unauthorized'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Unable to delete post!"
    })
  });
}
