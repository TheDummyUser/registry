package database

import (
	"log"

	"github.com/TheDummyUser/registry/config"
	"github.com/TheDummyUser/registry/model"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func ConnectDb() (*gorm.DB, error) {
	dsn := config.Envs.GetDSN()
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Printf("Failed to connect to db: %v", err)
		return nil, err
	}

	err = db.AutoMigrate(&model.User{}, &model.Timer{}, &model.Leave{}, &model.Team{}, &model.RefreshToken{})
	if err != nil {
		log.Fatalf("migration failed: %v", err)
	}

	log.Println("database sucessfully migrated")
	return db, nil
}
