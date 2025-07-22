import { createContext, useContext, useReducer, useEffect } from 'react';

const PostContext = createContext();

const postReducer = (state, action) => {
  switch (action.type) {
    case 'SET_POSTS':
      return {
        ...state,
        posts: action.payload,
        isLoading: false
      };
    case 'ADD_POST':
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    case 'TOGGLE_LIKE':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.postId
            ? {
                ...post,
                liked: !post.liked,
                likes: post.liked ? post.likes - 1 : post.likes + 1
              }
            : post
        )
      };
    case 'TOGGLE_RETWEET':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.postId
            ? {
                ...post,
                retweeted: !post.retweeted,
                retweets: post.retweeted ? post.retweets - 1 : post.retweets + 1
              }
            : post
        )
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

const initialState = {
  posts: [],
  isLoading: true
};

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  useEffect(() => {
    const storedPosts = localStorage.getItem('twitterPosts');
    if (storedPosts) {
      dispatch({ type: 'SET_POSTS', payload: JSON.parse(storedPosts) });
    } else {
      dispatch({ type: 'SET_POSTS', payload: [] });
    }
  }, []);

  const addPost = (post) => {
    const newPost = {
      ...post,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      likes: 0,
      retweets: 0,
      liked: false,
      retweeted: false
    };
    
    const updatedPosts = [newPost, ...state.posts];
    localStorage.setItem('twitterPosts', JSON.stringify(updatedPosts));
    dispatch({ type: 'ADD_POST', payload: newPost });
  };

  const toggleLike = (postId, userId) => {
    dispatch({ type: 'TOGGLE_LIKE', payload: { postId, userId } });
    const updatedPosts = state.posts.map(post =>
      post.id === postId
        ? {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          }
        : post
    );
    localStorage.setItem('twitterPosts', JSON.stringify(updatedPosts));
  };

  const toggleRetweet = (postId, userId) => {
    dispatch({ type: 'TOGGLE_RETWEET', payload: { postId, userId } });
    const updatedPosts = state.posts.map(post =>
      post.id === postId
        ? {
            ...post,
            retweeted: !post.retweeted,
            retweets: post.retweeted ? post.retweets - 1 : post.retweets + 1
          }
        : post
    );
    localStorage.setItem('twitterPosts', JSON.stringify(updatedPosts));
  };

  return (
    <PostContext.Provider value={{ ...state, addPost, toggleLike, toggleRetweet }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};