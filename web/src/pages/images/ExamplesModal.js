import useWindowResize from '../../hooks/useWindowSize'

const ExampleModal = ({
  imageUrl,
  prompt,
  onClose,
  visible,
  handleSearch,
  setImageRequest,
  imageRequest,
}) => {
	const {isMobileScreen} = useWindowResize()

  const overlayClasses =
    "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";
  const modalClasses =
    `fixed z-50 left-1/2 ${isMobileScreen ? "w-[90vw]" : "w-3/12"}  top-1/2 transform -translate-x-1/2 flex flex-col -translate-y-1/2 bg-white rounded-xl shadow-lg transition-alldocke duration-300 ease-in-out h-4/6`;

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

export default ExampleModal;
