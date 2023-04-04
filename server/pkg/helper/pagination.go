package helper

import (
	"net/http"
	"strconv"
)

type Pagination struct {
	Page        int
	Limit       int
	SearchQuery string
}

// GetPagination returns pagination object
func GetPagination(r *http.Request) (*Pagination, error) {
	pagination := &Pagination{}
	var err error
	page := r.URL.Query().Get("page")
	if page == "" {
		pagination.Page = 1
	} else {
		pagination.Page, err = strconv.Atoi(page)
		if err != nil {
			return nil, err
		}
	}

	limit := r.URL.Query().Get("limit")
	if limit == "" {
		pagination.Limit = 12
	} else {
		pagination.Limit, err = strconv.Atoi(limit)
		if err != nil {
			return nil, err
		}
	}

	pagination.SearchQuery = r.URL.Query().Get("search_query")

	return pagination, nil
}
