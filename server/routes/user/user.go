package user

import (
	"database/sql"
	"log"

	"github.com/TheDummyUser/server/services"
	"github.com/gofiber/fiber/v2"
)

func SetUpRoutes(app *fiber.App, db *sql.DB) {
	app.Post("/register", func(c *fiber.Ctx) error {
		return SignUp(c, db)
	})
}

func SignUp(c *fiber.Ctx, db *sql.DB) error {
	var user struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":  "Invalid request format",
			"status": fiber.StatusBadRequest,
		})
	}

	var existingUser struct {
		Username string
	}

	err := db.QueryRow("SELECT username FROM users WHERE username = ?", user.Username).Scan(&existingUser.Username)
	if err != nil {
		if err != sql.ErrNoRows {
			log.Printf("Database error checking username: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error":  "Internal server error",
				"status": fiber.StatusInternalServerError,
			})
		}

	} else {
		// Username was found
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error":  "Username already exists",
			"status": fiber.StatusConflict,
		})
	}

	hashPassword, err := services.HashPassword(user.Password)
	if err != nil {
		log.Printf("Error in password hashing: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Internal server error",
			"status": fiber.StatusInternalServerError,
		})
	}

	_, err = db.Exec("INSERT INTO users (username, password) VALUES (?, ?)", user.Username, hashPassword)
	if err != nil {
		log.Printf("Error inserting user: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Internal server error",
			"status": fiber.StatusInternalServerError,
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "User created successfully",
		"status":  fiber.StatusCreated,
	})
}
