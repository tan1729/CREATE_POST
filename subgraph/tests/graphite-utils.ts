import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  CommentAdded,
  PostCreated,
  PostDisliked,
  PostLiked
} from "../generated/Graphite/Graphite"

export function createCommentAddedEvent(
  postId: BigInt,
  commentId: BigInt,
  commenter: Address,
  text: string
): CommentAdded {
  let commentAddedEvent = changetype<CommentAdded>(newMockEvent())

  commentAddedEvent.parameters = new Array()

  commentAddedEvent.parameters.push(
    new ethereum.EventParam("postId", ethereum.Value.fromUnsignedBigInt(postId))
  )
  commentAddedEvent.parameters.push(
    new ethereum.EventParam(
      "commentId",
      ethereum.Value.fromUnsignedBigInt(commentId)
    )
  )
  commentAddedEvent.parameters.push(
    new ethereum.EventParam("commenter", ethereum.Value.fromAddress(commenter))
  )
  commentAddedEvent.parameters.push(
    new ethereum.EventParam("text", ethereum.Value.fromString(text))
  )

  return commentAddedEvent
}

export function createPostCreatedEvent(
  id: BigInt,
  author: Address,
  contentURI: string
): PostCreated {
  let postCreatedEvent = changetype<PostCreated>(newMockEvent())

  postCreatedEvent.parameters = new Array()

  postCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  postCreatedEvent.parameters.push(
    new ethereum.EventParam("author", ethereum.Value.fromAddress(author))
  )
  postCreatedEvent.parameters.push(
    new ethereum.EventParam("contentURI", ethereum.Value.fromString(contentURI))
  )

  return postCreatedEvent
}

export function createPostDislikedEvent(
  id: BigInt,
  disliker: Address
): PostDisliked {
  let postDislikedEvent = changetype<PostDisliked>(newMockEvent())

  postDislikedEvent.parameters = new Array()

  postDislikedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  postDislikedEvent.parameters.push(
    new ethereum.EventParam("disliker", ethereum.Value.fromAddress(disliker))
  )

  return postDislikedEvent
}

export function createPostLikedEvent(id: BigInt, liker: Address): PostLiked {
  let postLikedEvent = changetype<PostLiked>(newMockEvent())

  postLikedEvent.parameters = new Array()

  postLikedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  postLikedEvent.parameters.push(
    new ethereum.EventParam("liker", ethereum.Value.fromAddress(liker))
  )

  return postLikedEvent
}
