package user

import (
	"fmt"
	"net/http"

	"github.com/TheDummyUser/server/services/auth"
	"github.com/TheDummyUser/server/types"
	"github.com/TheDummyUser/server/utils"
	"github.com/gorilla/mux"
)

type Handler struct {
	store types.UserStore
}

func NewHandler(store types.UserStore) *Handler {
	return &Handler{
		store: store,
	}
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
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}
	// check if the user exists

	_, err := h.store.GetUserByEmail(payload.Email)

	if err == nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("user Already exists %s email", payload.Email))
		return
	}

	hashedPassword, err := auth.HashPassword(payload.Password)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
	}
	// if user does not exists
	err = h.store.CreateUser(types.User{
		FirstName: payload.FirstName,
		LastName:  payload.LastName,
		Email:     payload.Email,
		Password:  hashedPassword,
	})

	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("error %s", err))
		return
	}

	utils.WriteJson(w, http.StatusCreated, nil)
}
