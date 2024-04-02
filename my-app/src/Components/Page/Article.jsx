import React , {useState} from 'react'
import { useNavigate } from 'react-router-dom';
export default function Article() {
    const token = localStorage.getItem("token");
    const SERVER_API = "https://api.realworld.io/api";
    console.log(token);
    const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [about, setAbout] = useState('');
  const [tags, setTags] = useState('');

  const handleTitleChange = (event) => {
      setTitle(event.target.value)   
    }
     const handleContentChange = (event) => {
       setContent(event.target.value);
     };

     const handleAboutChange = (event) => {
       setAbout(event.target.value);
     };

     const handleTagsChange = (event) => {
       setTags(event.target.value);
    };
    console.log(title, content, about, tags);
    //Hàm gọi data
    const postwithToken = async (url, accessToken, data) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
        console.log(data);
      return response.json();
    };

    //Hàm submit
    const handleSubmit = async (event) => {
    event.preventDefault();

      console.log(title,content,about,tags);
    const tagArray = tags.split(',');
        console.log(tagArray);
  try {
    // Gọi API đăng nhập sử dụng phương thức postwithToken
    const { articles } = await postwithToken(`${SERVER_API}/articles`, token, {
      article: {
            title: title,
        description: about,
        body:content,
        tagList: tagArray,
      },
    });

    console.log(articles);
    if (articles === undefined) {
      console.error("Thêm bài viết thất bại 1");
    } else {
      console.log("Thêm bài viết thành công!", articles);
      navigate("/");
    }
  } catch (error) {
    console.error("Thêm bài viết thất bại:", error);
  }
};

    return (
      <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input type="text" className="form-control" id="exampleInputEmail1" value={title} onChange={handleTitleChange} required />
       </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">About: </label>
          <input type="text" className="form-control" id="exampleInputEmail1"  value={about} onChange={handleAboutChange} required />
        </div>
        <div className='mb-3'>
            <div class="form-outline">
                <textarea class="form-control" id="textAreaExample2" rows="8" value={content} onChange={handleContentChange}></textarea>
                <label class="form-label" for="textAreaExample2">Message</label>
            </div>
        </div>        
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Tags:</label>
          <input type="text" className="form-control" id="exampleInputPassword1" value={tags} onChange={handleTagsChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};
