package user

import (
	"net/http"

	"github.com/TheDummyUser/server/types"
	"github.com/TheDummyUser/server/utils"
	"github.com/gorilla/mux"
)

type Handler struct {
}

func NewHandler() *Handler {
	return &Handler{}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/login", h.handleLogin).Methods("post")
	router.HandleFunc("/register", h.handleRegister).Methods("post")
}

func (h *Handler) handleLogin(w http.ResponseWriter, r *http.Request) {
	// Your login code here
}

func (h *Handler) handleRegister(w http.ResponseWriter, r *http.Request) {
	var payload types.RegisterUserPayload
	if err := utils.ParseJson(r, &payload); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

}
