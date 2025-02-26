package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID              uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Username        string         `gorm:"size:50;unique;not null" json:"username"`
	Email           string         `gorm:"size:100;unique;not null" json:"email"`
	Password        string         `gorm:"not null" json:"-"`
	DOB             time.Time      `gorm:"not null" json:"dob"`
	IsAdmin         bool           `gorm:"default:false" json:"is_admin"`
	TotalLeaves     uint           `gorm:"default:0" json:"total_leaves"`
	LeavesUsed      uint           `gorm:"default:0" json:"leaves_used"`
	RemainingLeaves uint           `gorm:"default:0" json:"remaining_leaves"`
	CreatedAt       time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt       time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
}

type SignupRequest struct {
	Username string `json:"username" validate:"required,min=3,max=50"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
	DOB      string `json:"dob" validate:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type Timer struct {
	ID        uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    uint           `gorm:"not null" json:"user_id"`
	StartTime time.Time      `gorm:"not null" json:"start_time"`
	EndTime   time.Time      `gorm:"not null" json:"end_time"`
	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type Leave struct {
	ID        uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    uint           `gorm:"not null" json:"user_id"`
	StartDate time.Time      `gorm:"not null" json:"start_date"`
	EndDate   time.Time      `gorm:"not null" json:"end_date"`
	Reason    string         `gorm:"size:255;not null" json:"reason"`
	Status    string         `gorm:"size:50;not null" json:"status"`
	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type LeaveRequest struct {
	StartDate string `json:"start_date" validate:"required"`
	EndDate   string `json:"end_date" validate:"required"`
	Reason    string `json:"reason" validate:"required"`
}
