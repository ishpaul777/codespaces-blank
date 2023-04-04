package documents

import (
	"github.com/factly/tagore/server/internal/domain/services"
	"github.com/factly/tagore/server/pkg/logger"
	"github.com/go-chi/chi"
)

type httpHandler struct {
	documentService services.DocumentService
	logger          logger.ILogger
}

func (h *httpHandler) routes() chi.Router {
	router := chi.NewRouter()
	router.Post("/", h.createNewDocument)
	router.Get("/", h.getAllDocuments)
	router.Route("/{document_id}", func(r chi.Router) {
		r.Get("/", h.getDocumentByID)
		r.Put("/", h.updateDocumentByID)
		r.Delete("/", h.deleteDocumentByID)
	})
	return router
}

func InitRoutes(router *chi.Mux, documentService services.DocumentService, logger logger.ILogger) {
	httpHandler := &httpHandler{documentService: documentService, logger: logger}
	router.Mount("/documents", httpHandler.routes())
}
