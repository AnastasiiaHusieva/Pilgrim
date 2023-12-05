import "./ProfilePage.css";
import { useContext, useState, useEffect, useReducer } from "react";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";
function ProfilePage() {
  const [userImg, setUserImg] = useState("");
  const [userInfo, setUserInfo] = useState("");
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
          `http://localhost:5005/user/${user._id}`
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
  console.log(userImg);
  console.log("thisis the user info", userInfo);
  console.log(userCities);
  console.log("thiiissssssss", userPost);

  const handleImageChange = (e) => {
    console.log("image changed");
    const file = e.target.files[0];

    // You can update the state to store the selected image
    setUserImg(URL.createObjectURL(file));
    handleSubmit(file);
  };

  const handleSubmit = async (file) => {
    console.log("form submitted");
    // file.preventDefault();
    try {
      const formData = new FormData();
      formData.append("photo", file);

      // Assuming you have an endpoint for updating the user's profile image
      console.log("11");
      const savePhoto = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user/update-profile-image/${user._id}`,
        formData,

        { headers }
      );
      console.log("fuckign photo", savePhoto);
    } catch (error) {
      console.log(error);
    }
  };

  if (!userCities) {
    <p>Loading...</p>;
  } else
    return (
      <div className="relative h-screen flex flex-col ">
        <img
          className="w-screen"
          src="/imgs/profileBackground/Fly-Around-the-World.jpg"
          alt=""
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div>
        <div className="absolute text-white inset-0 flex column top-2 justify-start items-start p-2">
          <h1 className="justify-self-center">Profile</h1>
          <div className="w-16 flex justify-start items-center gap-3 pt-3 pb-2">
            {userImg !== "" || undefined ? (
              <img
                className="w-18 h-18 object-cover  rounded-full border-2 border-black"
                src={userImg}
                alt=""
              />
            ) : (
              <div className="top-12 ">
                <form
                  onSubmit={handleSubmit}
                  method="post"
                  encType="multipart/form-data"
                >
                  {/* Wrap the label around the image */}
                  <label
                    htmlFor="photo"
                    className=" cursor-pointer left-12 top-10 "
                  >
                    {/* The input for selecting a file */}
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      className="hidden"
                      onChange={handleImageChange}
                    />

                    {/* Show the selected image or a default image */}
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
            <strong>{userInfo.name} </strong>
          </div>

          <div>
            <div>
              <div className="flex column items-start ">
                <p>{userInfo.email}</p>
                {userCities.length < 4 ? (
                  <>
                    <p>Cities Visited:</p>
                    {userCities.map((city) => (
                      <>
                        <p className="flex column items-start">{city}</p>
                      </>
                    ))}
                  </>
                ) : (
                  <p>
                    <strong> Cities Visited {userCities.length} </strong>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto mt-40">
            <h1 className="p-2 mt-10 ">Your activities</h1>
            {userPost.map((post) => (
              <>
                <p key={post._id}>{post.city.name}</p>
                <img src={post.photo} alt="" />
                {post.comments.map((comment) => (
                  <>
                    <p key={comment._id}>{comment.content}</p>
                  </>
                ))}
              </>
            ))}
          </div>
        </div>
      </div>
    );
}

export default ProfilePage;
