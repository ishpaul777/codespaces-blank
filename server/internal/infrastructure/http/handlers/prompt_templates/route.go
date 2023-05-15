package prompt_templates

import (
	"github.com/factly/tagore/server/internal/domain/services"
	"github.com/factly/tagore/server/pkg/logger"
	"github.com/go-chi/chi"
)

type httpHandler struct {
	promptTemplateService services.PromptTemplateService
	logger                logger.ILogger
}

func (h *httpHandler) routes() chi.Router {
	router := chi.NewRouter()
	return router
}

func InitRoutes(router *chi.Mux, documentService services.PromptTemplateService, logger logger.ILogger) {
	httpHandler := &httpHandler{documentService, logger}
	router.Mount("/prompt_templates", httpHandler.routes())
}
