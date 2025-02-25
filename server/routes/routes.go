package routes

import (
	"github.com/TheDummyUser/registry/middleware"
	"github.com/TheDummyUser/registry/routes/handlers"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func SetupRoutes(app *fiber.App, db *gorm.DB) {
	api := app.Group("/api")
	// Public routes
	api.Post("/login", func(c *fiber.Ctx) error {
		return handlers.Login(c, db)
	})
	api.Post("/signup", func(c *fiber.Ctx) error {
		return handlers.Signup(c, db)
	})

	// Protected routes (require authentication)
	protected := api.Group("", middleware.Protected())

	// User timer routes - available to all authenticated users
	protected.Post("/checktimer", func(c *fiber.Ctx) error {
		return handlers.CheckTimer(c, db)
	})
	protected.Post("/starttimer", func(c *fiber.Ctx) error {
		return handlers.StartTimer(c, db)
	})
	protected.Post("/stoptimer", func(c *fiber.Ctx) error {
		return handlers.EndTimer(c, db)
	})

	// User leave routes - available to all authenticated users
	protected.Post("/leaves", func(c *fiber.Ctx) error {
		return handlers.UserLeaveList(c, db)
	})
	protected.Post("/applyleaves", func(c *fiber.Ctx) error {
		return handlers.ApplyLeave(c, db)
	})

	// Admin-only routes
	adminRoutes := protected.Group("", middleware.AdminOnly(db))
	adminRoutes.Get("/users", func(c *fiber.Ctx) error {
		return handlers.GetUsers(c, db)
	})

	// Add other admin-only routes here, for example:
	// adminRoutes.Get("/all-leaves", func(c *fiber.Ctx) error {
	//     return handlers.GetAllLeaves(c, db)
	// })
}
