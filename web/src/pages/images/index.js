import { useEffect, useState } from "react";
import { ImageSearch } from "../../components/search/imagesSearch";
import { getGeneratedImages } from "../../actions/images";
import { HashLoader } from "react-spinners";

export default function ImagePage() {
  const [imageRequest, setImageRequest] = useState({
    prompt: "generate interesting images",
    n: 8,
    model: "openai",
  });

  // loading state variable to control the state of the loading button
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([]);

  useEffect(() => {
    handleSearch();
  }, []);

  const handlePromptChange = (e) => {
    setImageRequest({
      ...imageRequest,
      prompt: e.target.value,
    });
  };

  const handleSearch = () => {
    setLoading(true);
    getGeneratedImages(imageRequest, 1)
      .then((response) => {
        setImages(response);
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  async function toDataURL(url) {
    const blob = await fetch(url).then(res => res.blob());
    return URL.createObjectURL(blob);
  }

  async function downloadImage(url, filename) {
    const a = document.createElement("a");
    a.href = await toDataURL(url);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }



  return (
    <div className={`my-16 mx-10`}>
      <h2 className="text-3xl font-medium">Generate Images</h2>
      <div className={`mt-8 mr-4`}>
        <ImageSearch
          placeholder={`Handmade Unique abstract painting made with charcoal..`}
          onChange={handlePromptChange}
          handleSearch={handleSearch}
          isLoading={loading}
          disabled={imageRequest.prompt.length < 1}
        />
      </div>
      <div className={`mt-8`}>
        {loading ? (
          <div className={`flex justify-center mt-[20vh]`}>
            <HashLoader color={"#667085"} loading={true} size={100} />
          </div>
        ) : (
          <div className={`grid grid-cols-4 gap-4`}>
            {images.map((image, index) => {
              return (
                <div key={index} className="w-full">
                  <img onClick={() => downloadImage(image?.url, 'image.png')} className="rounded-lg cursor-pointer shadow-primary hover:shadow-md" src={image?.url}>
                  </img>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
