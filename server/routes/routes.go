package routes

import (
	"github.com/TheDummyUser/registry/handlers"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func SetupRoutes(app *fiber.App, db *gorm.DB) {
	api := app.Group("/api")

	// Pass db to handlers
	api.Get("/users", func(c *fiber.Ctx) error {
		return handlers.GetUsers(c, db)
	})
}
