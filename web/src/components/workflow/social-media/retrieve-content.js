import { useState } from "react";
import SelectInput from "../../inputs/select";
import { Input } from "../../inputs/Input";
import { DocActionButton } from "../../buttons/DocActionButton";
import { isURL } from "../../../util/validateRegex";
import { getDataFromURL } from "../../../actions/scrape";
import { errorToast } from "../../../util/toasts";

function RetrieveContent({ handleSubmit = () => {} }) {
  const [loading, setLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    contentSource: {
      value: "Custom Text",
      error: "",
    },
    contextData: {
      value: "",
      error: "",
    },
    urlData: {
      value: "",
      error: "",
    },
  });

  const contentSourceOptions = [
    {
      label: "Custom Text",
      value: "Custom Text",
    },
    // {
    //   label: "Tagore Document",
    //   value: "Tagore Document",
    // },
    {
      label: "Fetch from a URL",
      value: "Fetch from a URL",
    },
  ];

  const validateForm = () => {
    let error = false;
    if (formValues.contentSource.value === "Custom Text") {
      if (formValues.contextData.value === "") {
        setFormValues({
          ...formValues,
          contextData: {
            value: formValues.contextData.value,
            error: "This field is required",
          },
        });
        error = true;
      }
    }

    if (formValues.contentSource.value === "Tagore Document") {
    }

    if (formValues.contentSource.value === "Fetch from a URL") {
      if (formValues.urlData.value === "") {
        setFormValues({
          ...formValues,
          urlData: {
            value: formValues.urlData.value,
            error: "This field is required",
          },
        });
        error = true;
      }
    }

    return error;
  };
  const handleClick = () => {
    if (validateForm()) {
      return;
    }

    if (formValues.contentSource.value === "Custom Text") {
      handleSubmit(formValues.contextData.value);
    }

    if (formValues.contentSource.value === "Fetch from a URL") {
      setLoading(true);
      getDataFromURL(formValues.urlData.value)
        .then((data) => {
          handleSubmit(
            `title - ${data.objects[0]?.title} \ndataInBrief - ${data?.objects[0]?.text}`
          );
        })
        .catch((e) => {
          errorToast(e?.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="p-7 bg-white dark:bg-background-secondary-alt dark:text-white text-black-50 rounded-lg flex flex-col gap-8">
      <SelectInput
        label="Content Source"
        onChange={(value) => {
          setFormValues({
            ...formValues,
            contentSource: {
              value: value,
            },
          });
        }}
        value={formValues.contentSource.value}
        error={formValues.contentSource.error}
        placeholder={"Select Content Source"}
        listOptions={contentSourceOptions}
      />
      {formValues.contentSource.value === "Custom Text" && (
        <Input
          label="Custom Text"
          error={formValues.contextData.error}
          onChange={(e) => {
            let value = e.target.value;
            if (value) {
              setFormValues({
                ...formValues,
                contextData: {
                  value: value,
                  error: "",
                },
              });
            } else {
              setFormValues({
                ...formValues,
                contextData: {
                  value: value,
                  error: "This field is required",
                },
              });
            }
          }}
        />
      )}
      {formValues.contentSource.value === "Fetch from a URL" && (
        <Input
          label="URL/Link"
          onChange={(e) => {
            let value = e.target.value;
            if (isURL(value)) {
              setFormValues({
                ...formValues,
                urlData: {
                  value: value,
                  error: "",
                },
              });
            } else {
              setFormValues({
                ...formValues,
                urlData: {
                  value: value,
                  error: "Please enter a valid URL",
                },
              });
            }
          }}
          initialValue={formValues.urlData.value}
          error={formValues.urlData.error}
          type={"input"}
          required={true}
        />
      )}
      <DocActionButton
        isPrimary={true}
        text={"Compose"}
        clickAction={(e) => {
          e.preventDefault();
          handleClick();
        }}
        isLoading={loading}
      ></DocActionButton>
    </div>
  );
}

export default RetrieveContent;
