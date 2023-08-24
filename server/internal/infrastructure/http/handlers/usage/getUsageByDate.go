package usage

import (
	"net/http"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

func (h *httpHandler) getUsageByDate(w http.ResponseWriter, r *http.Request) {
	uID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error converting user id to int", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	orgID, err := helper.GetOrgID(r)
	if err != nil {
		h.logger.Error("error in parsing X-Organisation header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-Organisation header", http.StatusUnauthorized)))
		return
	}

	// fetching filters from the request
	filters := new(models.GetUsageDateFilters)
	filters.TargetDate = r.URL.Query().Get("target_date")
	filters.Type = r.URL.Query().Get("type")
	filters.Model = r.URL.Query().Get("model")
	filters.Provider = r.URL.Query().Get("provider")
	filters.UsageType = models.StatisticType(r.URL.Query().Get("usage_type"))
	filters.IsAdmin = r.URL.Query().Get("is_admin") == "true"
	filters.View = models.View(r.URL.Query().Get("view"))

	otherUserIDstr := r.URL.Query().Get("other_user_id")
	if otherUserIDstr != "" {
		otherUserID, err := helper.StringToInt(otherUserIDstr)
		if err != nil {
			h.logger.Error("error converting other user id to int", "error", err.Error())
			errorx.Render(w, errorx.Parser(errorx.DecodeError()))
			return
		}
		filters.OtherUserID = uint(otherUserID)
	}

	response, err := h.usageService.GetUsageByDate(uID, orgID, *filters)
	if err != nil {
		h.logger.Error("error getting usage", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DBError()))
		return
	}

	renderx.JSON(w, http.StatusOK, response)
}
