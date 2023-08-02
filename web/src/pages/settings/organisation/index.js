import { useSelector } from "react-redux";
import Wrapper from "../../../components/layout/wrapper";
import { Input } from "../../../components/inputs/Input";
import { useEffect, useState } from "react";
import { maker } from "../../../util/sluger";
import { updateOrganisation } from "../../../actions/organisation";
import { errorToast, successToast } from "../../../util/toasts";

function SettingsOrganisation() {
  const { isOwner, orgDetails } = useSelector(({ organisations }) => {
    let selectedOrg = organisations?.details?.find(
      (organisation) => organisation?.id === organisations?.selectedOrg
    );
    return {
      isOwner: selectedOrg?.role === "owner",
      orgDetails: selectedOrg,
    };
  });

  const [form, setForm] = useState({
    name: {
      value: "" || orgDetails?.title,
      error: "",
    },
    slug: {
      value: "" || orgDetails?.slug,
      error: "",
    },

    description: {
      value: "" || orgDetails?.description,
      error: "",
    },
  });

  useEffect(() => {
    setForm({
      name: {
        value: "" || orgDetails?.title,
        error: "",
      },
      slug: {
        value: "" || orgDetails?.slug,
        error: "",
      },

      description: {
        value: "" || orgDetails?.description,
        error: "",
      },
    });
  }, [orgDetails]);

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

    const payload = {
      title: form.name.value,
      slug: form.slug.value,
      description: form.description.value,
    };

    updateOrganisation(orgDetails?.id, payload)
      .then((res) => {
        successToast("Organisation updated successfully");
      })
      .catch((err) => {
        errorToast("Error in updating organisation. Please try again.");
      });
  };

  return (
    <Wrapper>
      <div className="flex flex-col gap-6">
        <span className="text-2xl text-[#1e1e1e] font-semibold">
          Organisation Settings
        </span>
        <div className="w-2/5 flex flex-col gap-4">
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
            disabled={!isOwner}
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
            disabled={!isOwner}
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
            disabled={!isOwner}
          ></Input>
          <button
            className="text-white bg-black rounded-md py-2"
            onClick={handleFormSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </Wrapper>
  );
}

export default SettingsOrganisation;
