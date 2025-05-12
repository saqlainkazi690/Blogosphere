import axios from "axios"
import Footer from "../components/Footer"
import HomePosts from "../components/HomePosts"
import Navbar from "../components/Navbar"
import { IF, URL } from "../url"
import { useContext, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import Loader from '../components/Loader'
import { UserContext } from "../context/UserContext"

const Home = () => {
  const {search}=useLocation()
  const [posts,setPosts]=useState([])
  const [noResults,setNoResults]=useState(false)
  const [loader,setLoader]=useState(false)
  const {user}=useContext(UserContext)
  const [cat,setCat]=useState([])
  const [filterData,setFilterData] = useState([])

  const fetchPosts=async()=>{
    setLoader(true)
    try{
      const res=await axios.get(URL+"/api/posts/"+search)
      setPosts(res.data)
      setFilterData(res.data)
      let cata=res.data.map((item)=>{return item.categories})
      let sets=new Set()
      cata.forEach((category)=>{
        category?.forEach((catas)=>{
          if(catas.length>0)
          sets.add(catas)
        })
      })
      setCat(Array.from(sets))

      if(res.data.length===0){
        setNoResults(true)
      }
      else{
        setNoResults(false)
      }
      setLoader(false)
      
    }
    catch(err){
      console.log(err)
      setLoader(true)
    }
  }

  useEffect(()=>{
    fetchPosts()
  },[search])

  const fillterData=(filterDatas)=>{
    let newpost=posts.filter((pos)=>{return pos?.categories.includes(filterDatas)})
    setFilterData(newpost)
  }

  return (
    <>
    <Navbar/>
    <div className="px-8 md:px-[200px]">
      <div className="flex flex-wrap justify-center py-8">
        {cat.length>0 && cat?.map((catgory)=>(
          <button 
            key={catgory}
            className="p-3 m-2 h-[90px] w-[150px] border text-lg font-semibold bg-white hover:shadow-blue-200 shadow shadow-black" 
            onClick={()=>fillterData(catgory)}
          >
            {catgory}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {loader ? (
          <div className="h-screen flex justify-center items-center">
            <Loader/>
          </div>
        ) : !noResults ? (
          filterData.map((post)=>(
            <div key={post._id} className="w-full sm:w-[35vh] lg:w-[45vh] md:w-[50vh]">
              <Link to={user?`/posts/post/${post._id}`:"/login"}>
                <HomePosts post={post}/>
              </Link>
            </div>
          ))
        ) : (
          <h3 className="text-center font-bold mt-16">No posts available</h3>
        )}
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default Home