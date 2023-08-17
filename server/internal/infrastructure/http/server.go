package http

import (
	"encoding/json"
	"fmt"
	"net/http"

	application "github.com/factly/tagore/server/app"
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/internal/domain/services"
	"github.com/factly/tagore/server/internal/infrastructure/http/handlers/chat"
	"github.com/factly/tagore/server/internal/infrastructure/http/handlers/documents"
	"github.com/factly/tagore/server/internal/infrastructure/http/handlers/images"
	"github.com/factly/tagore/server/internal/infrastructure/http/handlers/persona"
	"github.com/factly/tagore/server/internal/infrastructure/http/handlers/prompt_templates"
	"github.com/factly/tagore/server/internal/infrastructure/http/handlers/prompts"
	scraperHandler "github.com/factly/tagore/server/internal/infrastructure/http/handlers/scraper"
	"github.com/factly/tagore/server/internal/infrastructure/http/handlers/usage"
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
	personaRepository, err := repositories.NewPersonaRepository(db)
	if err != nil {
		logger.Fatal("error creating persona repository")
	}

	usageRepository, err := repositories.NewUsageRepository(db)
	if err != nil {
		logger.Fatal("error creating usage repository")
	}

	promptService := services.NewPromptService(promptRepository, app.GetPubSub())
	documentService := services.NewDocumentService(documentRepository)
	imageService := services.NewImageService(imageRepository)
	chatService := services.NewChatService(chatRepository, app.GetPubSub())
	promptTemplateService := services.NewPromptTemplateService(promptTemplateRepository)
	personaService := services.NewPersonaService(personaRepository, app.GetPubSub())

	usageService := services.NewUsageService(usageRepository)

	scraperService := services.NewScraperService(cfg.Scraper.URL, cfg.Scraper.Token)

	prompts.InitRoutes(router, promptService, logger)
	documents.InitRoutes(router, documentService, logger)
	images.InitRoutes(router, imageService, logger)
	chat.InitRoutes(router, chatService, logger)
	prompt_templates.InitRoutes(router, promptTemplateService, logger)
	persona.InitRoutes(router, personaService, logger)
	usage.InitRoutes(router, usageService, logger)
	scraperHandler.InitRoutes(router, logger, scraperService)
	go func() {
		pubsub := app.GetPubSub()
		pubsub.Subscribe("tagore.usage", func(data []byte) {
			usageData := models.RequestUsage{}
			json.Unmarshal(data, &usageData)
			switch usageData.Type {
			case "generate-text":
				err := usageService.SaveGenerateUsage(usageData.UserID, usageData.Payload)
				if err != nil {
					logger.Error("error in saving the generate-text user details", "error", err.Error())
				}

			case "generate-chat":
				err := usageService.SaveChatUsage(usageData.UserID, usageData.Payload)
				if err != nil {
					logger.Error("error in saving the generate-chat user details", "error", err.Error())
				}

			case "generate-persona-chat":
				err := usageService.SavePersonaUsage(usageData.UserID, usageData.Payload)
				if err != nil {
					logger.Error("error in saving the generate-persona user details", "error", err.Error())
				}
			default:
				logger.Error("unknown usage type")
			}

		})
	}()

	err = http.ListenAndServe(fmt.Sprintf(":%s", cfg.Server.Port), router)
	if err != nil {
		logger.Fatal(fmt.Sprintf("error starting HTTP server: %s", err.Error()))
	}
}
