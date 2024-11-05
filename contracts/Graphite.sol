// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Graphite {
    struct Post {
        uint256 id;
        address author;
        string contentURI;
        uint256 likeCount;
        uint256 dislikeCount;
        mapping(address => bool) likes;
        mapping(address => bool) dislikes;
        mapping(uint256 => Comment) comments;
        uint256 commentCount;
    }

    struct Comment {
        address commenter;
        string text;
    }

    uint256 public postCount = 0;
    mapping(uint256 => Post) public posts;

    event PostCreated(uint256 id, address author, string contentURI);
    event PostLiked(uint256 id, address liker);
    event PostDisliked(uint256 id, address disliker);
    event CommentAdded(
        uint256 postId,
        uint256 commentId,
        address commenter,
        string text
    );

    function createPost(string memory contentURI) external {
        Post storage newPost = posts[postCount];
        newPost.id = postCount;
        newPost.author = msg.sender;
        newPost.contentURI = contentURI;

        emit PostCreated(postCount, msg.sender, contentURI);
        postCount++;
    }

    function likePost(uint256 postId) external {
        Post storage post = posts[postId];
        require(!post.likes[msg.sender], "Already liked");

        post.likes[msg.sender] = true;
        post.likeCount++;

        emit PostLiked(postId, msg.sender);
    }

    function dislikePost(uint256 postId) external {
        Post storage post = posts[postId];
        require(!post.dislikes[msg.sender], "Already disliked");

        post.dislikes[msg.sender] = true;
        post.dislikeCount++;

        emit PostDisliked(postId, msg.sender);
    }

    function addComment(uint256 postId, string memory text) external {
        Post storage post = posts[postId];
        post.comments[post.commentCount] = Comment(msg.sender, text);

        emit CommentAdded(postId, post.commentCount, msg.sender, text);
        post.commentCount++;
    }
}
