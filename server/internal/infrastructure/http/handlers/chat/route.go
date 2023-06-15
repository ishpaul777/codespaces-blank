package chat

import (
	"github.com/factly/tagore/server/internal/domain/services"
	"github.com/factly/tagore/server/pkg/logger"
	"github.com/go-chi/chi"
)

// Route - Group of chat router
type httpHandler struct {
	chatService services.ChatService
	logger      logger.ILogger
}

func (h *httpHandler) chatRoutes() chi.Router {
	router := chi.NewRouter()
	router.Post("/completions", h.createChatResponse)
	router.Get("/history", h.getAllChatsByUser)
	router.Delete("/{chat_id}", h.deleteChat)
	router.Put("/collections", h.addChatToCollection)

	return router
}

func (h *httpHandler) chatCollectionRoutes() chi.Router {
	router := chi.NewRouter()

	router.Post("/", h.createChatCollection)
	router.Get("/", h.getAllChatCollectionsByUser)
	router.Route("/{chat_collection_id}", func(r chi.Router) {
		r.Get("/", h.getChatCollectionByID)
		r.Delete("/", h.deleteChatCollection)
		r.Put("/", h.updatChatColByID)
	})

	return router
}

func InitRoutes(router *chi.Mux, chatService services.ChatService, logger logger.ILogger) {
	httpHandler := &httpHandler{
		chatService: chatService,
		logger:      logger,
	}
	router.Mount("/chat", httpHandler.chatRoutes())
	router.Mount("/chat_collections", httpHandler.chatCollectionRoutes())

}
