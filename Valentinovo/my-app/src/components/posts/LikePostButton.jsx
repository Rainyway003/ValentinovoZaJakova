import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {likePost, unlikePost} from "../../data/firebase/firebaseDatabase.js";
import {useDispatch, useSelector} from "react-redux";
import {postsSelector, setPost} from "../../data/store/postsSlice.js";
import {getLoggedInUser} from "../../data/firebase/firebaseAuth.js";

const LikePostButton = ({
  postId,
}) => {
  const dispatch = useDispatch();
  const post = useSelector(state => postsSelector.selectById(state, postId));

  const user = getLoggedInUser()
  const postAlreadyLiked = post.likes.includes(user.id)


  const likePostLocal = async () => {
    const optimisticPost = {
      ...post,
      likesCount: post.likesCount + 1,
      likes: [
        ...post.likes,
        user.id
      ]
    }
    await dispatch(setPost(optimisticPost))
    await likePost(postId)
  }

  const unlikePostLocal = async () => {
    let newLikesCount = post.likesCount - 1
    if (newLikesCount < 0) {
      newLikesCount = 0
    }
    let newLikesArray = post.likes.filter(l => l !== user.id)
    const optimisticPost = {
      ...post,
      likesCount: newLikesCount,
      likes: newLikesArray
    }
    await dispatch(setPost(optimisticPost))
    await unlikePost(postId)
  }

  return (
    <button onClick={postAlreadyLiked ? unlikePostLocal : likePostLocal}>
      {postAlreadyLiked ?
        <FavoriteIcon/>
        :
        <FavoriteBorderIcon/>
      }
    </button>
  )
}

export default LikePostButton;