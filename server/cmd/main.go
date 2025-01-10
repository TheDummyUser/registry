package main

import "github.com/gofiber/fiber/v2"

type ReferenceJson struct {
	Message string `json:"messahe"`
}

func main() {
	app := fiber.New()

	app.Get("/ping", func(c *fiber.Ctx) error {
		return c.JSON(
			fiber.Map{"Message": "pong"},
		)
	})

	app.Listen(":8080")
}
