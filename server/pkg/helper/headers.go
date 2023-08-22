package helper

import (
	"net/http"
	"strconv"
)

func GetUserID(req *http.Request) (uint, error) {
	userID := req.Header.Get("X-User")
	uID, err := strconv.Atoi(userID)
	if err != nil {
		return 0, err
	}
	return uint(uID), nil
}

func GetOrgID(req *http.Request) (uint, error) {
	orgID := req.Header.Get("X-Organisation")
	oID, err := strconv.Atoi(orgID)
	if err != nil {
		return 0, err
	}

	return uint(oID), err
}
