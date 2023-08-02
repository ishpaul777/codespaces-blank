import { useEffect, useState } from "react";
import { Input } from "../../../components/inputs/Input";
import Wrapper from "../../../components/layout/wrapper";
import { getProfile, updateProfile } from "../../../actions/profile";
import { errorToast, successToast } from "../../../util/toasts";
import { useDispatch } from "react-redux";

function Profile() {
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState({});

  const [formData, setFormData] = useState({
    firstName: {
      value: "" || profileData?.first_name,
      error: "",
    },
    lastName: {
      value: "" || profileData?.last_name,
      error: "",
    },
    displayName: {
      value: "" || profileData?.display_name,
      error: "",
    },
    description: {
      value: "" || profileData?.description,
      error: "",
    },
  });

  useEffect(() => {
    setFormData({
      firstName: {
        value: "" || profileData?.first_name,
        error: "",
      },
      lastName: {
        value: "" || profileData?.last_name,
        error: "",
      },
      displayName: {
        value: "" || profileData?.display_name,
        error: "",
      },
      description: {
        value: "" || profileData?.description,
        error: "",
      },
    });
  }, [profileData]);

  const profileForm = [
    {
      label: "First name",
      placeholder: "Enter your first name",
      type: "input",
      required: true,
      initialValue: formData?.firstName?.value,
      error: formData?.firstName?.error,
      onChange: (e) => {
        const value = e.target.value;
        if (value) {
          setFormData((prev) => ({
            ...prev,
            firstName: {
              value,
              error: "",
            },
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            firstName: {
              value,
              error: "First name cannot be empty",
            },
          }));
        }
      },
    },
    {
      label: "Last name",
      placeholder: "Enter your last name",
      type: "input",
      required: true,
      initialValue: formData?.lastName?.value,
      error: formData?.lastName?.error,
      onChange: (e) => {
        const value = e.target.value;
        if (value) {
          setFormData((prev) => ({
            ...prev,
            lastName: {
              value,
              error: "",
            },
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            lastName: {
              value,
              error: "Last name cannot be empty",
            },
          }));
        }
      },
    },
    {
      label: "Display name",
      placeholder: "What would you like to be called?",
      type: "input",
      required: true,
      initialValue: formData?.displayName?.value,
      error: formData?.displayName?.error,
      onChange: (e) => {
        const value = e.target.value;
        if (value) {
          setFormData((prev) => ({
            ...prev,
            displayName: {
              value,
              error: "",
            },
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            displayName: {
              value,
              error: "Display name cannot be empty",
            },
          }));
        }
      },
    },
    {
      label: "Description",
      placeholder: "Enter your description",
      type: "textarea",
      required: false,
      initialValue: formData?.description?.value,
      error: formData?.description?.error,
      onChange: (e) => {
        const value = e.target.value;
        setFormData((prev) => ({
          ...prev,
          description: {
            value,
            error: "",
          },
        }));
      },
    },
  ];

  const validateForm = () => {
    let isValid = false;
    Object.keys(formData).forEach((key) => {
      // if formData value is empty
      if (!formData[key].value) {
        isValid = true;
        setFormData((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            error: `${key} cannot be empty`,
          },
        }));
      }
    });
    return isValid;
  };

  const handleProfileSubmit = () => {
    if (validateForm()) return;

    const payload = {
      first_name: formData.firstName.value,
      last_name: formData.lastName.value,
      display_name: formData.displayName.value,
      description: formData.description.value,
    };

    updateProfile(payload)
      .then(() => {
        successToast("Profile updated successfully");
      })
      .catch(() => {
        errorToast("Unable to update profile. Please try again later.");
      });
  };

  const fetchProfile = async () => {
    getProfile()
      .then((res) => {
        setProfileData(res);
        dispatch({
          type: "ADD_PROFILE",
          payload: res,
        });
      })
      .catch(() => {
        errorToast("Unable to fetch profile. Please try again later.");
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <Wrapper>
      <div className="flex flex-col gap-6">
        <span className="text-2xl text-[#1e1e1e] font-semibold">Profile</span>
        <div className="w-2/5 flex flex-col gap-4">
          {profileForm.map((form, index) => {
            return (
              <Input
                key={index}
                label={form.label}
                placeholder={form.placeholder}
                type={form.type}
                required={form.required}
                onChange={form.onChange}
                initialValue={form.initialValue}
                error={form.error}
              />
            );
          })}
          <button
            className={`text-white bg-black rounded-md py-2`}
            onClick={handleProfileSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </Wrapper>
  );
}

export default Profile;
