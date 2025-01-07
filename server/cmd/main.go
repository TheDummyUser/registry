package main

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/TheDummyUser/server/cmd/api"
	"github.com/TheDummyUser/server/config"
	"github.com/TheDummyUser/server/db"
	"github.com/go-sql-driver/mysql"
)

func main() {
	db, err := db.NewMySQLStorage(mysql.Config{
		User:                 config.Envs.DBUser,
		Addr:                 config.Envs.DBAddress,
		DBName:               config.Envs.DBName,
		Net:                  "tcp",
		AllowNativePasswords: true,
		ParseTime:            true,
	})

	initStorage(db)

	if err != nil {
		log.Fatal(err)
	}

	config := api.NewServe(":8080", db)
	if err := config.Run(); err != nil {
		fmt.Print(err)
	}
}

func initStorage(db *sql.DB) {
	err := db.Ping()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Print("sucessfully connected to database\n")
}
