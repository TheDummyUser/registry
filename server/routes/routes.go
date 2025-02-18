package routes

import (
	"github.com/TheDummyUser/registry/routes/handlers"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func SetupRoutes(app *fiber.App, db *gorm.DB) {
	api := app.Group("/api")

	// Pass db to handlers
	api.Get("/users", func(c *fiber.Ctx) error {
		return handlers.GetUsers(c, db)
	})
	api.Post("/signup", func(c *fiber.Ctx) error {
		return handlers.Signup(c, db)
	})

	api.Post("/login", func(c *fiber.Ctx) error {
		return handlers.Login(c, db)
	})

	api.Post("/checktimer", func(c *fiber.Ctx) error {
		return handlers.CheckTimer(c, db)
	})

	api.Post("/stoptimer", func(c *fiber.Ctx) error {
		return handlers.EndTimer(c, db)
	})

	api.Post("/starttimer", func(c *fiber.Ctx) error {
		return handlers.StartTimer(c, db)
	})

	api.Post("/leaves", func(c *fiber.Ctx) error {
		return handlers.UserLeaveList(c, db)
	})
}
