import { useEffect, useState } from "react";
import SelectInput from "../../inputs/select";
import { Input } from "../../inputs/Input";
import { DocActionButton } from "../../buttons/DocActionButton";
import { isURL } from "../../../util/validateRegex";
import { getDataFromURL } from "../../../actions/scrape";
import { errorToast } from "../../../util/toasts";
import { getDocuments } from "../../../actions/text";
import { SearchableInput } from "../../../components/inputs/searchableInput";

function RetrieveContent({ handleSubmit = () => {}, org }) {
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
    docTitle: {
      value: "",
      error: "",
    },
  });

  const contentSourceOptions = [
    {
      label: "Custom Text",
      value: "Custom Text",
    },
    {
      label: "Document",
      value: "Document",
    },
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

    if (formValues.contentSource.value === "Document") {
      if (formValues.docTitle.value === "") {
        setFormValues({
          ...formValues,
          docTitle: {
            value: formValues.docTitle.value,
            error: "This field is required",
          },
        });
        error = true;
      }
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

    if (formValues.contentSource.value === "Custom Text" || formValues.contentSource.value === "Document") {
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

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    search_query: "",
  });

  const [documents, setDocuments] = useState([]);

  const fetchAllDocs = async () => {
    getDocuments(
      pagination.limit,
      pagination.page,
      pagination.search_query,
      org
    ).then((res) => {
      setDocuments(res?.documents);
    });
  };

  return (
    <div className="p-7 bg-white dark:bg-background-secondary-alt dark:text-white text-black-50 rounded-lg flex flex-col gap-8">
      <SelectInput
        label="Content Source"
        onChange={(value) => {
          if (value === "Document") {
            fetchAllDocs();
          }
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
      {formValues.contentSource.value === "Document" && (
        <SearchableInput
          placeholder={'Search for a document'}
          label="Select Document"
          initialValue={formValues.docTitle.value}
          error={formValues.docTitle.error}
          onChange={(value) => {
            let doc = documents.find((doc) => doc?.title === value);
            setFormValues({
              ...formValues,
              docTitle: {
                value: value,
                error: "",
              },
              contextData: {
                value: doc?.description,
                error: "",
              },
            });
          }}
          listOptions={documents.map((doc) => doc?.title)}
        ></SearchableInput>
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
