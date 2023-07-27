package usage

import (
	"net/http"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

func (h *httpHandler) getUsage(w http.ResponseWriter, r *http.Request) {
	uID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error converting user id to int", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	// fetching filters from the request
	filters := new(models.GetUsageFilters)
	filters.TargetMonth = r.URL.Query().Get("target_month")
	filters.Type = r.URL.Query().Get("type")
	filters.Model = r.URL.Query().Get("model")
	filters.Provider = r.URL.Query().Get("provider")

	usage, err := h.usageService.GetUsageByUserID(uID, *filters)
	if err != nil {
		h.logger.Error("error getting usage", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DBError()))
		return
	}

	renderx.JSON(w, http.StatusOK, usage)
}
