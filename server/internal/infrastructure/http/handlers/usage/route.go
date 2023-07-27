package usage

import (
	"github.com/factly/tagore/server/internal/domain/services"
	"github.com/factly/tagore/server/pkg/logger"
	"github.com/go-chi/chi"
)

type httpHandler struct {
	usageService services.UsageService
	logger       logger.ILogger
}

func (h *httpHandler) routes() chi.Router {
	router := chi.NewRouter()
	router.Get("/", h.getUsage)
	return router
}

func InitRoutes(router *chi.Mux, usageService services.UsageService, logger logger.ILogger) {
	httpHandler := &httpHandler{
		usageService: usageService,
		logger:       logger,
	}
	router.Mount("/usage", httpHandler.routes())
}
