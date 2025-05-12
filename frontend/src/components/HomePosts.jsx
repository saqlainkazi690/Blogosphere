import { IF } from "../url"

const HomePosts = ({post}) => {
  return (
    <div className="w-full flex flex-col gap-4 mt-8 mb-4">
      <div className="flex flex-col gap-2">
        {/* Post Image */}
        <div className="h-[200px] w-full overflow-hidden rounded-lg">
          <img src={IF+post.photo} alt="" className="h-full w-full object-cover"/>
        </div>
        
        {/* Post Categories */}
        <div className="flex gap-2">
          {post.categories?.map((cat, i) => (
            <span key={i} className="text-sm text-gray-500 font-semibold">{cat}</span>
          ))}
        </div>

        {/* Post Title */}
        <h2 className="text-xl font-bold hover:text-blue-500 cursor-pointer">
          {post.title}
        </h2>

        {/* Post Author & Date */}
        <div className="flex items-center gap-2 text-gray-500">
          <p>@{post.username}</p>
          <div className="h-1 w-1 rounded-full bg-gray-500"></div>
          <p>{new Date(post.updatedAt).toLocaleDateString()}</p>
        </div>

        {/* Post Description */}
        <p className="text-gray-600 line-clamp-3">
          {post.desc}
        </p>
      </div>
    </div>
  )
}

export default HomePosts 