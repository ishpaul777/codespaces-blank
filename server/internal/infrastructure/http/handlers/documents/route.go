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
	// router.Get("/", h.getDocuments)
	// router.Route("/{document_id}", func(r chi.Router) {
	// 	r.Get("/", h.getDocument)
	// 	r.Put("/", h.updateDocument)
	// 	r.Delete("/", h.deleteDocument)
	// })
	return router
}

func InitRoutes(router *chi.Mux, documentService services.DocumentService, logger logger.ILogger) {
	httpHandler := &httpHandler{documentService: documentService, logger: logger}
	router.Mount("/documents", httpHandler.routes())
}
