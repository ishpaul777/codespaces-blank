import { useEffect, useRef, useState } from "react";
import { ImageSearch } from "../../components/search/imagesSearch";
import {
  generateVariationsOfImage,
  getGeneratedImages,
} from "../../actions/images";
import { HashLoader } from "react-spinners";
import { isURL } from "../../util/validateRegex";
import { errorToast } from "../../util/toasts";
import sunflowerImage from "../../assets/sunflower.png";
import astronautImage from "../../assets/astronaut.png";
import brightCity from "../../assets/bright-city.png";
import madPanda from "../../assets/mad-panda.png";
import handDrawnBoat from "../../assets/handrawn-boat.png";
import foxNight from "../../assets/fox-night.png";
import catWithHat from "../../assets/cat-with-hat.png";
import davidWearingHeadphones from "../../assets/david-wearing-headphones.png";

export default function ImagePage() {
  const fileInputRef = useRef(null);

  const [imageRequest, setImageRequest] = useState({
    prompt: "",
    n: 8,
    provider: "stableDiffusion",
  });

  const handleRangeChange = (event) => {
    setImageRequest((prev) => ({ ...prev, n: Number(event.target.value) }));
  };

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

  const [modalOpen, setModalOpen] = useState(false);
  const [modalPrompt, setModalPrompt] = useState(null);

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

  const handleSearch = (imageRequest) => {
    setLoading(true);
    getGeneratedImages(imageRequest)
      .then((response) => {
        setImages(response?.map((image) => ({ ...image, isHover: false })));
      })
      .catch((error) => {
        errorToast(error?.message);
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
        setImages(response?.map((image) => ({ ...image, isHover: false })));
      })
      .catch((err) => {
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

  const defaultImagePrompts = [
    {
      url: foxNight,
      prompt: "A painting of a fox in the style of Starry Night",
    },
    {
      url: astronautImage,
      prompt: "An astronaut lounging in a tropical resort in space, vaporwave",
    },
    {
      url: catWithHat,
      prompt: "A photo of a cat with a hat on",
    },
    {
      url: davidWearingHeadphones,
      prompt:
        "A photo of Michelangelo's sculpture of David wearing headphones djing",
    },
    {
      url: brightCity,
      prompt:
        "a pencil and watercolor drawing of a bright city in the future with flying cars",
    },
    {
      url: handDrawnBoat,
      prompt: "A hand-drawn sailboat circled by birds on the sea at sunrise",
    },
    {
      url: sunflowerImage,
      prompt:
        "A photograph of a sunflower with sunglasses on in the middle of the flower in a field on a bright sunny day",
    },
    {
      url: madPanda,
      prompt: "panda mad scientist mixing sparkling chemicals, digital art",
    },
  ];

  function downloadImageFromBase64Url(base64Url, fileName) {
    // Convert the Base64 data to a Blob object
    const blob = b64toBlob(base64Url);

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    // Simulate a click on the link to trigger the download
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(link.href);
  }

  function b64toBlob(base64Data) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    const byteArray = new Uint8Array(byteArrays);
    return new Blob([byteArray], { type: "image/png" }); // Modify the MIME type if needed
  }

  return (
    <div className={`my-16 mx-10`}>
      <h2 className="text-3xl font-medium">Generate Images</h2>
      <div className={`mt-8 mr-4`}>
        <ImageSearch
          placeholder={`Handmade Unique abstract painting made with charcoal..`}
          onChange={handlePromptChange}
          handleSearch={() => handleSearch(imageRequest)}
          isLoading={loading}
          value={imageRequest.prompt}
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
        <div className="mr-4 flex gap-2">
          <div className="flex flex-row items-center space-x-2">
            <label className="text-gray-600">Image Count </label>
            <input
              type="range"
              min={1}
              max={8}
              value={imageRequest.n}
              onChange={handleRangeChange}
              className="w-32 bg-gray-300 appearance-none h-1 rounded-lg outline-none"
            />
            <span className="text-gray-600">{imageRequest.n}</span>
          </div>
          <select
            name="provider"
            className="px-4 py-2 bg-button-primary text-black rounded-lg outline-none"
            onChange={handleProviderChange}
          >
            <option value="stableDiffusion">Stable Diffusion</option>
            {/* <option value="openai">Dall E</option> */}
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
            {images && images.length > 0
              ? images.map((image, index) => {
                  return (
                    <div
                      key={index}
                      className={`w-full rounded-lg relative`}
                      onMouseEnter={() => onMouseIn(index)}
                      onMouseLeave={() => onMouseOut(index)}
                      onClick={() =>
                        downloadImageFromBase64Url(image?.url, "image.png")
                      }
                    >
                      <img
                        alt="generated logos"
                        className="rounded-lg cursor-pointer shadow-primary hover:shadow-md"
                        src={getURL(image?.url)}
                      ></img>
                      {image.isHover && (
                        <div className="absolute bg-black top-0 left-0 w-full h-full opacity-50 rounded-lg hover:block cursor-pointer"></div>
                      )}
                    </div>
                  );
                })
              : defaultImagePrompts.map((image, index) => {
                  return (
                    <div
                      key={index}
                      className={`w-full rounded-lg relative`}
                      onMouseEnter={() => onMouseIn(index)}
                      onMouseLeave={() => onMouseOut(index)}
                      onClick={() => {
                        setModalOpen(true);
                        setModalPrompt(image);
                      }}
                    >
                      <div className="relative">
                        <img
                          alt="generated logos"
                          // onClick={() => downloadImage(image?.url, 'image.png')}
                          className="rounded-lg cursor-pointer shadow-primary hover:shadow-md"
                          src={image.url}
                        ></img>
                        <div className="absolute top-0 left-0 w-full h-full flex flex-col bg-white justify-between items-start opacity-0 hover:opacity-80 cursor-pointer transition duration-300 ease-in-out">
                          <p className="text-black font-medium text-xl m-4 font-serif">
                            {image.prompt}
                          </p>
                          <p style={{ color: "#777" }} className=" text-lg m-4">
                            Click to try{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        )}
        <ExampleModal
          visible={modalOpen}
          setImageRequest={setImageRequest}
          imageRequest={imageRequest}
          imageUrl={modalPrompt?.url}
          prompt={modalPrompt?.prompt}
          handleSearch={handleSearch}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
}

const ExampleModal = ({
  imageUrl,
  prompt,
  onClose,
  visible,
  handleSearch,
  setImageRequest,
  imageRequest,
}) => {
  const overlayClasses =
    "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";
  const modalClasses =
    "fixed z-50 left-1/2 w-3/12 top-1/2 transform -translate-x-1/2 flex flex-col -translate-y-1/2 bg-white rounded-xl shadow-lg transition-alldocke duration-300 ease-in-out h-4/6";

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      className={visible ? overlayClasses : " w-0 h-0"}
      onClick={handleOverlayClick}
    >
      <div className={visible ? modalClasses : " w-0 h-0"}>
        <img src={imageUrl} className="h-full rounded-t-xl" />
        {visible && prompt && (
          <div className="bg-white text-lg my-4 text-center font-medium rounded-b-xl border-b py-3 px-4 border-gray-300">
            {prompt}
            <button
              onClick={() => {
                onClose();
                setImageRequest((prevRequest) => ({
                  ...prevRequest,
                  prompt: prompt,
                }));
                handleSearch({ ...imageRequest, prompt: prompt });
              }}
              className="w-full bg-gray-200 py-2 px-4 my-4 rounded-md hover:opacity-75"
            >
              Try this out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
