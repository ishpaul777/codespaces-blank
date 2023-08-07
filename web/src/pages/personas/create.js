import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { isURL } from "../../util/validateRegex";
import { createPersona } from "../../actions/persona";
import { errorToast, successToast } from "../../util/toasts";
import { useNavigate } from "react-router-dom";
import PersonaForm from "./personaForm";

export default function CreatePersona() {
  const [open, setOpen] = useState(false);
  const [genOpen, setGenOpen] = useState(false);

  const navigate = useNavigate();

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

    createPersona(reqBody)
      .then((res) => {
        successToast("Persona created successfully");
        navigate("/personas/" + res.id + "/chat", {
          state: {
            name: res.name,
            desc: res.description,
            image: res.avatar,
          },
        });
      })
      .catch((err) => {
        errorToast("Unable to create persona");
      });
  };

  return (
    <PersonaForm
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      requestBody={requestBody}
      isEditForm={false}
      setOpen={setOpen}
      open={open}
      handleUpload={handleUpload}
      onDelete={onDelete}
      handleModalClose={handleModalClose}
      genOpen={genOpen}
      setGenOpen={setGenOpen}
    />
  );
}
