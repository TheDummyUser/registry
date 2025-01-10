package api

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/TheDummyUser/server/services/user"
	"github.com/gorilla/mux"
)

type NewAPIconfig struct {
	address string
	db      *sql.DB
}

func NewServe(address string, db *sql.DB) *NewAPIconfig {
	return &NewAPIconfig{
		address: address,
		db:      db,
	}
}

func (s *NewAPIconfig) Run() error {
	router := mux.NewRouter()
	subrouter := router.PathPrefix("/api/v1").Subrouter()

	userStore := user.NewStore(s.db)

	userHandler := user.NewHandler(userStore)
	userHandler.RegisterRoutes(subrouter)

	fmt.Println("server running on port", s.address)
	return http.ListenAndServe(s.address, router)
}
