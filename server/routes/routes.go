package routes

import (
	"database/sql"

	"github.com/TheDummyUser/server/routes/timer"
	"github.com/TheDummyUser/server/routes/user"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, db *sql.DB) {
	user.SetUpRoutes(app, db)
	timer.SetUpRoutes(app, db)
}
