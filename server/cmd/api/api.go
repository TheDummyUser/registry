// server/cmd/api/api.go
package api

import (
	"database/sql"

	"github.com/TheDummyUser/server/routes/user"
	"github.com/gofiber/fiber/v2"
)

// NewServe initializes the Fiber app and routes
func NewServe(address string, db *sql.DB) *fiber.App {
	app := fiber.New()

	// Initialize routes
	SetupRoutes(app, db)

	return app
}

// SetupRoutes sets up the routes for your application
func SetupRoutes(app *fiber.App, db *sql.DB) {
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("Server is up and running!")
	})
	user.SetUpRoutes(app, db)
}
