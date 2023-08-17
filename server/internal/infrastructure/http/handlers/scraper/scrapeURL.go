package diffbot

import (
	"net/http"

	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

func (h *httpHandler) scrapeURL(w http.ResponseWriter, r *http.Request) {
	_, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	urlTobeScraped := r.URL.Query().Get("url")
	if urlTobeScraped == "" {

		// if urlTobeScraped == "" || helper.IsValidURL(urlTobeScraped) {
		h.logger.Error("invalid URL entered", "error", "the entered url is either empty or invalid url format")
		errorx.Render(w, errorx.Parser(errorx.GetMessage("the entered url is invalid", http.StatusBadRequest)))
		return
	}

	response, err := h.scraper.ScrapeURL(urlTobeScraped)
	if err != nil {
		h.logger.Error("error in scraping url", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("error in fetching details", http.StatusInternalServerError)))
		return
	}

	renderx.JSON(w, http.StatusOK, response)
}
