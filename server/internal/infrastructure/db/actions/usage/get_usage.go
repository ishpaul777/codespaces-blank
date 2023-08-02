package usage

import (
	"sort"
	"strings"
	"time"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
)

func (p *PGUsageRepository) GetUsageByUserID(userID uint, filters models.GetUsageFilters) ([]models.GetUsageResponse, error) {
	var usages []models.GetUsageResponse

	if filters.TargetMonth == "" {
		// get current month and year and format it to YYYY-MM and set it as target month
		// this will be used to get the usage for current month
		// format for target_month is YYYY-MM
		currentTime := time.Now()
		filters.TargetMonth = currentTime.Format("2006-01")
	}

	// parse the month and year from the filters
	// format for target_month is YYYY-MM
	yearAndMonth := strings.Split(filters.TargetMonth, "-")

	query := p.client.Model(&models.Usage{}).
		Select("DATE(DATE_TRUNC('day', created_at)) as date ,SUM(total_tokens) as total_tokens, SUM(prompt_tokens) as prompt_tokens, SUM(response_tokens) as response_tokens")

	if filters.Type != "" {
		query = query.Where("type = ?", filters.Type)
	}

	if filters.Provider != "" {
		query = query.Where("provider = ?", filters.Provider)
	}

	if filters.Model != "" {
		query = query.Where("model = ?", filters.Model)
	}

	query = query.Where("DATE_PART('year', created_at) = ? AND DATE_PART('month', created_at) = ?", yearAndMonth[0], yearAndMonth[1])

	err := query.Group("DATE_TRUNC('day', created_at)").Scan(&usages).Error

	if err != nil {
		return nil, err
	}

	// get all the dates for the given month
	allDates, err := helper.GenerateAllDates(yearAndMonth[0], yearAndMonth[1])
	if err != nil {
		return nil, err
	}

	// create a map of all the dates for the given month
	// set the total_tokens, prompt_tokens and response_tokens to 0
	// this will be used to fill the missing dates in the usages
	// this is done to show the usage for all the dates in the given month
	// even if there is no usage for that date

	// Create a map to store the fetched data using the date as the key
	usageMap := make(map[string]models.GetUsageResponse)
	for i := 0; i < len(usages); i++ {
		date, err := time.Parse("2006-01-02T15:04:05Z", usages[i].Date)
		if err != nil {
			return nil, err
		}

		formattedDate := date.Format("2006-01-02")
		usageMap[formattedDate] = usages[i]
		usages[i].Date = formattedDate
	}

	// Iterate through all dates and append the missing dates with default usage data
	if filters.UsageType != "cumulative" {
		for _, date := range allDates {
			if _, exists := usageMap[date]; !exists {
				// Append missing dates with default usage data
				defaultUsage := models.GetUsageResponse{
					Date:           date,
					TotalTokens:    0,
					PromptTokens:   0,
					ResponseTokens: 0,
				}
				usages = append(usages, defaultUsage)
			}
		}

		// Sort the usages slice by date in ascending order
		sort.Slice(usages, func(i, j int) bool {
			return usages[i].Date < usages[j].Date
		})

		return usages, nil

	} else {
		cumulativeUsage := make([]models.GetUsageResponse, 0)
		// iterate through all dates and calculate the cumulative usage
		// cumulative usage is calculated by adding the usage of the current date with the usage of the previous date
		tempTotalUsage := 0
		tempPromptUsage := 0
		tempResponseUsage := 0

		for _, date := range allDates {
			if _, exists := usageMap[date]; !exists {
				// Append missing dates with default usage data
				defaultUsage := models.GetUsageResponse{
					Date:           date,
					TotalTokens:    uint(tempTotalUsage),
					PromptTokens:   uint(tempPromptUsage),
					ResponseTokens: uint(tempResponseUsage),
				}
				cumulativeUsage = append(cumulativeUsage, defaultUsage)
			} else {
				tempTotalUsage += int(usageMap[date].TotalTokens)
				tempPromptUsage += int(usageMap[date].PromptTokens)
				tempResponseUsage += int(usageMap[date].ResponseTokens)

				cumulativeUsage = append(cumulativeUsage, models.GetUsageResponse{
					Date:           date,
					TotalTokens:    uint(tempTotalUsage),
					PromptTokens:   uint(tempPromptUsage),
					ResponseTokens: uint(tempResponseUsage),
				})
			}
		}

		return cumulativeUsage, nil
	}
}
