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

func (h *httpHandler) promptTemplateRoutes() chi.Router {
	router := chi.NewRouter()
	router.Post("/", h.createPromptTemplate)
	router.Get("/", h.getAllPromptTemplates)
	router.Route("/{prompt_template_id}", func(r chi.Router) {
		r.Get("/", h.getPromptTemplateByID)
		r.Put("/", h.updatePrompTemplateByID)
		r.Delete("/", h.deletePromptTemplateByID)
	})
	return router
}

func (h *httpHandler) templateCollectionRoutes() chi.Router {
	router := chi.NewRouter()
	router.Post("/", h.createPromptTemplateCollection)
	router.Get("/", h.getAllTemplateCollections)
	router.Route("/{template_collection_id}", func(r chi.Router) {
		r.Get("/", h.getTemplateCollectionByID)
		r.Put("/", h.updateTemplateCollectionByID)
		r.Delete("/", h.deleteTemplateCollectionByID)
	})

	return router
}

func InitRoutes(router *chi.Mux, documentService services.PromptTemplateService, logger logger.ILogger) {
	httpHandler := &httpHandler{documentService, logger}
	router.Mount("/prompt_templates", httpHandler.promptTemplateRoutes())
	router.Mount("/prompt_template_collection", httpHandler.templateCollectionRoutes())
}
