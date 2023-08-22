import React, { useEffect, useState } from "react";
import UsageChart from "./UsageChart";
import useWindowSize from "../../hooks/useWindowSize";
import MonthAndYearSelector from "../../components/date/month-and-year-selector";
import { getUsage } from "../../actions/usage";
import moment from "moment";
import { SearchableInput } from "../../components/inputs/searchableInput";
import { useSelector } from "react-redux";

function Usage() {
  // isMobileScreen is true if the screen width is less than 640px
  const { isMobileScreen } = useWindowSize();

  const { selectedOrgID, isAdmin, users } = useSelector(({ organisations }) => {
    let isAdmin =
      organisations?.details?.find(
        (organisation) => organisation?.id === organisations?.selectedOrg
      )?.role === "owner";

    let users = organisations?.details?.find(
      (organisation) => organisation?.id === organisations?.selectedOrg
    )?.organisation_users;
    return {
      selectedOrgID: organisations?.selectedOrg,
      isAdmin,
      users,
    };
  });

  const tableHeader = [
    {
      name: "Users",
      width: "w-1/5",
    },
    {
      name: "Credits Used",
      width: "w-1/5",
    },
    {
      name: "Generations",
      width: "w-1/5",
    },
    {
      name: "Templates",
      width: "w-1/5",
    },
    {
      name: "Projects",
      width: "w-1/5",
    },
  ];

  const currentDate = new Date();
  const latestMonth = currentDate.getMonth();
  const latestYear = currentDate.getFullYear();

  const [usageData, setUsageData] = useState([]);

  const [query, setQuery] = useState({
    date: `${latestYear}-${latestMonth + 1}`,
    model: "",
    provider: "",
    type: "",
    usage_type: "daily",
    view: "admin",
    other_user_id: {
      id: 0,
      email: ""
    }
  });

  const fetchUsageData = async () => {
    const response = await getUsage({
      target_month: query.date,
      model: query.model,
      provider: query.provider,
      type: query.type,
      usage_type: query.usage_type,
      org_id: selectedOrgID,
      is_admin: isAdmin,
      view: query.view,
      other_user_id: query.other_user_id.id
    });

    setUsageData(response);
  };

  useEffect(() => {
    fetchUsageData();
  }, [query, isAdmin]);

  const styles = {
    statsButton: `px-4 py-2`,
  };


  return (
    <div className="mx-10 my-16 flex flex-col gap-6">
      {/* page header */}
      <div className="flex justify-between items-center">
        <span className="text-2xl font-semibold dark:text-white text-black">
          Usage
        </span>
      </div>
      {/* page body which will consist of the usage grapha and some other things */}
      <div className="py-6 px-4 flex flex-col gap-8">
        <div className="w-full justify-between flex items-center">
          <MonthAndYearSelector
            onNext={(date) => {
              setQuery({
                ...query,
                date,
              });
            }}
            onPrevious={(date) => {
              setQuery({
                ...query,
                date,
              });
            }}
          />
          {/* buttons for chosing type of analytics 
              - daily
              - cumulative
          */}
          <div className="flex flex-row">
            <div className="flex items-center gap-4">
              {isAdmin && (
                <div className="border border-gray-300 rounded-md">
                  <button
                    className={`${
                      styles.statsButton
                    } border-r border-gray-300 ${
                      query.view === "admin" && "bg-[#F9FAFB]"
                    }`}
                    onClick={() => {
                      setQuery({
                        ...query,
                        view: "admin",
                      });
                    }}
                  >
                    Organisation Usage
                  </button>
                  <button
                    className={`${styles.statsButton} ${
                      query.view === "user" && "bg-[#F9FAFB]"
                    }`}
                    onClick={() => {
                      setQuery({
                        ...query,
                        view: "user",
                      });
                    }}
                  >
                    Your Usage
                  </button>
                </div>
              )}
              <div className="border border-gray-300 rounded-md">
                <button
                  className={`${styles.statsButton} border-r border-gray-300 ${
                    query.usage_type === "daily" && "bg-[#F9FAFB]"
                  }`}
                  onClick={() => {
                    setQuery({
                      ...query,
                      usage_type: "daily",
                    });
                  }}
                >
                  Daily
                </button>
                <button
                  className={`${styles.statsButton} ${
                    query.usage_type === "cumulative" && "bg-[#F9FAFB]"
                  }`}
                  onClick={() => {
                    setQuery({
                      ...query,
                      usage_type: "cumulative",
                    });
                  }}
                >
                  Cumulative
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center gap-4">
          <SearchableInput
            label={'User'}
            placeholder={'Search User'}
            listOptions={users?.map((user) => user?.user?.email)}
            initialValue={query.other_user_id.email}
            onChange={(value) => {
              let user = users?.find((user) => user?.user?.email === value);
              setQuery({
                ...query,
                other_user_id: {
                  id: user?.user?.id,
                  email: value
                }
              });
            }}
          >

          </SearchableInput>
          <SearchableInput
            label={"Used for"}
            placeholder={"Search"}
            listOptions={["generate", "chat", "persona"]}
            onChange={(value) => {
              setQuery({
                ...query,
                type: value,
              });
            }}
            initialValue={query.type}
          />
          <SearchableInput
            label={"Provider"}
            placeholder={"Search Provider"}
            listOptions={["openai", "anthropic"]}
            onChange={(value) => {
              setQuery({
                ...query,
                provider: value,
              });
            }}
            initialValue={query.provider}
          />
          <SearchableInput
            label={"Model"}
            placeholder={"Search Model"}
            listOptions={["gpt-3.5-turbo", "gpt-4", "claude-2"]}
            onChange={(value) => {
              setQuery({
                ...query,
                model: value,
              });
            }}
            initialValue={query.model}
          />
        </div>
        <UsageChart
          usageData={usageData.map((data) => ({
            ...data,
            date: moment(data.date).format("DD MMM"),
          }))}
          type={query.usage_type}
        />
      </div>
    </div>
  );
}

export default Usage;
