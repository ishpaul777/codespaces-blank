package helper

import "regexp"

func IsValidURL(email string) bool {
	// Regular expression to validate email addresses
	pattern := `^(https?|ftp)://[^\s/$.?#].[^\s]*$`

	match, _ := regexp.MatchString(pattern, email)
	return match
}
