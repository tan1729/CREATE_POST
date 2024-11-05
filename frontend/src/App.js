// src/App.js

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from './abi.json';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { uploadToIPFS } from './ipfs'; // This function uses Pinata to upload content to IPFS

const contractAddress = '0x022414c23f3b5610d6126daae789728203948605'; // Replace with your Sepolia contract address

function App() {
  // Core state variables
  const [contract, setContract] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [address, setAddress] = useState(null);
  const [newComment, setNewComment] = useState('');

  // Initialize and load contract
  useEffect(() => {
    const initializeContract = async () => {
      if (typeof window.ethereum === 'undefined') {
        console.error("MetaMask is not installed");
        return;
      }

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, abi, signer);
        setContract(contractInstance);
        setLoading(false);
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    };

    initializeContract();
  }, []);

  // Test IPFS Upload
  const testIPFSUpload = async () => {
    const sampleData = new Blob(["Test content"], { type: 'text/plain' });
    try {
        const uri = await uploadToIPFS(sampleData);
        console.log("Test IPFS URI:", uri);
        alert("IPFS upload successful! URI: " + uri);
    } catch (error) {
        console.error("Test IPFS upload error:", error);
        alert("IPFS upload failed. Check console for details.");
    }
  };

  // Function to load posts from the blockchain
  const loadPosts = async (contractInstance) => {
    try {
        const postCount = await contractInstance.postCount();
        const loadedPosts = [];

        for (let i = 0; i < postCount; i++) {
            const post = await contractInstance.posts(i);
            console.log("Fetching post content from URI:", post.contentURI);

            try {
                const contentResponse = await fetch(post.contentURI);
                if (!contentResponse.ok) {
                    throw new Error(`Failed to fetch content: ${contentResponse.status}`);
                }

                const content = await contentResponse.json(); // Parse JSON data

                const comments = [];
                for (let j = 0; j < post.commentCount; j++) {
                    const comment = await contractInstance.getComment(i, j);
                    comments.push({
                        commenter: comment.commenter,
                        text: comment.text
                    });
                }

                loadedPosts.push({
                    id: post.id.toNumber(),
                    author: post.author,
                    content: content.content,
                    imageUrl: content.imageUrl,
                    likeCount: post.likeCount.toNumber(),
                    dislikeCount: post.dislikeCount.toNumber(),
                    comments: comments
                });
            } catch (error) {
                console.error("Error fetching post content:", error);
            }
        }
        setPosts(loadedPosts.reverse());
    } catch (error) {
        console.error('Error loading posts:', error);
    }
};


  // Function to create a new post
  const createPost = async () => {
    if (!content) {
        console.log("No content provided. Exiting createPost function.");
        return;
    }

    setCreating(true);
    console.log("Creating post started...");
    try {
        let imageUrl = '';
        if (selectedFile) {
            console.log("Uploading image to IPFS...");
            imageUrl = await uploadToIPFS(selectedFile);
            console.log("Image uploaded to IPFS with URL:", imageUrl);
        }

        const postData = { content, imageUrl, timestamp: Date.now() };
        const postJSON = JSON.stringify(postData);
        console.log("Uploading post JSON to IPFS...");
        const contentURI = await uploadToIPFS(new Blob([postJSON], { type: 'application/json' }));
        console.log("Post content uploaded to IPFS with URI:", contentURI);

        const tx = await contract.createPost(contentURI);
        console.log("Transaction sent. Waiting for confirmation...");
        await tx.wait();

        console.log("Post created successfully on the blockchain.");
        setContent('');
        setSelectedFile(null);
        await loadPosts(contract); // Refresh posts
    } catch (error) {
        console.error("Error creating post:", error);
        alert("Error creating post. Please check the console for details.");
    } finally {
        setCreating(false);
    }
  };

  // Function to like a post
  const likePost = async (postId) => {
    try {
      const tx = await contract.likePost(postId);
      await tx.wait();
      await loadPosts(contract);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Function to dislike a post
  const dislikePost = async (postId) => {
    try {
      const tx = await contract.dislikePost(postId);
      await tx.wait();
      await loadPosts(contract);
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  };

  // Function to add a comment to a post
  const addComment = async (postId) => {
    if (!newComment) return;

    try {
      const tx = await contract.addComment(postId, newComment);
      await tx.wait();
      setNewComment('');
      await loadPosts(contract);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Render loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
    
      <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Create Post</h2>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="mb-4"
        />
        <Input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="mb-4"
          accept="image/*"
        />
        <Button
          onClick={createPost}
          disabled={creating || !content}
          className="w-full"
        >
          {creating ? 'Creating...' : 'Create Post'}
        </Button>

        <Button onClick={testIPFSUpload}>Test IPFS Upload</Button>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="post">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Posted by: {post.author.slice(0, 6)}...{post.author.slice(-4)}
                  </p>
                </div>
              </div>

              <p className="text-lg mb-4">{post.content}</p>
              
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post content"
                  className="rounded-lg mb-4 max-h-96 w-full object-cover"
                />
              )}

              <div className="flex gap-4 mb-4">
                <Button
                  variant="outline"
                  onClick={() => likePost(post.id)}
                  className="flex items-center gap-2"
                >
                  👍 {post.likeCount}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => dislikePost(post.id)}
                  className="flex items-center gap-2"
                >
                  👎 {post.dislikeCount}
                </Button>
              </div>

              <div className="mt-4">
                <div className="flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1"
                  />
                  <Button
                    onClick={() => addComment(post.id)}
                    disabled={!newComment}
                  >
                    Comment
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  {post.comments.map((comment, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">
                        {comment.commenter.slice(0, 6)}...{comment.commenter.slice(-4)}
                      </p>
                      <p>{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;
