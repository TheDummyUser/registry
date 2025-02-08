package main

import (
	"log"

	"github.com/TheDummyUser/registry/cdm/api"
	"github.com/TheDummyUser/registry/database"
)

func main() {

	db, err := database.ConnectDb()
	if err != nil {
		log.Fatal("Database connection failed")
	}

	cfg := api.NewServer(db)

	cfg.Listen(":8080")

	if err := cfg.Listen(":8080"); err != nil {
		panic(err)
	}
}
