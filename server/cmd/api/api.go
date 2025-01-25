// server/cmd/api/api.go
package api

import (
	"database/sql"

	"github.com/TheDummyUser/server/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// NewServe initializes the Fiber app and routes
func NewServe(address string, db *sql.DB) *fiber.App {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders: "Content-Type,Authorization",
	}))
	routes.SetupRoutes(app, db)

	return app
}
