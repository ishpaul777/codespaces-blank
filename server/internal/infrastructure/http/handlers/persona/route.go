package persona

import (
	"github.com/factly/tagore/server/internal/domain/services"
	"github.com/factly/tagore/server/pkg/logger"
	"github.com/go-chi/chi"
)

type httpHandler struct {
	personaService services.PersonaService
	logger         logger.ILogger
}

func (h *httpHandler) routes() chi.Router {
	router := chi.NewRouter()
	router.Post("/", h.create)
	router.Get("/", h.list)
	router.Get("/default", h.getDefaultPersona)
	router.Route("/{persona_id}", func(r chi.Router) {
		r.Get("/", h.details)
		r.Put("/", h.update)
		r.Delete("/", h.delete)
		r.Mount("/chats", h.chatRoutes())
	})
	return router
}

func (h *httpHandler) chatRoutes() chi.Router {
	router := chi.NewRouter()
	router.Post("/", h.createChat)
	router.Get("/", h.getPersonaChatsByUserID)
	router.Route("/{chat_id}", func(r chi.Router) {
		r.Get("/", h.getPersonaChatByID)
		r.Delete("/", h.deletePersonaChatByID)
	})
	return router
}
func InitRoutes(router *chi.Mux, personaService services.PersonaService, logger logger.ILogger) {
	httpHandler := &httpHandler{personaService: personaService, logger: logger}
	router.Mount("/personas", httpHandler.routes())
}
