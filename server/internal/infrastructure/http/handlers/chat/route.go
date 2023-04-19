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

func (h *httpHandler) routes() chi.Router {
	router := chi.NewRouter()
	router.Post("/completions", h.createChatResponse)
	return router
}

func InitRoutes(router *chi.Mux, chatService services.ChatService, logger logger.ILogger) {
	httpHandler := &httpHandler{
		chatService: chatService,
		logger:      logger,
	}
	router.Mount("/chat", httpHandler.routes())
}
