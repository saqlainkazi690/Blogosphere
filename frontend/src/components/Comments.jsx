import axios from "axios"
import { BiEdit } from "react-icons/bi"
import { MdDelete } from "react-icons/md"
import { URL } from "../url"
import { useContext } from "react"
import { UserContext } from "../context/UserContext"

const Comments = ({c, post}) => {
  const {user} = useContext(UserContext)
  
  const deleteComment = async(id) => {
    try {
      await axios.delete(URL+"/api/comments/"+id, {withCredentials:true})
      window.location.reload(true)
    }
    catch(err) {
      console.error("Error deleting comment:", err)
    }
  }

  if (!c || typeof c !== 'object') {
    return null
  }

  return (
    <div className="px-4 py-3 bg-gray-50 rounded-lg my-2 shadow-sm hover:bg-gray-100">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-700">
          {c.author ? `@${c.author}` : 'Anonymous'}
        </h3>
        <div className="flex items-center space-x-4">
          <p className="text-gray-500 text-sm">
            {c.updatedAt ? new Date(c.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : ''}
          </p>
          {user?._id === c?.userId && (
            <button 
              onClick={() => deleteComment(c._id)}
              className="text-red-500 hover:text-red-700 transition-colors"
              title="Delete comment"
            >
              <MdDelete size={18}/>
            </button>
          )}
        </div>
      </div>
      <p className="px-4 mt-2 text-gray-600">{c.comment}</p>
    </div>
  )
}

export default Comments