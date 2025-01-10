package db

import (
	"database/sql"
	"log"

	"github.com/go-sql-driver/mysql"
)

func NewMySqlStorage(config mysql.Config) (*sql.DB, error) {
	db, err := sql.Open("mysql", config.FormatDSN())

	if err != nil {
		log.Fatal("failed to connect to database:", err)
		return nil, err
	}

	err = db.Ping()

	if err != nil {
		log.Fatal("failed to ping databse:", err)
		return nil, err
	}
	log.Println("sucessfully connected to mysql database!")
	return db, nil
}
