package database

import (
	"log"

	"github.com/TheDummyUser/registry/config"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func ConnectDb() (*gorm.DB, error) { // Return (*gorm.DB, error)
	dsn := config.Envs.GetDSN()
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Printf("Failed to connect to db: %v", err)
		return nil, err // Return both nil and the error
	}

	return db, nil // Return the database instance and nil for error
}
