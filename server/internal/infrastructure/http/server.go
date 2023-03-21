package http

import (
	"fmt"
	"net/http"

	application "github.com/factly/tagore/server/app"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/internal/domain/services"
	"github.com/factly/tagore/server/internal/infrastructure/http/handlers/prompts"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

// RunHTTPServer starts the HTTP server using chi router
func RunHTTPServer(app *application.App) {
	logger := app.GetLogger()
	cfg := app.GetConfig()
	db := app.GetDB()
	logger.Info("Starting HTTP server on PORT: " + cfg.Server.Port)
	router := chi.NewRouter()
	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(logger.GetHTTPMiddleWare())

	// register prompt routes
	promptRepository, err := repositories.NewPromptRepository(db)
	if err != nil {
		logger.Fatal("error creating prompt repository")
	}
	promptService := services.NewPromptService(promptRepository)

	prompts.InitRoutes(router, promptService, logger)

	err = http.ListenAndServe(fmt.Sprintf(":%s", cfg.Server.Port), router)
	if err != nil {
		logger.Fatal(fmt.Sprintf("error starting HTTP server: %s", err.Error()))
	}
}
