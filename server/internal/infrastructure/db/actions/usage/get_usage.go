package usage

import (
	"strings"
	"time"

	"github.com/factly/tagore/server/internal/domain/models"
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

	return usages, nil
}
