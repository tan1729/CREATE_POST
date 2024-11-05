import {
  CommentAdded as CommentAddedEvent,
  PostCreated as PostCreatedEvent,
  PostDisliked as PostDislikedEvent,
  PostLiked as PostLikedEvent
} from "../generated/Graphite/Graphite"
import {
  CommentAdded,
  PostCreated,
  PostDisliked,
  PostLiked
} from "../generated/schema"

export function handleCommentAdded(event: CommentAddedEvent): void {
  let entity = new CommentAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.postId = event.params.postId
  entity.commentId = event.params.commentId
  entity.commenter = event.params.commenter
  entity.text = event.params.text

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePostCreated(event: PostCreatedEvent): void {
  let entity = new PostCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.Graphite_id = event.params.id
  entity.author = event.params.author
  entity.contentURI = event.params.contentURI

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePostDisliked(event: PostDislikedEvent): void {
  let entity = new PostDisliked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.Graphite_id = event.params.id
  entity.disliker = event.params.disliker

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePostLiked(event: PostLikedEvent): void {
  let entity = new PostLiked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.Graphite_id = event.params.id
  entity.liker = event.params.liker

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
