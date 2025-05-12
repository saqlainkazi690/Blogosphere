import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {ImCross} from 'react-icons/im'
import { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { URL } from '../url'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'

const CreatePost = () => {
   
    const [title,setTitle]=useState("")
    const [desc,setDesc]=useState("")
    const [file,setFile]=useState(null)
    const {user}=useContext(UserContext)
    const [cat,setCat]=useState("")
    const [cats,setCats]=useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const navigate=useNavigate()

    const deleteCategory=(i)=>{
       let updatedCats=[...cats]
       updatedCats.splice(i, 1)
       setCats(updatedCats)
    }

    const addCategory=()=>{
        if(cat && !cats.includes(cat)){
            let updatedCats=[...cats]
            updatedCats.push(cat)
            setCats(updatedCats)
        }
        setCat("")
    }

    const handleCreate=async (e)=>{
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            if(!title || !desc){
                setError("Title and description are required")
                setLoading(false)
                return
            }

            const post={
                title,
                desc,
                username:user.username,
                userId:user._id,
                categories:cats
            }

            if(file){
                const data=new FormData()
                const filename=Date.now()+file.name
                data.append("img",filename)
                data.append("file",file)
                post.photo=filename

                try{
                    const imgUpload=await axios.post(URL+"/api/upload",data, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        withCredentials:true
                    })
                    console.log("Image uploaded successfully")
                }
                catch(err){
                    setError("Error uploading image")
                    setLoading(false)
                    return
                }
            }

            const res=await axios.post(URL+"/api/posts/create", post, {
                withCredentials:true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            setLoading(false)
            navigate("/posts/post/"+res.data._id)

        }
        catch(err){
            setError(err.response?.data || "Error creating post")
            setLoading(false)
        }
    }

  return (
    <div>
        <Navbar/>
        <div className='flex justify-center'>
        <div className='px-6 m-4 border flex flex-col w-[70%] shadow-xl md:px-[200px] mt-8'>
            <h1 className='font-bold md:text-2xl text-2xl mt-3 flex justify-center'>Create a post</h1>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            <form className='w-full flex flex-col space-y-4 md:space-y-8 mt-4'>
                <input 
                    onChange={(e)=>setTitle(e.target.value)} 
                    type="text" 
                    placeholder='Enter post title' 
                    className='px-4 py-2 outline-none border rounded'
                    value={title}
                />
                <input 
                    onChange={(e)=>setFile(e.target.files[0])} 
                    type="file" 
                    className='px-4'
                    accept="image/*"
                />
                <div className='flex flex-col'>
                    <div className='flex items-center space-x-4 md:space-x-8'>
                        <select 
                            value={cat} 
                            onChange={(e)=>setCat(e.target.value)}
                            className='px-4 py-2 outline-none border rounded'
                        >
                            <option value="">Select Category</option>
                            <option value="Artificial Intelligence">Artificial Intelligence</option>
                            <option value="Big Data">Big Data</option>
                            <option value="Blockchain">Blockchain</option>
                            <option value="Business Management">Business Management</option>
                            <option value="Cloud Computing">Cloud Computing</option>
                            <option value="Database">Database</option>
                            <option value="Cyber Security">Cyber Security</option>
                            <option value="DevOps">DevOps</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Mobile Development">Mobile Development</option>
                            <option value="Operating System">Operating System</option>
                            <option value="Enterprise">Enterprise</option>
                        </select>
                        <div 
                            onClick={addCategory} 
                            className='bg-black text-white px-4 py-2 font-semibold cursor-pointer rounded hover:bg-gray-800'
                        >
                            Add
                        </div>
                    </div>

                    <div className='flex flex-wrap px-4 mt-3'>
                        {cats?.map((c,i)=>(
                            <div key={i} className='flex justify-center items-center space-x-2 mr-4 bg-gray-200 px-2 py-1 rounded-md mb-2'>
                                <p>{c}</p>
                                <p onClick={()=>deleteCategory(i)} className='text-white bg-black rounded-full cursor-pointer p-1 text-sm'><ImCross/></p>
                            </div>
                        ))}
                    </div>
                </div>
                <textarea 
                    onChange={(e)=>setDesc(e.target.value)} 
                    rows={9} 
                    className='px-4 py-2 outline-none border rounded' 
                    placeholder='Enter post description'
                    value={desc}
                />
                <button 
                    onClick={handleCreate} 
                    disabled={loading}
                    className='bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg rounded hover:bg-gray-800 disabled:bg-gray-400'
                >
                    {loading ? "Creating..." : "Create"}
                </button>
            </form>
        </div>
        </div>
        <Footer/>
    </div>
  )
}

export default CreatePost