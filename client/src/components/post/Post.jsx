import './post.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Users } from '../../dummyData';
import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

export default function Post({ post }) {
  const [desc, setDesc] = useState(post);
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  const { data, loading, error } = useFetch(`/users?userId=${post.userId}`);

  const likeHandler = () => {
    try {
      axios.put('/posts/' + post._id + '/like', { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const deletePost = async () => {
    try {
      const res = await axios.delete('/posts/' + post._id, {
        data: { userId: currentUser._id },
      });
      console.log(res);
      setDesc(null);
    } catch (error) {}
  };

  return (
    <div className='post'>
      {desc ? (
        loading ? (
          'please wait'
        ) : (
          <div className='postWrapper'>
            <div className='postTop'>
              <div className='postTopLeft'>
                <Link to={`profile/${data.username}`}>
                  <img
                    className='postProfileImg'
                    src={
                      data.profilePicture
                        ? PF + data.profilePicture
                        : PF + 'person/noAvatar.png'
                    }
                    alt=''
                  />
                </Link>
                <span className='postUsername'>{data.username}</span>
                <span className='postDate'>{format(desc.createdAt)}</span>
              </div>
              <div className='postTopRight'>
                {desc.userId !== currentUser._id ? (
                  <MoreVertIcon />
                ) : (
                  <DeleteSweepIcon
                    onClick={deletePost}
                    style={{ cursor: 'pointer' }}
                  />
                )}
              </div>
            </div>
            <div className='postCenter'>
              <span className='postText'>{desc?.desc}</span>
              <img className='postImg' src={PF + desc?.img} alt='' />
            </div>
            <div className='postBottom'>
              <div className='postBottomLeft'>
                {isLiked ? (
                  <ThumbUpIcon className='likeIcon' onClick={likeHandler} />
                ) : (
                  <ThumbUpOutlinedIcon
                    className='likeIcon'
                    onClick={likeHandler}
                  />
                )}

                <span className='postLikeCounter'>{like} people like it</span>
              </div>
              <div className='postBottomRight'>
                <span className='postCommentText'></span>
              </div>
            </div>
          </div>
        )
      ) : (
        <div>This post has been deleted...</div>
      )}
    </div>
  );
}
