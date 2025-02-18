package api

import (
	"github.com/TheDummyUser/registry/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"gorm.io/gorm"
)

func NewServer(db *gorm.DB) *fiber.App {
	app := fiber.New()
	app.Use(
		cors.New(
			cors.Config{
				AllowOrigins: "*",
				AllowHeaders: "Origin, Content-Type, Accept",
				AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
			},
		),
	)

	routes.SetupRoutes(app, db)
	return app
}
