// server/cmd/api/api.go
package api

import (
	"database/sql"

	"github.com/TheDummyUser/server/routes"
	"github.com/gofiber/fiber/v2"
)

// NewServe initializes the Fiber app and routes
func NewServe(address string, db *sql.DB) *fiber.App {
	app := fiber.New()

	// Initialize routes
	routes.SetupRoutes(app, db)

	return app
}
