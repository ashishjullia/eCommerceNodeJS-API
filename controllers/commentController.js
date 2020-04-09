const Comment = require('../models/CommentModel');

const PurchaseHistory = require('../models/PurchaseHistoryModel');

const { validationResult } = require('express-validator');

const HttpError = require('../models/HttpErrorModel');


exports.fetchComments = async (req, res, next) => {
    const {productId} = req.body;
    var comments = await Comment.find({productId : productId});
    //check if there are any reviews for this product
    if(comments){
        res.status(201).json({result:true,comments:comments});
    }
    else{
        res.status(201).json({result:false,message:"no reviews for this product!"});
    }
};

exports.postComment = async (req, res, next) => {
   
    const {productId, userId , image,comment,stars } = req.body;
    const {token} = req.session;
        if(token){
        //check if user has bought the product or not
        console.log(productId);
        console.log(req.session.email);
        var purchasedProduct = await PurchaseHistory.findOne({productId : productId, username : req.session.email});
        //if product was purchased
        if(purchasedProduct){
            var review = new Comment({
                userId,
                productId,
                image,
                comment,
                stars,
            });
            const postedReview = await review.save();
            
            res.status(201).json({result:true,message:postedReview});
        }else{
            res.status(201).json({result:false,message:"User never bought this product! "});
        }
    }
    else{
        res.status(201).json({result:false,message:"User is not logged in! "});
    }
};

