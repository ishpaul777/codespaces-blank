package images

import (
	"github.com/factly/tagore/server/internal/domain/services"
	"github.com/factly/tagore/server/pkg/logger"
	"github.com/go-chi/chi"
)

type httpHandler struct {
	logger       logger.ILogger
	imageService services.ImageService
}

func (h *httpHandler) routes() chi.Router {
	router := chi.NewRouter()
	router.Post("/", h.generateImages)
	return router
}

func InitRoutes(router *chi.Mux, imageService services.ImageService, logger logger.ILogger) {
	httpHandler := &httpHandler{imageService: imageService, logger: logger}
	router.Mount("/images", httpHandler.routes())
}
