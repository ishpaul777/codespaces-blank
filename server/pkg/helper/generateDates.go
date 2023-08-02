package helper

import (
	"fmt"
	"strconv"
	"time"
)

// generate all the dates in a month

// Helper function to generate a list of all dates for a given month-year combination
func GenerateAllDates(year, month string) ([]string, error) {
	var allDates []string

	yearInt, err := strconv.Atoi(year)
	if err != nil {
		return nil, err
	}
	monthInt, err := strconv.Atoi(month)
	if err != nil {
		return nil, err
	}

	// Calculate the last day of the month
	lastDay := time.Date(yearInt, time.Month(monthInt+1), 0, 0, 0, 0, 0, time.UTC).Day()

	for day := 1; day <= lastDay; day++ {
		date := fmt.Sprintf("%s-%02d-%02d", year, monthInt, day)
		allDates = append(allDates, date)
	}

	return allDates, nil
}
