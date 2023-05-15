package http

import (
	"fmt"
	"net/http"

	application "github.com/factly/tagore/server/app"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/internal/domain/services"
	"github.com/factly/tagore/server/internal/infrastructure/http/handlers/chat"
	"github.com/factly/tagore/server/internal/infrastructure/http/handlers/documents"
	"github.com/factly/tagore/server/internal/infrastructure/http/handlers/images"
	"github.com/factly/tagore/server/internal/infrastructure/http/handlers/prompt_templates"
	"github.com/factly/tagore/server/internal/infrastructure/http/handlers/prompts"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
)

// RunHTTPServer starts the HTTP server using chi router
func RunHTTPServer(app *application.App) {
	logger := app.GetLogger()
	cfg := app.GetConfig()
	db := app.GetDB()
	logger.Info("Starting HTTP server on PORT: " + cfg.Server.Port)
	router := chi.NewRouter()
	router.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "X-User"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(logger.GetHTTPMiddleWare())

	// register prompt routes
	promptRepository, err := repositories.NewPromptRepository(db)
	if err != nil {
		logger.Fatal("error creating prompt repository")
	}

	documentRepository, err := repositories.NewDocumentRepository(db)
	if err != nil {
		logger.Fatal("error creating document repository")
	}

	imageRepository, err := repositories.NewImageRepository(db)
	if err != nil {
		logger.Fatal("error creating image repository")
	}

	chatRepository, err := repositories.NewChatRepository(db)
	if err != nil {
		logger.Fatal("error creating chat repository")
	}

	promptTemplateRepository, err := repositories.NewPromptTemplateRepository(db)
	if err != nil {
		logger.Fatal("error creating prompt template repository")
	}

	promptService := services.NewPromptService(promptRepository)
	documentService := services.NewDocumentService(documentRepository)
	imageService := services.NewImageService(imageRepository)
	chatService := services.NewChatService(chatRepository)
	promptTemplateService := services.NewPromptTemplateService(promptTemplateRepository)

	prompts.InitRoutes(router, promptService, logger)
	documents.InitRoutes(router, documentService, logger)
	images.InitRoutes(router, imageService, logger)
	chat.InitRoutes(router, chatService, logger)
	prompt_templates.InitRoutes(router, promptTemplateService, logger)
	err = http.ListenAndServe(fmt.Sprintf(":%s", cfg.Server.Port), router)
	if err != nil {
		logger.Fatal(fmt.Sprintf("error starting HTTP server: %s", err.Error()))
	}
}
