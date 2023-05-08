package helper

import "strconv"

// StringToInt converts string to integer
// It returns integer if the passed string can be parsed into integer
// Otherwise it returns an error
func StringToInt(s string) (int, error) {
	return strconv.Atoi(s)
}

func StringToFloat32(s string) (float32, error) {
	f, err := strconv.ParseFloat(s, 32)
	return float32(f), err
}
