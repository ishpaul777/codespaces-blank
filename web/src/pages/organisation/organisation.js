import { useState } from "react";
import { Input } from "../../components/inputs/Input";
import { maker } from "../../util/sluger";
import tagoreAILogo from "../../assets/FactlyLogotext.svg";
import { createOrganisation } from "../../actions/organisation";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../util/toasts";
import { ClipLoader } from "react-spinners";

export default function Organisation() {
  const navigate =  useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: {
      value: "",
      error: "",
    },
    slug: {
      value: "",
      error: "",
    },

    description: {
      value: "",
      error: "",
    },
  });

  const validateForm = () => {
    let error = false;
    let newForm = { ...form };
    if (!form.name.value) {
      newForm.name.error = "Name cannot be empty";
      error = true;
    }
    if (!form.slug.value) {
      newForm.slug.error = "Slug cannot be empty";
      error = true;
    }

    setForm(newForm);
    return error;
  };

  const handleFormSubmit = () => {
    if (validateForm()) return;

    setLoading(true);
    const payload = {
      title: form.name.value,
      slug: form.slug.value,
      description: form.description.value,
    };

    createOrganisation(payload)
    .then((res) => {
      successToast("Organisation created successfully");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    })
    .catch((error) => {
      errorToast("Unable to create organisation ", error?.message);
    })
    .finally(() => {
      setLoading(false);
    })
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col w-2/5 gap-2 justify-center">
        <div>
          <img src={tagoreAILogo} />
        </div>
        <h1 className="text-3xl font-bold">Welcome to Tagore</h1>
        <span className="text-base">
          Step into a world of limitless creativity and assistance with Tagore,
          your ultimate Gen AI platform! We're here to transform the way you
          write, create documents, and bring your ideas to life.
        </span>
        <div className="flex flex-col gap-4 mt-4">
          <h2 className="text-2xl font-bold">
            Get started by creating your Organisation
          </h2>
          <div className="flex flex-col gap-2">
            <Input
              label={"Name"}
              placeholder={"Enter your organisation name"}
              type={"input"}
              initialValue={form.name.value}
              error={form.name.error}
              onChange={(e) => {
                const value = e.target.value;
                if (value) {
                  setForm((prev) => ({
                    ...prev,
                    name: {
                      value,
                      error: "",
                    },
                    slug: {
                      ...prev.slug,
                      value: maker(value),
                    },
                  }));
                } else {
                  setForm((prev) => ({
                    ...prev,
                    name: {
                      value,
                      error: "Name cannot be empty",
                    },
                  }));
                }
              }}
              required={true}
            ></Input>
            <Input
              label={"Slug"}
              placeholder={"Enter your organisation slug"}
              type={"input"}
              initialValue={form.slug.value}
              onChange={(e) => {
                const value = e.target.value;
                if (value) {
                  setForm((prev) => ({
                    ...prev,
                    slug: {
                      value,
                      error: "",
                    },
                  }));
                } else {
                  setForm((prev) => ({
                    ...prev,
                    slug: {
                      ...prev.slug,
                      value,
                      error: "Slug cannot be empty",
                    },
                  }));
                }
              }}
              required={true}
              error={form.slug.error}
            ></Input>
            <Input
              label={"Description"}
              placeholder={"Describe your organisation"}
              type={"textarea"}
              initialValue={form.description.value}
              error={form.description.error}
              onChange={(e) => {
                const value = e.target.value;
                if (value) {
                  setForm((prev) => ({
                    ...prev,
                    description: {
                      value,
                      error: "",
                    },
                  }));
                } else {
                  setForm((prev) => ({
                    ...prev,
                    description: {
                      ...prev.description,
                      value,
                      error: "Description cannot be empty",
                    },
                  }));
                }
              }}
            ></Input>
            <button
              className="text-white bg-black rounded-md py-2"
              onClick={handleFormSubmit}
            >
             {
                loading ? <ClipLoader color={"white"} loading={true} size={'16px'} /> : "Create Organisation"
             }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
