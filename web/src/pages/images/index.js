import { useEffect, useRef, useState } from "react";
import { ImageSearch } from "../../components/search/imagesSearch";
import {
  generateVariationsOfImage,
  getGeneratedImages,
} from "../../actions/images";
import { HashLoader } from "react-spinners";
import { isURL } from "../../util/validateRegex";

import { errorToast } from "../../util/toasts";

export default function ImagePage() {
  const fileInputRef = useRef(null);

  const [imageRequest, setImageRequest] = useState({
    prompt: "generate interesting images",
    n: 8,
    provider: "stableDiffusion",
  });

  const onMouseIn = (index) => {
    setImages(
      images.map((image, i) => {
        if (i === index) {
          return { ...image, isHover: true };
        } else {
          return { ...image, isHover: false };
        }
      })
    );
  };

  const onMouseOut = (index) => {
    setImages(
      images.map((image, i) => {
        return { ...image, isHover: false };
      })
    );
  };

  // loading state variable to control the state of the loading button
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([]);

  useEffect(() => {
    // handleSearch();
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
        setImages(response?.map((image) => ({ ...image, isHover: false })));
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleUploadFile = (e) => {
    setLoading(true);
    generateVariationsOfImage(
      e.target.files[0],
      imageRequest.n,
      "stable-diffusion-v1-5",
      "stableDiffusion"
    )
      .then((response) => {
        console.log(response);
        setImages(response?.map((image) => ({ ...image, isHover: false })));
      })
      .catch((err) => {
        console.log();
        errorToast("error in generating variations of image " + err?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  async function toDataURL(url) {
    const blob = await fetch(url).then((res) => res.blob());
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

  // handleProviderChange is a function that handles the change in the provider select element
  const handleProviderChange = (e) => {
    setImageRequest({
      ...imageRequest,
      provider: e.target.value,
    });
  };

  const getURL = (url) => {
    if (isURL(url)) {
      return url;
    } else {
      return `data:image/png;base64,${url}`;
    }
  };

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
      {/* image variations division and a selector for choosing the generative model provider */}
      <div className="w-full mt-4 flex justify-between">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => onUploadButtonClick()}
            className={`bg-button-primary text-black px-4 py-2 rounded-lg`}
          >
            Upload Image
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => handleUploadFile(e)}
            ></input>
          </button>
          <span>to generate variations</span>
        </div>
        <div className="mr-4">
          <select
            name="provider"
            className="px-4 py-2 bg-button-primary text-black rounded-lg outline-none"
            onChange={handleProviderChange}
          >
            <option value="stableDiffusion">Stable Diffusion</option>
            <option value="openai">Dall E</option>
          </select>
        </div>
        {/* <SearchButton textColor="black" text="Upload an Image" background="button-primary">
        </SearchButton> */}
      </div>
      <div className={`mt-8`}>
        {loading ? (
          <div className={`flex justify-center mt-[20vh]`}>
            <HashLoader color={"#667085"} loading={true} size={100} />
          </div>
        ) : (
          <div className={`grid grid-cols-4 gap-4`}>
            {images?.map((image, index) => {
              return (
                <div
                  key={index}
                  className={`w-full rounded-lg relative`}
                  onMouseEnter={() => onMouseIn(index)}
                  onMouseLeave={() => onMouseOut(index)}
                >
                  <img
                    alt="generated logos"
                    // onClick={() => downloadImage(image?.url, 'image.png')}
                    className="rounded-lg cursor-pointer shadow-primary hover:shadow-md"
                    src={getURL(image?.url)}
                  ></img>
                  {image.isHover && (
                    <div className="absolute bg-black top-0 left-0 w-full h-full opacity-50 rounded-lg hover:block cursor-pointer"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
