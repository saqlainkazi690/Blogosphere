import { useNavigate, useParams } from "react-router-dom"
import Comments from "../components/Comments"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import {BiEdit} from 'react-icons/bi'
import {MdDelete} from 'react-icons/md'
import axios from "axios"
import { URL,IF } from "../url"
import { useContext, useEffect, useState, useCallback } from "react"
import { UserContext } from "../context/UserContext"
import Loader from "../components/Loader"
import { FcManager } from "react-icons/fc";
import { Link } from "react-router-dom";

const PostDetails = () => {
  const postId = useParams().id
  const [post, setPost] = useState({})
  const {user} = useContext(UserContext)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  
  const fetchPost = useCallback(async() => {
    setLoading(true)
    try {
      const res = await axios.get(URL+"/api/posts/"+postId, {withCredentials: true})
      setPost(res.data)
      setError("")
    }
    catch(err) {
      setError(err.response?.data || "Error fetching post")
    }
    finally {
      setLoading(false)
    }
  }, [postId])

  const handleDeletePost=async ()=>{
    try{
      const res=await axios.delete(URL+"/api/posts/"+postId,{withCredentials:true})
      navigate("/")
    }
    catch(err){
      setError(err.response?.data || "Error deleting post")
    }
  }

  const fetchPostComments = useCallback(async() => {
    try {
      const res = await axios.get(URL+"/api/comments/post/"+postId, {withCredentials: true})
      setComments(Array.isArray(res.data) ? res.data : [])
    }
    catch(err) {
      console.error("Error fetching comments:", err)
      setComments([])
    }
  }, [postId])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  useEffect(() => {
    fetchPostComments()
  }, [fetchPostComments])

  const handlePostComment = async() => {
    if (!user) {
      navigate("/login")
      return
    }

    if (!commentText.trim()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      await axios.post(URL+"/api/comments/create", {
        comment: commentText.trim(),
        author: user.username,
        postId: postId,
        userId: user._id
      }, {
        withCredentials: true
      })

      setCommentText("")
      await fetchPostComments()
    }
    catch(err) {
      setError(err.response?.data || "Error posting comment")
    }
    finally {
      setLoading(false)
    }
  }

  if(loading && !comments.length) {
    return (
      <div>
        <Navbar/>
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Loader/>
        </div>
        <Footer/>
      </div>
    )
  }
  
  return (
    <div>
      <Navbar/>
      <div className="px-4 md:px-[200px] mt-8">
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <div className="border p-8 shadow-lg rounded-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-black md:text-4xl">{post.title}</h1>
            {user?._id===post?.userId && (
              <div className="flex items-center justify-center space-x-4">
                <p className="cursor-pointer text-xl hover:text-blue-500" onClick={()=>navigate("/edit/"+postId)}>
                  <BiEdit/>
                </p>
                <p className="cursor-pointer text-xl hover:text-red-500" onClick={handleDeletePost}>
                  <MdDelete/>
                </p>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4 md:mt-6">
            <div className="flex items-center">
              <FcManager className="text-2xl mr-2"/>
              <span className="font-medium">By {post.username}</span>
            </div>
            <div className="text-gray-600">
              {new Date(post.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center">
            {post.photo && (
              <img 
                src={IF+post.photo} 
                className="w-full max-w-2xl h-auto object-cover rounded-lg shadow-md" 
                alt={post.title}
              />
            )}
            <p className="mt-8 text-lg leading-relaxed w-full max-w-3xl">{post.desc}</p>
            
            {post.categories?.length > 0 && (
              <div className="mt-8 w-full max-w-3xl">
                <p className="font-semibold mb-2">Categories:</p>
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((c,i)=>(
                    <div key={i} className="bg-gray-100 rounded-full px-4 py-1 text-sm">
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 w-full max-w-3xl mx-auto">
              <h3 className="text-xl font-semibold mb-6">Comments</h3>
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <Comments 
                      key={comment._id} 
                      c={comment} 
                      post={post}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500">No comments yet</p>
                )}
              </div>

              {user ? (
                <div className="mt-8">
                  <div className="flex gap-4">
                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      type="text"
                      placeholder="Write a comment"
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handlePostComment}
                      disabled={loading || !commentText.trim()}
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                    >
                      {loading ? "Posting..." : "Post"}
                    </button>
                  </div>
                  {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                </div>
              ) : (
                <p className="text-center text-gray-600 mt-4">
                  Please <Link to="/login" className="text-blue-500 hover:underline">login</Link> to comment
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default PostDetails