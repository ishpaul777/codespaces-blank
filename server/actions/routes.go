package actions

import (
	"net/http"

	"github.com/factly/tagore-server/actions/text"
	"github.com/factly/x/loggerx"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

func RegisterRoutes() http.Handler {
	loggerx.Info("Setting up routes")
	r := chi.NewRouter()

	// adding middlewares to the route
	r.Use(middleware.RequestID)
	r.Use(loggerx.Init())
	r.Use(middleware.RealIP)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Heartbeat("/ping"))

	// Mounting the routes
	r.Mount("/text", text.Router()) // text-related request handlers

	return r
}
