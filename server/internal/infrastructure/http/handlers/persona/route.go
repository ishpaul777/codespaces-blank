package persona

import (
	"github.com/factly/tagore/server/internal/domain/services"
	"github.com/factly/tagore/server/pkg/logger"
	"github.com/go-chi/chi"
)

type htttHandler struct {
	personaService services.PersonaService
	logger         logger.ILogger
}

func (h *htttHandler) routes() chi.Router {
	router := chi.NewRouter()
	router.Post("/", h.create)
	router.Get("/", h.list)
	router.Route("/{persona_id}", func(r chi.Router) {
		r.Get("/", h.details)
		r.Put("/", h.update)
		r.Delete("/", h.delete)
	})
	return router
}

func InitRoutes(router *chi.Mux, personaService services.PersonaService, logger logger.ILogger) {
	httpHandler := &htttHandler{personaService: personaService, logger: logger}
	router.Mount("/personas", httpHandler.routes())
}
