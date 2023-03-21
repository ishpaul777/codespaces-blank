package prompts

import (
	"github.com/factly/tagore/server/internal/domain/services"
	"github.com/factly/tagore/server/pkg/logger"
	"github.com/go-chi/chi"
)

type httpHandler struct {
	promptService services.PromptService
	logger        logger.ILogger
}

func (h *httpHandler) routes() chi.Router {
	router := chi.NewRouter()
	router.Post("/generate", h.generateText)
	return router
}

func InitRoutes(router *chi.Mux, promptService services.PromptService, logger logger.ILogger) {
	httpHandler := &httpHandler{promptService: promptService, logger: logger}
	router.Mount("/prompts", httpHandler.routes())
}
