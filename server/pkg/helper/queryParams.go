package helper

import "net/http"

func GetQueryParamByName(r *http.Request, name string) string {
	return r.URL.Query().Get(name)
}
