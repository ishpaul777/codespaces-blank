package diffbot

import (
	"github.com/factly/tagore/server/internal/domain/services"
	"github.com/factly/tagore/server/pkg/logger"
	"github.com/go-chi/chi"
)

type httpHandler struct {
	logger  logger.ILogger
	scraper services.IScraper
}

func (h *httpHandler) routes() chi.Router {
	router := chi.NewRouter()
	router.Get("/", h.scrapeURL)
	return router
}

func InitRoutes(router *chi.Mux, logger logger.ILogger, scraper services.IScraper) {
	httpHandler := &httpHandler{
		logger:  logger,
		scraper: scraper,
	}
	router.Mount("/scrape", httpHandler.routes())
}
