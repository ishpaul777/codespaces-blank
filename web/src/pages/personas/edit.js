import { useState, useEffect } from "react";
import { isURL } from "../../util/validateRegex";
import { updatePersona } from "../../actions/persona";
import { errorToast, successToast } from "../../util/toasts";
import { useNavigate, useParams } from "react-router-dom";
import PersonaForm from "./personaForm";
import { getPersonaByID } from "../../actions/persona";
import { HashLoader } from "react-spinners";

export default function EditPersona() {
  const [open, setOpen] = useState(false);
  const [genOpen, setGenOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  let { id } = useParams();

  const [requestBody, setRequestBody] = useState({
    name: {
      value: "",
      error: "",
    },
    description: {
      value: "",
      error: "",
    },
    prompt: {
      value: "",
      error: "",
    },
    visibility: {
      value: "",
      error: "",
    },
    avatar: {
      value: "",
      error: "",
    },
  });

  useEffect(() => {
    setLoading(true);
    getPersonaByID(id)
      .then((response) => {
        console.log(response);
        const { avatar, description, name, prompt, visibility } = response;
        setRequestBody({
          name: {
            value: name,
            error: "",
          },
          description: {
            value: description,
            error: "",
          },
          prompt: {
            value: prompt,
            error: "",
          },
          visibility: {
            value: visibility,
            error: "",
          },
          avatar: {
            value: avatar,
            error: "",
          },
        });
      })
      .catch((e) => {
        console.log(e);
        errorToast("Unable to fetch persona. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestBody({
      ...requestBody,
      [name]: {
        value,
        error: "",
      },
    });
  };

  const onDelete = () => {
    setRequestBody({
      ...requestBody,
      avatar: {
        value: "",
        error: "",
      },
    });
  };

  const handleUpload = (url) => {
    setRequestBody({
      ...requestBody,
      avatar: {
        value: url,
        error: "",
      },
    });

    setOpen(false);
  };
  const handleModalClose = () => {
    setGenOpen(false);
    setOpen(false);
  };

  const validateRequestBody = () => {
    // validate name field
    // length should be greater than 3
    var isValid = true;
    if (requestBody.name.value.length < 3) {
      setRequestBody((prev) => ({
        ...prev,
        name: {
          ...prev.name,
          error: "Name should be greater than 3 characters",
        },
      }));
      isValid = false;
    }
    // validate description field
    // length should be greater than 3
    if (requestBody.description.value.length < 3) {
      setRequestBody((prev) => {
        return {
          ...prev,
          description: {
            ...prev.description,
            error: "Description should be greater than 3 characters",
          },
        };
      });
      isValid = false;
    }

    // validate prompt field
    // prompt length should be greater than 20
    if (requestBody.prompt.value.length < 20) {
      setRequestBody((prev) => {
        return {
          ...prev,
          prompt: {
            ...prev.prompt,
            error: "Prompt should be greater than 20 characters",
          },
        };
      });
      isValid = false;
    }

    // validate visibility field
    // visibility should be either public or private
    if (
      requestBody.visibility.value !== "public" &&
      requestBody.visibility.value !== "private"
    ) {
      setRequestBody((prev) => {
        return {
          ...prev,
          visibility: {
            ...prev.visibility,
            error: "Visibility should be either public or private",
          },
        };
      });
      isValid = false;
    }

    // validate avatar field
    // avatar should be a valid url
    if (!isURL(requestBody.avatar.value)) {
      setRequestBody((prev) => {
        return {
          ...prev,
          avatar: {
            ...prev.avatar,
            error: "Avatar should be a valid URL",
          },
        };
      });
      isValid = false;
    }

    return isValid;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateRequestBody();
    if (!isValid) {
      return;
    }
    const reqBody = {
      name: requestBody.name.value,
      description: requestBody.description.value,
      prompt: requestBody.prompt.value,
      visibility: requestBody.visibility.value,
      avatar: requestBody.avatar.value,
    };

    updatePersona(id, reqBody)
      .then((res) => {
        successToast("Persona saved successfully");
        navigate("/personas");
      })
      .catch((err) => {
        console.log(err);
        errorToast("Unable to save persona");
      });
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <HashLoader color="#667085" size={100} />
        </div>
      ) : (
        <PersonaForm
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          requestBody={requestBody}
          isEditForm={true}
          setOpen={setOpen}
          open={open}
          handleUpload={handleUpload}
          onDelete={onDelete}
          handleModalClose={handleModalClose}
          genOpen={genOpen}
          setGenOpen={setGenOpen}
        />
      )}
    </>
  );
}
