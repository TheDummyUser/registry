package main

import (
	"log"

	"github.com/TheDummyUser/server/cmd/api"
	"github.com/TheDummyUser/server/config"
	"github.com/TheDummyUser/server/db"
	"github.com/go-sql-driver/mysql"
)

func main() {
	cfg := mysql.Config{
		User:                 config.Envs.DBUser,
		Addr:                 config.Envs.DBAddress,
		DBName:               config.Envs.DBName,
		Net:                  "tcp",
		AllowNativePasswords: true,
		ParseTime:            true,
	}

	db, err := db.NewMySqlStorage(cfg)

	if err != nil {
		log.Fatal("error init mysql storrage", err)
	}

	apiConfig := api.NewServe(":8080", db)

	if err := apiConfig.Listen(":8080"); err != nil {
		log.Fatal("error running server:", err)
	}
}
