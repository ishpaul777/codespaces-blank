package helper

import "strconv"

// StringToInt converts string to integer
// It returns integer if the passed string can be parsed into integer
// Otherwise it returns an error
func StringToInt(s string) (int, error) {
	return strconv.Atoi(s)
}
