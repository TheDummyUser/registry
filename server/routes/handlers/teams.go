package handlers

import (
	"github.com/TheDummyUser/registry/model"
	"github.com/TheDummyUser/registry/utils"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func CreateTeam(c *fiber.Ctx, db *gorm.DB) error {
	type TeamRequest struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		UserIDs     []uint `json:"user_ids"` // Add user IDs field
	}

	var req TeamRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request format"})
	}

	// Start transaction
	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Create team
	team := model.Team{
		Name:        req.Name,
		Description: req.Description,
	}
	if err := tx.Create(&team).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create team"})
	}

	// Add users to team if specified
	if len(req.UserIDs) > 0 {
		// Verify all users exist
		var userCount int64
		if err := tx.Model(&model.User{}).Where("id IN ?", req.UserIDs).Count(&userCount).Error; err != nil {
			tx.Rollback()
			return c.Status(400).JSON(fiber.Map{"error": "Invalid user IDs"})
		}

		if userCount != int64(len(req.UserIDs)) {
			tx.Rollback()
			return c.Status(400).JSON(fiber.Map{"error": "Some users not found"})
		}

		// Update users' team association
		if err := tx.Model(&model.User{}).
			Where("id IN ?", req.UserIDs).
			Update("team_id", team.ID).Error; err != nil {
			tx.Rollback()
			return c.Status(500).JSON(fiber.Map{"error": "Failed to add users to team"})
		}
	}

	tx.Commit()
	return c.JSON(fiber.Map{
		"message":        "Team created with users",
		"team":           team,
		"user_ids_added": req.UserIDs,
	})
}

func FetchTeamMates(c *fiber.Ctx, db *gorm.DB) error {
	teamID, err := utils.GetTeamIdFromToken(c)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err, "status_code": fiber.StatusUnauthorized})
	}

	var team model.Team
	if err := db.First(&team, teamID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Team not found"})
	}

	var users []model.User
	if err := db.Where("team_id = ?", teamID).Find(&users).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch team mates"})
	}

	return c.JSON(fiber.Map{
		"team_name":  team.Name,
		"team_mates": users,
	})
}

func GetAllTeams(c *fiber.Ctx, db *gorm.DB) error {
	var teams model.Team
	res := db.Find(&teams)

	if res.Error != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Database error"})
	}

	return c.JSON(teams)
}
