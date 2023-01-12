package text

import (
	"net/http"

	"github.com/go-chi/chi"
)

func Router() http.Handler {
	r := chi.NewRouter()

	r.Post("/generate", generate)
	r.Post("/edit", edit)
	return r
}
