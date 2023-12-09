import "./ProfilePage.css";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/auth.context";
import { useTheme } from '../../context/ThemeContext';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from "axios";


function ProfilePage() {
  const [userImg, setUserImg] = useState("");
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState("");
  const { isDarkMode } = useTheme();
  const [userCities, setUsercities] = useState("");
  const [userPost, setUserPost] = useState("");
  const { user } = useContext(AuthContext);
  const authToken = localStorage.getItem("authToken");
  console.log("aaaaaaaa", user);
  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${authToken}`,
  };
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/user/${user._id}`
        );
        const userInfo = response.data;
        setUserInfo(userInfo);
      } catch (error) {
        console.log("Error feching data", error);
      }
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/posts/cities/${user._id}`,
          { headers }
        );
        const userAppHistory = response.data;
        setUserPost(userAppHistory);
        const uniqueCities = [
          ...new Set(userAppHistory.map((city) => city.city.name)),
        ];
        setUsercities(uniqueCities);

        const getPhoto = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/user/${user._id}`
        );

        setUserImg(getPhoto.data.photo);
      } catch (error) {
        console.error("Error fetching newsfeed posts:", error);
      }
    };
    fetchImage();
  }, []);


  const handleImageChange = (e) => {

    const file = e.target.files[0];


    setUserImg(URL.createObjectURL(file));
    handleSubmit(file);
  };

  const handleSubmit = async (file) => {

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const savePhoto = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user/update-profile-image/${user._id}`,
        formData,

        { headers }
      );
    } catch (error) {
      console.log(error);
    }
  };
  console.log(userPost)
  if (!userCities) {
    return <p>Loading...</p>;
  } else
    return (
      <div className={` h-screen flex flex-col ${isDarkMode ? "dark" : "light"}`}>
        {/* <img
          className="w-screen"
          src="/imgs/profileBackground/Fly-Around-the-World.jpg"
          alt=""
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div> */}
        <div className=" text-white inset-0 flex flex-col top-2 justify-start items-start p-2">
          <button onClick={() => navigate(-1)} className="cursor-pointer mt-5">
            {isDarkMode ? <img className="w-5" src="/imgs/backlight.png" alt="arrow back" /> : <img className="w-5" src="/imgs/back.png" alt="arrow back" />}
          </button>
          <div className="w-16 h-16 flex my-5 mx-10 justify-start items-center gap-3 pt-3 pb-2">
            {userImg !== undefined ? (
              <img
                className="w-18 h-18 object-cover rounded-full border-2 border-black"
                src={userImg}
                alt=""
              />
            ) : (
              <div className="top-12">
                <form
                  onSubmit={handleSubmit}
                  method="post"
                  encType="multipart/form-data"
                >
                  <label htmlFor="photo" className="cursor-pointer">
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <div className="w-16 h-16 overflow-hidden rounded-full border-2 border-white">
                      <img
                        src="/imgs/plus.png"
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </label>
                </form>
              </div>
            )}
            <h1 className="ml-4 text-xl font-bold">{userInfo.name}</h1>
          </div>
        


          {userCities.length < 4 ? (
            <div className="flex gap-8 mx-10 items-center justify-center">
              <p className="font-bold">Cities Visited:</p>
              {userCities.map((city) => (
                <p className="flex flex-col items-center" key={city}>
                  {city}
                  <img
                    className="city-img-1 w- h-8"
                    src={
                      city === "Berlin"
                        ? "/brandenburg-gate.png"
                        : city === "Paris"
                          ? "/eiffel-tower.png"
                          : city === "Madrid"
                            ? "/royal-palace.png"
                            : city === "Rome"
                              ? "/colosseum.png"
                              : "/default-image.png"
                    }
                    alt={city.name}
                  />
                </p>
              ))}
            </div>
          ) : (
            <p>
              <strong>Cities Visited {userCities.length}</strong>
            </p>
          )}

        </div>
        {/* <div>
          <h1 className="text-center text-3xl p-1 font-bold mt-5">
            Your Posts
          </h1>
        </div> */}

        <div className="flex-1 overflow-y-auto relative h-screen flex flex-col">
          {userCities.map((city) => (
            <div key={city} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{city}</h2>
              <div className="mx-10 flex gap-5 flex-wrap shadow-lg">
                {userPost
                  .filter((post) => post.city.name === city)
                  .map((filteredPost) => (
                    <Link to={`/posts/post/${filteredPost._id}`}>
                      <div className="w-20 m-10">
                        <img src={filteredPost.photo} alt="" />
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}


export default ProfilePage;
